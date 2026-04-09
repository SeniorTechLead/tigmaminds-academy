import { createContext, useContext, useState, useCallback, useEffect, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
// Dynamically import lessons only when saving to Supabase — keeps 1.9MB out of main bundle
const getLessonBySlug = async (slug: string) => {
  const { getLessonBySlug: lookup } = await import('../data/lessons');
  return lookup(slug);
};

// Redirect deleted/renamed slugs to their canonical versions
const SLUG_REDIRECTS: Record<string, string> = {
  'banyan-tree': 'old-banyan-trees-stories',
  'basket-weaver': 'basket-weavers-song',
  'woodpecker-drum': 'woodpeckers-drum',
};

function canonicalSlug(slug: string): string {
  return SLUG_REDIRECTS[slug] || slug;
}

interface LevelDetail {
  viewed?: boolean;         // opened the level tab
  quizScore?: number;       // quiz score (Level 0)
  quizTotal?: number;       // total quiz questions
  miniLessonsSeen?: number; // how many mini-lessons opened (Levels 1-4)
  miniLessonsTotal?: number;
  codeRun?: boolean;        // ran at least one code block
  completedAt?: string;     // when explicitly marked complete
}

interface LessonProgress {
  slug: string;
  levelsCompleted: number[];  // kept for backwards compat
  levels: Record<number, LevelDetail>;  // granular per-level data
  completedAt?: string;
}

interface ProgressContextType {
  progress: Record<string, LessonProgress>;
  markLevelComplete: (slug: string, level: number) => void;
  isLevelComplete: (slug: string, level: number) => boolean;
  isStoryComplete: (slug: string) => boolean;
  getCompletedCount: () => number;
  getTotalHoursCompleted: () => number;
  // Granular tracking
  recordQuizScore: (slug: string, score: number, total: number) => void;
  recordLevelViewed: (slug: string, level: number) => void;
  recordMiniLessonSeen: (slug: string, level: number, seen: number, total: number) => void;
  recordCodeRun: (slug: string, level: number) => void;
  getLevelDetail: (slug: string, level: number) => LevelDetail | undefined;
  getStoryProgress: (slug: string) => number; // 0-100 percentage
  canMarkComplete: (slug: string, level: number) => boolean;
  studentName: string;
  setStudentName: (name: string) => void;
  resetProgress: () => void;
  syncing: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Local storage helpers
function loadLocal(): Record<string, LessonProgress> {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('tma_progress');
    if (!saved) return {};
    // Migrate old format
    const parsed = JSON.parse(saved);
    const migrated: Record<string, LessonProgress> = {};
    for (const [rawSlug, data] of Object.entries(parsed)) {
      const slug = canonicalSlug(rawSlug);
      const d = data as any;
      if (d.levelsCompleted) {
        // Ensure levels field exists (migration from pre-granular format)
        migrated[slug] = { slug, levelsCompleted: d.levelsCompleted, levels: d.levels || {}, completedAt: d.completedAt };
      } else {
        // Very old format: level1Complete, level2Complete, level3Complete
        const levelsArr: number[] = [];
        if (d.level1Complete) levelsArr.push(1);
        if (d.level2Complete) levelsArr.push(2);
        if (d.level3Complete) levelsArr.push(3);
        migrated[slug] = { slug, levelsCompleted: levelsArr, levels: {}, completedAt: d.completedAt };
      }
    }
    return migrated;
  } catch { return {}; }
}

function saveLocal(progress: Record<string, LessonProgress>) {
  localStorage.setItem('tma_progress', JSON.stringify(progress));
}

async function saveToSupabase(userId: string, slug: string, progress: LessonProgress) {
  const lesson = await getLessonBySlug(slug);
  if (!lesson) {
    console.error(`[Progress] Unknown lesson slug: ${slug}`);
    return;
  }
  try {
    const row: Record<string, unknown> = {
      user_id: userId,
      lesson_slug: slug,
      levels_completed: progress.levelsCompleted,
      level_details: progress.levels,
      completed_at: progress.completedAt,
    };
    // Only include lesson_id if the lesson exists in the DB (avoids FK violation for client-only lessons)
    if (lesson.id) row.lesson_id = lesson.id;

    const { error } = await supabase.from('user_progress').upsert(row, { onConflict: 'user_id,lesson_slug' });

    if (error && !error.message.includes('foreign key')) {
      console.error(`[Progress] Failed to save ${slug}:`, error.message);
    }
  } catch (err) {
    console.error(`[Progress] Network error saving ${slug}:`, err);
  }
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(loadLocal);
  const [syncing, setSyncing] = useState(false);
  const [studentName, setStudentNameState] = useState(() => typeof window !== 'undefined' ? localStorage.getItem('tma_student_name') || '' : '');

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name);
    localStorage.setItem('tma_student_name', name);
  }, []);

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const loadFromSupabase = async () => {
      setSyncing(true);
      try {
        const { data, error } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);

        if (error) {
          console.error('[Progress] Failed to load from Supabase:', error.message);
          setSyncing(false);
          return;
        }

        if (data && data.length > 0) {
          const dbProgress: Record<string, LessonProgress> = {};
          for (const row of data) {
            const slug = canonicalSlug(row.lesson_slug);
            dbProgress[slug] = {
              slug,
              levelsCompleted: row.levels_completed || [],
              levels: row.level_details || {},
              completedAt: row.completed_at,
            };
          }
          // Merge: take the union of local and DB progress
          const local = loadLocal();
          const merged: Record<string, LessonProgress> = { ...dbProgress };
          for (const [slug, localP] of Object.entries(local)) {
            if (merged[slug]) {
              const combined = new Set([...merged[slug].levelsCompleted, ...localP.levelsCompleted]);
              merged[slug].levelsCompleted = Array.from(combined).sort();
              // Merge level details — keep the more detailed version per level
              const mergedLevels = { ...merged[slug].levels };
              for (const [lv, detail] of Object.entries(localP.levels || {})) {
                const existing = mergedLevels[lv as any] || {};
                mergedLevels[lv as any] = {
                  viewed: existing.viewed || detail.viewed,
                  quizScore: Math.max(existing.quizScore || 0, detail.quizScore || 0),
                  quizTotal: detail.quizTotal || existing.quizTotal,
                  miniLessonsSeen: Math.max(existing.miniLessonsSeen || 0, detail.miniLessonsSeen || 0),
                  miniLessonsTotal: detail.miniLessonsTotal || existing.miniLessonsTotal,
                  codeRun: existing.codeRun || detail.codeRun,
                  completedAt: existing.completedAt || detail.completedAt,
                };
              }
              merged[slug].levels = mergedLevels;
            } else {
              merged[slug] = localP;
            }
          }
          setProgress(merged);
          saveLocal(merged);

          // Push merged back to Supabase
          for (const [slug, p] of Object.entries(merged)) {
            await saveToSupabase(user.id, slug, p);
          }
        } else {
          // No DB data — push local to Supabase
          const local = loadLocal();
          for (const [slug, p] of Object.entries(local)) {
            await saveToSupabase(user.id, slug, p);
          }
        }

        // Sync student name from profile
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('display_name')
          .eq('id', user.id)
          .maybeSingle();
        if (profile?.display_name) {
          setStudentNameState(profile.display_name);
          localStorage.setItem('tma_student_name', profile.display_name);
        }
      } catch (err) {
        console.error('[Progress] Sync error:', err);
      }
      setSyncing(false);
    };

    loadFromSupabase();
  }, [user]);

  // Helper to update a lesson's progress, persist, and record streak
  const updateLesson = useCallback((slug: string, updater: (p: LessonProgress) => LessonProgress) => {
    setProgress((prev) => {
      const existing = prev[slug] || { slug, levelsCompleted: [], levels: {} };
      const updated = updater(existing);
      const newProgress = { ...prev, [slug]: updated };
      saveLocal(newProgress);
      if (user) {
        saveToSupabase(user.id, slug, updated);
      }
      // Record daily streak on any learning activity
      try {
        const today = new Date().toISOString().slice(0, 10);
        const raw = localStorage.getItem('tma_streak');
        const streak = raw ? JSON.parse(raw) : { current: 0, best: 0, todayDone: false, lastDate: '' };
        if (streak.lastDate !== today) {
          const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
          const current = streak.lastDate === yesterday ? streak.current + 1 : 1;
          const best = Math.max(current, streak.best);
          const next = { current, best, todayDone: true, lastDate: today };
          localStorage.setItem('tma_streak', JSON.stringify(next));
          if (user) {
            supabase.from('user_plans').upsert({
              user_id: user.id, streak_data: next, updated_at: new Date().toISOString(),
            }, { onConflict: 'user_id' }).catch((err) => console.warn('[Progress] Streak save failed:', err));
          }
        }
      } catch {}
      return newProgress;
    });
  }, [user]);

  const markLevelComplete = useCallback((slug: string, level: number) => {
    updateLesson(slug, (p) => {
      const levelsSet = new Set(p.levelsCompleted);
      levelsSet.add(level);
      const levelsCompleted = Array.from(levelsSet).sort();
      const levelDetail = { ...p.levels[level], completedAt: new Date().toISOString() };
      const completedAt = (levelsSet.has(0) && levelsSet.has(1))
        ? p.completedAt || new Date().toISOString()
        : p.completedAt;
      return { ...p, levelsCompleted, levels: { ...p.levels, [level]: levelDetail }, completedAt };
    });
  }, [updateLesson]);

  const recordQuizScore = useCallback((slug: string, score: number, total: number) => {
    updateLesson(slug, (p) => {
      const detail: LevelDetail = { ...p.levels[0], quizScore: score, quizTotal: total, viewed: true };
      // Auto-complete Level 0 if quiz score >= 60%
      const levelsSet = new Set(p.levelsCompleted);
      if (total > 0 && score / total >= 0.6) {
        levelsSet.add(0);
        detail.completedAt = detail.completedAt || new Date().toISOString();
      }
      return { ...p, levelsCompleted: Array.from(levelsSet).sort(), levels: { ...p.levels, [0]: detail } };
    });
  }, [updateLesson]);

  const recordLevelViewed = useCallback((slug: string, level: number) => {
    updateLesson(slug, (p) => {
      const detail: LevelDetail = { ...p.levels[level], viewed: true };
      return { ...p, levels: { ...p.levels, [level]: detail } };
    });
  }, [updateLesson]);

  const recordMiniLessonSeen = useCallback((slug: string, level: number, seen: number, total: number) => {
    updateLesson(slug, (p) => {
      const existing = p.levels[level] || {};
      const detail: LevelDetail = {
        ...existing,
        viewed: true,
        miniLessonsSeen: Math.max(existing.miniLessonsSeen || 0, seen),
        miniLessonsTotal: total,
      };
      return { ...p, levels: { ...p.levels, [level]: detail } };
    });
  }, [updateLesson]);

  const recordCodeRun = useCallback((slug: string, level: number) => {
    updateLesson(slug, (p) => {
      const detail: LevelDetail = { ...p.levels[level], viewed: true, codeRun: true };
      return { ...p, levels: { ...p.levels, [level]: detail } };
    });
  }, [updateLesson]);

  const getLevelDetail = useCallback((slug: string, level: number): LevelDetail | undefined => {
    return progress[slug]?.levels?.[level];
  }, [progress]);

  const canMarkComplete = useCallback((slug: string, level: number): boolean => {
    const detail = progress[slug]?.levels?.[level];
    if (!detail?.viewed) return false;
    if (level === 0) {
      // Level 0: must have attempted quiz with >= 60%
      if (!detail.quizTotal || !detail.quizScore) return false;
      return detail.quizScore / detail.quizTotal >= 0.6;
    }
    // Levels 1-4: must have seen all mini-lessons
    if (detail.miniLessonsTotal && detail.miniLessonsSeen) {
      return detail.miniLessonsSeen >= detail.miniLessonsTotal;
    }
    // Fallback: if we don't know total, just require viewed
    return true;
  }, [progress]);

  const getStoryProgress = useCallback((slug: string): number => {
    const p = progress[slug];
    if (!p) return 0;
    // Weight: Level 0 = 30%, Levels 1-4 = 70% split evenly (17.5% each)
    let pct = 0;
    // Level 0
    const l0 = p.levels?.[0];
    if (l0?.completedAt) pct += 30;
    else if (l0?.quizScore && l0.quizTotal) pct += 15; // attempted quiz
    else if (l0?.viewed) pct += 5; // just viewed

    // Levels 1-4
    for (let lv = 1; lv <= 4; lv++) {
      if (p.levelsCompleted.includes(lv)) {
        pct += 17.5;
      } else {
        const detail = p.levels?.[lv];
        if (detail?.miniLessonsSeen && detail.miniLessonsTotal) {
          pct += 17.5 * (detail.miniLessonsSeen / detail.miniLessonsTotal) * 0.8; // 80% for partial
        } else if (detail?.viewed) {
          pct += 3; // just opened
        }
      }
    }
    return Math.min(100, Math.round(pct));
  }, [progress]);

  const isLevelComplete = useCallback((slug: string, level: number) => {
    return progress[slug]?.levelsCompleted?.includes(level) || false;
  }, [progress]);

  const isStoryComplete = useCallback((slug: string) => {
    const p = progress[slug];
    if (!p) return false;
    // Complete = Level 0 done + at least Level 1 done
    return p.levelsCompleted.includes(0) && p.levelsCompleted.includes(1);
  }, [progress]);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter(p => p.levelsCompleted.includes(0) && p.levelsCompleted.includes(1)).length;
  }, [progress]);

  const getTotalHoursCompleted = useCallback(() => {
    let hours = 0;
    for (const p of Object.values(progress)) {
      hours += p.levelsCompleted.length * 6;
    }
    return hours;
  }, [progress]);

  const resetProgress = useCallback(async () => {
    setProgress({});
    saveLocal({});
    if (user) {
      try {
        const { error } = await supabase.from('user_progress').delete().eq('user_id', user.id);
        if (error) console.error('[Progress] Failed to reset:', error.message);
      } catch (err) {
        console.error('[Progress] Network error on reset:', err);
      }
    }
  }, [user]);

  const value = useMemo(() => ({
    progress, markLevelComplete, isLevelComplete, isStoryComplete,
    getCompletedCount, getTotalHoursCompleted,
    recordQuizScore, recordLevelViewed, recordMiniLessonSeen, recordCodeRun,
    getLevelDetail, getStoryProgress, canMarkComplete,
    studentName, setStudentName, resetProgress, syncing,
  }), [progress, markLevelComplete, isLevelComplete, isStoryComplete,
    getCompletedCount, getTotalHoursCompleted,
    recordQuizScore, recordLevelViewed, recordMiniLessonSeen, recordCodeRun,
    getLevelDetail, getStoryProgress, canMarkComplete,
    studentName, setStudentName, resetProgress, syncing]);

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}

import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

interface LessonProgress {
  slug: string;
  levelsCompleted: number[];
  completedAt?: string;
}

interface ProgressContextType {
  progress: Record<string, LessonProgress>;
  markLevelComplete: (slug: string, level: number) => void;
  isLevelComplete: (slug: string, level: number) => boolean;
  isStoryComplete: (slug: string) => boolean;
  getCompletedCount: () => number;
  getTotalHoursCompleted: () => number;
  studentName: string;
  setStudentName: (name: string) => void;
  resetProgress: () => void;
  syncing: boolean;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

// Local storage helpers
function loadLocal(): Record<string, LessonProgress> {
  try {
    const saved = localStorage.getItem('tma_progress');
    if (!saved) return {};
    // Migrate old format
    const parsed = JSON.parse(saved);
    const migrated: Record<string, LessonProgress> = {};
    for (const [slug, data] of Object.entries(parsed)) {
      const d = data as any;
      if (d.levelsCompleted) {
        migrated[slug] = d;
      } else {
        // Old format: level1Complete, level2Complete, level3Complete
        const levels: number[] = [];
        if (d.level1Complete) levels.push(1);
        if (d.level2Complete) levels.push(2);
        if (d.level3Complete) levels.push(3);
        migrated[slug] = { slug, levelsCompleted: levels, completedAt: d.completedAt };
      }
    }
    return migrated;
  } catch { return {}; }
}

function saveLocal(progress: Record<string, LessonProgress>) {
  localStorage.setItem('tma_progress', JSON.stringify(progress));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(loadLocal);
  const [syncing, setSyncing] = useState(false);
  const [studentName, setStudentNameState] = useState(() => localStorage.getItem('tma_student_name') || '');

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name);
    localStorage.setItem('tma_student_name', name);
  }, []);

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!user) return;

    const loadFromSupabase = async () => {
      setSyncing(true);
      const { data } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id);

      if (data && data.length > 0) {
        const dbProgress: Record<string, LessonProgress> = {};
        for (const row of data) {
          dbProgress[row.lesson_slug] = {
            slug: row.lesson_slug,
            levelsCompleted: row.levels_completed || [],
            completedAt: row.completed_at,
          };
        }
        // Merge: take the union of local and DB progress
        const local = loadLocal();
        const merged: Record<string, LessonProgress> = { ...dbProgress };
        for (const [slug, localP] of Object.entries(local)) {
          if (merged[slug]) {
            // Union of completed levels
            const combined = new Set([...merged[slug].levelsCompleted, ...localP.levelsCompleted]);
            merged[slug].levelsCompleted = Array.from(combined).sort();
          } else {
            merged[slug] = localP;
          }
        }
        setProgress(merged);
        saveLocal(merged);

        // Push merged back to Supabase
        for (const [slug, p] of Object.entries(merged)) {
          await supabase.from('user_progress').upsert({
            user_id: user.id,
            lesson_slug: slug,
            levels_completed: p.levelsCompleted,
            completed_at: p.completedAt,
          }, { onConflict: 'user_id,lesson_slug' });
        }
      } else {
        // No DB data — push local to Supabase
        const local = loadLocal();
        for (const [slug, p] of Object.entries(local)) {
          await supabase.from('user_progress').upsert({
            user_id: user.id,
            lesson_slug: slug,
            levels_completed: p.levelsCompleted,
            completed_at: p.completedAt,
          }, { onConflict: 'user_id,lesson_slug' });
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

      setSyncing(false);
    };

    loadFromSupabase();
  }, [user]);

  const markLevelComplete = useCallback((slug: string, level: number) => {
    setProgress((prev) => {
      const existing = prev[slug] || { slug, levelsCompleted: [] };
      const levels = new Set(existing.levelsCompleted);
      levels.add(level);
      const levelsCompleted = Array.from(levels).sort();
      const completedAt = (levels.has(1) && levels.has(2))
        ? existing.completedAt || new Date().toISOString()
        : existing.completedAt;

      const updated = { slug, levelsCompleted, completedAt };
      const newProgress = { ...prev, [slug]: updated };
      saveLocal(newProgress);

      // Sync to Supabase if authenticated
      if (user) {
        supabase.from('user_progress').upsert({
          user_id: user.id,
          lesson_slug: slug,
          levels_completed: levelsCompleted,
          completed_at: completedAt,
        }, { onConflict: 'user_id,lesson_slug' });
      }

      return newProgress;
    });
  }, [user]);

  const isLevelComplete = useCallback((slug: string, level: number) => {
    return progress[slug]?.levelsCompleted?.includes(level) || false;
  }, [progress]);

  const isStoryComplete = useCallback((slug: string) => {
    const p = progress[slug];
    return p ? p.levelsCompleted.includes(1) && p.levelsCompleted.includes(2) : false;
  }, [progress]);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter(p => p.levelsCompleted.includes(1) && p.levelsCompleted.includes(2)).length;
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
      await supabase.from('user_progress').delete().eq('user_id', user.id);
    }
  }, [user]);

  return (
    <ProgressContext.Provider value={{
      progress, markLevelComplete, isLevelComplete, isStoryComplete,
      getCompletedCount, getTotalHoursCompleted,
      studentName, setStudentName, resetProgress, syncing,
    }}>
      {children}
    </ProgressContext.Provider>
  );
}

export function useProgress() {
  const context = useContext(ProgressContext);
  if (!context) throw new Error('useProgress must be used within ProgressProvider');
  return context;
}

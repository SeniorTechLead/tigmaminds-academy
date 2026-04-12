import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';

/**
 * Tracks completion of prerequisite "basics" courses
 * (Python Basics, Arduino Basics, Web Basics, SQL Basics).
 *
 * Each course has N lessons (0-indexed). We store which lesson indices
 * are completed per course slug.
 *
 * Storage: localStorage ('tma_basics_progress') + Supabase ('basics_progress' table).
 */

export type BasicsCourseSlug = 'python-basics' | 'arduino-basics' | 'web-basics' | 'sql-basics';

interface BasicsProgress {
  /** completed lesson indices per course */
  courses: Record<string, number[]>;
}

interface BasicsProgressContextType {
  /** Mark a lesson complete within a course */
  markLessonComplete: (course: BasicsCourseSlug, lessonIndex: number) => void;
  /** Check if a specific lesson is complete */
  isLessonComplete: (course: BasicsCourseSlug, lessonIndex: number) => boolean;
  /** Get count of completed lessons for a course */
  getCompletedCount: (course: BasicsCourseSlug) => number;
  /** Check if entire course is complete */
  isCourseComplete: (course: BasicsCourseSlug, totalLessons: number) => boolean;
  /** Get completed indices for a course */
  getCompletedLessons: (course: BasicsCourseSlug) => number[];
}

const BasicsProgressContext = createContext<BasicsProgressContextType | undefined>(undefined);

function loadLocal(): BasicsProgress {
  if (typeof window === 'undefined') return { courses: {} };
  try {
    const saved = localStorage.getItem('tma_basics_progress');
    if (!saved) return { courses: {} };
    return JSON.parse(saved);
  } catch { return { courses: {} }; }
}

function saveLocal(progress: BasicsProgress) {
  localStorage.setItem('tma_basics_progress', JSON.stringify(progress));
}

async function saveToSupabase(userId: string, progress: BasicsProgress) {
  try {
    await supabase.from('basics_progress').upsert({
      user_id: userId,
      courses: progress.courses,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (err) {
    console.warn('[BasicsProgress] Supabase save error:', err);
  }
}

export function BasicsProgressProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [data, setData] = useState<BasicsProgress>(loadLocal);

  // Sync from Supabase when user logs in
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data: row } = await supabase
          .from('basics_progress')
          .select('courses')
          .eq('user_id', user.id)
          .single();
        if (row?.courses) {
          // Merge: keep whichever has more completions per course
          setData(prev => {
            const merged: BasicsProgress = { courses: { ...prev.courses } };
            for (const [course, indices] of Object.entries(row.courses as Record<string, number[]>)) {
              const local = new Set(merged.courses[course] || []);
              for (const idx of indices) local.add(idx);
              merged.courses[course] = [...local].sort((a, b) => a - b);
            }
            saveLocal(merged);
            return merged;
          });
        }
      } catch {
        // Table may not exist yet — that's fine
      }
    })();
  }, [user]);

  const persist = useCallback((next: BasicsProgress) => {
    saveLocal(next);
    if (user) saveToSupabase(user.id, next);
  }, [user]);

  const markLessonComplete = useCallback((course: BasicsCourseSlug, lessonIndex: number) => {
    setData(prev => {
      const existing = new Set(prev.courses[course] || []);
      if (existing.has(lessonIndex)) return prev;
      existing.add(lessonIndex);
      const next: BasicsProgress = {
        courses: { ...prev.courses, [course]: [...existing].sort((a, b) => a - b) },
      };
      persist(next);
      return next;
    });
  }, [persist]);

  const isLessonComplete = useCallback((course: BasicsCourseSlug, lessonIndex: number) => {
    return (data.courses[course] || []).includes(lessonIndex);
  }, [data]);

  const getCompletedCount = useCallback((course: BasicsCourseSlug) => {
    return (data.courses[course] || []).length;
  }, [data]);

  const isCourseComplete = useCallback((course: BasicsCourseSlug, totalLessons: number) => {
    return (data.courses[course] || []).length >= totalLessons;
  }, [data]);

  const getCompletedLessons = useCallback((course: BasicsCourseSlug) => {
    return data.courses[course] || [];
  }, [data]);

  return (
    <BasicsProgressContext.Provider value={{ markLessonComplete, isLessonComplete, getCompletedCount, isCourseComplete, getCompletedLessons }}>
      {children}
    </BasicsProgressContext.Provider>
  );
}

export function useBasicsProgress() {
  const ctx = useContext(BasicsProgressContext);
  if (!ctx) throw new Error('useBasicsProgress must be used within BasicsProgressProvider');
  return ctx;
}

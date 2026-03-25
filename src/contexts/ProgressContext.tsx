import { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface LessonProgress {
  slug: string;
  level1Complete: boolean;
  level2Complete: boolean;
  level3Complete: boolean;
  completedAt?: string; // ISO date
}

interface ProgressContextType {
  progress: Record<string, LessonProgress>;
  markLevelComplete: (slug: string, level: 1 | 2 | 3) => void;
  isLevelComplete: (slug: string, level: 1 | 2 | 3) => boolean;
  isStoryComplete: (slug: string) => boolean;
  getCompletedCount: () => number;
  getSubjectProgress: (subject: string) => { completed: number; total: number };
  getTotalHoursCompleted: () => number;
  studentName: string;
  setStudentName: (name: string) => void;
  resetProgress: () => void;
}

const ProgressContext = createContext<ProgressContextType | undefined>(undefined);

function loadProgress(): Record<string, LessonProgress> {
  try {
    const saved = localStorage.getItem('tma_progress');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
}

function saveProgress(progress: Record<string, LessonProgress>) {
  localStorage.setItem('tma_progress', JSON.stringify(progress));
}

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [progress, setProgress] = useState<Record<string, LessonProgress>>(loadProgress);
  const [studentName, setStudentNameState] = useState(() => {
    return localStorage.getItem('tma_student_name') || '';
  });

  const setStudentName = useCallback((name: string) => {
    setStudentNameState(name);
    localStorage.setItem('tma_student_name', name);
  }, []);

  const markLevelComplete = useCallback((slug: string, level: 1 | 2 | 3) => {
    setProgress((prev) => {
      const existing = prev[slug] || { slug, level1Complete: false, level2Complete: false, level3Complete: false };
      const updated = { ...existing };
      if (level === 1) updated.level1Complete = true;
      if (level === 2) updated.level2Complete = true;
      if (level === 3) updated.level3Complete = true;

      // Check if story is now fully complete
      if (updated.level1Complete && updated.level2Complete) {
        updated.completedAt = updated.completedAt || new Date().toISOString();
      }

      const newProgress = { ...prev, [slug]: updated };
      saveProgress(newProgress);
      return newProgress;
    });
  }, []);

  const isLevelComplete = useCallback((slug: string, level: 1 | 2 | 3) => {
    const p = progress[slug];
    if (!p) return false;
    if (level === 1) return p.level1Complete;
    if (level === 2) return p.level2Complete;
    if (level === 3) return p.level3Complete;
    return false;
  }, [progress]);

  const isStoryComplete = useCallback((slug: string) => {
    const p = progress[slug];
    return p ? p.level1Complete && p.level2Complete : false;
  }, [progress]);

  const getCompletedCount = useCallback(() => {
    return Object.values(progress).filter(p => p.level1Complete && p.level2Complete).length;
  }, [progress]);

  const getSubjectProgress = useCallback((subject: string) => {
    // Import lessons dynamically would create circular dep, so we return counts from progress
    const completed = Object.values(progress).filter(p => p.level1Complete && p.level2Complete).length;
    return { completed, total: 80 };
  }, [progress]);

  const getTotalHoursCompleted = useCallback(() => {
    return Object.values(progress).filter(p => p.level1Complete).length * 6 +
           Object.values(progress).filter(p => p.level2Complete).length * 6;
  }, [progress]);

  const resetProgress = useCallback(() => {
    setProgress({});
    saveProgress({});
  }, []);

  return (
    <ProgressContext.Provider value={{
      progress,
      markLevelComplete,
      isLevelComplete,
      isStoryComplete,
      getCompletedCount,
      getSubjectProgress,
      getTotalHoursCompleted,
      studentName,
      setStudentName,
      resetProgress,
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

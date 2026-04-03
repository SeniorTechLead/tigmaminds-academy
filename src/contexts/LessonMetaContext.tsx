import { createContext, useContext, useState, useEffect, useCallback, useMemo, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

interface LessonMeta {
  id: number;
  slug: string;
  is_demo: boolean;
  is_published: boolean;
}

interface LessonMetaContextType {
  isDemoStory: (slug: string) => boolean;
  isPublished: (slug: string) => boolean;
  loading: boolean;
}

const LessonMetaContext = createContext<LessonMetaContextType>({
  isDemoStory: () => false,
  isPublished: () => true,
  loading: true,
});

export function LessonMetaProvider({ children }: { children: ReactNode }) {
  const [demoSlugs, setDemoSlugs] = useState<Set<string> | null>(new Set());
  const [publishedSlugs, setPublishedSlugs] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const { data, error } = await supabase
          .from('lessons')
          .select('slug, is_demo, is_published');

        if (error || !data || data.length === 0) {
          if (error) console.error('[LessonMeta] Failed to load:', error.message);
          setDemoSlugs(null);
          setLoading(false);
          return;
        }

        setDemoSlugs(new Set(data.filter((l: LessonMeta) => l.is_demo).map((l: LessonMeta) => l.slug)));
        setPublishedSlugs(new Set(data.filter((l: LessonMeta) => l.is_published).map((l: LessonMeta) => l.slug)));
      } catch (err) {
        console.error('[LessonMeta] Network error:', err);
        setDemoSlugs(null);
      }
      setLoading(false);
    })();
  }, []);

  const isDemoStory = useCallback(
    (slug: string) => demoSlugs === null || demoSlugs.has(slug),
    [demoSlugs],
  );

  const isPublished = useCallback(
    (slug: string) => publishedSlugs.has(slug),
    [publishedSlugs],
  );

  const value = useMemo(
    () => ({ isDemoStory, isPublished, loading }),
    [isDemoStory, isPublished, loading],
  );

  return (
    <LessonMetaContext.Provider value={value}>
      {children}
    </LessonMetaContext.Provider>
  );
}

export function useLessonMeta() {
  return useContext(LessonMetaContext);
}

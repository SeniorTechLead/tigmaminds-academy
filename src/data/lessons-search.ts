/**
 * Lazy-loaded full-text search index for lessons.
 * The index file is ~800KB and is fetched only when the user
 * focuses a search input. Cached on first load.
 */

export interface LessonSearchEntry {
  slug: string;
  storyTitle: string;
  tagline: string;
  stemTitle: string;
  subjects: string[];
  searchText: string;
  stemSkillsText: string;
}

let cache: LessonSearchEntry[] | null = null;
let inflight: Promise<LessonSearchEntry[]> | null = null;

export async function loadLessonsSearchIndex(): Promise<LessonSearchEntry[]> {
  if (cache) return cache;
  if (inflight) return inflight;
  inflight = import('./lessons-search-index.json').then((mod) => {
    cache = (mod.default ?? mod) as LessonSearchEntry[];
    inflight = null;
    return cache;
  });
  return inflight;
}

export function matchesSearch(entry: LessonSearchEntry, q: string): boolean {
  const ql = q.toLowerCase();
  return (
    entry.storyTitle.toLowerCase().includes(ql) ||
    entry.stemTitle.toLowerCase().includes(ql) ||
    entry.tagline.toLowerCase().includes(ql) ||
    entry.searchText.includes(ql) ||
    entry.stemSkillsText.includes(ql)
  );
}

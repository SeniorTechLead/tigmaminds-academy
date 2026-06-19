import type { Lesson } from './lesson-types';

// The full lesson dataset (lessons.ts) is ~2MB of inline content. Importing it
// statically pulls all of it into the route's first-load JS, which blocks
// hydration. Load it as a separate async chunk on demand instead, so the page
// shell stays interactive while the heavy content streams in.

let cache: Promise<Lesson | undefined> | null = null;
let cachedSlug: string | null = null;

export async function loadLessonBySlug(slug: string): Promise<Lesson | undefined> {
  if (cachedSlug === slug && cache) return cache;
  cachedSlug = slug;
  cache = import('./lessons').then(({ getLessonBySlug }) => getLessonBySlug(slug));
  return cache;
}

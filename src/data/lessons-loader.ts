import type { Lesson } from './lesson-types';
import { loadLesson } from './lessons/registry';

// Each lesson's content lives in its own file (src/data/lessons/<slug>.ts) with a
// dynamic importer in the generated registry. Loading a lesson pulls only that
// lesson's chunk — not the whole ~2MB dataset — and only after the page shell has
// hydrated, so it never blocks interactivity.

export async function loadLessonBySlug(slug: string): Promise<Lesson | undefined> {
  return loadLesson(slug);
}

/**
 * Build-time generator for lessons-meta + lessons-search-index.
 *
 * Produces:
 *   src/data/lessons-meta.json         — light fields for list/card views
 *   src/data/lessons-search-index.json — full searchable text per lesson
 *
 * Run: npx tsx scripts/build-lessons-meta.ts
 * Wired via "prebuild" in package.json.
 */

import { writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { lessons } from '../src/data/lessons';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');
const META_OUT = join(ROOT, 'src', 'data', 'lessons-meta.json');
const SEARCH_OUT = join(ROOT, 'src', 'data', 'lessons-search-index.json');

function stripMarkdown(text: string | undefined): string {
  if (!text) return '';
  return text
    .replace(/\*\*([^*]+)\*\*/g, '$1')
    .replace(/`([^`]+)`/g, '$1')
    .replace(/\[diagram:[^\]]+\]/g, '')
    .replace(/[#*_~`]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function iconName(icon: unknown): string {
  if (!icon) return '';
  // lucide-react icons expose displayName
  const anyIcon = icon as { displayName?: string; name?: string };
  return anyIcon.displayName || anyIcon.name || '';
}

const meta = lessons.map((l) => ({
  id: l.id,
  slug: l.slug,
  storyTitle: l.story.title,
  tagline: l.story.tagline,
  illustration: l.illustration,
  stemTitle: l.stem.title,
  stemDescription: l.stem.description,
  stemColor: l.stem.color,
  stemIcon: iconName(l.stem.icon),
  projectTitle: l.stem.project?.title,
  projectDescription: l.stem.project?.description,
  projectSteps: l.stem.project?.steps,
  subjects: l.subjects ?? [],
  toolSkills: l.toolSkills ?? [],
  skillTags: l.skillTags ?? [],
  estimatedHours: l.estimatedHours ?? 12,
  track: l.track,
  tradition: l.tradition,
  origin: l.origin,
  stemSkills: l.stem.skills,
  hasLevel0: !!l.level0,
}));

const searchIndex = lessons.map((l) => ({
  slug: l.slug,
  storyTitle: l.story.title,
  tagline: l.story.tagline,
  stemTitle: l.stem.title,
  subjects: l.subjects ?? [],
  // Cap story content per lesson to keep index lean
  searchText: stripMarkdown(l.story.content).toLowerCase().slice(0, 4000),
  stemSkillsText: (l.stem.skills || []).join(' ').toLowerCase(),
}));

await writeFile(META_OUT, JSON.stringify(meta));
await writeFile(SEARCH_OUT, JSON.stringify(searchIndex));

const metaKB = (JSON.stringify(meta).length / 1024).toFixed(0);
const searchKB = (JSON.stringify(searchIndex).length / 1024).toFixed(0);
console.log(`Lessons meta built: ${meta.length} lessons, ${metaKB}KB meta + ${searchKB}KB search index`);

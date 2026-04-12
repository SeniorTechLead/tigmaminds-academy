import type { ReferenceSection } from '../data/reference';
import { referenceMeta } from '../data/reference-meta';

// Cache loaded guides to avoid re-importing
const cache: Record<string, any> = {};

/**
 * Look up a specific section from the reference library by its unique ID.
 * Uses dynamic imports — only loads the guide that contains the section.
 * e.g., lookupSection('py-strings') or lookupSection('algo-binary-search')
 */
export async function lookupSection(sectionId: string): Promise<{ section: ReferenceSection; guideTitle: string } | null> {
  // Try each guide — load on demand
  for (const meta of referenceMeta) {
    if (!cache[meta.slug]) {
      try {
        const mod = await import(`../data/reference/${meta.slug}`);
        cache[meta.slug] = mod.guide;
      } catch {
        continue;
      }
    }
    const guide = cache[meta.slug];
    if (!guide) continue;
    const allSections = [...(guide.understand || []), ...(guide.build || [])];
    for (const section of allSections) {
      if (section.id === sectionId) {
        return { section, guideTitle: guide.title };
      }
    }
  }
  return null;
}

/**
 * Synchronous lookup — only searches already-cached guides.
 * Returns null if the guide hasn't been loaded yet.
 */
export function lookupSectionSync(sectionId: string): { section: ReferenceSection; guideTitle: string } | null {
  for (const slug of Object.keys(cache)) {
    const guide = cache[slug];
    if (!guide) continue;
    const allSections = [...(guide.understand || []), ...(guide.build || [])];
    for (const section of allSections) {
      if (section.id === sectionId) {
        return { section, guideTitle: guide.title };
      }
    }
  }
  return null;
}

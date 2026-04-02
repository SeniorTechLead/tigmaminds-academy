import { references, type ReferenceSection } from '../data/reference';

/**
 * Look up a specific section from the reference library by its unique ID.
 * e.g., lookupSection('py-strings') or lookupSection('algo-binary-search')
 */
export function lookupSection(sectionId: string): { section: ReferenceSection; guideTitle: string } | null {
  for (const guide of references) {
    const allSections = [...guide.understand, ...(guide.build || [])];
    for (const section of allSections) {
      if (section.id === sectionId) {
        return { section, guideTitle: guide.title };
      }
    }
  }
  return null;
}

import { references, type ReferenceSection } from '../data/reference';

/**
 * Look up a specific section from the reference library.
 * sectionId format: "section-{guideSlug}-{index}" e.g. "section-python-10"
 */
export function lookupSection(sectionId: string): { section: ReferenceSection; guideTitle: string } | null {
  // Parse: "section-python-10" -> slug="python", index=10
  // Handle multi-word slugs: "section-algorithms-data-structures-6"
  const match = sectionId.match(/^section-(.+)-(\d+)$/);
  if (!match) return null;

  const indexStr = match[2];
  const slug = match[1];
  const index = parseInt(indexStr, 10);

  const guide = references.find(g => g.slug === slug);
  if (!guide) return null;

  const allSections = [...guide.understand, ...(guide.build || [])];
  if (index < 0 || index >= allSections.length) return null;

  return { section: allSections[index], guideTitle: guide.title };
}

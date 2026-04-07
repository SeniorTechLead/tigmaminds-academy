import { useState, useEffect } from 'react';
import type { ReferenceGuide } from '../../data/reference';
import { REFERENCE_CATEGORIES } from '../../data/reference';
import SectionRenderer from './SectionRenderer';
import StoryLinks from './StoryLinks';
import { useAuth } from '../../contexts/AuthContext';
import SignUpGate from '../SignUpGate';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-amber-200 dark:bg-amber-700/50 text-inherit rounded px-0.5">{part}</mark> : part
  );
}

interface Props {
  guide: ReferenceGuide;
  defaultTab?: 'understand' | 'build';
  expandedSlug?: string | null;
  searchQuery?: string;
  level?: 0 | 1 | 2;
}

function getMatchingSnippets(guide: ReferenceGuide, query: string): { sectionTitle: string; snippet: string }[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: { sectionTitle: string; snippet: string }[] = [];
  const allSections = [...guide.understand, ...(guide.build || [])];

  for (const section of allSections) {
    const text = section.beginnerContent || '';
    const contentLower = text.toLowerCase();
    const idx = contentLower.indexOf(q);
    if (idx === -1) continue;

    // Extract ~120 chars around the match
    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, idx + query.length + 70);
    let snippet = text.slice(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    results.push({ sectionTitle: section.title, snippet });
    if (results.length >= 3) break;
  }
  return results;
}

export default function GuideCard({ guide, defaultTab = 'understand', expandedSlug, searchQuery = '', level = 0 }: Props) {
  const [isExpanded, setIsExpanded] = useState(expandedSlug === guide.slug);

  // Re-expand when expandedSlug changes (e.g. deep-link hash navigation)
  useEffect(() => {
    if (expandedSlug === guide.slug) setIsExpanded(true);
  }, [expandedSlug, guide.slug]);

  const { user } = useAuth();
  const isSignedIn = !!user;
  const category = REFERENCE_CATEGORIES.find((c) => c.key === guide.category);
  const allSections = [...guide.understand, ...(guide.build || [])];
  const matchingSnippets = getMatchingSnippets(guide, searchQuery);

  return (
    <div
      id={`ref-${guide.slug}`}
      className={`scroll-mt-32 rounded-2xl border transition-all duration-300 ${
        isExpanded
          ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 shadow-lg'
          : 'bg-white dark:bg-gray-800/60 border-gray-200 dark:border-gray-700/50 hover:shadow-md hover:border-gray-300 dark:hover:border-gray-600'
      }`}
    >
      {/* Collapsed header — always visible */}
      <div
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer select-text"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setIsExpanded(!isExpanded); }}
      >
        <span className="text-2xl flex-shrink-0">{guide.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-bold text-gray-900 dark:text-white text-base select-text">
              {highlightMatch(guide.title, searchQuery)}
            </h3>
            {category && (
              <span
                className={`inline-block px-2 py-0.5 rounded-full text-[11px] font-semibold ${category.color}`}
              >
                {category.label}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 truncate">
            {highlightMatch(guide.tagline, searchQuery)}
          </p>
          {matchingSnippets.length > 0 && !isExpanded && (
            <div className="mt-2 space-y-1">
              {matchingSnippets.map((m, i) => (
                <div key={i} className="text-xs text-gray-500 dark:text-gray-400">
                  <span className="font-semibold text-gray-600 dark:text-gray-300">{m.sectionTitle}:</span>{' '}
                  {highlightMatch(m.snippet, searchQuery)}
                </div>
              ))}
            </div>
          )}
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${
            isExpanded ? 'rotate-180' : ''
          }`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* Expanded content */}
      <div
        className={`overflow-hidden transition-all duration-300 ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-4 pb-5">
          {/* Mini table of contents */}
          {allSections.length > 2 && (
            <div className="mb-4 py-2.5 px-3 bg-gray-50 dark:bg-gray-700/40 rounded-lg border border-gray-100 dark:border-gray-700">
              <p className="text-[11px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1.5">In this guide</p>
              <div className="flex flex-wrap gap-x-1 gap-y-1">
                {allSections.map((section, i) => {
                  const sectionDomId = section.id || `section-${guide.slug}-${i}`;
                  return (
                    <button
                      key={i}
                      onClick={() => document.getElementById(sectionDomId)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
                      className="text-xs text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                    >
                      {i > 0 && <span className="text-gray-300 dark:text-gray-600 mr-1">·</span>}
                      {section.title}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* All sections — understand + build combined */}
          <div className="space-y-1">
            {(isSignedIn ? allSections : allSections.slice(0, 1)).map((section, i) => (
              <div key={i} id={section.id || `section-${guide.slug}-${i}`} className="scroll-mt-20">
                <SectionRenderer section={section} level={level} />
              </div>
            ))}
            {!isSignedIn && allSections.length > 1 && (
              <div className="mt-3">
                <SignUpGate
                  message={`Sign up to read all ${allSections.length} sections`}
                  compact
                  returnTo={`/library/${guide.slug}`}
                />
              </div>
            )}
          </div>

          {/* Related stories */}
          {guide.relatedStories && guide.relatedStories.length > 0 && (
            <div className="mt-5">
              <StoryLinks slugs={guide.relatedStories} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

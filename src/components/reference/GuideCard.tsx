import { useState, useEffect, useRef } from 'react';
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
  onExpand?: (slug: string) => void;
}

function getMatchingSnippets(guide: ReferenceGuide, query: string): { sectionTitle: string; snippet: string; sectionIdx: number }[] {
  if (!query || query.length < 2) return [];
  const q = query.toLowerCase();
  const results: { sectionTitle: string; snippet: string; sectionIdx: number }[] = [];
  const allSections = [...(guide.understand || []), ...(guide.build || [])];

  for (let si = 0; si < allSections.length; si++) {
    const section = allSections[si];
    const text = [section.beginnerContent, section.intermediateContent, section.advancedContent].filter(Boolean).join(' ');
    const contentLower = text.toLowerCase();
    const idx = contentLower.indexOf(q);
    if (idx === -1) {
      // Also check section title
      if (section.title.toLowerCase().includes(q)) {
        results.push({ sectionTitle: section.title, snippet: section.title, sectionIdx: si });
      }
      continue;
    }

    const start = Math.max(0, idx - 50);
    const end = Math.min(text.length, idx + query.length + 70);
    let snippet = text.slice(start, end).trim();
    if (start > 0) snippet = '...' + snippet;
    if (end < text.length) snippet = snippet + '...';

    results.push({ sectionTitle: section.title, snippet, sectionIdx: si });
    if (results.length >= 3) break;
  }
  return results;
}

export default function GuideCard({ guide, defaultTab = 'understand', expandedSlug, searchQuery = '', level = 0, onExpand }: Props) {
  const [isExpanded, setIsExpanded] = useState(expandedSlug === guide.slug);
  const pendingScrollRef = useRef<number | null>(null);

  // Re-expand when expandedSlug changes
  useEffect(() => {
    if (expandedSlug === guide.slug) {
      setIsExpanded(true);
      onExpand?.(guide.slug);
    }
  }, [expandedSlug, guide.slug]);

  const { user } = useAuth();
  const isSignedIn = !!user;
  const category = REFERENCE_CATEGORIES.find((c) => c.key === guide.category);
  const allSections = [...(guide.understand || []), ...(guide.build || [])];
  const matchingSnippets = getMatchingSnippets(guide, searchQuery);

  // Scroll to a specific section by index — retries until element exists, then scrolls to first <mark>
  const scrollToSection = (sectionIdx: number) => {
    const domId = allSections[sectionIdx]?.id || `section-${guide.slug}-${sectionIdx}`;
    let tries = 0;
    const attempt = () => {
      const el = document.getElementById(domId);
      if (el && el.offsetHeight > 0) {
        // Scroll to the first <mark> within the section if it exists, otherwise the section itself
        const mark = el.querySelector('mark');
        const target = mark || el;
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('ring-2', 'ring-amber-400', 'ring-offset-2', 'rounded-lg');
        setTimeout(() => el.classList.remove('ring-2', 'ring-amber-400', 'ring-offset-2', 'rounded-lg'), 3000);
      } else if (tries < 20) {
        tries++;
        setTimeout(attempt, 250);
      }
    };
    setTimeout(attempt, 100);
  };

  // Handle clicking the card header
  const handleHeaderClick = () => {
    if (!isExpanded) {
      setIsExpanded(true);
      onExpand?.(guide.slug);
      // If there's a search match, scroll to first match after expand
      if (matchingSnippets.length > 0) {
        pendingScrollRef.current = matchingSnippets[0].sectionIdx;
      }
    } else {
      setIsExpanded(false);
    }
  };

  // Handle clicking a specific snippet result
  const handleSnippetClick = (sectionIdx: number) => {
    if (!isExpanded) {
      setIsExpanded(true);
      onExpand?.(guide.slug);
      pendingScrollRef.current = sectionIdx;
    } else {
      scrollToSection(sectionIdx);
    }
  };

  // Execute pending scroll after content renders
  useEffect(() => {
    if (isExpanded && pendingScrollRef.current !== null && allSections.length > 0) {
      const idx = pendingScrollRef.current;
      pendingScrollRef.current = null;
      scrollToSection(idx);
    }
  }, [isExpanded, guide]);

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
        onClick={handleHeaderClick}
        className="w-full flex items-center gap-3 p-4 text-left cursor-pointer select-text"
        role="button"
        tabIndex={0}
        onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') handleHeaderClick(); }}
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
          {/* Search result snippets — clickable to jump to section */}
          {matchingSnippets.length > 0 && !isExpanded && (
            <div className="mt-2 space-y-1">
              {matchingSnippets.map((m, i) => (
                <div key={i}
                  onClick={(e) => { e.stopPropagation(); handleSnippetClick(m.sectionIdx); }}
                  className="text-xs text-gray-500 dark:text-gray-400 cursor-pointer hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                >
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
            {(isSignedIn || (searchQuery && searchQuery.length >= 2) ? allSections : allSections.slice(0, 1)).map((section, i) => (
              <div key={i} id={section.id || `section-${guide.slug}-${i}`} className="scroll-mt-20">
                <SectionRenderer section={section} level={level} searchQuery={searchQuery} />
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

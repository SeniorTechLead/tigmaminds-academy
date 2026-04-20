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
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className="bg-amber-200 dark:bg-amber-700/50 text-inherit rounded px-0.5">{part}</mark>
          : <span key={i}>{part}</span>
      )}
    </>
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
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);
  const [showFloatingNav, setShowFloatingNav] = useState(false);
  const [justCopied, setJustCopied] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);

  const buildShareUrl = (includeSection: boolean) => {
    const base = `${window.location.origin}/reference/${guide.slug}`;
    return includeSection && activeSectionId ? `${base}#${activeSectionId}` : base;
  };

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      const ta = document.createElement('textarea');
      ta.value = url;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
    }
    setJustCopied(true);
    setTimeout(() => setJustCopied(false), 1800);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Header button copies the guide URL (no section — user is at the top)
    copyToClipboard(buildShareUrl(false));
  };

  const handleShareSection = (e: React.MouseEvent) => {
    e.stopPropagation();
    // Floating button copies guide + section anchor when available
    copyToClipboard(buildShareUrl(true));
  };

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

  // Track which section is currently in view
  useEffect(() => {
    if (!isExpanded || allSections.length < 2) return;
    const ids = allSections.map((s, i) => s.id || `section-${guide.slug}-${i}`);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const idx = ids.indexOf(entry.target.id);
            if (idx >= 0) {
              setActiveSection(allSections[idx].title);
              setActiveSectionId(entry.target.id);
            }
          }
        }
      },
      { rootMargin: '-120px 0px -60% 0px', threshold: 0 }
    );
    // Small delay to let sections render
    const timer = setTimeout(() => {
      ids.forEach(id => {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      });
    }, 300);
    return () => { clearTimeout(timer); observer.disconnect(); };
  }, [isExpanded, guide.slug, allSections.length]);

  // Show floating nav when card header scrolls out of view
  useEffect(() => {
    if (!isExpanded || allSections.length < 2) {
      setShowFloatingNav(false);
      return;
    }
    const onScroll = () => {
      const el = cardRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      // Show when the top of the card is above the viewport (scrolled past header)
      // and the bottom is still below the viewport (still inside the card)
      setShowFloatingNav(rect.top < -100 && rect.bottom > 200);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isExpanded, allSections.length]);

  return (
    <div
      ref={cardRef}
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

        {/* Share button */}
        <button
          onClick={handleShare}
          onKeyDown={(e) => e.stopPropagation()}
          className={`flex-shrink-0 flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium transition-colors ${
            justCopied
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200'
          }`}
          title={justCopied ? 'Link copied!' : 'Copy shareable link'}
          aria-label={justCopied ? 'Link copied' : 'Copy shareable link'}
        >
          {justCopied ? (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              <span className="hidden sm:inline">Copied</span>
            </>
          ) : (
            <>
              <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
              </svg>
              <span className="hidden sm:inline">Share</span>
            </>
          )}
        </button>

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
        className={`transition-all duration-300 ${
          isExpanded ? 'max-h-none opacity-100' : 'max-h-0 opacity-0 overflow-hidden'
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
              <div key={section.id || `${guide.slug}-${i}`} id={section.id || `section-${guide.slug}-${i}`} className="scroll-mt-20">
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

      {/* Floating nav — fixed in bottom-right corner when scrolled deep into guide */}
      {showFloatingNav && (
        <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2 items-end">
          {/* Current location breadcrumb */}
          <div className="bg-white dark:bg-gray-800 shadow-xl rounded-xl px-4 py-2.5 border border-gray-200 dark:border-gray-700 max-w-xs">
            <div className="flex items-center gap-2 text-sm">
              <span className="flex-shrink-0">{guide.icon}</span>
              <span className="font-semibold text-gray-900 dark:text-white truncate">{guide.title}</span>
            </div>
            {activeSection && (
              <p className="text-xs text-amber-600 dark:text-amber-400 mt-0.5 truncate">{activeSection}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {/* Share current section */}
            <button
              onClick={handleShareSection}
              className={`rounded-full w-10 h-10 flex items-center justify-center shadow-xl transition-colors ${
                justCopied
                  ? 'bg-emerald-500 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700'
              }`}
              title={justCopied ? 'Link copied!' : activeSectionId ? `Copy link to section: ${activeSection}` : 'Copy link to this guide'}
              aria-label={justCopied ? 'Link copied' : 'Copy shareable link to current section'}
            >
              {justCopied ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              )}
            </button>
            {/* Back to top button */}
            <button
              onClick={() => document.getElementById(`ref-${guide.slug}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
              className="bg-amber-500 hover:bg-amber-600 text-white rounded-full w-10 h-10 flex items-center justify-center shadow-xl transition-colors"
              title="Back to top of guide"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

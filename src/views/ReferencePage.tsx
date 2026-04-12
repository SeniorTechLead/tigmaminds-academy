import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, usePathname } from 'next/navigation';
import { BookOpen, Search, List, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuideCard from '../components/reference/GuideCard';
import { REFERENCE_CATEGORIES, type ReferenceGuide, type CategoryGroup } from '../data/reference';
import { referenceMeta } from '../data/reference-meta';
import searchIndex from '../data/reference-search-index.json';

export type ReferenceLevel = 0 | 1 | 2;  // 0=Listener, 1=Explorer/Builder, 2=Engineer/Creator

const LEVEL_OPTIONS: { value: ReferenceLevel; label: string; desc: string }[] = [
  { value: 0, label: 'Beginner', desc: 'Analogies & basics' },
  { value: 1, label: 'Intermediate', desc: 'Formulas & calculations' },
  { value: 2, label: 'Advanced', desc: 'Research-level depth' },
];

export default function ReferencePage() {
  const { slug } = useParams<{ slug?: string }>();
  const pathname = usePathname();
  const [searchInput, setSearchInput] = useState('');
  const [searchQuery, setSearchQuery] = useState(''); // debounced
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIndex, setShowIndex] = useState(false);
  const [jumpToSlug, setJumpToSlug] = useState<string | null>(null);
  const [forceExpandSlug, setForceExpandSlug] = useState<string | null>(null);
  const [level, setLevel] = useState<ReferenceLevel>(0);


  // Restore saved level after hydration to avoid server/client mismatch
  useEffect(() => {
    const saved = localStorage.getItem('tma_ref_level');
    if (saved) setLevel(parseInt(saved) as ReferenceLevel);
  }, []);

  // Debounce search — only filter after 300ms of no typing
  useEffect(() => {
    const timer = setTimeout(() => setSearchQuery(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  // When navigating directly to a guide via slug, clear filters and scroll to it
  useEffect(() => {
    if (slug) {
      setSelectedCategory(null);
      setSearchInput(''); setSearchQuery('');
      // Scroll to the guide card after render
      const attempt = (tries: number) => {
        const el = document.getElementById(`ref-${slug}`);
        if (el) {
          const top = el.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: 'smooth' });
        } else if (tries < 10) {
          setTimeout(() => attempt(tries + 1), 200);
        }
      };
      setTimeout(() => attempt(0), 300);
    }
  }, [slug]);

  // Deep-link to a section via URL hash (e.g. #py-strings or legacy #section-python-10)
  useEffect(() => {
    const hash = typeof window !== 'undefined' ? window.location.hash?.slice(1) : '';
    if (!hash) return;

    // Ensure the guide card is expanded so the section element is in the DOM
    if (slug) {
      setForceExpandSlug(slug);
    }

    const attempt = (tries: number) => {
      const el = document.getElementById(hash);
      if (el && el.offsetHeight > 0) {
        const top = el.getBoundingClientRect().top + window.scrollY - 120;
        window.scrollTo({ top, behavior: 'smooth' });
      } else if (tries >= 8 && slug) {
        // Section not found (likely gated) — scroll to the guide card instead
        const guideEl = document.getElementById(`ref-${slug}`);
        if (guideEl) {
          const top = guideEl.getBoundingClientRect().top + window.scrollY - 120;
          window.scrollTo({ top, behavior: 'smooth' });
        }
      } else if (tries < 12) {
        setTimeout(() => attempt(tries + 1), 250);
      }
    };
    setTimeout(() => attempt(0), 800);
  }, [slug]);

  // Scroll to target after filters clear and DOM re-renders
  useEffect(() => {
    if (!jumpToSlug) return;
    const slug = jumpToSlug;
    setJumpToSlug(null);

    // Retry until element exists (filters may cause re-renders)
    let attempts = 0;
    const tryScroll = () => {
      attempts++;
      const el = document.getElementById(`ref-${slug}`);
      if (!el) {
        if (attempts < 20) requestAnimationFrame(tryScroll);
        return;
      }

      // Expand the card
      const btn = el.querySelector('[role="button"]') as HTMLElement;
      if (btn) btn.click();

      // Scroll after expansion
      setTimeout(() => {
        const el2 = document.getElementById(`ref-${slug}`);
        if (el2) {
          const top = el2.getBoundingClientRect().top + window.scrollY - 140; // 140 = header + sticky bar
          window.scrollTo({ top, behavior: 'smooth' });
        }
      }, 400);
    };

    requestAnimationFrame(tryScroll);
  }, [jumpToSlug]);

  // Guide cache — loaded on demand when a guide is expanded
  const [guideCache, setGuideCache] = useState<Record<string, ReferenceGuide>>({});

  const guideCacheRef = useRef(guideCache);
  guideCacheRef.current = guideCache;

  const loadGuide = useCallback(async (guideSlug: string): Promise<ReferenceGuide | null> => {
    if (guideCacheRef.current[guideSlug]) return guideCacheRef.current[guideSlug];
    try {
      const mod = await import(`../data/reference/${guideSlug}`);
      const guide = mod.guide as ReferenceGuide;
      setGuideCache(prev => ({ ...prev, [guideSlug]: guide }));
      return guide;
    } catch {
      return null;
    }
  }, []);

  // Pre-load the guide when navigating to /library/slug
  useEffect(() => {
    if (slug) loadGuide(slug);
  }, [slug]);

  // Search uses the pre-built index (297KB JSON) — no guide content loaded
  const searchLower = searchQuery.toLowerCase().trim();
  const searchWords = searchLower.split(/[\s&]+/).filter(w => w.length > 0);

  const filteredSlugs = new Set(
    searchWords.length > 0
      ? searchIndex
          .filter(entry => {
            if (selectedCategory && entry.category !== selectedCategory) return false;
            return searchWords.every(w => entry.searchText.includes(w));
          })
          .map(e => e.slug)
      : referenceMeta
          .filter(g => !selectedCategory || g.category === selectedCategory)
          .map(g => g.slug)
  );

  // When search settles (debounced), load full content for matched guides (for snippets)
  useEffect(() => {
    if (searchWords.length === 0) return;
    const toLoad = [...filteredSlugs].filter(s => !guideCache[s]).slice(0, 10); // cap at 10
    if (toLoad.length > 0) {
      toLoad.forEach(s => loadGuide(s));
    }
  }, [searchQuery]); // only debounced value

  // Build the filtered list from metadata + cached full guides where available
  const filtered = referenceMeta
    .filter(g => filteredSlugs.has(g.slug))
    .map(meta => guideCache[meta.slug] || { ...meta, understand: [], relatedStories: [] } as unknown as ReferenceGuide);

  // Group by category group (science / coding)
  const scienceCats = REFERENCE_CATEGORIES.filter(c => c.group === 'science');
  const codingCats = REFERENCE_CATEGORIES.filter(c => c.group === 'coding');

  const groupedFiltered = (group: CategoryGroup) =>
    filtered.filter(g => REFERENCE_CATEGORIES.find(c => c.key === g.category)?.group === group);

  const scienceGuides = groupedFiltered('science');
  const codingGuides = groupedFiltered('coding');

  const CategoryPills = ({ cats }: { cats: typeof REFERENCE_CATEGORIES }) => (
    <>
      {cats.map(cat => {
        const count = referenceMeta.filter(r => r.category === cat.key).length;
        if (count === 0) return null;
        return (
          <button key={cat.key}
            onClick={() => setSelectedCategory(selectedCategory === cat.key ? null : cat.key)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
              selectedCategory === cat.key
                ? 'bg-amber-500 text-white shadow-md'
                : `${cat.color} hover:ring-2 hover:ring-amber-400`
            }`}>
            {cat.icon} {cat.label} ({count})
          </button>
        );
      })}
    </>
  );

  const renderGuideGroup = (title: string, guides: ReferenceGuide[], icon: React.ReactNode) => {
    if (guides.length === 0) return null;
    return (
      <div className="mb-8" key={title}>
        <div className="flex items-center gap-2 mb-4">
          {icon}
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">{title}</h2>
          <span className="text-sm text-gray-400 dark:text-gray-500">({guides.length})</span>
        </div>
        <div className="space-y-3">
          {guides.map(guide => (
            <GuideCard
              key={guide.slug}
              guide={guide}
              expandedSlug={slug || forceExpandSlug || null}
              searchQuery={searchQuery}
              level={level}
              onExpand={loadGuide}
            />
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-3 flex items-center justify-center gap-3">
            <BookOpen className="w-10 h-10 text-amber-500" />
            Reference Library
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-5 max-w-2xl mx-auto">
            Science concepts, coding tools, and math from our lessons — explained with visuals, interactives, and code.
          </p>

          {/* Search */}
          <div className="max-w-md mx-auto mb-5">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
                placeholder="Search (e.g., Rayleigh scattering, NumPy, circuits)..."
                className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm" />
            </div>
          </div>

          {/* Category filters — grouped */}
          <div className="space-y-2">
            <div className="flex flex-wrap gap-2 justify-center">
              <button onClick={() => setSelectedCategory(null)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                  !selectedCategory ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
                }`}>
                All ({referenceMeta.length})
              </button>
              <span className="text-gray-300 dark:text-gray-600 self-center">|</span>
              <CategoryPills cats={scienceCats} />
              <span className="text-gray-300 dark:text-gray-600 self-center">|</span>
              <CategoryPills cats={codingCats} />
            </div>
          </div>
          {/* Level selector — also rendered sticky below */}

          {/* Index toggle */}
          <div className="mt-4">
            <button
              onClick={() => setShowIndex(!showIndex)}
              className="inline-flex items-center gap-1.5 text-sm text-amber-700 dark:text-amber-400 hover:text-amber-800 dark:hover:text-amber-300 font-medium transition-colors"
            >
              <List className="w-4 h-4" />
              Table of Contents
              {showIndex ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </section>

      {/* Collapsible Index — context-sensitive to selected filter */}
      {showIndex && (
        <section className="px-4 sm:px-6 lg:px-8 pb-2">
          <div className="max-w-5xl mx-auto bg-amber-50/50 dark:bg-gray-800/50 border border-amber-200 dark:border-gray-700 rounded-xl p-5">
            {selectedCategory ? (
              /* Single-category TOC: show section-level detail for each guide */
              (() => {
                const cat = REFERENCE_CATEGORIES.find(c => c.key === selectedCategory);
                const catGuides = referenceMeta.filter(r => r.category === selectedCategory).sort((a, b) => a.title.localeCompare(b.title));
                return (
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-3">
                      {cat?.icon} {cat?.label} — {catGuides.length} guide{catGuides.length !== 1 ? 's' : ''}
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                      {catGuides.map(guide => {
                        const allSections = [...guide.understand, ...(guide.build || [])];
                        return (
                          <div key={guide.slug}>
                            <a
                              href={`#ref-${guide.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setShowIndex(false);
                                setJumpToSlug(guide.slug);
                              }}
                              className="text-sm font-semibold text-gray-800 dark:text-gray-200 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                              {guide.icon} {guide.title}
                            </a>
                            {allSections.length > 0 && (
                              <ul className="mt-1 space-y-0.5 pl-5">
                                {allSections.map((section, i) => (
                                  <li key={i}>
                                    <a
                                      href={`#${section.id || `section-${guide.slug}-${i}`}`}
                                      onClick={(e) => {
                                        e.preventDefault();
                                        setShowIndex(false);
                                        setJumpToSlug(guide.slug);
                                        const sectionId = section.id || `section-${guide.slug}-${i}`;
                                        setTimeout(() => {
                                          const el = document.getElementById(sectionId);
                                          if (el) {
                                            const top = el.getBoundingClientRect().top + window.scrollY - 120;
                                            window.scrollTo({ top, behavior: 'smooth' });
                                          }
                                        }, 600);
                                      }}
                                      className="text-xs text-gray-500 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                                    >
                                      {section.title}
                                    </a>
                                  </li>
                                ))}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })()
            ) : (
              /* All-categories TOC: show category groups with guide titles */
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
                {REFERENCE_CATEGORIES.filter(cat => referenceMeta.some(r => r.category === cat.key)).map(cat => {
                  const catGuides = referenceMeta.filter(r => r.category === cat.key).sort((a, b) => a.title.localeCompare(b.title));
                  return (
                    <div key={cat.key}>
                      <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1.5">
                        {cat.icon} {cat.label}
                      </h3>
                      <ul className="space-y-0.5">
                        {catGuides.map(guide => (
                          <li key={guide.slug}>
                            <a
                              href={`#ref-${guide.slug}`}
                              onClick={(e) => {
                                e.preventDefault();
                                setSelectedCategory(null);
                                setSearchInput(''); setSearchQuery('');
                                setShowIndex(false);
                                setJumpToSlug(guide.slug);
                              }}
                              className="text-sm text-gray-700 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                            >
                              {guide.icon} {guide.title}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Sticky depth toggle — stays visible while scrolling */}
      <div className="sticky top-20 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-100 dark:border-gray-800 py-2 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto flex items-center justify-center gap-1">
          <span className="text-xs text-gray-500 dark:text-gray-400 mr-2">Depth:</span>
          {LEVEL_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => { setLevel(opt.value); localStorage.setItem('tma_ref_level', String(opt.value)); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                level === opt.value
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
              title={opt.desc}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No references match your search.</p>
              <button onClick={() => { setSearchInput(''); setSearchQuery(''); setSelectedCategory(null); }} className="mt-2 text-amber-600 hover:underline text-sm">Clear filters</button>
            </div>
          ) : selectedCategory ? (
            // Flat list when a specific category is selected
            <div className="space-y-3">
              {filtered.map(guide => (
                <GuideCard key={guide.slug} guide={guide} expandedSlug={slug || forceExpandSlug || null} searchQuery={searchQuery} level={level} />
              ))}
            </div>
          ) : (
            // Grouped view
            <>
              {renderGuideGroup("Science & Nature", scienceGuides, <span className="text-2xl">🔬</span>)}
              {renderGuideGroup("Coding & Tools", codingGuides, <span className="text-2xl">💻</span>)}
            </>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}
// cache-bust 1774467249

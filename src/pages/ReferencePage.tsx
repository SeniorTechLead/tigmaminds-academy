import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BookOpen, Search, List, ChevronDown, ChevronUp } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import GuideCard from '../components/reference/GuideCard';
import { references, REFERENCE_CATEGORIES, type ReferenceGuide, type CategoryGroup } from '../data/reference';

export type ReferenceLevel = 0 | 1 | 2;  // 0=Listener, 1=Explorer/Builder, 2=Engineer/Creator

const LEVEL_OPTIONS: { value: ReferenceLevel; label: string; desc: string }[] = [
  { value: 0, label: 'Beginner', desc: 'Analogies & basics' },
  { value: 1, label: 'Intermediate', desc: 'Formulas & calculations' },
  { value: 2, label: 'Advanced', desc: 'Research-level depth' },
];

export default function ReferencePage() {
  const { slug } = useParams<{ slug?: string }>();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [showIndex, setShowIndex] = useState(false);
  const [jumpToSlug, setJumpToSlug] = useState<string | null>(null);
  const [level, setLevel] = useState<ReferenceLevel>(() => {
    const saved = localStorage.getItem('tma_ref_level');
    return saved ? (parseInt(saved) as ReferenceLevel) : 0;
  });

  // Scroll to target after filters clear and DOM re-renders
  useEffect(() => {
    if (!jumpToSlug) return;
    const slug = jumpToSlug;
    setJumpToSlug(null);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const el = document.getElementById(`ref-${slug}`);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Expand the card by clicking its button
          const btn = el.querySelector('button');
          if (btn) btn.click();
        }
      });
    });
  }, [jumpToSlug]);

  const searchLower = searchQuery.toLowerCase();

  const filtered = references.filter(guide => {
    const matchesCat = !selectedCategory || guide.category === selectedCategory;
    if (!matchesCat) return false;
    if (!searchQuery) return true;

    const searchIn = (sections: typeof guide.understand) =>
      sections.some(s =>
        s.title.toLowerCase().includes(searchLower) ||
        s.content.toLowerCase().includes(searchLower)
      );

    return (
      guide.title.toLowerCase().includes(searchLower) ||
      guide.tagline.toLowerCase().includes(searchLower) ||
      searchIn(guide.understand) ||
      (guide.build ? searchIn(guide.build) : false)
    );
  });

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
        const count = references.filter(r => r.category === cat.key).length;
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
              expandedSlug={slug || null}
              searchQuery={searchQuery}
              level={level}
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
              <input type="text" value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
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
                All ({references.length})
              </button>
              <span className="text-gray-300 dark:text-gray-600 self-center">|</span>
              <CategoryPills cats={scienceCats} />
              <span className="text-gray-300 dark:text-gray-600 self-center">|</span>
              <CategoryPills cats={codingCats} />
            </div>
          </div>
          {/* Level selector */}
          <div className="mt-4 flex items-center justify-center gap-1">
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

      {/* Collapsible Index */}
      {showIndex && (
        <section className="px-4 sm:px-6 lg:px-8 pb-2">
          <div className="max-w-5xl mx-auto bg-amber-50/50 dark:bg-gray-800/50 border border-amber-200 dark:border-gray-700 rounded-xl p-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-4">
              {REFERENCE_CATEGORIES.filter(cat => references.some(r => r.category === cat.key)).map(cat => {
                const catGuides = references.filter(r => r.category === cat.key).sort((a, b) => a.title.localeCompare(b.title));
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
                              setSearchQuery('');
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
          </div>
        </section>
      )}

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No references match your search.</p>
              <button onClick={() => { setSearchQuery(''); setSelectedCategory(null); }} className="mt-2 text-amber-600 hover:underline text-sm">Clear filters</button>
            </div>
          ) : selectedCategory ? (
            // Flat list when a specific category is selected
            <div className="space-y-3">
              {filtered.map(guide => (
                <GuideCard key={guide.slug} guide={guide} expandedSlug={slug || null} searchQuery={searchQuery} level={level} />
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

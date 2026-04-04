import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle, BookOpen, Search, Code2, ChevronRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, SUBJECTS, Subject, DISCIPLINES, Discipline } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';

function highlightMatch(text: string, query: string): React.ReactNode {
  if (!query || query.length < 2) return text;
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
  const parts = text.split(regex);
  if (parts.length === 1) return text;
  return parts.map((part, i) =>
    regex.test(part) ? <mark key={i} className="bg-amber-200 dark:bg-amber-700/50 text-inherit rounded px-0.5">{part}</mark> : part
  );
}

type FilterType = 'subject' | 'discipline';

export default function LessonsIndexPage() {
  const [filterType, setFilterType] = useState<FilterType>('subject');
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [selectedL2Skill, setSelectedL2Skill] = useState<string | null>(null);
  const [selectedL3Tool, setSelectedL3Tool] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isStoryComplete, isLevelComplete, getCompletedCount } = useProgress();

  // Discipline filter matching
  const matchesDisciplineFilter = (lesson: typeof lessons[0]) => {
    if (!selectedDiscipline) return true;
    const tags = lesson.skillTags;
    if (!tags || tags.length === 0) return false;
    if (selectedL3Tool) {
      return tags.some(t => t.discipline === selectedDiscipline && t.skill === selectedL2Skill && t.tools?.includes(selectedL3Tool));
    }
    if (selectedL2Skill) {
      return tags.some(t => t.discipline === selectedDiscipline && t.skill === selectedL2Skill);
    }
    return tags.some(t => t.discipline === selectedDiscipline);
  };

  const filtered = lessons.filter((lesson) => {
    const matchesSubject = !selectedSubject || lesson.subjects?.includes(selectedSubject);
    const matchesDiscipline = filterType !== 'discipline' || matchesDisciplineFilter(lesson);
    const matchesSearch = !searchQuery ||
      lesson.story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.stem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.story.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesDiscipline && matchesSearch;
  });

  // Compute counts for discipline drill-down
  const disciplineCount = (d: Discipline) => lessons.filter(l => l.skillTags?.some(t => t.discipline === d)).length;
  const skillCount = (d: Discipline, skill: string) => lessons.filter(l => l.skillTags?.some(t => t.discipline === d && t.skill === skill)).length;
  const toolCount = (d: Discipline, skill: string, tool: string) => lessons.filter(l => l.skillTags?.some(t => t.discipline === d && t.skill === skill && t.tools?.includes(tool))).length;

  const clearAllFilters = () => {
    setSelectedSubject(null);
    setSelectedDiscipline(null);
    setSelectedL2Skill(null);
    setSelectedL3Tool(null);
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">All Lessons</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {lessons.length}+ stories and growing, each with interactive STEM lessons. Filter by subject or search for a topic.
          </p>
          {getCompletedCount() > 0 && (
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full text-sm font-semibold mb-4">
              <CheckCircle className="w-4 h-4" />
              {getCompletedCount()} of {lessons.length} stories completed
            </div>
          )}

          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search stories or topics..."
              className="w-full px-4 py-3 border-2 border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent text-sm"
            />
          </div>

          {/* Filter type tabs */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-800 rounded-xl p-1 max-w-xs mx-auto mb-4">
            {([
              { key: 'subject' as FilterType, label: 'By Subject' },
              { key: 'discipline' as FilterType, label: 'By Skill' },
            ]).map(tab => (
              <button key={tab.key} onClick={() => { setFilterType(tab.key); clearAllFilters(); }}
                className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${filterType === tab.key ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Filter pills */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button onClick={clearAllFilters}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${!selectedSubject && !selectedDiscipline ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}>
              All ({lessons.length})
            </button>

            {filterType === 'subject' && SUBJECTS.map(s => {
              const count = lessons.filter(l => l.subjects?.includes(s.key)).length;
              if (count === 0) return null;
              return (
                <button key={s.key} onClick={() => setSelectedSubject(selectedSubject === s.key ? null : s.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedSubject === s.key ? 'bg-amber-500 text-white shadow-md' : `${s.color} hover:ring-2 hover:ring-amber-400`}`}>
                  {s.icon} {s.key} ({count})
                </button>
              );
            })}

            {/* Hierarchical discipline filter: L1 → L2 → L3 drill-down */}
            {filterType === 'discipline' && DISCIPLINES.map(d => {
              const count = disciplineCount(d.key);
              if (count === 0) return null;
              return (
                <button key={d.key} onClick={() => {
                  if (selectedDiscipline === d.key) { setSelectedDiscipline(null); setSelectedL2Skill(null); setSelectedL3Tool(null); }
                  else { setSelectedDiscipline(d.key); setSelectedL2Skill(null); setSelectedL3Tool(null); }
                }}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${selectedDiscipline === d.key ? 'bg-amber-500 text-white shadow-md' : `${d.color} hover:ring-2 hover:ring-amber-400`}`}>
                  {d.icon} {d.key} ({count})
                </button>
              );
            })}

          </div>

          {/* L2 skill drill-down row */}
          {filterType === 'discipline' && selectedDiscipline && (() => {
            const disc = DISCIPLINES.find(d => d.key === selectedDiscipline);
            if (!disc) return null;
            return (
              <div className="mb-4">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-2">
                  <span>{disc.icon} {disc.key}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Skills</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {disc.skills.map(s => {
                    const count = skillCount(disc.key, s.name);
                    if (count === 0) return null;
                    return (
                      <button key={s.name} onClick={() => {
                        if (selectedL2Skill === s.name) { setSelectedL2Skill(null); setSelectedL3Tool(null); }
                        else { setSelectedL2Skill(s.name); setSelectedL3Tool(null); }
                      }}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedL2Skill === s.name ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:ring-2 hover:ring-amber-400'}`}>
                        {s.name} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {/* L3 tool drill-down row */}
          {filterType === 'discipline' && selectedDiscipline && selectedL2Skill && (() => {
            const disc = DISCIPLINES.find(d => d.key === selectedDiscipline);
            const skill = disc?.skills.find(s => s.name === selectedL2Skill);
            if (!disc || !skill) return null;
            return (
              <div className="mb-4">
                <div className="flex items-center justify-center gap-1 text-xs text-gray-400 dark:text-gray-500 mb-2">
                  <span>{disc.icon} {disc.key}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span>{selectedL2Skill}</span>
                  <ChevronRight className="w-3 h-3" />
                  <span className="font-semibold text-gray-600 dark:text-gray-300">Tools</span>
                </div>
                <div className="flex flex-wrap gap-2 justify-center">
                  {skill.tools.map(tool => {
                    const count = toolCount(disc.key, skill.name, tool);
                    if (count === 0) return null;
                    return (
                      <button key={tool} onClick={() => setSelectedL3Tool(selectedL3Tool === tool ? null : tool)}
                        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${selectedL3Tool === tool ? 'bg-amber-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:ring-2 hover:ring-amber-400'}`}>
                        {tool} ({count})
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })()}

          {(selectedSubject || selectedDiscipline) && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filtered.length} lesson{filtered.length !== 1 ? 's' : ''}
            </p>
          )}
        </div>
      </section>

      <section className="py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          {filtered.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400 mb-4">No lessons match your search.</p>
              <button
                onClick={() => { clearAllFilters(); setSearchQuery(''); }}
                className="text-amber-600 dark:text-amber-400 font-semibold hover:underline"
              >
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filtered.map((lesson) => {
                const Icon = lesson.stem.icon;
                return (
                  <Link
                    key={lesson.slug}
                    to={`/lessons/${lesson.slug}`}
                    className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 dark:border-gray-700"
                  >
                    <div className="relative h-40 overflow-hidden">
                      <img
                        src={`${lesson.illustration}?v=2`}
                        alt={lesson.story.title}
                        className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                      <div className={`absolute top-3 left-3 bg-gradient-to-r ${lesson.stem.color} w-9 h-9 rounded-full flex items-center justify-center shadow-lg`}>
                        <Icon className="w-4 h-4 text-white" />
                      </div>
                      {isStoryComplete(lesson.slug) && (
                        <div className="absolute top-3 right-3 bg-emerald-500 text-white w-8 h-8 rounded-full flex items-center justify-center shadow-lg">
                          <CheckCircle className="w-5 h-5" />
                        </div>
                      )}
                      {/* Progress dots */}
                      {(isLevelComplete(lesson.slug, 1) || isLevelComplete(lesson.slug, 2)) && !isStoryComplete(lesson.slug) && (
                        <div className="absolute top-3 right-3 flex gap-1">
                          {[1, 2, 3].map((lvl) => (
                            <div key={lvl} className={`w-2 h-2 rounded-full ${isLevelComplete(lesson.slug, lvl as 1|2|3) ? 'bg-emerald-400' : 'bg-white/40'}`} />
                          ))}
                        </div>
                      )}
                    </div>
                    <div className="p-5">
                      <div className="flex items-center gap-2 mb-2">
                        <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">
                          {highlightMatch(lesson.stem.title, searchQuery)}
                        </p>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {highlightMatch(lesson.story.title, searchQuery)}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-3">
                        {highlightMatch(lesson.story.tagline, searchQuery)}
                      </p>

                      {/* Subject tags */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        {lesson.subjects?.map((subj) => {
                          const subjData = SUBJECTS.find(s => s.key === subj);
                          return subjData ? (
                            <span key={subj} className={`text-xs px-2 py-0.5 rounded-full ${subjData.color}`}>
                              {subjData.icon} {subj}
                            </span>
                          ) : null;
                        })}
                      </div>

                      {/* Tool skills */}
                      {lesson.toolSkills && lesson.toolSkills.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {lesson.toolSkills.slice(0, 4).map((skill) => (
                            <span key={skill} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300">
                              {skill}
                            </span>
                          ))}
                        </div>
                      )}

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{lesson.track === 'school' ? 'School Program' : lesson.track === 'bootcamp' ? 'Bootcamp' : 'All Tracks'}</span>
                          {lesson.estimatedHours && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" /> {lesson.estimatedHours}h
                            </span>
                          )}
                        </div>
                        <span className="inline-flex items-center text-amber-600 dark:text-amber-400 text-sm font-semibold">
                          Start <ArrowRight className="ml-1 w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Also explore — navigation to related pages */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700">
        <div className="max-w-4xl mx-auto">
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center mb-4">Also explore</p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/plan" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-xl text-sm font-semibold hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              <BookOpen className="w-4 h-4" /> Build a Lesson Plan
            </Link>
            <Link to="/reference" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-xl text-sm font-semibold hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              <Search className="w-4 h-4" /> Reference Library
            </Link>
            <Link to="/playground" className="inline-flex items-center gap-2 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 px-5 py-3 rounded-xl text-sm font-semibold hover:border-amber-400 hover:text-amber-600 dark:hover:text-amber-400 transition-all">
              <Code2 className="w-4 h-4" /> Coding Playground
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

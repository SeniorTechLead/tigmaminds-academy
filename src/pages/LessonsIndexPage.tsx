import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Clock, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, SUBJECTS, Subject } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';

export default function LessonsIndexPage() {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isStoryComplete, isLevelComplete, getCompletedCount } = useProgress();

  const filtered = lessons.filter((lesson) => {
    const matchesSubject = !selectedSubject || lesson.subjects?.includes(selectedSubject);
    const matchesSearch = !searchQuery ||
      lesson.story.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.stem.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lesson.story.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-6 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">All Lessons</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-4">
            {lessons.length} stories, each with interactive STEM lessons. Filter by subject or search for a topic.
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

          {/* Subject filters */}
          <div className="flex flex-wrap gap-2 justify-center mb-4">
            <button
              onClick={() => setSelectedSubject(null)}
              className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                !selectedSubject
                  ? 'bg-amber-500 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              All ({lessons.length})
            </button>
            {SUBJECTS.map((subject) => {
              const count = lessons.filter(l => l.subjects?.includes(subject.key)).length;
              if (count === 0) return null;
              return (
                <button
                  key={subject.key}
                  onClick={() => setSelectedSubject(selectedSubject === subject.key ? null : subject.key)}
                  className={`px-4 py-2 rounded-full text-sm font-semibold transition-all ${
                    selectedSubject === subject.key
                      ? 'bg-amber-500 text-white shadow-md'
                      : `${subject.color} hover:ring-2 hover:ring-amber-400`
                  }`}
                >
                  {subject.icon} {subject.key} ({count})
                </button>
              );
            })}
          </div>

          {selectedSubject && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Showing {filtered.length} {selectedSubject} lessons
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
                onClick={() => { setSelectedSubject(null); setSearchQuery(''); }}
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
                        src={lesson.illustration}
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
                          {lesson.stem.title}
                        </p>
                      </div>
                      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                        {lesson.story.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed line-clamp-2 mb-3">
                        {lesson.story.tagline}
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

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-400">
                          <span>{lesson.track === 'school' ? '12-Month School' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Both Tracks'}</span>
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

      <Footer />
    </div>
  );
}

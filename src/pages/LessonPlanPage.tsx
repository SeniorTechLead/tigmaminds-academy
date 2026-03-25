import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Clock, BookOpen, CheckCircle, Plus, X, Download, ArrowRight } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, SUBJECTS, Subject } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';

export default function LessonPlanPage() {
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [filterSubject, setFilterSubject] = useState<Subject | null>(null);
  const { isStoryComplete, isLevelComplete } = useProgress();

  const availableLessons = lessons.filter(l =>
    !filterSubject || l.subjects?.includes(filterSubject)
  );

  const selectedLessons = lessons.filter(l => selectedSlugs.has(l.slug));
  const totalHours = selectedLessons.reduce((sum, l) => sum + (l.estimatedHours || 12), 0);
  const completedInPlan = selectedLessons.filter(l => isStoryComplete(l.slug)).length;

  const toggleLesson = (slug: string) => {
    setSelectedSlugs(prev => {
      const next = new Set(prev);
      if (next.has(slug)) next.delete(slug);
      else next.add(slug);
      return next;
    });
  };

  const selectAllInSubject = (subject: Subject) => {
    const slugs = lessons.filter(l => l.subjects?.includes(subject)).map(l => l.slug);
    setSelectedSlugs(prev => {
      const next = new Set(prev);
      slugs.forEach(s => next.add(s));
      return next;
    });
  };

  const clearAll = () => setSelectedSlugs(new Set());

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <Link to="/lessons" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline mb-6 text-sm">
            <ArrowLeft className="w-4 h-4" /> Back to Lessons
          </Link>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Left: Lesson picker */}
            <div className="lg:col-span-2">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Build Your Lesson Plan</h1>
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                Pick stories by subject to create a personalized learning path. Each story takes approximately 12 hours across Level 1 + Level 2.
              </p>

              {/* Subject quick-add */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className="text-sm text-gray-500 dark:text-gray-400 py-2">Add by subject:</span>
                {SUBJECTS.map(s => {
                  const count = lessons.filter(l => l.subjects?.includes(s.key)).length;
                  if (count === 0) return null;
                  return (
                    <button
                      key={s.key}
                      onClick={() => selectAllInSubject(s.key)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${s.color} hover:ring-2 hover:ring-amber-400`}
                    >
                      {s.icon} {s.key} ({count})
                    </button>
                  );
                })}
              </div>

              {/* Filter */}
              <div className="flex gap-2 mb-4">
                <button
                  onClick={() => setFilterSubject(null)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${!filterSubject ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                >
                  All
                </button>
                {SUBJECTS.filter(s => lessons.some(l => l.subjects?.includes(s.key))).map(s => (
                  <button
                    key={s.key}
                    onClick={() => setFilterSubject(filterSubject === s.key ? null : s.key)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${filterSubject === s.key ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                  >
                    {s.icon} {s.key}
                  </button>
                ))}
              </div>

              {/* Lesson list */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-2">
                {availableLessons.map(lesson => {
                  const selected = selectedSlugs.has(lesson.slug);
                  const complete = isStoryComplete(lesson.slug);
                  return (
                    <button
                      key={lesson.slug}
                      onClick={() => toggleLesson(lesson.slug)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selected
                          ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selected ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {selected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {lesson.story.title}
                            {complete && <span className="ml-2 text-emerald-500 text-xs">✓ Done</span>}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400">{lesson.stem.title}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {lesson.subjects?.map(s => {
                            const sd = SUBJECTS.find(x => x.key === s);
                            return sd ? <span key={s} className={`text-xs px-1.5 py-0.5 rounded ${sd.color}`}>{sd.icon}</span> : null;
                          })}
                        </div>
                        <span className="text-xs text-gray-400 flex-shrink-0">{lesson.estimatedHours || 12}h</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Right: Plan summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-amber-500" />
                  Your Plan
                </h2>

                {selectedLessons.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400 py-8 text-center">
                    Click stories on the left to add them to your plan.
                  </p>
                ) : (
                  <>
                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-3 mb-6">
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600">{selectedLessons.length}</p>
                        <p className="text-xs text-gray-500">Stories</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-amber-600">{totalHours}</p>
                        <p className="text-xs text-gray-500">Hours</p>
                      </div>
                      <div className="text-center p-3 bg-gray-50 dark:bg-gray-700 rounded-xl">
                        <p className="text-2xl font-bold text-emerald-600">{completedInPlan}</p>
                        <p className="text-xs text-gray-500">Done</p>
                      </div>
                    </div>

                    {/* Duration estimate */}
                    <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-4">
                      <p className="text-sm text-amber-800 dark:text-amber-300">
                        <Clock className="w-4 h-4 inline mr-1" />
                        At 2 hours/day: <strong>{Math.ceil(totalHours / 2)} days</strong>
                        <br />
                        At 1 hour/day: <strong>{totalHours} days</strong> ({Math.ceil(totalHours / 7)} weeks)
                      </p>
                    </div>

                    {/* Selected lessons list */}
                    <div className="space-y-2 max-h-[300px] overflow-y-auto mb-4">
                      {selectedLessons.map(lesson => (
                        <div key={lesson.slug} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700">
                          <div className="flex items-center gap-2 min-w-0">
                            {isStoryComplete(lesson.slug) ? (
                              <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                            ) : (
                              <div className="w-4 h-4 rounded-full border-2 border-gray-300 flex-shrink-0" />
                            )}
                            <span className="text-xs text-gray-700 dark:text-gray-300 truncate">{lesson.story.title}</span>
                          </div>
                          <button onClick={() => toggleLesson(lesson.slug)} className="p-1 text-gray-400 hover:text-red-500">
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>

                    {/* Actions */}
                    <div className="space-y-2">
                      <Link
                        to={`/lessons/${selectedLessons.find(l => !isStoryComplete(l.slug))?.slug || selectedLessons[0]?.slug}`}
                        className="w-full inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-4 py-3 rounded-xl font-semibold transition-colors"
                      >
                        {completedInPlan === selectedLessons.length ? 'Review' : 'Start Next Lesson'}
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={clearAll}
                        className="w-full text-sm text-gray-500 hover:text-red-500 transition-colors py-2"
                      >
                        Clear plan
                      </button>
                    </div>

                    {/* Progress bar */}
                    {completedInPlan > 0 && (
                      <div className="mt-4">
                        <div className="flex justify-between text-xs text-gray-500 mb-1">
                          <span>Progress</span>
                          <span>{Math.round(completedInPlan / selectedLessons.length * 100)}%</span>
                        </div>
                        <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-emerald-500 rounded-full transition-all"
                            style={{ width: `${completedInPlan / selectedLessons.length * 100}%` }}
                          />
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

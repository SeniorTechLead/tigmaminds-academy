import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, BookOpen, CheckCircle, Plus, X, ArrowRight,
  Sparkles, Target, Flame, Trophy, Map as MapIcon, Filter,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, SUBJECTS, Subject, getLessonBySlug, type Lesson } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PlanEntry {
  id: number;
  slug: string;
  addedAt: string;
}

type PlanMap = Map<string, { id: number; addedAt: string }>;

function loadPlanLocal(): PlanMap {
  try {
    const saved = localStorage.getItem('tma_plan');
    if (!saved) return new Map();
    const raw = JSON.parse(saved);
    if (Array.isArray(raw) && raw.length > 0) {
      const now = new Date().toISOString();
      if (typeof raw[0] === 'string') {
        const map: PlanMap = new Map();
        for (const slug of raw as string[]) {
          const lesson = getLessonBySlug(slug);
          if (lesson) map.set(slug, { id: lesson.id, addedAt: now });
        }
        return map;
      }
      if (raw[0].slug && !raw[0].id) {
        const map: PlanMap = new Map();
        for (const entry of raw) {
          const lesson = getLessonBySlug(entry.slug);
          if (lesson) map.set(entry.slug, { id: lesson.id, addedAt: entry.addedAt || now });
        }
        return map;
      }
      return new Map((raw as PlanEntry[]).map(e => [e.slug, { id: e.id, addedAt: e.addedAt }]));
    }
    return new Map();
  } catch { return new Map(); }
}

function entriesToJSON(plan: PlanMap): PlanEntry[] {
  return [...plan.entries()].map(([slug, { id, addedAt }]) => ({ id, slug, addedAt }));
}

function savePlanLocal(plan: PlanMap) {
  localStorage.setItem('tma_plan', JSON.stringify(entriesToJSON(plan)));
}

async function savePlanDB(userId: string, plan: PlanMap) {
  try {
    await supabase.from('user_plans').upsert({
      user_id: userId,
      lesson_entries: entriesToJSON(plan),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch (err) {
    console.error('[Plan] Network error:', err);
  }
}

/* ── Motivational messages based on plan size ── */
function getPlanMessage(count: number, completed: number): string {
  if (count === 0) return 'Pick your first story below — every adventure starts with one step.';
  if (completed === count) return 'You did it. Every story, every concept, every project. What a journey.';
  if (completed > count * 0.7) return 'Almost there — the finish line is in sight!';
  if (completed > count * 0.3) return 'Great momentum. Keep going — every story makes you stronger.';
  if (count <= 3) return 'A focused plan. Quality over quantity — smart move.';
  if (count <= 10) return 'A solid learning path. Enough to go deep, not so many it feels overwhelming.';
  return `An ambitious plan — ${count} stories, each one a new world to explore.`;
}

export default function LessonPlanPage() {
  const { user } = useAuth();
  const [planMap, setPlanMap] = useState<PlanMap>(loadPlanLocal);
  const [filterSubject, setFilterSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const { isStoryComplete } = useProgress();

  // Load plan from Supabase
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        const { data } = await supabase
          .from('user_plans')
          .select('lesson_entries')
          .eq('user_id', user.id)
          .maybeSingle();
        if (data?.lesson_entries?.length) {
          const dbEntries: PlanEntry[] = data.lesson_entries;
          const dbMap: PlanMap = new Map(dbEntries.map(e => [e.slug, { id: e.id, addedAt: e.addedAt }]));
          const local = loadPlanLocal();
          const merged: PlanMap = new Map(dbMap);
          for (const [slug, val] of local) {
            if (!merged.has(slug) || val.addedAt < merged.get(slug)!.addedAt) {
              merged.set(slug, val);
            }
          }
          setPlanMap(merged);
          savePlanLocal(merged);
          if (merged.size !== dbMap.size) {
            await savePlanDB(user.id, merged);
          }
        } else {
          const local = loadPlanLocal();
          if (local.size > 0 && user) await savePlanDB(user.id, local);
        }
      } catch (err) {
        console.error('[Plan] Sync error:', err);
      }
    })();
  }, [user]);

  const savePlan = useCallback((plan: PlanMap) => {
    savePlanLocal(plan);
    if (user) savePlanDB(user.id, plan);
  }, [user]);

  const selectedSlugs = new Set(planMap.keys());

  const availableLessons = lessons.filter(l => {
    if (filterSubject && !l.subjects?.includes(filterSubject)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.story.title.toLowerCase().includes(q) || l.stem.title.toLowerCase().includes(q);
    }
    return true;
  });

  const selectedLessons = lessons.filter(l => selectedSlugs.has(l.slug));
  const totalHours = selectedLessons.reduce((sum, l) => sum + (l.estimatedHours || 12), 0);
  const completedInPlan = selectedLessons.filter(l => isStoryComplete(l.slug)).length;

  const toggleLesson = (slug: string) => {
    setPlanMap(prev => {
      const next = new Map(prev);
      if (next.has(slug)) {
        next.delete(slug);
      } else {
        const lesson = getLessonBySlug(slug);
        if (lesson) next.set(slug, { id: lesson.id, addedAt: new Date().toISOString() });
      }
      savePlan(next);
      return next;
    });
  };

  const selectAllInSubject = (subject: Subject) => {
    const inSubject = lessons.filter(l => l.subjects?.includes(subject));
    setPlanMap(prev => {
      const next = new Map(prev);
      const now = new Date().toISOString();
      inSubject.forEach(l => { if (!next.has(l.slug)) next.set(l.slug, { id: l.id, addedAt: now }); });
      savePlan(next);
      return next;
    });
  };

  const clearAll = () => {
    const empty: PlanMap = new Map();
    setPlanMap(empty);
    savePlan(empty);
  };

  const nextLesson = selectedLessons.find(l => !isStoryComplete(l.slug));
  const progressPct = selectedLessons.length > 0 ? Math.round(completedInPlan / selectedLessons.length * 100) : 0;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-32 pb-10 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
            <MapIcon className="w-4 h-4" />
            Your Learning Journey
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Build Your Lesson Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto">
            {getPlanMessage(selectedLessons.length, completedInPlan)}
          </p>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: Lesson picker ── */}
            <div className="lg:col-span-2">
              {/* Quick-add by subject */}
              <div className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 p-4 mb-4">
                <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Quick add by subject</p>
                <div className="flex flex-wrap gap-2">
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
              </div>

              {/* Search + Filter */}
              <div className="flex gap-2 mb-4 flex-wrap">
                <div className="relative flex-1 min-w-[200px]">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search stories..."
                    className="w-full pl-4 pr-4 py-2 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                  />
                </div>
                <div className="flex gap-1 items-center">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => setFilterSubject(null)}
                    className={`px-3 py-2 rounded-lg text-xs font-semibold ${!filterSubject ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                  >
                    All
                  </button>
                  {SUBJECTS.filter(s => lessons.some(l => l.subjects?.includes(s.key))).map(s => (
                    <button
                      key={s.key}
                      onClick={() => setFilterSubject(filterSubject === s.key ? null : s.key)}
                      className={`px-3 py-2 rounded-lg text-xs font-semibold ${filterSubject === s.key ? 'bg-amber-500 text-white' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'}`}
                    >
                      {s.icon}
                    </button>
                  ))}
                </div>
              </div>

              {/* Lesson cards */}
              <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                {availableLessons.map(lesson => {
                  const selected = selectedSlugs.has(lesson.slug);
                  const complete = isStoryComplete(lesson.slug);
                  return (
                    <button
                      key={lesson.slug}
                      onClick={() => toggleLesson(lesson.slug)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all ${
                        selected
                          ? complete
                            ? 'border-emerald-400 bg-emerald-50 dark:bg-emerald-900/20'
                            : 'border-amber-400 bg-amber-50 dark:bg-amber-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                          selected && complete ? 'bg-emerald-500 text-white' :
                          selected ? 'bg-amber-500 text-white' :
                          'bg-gray-200 dark:bg-gray-700'
                        }`}>
                          {selected && complete ? <CheckCircle className="w-4 h-4" /> :
                           selected ? <CheckCircle className="w-4 h-4" /> :
                           <Plus className="w-4 h-4 text-gray-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-sm font-bold text-gray-900 dark:text-white truncate">
                            {lesson.story.title}
                          </h3>
                          <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{lesson.stem.title}</p>
                        </div>
                        <div className="flex gap-1 flex-shrink-0">
                          {lesson.subjects?.slice(0, 3).map(s => {
                            const sd = SUBJECTS.find(x => x.key === s);
                            return sd ? <span key={s} className={`text-xs px-1.5 py-0.5 rounded ${sd.color}`}>{sd.icon}</span> : null;
                          })}
                        </div>
                      </div>
                    </button>
                  );
                })}
                {availableLessons.length === 0 && (
                  <p className="text-center py-8 text-gray-400 dark:text-gray-500 text-sm">No stories match your search.</p>
                )}
              </div>
            </div>

            {/* ── Right: Plan summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                {/* Plan header with gradient */}
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Target className="w-5 h-5" />
                    Your Plan
                  </h2>
                  {selectedLessons.length > 0 && (
                    <div className="flex items-center gap-4 mt-3">
                      <div>
                        <p className="text-2xl font-bold">{selectedLessons.length}</p>
                        <p className="text-xs text-white/80">stories</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{totalHours}</p>
                        <p className="text-xs text-white/80">hours</p>
                      </div>
                      <div>
                        <p className="text-2xl font-bold">{completedInPlan}</p>
                        <p className="text-xs text-white/80">done</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-6">
                  {selectedLessons.length === 0 ? (
                    <div className="text-center py-6">
                      <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Click stories on the left to build your plan.
                      </p>
                      <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                        Each story is a complete learning journey — from a children's tale to a working project.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Progress bar */}
                      <div className="mb-5">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            {progressPct === 100 ? <Trophy className="w-3 h-3 text-amber-500" /> : <Flame className="w-3 h-3 text-orange-500" />}
                            Progress
                          </span>
                          <span className="font-bold">{progressPct}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                            style={{ width: `${Math.max(progressPct, 2)}%` }}
                          />
                        </div>
                      </div>

                      {/* Time estimate */}
                      <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-5">
                        <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                          <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                          <span>
                            <strong>At 1 hour/day:</strong> {totalHours - completedInPlan * 12} days remaining
                            <br />
                            <strong>At 2 hours/day:</strong> {Math.ceil((totalHours - completedInPlan * 12) / 2)} days remaining
                          </span>
                        </p>
                      </div>

                      {/* Selected lessons */}
                      <div className="space-y-1.5 max-h-[250px] overflow-y-auto mb-5">
                        {selectedLessons.map(lesson => {
                          const complete = isStoryComplete(lesson.slug);
                          return (
                            <div key={lesson.slug} className={`flex items-center justify-between p-2 rounded-lg ${complete ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                              <div className="flex items-center gap-2 min-w-0">
                                {complete ? (
                                  <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                                ) : (
                                  <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex-shrink-0" />
                                )}
                                <Link to={`/lessons/${lesson.slug}`} className="text-xs text-gray-700 dark:text-gray-300 truncate hover:text-amber-600 dark:hover:text-amber-400">
                                  {lesson.story.title}
                                </Link>
                              </div>
                              <button onClick={(e) => { e.stopPropagation(); toggleLesson(lesson.slug); }} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA */}
                      {nextLesson ? (
                        <Link
                          to={`/lessons/${nextLesson.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all"
                        >
                          Continue: {nextLesson.story.title.length > 25 ? nextLesson.story.title.slice(0, 25) + '...' : nextLesson.story.title}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <div className="text-center py-3">
                          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Plan complete!</p>
                        </div>
                      )}

                      <button
                        onClick={clearAll}
                        className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-2 mt-2"
                      >
                        Clear plan
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

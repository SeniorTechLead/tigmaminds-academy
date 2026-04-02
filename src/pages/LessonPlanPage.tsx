import { useState, useEffect, useCallback, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft, Clock, BookOpen, CheckCircle, Plus, X, ArrowRight,
  Sparkles, Target, Flame, Trophy, Map as MapIcon, Filter, Code2,
  Cpu, FlaskConical, Globe, Lightbulb, ChevronDown, Zap, Search,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessons, SUBJECTS, type Subject, getLessonBySlug, type Lesson } from '../data/lessons';
import { useProgress } from '../contexts/ProgressContext';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

interface PlanEntry { id: number; slug: string; addedAt: string; }
type PlanMap = Map<string, { id: number; addedAt: string }>;

function loadPlanLocal(): PlanMap {
  try {
    const saved = localStorage.getItem('tma_plan');
    if (!saved) return new Map();
    const raw = JSON.parse(saved);
    if (!Array.isArray(raw) || raw.length === 0) return new Map();
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
  } catch { return new Map(); }
}

function savePlanLocal(plan: PlanMap) {
  localStorage.setItem('tma_plan', JSON.stringify([...plan.entries()].map(([slug, { id, addedAt }]) => ({ id, slug, addedAt }))));
}

async function savePlanDB(userId: string, plan: PlanMap) {
  try {
    await supabase.from('user_plans').upsert({
      user_id: userId,
      lesson_entries: [...plan.entries()].map(([slug, { id, addedAt }]) => ({ id, slug, addedAt })),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' });
  } catch {}
}

/* ── Curated learning paths ── */
const LEARNING_GOALS = [
  {
    id: 'python-beginner',
    title: 'Learn Python from Scratch',
    desc: 'No coding experience? Start here. These stories introduce variables, loops, functions, and data — through elephants, fireflies, and monsoons.',
    icon: Code2,
    color: 'from-blue-400 to-indigo-500',
    slugs: ['girl-who-spoke-to-elephants', 'orange-sunsets-assam', 'firefly-festival-of-majuli', 'muga-silk-golden', 'old-banyan-trees-stories'],
    skills: ['Python', 'Variables', 'Loops', 'Functions'],
  },
  {
    id: 'data-science',
    title: 'Data Science & Visualization',
    desc: 'Track cyclones, count rhinos, analyze rainfall. Learn NumPy, Matplotlib, and how to turn raw data into understanding.',
    icon: FlaskConical,
    color: 'from-emerald-400 to-teal-500',
    slugs: ['fishermans-daughter-storm', 'one-horned-guardian', 'monsoon-home', 'dragonfly-paddy-field', 'snow-leopards-promise'],
    skills: ['NumPy', 'Matplotlib', 'Data Analysis', 'Statistics'],
  },
  {
    id: 'biology-ecology',
    title: 'Biology & Ecology',
    desc: 'How do elephants communicate? Why is muga silk golden? What makes fireflies synchronize? Discover the science of living systems.',
    icon: Globe,
    color: 'from-green-400 to-lime-500',
    slugs: ['girl-who-spoke-to-elephants', 'muga-silk-golden', 'firefly-festival-of-majuli', 'wild-orchids-trees', 'bees-built-empire', 'girl-grew-forest'],
    skills: ['Biology', 'Ecology', 'Conservation'],
  },
  {
    id: 'physics-engineering',
    title: 'Physics & Engineering',
    desc: 'Why are sunsets orange? How do bridges grow? What makes a cyclone spin? Build simulators that model real physics.',
    icon: Zap,
    color: 'from-amber-400 to-orange-500',
    slugs: ['orange-sunsets-assam', 'bridge-that-grew', 'fishermans-daughter-storm', 'snow-leopards-promise', 'boy-saw-atoms'],
    skills: ['Physics', 'Engineering', 'Simulation'],
  },
  {
    id: 'electronics',
    title: 'Arduino & Electronics',
    desc: 'LEDs, sensors, circuits. Build physical projects inspired by fireflies, dolphins, and bamboo instruments.',
    icon: Cpu,
    color: 'from-rose-400 to-pink-500',
    slugs: ['firefly-festival-of-majuli', 'river-dolphins-secret', 'dimasa-music', 'cat-who-read-wind'],
    skills: ['Arduino', 'Circuits', 'Sensors'],
  },
  {
    id: 'mythology-stem',
    title: 'World Mythologies Meet STEM',
    desc: 'Algebra from Al-Khwarizmi, geometry from Hindu temples, navigation from Polynesian voyagers. Ancient wisdom, modern code.',
    icon: Lightbulb,
    color: 'from-purple-400 to-violet-500',
    slugs: ['astrolabe-al-khwarizmi', 'dharma-wheel-nalanda', 'noahs-ark-flood', 'bodhi-tree-enlightenment', 'sacred-river-ganges'],
    skills: ['Mathematics', 'History', 'Algorithms'],
  },
];

function getPlanMessage(count: number, completed: number): string {
  if (count === 0) return 'Choose a learning goal below, or pick individual stories.';
  if (completed === count) return 'You completed every story in your plan. What a journey.';
  if (completed > count * 0.7) return 'Almost there — the finish line is in sight!';
  if (completed > 0) return 'Great momentum. Every story makes you stronger.';
  return `${count} stories ready. Pick one and start.`;
}

export default function LessonPlanPage() {
  const { user } = useAuth();
  const [planMap, setPlanMap] = useState<PlanMap>(loadPlanLocal);
  const [view, setView] = useState<'goals' | 'browse' | 'plan'>('goals');
  const [filterSubject, setFilterSubject] = useState<Subject | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedGoal, setExpandedGoal] = useState<string | null>(null);
  const { isStoryComplete } = useProgress();

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
            if (!merged.has(slug) || val.addedAt < merged.get(slug)!.addedAt) merged.set(slug, val);
          }
          setPlanMap(merged);
          savePlanLocal(merged);
          if (merged.size !== dbMap.size) await savePlanDB(user.id, merged);
        } else {
          const local = loadPlanLocal();
          if (local.size > 0 && user) await savePlanDB(user.id, local);
        }
      } catch {}
    })();
  }, [user]);

  const savePlan = useCallback((plan: PlanMap) => {
    savePlanLocal(plan);
    if (user) savePlanDB(user.id, plan);
  }, [user]);

  const selectedSlugs = new Set(planMap.keys());

  const toggleLesson = (slug: string) => {
    setPlanMap(prev => {
      const next = new Map(prev);
      if (next.has(slug)) { next.delete(slug); }
      else {
        const lesson = getLessonBySlug(slug);
        if (lesson) next.set(slug, { id: lesson.id, addedAt: new Date().toISOString() });
      }
      savePlan(next);
      return next;
    });
  };

  const addGoal = (slugs: string[]) => {
    setPlanMap(prev => {
      const next = new Map(prev);
      const now = new Date().toISOString();
      for (const slug of slugs) {
        if (!next.has(slug)) {
          const lesson = getLessonBySlug(slug);
          if (lesson) next.set(slug, { id: lesson.id, addedAt: now });
        }
      }
      savePlan(next);
      return next;
    });
  };

  const clearAll = () => { const empty: PlanMap = new Map(); setPlanMap(empty); savePlan(empty); };

  const selectedLessons = lessons.filter(l => selectedSlugs.has(l.slug));
  const totalHours = selectedLessons.reduce((sum, l) => sum + (l.estimatedHours || 12), 0);
  const completedInPlan = selectedLessons.filter(l => isStoryComplete(l.slug)).length;
  const nextLesson = selectedLessons.find(l => !isStoryComplete(l.slug));
  const progressPct = selectedLessons.length > 0 ? Math.round(completedInPlan / selectedLessons.length * 100) : 0;

  const filteredLessons = useMemo(() => lessons.filter(l => {
    if (filterSubject && !l.subjects?.includes(filterSubject)) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return l.story.title.toLowerCase().includes(q) || l.stem.title.toLowerCase().includes(q) ||
        l.stem.skills.some(s => s.toLowerCase().includes(q));
    }
    return true;
  }), [filterSubject, searchQuery]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-32 pb-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Build Your Lesson Plan
          </h1>
          <p className="text-gray-600 dark:text-gray-300 max-w-xl mx-auto mb-6">
            {getPlanMessage(selectedLessons.length, completedInPlan)}
          </p>
          {/* View toggle */}
          <div className="inline-flex gap-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-xl">
            <button onClick={() => setView('goals')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'goals' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              Learning Goals
            </button>
            <button onClick={() => setView('browse')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${view === 'browse' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              Browse All
            </button>
            <button onClick={() => setView('plan')} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all relative ${view === 'plan' ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm' : 'text-gray-500'}`}>
              My Plan
              {selectedLessons.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-amber-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {selectedLessons.length}
                </span>
              )}
            </button>
          </div>
        </div>
      </section>

      <section className="pb-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">

          {/* ═══ My Plan — full width detailed view ═══ */}
          {view === 'plan' && (
            <div className="max-w-4xl mx-auto">
              {selectedLessons.length === 0 ? (
                <div className="text-center py-16">
                  <Sparkles className="w-12 h-12 text-amber-300 mx-auto mb-4" />
                  <p className="text-lg text-gray-500 dark:text-gray-400 mb-2">Your plan is empty</p>
                  <p className="text-sm text-gray-400 dark:text-gray-500 mb-6">Switch to Learning Goals to pick a path, or browse all stories.</p>
                  <button onClick={() => setView('goals')} className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-amber-600 transition-colors">
                    <Target className="w-4 h-4" /> Choose a Learning Goal
                  </button>
                </div>
              ) : (
                <>
                  {/* Stats bar */}
                  <div className="grid grid-cols-4 gap-4 mb-6">
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                      <p className="text-3xl font-bold text-amber-600">{selectedLessons.length}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Stories</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                      <p className="text-3xl font-bold text-blue-600">{totalHours}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Total Hours</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                      <p className="text-3xl font-bold text-emerald-600">{completedInPlan}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Completed</p>
                    </div>
                    <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-4 text-center">
                      <p className="text-3xl font-bold text-gray-900 dark:text-white">{progressPct}%</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Progress</p>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-8">
                    <div className={`h-full rounded-full transition-all duration-700 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                      style={{ width: `${Math.max(progressPct, 1)}%` }} />
                  </div>

                  {/* Story timeline */}
                  <div className="relative">
                    {/* Vertical line */}
                    <div className="absolute left-5 top-0 bottom-0 w-0.5 bg-gray-200 dark:bg-gray-700" />

                    <div className="space-y-4">
                      {selectedLessons.map((lesson, i) => {
                        const complete = isStoryComplete(lesson.slug);
                        const isNext = !complete && (i === 0 || isStoryComplete(selectedLessons[i - 1]?.slug));
                        const Icon = lesson.stem.icon;
                        return (
                          <div key={lesson.slug} className={`relative pl-14 ${complete ? 'opacity-80' : ''}`}>
                            {/* Timeline dot */}
                            <div className={`absolute left-2.5 top-4 w-6 h-6 rounded-full flex items-center justify-center z-10 ${
                              complete ? 'bg-emerald-500' :
                              isNext ? 'bg-amber-500 ring-4 ring-amber-200 dark:ring-amber-900' :
                              'bg-gray-300 dark:bg-gray-600'
                            }`}>
                              {complete ? <CheckCircle className="w-4 h-4 text-white" /> :
                               <span className="text-[10px] font-bold text-white">{i + 1}</span>}
                            </div>

                            {/* Story card */}
                            <div className={`bg-white dark:bg-gray-800 rounded-xl border-2 p-5 transition-all ${
                              isNext ? 'border-amber-400 dark:border-amber-600 shadow-md' :
                              complete ? 'border-emerald-200 dark:border-emerald-800' :
                              'border-gray-200 dark:border-gray-700'
                            }`}>
                              <div className="flex items-start gap-4">
                                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${lesson.stem.color} flex items-center justify-center flex-shrink-0`}>
                                  <Icon className="w-5 h-5 text-white" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-start justify-between gap-2">
                                    <div>
                                      <Link to={`/lessons/${lesson.slug}`} className="text-base font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400">
                                        {lesson.story.title}
                                      </Link>
                                      {complete && <span className="ml-2 text-xs text-emerald-500 font-semibold">Completed</span>}
                                      {isNext && <span className="ml-2 text-xs text-amber-500 font-semibold">Up next</span>}
                                    </div>
                                    <button onClick={() => toggleLesson(lesson.slug)} className="p-1.5 text-gray-400 hover:text-red-500 flex-shrink-0" title="Remove from plan">
                                      <X className="w-4 h-4" />
                                    </button>
                                  </div>
                                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{lesson.stem.title}</p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    <strong>You'll build:</strong> {lesson.stem.project.title}
                                  </p>
                                  <p className="text-xs text-gray-400 dark:text-gray-500">{lesson.stem.project.description}</p>
                                  <div className="flex flex-wrap gap-1.5 mt-3">
                                    {lesson.subjects?.map(s => {
                                      const sd = SUBJECTS.find(x => x.key === s);
                                      return sd ? <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded ${sd.color}`}>{sd.icon} {sd.key}</span> : null;
                                    })}
                                    {lesson.toolSkills?.map(s => (
                                      <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">{s}</span>
                                    ))}
                                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400">
                                      <Clock className="w-3 h-3 inline mr-0.5" />{lesson.estimatedHours || 12}h
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* CTA for the next lesson */}
                              {isNext && (
                                <Link to={`/lessons/${lesson.slug}`}
                                  className="mt-4 w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-2.5 rounded-lg font-semibold text-sm hover:shadow-lg transition-all">
                                  Start This Lesson <ArrowRight className="w-4 h-4" />
                                </Link>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <button onClick={() => setView('goals')} className="text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium flex items-center gap-1">
                      <Plus className="w-4 h-4" /> Add more stories
                    </button>
                    <button onClick={clearAll} className="text-sm text-gray-400 hover:text-red-500 transition-colors">
                      Clear entire plan
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ═══ Goals / Browse — two-column with sidebar ═══ */}
          {view !== 'plan' && (
          <div className="grid lg:grid-cols-3 gap-8">

            {/* ── Left: Goals or Browse ── */}
            <div className="lg:col-span-2">
              {view === 'goals' ? (
                <div className="space-y-4">
                  {LEARNING_GOALS.map(goal => {
                    const goalLessons = goal.slugs.map(s => getLessonBySlug(s)).filter(Boolean) as Lesson[];
                    const inPlan = goal.slugs.filter(s => selectedSlugs.has(s)).length;
                    const goalComplete = goal.slugs.filter(s => isStoryComplete(s)).length;
                    const isExpanded = expandedGoal === goal.id;
                    const Icon = goal.icon;

                    return (
                      <div key={goal.id} className="bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 overflow-hidden">
                        {/* Goal header */}
                        <button
                          onClick={() => setExpandedGoal(isExpanded ? null : goal.id)}
                          className="w-full text-left p-5 flex items-start gap-4 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
                        >
                          <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${goal.color} flex items-center justify-center flex-shrink-0`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-base font-bold text-gray-900 dark:text-white mb-1">{goal.title}</h3>
                            <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{goal.desc}</p>
                            <div className="flex flex-wrap gap-1.5 mt-2">
                              {goal.skills.map(s => (
                                <span key={s} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-0.5 rounded-full">{s}</span>
                              ))}
                            </div>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            {inPlan > 0 && (
                              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/30 px-2 py-1 rounded-full">
                                {inPlan}/{goal.slugs.length} in plan
                              </span>
                            )}
                            <ChevronDown className={`w-5 h-5 text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                          </div>
                        </button>

                        {/* Expanded: show individual stories */}
                        {isExpanded && (
                          <div className="border-t border-gray-100 dark:border-gray-700 px-5 pb-5">
                            <div className="flex items-center justify-between py-3">
                              <span className="text-xs text-gray-500 dark:text-gray-400">{goalLessons.length} stories &middot; ~{goalLessons.length * 12} hours</span>
                              <button
                                onClick={() => addGoal(goal.slugs)}
                                className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
                              >
                                Add all to plan
                              </button>
                            </div>
                            <div className="space-y-2">
                              {goalLessons.map((lesson, i) => {
                                const selected = selectedSlugs.has(lesson.slug);
                                const complete = isStoryComplete(lesson.slug);
                                return (
                                  <div key={lesson.slug} className={`flex items-center gap-3 p-3 rounded-xl border transition-all ${
                                    selected ? (complete ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10' : 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10')
                                    : 'border-gray-100 dark:border-gray-700 hover:border-gray-200 dark:hover:border-gray-600'
                                  }`}>
                                    <button onClick={() => toggleLesson(lesson.slug)} className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 ${
                                      complete ? 'bg-emerald-500 text-white' : selected ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-amber-200'
                                    }`}>
                                      {complete ? <CheckCircle className="w-4 h-4" /> : selected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4 text-gray-400" />}
                                    </button>
                                    <div className="flex-1 min-w-0">
                                      <div className="flex items-center gap-2">
                                        <span className="text-xs text-gray-400 dark:text-gray-500 font-mono w-5">{i + 1}.</span>
                                        <Link to={`/lessons/${lesson.slug}`} className="text-sm font-semibold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400 truncate">
                                          {lesson.story.title}
                                        </Link>
                                      </div>
                                      <p className="text-xs text-gray-500 dark:text-gray-400 ml-7 truncate">
                                        {lesson.stem.title}
                                      </p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                      <p className="text-xs text-gray-400">{lesson.estimatedHours || 12}h</p>
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ) : (
                /* Browse all stories */
                <div>
                  {/* Search + Filter */}
                  <div className="flex gap-2 mb-4 flex-wrap">
                    <div className="relative flex-1 min-w-[200px]">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search stories, topics, or skills..."
                        className="w-full pl-9 pr-4 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                      />
                    </div>
                    <select
                      value={filterSubject || ''}
                      onChange={(e) => setFilterSubject(e.target.value ? e.target.value as Subject : null)}
                      className="px-3 py-2.5 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm"
                    >
                      <option value="">All Subjects</option>
                      {SUBJECTS.filter(s => lessons.some(l => l.subjects?.includes(s.key))).map(s => (
                        <option key={s.key} value={s.key}>{s.icon} {s.key}</option>
                      ))}
                    </select>
                  </div>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mb-3">{filteredLessons.length} stories</p>

                  {/* Story cards */}
                  <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
                    {filteredLessons.map(lesson => {
                      const selected = selectedSlugs.has(lesson.slug);
                      const complete = isStoryComplete(lesson.slug);
                      return (
                        <div key={lesson.slug} className={`flex items-start gap-3 p-4 rounded-xl border-2 transition-all ${
                          selected ? (complete ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-800 dark:bg-emerald-900/10' : 'border-amber-300 bg-amber-50/50 dark:border-amber-800 dark:bg-amber-900/10')
                          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
                        }`}>
                          <button onClick={() => toggleLesson(lesson.slug)} className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${
                            complete ? 'bg-emerald-500 text-white' : selected ? 'bg-amber-500 text-white' : 'bg-gray-200 dark:bg-gray-700 hover:bg-amber-200'
                          }`}>
                            {complete ? <CheckCircle className="w-4 h-4" /> : selected ? <CheckCircle className="w-4 h-4" /> : <Plus className="w-4 h-4 text-gray-400" />}
                          </button>
                          <div className="flex-1 min-w-0">
                            <Link to={`/lessons/${lesson.slug}`} className="text-sm font-bold text-gray-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400">
                              {lesson.story.title}
                            </Link>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{lesson.stem.title}</p>
                            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-1">{lesson.stem.project.title}: {lesson.stem.project.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {lesson.subjects?.slice(0, 3).map(s => {
                                const sd = SUBJECTS.find(x => x.key === s);
                                return sd ? <span key={s} className={`text-[10px] px-1.5 py-0.5 rounded ${sd.color}`}>{sd.icon} {sd.key}</span> : null;
                              })}
                              {lesson.toolSkills?.slice(0, 2).map(s => (
                                <span key={s} className="text-[10px] px-1.5 py-0.5 rounded bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300">{s}</span>
                              ))}
                            </div>
                          </div>
                          <span className="text-xs text-gray-400 flex-shrink-0">{lesson.estimatedHours || 12}h</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* ── Right: Plan summary ── */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg overflow-hidden">
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-5 text-white">
                  <h2 className="text-lg font-bold flex items-center gap-2">
                    <Target className="w-5 h-5" /> Your Plan
                  </h2>
                  {selectedLessons.length > 0 && (
                    <div className="flex items-center gap-5 mt-3">
                      <div><p className="text-2xl font-bold">{selectedLessons.length}</p><p className="text-xs text-white/80">stories</p></div>
                      <div><p className="text-2xl font-bold">{totalHours}</p><p className="text-xs text-white/80">hours</p></div>
                      <div><p className="text-2xl font-bold">{completedInPlan}</p><p className="text-xs text-white/80">done</p></div>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {selectedLessons.length === 0 ? (
                    <div className="text-center py-6">
                      <Sparkles className="w-10 h-10 text-amber-300 mx-auto mb-3" />
                      <p className="text-sm text-gray-500 dark:text-gray-400">
                        Choose a learning goal or pick stories to build your plan.
                      </p>
                    </div>
                  ) : (
                    <>
                      {/* Progress */}
                      <div className="mb-5">
                        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mb-1.5">
                          <span className="flex items-center gap-1">
                            {progressPct === 100 ? <Trophy className="w-3 h-3 text-amber-500" /> : <Flame className="w-3 h-3 text-orange-500" />}
                            Progress
                          </span>
                          <span className="font-bold">{progressPct}%</span>
                        </div>
                        <div className="w-full h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${progressPct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                            style={{ width: `${Math.max(progressPct, 2)}%` }} />
                        </div>
                      </div>

                      {/* Time estimate */}
                      {completedInPlan < selectedLessons.length && (
                        <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-lg p-3 mb-5">
                          <p className="text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
                            <Clock className="w-3.5 h-3.5 mt-0.5 flex-shrink-0" />
                            <span>~{(selectedLessons.length - completedInPlan) * 12} hours remaining &middot; {Math.ceil((selectedLessons.length - completedInPlan) * 12 / 7)} weeks at 2h/day</span>
                          </p>
                        </div>
                      )}

                      {/* Story list */}
                      <div className="space-y-1.5 max-h-[250px] overflow-y-auto mb-4">
                        {selectedLessons.map(lesson => {
                          const complete = isStoryComplete(lesson.slug);
                          return (
                            <div key={lesson.slug} className={`flex items-center justify-between p-2 rounded-lg ${complete ? 'bg-emerald-50 dark:bg-emerald-900/10' : 'bg-gray-50 dark:bg-gray-700/50'}`}>
                              <div className="flex items-center gap-2 min-w-0">
                                {complete ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <div className="w-4 h-4 rounded-full border-2 border-amber-400 flex-shrink-0" />}
                                <Link to={`/lessons/${lesson.slug}`} className="text-xs text-gray-700 dark:text-gray-300 truncate hover:text-amber-600 dark:hover:text-amber-400">
                                  {lesson.story.title}
                                </Link>
                              </div>
                              <button onClick={() => toggleLesson(lesson.slug)} className="p-1 text-gray-400 hover:text-red-500 flex-shrink-0">
                                <X className="w-3 h-3" />
                              </button>
                            </div>
                          );
                        })}
                      </div>

                      {/* CTA */}
                      {nextLesson ? (
                        <Link to={`/lessons/${nextLesson.slug}`}
                          className="w-full inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white px-4 py-3 rounded-xl font-semibold hover:shadow-lg transition-all">
                          Start: {nextLesson.story.title.length > 22 ? nextLesson.story.title.slice(0, 22) + '...' : nextLesson.story.title}
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      ) : (
                        <div className="text-center py-3">
                          <Trophy className="w-8 h-8 text-amber-500 mx-auto mb-2" />
                          <p className="text-sm font-bold text-gray-900 dark:text-white">Plan complete!</p>
                        </div>
                      )}

                      <button onClick={clearAll} className="w-full text-xs text-gray-400 hover:text-red-500 transition-colors py-2 mt-2">
                        Clear plan
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}

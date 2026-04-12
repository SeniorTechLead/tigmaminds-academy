import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, ArrowRight, CheckCircle, ExternalLink, BookOpen, Wrench, Lightbulb, Gamepad2, Clock, Target, Package, ListChecks, Trophy, Sparkles } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { getLessonBySlug, lessons } from '../data/lessons';
import { getLevelComponents } from '../components/levels';
import { useProgress } from '../contexts/ProgressContext';
import Level0Listener from '../components/Level0Listener';
import diagramRegistry from '../components/reference/DiagramRegistry';
import DiagramZoom from '../components/DiagramZoom';
import { useLessonMeta } from '../contexts/LessonMetaContext';
import { Lock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useBasicsProgress, type BasicsCourseSlug } from '../contexts/BasicsProgressContext';
import SignUpGate from '../components/SignUpGate';

type Level = 'listener' | 'explorer' | 'builder' | 'engineer' | 'creator';

const LEVEL_TABS: { key: Level; label: string; desc: string; color: string }[] = [
  { key: 'listener', label: 'Level 0: Listener', desc: 'No coding needed', color: 'sky' },
  { key: 'explorer', label: 'Level 1: Explorer', desc: 'Intro to coding', color: 'emerald' },
  { key: 'builder', label: 'Level 2: Builder', desc: 'Intermediate', color: 'amber' },
  { key: 'engineer', label: 'Level 3: Engineer', desc: 'Advanced', color: 'rose' },
  { key: 'creator', label: 'Level 4: Creator', desc: 'Capstone project', color: 'purple' },
];

const LEVEL_COMPLETION: { level: 0 | 1 | 2 | 3; name: string; tab: Level }[] = [
  { level: 0, name: 'Level 0: Listener', tab: 'listener' },
  { level: 1, name: 'Level 1: Explorer', tab: 'explorer' },
  { level: 2, name: 'Level 2: Builder', tab: 'builder' },
  { level: 3, name: 'Level 3: Engineer', tab: 'engineer' },
];

export default function LessonPage() {
  const { slug } = useParams<{ slug: string }>();
  const lesson = slug ? getLessonBySlug(slug) : undefined;
  const [activeLevel, setActiveLevelRaw] = useState<Level>('listener');
  const { markLevelComplete, isLevelComplete, canMarkComplete, recordLevelViewed, getStoryProgress, getLevelDetail } = useProgress();
  const { isDemoStory } = useLessonMeta();
  const { user } = useAuth();
  const basicsProgress = useBasicsProgress();
  const isSignedIn = !!user;
  const isDemo = lesson ? isDemoStory(lesson.slug) : false;
  const [clientReady, setClientReady] = useState(false);
  useEffect(() => setClientReady(true), []);

  // Levels 1-4 require sign-in; Level 0 is always free
  const isLevelLocked = (lvl: Level) => {
    if (lvl === 'listener') return false;
    if (!isSignedIn) return true;
    return false;
  };

  // Prevent setting a locked level
  const levelToNumber: Record<Level, number> = { listener: 0, explorer: 1, builder: 2, engineer: 3, creator: 4 };

  const setActiveLevel = (lvl: Level) => {
    if (isLevelLocked(lvl)) return;
    setActiveLevelRaw(lvl);
    // Record that this level was viewed
    if (lesson) recordLevelViewed(lesson.slug, levelToNumber[lvl]);
  };

  if (!lesson) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900">
        <Header />
        <div className="pt-32 pb-20 max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">Lesson Not Found</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-8">This lesson doesn't exist yet.</p>
          <Link href="/" className="inline-flex items-center gap-2 text-amber-600 dark:text-amber-400 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to Home
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const Icon = lesson.stem.icon;
  const currentIndex = lessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? lessons[currentIndex - 1] : null;
  const nextLesson = currentIndex < lessons.length - 1 ? lessons[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero — full illustration */}
      <section className="pt-20">
        {/* Back button overlaying the image */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-2xl overflow-hidden shadow-xl">
            <img
              src={`${lesson.illustration}?v=2`}
              alt={lesson.story.title}
              className="w-full aspect-video object-cover"
            />
            {/* Subtle bottom gradient for text readability — only the lower 40% */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            <button onClick={() => window.history.back()} className="absolute top-4 left-4 inline-flex items-center gap-2 bg-black/40 backdrop-blur-sm text-white/90 hover:text-white px-3 py-1.5 rounded-full text-sm transition-colors cursor-pointer">
              <ArrowLeft className="w-4 h-4" /> Back
            </button>
          </div>
        </div>

        {/* Title and meta below the image */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3 mb-3">
              <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${lesson.stem.color} flex items-center justify-center shadow-md`}>
                <Icon className="w-5 h-5 text-white" />
              </div>
              <span className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">{lesson.stem.title}</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 dark:text-white mb-2">{lesson.story.title}</h1>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mb-4">{lesson.story.tagline}</p>
            <div className="flex flex-wrap items-center gap-3">
              <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-r ${lesson.stem.color} text-white text-xs font-semibold`}>
                {lesson.stem.title}
              </span>
              <span className="text-gray-500 dark:text-gray-400 text-sm">
                {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'All Tracks'}
              </span>
              {lesson.estimatedHours && (
                <span className="flex items-center gap-1 text-gray-500 dark:text-gray-400 text-sm">
                  <Clock className="w-3.5 h-3.5" /> {lesson.estimatedHours}h
                </span>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Lesson Overview (structured lessons only) */}
      {lesson.lesson && (
        <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800">
          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Duration</p>
                  <p className="text-gray-900 dark:text-white font-medium">{lesson.lesson.estimatedTime}</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Target className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Track</p>
                  <p className="text-gray-900 dark:text-white font-medium">
                    {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'All Tracks'}
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Prerequisites</p>
                  <p className="text-gray-900 dark:text-white font-medium">None</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Package className="w-5 h-5 text-amber-500 mt-1 flex-shrink-0" />
                <div>
                  <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide">Materials</p>
                  <p className="text-gray-900 dark:text-white font-medium">{lesson.lesson.materials.length} items needed</p>
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              {/* Learning Objectives */}
              <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Target className="w-5 h-5 text-amber-600" /> Learning Objectives
                </h3>
                <ul className="space-y-3">
                  {lesson.lesson.objectives.map((obj) => (
                    <li key={obj} className="flex items-start gap-3">
                      <CheckCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-1" />
                      <span className="text-sm text-gray-700 dark:text-gray-300">{obj}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Materials List */}
              <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Package className="w-5 h-5 text-amber-600" /> Materials List
                </h3>
                <ul className="space-y-2">
                  {lesson.lesson.materials.map((mat) => (
                    <li key={mat} className="flex items-start gap-3">
                      <span className="text-amber-500 mt-0.5">•</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300">{mat}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Prerequisites */}
            {lesson.lesson.prerequisites.length > 0 && (
              <div className="mt-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-4 flex items-start gap-3">
                <ListChecks className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Prerequisites</p>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{lesson.lesson.prerequisites.join(' • ')}</p>
                </div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Story Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/50 to-white dark:from-gray-800/50 dark:to-gray-900">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-3 mb-8">
            <BookOpen className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Story</h2>
          </div>
          <div className="max-w-none space-y-4">
            {lesson.story.content.split('\n\n').map((paragraph, i) => (
              <p key={i} className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{
                __html: paragraph.trim()
                  .replace(/\*\*(.+?)\*\*/g, '<strong class="text-gray-900 dark:text-white">$1</strong>')
                  .replace(/\*(.+?)\*/g, '<em>$1</em>')
              }} />
            ))}
          </div>
        </div>
      </section>

      {/* Level tabs + content */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
          <div className="max-w-4xl mx-auto">
            {/* Prerequisites section */}
            {(() => {
              const arduinoSlugs = ['river-dolphins-secret', 'fireflies-dont-burn', 'firefly-festival-of-majuli', 'music-dimasa', 'tigers-whisker', 'singing-bamboo'];
              const htmlSlugs = ['boy-who-built-a-library'];
              const codingPrereq = arduinoSlugs.includes(lesson.slug)
                ? { name: 'Arduino Basics', href: '/learn/arduino-basics', courseSlug: 'arduino-basics' as BasicsCourseSlug, total: 6 }
                : htmlSlugs.includes(lesson.slug)
                ? { name: 'Web Basics', href: '/learn/web-basics', courseSlug: 'web-basics' as BasicsCourseSlug, total: 8 }
                : { name: 'Python Basics', href: '/learn/python-basics', courseSlug: 'python-basics' as BasicsCourseSlug, total: 8 };

              const prereqDone = basicsProgress.getCompletedCount(codingPrereq.courseSlug);
              const prereqComplete = prereqDone >= codingPrereq.total;

              // Find stories that list this one in their nextLessons (= this story's prerequisites)
              const priorStories = lessons.filter(l =>
                l.level0?.nextLessons?.some((nl: { slug: string }) => nl.slug === lesson.slug)
              ).slice(0, 3);

              const hasPrereqs = priorStories.length > 0;

              return hasPrereqs ? (
                <div className="mb-10 p-5 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                  <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3 flex items-center gap-2">
                    <ListChecks className="w-4 h-4" /> Before you start
                  </h3>
                  <div className="space-y-2">
                    <Link href={`${codingPrereq.href}?from=${lesson.slug}`}
                      className={`flex items-center gap-3 p-3 rounded-lg border transition-colors ${prereqComplete ? 'bg-emerald-50 dark:bg-emerald-900/10 border-emerald-200 dark:border-emerald-800' : 'bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 hover:border-amber-400 dark:hover:border-amber-600'}`}>
                      <span>{prereqComplete ? '✅' : '📚'}</span>
                      <div className="flex-1">
                        <p className={`text-sm font-medium ${prereqComplete ? 'text-emerald-700 dark:text-emerald-300' : 'text-gray-900 dark:text-white'}`}>{codingPrereq.name}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">
                          {prereqComplete ? 'Complete' : prereqDone > 0 ? `${prereqDone}/${codingPrereq.total} lessons done` : 'Prerequisite coding course'}
                        </p>
                        {!prereqComplete && prereqDone > 0 && (
                          <div className="mt-1 w-24 h-1 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(prereqDone / codingPrereq.total) * 100}%` }} />
                          </div>
                        )}
                      </div>
                      {prereqComplete ? <CheckCircle className="w-4 h-4 text-emerald-500 flex-shrink-0" /> : <ArrowRight className="w-4 h-4 text-gray-400" />}
                    </Link>
                    {priorStories.map(ps => {
                      const reason = ps.level0?.nextLessons?.find((nl: { slug: string; reason: string }) => nl.slug === lesson.slug)?.reason;
                      return (
                        <Link key={ps.slug} href={`/lessons/${ps.slug}`}
                          className="flex items-center gap-3 p-3 rounded-lg bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-600 transition-colors">
                          <span className="text-emerald-500">📖</span>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900 dark:text-white">{ps.story.title}</p>
                            {reason && <p className="text-xs text-gray-500 dark:text-gray-400">{reason}</p>}
                          </div>
                          <ArrowRight className="w-4 h-4 text-gray-400" />
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : null;
            })()}

            <div className="flex items-center gap-3 mb-4">
              <Gamepad2 className="w-6 h-6 text-emerald-500" />
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Try It Yourself</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-300 mb-8">
              Choose your level. Everyone starts with the story — the code gets deeper as you go.
            </p>

            {/* Level tabs — sticky so they stay visible while scrolling */}
            <div className="flex gap-2 mb-10 flex-wrap sticky top-16 z-30 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm py-3 -mx-4 px-4">
              {LEVEL_TABS.map((lvl) => {
                const locked = isLevelLocked(lvl.key);
                return (
                  <button
                    key={lvl.key}
                    onClick={() => !locked && setActiveLevel(lvl.key)}
                    className={`px-5 py-3 rounded-xl font-semibold text-sm transition-all ${
                      locked
                        ? 'bg-gray-100 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 cursor-not-allowed opacity-60'
                        : activeLevel === lvl.key
                          ? lvl.color === 'sky' ? 'bg-sky-500 text-white shadow-lg' :
                            lvl.color === 'emerald' ? 'bg-emerald-600 text-white shadow-lg' :
                            lvl.color === 'amber' ? 'bg-amber-500 text-white shadow-lg' :
                            lvl.color === 'rose' ? 'bg-rose-600 text-white shadow-lg' :
                            'bg-purple-600 text-white shadow-lg'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                    }`}
                  >
                    <span className="block flex items-center gap-1.5 justify-center">
                      {locked && <Lock className="w-3.5 h-3.5" />}
                      {lvl.label}
                    </span>
                    <span className={`block text-xs mt-0.5 ${locked ? 'text-gray-400 dark:text-gray-500' : activeLevel === lvl.key ? 'text-white/80' : 'text-gray-400'}`}>
                      {locked ? (!isSignedIn ? 'Sign up to unlock' : 'Enroll to unlock') : lvl.desc}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Level content — loaded dynamically per story */}
            {(() => {
              const locked = isLevelLocked(activeLevel);
              if (locked) {
                // Non-signed-in users see sign-up gate
                if (!isSignedIn) {
                  return (
                    <div className="max-w-lg mx-auto">
                      <SignUpGate message="Sign up free to access Levels 1-4 with hands-on coding projects, mentorship, and real-world builds" />
                    </div>
                  );
                }
                // Signed-in but not enrolled (non-demo story)
                return (
                  <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-2xl p-12 text-center">
                    <Lock className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-700 dark:text-gray-300 mb-2">Levels 1-4 are available for enrolled students</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-md mx-auto">
                      Level 0 gives you the full science story. Enroll to unlock hands-on coding projects across all levels.
                    </p>
                    <Link href="/programs"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-600 text-white font-semibold rounded-xl transition-colors"
                    >
                      View Programs <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                );
              }

              const { Level1, Level2, Level3, Level4 } = getLevelComponents(lesson.slug);
              return (
                <Suspense fallback={<div className="text-center py-8"><div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin mx-auto" /></div>}>
                  {activeLevel === 'listener' && <Level0Listener lesson={lesson} />}
                  {activeLevel === 'explorer' && Level1 && (() => {
                    const arduinoSlugs = ['river-dolphins-secret', 'fireflies-dont-burn'];
                    const htmlSlugs = ['boy-who-built-a-library'];
                    const prereq = arduinoSlugs.includes(lesson.slug)
                      ? { name: 'Arduino Basics', href: '/learn/arduino-basics', lessons: '6', courseSlug: 'arduino-basics' as BasicsCourseSlug, total: 6 }
                      : htmlSlugs.includes(lesson.slug)
                      ? { name: 'Web Basics', href: '/learn/web-basics', lessons: '8', courseSlug: 'web-basics' as BasicsCourseSlug, total: 8 }
                      : { name: 'Python Basics', href: '/learn/python-basics', lessons: '8', courseSlug: 'python-basics' as BasicsCourseSlug, total: 8 };
                    const pDone = basicsProgress.getCompletedCount(prereq.courseSlug);
                    const pComplete = pDone >= prereq.total;
                    return (
                      <>
                        {!pComplete && (
                        <div className="mb-6 p-4 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 flex items-center gap-3">
                          <span className="text-amber-600 dark:text-amber-400 text-lg">💡</span>
                          <div className="flex-1">
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                              <span className="font-semibold">{pDone > 0 ? 'Almost there!' : 'New to coding?'}</span>{' '}
                              {pDone > 0
                                ? <>You have completed {pDone}/{prereq.total} lessons in <a href={`${prereq.href}?from=${lesson.slug}`} className="text-amber-700 dark:text-amber-400 underline font-medium">{prereq.name}</a>. Finish the rest before starting Level 1.</>
                                : <>Complete the <a href={`${prereq.href}?from=${lesson.slug}`} className="text-amber-700 dark:text-amber-400 underline font-medium">{prereq.name}</a> course first — {prereq.lessons} short lessons that teach you everything you need for Level 1.</>
                              }
                            </p>
                            {pDone > 0 && (
                              <div className="mt-2 w-32 h-1.5 bg-amber-200 dark:bg-amber-800 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(pDone / prereq.total) * 100}%` }} />
                              </div>
                            )}
                          </div>
                        </div>
                        )}
                        <Level1 />
                      </>
                    );
                  })()}
                  {activeLevel === 'builder' && Level2 && <Level2 />}
                  {activeLevel === 'explorer' && !Level1 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-300">Level 1 content for this story is coming soon.</p>
                    </div>
                  )}
                  {activeLevel === 'builder' && !Level2 && (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
                      <p className="text-gray-600 dark:text-gray-300">Level 2 content for this story is coming soon.</p>
                    </div>
                  )}
                  {activeLevel === 'engineer' && (
                    Level3 ? <Level3 /> : (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Level 3 content for this story is coming soon.</p>
                      </div>
                    )
                  )}
                  {activeLevel === 'creator' && (
                    Level4 ? <Level4 /> : (
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8 text-center">
                        <p className="text-gray-600 dark:text-gray-300">Level 4 content for this story is coming soon.</p>
                      </div>
                    )
                  )}
                </Suspense>
              );
            })()}
          </div>
        </section>

      {/* === Story Progress — always visible === */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-gray-50 to-white dark:from-gray-800 dark:to-gray-900">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 border border-gray-200 dark:border-gray-700">
            {/* Progress bar — defer to client to avoid hydration mismatch */}
            {(() => {
              const pct = clientReady ? getStoryProgress(lesson.slug) : 0;
              return (
                <div className="mb-5">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white flex items-center gap-2">
                      <Trophy className="w-5 h-5 text-amber-500" /> Story Progress
                    </h3>
                    <span className="text-sm font-bold text-gray-600 dark:text-gray-400">{pct}%</span>
                  </div>
                  <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full transition-all duration-500 ${pct === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-amber-400 to-orange-500'}`}
                      style={{ width: `${Math.max(pct, 1)}%` }} />
                  </div>
                </div>
              );
            })()}

            {/* Level completion buttons */}
              <div className="flex gap-3">
                {LEVEL_COMPLETION.map(({ level, name }) => {
                  const complete = clientReady && isLevelComplete(lesson.slug, level);
                  const canComplete = clientReady && canMarkComplete(lesson.slug, level);
                  const detail = clientReady ? getLevelDetail(lesson.slug, level) : null;
                  return (
                    <button
                      key={level}
                      onClick={() => {
                        if (!complete && canComplete) {
                          markLevelComplete(lesson.slug, level);
                        }
                      }}
                      disabled={complete || !canComplete}
                      title={!canComplete && !complete ? (level === 0 ? 'Complete the quiz first (60%+ to pass)' : 'View all mini-lessons first') : undefined}
                      className={`flex-1 py-3 px-4 rounded-xl text-sm font-semibold transition-all ${
                        complete
                          ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 cursor-default'
                          : canComplete
                            ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 hover:bg-amber-200 dark:hover:bg-amber-800/30 ring-2 ring-amber-300 dark:ring-amber-700'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      {complete ? (
                        <span className="flex items-center justify-center gap-1"><CheckCircle className="w-4 h-4" /> {name}</span>
                      ) : canComplete ? (
                        <span className="flex items-center justify-center gap-1"><Sparkles className="w-4 h-4" /> Mark {name} Complete</span>
                      ) : (
                        <span>{name} {detail?.viewed ? '(in progress)' : ''}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

      {activeLevel !== 'listener' && (<>
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Lightbulb className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Science Behind the Story</h2>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-12 max-w-3xl">{lesson.stem.description}</p>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Skills */}
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">What You'll Learn</h3>
              <ul className="space-y-3">
                {lesson.stem.skills.map((skill) => {
                  const levelMatch = skill.match(/— (Level \d)/);
                  const levelTag = levelMatch?.[1];
                  const anchorMatch = skill.match(/— (L\d-\d+)$/);
                  const anchor = anchorMatch?.[1];
                  const skillText = skill.replace(/\s*— Level \d.*$/, '');
                  const levelColor = levelTag === 'Level 1' ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300'
                    : levelTag === 'Level 2' ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300'
                    : levelTag === 'Level 3' ? 'bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300'
                    : '';
                  const targetLevel = levelTag === 'Level 1' ? 'explorer' as Level
                    : levelTag === 'Level 2' ? 'builder' as Level
                    : levelTag === 'Level 3' ? 'engineer' as Level
                    : null;

                  const handleSkillClick = () => {
                    if (!targetLevel) return;
                    setActiveLevel(targetLevel);
                    if (anchor) {
                      setTimeout(() => {
                        document.getElementById(anchor)?.scrollIntoView({ behavior: 'smooth' });
                      }, 100);
                    }
                  };

                  return (
                    <li key={skill} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5 text-amber-500" />
                      <span className="text-gray-700 dark:text-gray-300">
                        {skillText}
                        {levelTag && (
                          <button
                            onClick={handleSkillClick}
                            className={`ml-2 inline-block text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer hover:ring-2 hover:ring-offset-1 hover:ring-amber-400 transition-all ${levelColor}`}
                          >
                            {levelTag} →
                          </button>
                        )}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Real World */}
            {((lesson.stem as any).realWorld || []).length > 0 && (
            <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Real-World Applications</h3>
              <ul className="space-y-4">
                {((lesson.stem as any).realWorld || []).map((item: string) => (
                  <li key={item} className="flex items-start gap-3">
                    <ExternalLink className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
            )}
          </div>
        </div>
      </section>

      {/* Project */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-3 mb-4">
            <Wrench className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">The Project</h2>
          </div>

          <div className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border-t-4 border-gradient`} style={{ borderImage: `linear-gradient(to right, var(--tw-gradient-from), var(--tw-gradient-to)) 1` }}>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">{lesson.stem.project.title}</h3>
            <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">{lesson.stem.project.description}</p>

            {(() => {
              const OutputDiagram = lesson.stem.project.outputDiagram ? diagramRegistry[lesson.stem.project.outputDiagram] : null;
              if (!OutputDiagram) return null;
              return (
                <Suspense fallback={<div className="h-48 rounded-xl bg-gray-100 dark:bg-gray-700/30 animate-pulse mb-6" />}>
                  <div className="mb-6">
                    <DiagramZoom>
                      <OutputDiagram />
                    </DiagramZoom>
                  </div>
                </Suspense>
              );
            })()}

            <div className="space-y-4">
              {lesson.stem.project.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-4">
                  <div className={`w-8 h-8 rounded-full bg-gradient-to-r ${lesson.stem.color} flex items-center justify-center flex-shrink-0`}>
                    <span className="text-white text-sm font-bold">{i + 1}</span>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 pt-1">{step}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      </>)}

      {/* === Level 0 CTA: teaser + conversion === */}
      {activeLevel === 'listener' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-900 to-gray-950">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold text-white mb-2 text-center">Ready to Start Coding?</h2>
            <p className="text-gray-400 text-center mb-8">Here is a taste of what Level 1 looks like for this lesson:</p>

            {/* Code snippet teaser */}
            <div className="rounded-xl overflow-hidden mb-8">
              <div className="bg-gray-800 px-4 py-2 flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
                <span className="text-gray-400 text-xs ml-2">Level 1: Explorer — Python</span>
              </div>
              <div className="bg-gray-900 p-4 overflow-x-auto">
                <pre className="text-sm font-mono text-gray-100 leading-relaxed whitespace-pre">{lesson.level0?.codeTeaser || `import numpy as np
import matplotlib.pyplot as plt

# Your first data analysis with Python
data = [45, 52, 38, 67, 41, 55, 48]  # measurements
mean = np.mean(data)

plt.bar(range(len(data)), data)
plt.axhline(mean, color='red', linestyle='--', label=f'Mean: {mean:.1f}')
plt.xlabel("Sample")
plt.ylabel("Value")
plt.title("${lesson.stem.title} — Sample Data")
plt.legend()
plt.show()`}</pre>
              </div>
              <div className="bg-gray-800/50 px-4 py-3">
                <p className="text-xs text-gray-400">
                  This is just the first of 6 coding exercises in Level 1. By Level 4, you will build: {lesson.stem.project.title}.
                </p>
              </div>
            </div>

            {/* Project output teaser */}
            {(() => {
              const OutputDiagram = lesson.stem.project.outputDiagram ? diagramRegistry[lesson.stem.project.outputDiagram] : null;
              if (!OutputDiagram) return null;
              return (
                <div className="mb-8">
                  <p className="text-center text-sm text-gray-300 mb-3">
                    By Level 4, enrolled students build: <strong className="text-amber-400">{lesson.stem.project.title}</strong>
                  </p>
                  <Suspense fallback={<div className="h-48 rounded-xl bg-gray-800 animate-pulse" />}>
                    <DiagramZoom>
                      <OutputDiagram />
                    </DiagramZoom>
                  </Suspense>
                </div>
              );
            })()}

            {/* Three conversion paths */}
            <div className="grid sm:grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-800 rounded-xl p-5 text-center">
                <p className="text-amber-400 font-bold mb-1">Free</p>
                <p className="text-white text-sm font-semibold mb-2">Level 0: Listener</p>
                <p className="text-gray-400 text-xs mb-3">Stories, science concepts, diagrams, quizzes. No coding.</p>
                <p className="text-emerald-400 text-xs font-semibold">You are here</p>
              </div>
              <div className="bg-gradient-to-b from-amber-900/30 to-gray-800 rounded-xl p-5 text-center ring-2 ring-amber-500/50">
                <p className="text-amber-400 font-bold mb-1">Enrolled</p>
                <p className="text-white text-sm font-semibold mb-2">Levels 1-4</p>
                <p className="text-gray-400 text-xs mb-3">Python, NumPy, Matplotlib, real projects, mentorship.</p>
                <Link href="/auth" className="inline-flex items-center gap-1 bg-amber-500 hover:bg-amber-600 text-white px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  Sign Up Free <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
              <div className="bg-gray-800 rounded-xl p-5 text-center">
                <p className="text-amber-400 font-bold mb-1">Stay Updated</p>
                <p className="text-white text-sm font-semibold mb-2">Join Waitlist</p>
                <p className="text-gray-400 text-xs mb-3">Get notified when enrollment opens for your area.</p>
                <Link href="/contact" className="inline-flex items-center gap-1 border border-gray-600 hover:border-amber-500 text-gray-300 hover:text-amber-400 px-4 py-2 rounded-full text-sm font-semibold transition-colors">
                  Notify Me
                </Link>
              </div>
            </div>

            <p className="text-center text-gray-500 text-xs">
              Level 0 is always free. Coding levels (1-4) are part of our {lesson.track === 'school' ? '12-Month School Program' : '24-Week Bootcamp'}.
            </p>
          </div>
        </section>
      )}

      {/* === Level 1+ CTA === */}
      {activeLevel !== 'listener' && (
        <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-white mb-4">Ready to Build This?</h2>
            <p className="text-lg text-white/90 mb-8">
              This lesson is part of our {lesson.track === 'school' ? '12-Month School Program' : lesson.track === 'bootcamp' ? '24-Week Bootcamp' : 'Bootcamp and School Program'}. Apply now and start building.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/auth" className="inline-flex items-center justify-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all">
                Sign Up Free <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <Link href="/programs" className="inline-flex items-center justify-center border-2 border-white text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-amber-600 transition-all">
                View All Programs
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Prev/Next Navigation */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800">
        <div className="max-w-5xl mx-auto flex justify-between items-center">
          {prevLesson ? (
            <Link href={`/lessons/${prevLesson.slug}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <ArrowLeft className="w-4 h-4" />
              <span className="text-sm font-medium">{prevLesson.story.title}</span>
            </Link>
          ) : <div />}
          {nextLesson ? (
            <Link href={`/lessons/${nextLesson.slug}`} className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
              <span className="text-sm font-medium">{nextLesson.story.title}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : <div />}
        </div>
      </section>

      <Footer />
    </div>
  );
}

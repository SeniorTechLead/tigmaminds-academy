import { useState } from 'react';
import Link from 'next/link';
import {
  GraduationCap, Code2, BookOpen, ChevronRight, Sparkles,
  TreePine, Bug, Mountain, Waves, Music, Palette, Star,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

type Grade = '8-10' | '11-12' | 'college' | null;
type CodingLevel = 'none' | 'some' | 'comfortable' | null;

const starterStories: Record<string, { slug: string; title: string; tagline: string; icon: any; subjects: string[] }[]> = {
  'nature': [
    { slug: 'old-banyan-trees-stories', title: 'The Old Banyan Tree', tagline: 'Biology of a tree that lives for centuries', icon: TreePine, subjects: ['Biology', 'Ecology'] },
    { slug: 'honey-hunters-lesson', title: 'The Honey Hunter', tagline: 'Bee colonies, pollination networks, and survival', icon: Bug, subjects: ['Biology', 'Ecology'] },
    { slug: 'girl-grew-forest', title: 'The Girl Who Grew a Forest', tagline: 'One person planted a forest on a sandbar', icon: TreePine, subjects: ['Ecology', 'Environmental Science'] },
  ],
  'physics': [
    { slug: 'fishermans-daughter-storm', title: 'The Fisherman\'s Daughter', tagline: 'Cyclone physics, storm surge, and survival', icon: Waves, subjects: ['Physics', 'Meteorology'] },
    { slug: 'woodpeckers-drum', title: 'The Woodpecker\'s Drum', tagline: 'Impact biomechanics — drumming without brain damage', icon: Music, subjects: ['Physics', 'Biology'] },
    { slug: 'stars-above-ziro', title: 'Stars Above Ziro', tagline: 'Stellar magnitude, HR diagrams, and dark skies', icon: Star, subjects: ['Physics', 'Astronomy'] },
  ],
  'creative': [
    { slug: 'basket-weavers-song', title: 'The Basket Weaver\'s Song', tagline: 'Mathematics of weaving patterns and fiber science', icon: Palette, subjects: ['Materials Science', 'Math'] },
    { slug: 'painted-rain', title: 'The Painted Rain', tagline: 'Optics of rainbows, color science, and light', icon: Palette, subjects: ['Physics', 'Optics'] },
    { slug: 'firefly-festival-of-majuli', title: 'The Firefly Festival', tagline: 'Bioluminescence, circuits, and synchronization', icon: Sparkles, subjects: ['Physics', 'Electronics'] },
  ],
};

export default function StartPage() {
  const [grade, setGrade] = useState<Grade>(null);
  const [coding, setCoding] = useState<CodingLevel>(null);
  const [interest, setInterest] = useState<string | null>(null);

  const step = grade === null ? 1 : coding === null ? 2 : interest === null ? 3 : 4;

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex flex-col">
      <Header />

      <main className="max-w-3xl mx-auto px-4 pt-24 pb-12 flex-1">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-3">
            Where should you start?
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Three quick questions to find your perfect starting point.
          </p>
        </div>

        {/* Progress dots */}
        <div className="flex justify-center gap-3 mb-10">
          {[1, 2, 3, 4].map(s => (
            <div key={s} className={`w-3 h-3 rounded-full transition-all ${
              s < step ? 'bg-emerald-500' : s === step ? 'bg-emerald-500 scale-125' : 'bg-gray-200 dark:bg-gray-700'
            }`} />
          ))}
        </div>

        {/* Step 1: Grade */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">What grade are you in?</h2>
            <div className="grid grid-cols-3 gap-4 max-w-lg mx-auto">
              <button
                onClick={() => setGrade('8-10')}
                className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all text-center group"
              >
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500" />
                <p className="font-semibold text-gray-900 dark:text-white">Grade 8-10</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Age 13-15</p>
              </button>
              <button
                onClick={() => setGrade('11-12')}
                className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all text-center group"
              >
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500" />
                <p className="font-semibold text-gray-900 dark:text-white">Grade 11-12</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Age 16-18</p>
              </button>
              <button
                onClick={() => setGrade('college')}
                className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all text-center group"
              >
                <GraduationCap className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500" />
                <p className="font-semibold text-gray-900 dark:text-white">College / Adult</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Age 18+</p>
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Coding experience */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">Have you coded before?</h2>
            <div className="grid grid-cols-1 gap-3 max-w-md mx-auto">
              {[
                { key: 'none' as const, label: 'Never coded', desc: 'I have not written any code before' },
                { key: 'some' as const, label: 'A little', desc: 'I have tried Scratch, basic HTML, or a few tutorials' },
                { key: 'comfortable' as const, label: 'Comfortable', desc: 'I can write loops and functions in Python or JavaScript' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setCoding(opt.key)}
                  className="p-4 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all text-left"
                >
                  <p className="font-semibold text-gray-900 dark:text-white">{opt.label}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Interest */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center mb-6">What interests you most?</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              {[
                { key: 'nature', label: 'Nature & Life', desc: 'Trees, bees, ecosystems, animals', icon: TreePine, color: 'emerald' },
                { key: 'physics', label: 'Physics & Space', desc: 'Storms, biomechanics, stars', icon: Waves, color: 'blue' },
                { key: 'creative', label: 'Art & Patterns', desc: 'Weaving, color, light, music', icon: Palette, color: 'purple' },
              ].map(opt => (
                <button
                  key={opt.key}
                  onClick={() => setInterest(opt.key)}
                  className="p-6 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all text-center group"
                >
                  <opt.icon className="w-8 h-8 mx-auto mb-2 text-gray-400 group-hover:text-emerald-500" />
                  <p className="font-semibold text-gray-900 dark:text-white">{opt.label}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{opt.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Recommendation */}
        {step === 4 && grade && coding && interest && (
          <div className="space-y-8">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white text-center">Your personalized starting path</h2>

            {/* Python Basics recommendation for non-coders */}
            {coding === 'none' && (
              <div className="p-6 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center flex-shrink-0">
                    <Code2 className="w-5 h-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide">Start here first</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1">Python Basics</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      8 short lessons that teach you to code from scratch. Takes about 2 hours.
                      After this, you will be ready for Level 1 of any story.
                    </p>
                    <Link
                      href="/learn/python-basics"
                      className="inline-flex items-center gap-2 mt-3 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-semibold transition-colors"
                    >
                      Start Python Basics <ChevronRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {coding === 'some' && (
              <div className="p-4 rounded-xl bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  <span className="font-semibold">Optional refresher:</span> If you are not comfortable with Python loops and functions,
                  do the <Link href="/learn/python-basics" className="text-blue-600 dark:text-blue-400 underline">Python Basics</Link> course first (lessons 4-8 cover what you need).
                </p>
              </div>
            )}

            {/* College/adult: suggest bootcamp and capstones */}
            {grade === 'college' && coding === 'comfortable' && (
              <div className="p-6 rounded-xl bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 uppercase tracking-wide">Fast track</p>
                    <h3 className="font-bold text-gray-900 dark:text-white mt-1">Jump straight to capstone projects</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      You have coding experience — skip the basics and build real projects.
                      Each capstone is a portfolio-worthy piece combining science and engineering.
                    </p>
                    <div className="flex gap-3 mt-3">
                      <Link href="/capstones" className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm font-semibold transition-colors">
                        Browse Capstones <ChevronRight className="w-4 h-4" />
                      </Link>
                      <Link href="/programs" className="inline-flex items-center gap-2 px-4 py-2 border border-purple-300 dark:border-purple-700 text-purple-700 dark:text-purple-300 rounded-lg text-sm font-medium transition-colors hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        24-Week Bootcamp
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Recommended first story */}
            <div>
              <p className="text-sm font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-4">
                {coding === 'none' ? 'Then explore this story (Level 0 first)' : grade === 'college' && coding === 'comfortable' ? 'Or start with a story that interests you' : 'Your recommended first story'}
              </p>

              <div className="space-y-3">
                {(starterStories[interest] || starterStories['nature']).map((story, i) => (
                  <Link
                    key={story.slug}
                    href={`/lessons/${story.slug}`}
                    className={`block p-5 rounded-xl border-2 transition-all hover:shadow-md ${
                      i === 0
                        ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10'
                        : 'border-gray-200 dark:border-gray-700 hover:border-emerald-300 dark:hover:border-emerald-700'
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        i === 0 ? 'bg-emerald-100 dark:bg-emerald-900/50' : 'bg-gray-100 dark:bg-gray-800'
                      }`}>
                        <story.icon className={`w-5 h-5 ${i === 0 ? 'text-emerald-600' : 'text-gray-400'}`} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-gray-900 dark:text-white">{story.title}</h3>
                          {i === 0 && <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/50 px-2 py-0.5 rounded-full">RECOMMENDED</span>}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{story.tagline}</p>
                        <div className="flex gap-2 mt-1">
                          {story.subjects.map(s => (
                            <span key={s} className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">{s}</span>
                          ))}
                        </div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-300 flex-shrink-0" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* The path */}
            <div className="p-6 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-800">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Your learning path</h3>
              <div className="space-y-3">
                {[
                  ...(coding === 'none' ? [{ label: 'Python Basics', desc: 'Learn to code (2 hours)', href: '/learn/python-basics', done: false }] : []),
                  { label: 'Level 0 — Listen', desc: 'Read the story, learn the science, take the quiz', href: null, done: false },
                  { label: 'Level 1 — Explore', desc: 'Run your first code experiments', href: null, done: false },
                  { label: 'Level 2 — Build', desc: 'Write code to solve real problems', href: null, done: false },
                  { label: 'Level 3 — Analyze', desc: 'Deep science with data and plots', href: null, done: false },
                  { label: 'Level 4 — Create', desc: 'Build a capstone project', href: null, done: false },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      i === 0 ? 'bg-emerald-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400'
                    }`}>
                      {i + 1}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Start over */}
            <p className="text-center">
              <button
                onClick={() => { setGrade(null); setCoding(null); setInterest(null); }}
                className="text-sm text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
              >
                Start over
              </button>
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

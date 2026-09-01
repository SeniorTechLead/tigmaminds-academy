import { useMemo } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, Trophy, Calendar, MapPin, Users } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { lessonsMeta } from '../data/lessons-meta';
import { useLessonMeta } from '../contexts/LessonMetaContext';
import hackathon from '../data/hackathon.json';

function shuffleArray<T>(arr: T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

const tracks = [
  {
    title: '24-Week Bootcamp',
    audience: 'Career changers & college grads',
    subjects: ['Full-Stack Development', 'AI & Machine Learning', 'Cloud & DevOps'],
    color: 'from-sky-500 to-cyan-400',
    link: '/programs#bootcamp',
  },
  {
    title: '12-Month Curriculum',
    audience: 'Grades 6–12',
    subjects: ['Robotics & Arduino', 'Python & AI', 'Creative Coding'],
    color: 'from-emerald-500 to-green-400',
    link: '/programs#school-program',
  },
];

export default function HomePage() {
  const { isDemoStory } = useLessonMeta();
  const featuredStories = useMemo(() => {
    const demos = lessonsMeta.filter(l => isDemoStory(l.slug));
    return shuffleArray(demos).slice(0, 6);
  }, [isDemoStory]);

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="relative pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-amber-50 via-white to-sky-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 -z-10" />
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full mb-6 text-sm font-medium">
                <Sparkles className="w-4 h-4" />
                Where stories spark STEM curiosity
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-[1.15]">
                Learn to Build
                <span className="block text-gradient mt-1">Through Imagination</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed max-w-lg">
                Programming, AI, and robotics — taught through illustrated stories
                that make science feel like an adventure.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/programs"
                  className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
                >
                  Explore Programs
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
                <Link href="/about"
                  className="inline-flex items-center justify-center border-2 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-8 py-4 rounded-full font-semibold text-lg hover:border-amber-500 hover:text-amber-600 dark:hover:text-amber-400 transition-all duration-200"
                >
                  Our Story
                </Link>
              </div>
            </div>
            <div className="relative animate-slide-up">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img
                  src="/content/illustrations/bridge-grew.webp"
                  alt="Children learning through stories at TigmaMinds Academy"
                  className="w-full object-cover h-[480px]"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hackathon 2026 Concluded & Winners Spotlight */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden bg-slate-950 text-white border-y border-amber-500/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(245,158,11,0.18),transparent_50%),radial-gradient(circle_at_85%_75%,rgba(52,211,153,0.12),transparent_50%)] pointer-events-none" />
        <div
          className="absolute inset-0 opacity-20 pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(251,191,36,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(251,191,36,0.15) 1px, transparent 1px)',
            backgroundSize: '48px 48px',
          }}
        />

        <div className="relative max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-500/10 px-4 py-1.5 text-xs sm:text-sm font-semibold text-amber-300 backdrop-blur-md mb-4 shadow-sm">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Event Concluded Successfully · Guwahati, Assam</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-white mb-5 leading-tight">
              TigmaMinds Hackathon 2026 <span className="bg-gradient-to-r from-amber-300 via-amber-200 to-yellow-400 bg-clip-text text-transparent">Hall of Fame</span>
            </h2>
            <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
              Over 48 intense hours, 15+ finalist teams and 50+ young innovators built real-world software prototypes. 
              Congratulations to all our champions, category winners, and participants!
            </p>
          </div>

          {/* Top 3 Champions Showcase Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            {/* 1st Place */}
            <div className="relative group rounded-2xl border-2 border-amber-400/60 bg-gradient-to-b from-amber-500/15 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md shadow-xl shadow-amber-500/10 hover:border-amber-300 transition-all transform hover:-translate-y-1">
              <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-400 to-yellow-500 px-3 py-0.5 text-xs font-black text-slate-950 uppercase tracking-wider shadow-md">
                🥇 Grand Winner
              </div>
              <div className="mt-2 mb-4">
                <span className="text-xs font-mono text-amber-300 uppercase tracking-widest">1st Place</span>
                <h3 className="text-2xl font-bold text-white mt-1">D Noobs</h3>
                <p className="text-sm font-medium text-amber-200 mt-0.5">Project: <span className="text-white font-semibold">EcoBin</span></p>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Manav Agarwalla (Lead), Rupesh Thakur, Gaurav Deori, Nishanka Borthakur
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300/90 font-medium">
                <span>Awarded 1st Trophy</span>
                <span className="text-amber-400 font-bold">₹ Cash & Certificates</span>
              </div>
            </div>

            {/* 2nd Place */}
            <div className="relative group rounded-2xl border border-slate-700/80 bg-gradient-to-b from-slate-800/50 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md shadow-lg hover:border-slate-500 transition-all transform hover:-translate-y-1">
              <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-slate-200 to-slate-400 px-3 py-0.5 text-xs font-black text-slate-950 uppercase tracking-wider shadow-md">
                🥈 Runner-up
              </div>
              <div className="mt-2 mb-4">
                <span className="text-xs font-mono text-slate-300 uppercase tracking-widest">2nd Place</span>
                <h3 className="text-2xl font-bold text-white mt-1">ZeDev</h3>
                <p className="text-sm font-medium text-slate-200 mt-0.5">Project: <span className="text-white font-semibold">Thyrocell</span></p>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Arindam Chakraborty (Lead), Sanjay Barman, Md Ayan Qurashi, Sumitra Devi Bala Brahma
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-300 font-medium">
                <span>Awarded Runner-Up Trophy</span>
                <span className="text-slate-200 font-bold">₹ Cash & Certificates</span>
              </div>
            </div>

            {/* 3rd Place */}
            <div className="relative group rounded-2xl border border-amber-900/60 bg-gradient-to-b from-amber-950/30 via-slate-900/90 to-slate-950 p-6 backdrop-blur-md shadow-lg hover:border-amber-700/80 transition-all transform hover:-translate-y-1">
              <div className="absolute -top-3.5 left-6 inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r from-amber-600 to-orange-600 px-3 py-0.5 text-xs font-black text-white uppercase tracking-wider shadow-md">
                🥉 Third Prize
              </div>
              <div className="mt-2 mb-4">
                <span className="text-xs font-mono text-amber-400 uppercase tracking-widest">3rd Place</span>
                <h3 className="text-2xl font-bold text-white mt-1">Buri Buri Zaemon</h3>
                <p className="text-sm font-medium text-amber-200 mt-0.5">Project: <span className="text-white font-semibold">ChaiNet</span></p>
              </div>
              <p className="text-xs text-slate-400 mb-4">
                Arjun Bora (Lead), Arunabh Bhattacharyya, Moharnab Gogoi, Bichitra Bikram Hazarika
              </p>
              <div className="pt-3 border-t border-white/10 flex items-center justify-between text-xs text-amber-300 font-medium">
                <span>Awarded 3rd Place Trophy</span>
                <span className="text-amber-200 font-bold">₹ Cash & Certificates</span>
              </div>
            </div>
          </div>

          {/* Special Category Awards preview */}
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6 backdrop-blur-sm mb-12">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
              <p className="text-xs font-bold uppercase tracking-wider text-amber-300">Special Category Recognitions</p>
              <span className="text-xs text-slate-400">4 Outstanding Thematic Honors</span>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <span className="text-[11px] font-semibold text-emerald-400 block mb-1">🛡️ Best Enterprise Solution</span>
                <p className="text-sm font-bold text-white">Team Nibble</p>
                <p className="text-xs text-slate-400">API Threat Defender</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <span className="text-[11px] font-semibold text-sky-400 block mb-1">📈 Commercial Prospect</span>
                <p className="text-sm font-bold text-white">Team Exabyte</p>
                <p className="text-xs text-slate-400">Flow</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <span className="text-[11px] font-semibold text-green-400 block mb-1">🌿 Sustainability Focus</span>
                <p className="text-sm font-bold text-white">Team Rocket</p>
                <p className="text-xs text-slate-400">Waste2Worth</p>
              </div>
              <div className="rounded-xl border border-white/5 bg-slate-900/60 p-3.5">
                <span className="text-[11px] font-semibold text-purple-400 block mb-1">🤝 Community Solution</span>
                <p className="text-sm font-bold text-white">Brahmāstra</p>
                <p className="text-xs text-slate-400">AaharSetu</p>
              </div>
            </div>
          </div>

          {/* Actions & Stats Row */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6 pt-6 border-t border-white/10">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs sm:text-sm text-slate-300">
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Calendar className="w-4 h-4 text-amber-400" />
                {hackathon.dates}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <MapPin className="w-4 h-4 text-amber-400" />
                {hackathon.location}
              </span>
              <span className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Users className="w-4 h-4 text-amber-400" />
                15+ Teams · 50+ Builders
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <Link
                href="/hackathon"
                className="inline-flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-white px-7 py-3.5 rounded-xl font-bold hover:brightness-110 shadow-lg shadow-amber-500/20 transition transform hover:-translate-y-0.5"
              >
                <Trophy className="w-4 h-4" />
                See Full Winners & Photos
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Story → STEM Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Every Lesson Begins with a Story
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              We pair illustrated children's stories with real STEM projects.
              Curiosity first, curriculum second.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredStories.map((lesson, index) => {
              const Icon = lesson.stemIcon;
              return (
                <Link href={`/lessons/${lesson.slug}`}
                  key={lesson.slug}
                  className="group bg-white dark:bg-gray-800 rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden animate-scale-in"
                  style={{ animationDelay: `${index * 80}ms` }}
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={lesson.illustration}
                      alt={lesson.storyTitle}
                      className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
                    <div className={`absolute top-4 left-4 bg-gradient-to-r ${lesson.stemColor} w-10 h-10 rounded-full flex items-center justify-center shadow-lg`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                  </div>
                  <div className="p-6">
                    <p className="text-sm font-semibold text-amber-600 dark:text-amber-400 mb-1 uppercase tracking-wide">
                      Story &rarr; Lesson
                    </p>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
                      {lesson.storyTitle}
                    </h3>
                    <p className={`text-sm font-semibold bg-gradient-to-r ${lesson.stemColor} bg-clip-text text-transparent mb-3`}>
                      &rarr; {lesson.stemTitle}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed">
                      {lesson.stemDescription}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="text-center mt-12">
            <Link href="/lessons"
              className="inline-flex items-center text-amber-600 dark:text-amber-400 font-semibold text-lg hover:text-amber-700 dark:hover:text-amber-300 transition-colors"
            >
              Browse All {lessonsMeta.length} Lessons
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Two Tracks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Two Paths, One Mission</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300">
              Whether you're switching careers or just starting to dream — there's a track for you.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {tracks.map((track) => (
              <div
                key={track.title}
                className="relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-100 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300"
              >
                <div className={`absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r ${track.color}`} />
                <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 mt-2">{track.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 mb-6 font-medium">{track.audience}</p>
                <ul className="space-y-3">
                  {track.subjects.map((subject) => (
                    <li key={subject} className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full bg-gradient-to-r ${track.color}`} />
                      <span className="text-gray-700 dark:text-gray-300 font-medium">{subject}</span>
                    </li>
                  ))}
                </ul>
                <Link href={track.link}
                  className="inline-flex items-center mt-6 text-sky-600 dark:text-sky-400 font-semibold hover:text-sky-700 dark:hover:text-sky-300 transition-colors"
                >
                  View Details
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured: 12-Month Curriculum Journey */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-amber-50/50 to-white dark:from-amber-900/10 dark:to-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-8">
            <span className="inline-block text-[11px] font-bold text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30 px-3 py-1 rounded-full uppercase tracking-wider mb-4">12-Month Curriculum</span>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              From Blinking LED to <span className="text-gradient">Autonomous Robot</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              12 months. Python AND Arduino. Build a robot that sees, thinks, and moves on its own.
            </p>
          </div>

          {/* Month-by-month journey */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
            {[
              { month: 'Months 1-3', title: 'Circuits & Code', desc: 'First LED blink, first Python program, sensors reading the real world', icon: '💡' },
              { month: 'Months 4-6', title: 'Data & Dashboards', desc: 'Arduino collects data, Python visualizes it — live sensor dashboards', icon: '📊' },
              { month: 'Months 7-9', title: 'Smart Robots', desc: 'Motors, wheels, obstacle avoidance — Python AI brain controls Arduino body', icon: '🤖' },
              { month: 'Months 10-12', title: 'AI Capstone', desc: 'Machine learning on sensor data, wireless control, graduation showcase', icon: '🎓' },
            ].map((phase, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-200 dark:border-gray-700 text-center hover:shadow-lg transition-shadow">
                <span className="text-3xl block mb-3">{phase.icon}</span>
                <p className="text-[10px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider">{phase.month}</p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mt-1 mb-2">{phase.title}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 leading-relaxed">{phase.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center">
            <Link href="/curriculum"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-lg shadow-amber-500/25 transition-all hover:-translate-y-0.5"
            >
              View Full 48-Week Curriculum <ArrowRight className="w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">4 tracks available: Robotics, Python & AI, Creative Coding, or Combined</p>
          </div>
        </div>
      </section>

      {/* Illustrated CTA Banner */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/content/illustrations/dancing-deer.webp"
            alt=""
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-gray-900/90 via-gray-900/75 to-gray-900/60" />
        </div>
        <div className="relative max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            The Best Time to Start Is Now
          </h2>
          <p className="text-xl text-white/85 mb-8 leading-relaxed max-w-2xl mx-auto">
            Join a community of learners who believe that code, circuits, and creativity
            can change the world — one story at a time.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/programs"
              className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              Explore Programs
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
            <Link href="/hackathon"
              className="inline-flex items-center justify-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-200"
            >
              <Trophy className="mr-2 h-5 w-5" />
              Hackathon 2026 Winners
            </Link>
            <Link href="/contact"
              className="inline-flex items-center justify-center border-2 border-white/80 text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white hover:text-gray-900 transition-all duration-200"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

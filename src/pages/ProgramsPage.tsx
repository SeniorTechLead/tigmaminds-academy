import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, BookOpen, Code2, Sparkles, Lock, Unlock,
  ChevronDown, GraduationCap, Lightbulb, Wrench, Rocket,
  Users, FlaskConical, BarChart3, Award,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

/* ── "What Students Will Build" — real capstone projects from real lessons ── */
const capstoneProjects = [
  {
    story: 'The Girl Who Spoke to Elephants',
    slug: 'girl-who-spoke-to-elephants',
    project: 'Elephant Rumble Classifier',
    description: 'Train a machine-learning model to classify elephant infrasound rumbles by type — contact calls, warnings, and greetings — using real acoustic data.',
    skills: ['Python', 'NumPy', 'Matplotlib', 'Data Analysis'],
    color: 'from-emerald-400 to-teal-500',
  },
  {
    story: 'Why Assam\'s Sunsets Are Orange',
    slug: 'orange-sunsets-assam',
    project: 'Sunset Color Simulator',
    description: 'Build a program that predicts tonight\'s sunset color from atmospheric conditions — humidity, aerosols, and sun angle — using spectral physics and ML.',
    skills: ['Python', 'Physics', 'Machine Learning', 'Data Viz'],
    color: 'from-orange-400 to-red-500',
  },
  {
    story: 'The Fisherman\'s Daughter and the Storm',
    slug: 'fishermans-daughter-storm',
    project: 'Cyclone Track Visualizer',
    description: 'Plot historical cyclone paths across the Bay of Bengal, color-coded by intensity, with landfall annotations and decade-over-decade trend analysis.',
    skills: ['Python', 'Matplotlib', 'CSV Parsing', 'Geography'],
    color: 'from-slate-400 to-blue-500',
  },
  {
    story: 'The Map Maker\'s Granddaughter',
    slug: 'map-makers-granddaughter',
    project: 'Interactive Neighborhood Map',
    description: 'Create a digital map with GPS coordinates, landmarks, and proper geographic projections — your own mini-GIS system built in Python.',
    skills: ['Python', 'GIS', 'Coordinate Systems', 'Data Viz'],
    color: 'from-emerald-400 to-cyan-500',
  },
  {
    story: 'The Firefly Festival of Majuli',
    slug: 'firefly-festival-of-majuli',
    project: 'LED Sync Circuit',
    description: 'Build an Arduino circuit where LEDs synchronize their blinking — mimicking how fireflies on Majuli coordinate their flashes across the dark.',
    skills: ['Arduino', 'Electronics', 'Circuits', 'Biology'],
    color: 'from-yellow-400 to-green-500',
  },
];

/* ── How It Works steps ── */
const steps = [
  { num: '1', title: 'Pick any story', desc: 'Browse 130 illustrated tales from Northeast India and world traditions.' },
  { num: '2', title: 'Read the story', desc: 'It\'s a real children\'s tale — elephants, fireflies, silk, storms.' },
  { num: '3', title: 'Discover the science', desc: 'Each story hides real STEM — physics, biology, data science.' },
  { num: '4', title: 'Code a project', desc: 'Build something inspired by the science: simulators, classifiers, circuits.' },
  { num: '5', title: 'Grow your portfolio', desc: 'One story at a time, one project at a time.' },
];

/* ── Who Is This For ── */
const audiences = [
  { icon: GraduationCap, title: 'Students aged 10-16', desc: 'Curious about science and coding but bored by textbooks.' },
  { icon: Users, title: 'Homeschooling families', desc: 'Looking for engaging, story-based STEM curriculum.' },
  { icon: Lightbulb, title: 'Teachers', desc: 'Wanting lesson plans that start with wonder, not worksheets.' },
  { icon: Rocket, title: 'Parents', desc: 'Who want their children to love learning, not dread it.' },
];

/* ── FAQ ── */
const faqs = [
  { q: 'What do I need to get started?', a: 'A computer or tablet with internet access. Our Python environment runs in the browser — no installation needed. Arduino simulations work without hardware.' },
  { q: 'Is this only for students in India?', a: 'The stories draw from Northeast India — elephants in Kaziranga, fireflies on Majuli, living root bridges in Meghalaya. But the STEM content is universal. Rayleigh scattering works the same everywhere.' },
  { q: 'What age range is this for?', a: 'Designed for ages 10-16, but anyone curious can benefit. The five levels scale from no prior knowledge to advanced Python projects.' },
  { q: 'How is this different from free YouTube tutorials?', a: 'Every concept starts with a story, so you understand WHY before HOW. You build real projects, not toy exercises. And the five-level progression means you go as deep as you want — not just surface-level.' },
  { q: 'Do I need to know how to code?', a: 'No. Level 0 (Listener) and Level 1 (Explorer) require zero coding. Levels 2-4 introduce Python gradually, with every line of code explained in context.' },
];

function FAQ({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden">
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between p-5 text-left hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
        <h3 className="text-base font-semibold text-gray-900 dark:text-white pr-4">{q}</h3>
        <ChevronDown className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <div className={`overflow-hidden transition-all duration-300 ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
        <p className="px-5 pb-5 text-gray-600 dark:text-gray-300 leading-relaxed">{a}</p>
      </div>
    </div>
  );
}

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Learn STEM through<br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">stories that stay with you</span>
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 mb-8">
            Ages 10-16 &middot; No experience needed &middot; Start free
          </p>
          <Link
            to="/lessons"
            className="inline-flex items-center bg-gradient-to-r from-amber-500 to-orange-500 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all"
          >
            Browse Free Lessons <ArrowRight className="ml-2 w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* ── What You Get (Free) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-10">
            <Unlock className="w-6 h-6 text-emerald-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What You Get — Free</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: '130 illustrated stories', desc: 'From Northeast India, Hindu, Buddhist, Christian, and Islamic traditions — each one a doorway into real science.' },
              { icon: FlaskConical, title: 'Level 0 for every story', desc: 'The science explained through the story, with diagrams. No code required — just curiosity.' },
              { icon: Sparkles, title: 'First 2 concepts free', desc: 'Try the first two concepts of each lesson. Sign up to continue — no credit card needed.' },
              { icon: BarChart3, title: '90+ reference topics', desc: 'An interactive library covering physics, biology, chemistry, math, and coding.' },
              { icon: Code2, title: 'In-browser Python', desc: 'Run code right in the browser. No installation, no setup, no barriers.' },
              { icon: Award, title: 'No credit card needed', desc: 'Create a free account and start learning immediately.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── What You Get (Enrolled) ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/40 dark:from-gray-900 dark:to-gray-800/40">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-10">
            <Lock className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">What You Get — Enrolled</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-6 mb-10">
            {[
              { icon: Rocket, title: 'All 5 levels per story', desc: 'Listener, Explorer, Builder, Engineer, Creator — go from zero knowledge to a finished project.' },
              { icon: Code2, title: 'Hands-on Python projects', desc: 'Build real programs: simulators, classifiers, data visualizers, and interactive tools.' },
              { icon: Wrench, title: 'Interactive tools', desc: 'Beat machine, logic gate simulator, Gaussian explorer, and more — learn by doing.' },
              { icon: Award, title: 'Progress tracking', desc: 'See where you are, what you\'ve completed, and what comes next.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
          <div className="text-center">
            <div className="inline-block bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-6 py-3 rounded-full text-sm font-semibold">
              Pricing coming soon — sign up free to be notified
            </div>
          </div>
        </div>
      </section>

      {/* ── Two Ways to Learn ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Two Ways to Learn</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">Choose what works for your family. Both use the same platform and curriculum.</p>
          <div className="grid md:grid-cols-2 gap-8">
            {/* Online */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-gray-800">
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
                <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Online — Self-Paced</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Learn anywhere, anytime. Read stories, explore concepts, code projects in your browser.</p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> All 130 stories with 5 levels each</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> In-browser Python coding — no setup</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Interactive reference library</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Progress tracking and certificates</li>
                <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Learn at your own pace</li>
              </ul>
              <p className="mt-6 text-sm font-semibold text-blue-600 dark:text-blue-400">Free to start — sign up to unlock all levels</p>
            </div>
            {/* In-Person */}
            <div className="rounded-2xl border-2 border-amber-300 dark:border-amber-700 p-8 bg-amber-50/50 dark:bg-amber-900/10">
              <div className="w-12 h-12 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center mb-4">
                <Users className="w-6 h-6 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">In-Person — Mentor-Led Workshops</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Weekly sessions with a mentor. Hands-on projects, peer collaboration, immediate feedback.</p>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Everything in Online, plus:</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Small group workshops (max 12 students)</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Mentor guidance on projects</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Peer collaboration and presentations</li>
                <li className="flex items-start gap-2"><span className="text-amber-500 mt-0.5">✓</span> Offline experiments with real materials</li>
              </ul>
              <p className="mt-6 text-sm font-semibold text-amber-600 dark:text-amber-400">Coming to select cities — join the waitlist</p>
              <Link to="/contact" className="inline-flex items-center gap-1.5 mt-2 text-sm text-amber-600 dark:text-amber-400 hover:underline font-medium">
                Express interest <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">How It Works</h2>
          <div className="space-y-8">
            {steps.map((step) => (
              <div key={step.num} className="flex gap-5 items-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg">
                  {step.num}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">{step.title}</h3>
                  <p className="text-gray-600 dark:text-gray-300">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── What Students Will Build ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">What Students Will Build</h2>
          <p className="text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            Real capstone projects from real lessons. Each one starts with a story and ends with working code.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {capstoneProjects.map((proj) => (
              <Link
                key={proj.slug}
                to={`/lessons/${proj.slug}`}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-amber-200 dark:hover:border-amber-800 transition-all group block"
              >
                <div className={`h-2 w-16 rounded-full bg-gradient-to-r ${proj.color} mb-4`} />
                <p className="text-xs font-semibold text-amber-600 dark:text-amber-400 uppercase tracking-wide mb-2">
                  {proj.story}
                </p>
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                  {proj.project}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed mb-4">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {proj.skills.map((skill) => (
                    <span key={skill} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2 py-1 rounded-full">
                      {skill}
                    </span>
                  ))}
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who Is This For ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">Who Is This For</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((aud) => {
              const Icon = aud.icon;
              return (
                <div key={aud.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 dark:text-white mb-2">{aud.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{aud.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/30">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Common Questions</h2>
          <div className="space-y-3">
            {faqs.map(({ q, a }) => (
              <FAQ key={q} q={q} a={a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Start with any story — it's free</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            130 stories. Real science. No credit card. Pick one that interests you and see where it leads.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/lessons" className="inline-flex items-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Browse Lessons <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/students" className="inline-flex items-center bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all">
              Sign Up Free <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

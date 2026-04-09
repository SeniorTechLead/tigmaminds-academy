import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ArrowRight, BookOpen, Code2, Sparkles, Lock, Unlock,
  ChevronDown, GraduationCap, Lightbulb, Wrench, Rocket,
  Users, FlaskConical, BarChart3, Award, Loader2, CheckCircle, MapPin,
} from 'lucide-react';
import { supabase } from '../lib/supabase';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CheckoutButton from '../components/CheckoutButton';
import { useSubscription } from '../contexts/SubscriptionContext';
import { useAuth } from '../contexts/AuthContext';
import { FEATURES } from '../config/features';
import { lessons, SUBJECTS } from '../data/lessons';
import { problems } from '../data/playground-problems';
import { getLessonOrigin } from '../data/lesson-types';

/* ── "What Students Will Build" — real capstone projects from real lessons ── */
const capstoneProjects = [
  {
    story: 'The Girl Who Spoke to Elephants',
    slug: 'girl-who-spoke-to-elephants',
    project: 'Elephant Rumble Classifier',
    description: 'Train a machine-learning model to classify elephant infrasound rumbles by type — contact calls, warnings, and greetings — using real acoustic data.',
    skills: ['Python', 'NumPy', 'Machine Learning'],
    color: 'from-emerald-400 to-teal-500',
  },
  {
    story: 'The Boy Who Built a Library',
    slug: 'boy-who-built-a-library',
    project: 'Library Management System',
    description: 'Build a full-stack library backend with search, recommendations, analytics, and business rules — from data modeling to deployed API.',
    skills: ['HTML/CSS/JS', 'REST APIs', 'SQL', 'Architecture'],
    color: 'from-violet-400 to-purple-500',
  },
  {
    story: 'The Firefly Festival of Majuli',
    slug: 'firefly-festival-of-majuli',
    project: 'Kuramoto Synchronization Simulator',
    description: 'Model how thousands of fireflies synchronize their flashes using the Kuramoto coupled oscillator model — from chaos to emergent order.',
    skills: ['Python', 'Physics', 'NumPy', 'Arduino'],
    color: 'from-yellow-400 to-green-500',
  },
  {
    story: 'The River Dolphin\'s Secret',
    slug: 'river-dolphins-secret',
    project: 'Underwater Acoustic Modem',
    description: 'Design a digital communication system that transmits messages through water using sound — inspired by dolphin echolocation.',
    skills: ['Arduino', 'Signal Processing', 'Physics'],
    color: 'from-blue-400 to-cyan-500',
  },
  {
    story: 'The Fisherman\'s Daughter and the Storm',
    slug: 'fishermans-daughter-storm',
    project: 'Cyclone Track Visualizer',
    description: 'Plot historical cyclone paths across the Bay of Bengal, color-coded by intensity, with landfall predictions and trend analysis.',
    skills: ['Python', 'Matplotlib', 'Data Analysis'],
    color: 'from-slate-400 to-blue-500',
  },
  {
    story: 'The Dragonfly and the Paddy Field',
    slug: 'dragonfly-paddy-field',
    project: 'Crop Health Monitor',
    description: 'Analyze drone imagery of paddy fields to detect diseased regions, estimate crop health, and generate actionable reports.',
    skills: ['Python', 'Computer Vision', 'NumPy'],
    color: 'from-lime-400 to-green-500',
  },
  {
    story: 'Why the Muga Silk Is Golden',
    slug: 'muga-silk-golden',
    project: 'Silk Fiber Analyzer',
    description: 'Build a materials science pipeline that tests tensile strength, elasticity, and luster of different silk fibers — comparing muga to mulberry.',
    skills: ['Python', 'Materials Science', 'Data Viz'],
    color: 'from-amber-400 to-yellow-500',
  },
  {
    story: 'The Dancing Deer of Kaziranga',
    slug: 'dancing-deer-kaziranga',
    project: 'Wildlife Population Estimator',
    description: 'Model endangered Sangai deer population dynamics using Leslie matrices, habitat capacity, and conservation intervention scenarios.',
    skills: ['Python', 'Ecology', 'Statistics'],
    color: 'from-rose-400 to-pink-500',
  },
  {
    story: 'Why Assam\'s Sunsets Are Orange',
    slug: 'orange-sunsets-assam',
    project: 'Sunset Color Simulator',
    description: 'Predict tonight\'s sunset color from atmospheric conditions — humidity, aerosols, and sun angle — using Rayleigh scattering physics.',
    skills: ['Python', 'Physics', 'Machine Learning'],
    color: 'from-orange-400 to-red-500',
  },
];

/* ── How It Works steps ── */
const steps = [
  { num: '1', title: 'Pick any story', desc: 'Browse our growing library of illustrated tales from Northeast India and world traditions.' },
  { num: '2', title: 'Read the story', desc: 'It\'s a real children\'s tale — elephants, fireflies, silk, storms.' },
  { num: '3', title: 'Discover the science', desc: 'Each story hides real STEM — physics, biology, data science.' },
  { num: '4', title: 'Code a project', desc: 'Build something inspired by the science: simulators, classifiers, circuits.' },
  { num: '5', title: 'Grow your portfolio', desc: 'One story at a time, one project at a time.' },
];

/* ── Who Is This For ── */
const audiences = [
  { icon: GraduationCap, title: 'Students, ages 10 and up', desc: 'Curious about science and coding but bored by textbooks. Start with stories, end with real projects.' },
  { icon: Rocket, title: 'Career changers', desc: 'Switch into tech with a portfolio of real projects — not toy exercises. Our bootcamp gets you job-ready.' },
  { icon: Users, title: 'College students', desc: 'Supplement your CS degree with hands-on projects that go beyond lecture slides.' },
  { icon: Lightbulb, title: 'Teachers & schools', desc: 'Lesson plans that start with wonder, not worksheets. Integrates with existing curriculum.' },
];

/* ── FAQ ── */
const faqs = [
  { q: 'What do I need to get started?', a: 'A computer or tablet with internet access. Our Python environment runs in the browser — no installation needed. Arduino simulations work without hardware.' },
  { q: 'Is this only for students in India?', a: 'The stories draw from Northeast India — elephants in Kaziranga, fireflies on Majuli, living root bridges in Meghalaya. But the STEM content is universal. Rayleigh scattering works the same everywhere.' },
  { q: 'What age range is this for?', a: 'Designed for ages 10 and up. The five levels scale from no prior knowledge to university-level capstone projects — younger students start with stories and visuals, older learners dive into Python, SQL, and real data science.' },
  { q: 'How is this different from free YouTube tutorials?', a: 'Every concept starts with a story, so you understand WHY before HOW. You build real projects, not toy exercises. And the five-level progression means you go as deep as you want — not just surface-level.' },
  { q: 'Do I need to know how to code?', a: 'No. Level 0 (Listener) and Level 1 (Explorer) require zero coding. Levels 2-4 introduce Python gradually, with every line of code explained in context.' },
];

function WaitlistForm({ isIndia }: { isIndia: boolean }) {
  const [form, setForm] = useState({ parentName: '', email: '', phone: '', childAge: '', city: '', role: '', callback: false });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: form.parentName,
        email: form.email,
        subject: `In-Person Waitlist \u2014 ${form.city}`,
        message: `City: ${form.city}\nRole: ${form.role}\nLearner age: ${form.childAge}`,
      }]);

    setSubmitting(false);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ parentName: '', email: '', childAge: '', city: '', role: '' });
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-6 sm:p-8 text-center">
        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">You're on the list!</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">We'll email you when workshops open in your city.</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl border-2 border-purple-200 dark:border-purple-800 p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-4">
        <MapPin className="w-6 h-6 text-purple-500" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Join the Workshop Waitlist</h3>
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6">
        Mentor-led workshops in Guwahati and Thiruvananthapuram — 24-week bootcamps for career changers and 12-month programs for students. Small cohorts, dedicated mentors, real outcomes.
      </p>

      {status === 'error' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
            <input type="text" name="parentName" value={form.parentName} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
            <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="you@example.com" />
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">I am a *</label>
            <select name="role" value={form.role} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Select</option>
              <option value="student">Student</option>
              <option value="parent">Parent / Guardian</option>
              <option value="teacher">Teacher</option>
              <option value="self-learner">Self-learner (adult)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Learner's Age *</label>
            <select name="childAge" value={form.childAge} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Select age</option>
              {Array.from({ length: 9 }, (_, i) => i + 10).map((age) => (
                <option key={age} value={age}>{age} years</option>
              ))}
              <option value="18+">18+</option>
            </select>
          </div>
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
            <select name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
              <option value="">Select city</option>
              <option value="Guwahati">Guwahati</option>
              <option value="Thiruvananthapuram">Thiruvananthapuram</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-500 to-indigo-500 text-white py-3 rounded-xl font-semibold hover:shadow-lg transition-all disabled:opacity-50">
          {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Joining...</> : 'Join Waitlist'}
        </button>
      </form>
    </div>
  );
}

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

/* ── Bootcamp specializations with week-by-week curriculum ── */
const bootcampTracks = [
  {
    name: 'Full-Stack Development',
    color: 'sky',
    weeks: [
      { phase: 'Weeks 1–4: Foundations', topics: ['HTML/CSS/JS fundamentals', 'Git & command line', 'Responsive design', 'DOM manipulation'] },
      { phase: 'Weeks 5–8: Frontend', topics: ['React components & state', 'TypeScript', 'API integration (REST)', 'Routing & forms'] },
      { phase: 'Weeks 9–12: Backend', topics: ['Node.js & Express', 'SQL & PostgreSQL', 'Authentication & sessions', 'REST API design'] },
      { phase: 'Weeks 13–16: Advanced', topics: ['Database modeling & migrations', 'Testing (unit, integration, E2E)', 'CI/CD pipelines', 'Cloud deployment (Vercel/AWS)'] },
      { phase: 'Weeks 17–20: Projects', topics: ['Build 2 production-grade apps', 'Code review with mentor', 'Performance optimization', 'Security best practices'] },
      { phase: 'Weeks 21–24: Career', topics: ['Portfolio site', 'Resume & LinkedIn review', 'Mock technical interviews', 'Job referral introductions'] },
    ],
  },
  {
    name: 'AI & Machine Learning',
    color: 'rose',
    weeks: [
      { phase: 'Weeks 1–4: Python & Data', topics: ['Python fluency', 'NumPy & Pandas', 'Data cleaning & exploration', 'Matplotlib & Seaborn'] },
      { phase: 'Weeks 5–8: Classical ML', topics: ['Regression & classification', 'Decision trees & random forests', 'Feature engineering', 'Model evaluation & cross-validation'] },
      { phase: 'Weeks 9–12: Deep Learning', topics: ['Neural network fundamentals', 'PyTorch basics', 'CNNs for image classification', 'Transfer learning'] },
      { phase: 'Weeks 13–16: NLP & Applications', topics: ['Text preprocessing & embeddings', 'Sentiment analysis', 'LLM APIs & prompt engineering', 'Building AI-powered apps'] },
      { phase: 'Weeks 17–20: Projects', topics: ['Build 2 end-to-end ML pipelines', 'Model deployment (FastAPI + Docker)', 'Experiment tracking (MLflow)', 'Code review with mentor'] },
      { phase: 'Weeks 21–24: Career', topics: ['ML portfolio & case studies', 'Technical writing', 'Mock ML interviews', 'Job referral introductions'] },
    ],
  },
  {
    name: 'Cloud & DevOps',
    color: 'violet',
    weeks: [
      { phase: 'Weeks 1–4: Linux & Networking', topics: ['Linux command line mastery', 'Networking fundamentals (TCP/IP, DNS, HTTP)', 'Shell scripting (Bash)', 'SSH & remote servers'] },
      { phase: 'Weeks 5–8: Containers & Orchestration', topics: ['Docker fundamentals', 'Docker Compose & multi-container apps', 'Kubernetes basics', 'Helm charts & deployments'] },
      { phase: 'Weeks 9–12: Cloud Platforms', topics: ['AWS core services (EC2, S3, RDS, Lambda)', 'Infrastructure as Code (Terraform)', 'IAM & security best practices', 'Cost optimization'] },
      { phase: 'Weeks 13–16: CI/CD & Monitoring', topics: ['GitHub Actions / GitLab CI', 'Automated testing pipelines', 'Prometheus & Grafana', 'Log aggregation (ELK stack)'] },
      { phase: 'Weeks 17–20: Projects', topics: ['Build 2 production infrastructure projects', 'Migrate a monolith to microservices', 'Disaster recovery & scaling', 'Code review with mentor'] },
      { phase: 'Weeks 21–24: Career', topics: ['DevOps portfolio & architecture docs', 'System design interview prep', 'Mock DevOps interviews', 'Job referral introductions'] },
    ],
  },
];

/* ── Self-Paced card with expandable subject breakdown ── */
const cultureGroups = (() => {
  const map: Record<string, number> = {};
  for (const l of lessons) { const label = getLessonOrigin(l).label; map[label] = (map[label] || 0) + 1; }
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 8);
})();

const subjectCounts = SUBJECTS.map(s => ({
  key: s.key, icon: s.icon,
  count: lessons.filter(l => l.subjects?.includes(s.key)).length,
})).filter(s => s.count > 0).sort((a, b) => b.count - a.count);

function SelfPacedCard({ isIndia }: { isIndia: boolean }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-8 bg-white dark:bg-gray-800">
      <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center mb-4">
        <Code2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
      </div>
      <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Online — Self-Paced</h3>
      <p className="text-gray-600 dark:text-gray-400 text-sm mb-4">Learn anywhere, anytime. Stories, concepts, and coding — all in your browser.</p>
      <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> {lessons.length}+ stories with 5 levels each</li>
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> {problems.length}+ coding problems (Python, SQL, TS, HTML, Arduino)</li>
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Stories from {cultureGroups.length}+ cultures and traditions</li>
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> In-browser coding with Arduino simulator — no setup</li>
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Interactive reference library with 40+ diagrams</li>
        <li className="flex items-start gap-2"><span className="text-blue-500 mt-0.5">✓</span> Progress tracking and certificates</li>
      </ul>

      <button onClick={() => setExpanded(!expanded)}
        className="mt-4 flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline">
        {expanded ? 'Hide' : 'See'} what you{'\u2019'}ll learn <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
      </button>

      {expanded && (
        <div className="mt-4 border-t border-gray-100 dark:border-gray-700 pt-4 space-y-5">
          {/* How it works */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">How each lesson works</p>
            <div className="flex flex-wrap gap-2">
              {[
                { step: 'Read', desc: 'A story from mythology or culture', color: 'amber' },
                { step: 'Learn', desc: 'Science concepts with analogies', color: 'sky' },
                { step: 'Code', desc: 'Python simulations in your browser', color: 'emerald' },
                { step: 'Build', desc: 'A capstone project', color: 'purple' },
              ].map((s, i) => (
                <div key={s.step} className="flex items-center gap-1.5">
                  <span className={`w-5 h-5 rounded-full bg-${s.color}-100 dark:bg-${s.color}-900/30 text-${s.color}-600 dark:text-${s.color}-400 flex items-center justify-center text-[10px] font-bold`}>{i + 1}</span>
                  <span className="text-xs text-gray-700 dark:text-gray-300"><strong>{s.step}</strong> — {s.desc}</span>
                  {i < 3 && <ArrowRight className="w-3 h-3 text-gray-300 dark:text-gray-600" />}
                </div>
              ))}
            </div>
          </div>

          {/* Subjects covered */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Subjects covered</p>
            <div className="flex flex-wrap gap-1.5">
              {subjectCounts.slice(0, 12).map(s => (
                <span key={s.key} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 px-2.5 py-1 rounded-full">
                  {s.icon} {s.key} ({s.count})
                </span>
              ))}
            </div>
          </div>

          {/* Cultures */}
          <div>
            <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Stories from</p>
            <div className="flex flex-wrap gap-1.5">
              {cultureGroups.map(([label, count]) => (
                <span key={label} className="text-xs bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 px-2.5 py-1 rounded-full">
                  {label} ({count})
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      <a href="#pricing" className="mt-6 block text-sm font-semibold text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">Free to start — {isIndia ? '₹1,999' : '$24'}/mo to unlock all levels ↓</a>
    </div>
  );
}

function BootcampCard({ isIndia }: { isIndia: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  return (
    <div id="bootcamp" className="bg-white dark:bg-gray-800 rounded-xl border border-sky-200 dark:border-sky-800 p-5 mb-4 scroll-mt-24">
      <h4 className="text-sm font-bold text-sky-700 dark:text-sky-300 uppercase tracking-wide mb-2">24-Week Bootcamp</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Career changers &amp; college grads</p>
      <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Full-stack, AI/ML, or Cloud &amp; DevOps specialization</li>
        <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Portfolio of 6+ production-grade projects</li>
        <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Weekly code reviews with industry mentors</li>
        <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Mock interviews &amp; resume building</li>
        <li className="flex items-start gap-2"><span className="text-sky-500 mt-0.5">✓</span> Job referral network</li>
      </ul>

      <div className="mt-4 flex items-center gap-4">
        <Link href="/curriculum/bootcamp"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-sky-600 dark:text-sky-400 hover:underline">
          View full 24-week curriculum <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
          {expanded ? 'Hide' : 'Preview'} tracks <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-sky-100 dark:border-sky-900 pt-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Choose a specialization</p>
          <div className="flex gap-2 mb-4">
            {bootcampTracks.map((track, i) => (
              <button key={track.name} onClick={() => setActiveTrack(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTrack === i ? 'bg-sky-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {track.name}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {bootcampTracks[activeTrack].weeks.map((w) => (
              <div key={w.phase} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <h5 className="text-xs font-bold text-gray-900 dark:text-white mb-1.5">{w.phase}</h5>
                <div className="flex flex-wrap gap-1.5">
                  {w.topics.map((t) => (
                    <span key={t} className="text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-500">{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ── School program tracks with term-by-term curriculum ── */
const schoolTracks = [
  {
    name: 'Robotics & Arduino',
    color: 'emerald',
    terms: [
      { phase: 'Term 1: Circuits & Light', topics: ['What is electricity?', 'LEDs, resistors, breadboards', 'Build: traffic light system', 'Intro to Arduino IDE'] },
      { phase: 'Term 2: Sensors & Input', topics: ['Buttons, potentiometers, LDRs', 'Reading analog vs digital', 'Build: automatic night light', 'Build: theremin instrument'] },
      { phase: 'Term 3: Motors & Movement', topics: ['DC motors & servos', 'Motor drivers & H-bridges', 'Build: obstacle-avoiding robot', 'Basic PID control'] },
      { phase: 'Term 4: Communication', topics: ['Serial communication', 'Bluetooth & wireless', 'Build: remote-controlled car', 'Sensor data logging'] },
    ],
  },
  {
    name: 'Python & AI',
    color: 'rose',
    terms: [
      { phase: 'Term 1: Python Foundations', topics: ['Variables, loops, functions', 'Lists, dictionaries, files', 'Build: quiz game', 'Build: password generator'] },
      { phase: 'Term 2: Data & Visualization', topics: ['Reading CSV files', 'Matplotlib charts', 'Build: weather data analyzer', 'Build: population tracker'] },
      { phase: 'Term 3: Intro to AI', topics: ['What is machine learning?', 'Training vs testing data', 'Build: spam classifier', 'Build: image recognizer'] },
      { phase: 'Term 4: AI Projects', topics: ['Natural language basics', 'Chatbot fundamentals', 'Build: story generator', 'Final showcase project'] },
    ],
  },
  {
    name: 'Creative Coding',
    color: 'violet',
    terms: [
      { phase: 'Term 1: Web Basics', topics: ['HTML structure', 'CSS styling & layout', 'Build: personal portfolio', 'Build: recipe website'] },
      { phase: 'Term 2: Interactivity', topics: ['JavaScript fundamentals', 'DOM manipulation & events', 'Build: interactive quiz', 'Build: drawing app'] },
      { phase: 'Term 3: Games & Animation', topics: ['Canvas & animation loops', 'Collision detection', 'Build: platformer game', 'Build: particle effects'] },
      { phase: 'Term 4: Full Projects', topics: ['APIs & data fetching', 'Responsive design', 'Build: weather dashboard', 'Final showcase project'] },
    ],
  },
];

function SchoolProgramCard({ isIndia }: { isIndia: boolean }) {
  const [expanded, setExpanded] = useState(false);
  const [activeTrack, setActiveTrack] = useState(0);

  return (
    <div id="school-program" className="bg-white dark:bg-gray-800 rounded-xl border border-emerald-200 dark:border-emerald-800 p-5 mb-4 scroll-mt-24">
      <h4 className="text-sm font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide mb-2">12-Month School Program</h4>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">Students — Grades 6 and up</p>
      <ul className="space-y-1.5 text-sm text-gray-700 dark:text-gray-300">
        <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Robotics &amp; Arduino, Python &amp; AI, or Creative Coding</li>
        <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Small cohorts (max 12) with dedicated mentor</li>
        <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Hands-on experiments with real hardware</li>
        <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Monthly project presentations</li>
        <li className="flex items-start gap-2"><span className="text-emerald-500 mt-0.5">✓</span> Progress reports for parents &amp; schools</li>
      </ul>

      <div className="mt-4 flex items-center gap-4">
        <Link href="/curriculum"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-emerald-600 dark:text-emerald-400 hover:underline">
          View full 48-week curriculum <ArrowRight className="w-3.5 h-3.5" />
        </Link>
        <button onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400 hover:underline">
          {expanded ? 'Hide' : 'Preview'} tracks <ChevronDown className={`w-3.5 h-3.5 transition-transform ${expanded ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {expanded && (
        <div className="mt-4 border-t border-emerald-100 dark:border-emerald-900 pt-4">
          <p className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Choose a track</p>
          <div className="flex gap-2 mb-4">
            {schoolTracks.map((track, i) => (
              <button key={track.name} onClick={() => setActiveTrack(i)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${activeTrack === i ? 'bg-emerald-500 text-white shadow-sm' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}>
                {track.name}
              </button>
            ))}
          </div>
          <div className="space-y-3">
            {schoolTracks[activeTrack].terms.map((t) => (
              <div key={t.phase} className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-3">
                <h5 className="text-xs font-bold text-gray-900 dark:text-white mb-1.5">{t.phase}</h5>
                <div className="flex flex-wrap gap-1.5">
                  {t.topics.map((topic) => (
                    <span key={topic} className="text-xs bg-white dark:bg-gray-600 text-gray-600 dark:text-gray-200 px-2 py-0.5 rounded-full border border-gray-200 dark:border-gray-500">{topic}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default function ProgramsPage() {
  const { user } = useAuth();
  const { hasActiveSubscription, plan: currentPlan } = useSubscription();
  const paymentResult = typeof window !== 'undefined' ? new URLSearchParams(window.location.search).get('payment') : null;
  const pathname = usePathname();

  // Scroll to hash anchor (e.g., #bootcamp, #school-program)
  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      setTimeout(() => {
        const el = document.querySelector(window.location.hash);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [pathname]);

  // Detect India via timezone
  const isIndia = (() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      return tz.startsWith('Asia/Kolkata') || tz.startsWith('Asia/Calcutta');
    } catch { return false; }
  })();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
            Three ways to learn
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
            Self-paced online, 12-month school program, or 24-week career bootcamp.
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            All paths start free. Upgrade when you are ready.
          </p>
        </div>
      </section>

      {/* ── Payment result banner ── */}
      {FEATURES.PAYMENTS_ENABLED && paymentResult === 'success' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
          <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4 flex items-center gap-3">
            <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Payment successful! Your subscription is now active.</p>
          </div>
        </div>
      )}
      {FEATURES.PAYMENTS_ENABLED && paymentResult === 'failed' && (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 mb-6">
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 flex items-center gap-3">
            <p className="text-sm font-semibold text-red-800 dark:text-red-300">Payment was not completed. Please try again or contact us.</p>
          </div>
        </div>
      )}

      {/* ── Three Paths ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-3 gap-6">
            {/* Self-Paced */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700 flex flex-col">
              <span className="text-3xl mb-3">📚</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Self-Paced Online</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                {lessons.length}+ story-driven lessons. Start free with Level 0, upgrade for full coding access. Learn at your own speed.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-900 dark:text-white">Free</span> or <span className="font-semibold text-gray-900 dark:text-white">{isIndia ? '₹1,999' : '$24'}/mo</span>
              </div>
              <Link href="/lessons" className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-sm font-semibold hover:bg-amber-200 dark:hover:bg-amber-800/30 transition-colors">
                Browse Lessons <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* School Program */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-emerald-200 dark:border-emerald-800 flex flex-col">
              <span className="text-3xl mb-3">🏫</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">12-Month School Program</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                Structured 48-week curriculum with a dedicated mentor. Small cohorts (max 12), hands-on hardware, monthly project showcases. Grades 6-12.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="font-semibold text-gray-900 dark:text-white">{isIndia ? '₹9,999' : '$59'}/mo</span> &middot; 4 tracks available
              </div>
              <Link href="/curriculum" className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold transition-colors">
                View 48-Week Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Bootcamp */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800 flex flex-col relative">
              <div className="absolute -top-3 left-4 bg-purple-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full">Early Bird</div>
              <span className="text-3xl mb-3">🚀</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">24-Week Bootcamp</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 flex-1">
                Intensive career training. Full-Stack, AI/ML, or Cloud/DevOps. Production portfolio, mock interviews, employer introductions. Career changers &amp; grads.
              </p>
              <div className="text-sm text-gray-500 mb-4">
                <span className="line-through text-gray-400">{isIndia ? '₹19,999' : '$119'}/mo</span>{' '}
                <span className="font-semibold text-purple-700 dark:text-purple-300">{isIndia ? '₹14,999' : '$89'}/mo</span>
              </div>
              <Link href="/curriculum/bootcamp" className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
                View 24-Week Curriculum <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing Detail ── */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Pricing</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10">Start free. Upgrade when you are ready.</p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

            {/* Free */}
            <div className="rounded-2xl border-2 border-gray-200 dark:border-gray-700 p-6 bg-white dark:bg-gray-800 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Free</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{isIndia ? '₹0' : '$0'}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">forever</p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> All {lessons.length}+ stories</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Level 0 — first 2 concepts</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Reference library previews</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Python/Web/SQL/Arduino basics courses</li>
              </ul>
              <Link href="/lessons" className="block w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm font-semibold hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                Browse Lessons
              </Link>
            </div>

            {/* Online */}
            <div className="rounded-2xl border-2 border-amber-400 dark:border-amber-600 p-6 bg-amber-50/50 dark:bg-amber-900/10 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">Most Popular</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 mt-1">Online</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{isIndia ? '₹1,999' : '$24'}<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">or {isIndia ? '₹19,999/year' : '$239/year'} (2 months free)</p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2"><span className="text-amber-500">✓</span> Everything in Free, plus:</li>
                <li className="flex items-start gap-2"><span className="text-amber-500">✓</span> All 5 levels per story</li>
                <li className="flex items-start gap-2"><span className="text-amber-500">✓</span> {problems.length}+ coding problems</li>
                <li className="flex items-start gap-2"><span className="text-amber-500">✓</span> Full reference library</li>
                <li className="flex items-start gap-2"><span className="text-amber-500">✓</span> Progress tracking &amp; certificates</li>
              </ul>
              {hasActiveSubscription && currentPlan === 'online' ? (
                <div className="py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold text-center">
                  ✓ Current Plan
                </div>
              ) : (
                <CheckoutButton plan="online_monthly" label="Subscribe — Monthly" />
              )}
            </div>

            {/* School Program */}
            <div className="rounded-2xl border-2 border-emerald-200 dark:border-emerald-800 p-6 bg-white dark:bg-gray-800 text-center">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">School Program</h3>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mb-1">{isIndia ? '₹9,999' : '$59'}<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">12 months &middot; Grades 6-12</p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Everything in Online, plus:</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Dedicated mentor &amp; cohort (max 12)</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Hands-on hardware &amp; sensors</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Monthly project showcases</li>
                <li className="flex items-start gap-2"><span className="text-emerald-500">✓</span> Parent progress reports</li>
              </ul>
              <Link href="/curriculum" className="block text-xs text-emerald-600 dark:text-emerald-400 hover:underline mb-3">View 48-week curriculum →</Link>
              <a href="#waitlist" className="block w-full py-2.5 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-semibold hover:bg-emerald-200 dark:hover:bg-emerald-800/30 transition-colors">
                Join Waitlist
              </a>
            </div>

            {/* Bootcamp */}
            <div className="rounded-2xl border-2 border-purple-300 dark:border-purple-700 p-6 bg-white dark:bg-gray-800 text-center relative">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full">Early Bird — 24 Seats</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1 mt-1">Bootcamp</h3>
              <p className="text-sm text-gray-400 line-through">{isIndia ? '₹19,999/mo' : '$119/mo'}</p>
              <p className="text-3xl font-bold text-purple-700 dark:text-purple-300 mb-1">{isIndia ? '₹14,999' : '$89'}<span className="text-base font-normal text-gray-500">/mo</span></p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">24 weeks &middot; Career changers</p>
              <ul className="text-sm text-gray-600 dark:text-gray-300 space-y-2 text-left mb-6">
                <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Full-Stack, AI/ML, or Cloud/DevOps</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Dedicated mentor &amp; cohort (max 15)</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> 8+ portfolio projects</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Mock interviews &amp; job referrals</li>
                <li className="flex items-start gap-2"><span className="text-purple-500">✓</span> Hardware kit included</li>
              </ul>
              <Link href="/curriculum/bootcamp" className="block text-xs text-purple-600 dark:text-purple-400 hover:underline mb-3">View 24-week curriculum →</Link>
              <a href="#waitlist" className="block w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-sm font-semibold transition-colors">
                Join Early Bird
              </a>
            </div>
          </div>
        </div>
      </section>
      {/* ── Waitlist ── */}
      <section id="waitlist" className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 scroll-mt-24">
        <div className="max-w-2xl mx-auto">
          <WaitlistForm isIndia={isIndia} />
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
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {user ? 'Continue your journey' : 'Start with any story — it\'s free'}
          </h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            {lessons.length}+ stories and growing. {problems.length}+ coding problems. Real science.{!user && ' No credit card.'}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/lessons" className="inline-flex items-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Browse Lessons <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            {user ? (
              <Link href="/plan" className="inline-flex items-center bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all">
                My Lesson Plan <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            ) : (
              <Link href="/auth" className="inline-flex items-center bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all">
                Sign Up Free <ArrowRight className="ml-2 w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

            <Footer />
    </div>
  );
}

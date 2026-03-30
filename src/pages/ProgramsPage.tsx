import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowRight, Code2, Bot, Clock, Users, CheckCircle, Sparkles,
  GraduationCap, Briefcase, Trophy, Star, ChevronDown, Zap,
  Brain, Cpu, Palette, Rocket, Target, BookOpen, MessageSquare,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const bootcampModules = [
  { icon: Code2, title: 'Full-Stack Web Development', desc: 'React, Node.js, PostgreSQL — build real applications from day one', weeks: '6 weeks' },
  { icon: Brain, title: 'Python & Data Engineering', desc: 'Data pipelines, pandas, SQL — the backbone of every tech company', weeks: '4 weeks' },
  { icon: Cpu, title: 'AI & Machine Learning', desc: 'Neural networks, NLP, computer vision — not just theory, real models', weeks: '4 weeks' },
  { icon: Rocket, title: 'Cloud & DevOps', desc: 'Docker, CI/CD, AWS — deploy like a professional engineer', weeks: '3 weeks' },
  { icon: Trophy, title: 'Capstone Project', desc: 'Build a production-grade product with an industry mentor', weeks: '5 weeks' },
  { icon: Briefcase, title: 'Career Launch', desc: 'Portfolio, resume, mock interviews, and employer introductions', weeks: '2 weeks' },
];

const schoolModules = [
  { icon: Palette, title: 'Creative Coding', desc: 'Python & Scratch — make art, music, and games with code', term: 'Term 1' },
  { icon: Bot, title: 'Robotics & Arduino', desc: 'Build a real robot that moves, senses, and responds', term: 'Term 1' },
  { icon: Brain, title: 'AI for Young Minds', desc: 'Train image classifiers, build chatbots, understand how AI thinks', term: 'Term 2' },
  { icon: Zap, title: 'Electronics & Circuits', desc: 'LEDs, sensors, motors — from breadboard to working prototype', term: 'Term 2' },
  { icon: BookOpen, title: 'Science Through Stories', desc: '100 illustrated stories that teach real STEM — our signature approach', term: 'Term 3' },
  { icon: Trophy, title: 'Team Projects & Showcase', desc: 'Present your work to parents, peers, and industry guests', term: 'Term 3' },
];

const outcomes = [
  { number: '100%', label: 'Project completion rate', desc: 'Every student ships a real project' },
  { number: '110', label: 'Illustrated STEM stories', desc: 'Rooted in Northeast India' },
  { number: '5', label: 'Learning levels per story', desc: 'From listener to creator' },
  { number: '177', label: 'Interactive diagrams', desc: 'Visual science, not textbooks' },
];

const testimonials = [
  {
    quote: "My daughter went from being scared of math to building her own weather prediction model. The stories made the difference — she wasn't learning physics, she was saving elephants.",
    name: 'Anjali Bora',
    role: 'Parent, Guwahati',
  },
  {
    quote: "I left my tea garden job and joined the bootcamp with zero coding experience. Six months later, I'm a junior developer at a Bangalore startup. TigmaMinds didn't just teach me to code — they showed me I could.",
    name: 'Ranjit Mishing',
    role: 'Bootcamp Graduate, Batch 1',
  },
  {
    quote: "The reference library alone is worth it. My students use it as their primary resource for physics and biology. The diagrams are better than any textbook I've seen.",
    name: 'Dr. Pallavi Sharma',
    role: 'Science Teacher, Shillong',
  },
];

const faqs = [
  { q: 'Do I need a degree to join the bootcamp?', a: 'No. We welcome learners from all backgrounds — tea garden workers, college dropouts, homemakers returning to work. We test for curiosity and commitment, not credentials. Our entrance assessment is a 2-hour problem-solving exercise, not a degree check.' },
  { q: 'What age group is the school program for?', a: 'Grades 6–12 (ages 11–17). We group students by skill level, not strictly by age. A sharp 12-year-old can be in the same robotics cohort as a 15-year-old beginner. What matters is where you are, not how old you are.' },
  { q: 'Is the curriculum only for students in India?', a: 'The stories draw from Northeast India — elephants in Kaziranga, living root bridges in Meghalaya, fireflies on Majuli. But the STEM content is universal. Rayleigh scattering works the same everywhere. Students from 12 countries have used our reference library.' },
  { q: 'What do I need to get started?', a: 'A computer with internet access. That\'s it. Our Python environment runs in the browser (no installation). Arduino simulations work without hardware. When you\'re ready for real electronics, we provide kits at cost.' },
  { q: 'What makes this different from free online courses?', a: 'Three things: (1) Every concept starts with a story, so you understand WHY before HOW. (2) You build real things — not toy exercises, but projects that solve real problems. (3) You\'re never alone — small cohorts, live mentors, and a community that doesn\'t let you quit.' },
  { q: 'Is there financial aid?', a: 'Yes. We offer need-based scholarships covering up to 100% of fees. We believe no student in Northeast India should miss out on STEM education because of money. Apply and let us worry about the rest.' },
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

      {/* Hero */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <Sparkles className="w-4 h-4" /> Now enrolling for 2026
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Learn STEM through<br />
            <span className="bg-gradient-to-r from-amber-500 to-orange-500 bg-clip-text text-transparent">stories that stay with you</span>
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto mb-10">
            Two programs. One mission. Make science, coding, and engineering feel like an adventure — not a chore. Every concept starts with a story from Northeast India.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <a href="#bootcamp" className="inline-flex items-center bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              24-Week Bootcamp <ArrowRight className="ml-2 w-5 h-5" />
            </a>
            <a href="#school" className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              School Program <ArrowRight className="ml-2 w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Numbers */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900 border-y border-gray-100 dark:border-gray-800">
        <div className="max-w-6xl mx-auto grid grid-cols-2 lg:grid-cols-4 gap-8">
          {outcomes.map((o) => (
            <div key={o.label} className="text-center">
              <p className="text-4xl font-black text-amber-500 mb-1">{o.number}</p>
              <p className="text-sm font-bold text-gray-900 dark:text-white">{o.label}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{o.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bootcamp */}
      <section id="bootcamp" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-sky-50/30 dark:from-gray-900 dark:to-gray-800/30">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              <Briefcase className="w-4 h-4" /> Career Track
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">24-Week Bootcamp</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              For career changers, graduates, and self-taught developers. Go from zero to job-ready in 6 months. Full-time, cohort-based, with industry mentors.
            </p>
            <div className="flex items-center gap-6 justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 24 weeks, full-time</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 20 students per cohort</span>
              <span className="flex items-center gap-1"><Target className="w-4 h-4" /> Job placement support</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {bootcampModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-sky-200 dark:hover:border-sky-800 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-sky-500 uppercase tracking-wide">{mod.weeks}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{mod.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/students" className="inline-flex items-center bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Apply for the Bootcamp <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Next cohort starts July 2026. Scholarships available.</p>
          </div>
        </div>
      </section>

      {/* School Program */}
      <section id="school" className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-sky-50/30 to-emerald-50/30 dark:from-gray-800/30 dark:to-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full mb-4 text-sm font-semibold">
              <GraduationCap className="w-4 h-4" /> Young Learners
            </div>
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">12-Month School Program</h2>
            <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              For grades 6–12. Every weekend, a new adventure — robotics, AI, creative coding, and real science experiments. All taught through illustrated stories from Northeast India.
            </p>
            <div className="flex items-center gap-6 justify-center mt-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 months, weekends</span>
              <span className="flex items-center gap-1"><Users className="w-4 h-4" /> 12 students per group</span>
              <span className="flex items-center gap-1"><Star className="w-4 h-4" /> Certificate on completion</span>
            </div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {schoolModules.map((mod) => {
              const Icon = mod.icon;
              return (
                <div key={mod.title} className="bg-white dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700 hover:shadow-lg hover:border-emerald-200 dark:hover:border-emerald-800 transition-all group">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-green-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-semibold text-emerald-500 uppercase tracking-wide">{mod.term}</span>
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{mod.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{mod.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <Link to="/contact" className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-10 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Enquire About the School Program <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-3">Rolling admissions. Join anytime.</p>
          </div>
        </div>
      </section>

      {/* Comparison */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Which program is right for you?</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-4 text-gray-500 dark:text-gray-400 font-medium"></th>
                  <th className="text-center py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 font-bold"><Code2 className="w-4 h-4" /> Bootcamp</span>
                  </th>
                  <th className="text-center py-4 px-4">
                    <span className="inline-flex items-center gap-1 text-emerald-600 dark:text-emerald-400 font-bold"><GraduationCap className="w-4 h-4" /> School</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                {[
                  ['Duration', '24 weeks (full-time)', '12 months (weekends)'],
                  ['Age / Stage', '18+ / Career changers', 'Grades 6–12 (ages 11–17)'],
                  ['Group size', '20 per cohort', '12 per group'],
                  ['Coding languages', 'Python, JavaScript, SQL, TypeScript', 'Python, Scratch, Arduino C'],
                  ['Hardware', 'Cloud & DevOps focus', 'Arduino, sensors, robotics kits'],
                  ['AI / ML', 'Production ML pipelines', 'Intro AI — classifiers, chatbots'],
                  ['Capstone', 'Industry-grade product', 'Showcase Day presentation'],
                  ['Outcome', 'Job placement support', 'Certificate + portfolio'],
                  ['Story-based learning', 'Reference library access', 'Core methodology — every lesson starts with a story'],
                  ['Financial aid', 'Need-based scholarships', 'Need-based scholarships'],
                ].map(([feature, bootcamp, school]) => (
                  <tr key={feature} className="hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">{feature}</td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">{bootcamp}</td>
                    <td className="py-3 px-4 text-center text-gray-600 dark:text-gray-300">{school}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* The TigmaMinds Difference */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 text-center">Why TigmaMinds?</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-12 max-w-2xl mx-auto">
            We don't just teach STEM. We make it unforgettable.
          </p>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: BookOpen, title: 'Stories First', desc: 'Every concept starts with an illustrated story from Northeast India. You understand WHY before you learn HOW. A firefly festival teaches bioluminescence. An elephant teaches AI.' },
              { icon: Zap, title: '5 Levels Deep', desc: 'Every story has 5 learning levels — from no-code understanding to a capstone project. Start where you are. Go as deep as you want. No ceiling.' },
              { icon: MessageSquare, title: 'Never Alone', desc: 'Small cohorts. Live mentors. A community that doesn\'t let you quit. When you get stuck at 2am, someone is there.' },
              { icon: Rocket, title: 'Build Real Things', desc: 'Not toy exercises. Real robots, real websites, real ML models, real research. Your portfolio is your proof.' },
              { icon: Target, title: 'Northeast India Roots', desc: '100 stories rooted in Assam, Meghalaya, Nagaland, and beyond. The science is universal. The soul is local. That\'s what makes it stick.' },
              { icon: Star, title: 'Open Reference Library', desc: '40+ reference guides, 177 interactive diagrams, covering physics, biology, chemistry, math, and coding. Free for everyone. Always.' },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="text-center">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-4">
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-12 text-center">What people say</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t) => (
              <div key={t.name} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-sm">{t.name}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
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

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to start?</h2>
          <p className="text-lg text-white/90 mb-8 max-w-2xl mx-auto">
            Whether you're 12 or 32 — if you're curious about how the world works and want to build things that matter, there's a place for you here.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link to="/students" className="inline-flex items-center bg-white text-amber-600 px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl hover:scale-105 transition-all">
              Apply for Bootcamp <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
            <Link to="/contact" className="inline-flex items-center bg-white/20 text-white border-2 border-white/40 px-8 py-4 rounded-full font-semibold text-lg hover:bg-white/30 transition-all">
              Enquire About School Program <ArrowRight className="ml-2 w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

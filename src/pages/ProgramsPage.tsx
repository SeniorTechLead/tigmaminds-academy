import { Link } from 'react-router-dom';
import { ArrowRight, Code2, Cpu, Bot, Clock, Users, CheckCircle } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';

const bootcampModules = [
  'Full-Stack Web Development (React, Node, Postgres)',
  'Python & Data Engineering',
  'AI & Machine Learning Fundamentals',
  'Cloud & DevOps (AWS / Docker / CI-CD)',
  'Capstone Project with Industry Mentor',
  'Career Prep: Portfolio, Resume & Interview Coaching',
];

const schoolModules = [
  'Creative Coding with Python & Scratch',
  'Robotics & Arduino — Build Real Machines',
  'AI for Young Minds — Image Recognition, Chatbots',
  'Electronics & Circuit Design',
  'Science through Stories — Hands-On Experiments',
  'Team Projects & Showcase Day',
];

export default function ProgramsPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      <section className="pt-32 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-4">Our Programs</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
            Two tracks, one mission — make STEM accessible through imagination, hands-on building, and expert mentorship.
          </p>
        </div>
      </section>

      {/* Bootcamp */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div>
              <div className="inline-flex items-center gap-2 bg-sky-100 dark:bg-sky-900/40 text-sky-700 dark:text-sky-300 px-4 py-2 rounded-full mb-4 text-sm font-medium">
                <Code2 className="w-4 h-4" />
                Career Track
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">24-Week Bootcamp</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                For career changers, college graduates, and self-taught developers ready to level up.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 24 weeks, full-time</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Cohort-based</span>
              </div>

              <ul className="space-y-3 mb-8">
                {bootcampModules.map((mod) => (
                  <li key={mod} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-sky-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{mod}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/students"
                className="inline-flex items-center bg-gradient-to-r from-sky-500 to-cyan-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
              >
                Apply Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/content/illustrations/brahmaputra-angry.webp"
                alt="Students building and coding"
                className="rounded-2xl shadow-lg w-full object-cover h-[420px]"
              />
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-sky-500 to-cyan-400" />
            </div>
          </div>
        </div>
      </section>

      {/* School Program */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/50 dark:from-gray-900 dark:to-gray-800/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-start">
            <div className="order-2 lg:order-1 relative">
              <img
                src="/content/illustrations/elephant-ant.webp"
                alt="Young learners exploring science"
                className="rounded-2xl shadow-lg w-full object-cover h-[420px]"
              />
              <div className="absolute top-0 left-0 right-0 h-1.5 rounded-t-2xl bg-gradient-to-r from-emerald-500 to-green-400" />
            </div>
            <div className="order-1 lg:order-2">
              <div className="inline-flex items-center gap-2 bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 px-4 py-2 rounded-full mb-4 text-sm font-medium">
                <Bot className="w-4 h-4" />
                Young Learners
              </div>
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">12-Month School Program</h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">
                For grades 6–12. Robotics, AI, and creative coding through stories and hands-on projects.
              </p>
              <div className="flex items-center gap-6 text-sm text-gray-500 dark:text-gray-400 mb-8">
                <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 12 months, weekends</span>
                <span className="flex items-center gap-1"><Users className="w-4 h-4" /> Small groups</span>
              </div>

              <ul className="space-y-3 mb-8">
                {schoolModules.map((mod) => (
                  <li key={mod} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 dark:text-gray-300">{mod}</span>
                  </li>
                ))}
              </ul>

              <Link
                to="/contact"
                className="inline-flex items-center bg-gradient-to-r from-emerald-500 to-green-400 text-white px-8 py-4 rounded-full font-semibold text-lg hover:shadow-xl transition-all"
              >
                Enquire Now
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ-style */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">Common Questions</h2>
          <div className="space-y-6">
            {[
              { q: 'Do I need a degree to join the bootcamp?', a: 'No. We welcome learners from all backgrounds. Passion and commitment matter more than credentials.' },
              { q: 'What age group is the school program for?', a: 'Grades 6–12 (roughly ages 11–17). We group students by skill level, not strictly by age.' },
              { q: 'Is the curriculum only for students in India?', a: 'The stories draw from Northeast India, but the STEM content is universal. Anyone, anywhere can learn with us.' },
              { q: 'What do I need to get started?', a: 'A computer with internet access and 10+ hours per week of commitment. That\'s it.' },
            ].map(({ q, a }) => (
              <div key={q} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{q}</h3>
                <p className="text-gray-600 dark:text-gray-300">{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

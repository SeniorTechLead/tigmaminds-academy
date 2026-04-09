import { useState } from 'react';
import Link from 'next/link';
import {
  CheckCircle, ArrowRight, Loader2, Users, Briefcase, Code2,
  Shield, Clock, BarChart3, Target, Award,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import CallbackForm from '../components/CallbackForm';
import { supabase } from '../lib/supabase';

function EmployerForm() {
  const [form, setForm] = useState({
    name: '', email: '', company: '', role: '', hiringFor: '', teamSize: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const { error } = await supabase.from('contact_submissions').insert([{
      name: form.name,
      email: form.email,
      subject: `Employer Partner — ${form.company}`,
      message: `Company: ${form.company}\nRole: ${form.role}\nHiring for: ${form.hiringFor}\nTeam size: ${form.teamSize}\n\n${form.message}`,
    }]);
    setSubmitting(false);
    if (error) { setStatus('error'); } else {
      setStatus('success');
      setForm({ name: '', email: '', company: '', role: '', hiringFor: '', teamSize: '', message: '' });
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
        <CheckCircle className="w-10 h-10 text-emerald-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">We'll be in touch</h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">Our team will reach out within 2 business days to discuss your hiring needs.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === 'error' && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          Something went wrong. Please try again.
        </div>
      )}
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Name *</label>
          <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Work Email *</label>
          <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Company *</label>
          <input type="text" name="company" value={form.company} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Role</label>
          <input type="text" name="role" value={form.role} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent" placeholder="e.g. Engineering Manager" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Hiring for *</label>
          <select name="hiringFor" value={form.hiringFor} onChange={handleChange} required className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Select track</option>
            <option value="Full-Stack Development">Full-Stack Development</option>
            <option value="AI & Machine Learning">AI & Machine Learning</option>
            <option value="Cloud & DevOps">Cloud & DevOps</option>
            <option value="Multiple / General">Multiple / General</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Positions to fill</label>
          <select name="teamSize" value={form.teamSize} onChange={handleChange} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent">
            <option value="">Select</option>
            <option value="1-2">1-2</option>
            <option value="3-5">3-5</option>
            <option value="5-10">5-10</option>
            <option value="10+">10+</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Anything else?</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 dark:text-white rounded-xl text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none" placeholder="Specific skills you need, timeline, etc." />
      </div>
      <button type="submit" disabled={submitting} className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-50">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : 'Get Started'}
      </button>
    </form>
  );
}

export default function EmployerPartnerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 via-purple-900/30 to-gray-900">
        <div className="max-w-4xl mx-auto text-center">
          <span className="inline-block text-[11px] font-bold text-purple-400 bg-purple-900/40 px-3 py-1 rounded-full uppercase tracking-wider mb-4">Hiring Partners</span>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Hire Job-Ready Engineers
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-8">
            Our 24-week bootcamp graduates come with verified skills, 8+ production projects,
            and the ability to contribute from day one. No placement fees for early partners.
          </p>
          <div className="flex justify-center gap-3">
            <Link href="/partner" className="px-5 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-300 hover:text-white rounded-full font-medium text-sm transition-colors">
              Schools & Institutions
            </Link>
            <span className="px-5 py-2.5 bg-white text-gray-900 rounded-full font-semibold text-sm">
              Employers & Hiring
            </span>
          </div>
        </div>
      </section>

      {/* What You Get */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Why Hire From TigmaMinds</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Shield, title: 'Pre-Vetted Candidates', desc: 'Every graduate completes 24 weeks of intensive training, weekly code reviews, and a final capstone project reviewed by industry mentors.' },
              { icon: Code2, title: '8+ Portfolio Projects', desc: 'Not toy exercises — production-grade applications built with real tools: React, Node, PostgreSQL, PyTorch, Docker, AWS, Terraform.' },
              { icon: Target, title: 'Skill-Matched Referrals', desc: 'Tell us what you need — Full-Stack, AI/ML, or Cloud/DevOps — and we match you with graduates whose projects align with your stack.' },
              { icon: BarChart3, title: 'Transparent Skill Profiles', desc: 'Each candidate comes with a detailed skill report: technologies used, project complexity, code quality scores, and mentor assessments.' },
              { icon: Clock, title: 'Trial Period Friendly', desc: 'Not sure? Start with a paid trial project. See the candidate work on a real task before making a full-time offer.' },
              { icon: Award, title: 'No Placement Fees', desc: 'For our early hiring partners: zero placement fees. We want to build long-term relationships, not extract one-time charges.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <Icon className="w-8 h-8 text-purple-500 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Tracks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Three Specializations</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-12 max-w-2xl mx-auto">Each graduate specializes in one track for 24 weeks. They don't dabble — they go deep.</p>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { title: 'Full-Stack Development', color: 'sky', skills: ['React + TypeScript', 'Node.js + Express', 'PostgreSQL', 'REST APIs', 'CI/CD + Cloud Deploy', 'Testing (Unit, E2E)'], project: '2 production web applications' },
              { title: 'AI & Machine Learning', color: 'rose', skills: ['Python + NumPy/Pandas', 'PyTorch', 'CNNs + Transfer Learning', 'NLP + LLM APIs', 'FastAPI + Docker', 'MLflow + Experiment Tracking'], project: '2 end-to-end ML pipelines' },
              { title: 'Cloud & DevOps', color: 'violet', skills: ['Linux + Networking', 'Docker + Kubernetes', 'AWS (EC2, S3, RDS, Lambda)', 'Terraform', 'GitHub Actions CI/CD', 'Prometheus + Grafana'], project: '2 production infrastructure projects' },
            ].map(track => {
              const colorMap: Record<string, string> = { sky: 'border-sky-300 dark:border-sky-700', rose: 'border-rose-300 dark:border-rose-700', violet: 'border-purple-300 dark:border-purple-700' };
              const badgeMap: Record<string, string> = { sky: 'bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-300', rose: 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300', violet: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300' };
              return (
                <div key={track.title} className={`bg-white dark:bg-gray-800 rounded-2xl p-6 border-2 ${colorMap[track.color]}`}>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-3">{track.title}</h3>
                  <ul className="space-y-1.5 mb-4">
                    {track.skills.map(s => (
                      <li key={s} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                        <CheckCircle className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" /> {s}
                      </li>
                    ))}
                  </ul>
                  <div className={`text-xs font-semibold px-3 py-1.5 rounded-lg inline-block ${badgeMap[track.color]}`}>
                    Capstone: {track.project}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="text-center mt-6">
            <Link href="/curriculum/bootcamp" className="text-sm text-purple-600 dark:text-purple-400 hover:underline font-medium inline-flex items-center gap-1">
              See the full 24-week curriculum <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[
              { step: '1', title: 'Tell us what you need', desc: 'Fill out the form with your tech stack, team size, and timeline.' },
              { step: '2', title: 'We match candidates', desc: 'Based on your requirements, we shortlist graduates with matching skills and projects.' },
              { step: '3', title: 'Review portfolios', desc: 'Each candidate comes with a skill profile, project demos, and mentor assessment.' },
              { step: '4', title: 'Interview and hire', desc: 'You interview directly. No middlemen, no hidden fees.' },
            ].map(s => (
              <div key={s.step} className="text-center">
                <div className="w-12 h-12 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-bold text-lg flex items-center justify-center mx-auto mb-3">
                  {s.step}
                </div>
                <h3 className="font-bold text-gray-900 dark:text-white mb-1 text-sm">{s.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form + Callback */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-4">Get Started</h2>
          <p className="text-gray-600 dark:text-gray-400 text-center mb-10 max-w-xl mx-auto">
            Tell us about your hiring needs, or request a callback to discuss how our graduates can fit your team.
          </p>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                <Briefcase className="w-5 h-5 text-purple-500" /> Hiring Inquiry
              </h3>
              <EmployerForm />
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
              <CallbackForm context="Employer Hiring Partner" callerLabel="team member" />
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

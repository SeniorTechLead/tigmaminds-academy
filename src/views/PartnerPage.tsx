import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle, Loader2, BookOpen, Code2, Users, GraduationCap, Building2, Heart } from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const INSTITUTION_TYPES = ['School (K-12)', 'College / University', 'NGO / Non-Profit', 'Government Body', 'Corporate / CSR', 'Other'] as const;

function PartnerForm() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    institution: '',
    institutionType: '',
    role: '',
    studentCount: '',
    message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setStatus('idle');

    const { error } = await supabase
      .from('contact_submissions')
      .insert([{
        name: form.name,
        email: form.email,
        phone: form.phone,
        subject: `Partnership Inquiry — ${form.institutionType}`,
        message: [
          `Institution: ${form.institution}`,
          `Type: ${form.institutionType}`,
          `Role: ${form.role}`,
          `Approximate students: ${form.studentCount}`,
          '',
          form.message,
        ].join('\n'),
      }]);

    setSubmitting(false);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
    }
  };

  if (status === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-2xl p-8 text-center">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thank you!</h3>
        <p className="text-gray-600 dark:text-gray-300">We've received your inquiry and will get back to you within 2 business days.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
          <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
          <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
          <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Role *</label>
          <input name="role" value={form.role} onChange={handleChange} required placeholder="e.g. Principal, HOD, Director" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution Name *</label>
          <input name="institution" value={form.institution} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Institution Type *</label>
          <select name="institutionType" value={form.institutionType} onChange={handleChange} required className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent">
            <option value="">Select...</option>
            {INSTITUTION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Approximate Number of Students</label>
        <input name="studentCount" value={form.studentCount} onChange={handleChange} placeholder="e.g. 200, 500-1000" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tell us about your goals</label>
        <textarea name="message" value={form.message} onChange={handleChange} rows={4} placeholder="What are you looking for? Any specific subjects or grade levels?" className="w-full px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />
      </div>
      {status === 'error' && (
        <p className="text-red-500 text-sm">Something went wrong. Please try again or email us directly at hello@tigmaminds.academy</p>
      )}
      <button type="submit" disabled={submitting} className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
        {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</> : 'Submit Inquiry'}
      </button>
    </form>
  );
}

export default function PartnerPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-5xl mx-auto text-center">
          <p className="text-amber-400 font-semibold text-sm uppercase tracking-wide mb-3">Partnerships</p>
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">Bring STEM Storytelling to Your Institution</h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            130+ lessons connecting folklore and mythology to real science, engineering, and code.
            Designed for classrooms, labs, and self-paced learning.
          </p>
        </div>
      </section>

      {/* What We Offer */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">What Your Students Get</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: BookOpen, title: 'Story-Driven Lessons', desc: 'Each lesson starts with a story from world traditions and connects it to real STEM concepts — physics, biology, chemistry, CS, engineering. New stories added regularly.' },
              { icon: Code2, title: 'Hands-On Coding', desc: 'Browser-based playground with 550+ guided problems across Python, SQL, TypeScript, and HTML. No installation needed.' },
              { icon: GraduationCap, title: '5 Learning Levels', desc: 'From no-code exploration (Level 0) to advanced engineering projects (Level 4). Every student finds their entry point.' },
              { icon: Users, title: 'Teacher Dashboard', desc: 'Track student progress across lessons, quiz scores, and code exercises. Identify who needs help and who is ready for more.' },
              { icon: Building2, title: 'Curriculum Integration', desc: 'Maps to CBSE, ICSE, and state board science syllabi. Use alongside your existing curriculum, not instead of it.' },
              { icon: Heart, title: 'Cultural Relevance', desc: 'Stories from Northeast India, Hindu, Buddhist, Islamic, and Christian traditions. Students see themselves in the content.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="bg-gray-50 dark:bg-gray-800 rounded-xl p-6 border border-gray-100 dark:border-gray-700">
                <Icon className="w-8 h-8 text-amber-500 mb-3" />
                <h3 className="font-bold text-gray-900 dark:text-white mb-2">{title}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partnership Tracks */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-12">Partnership Tracks</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-3xl mb-4 block">🏫</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Schools (K-12)</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> 12-month STEM program</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Teacher training workshops</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Progress reports per student</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Aligned to CBSE/ICSE/State boards</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Certificates of completion</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-3xl mb-4 block">🎓</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Colleges & Universities</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Project-based bootcamp tracks</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> CS, engineering, science depts</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Real-world portfolio outcomes</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Guest lectures and workshops</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Internship pathways</li>
              </ul>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700">
              <span className="text-3xl mb-4 block">🤝</span>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">NGOs & Government</h3>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Subsidized or free access</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Rural and underserved communities</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Offline-ready content packages</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Impact measurement reports</li>
                <li className="flex items-start gap-2"><CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" /> Co-branded programs</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Inquiry Form */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-3">Start a Conversation</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-10">
            Tell us about your institution and what you're looking for. We'll get back to you within 2 business days.
          </p>
          <PartnerForm />
        </div>
      </section>

      {/* Quick CTA */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-amber-500 to-orange-500">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">Want to see the lessons first?</h2>
          <p className="text-white/90 mb-6">Browse our full library — the first two concepts of every lesson are free.</p>
          <Link href="/lessons" className="inline-flex items-center bg-white text-amber-600 px-8 py-3 rounded-full font-semibold hover:shadow-xl hover:scale-105 transition-all">
            Browse Lessons <ArrowRight className="ml-2 w-4 h-4" />
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  );
}

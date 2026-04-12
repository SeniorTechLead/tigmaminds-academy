import { useState } from 'react';
import {
  Shield, BookOpen, Users, MapPin, CheckCircle,
  GraduationCap, ClipboardCheck, Award, Loader2, Send,
} from 'lucide-react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import { supabase } from '../lib/supabase';

const processSteps = [
  {
    num: '1',
    title: 'Apply',
    desc: 'Tell us about your background, your city, and why you want to teach STEM to children.',
  },
  {
    num: '2',
    title: 'Training',
    desc: 'Complete our 2-week training program. Learn our pedagogy: stories first, then science, then code. Practice delivering lessons from our platform.',
  },
  {
    num: '3',
    title: 'Assessment',
    desc: 'Deliver a mock workshop to our team. We evaluate your ability to engage young learners, explain concepts clearly, and maintain the quality bar parents expect.',
  },
  {
    num: '4',
    title: 'Certification',
    desc: 'Pass the assessment and become a TigmaMinds Certified Mentor. You receive access to our full curriculum, workshop materials, and ongoing support.',
  },
];

const expectations = [
  'Deliver weekly 2-hour workshops using TigmaMinds curriculum (no freelancing the content)',
  'Small groups of up to 12 students, ages 10–16',
  'Facilitate hands-on experiments, coding projects, and peer presentations',
  'Submit monthly progress reports for each student\u2019s parents',
  'Attend monthly mentor calibration sessions to maintain quality',
  'Represent TigmaMinds Academy\u2019s values: curiosity, rigor, and kindness',
];

const idealCandidate = [
  { icon: GraduationCap, text: 'STEM background — engineering, science, or computer science degree or equivalent experience' },
  { icon: BookOpen, text: 'Genuine enthusiasm for teaching — you light up when explaining how things work' },
  { icon: Users, text: 'Comfort working with children and teenagers in a classroom setting' },
  { icon: MapPin, text: 'Based in Guwahati or Thiruvananthapuram (or willing to relocate)' },
];

export default function CareersPage() {
  const [form, setForm] = useState({ name: '', email: '', phone: '', city: '', background: '', motivation: '' });
  const [submitting, setSubmitting] = useState(false);
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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
        subject: `Mentor Application — ${form.city}`,
        message: `City: ${form.city}\nBackground: ${form.background}\nMotivation: ${form.motivation}`,
      }]);

    setSubmitting(false);
    if (error) {
      setStatus('error');
    } else {
      setStatus('success');
      setForm({ name: '', email: '', phone: '', city: '', background: '', motivation: '' });
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      <Header />

      {/* ── Hero ── */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-amber-50 via-white to-orange-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-4 py-2 rounded-full mb-6 text-sm font-semibold">
            <GraduationCap className="w-4 h-4" />
            Now hiring in Guwahati &amp; Thiruvananthapuram
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-6 leading-tight">
            Teach With Us
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Become a TigmaMinds Certified Mentor. Lead in-person STEM workshops for children aged 10–16 using our story-driven curriculum, training, and materials.
          </p>
        </div>
      </section>

      {/* ── How We Maintain Quality ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <div className="flex items-center gap-3 justify-center mb-4">
            <Shield className="w-6 h-6 text-amber-500" />
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">How We Maintain Quality</h2>
          </div>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-12 max-w-2xl mx-auto">
            We control curriculum centrally. Mentors don't create content — they bring it to life. This means every child gets the same rigorous, story-driven experience, no matter who teaches or where.
          </p>

          {/* Our guarantee — speaks to both parents and applicants */}
          <div className="bg-amber-50 dark:bg-amber-900/15 border border-amber-200 dark:border-amber-800 rounded-2xl p-6 sm:p-8 mb-16">
            <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              Our guarantee to learners and parents
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4">
              Every mentor teaching your ward has completed our training program, passed a live assessment observed by our team, and earned TigmaMinds certification. They teach exclusively from our platform curriculum — the same lessons, experiments, and projects you can preview online. We run monthly calibration sessions to ensure consistent quality across all workshops and cities.
            </p>
            <div className="border-t border-amber-200 dark:border-amber-800 pt-4">
              <h4 className="text-sm font-bold text-gray-900 dark:text-white mb-2 flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                What this means for you as an applicant
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                By joining as a mentor, you commit to upholding this standard. You will teach from our curriculum — not your own materials. You will attend monthly calibration sessions. You will submit progress reports. This is not freelance tutoring — it is a quality-controlled teaching role where every student and parent can trust that the experience is consistent, rigorous, and accountable. If that level of commitment excites you, we want to hear from you.
              </p>
            </div>
          </div>

          {/* Process steps */}
          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">The Mentor Journey</h3>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((step) => (
              <div key={step.num} className="relative bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 border border-gray-100 dark:border-gray-700">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center text-white font-bold text-lg mb-4">
                  {step.num}
                </div>
                <h4 className="text-lg font-bold text-gray-900 dark:text-white mb-2">{step.title}</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Who We're Looking For ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/30">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Who We're Looking For</h2>
          <div className="grid sm:grid-cols-2 gap-6 mb-12">
            {idealCandidate.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.text} className="flex items-start gap-4 bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
                  <div className="w-10 h-10 rounded-xl bg-amber-100 dark:bg-amber-900/40 flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 text-sm leading-relaxed">{item.text}</p>
                </div>
              );
            })}
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">What You'll Do</h3>
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700">
            <ul className="space-y-3">
              {expectations.map((item) => (
                <li key={item} className="flex items-start gap-3 text-gray-700 dark:text-gray-300">
                  <CheckCircle className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm leading-relaxed">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── Workshop Cities ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-10 text-center">Workshop Cities</h2>
          <div className="grid sm:grid-cols-2 gap-6">
            <div className="rounded-2xl bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800 p-8 text-center">
              <MapPin className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Guwahati, Assam</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Where our stories come from. We're building our first workshops here.</p>
            </div>
            <div className="rounded-2xl bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border border-blue-200 dark:border-blue-800 p-8 text-center">
              <MapPin className="w-8 h-8 text-blue-600 dark:text-blue-400 mx-auto mb-3" />
              <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Thiruvananthapuram, Kerala</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Expanding to Kerala's capital. Strong STEM ecosystem, growing demand.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Compensation ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-white to-amber-50/30 dark:from-gray-900 dark:to-gray-800/30">
        <div className="max-w-3xl mx-auto text-center">
          <Award className="w-8 h-8 text-amber-500 mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What You Get</h2>
          <div className="grid sm:grid-cols-3 gap-6 mt-8">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Competitive</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">hourly compensation, discussed during application</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">Flexible</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">weekday evenings or weekends</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-xl p-5 border border-gray-100 dark:border-gray-700">
              <p className="text-2xl font-bold text-gray-900 dark:text-white mb-1">All materials</p>
              <p className="text-sm text-gray-500 dark:text-gray-400">curriculum, kits, and ongoing support</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Application Form ── */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-center">Apply Now</h2>
          <p className="text-center text-gray-600 dark:text-gray-400 mb-8">
            Tell us a bit about yourself. We'll get back to you within a week.
          </p>

          {status === 'success' && (
            <div className="mb-6 p-5 bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl flex items-start gap-3">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-300">Application received!</p>
                <p className="text-sm text-emerald-700 dark:text-emerald-400">We'll review your application and reach out within a week.</p>
              </div>
            </div>
          )}

          {status === 'error' && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
              Something went wrong. Please try again or email us at hello@tigmaminds.academy.
            </div>
          )}

          <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-6 sm:p-8 border border-gray-100 dark:border-gray-700 space-y-5">
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Full Name *</label>
                <input type="text" name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="Your name" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Email *</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="you@example.com" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Phone</label>
                <input type="tel" name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent" placeholder="+91 98765 43210" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">City *</label>
                <select name="city" value={form.city} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent">
                  <option value="">Select city</option>
                  <option value="Guwahati">Guwahati</option>
                  <option value="Thiruvananthapuram">Thiruvananthapuram</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Your Background *</label>
              <textarea name="background" value={form.background} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" placeholder="Education, work experience, any teaching or tutoring experience..." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-1.5">Why do you want to teach with us? *</label>
              <textarea name="motivation" value={form.motivation} onChange={handleChange} required rows={3} className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" placeholder="What excites you about teaching STEM through stories?" />
            </div>
            <button type="submit" disabled={submitting} className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3.5 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50">
              {submitting ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</>
              ) : (
                <><Send className="w-5 h-5" /> Submit Application</>
              )}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

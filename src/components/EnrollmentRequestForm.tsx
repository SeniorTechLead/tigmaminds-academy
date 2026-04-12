'use client';

import { useState } from 'react';
import { CheckCircle, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

const TRACKS = [
  { id: 'robotics', label: 'Robotics & Electronics' },
  { id: 'python-ai', label: 'Python & AI' },
  { id: 'creative', label: 'Creative Computing' },
  { id: 'not-sure', label: 'Not sure — help us decide' },
];

export default function EnrollmentRequestForm() {
  const [form, setForm] = useState({
    guardianName: '', guardianEmail: '', guardianPhone: '',
    studentName: '', studentEmail: '', studentAge: '',
    preferredTrack: '', message: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.guardianName || !form.guardianEmail || !form.studentName || !form.studentEmail) {
      setError('Please fill in all required fields.');
      return;
    }

    setSubmitting(true);
    const { error: dbErr } = await supabase.from('enrollment_requests').insert({
      guardian_name: form.guardianName,
      guardian_email: form.guardianEmail,
      guardian_phone: form.guardianPhone || null,
      student_name: form.studentName,
      student_email: form.studentEmail,
      student_age: form.studentAge ? parseInt(form.studentAge) : null,
      preferred_track: form.preferredTrack || null,
      message: form.message || null,
    });

    setSubmitting(false);
    if (dbErr) {
      setError('Something went wrong. Please try again or contact us directly.');
      console.warn('[Enrollment] Submit error:', dbErr.message);
    } else {
      setSubmitted(true);
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Request Submitted!</h3>
        <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
          We've received your enrollment request for <strong>{form.studentName}</strong>.
          Our team will review it and contact you at <strong>{form.guardianEmail}</strong> within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-xl mx-auto space-y-6">
      {error && (
        <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Guardian info */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Guardian Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name *</label>
            <input type="text" required value={form.guardianName} onChange={e => setForm(f => ({ ...f, guardianName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Email *</label>
            <input type="email" required value={form.guardianEmail} onChange={e => setForm(f => ({ ...f, guardianEmail: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <div className="sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone (optional)</label>
            <input type="tel" value={form.guardianPhone} onChange={e => setForm(f => ({ ...f, guardianPhone: e.target.value }))}
              placeholder="+91 ..."
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
        </div>
      </div>

      {/* Student info */}
      <div>
        <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-3">Student Information</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student's Name *</label>
            <input type="text" required value={form.studentName} onChange={e => setForm(f => ({ ...f, studentName: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Student's Email *</label>
            <input type="email" required value={form.studentEmail} onChange={e => setForm(f => ({ ...f, studentEmail: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Age (optional)</label>
            <input type="number" min="5" max="25" value={form.studentAge} onChange={e => setForm(f => ({ ...f, studentAge: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Preferred Track</label>
            <select value={form.preferredTrack} onChange={e => setForm(f => ({ ...f, preferredTrack: e.target.value }))}
              className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent">
              <option value="">Select a track...</option>
              {TRACKS.map(t => <option key={t.id} value={t.id}>{t.label}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Message */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Anything else we should know? (optional)</label>
        <textarea value={form.message} onChange={e => setForm(f => ({ ...f, message: e.target.value }))} rows={3}
          placeholder="Prior coding experience, specific interests, scheduling preferences..."
          className="w-full px-3 py-2.5 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none" />
      </div>

      <button type="submit" disabled={submitting}
        className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-xl font-semibold text-lg hover:shadow-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2">
        {submitting ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : 'Request Enrollment'}
      </button>

      <p className="text-xs text-gray-400 dark:text-gray-500 text-center">
        We'll review your request and contact you within 2 business days. No payment is required at this stage.
      </p>
    </form>
  );
}

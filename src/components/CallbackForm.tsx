import { useState } from 'react';
import { CheckCircle, Phone, Loader2 } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface CallbackFormProps {
  /** Extra context to include in the submission (e.g. "Bootcamp — AI/ML track") */
  context?: string;
  /** Who calls back — defaults to "mentor" for student-facing, override for employers */
  callerLabel?: string;
  /** Custom heading title */
  title?: string;
}

export default function CallbackForm({ context, callerLabel = 'mentor', title }: CallbackFormProps) {
  const [cb, setCb] = useState({ name: '', phone: '', preferredTime: '' });
  const [cbSubmitting, setCbSubmitting] = useState(false);
  const [cbStatus, setCbStatus] = useState<'idle' | 'success' | 'error'>('idle');

  const handleCbChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setCb({ ...cb, [e.target.name]: e.target.value });
  };

  const handleCbSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setCbSubmitting(true);
    setCbStatus('idle');

    try {
      const res = await fetch('/api/callback/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: cb.name,
          phone: cb.phone,
          preferredTime: cb.preferredTime,
          context,
          callerLabel,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok || data.error) {
        setCbStatus('error');
      } else {
        setCbStatus('success');
        setCb({ name: '', phone: '', preferredTime: '' });
      }
    } catch (err) {
      console.error('[Callback] Submit error:', err);
      setCbStatus('error');
    } finally {
      setCbSubmitting(false);
    }
  };

  if (cbStatus === 'success') {
    return (
      <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-5 flex items-start gap-3">
        <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="font-semibold text-emerald-900 dark:text-emerald-300">Callback scheduled!</p>
          <p className="text-sm text-emerald-700 dark:text-emerald-400">A {callerLabel} will call you during your preferred time.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-1">
        {title || 'Request a Callback'}
      </h3>
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">A real {callerLabel} — not a sales team — will call you back.</p>

      {cbStatus === 'error' && (
        <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-sm text-red-700 dark:text-red-300">
          Something went wrong. Please try again.
        </div>
      )}

      <form onSubmit={handleCbSubmit} className="space-y-3">
        <div className="grid sm:grid-cols-2 gap-3 text-left">
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Your Name *</label>
            <input type="text" name="name" value={cb.name} onChange={handleCbChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Your name" />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Phone Number *</label>
            <input type="tel" name="phone" value={cb.phone} onChange={handleCbChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="+91 98765 43210" />
          </div>
        </div>
        <div className="text-left">
          <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1">Preferred Time *</label>
          <select name="preferredTime" value={cb.preferredTime} onChange={handleCbChange} required className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 dark:bg-gray-700 dark:text-white rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
            <option value="">Select a time slot</option>
            <option value="Weekday morning (9 AM – 12 PM)">Weekday morning (9 AM – 12 PM)</option>
            <option value="Weekday afternoon (12 PM – 3 PM)">Weekday afternoon (12 PM – 3 PM)</option>
            <option value="Weekday evening (3 PM – 6 PM)">Weekday evening (3 PM – 6 PM)</option>
            <option value="Saturday (10 AM – 4 PM)">Saturday (10 AM – 4 PM)</option>
          </select>
        </div>
        <div className="pt-2 flex justify-center">
          <button type="submit" disabled={cbSubmitting} className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-8 py-2.5 rounded-xl font-semibold text-sm inline-flex items-center justify-center gap-2 transition-all shadow-md shadow-emerald-500/20 disabled:opacity-50">
            {cbSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Requesting...</> : <><Phone className="w-4 h-4" /> Request Callback</>}
          </button>
        </div>
      </form>
    </div>
  );
}

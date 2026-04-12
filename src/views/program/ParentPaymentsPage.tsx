import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Clock, AlertTriangle, ArrowLeft, Loader2 } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import {
  getParentEnrollments,
  getPayments,
  type ProgramPayment,
  type Enrollment,
  type Cohort,
} from '../../lib/program';

const statusConfig = {
  paid: { label: 'Paid', icon: CheckCircle, color: 'text-emerald-600 bg-emerald-50 border-emerald-200' },
  pending: { label: 'Due', icon: Clock, color: 'text-amber-600 bg-amber-50 border-amber-200' },
  overdue: { label: 'Overdue', icon: AlertTriangle, color: 'text-red-600 bg-red-50 border-red-200' },
  waived: { label: 'Waived', icon: CheckCircle, color: 'text-gray-500 bg-gray-50 border-gray-200' },
};

export default function ParentPaymentsPage() {
  const { user, profile, hasRole, loading: authLoading } = useAuth();
  const router = useRouter();

  const [enrollments, setEnrollments] = useState<(Enrollment & { cohorts: Cohort })[]>([]);
  const [activeIdx, setActiveIdx] = useState(0);
  const [paymentsByEnrollment, setPaymentsByEnrollment] = useState<Record<string, ProgramPayment[]>>({});
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  const enrollment = enrollments[activeIdx] || null;
  const payments = enrollment ? (paymentsByEnrollment[enrollment.id] || []) : [];

  const handlePay = async (payment: ProgramPayment) => {
    if (!user || !enrollment) return;
    setPaying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          plan: 'program_monthly',
          userId: user.id,
          email: user.email,
          name: profile?.display_name || user.email?.split('@')[0] || 'Parent',
          amount: payment.amount / 100, // convert paise to rupees
          productInfo: `Program Fee — ${payment.month_label}`,
          returnUrl: `${window.location.origin}/program/guardian/payments?result=success&month=${encodeURIComponent(payment.month_label)}`,
          failureUrl: `${window.location.origin}/program/guardian/payments?result=failed`,
          udf1: enrollment.id,
          udf2: payment.id,
          udf3: payment.month_label,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else if (data.html) {
        // PayU form submission
        const div = document.createElement('div');
        div.innerHTML = data.html;
        document.body.appendChild(div);
        const form = div.querySelector('form');
        if (form) form.submit();
      } else {
        setPaying(false);
        alert('Payment initiation failed. Please try again.');
      }
    } catch (err) {
      setPaying(false);
      console.warn('[Payment] error:', err);
    }
  };

  useEffect(() => {
    if (authLoading) return;
    if (!user) { router.push('/auth?returnTo=/program/guardian/payments'); return; }
    if (user && !profile) return;

    (async () => {
      const enrs = await getParentEnrollments(user.id, user.email || undefined);
      if (enrs.length > 0) {
        setEnrollments(enrs);
        setActiveIdx(0);
        const pMap: Record<string, ProgramPayment[]> = {};
        for (const e of enrs) {
          pMap[e.id] = await getPayments(e.id);
        }
        setPaymentsByEnrollment(pMap);
      }
      setLoading(false);
    })();
  }, [user, profile, authLoading]);

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (!enrollment) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-lg mx-auto px-4 py-16 text-center">
          <AlertTriangle className="mx-auto text-amber-500 mb-3" size={40} />
          <h1 className="text-lg font-semibold text-gray-800 mb-2">No enrollment found</h1>
          <p className="text-sm text-gray-500 mb-4">We couldn't find a program enrollment linked to your account.</p>
          <Link href="/program/guardian" className="text-sm text-indigo-600 hover:underline">← Back to progress</Link>
        </div>
      </div>
    );
  }

  const totalDue = payments.filter(p => p.status === 'pending' || p.status === 'overdue').reduce((s, p) => s + p.amount, 0);
  const totalPaid = payments.filter(p => p.status === 'paid').reduce((s, p) => s + p.amount, 0);
  const nextDue = payments.find(p => p.status === 'pending' || p.status === 'overdue');

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-lg mx-auto px-4 py-8">
        {/* Nav */}
        <div className="flex items-center justify-between mb-6">
          <Link href="/program/guardian" className="flex items-center gap-2 text-sm text-indigo-600 hover:underline">
            <ArrowLeft className="w-4 h-4" /> Back to progress
          </Link>
          <span className="text-xs text-gray-400">{profile?.display_name || user?.email?.split('@')[0]}</span>
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-1">Payments</h1>
        <p className="text-sm text-gray-500 mb-4">{enrollment.cohorts?.name || '12-Month Curriculum'}</p>

        {/* Ward selector */}
        {enrollments.length > 1 && (
          <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
            {enrollments.map((enr, idx) => (
              <button
                key={enr.id}
                onClick={() => setActiveIdx(idx)}
                className={`px-4 py-2 rounded-lg border text-sm font-semibold transition-all flex-shrink-0 ${
                  idx === activeIdx
                    ? 'bg-indigo-50 border-indigo-300 text-indigo-700'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-indigo-200'
                }`}
              >
                {(enr as any).student_email?.split('@')[0] || `Ward ${idx + 1}`}
              </button>
            ))}
          </div>
        )}

        {/* Summary cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <p className="text-xs text-gray-400 mb-1">Total Paid</p>
            <p className="text-lg font-bold text-emerald-600">₹{(totalPaid / 100).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <p className="text-xs text-gray-400 mb-1">Due</p>
            <p className="text-lg font-bold text-amber-600">₹{(totalDue / 100).toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-gray-200 text-center">
            <p className="text-xs text-gray-400 mb-1">Total Months</p>
            <p className="text-lg font-bold text-gray-700">{payments.length}</p>
          </div>
        </div>

        {/* Next due - prominent CTA */}
        {nextDue && (
          <div className={`mb-6 p-5 rounded-xl border-2 ${nextDue.status === 'overdue' ? 'border-red-300 bg-red-50' : 'border-amber-300 bg-amber-50'}`}>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Next Payment Due</p>
                <p className="text-lg font-bold text-gray-900">{nextDue.month_label}</p>
              </div>
              <p className="text-2xl font-bold text-gray-900">₹{(nextDue.amount / 100).toLocaleString()}</p>
            </div>
            <p className="text-xs text-gray-500 mb-4">
              {nextDue.status === 'overdue' ? 'This payment is overdue. Please pay at your earliest.' : 'Payment is due for this month.'}
            </p>
            <button
              onClick={() => handlePay(nextDue)}
              disabled={paying}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-400 text-white rounded-xl font-semibold text-sm transition-colors"
            >
              {paying ? 'Processing...' : `Pay ₹${(nextDue.amount / 100).toLocaleString()} Now`}
            </button>
            <p className="text-[10px] text-gray-400 mt-2 text-center">Secure payment via PayU. UPI, cards, and net banking accepted.</p>
          </div>
        )}

        {/* Payment history */}
        <h2 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Payment History</h2>
        {payments.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <p className="text-gray-400 text-sm">No payment records yet.</p>
            <p className="text-xs text-gray-400 mt-1">Payments will appear here once recorded by the academy.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {payments.map(p => {
              const cfg = statusConfig[p.status];
              const Icon = cfg.icon;
              return (
                <div key={p.id} className={`bg-white rounded-xl p-4 border ${p.status === 'overdue' ? 'border-red-200' : 'border-gray-200'} flex items-center gap-3`}>
                  <Icon className={`w-5 h-5 flex-shrink-0 ${
                    p.status === 'paid' ? 'text-emerald-500' :
                    p.status === 'overdue' ? 'text-red-500' :
                    p.status === 'waived' ? 'text-gray-400' :
                    'text-amber-500'
                  }`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{p.month_label}</p>
                    {p.payment_date && (
                      <p className="text-xs text-gray-400">Paid on {new Date(p.payment_date).toLocaleDateString()}</p>
                    )}
                    {p.payment_method && (
                      <p className="text-xs text-gray-400">Via {p.payment_method}{p.transaction_id ? ` • Ref: ${p.transaction_id}` : ''}</p>
                    )}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-sm font-bold text-gray-900">₹{(p.amount / 100).toLocaleString()}</p>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${cfg.color}`}>{cfg.label}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Help text */}
        <div className="mt-8 text-center text-xs text-gray-400 leading-relaxed">
          <p>For payment queries, contact the academy or your ward's mentor.</p>
          <Link href="/contact" className="text-indigo-500 hover:underline">Contact us</Link>
        </div>
      </div>
    </div>
  );
}

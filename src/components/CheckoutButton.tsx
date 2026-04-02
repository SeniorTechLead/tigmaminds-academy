import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2, CreditCard } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCurrency } from '../hooks/useCurrency';
import { FEATURES } from '../config/features';

interface Props {
  plan: 'online_monthly' | 'online_yearly' | 'in_person_monthly';
  label?: string;
  className?: string;
}

export default function CheckoutButton({ plan, label, className }: Props) {
  const { user, session } = useAuth();
  const { currency } = useCurrency();

  // When payments are off, show a sign-up or contact link instead
  if (!FEATURES.PAYMENTS_ENABLED) {
    return (
      <Link
        to={user ? '/contact' : '/auth?returnTo=/programs'}
        className={className || 'block w-full py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold text-center hover:shadow-lg transition-all'}
      >
        {user ? 'Contact Us to Enroll' : 'Sign Up Free'}
      </Link>
    );
  }
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    // Must be signed in
    if (!user || !session) {
      navigate(`/auth?returnTo=${encodeURIComponent('/programs')}`);
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/payment/initiate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ plan, currency }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to initiate payment');
      }

      const params = await res.json();

      // Create and auto-submit a hidden form to PayU
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = params.payu_base_url;
      form.style.display = 'none';

      const fields = [
        'key', 'txnid', 'amount', 'productinfo', 'firstname', 'email',
        'phone', 'surl', 'furl', 'hash', 'udf1', 'udf2', 'udf3', 'udf4', 'udf5',
      ];

      for (const field of fields) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = field;
        input.value = params[field] || '';
        form.appendChild(input);
      }

      document.body.appendChild(form);
      form.submit();
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  const defaultLabel = loading ? 'Redirecting to payment...' : (label || 'Subscribe');

  return (
    <div>
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className || 'w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white py-2.5 rounded-xl font-semibold text-sm hover:shadow-lg transition-all disabled:opacity-50'}
      >
        {loading ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> {defaultLabel}</>
        ) : (
          <><CreditCard className="w-4 h-4" /> {defaultLabel}</>
        )}
      </button>
      {error && (
        <p className="text-xs text-red-600 dark:text-red-400 mt-1 text-center">{error}</p>
      )}
    </div>
  );
}

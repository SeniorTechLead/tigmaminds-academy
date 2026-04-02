import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { FEATURES } from '../config/features';

export interface Subscription {
  id: string;
  plan: 'online_monthly' | 'online_yearly' | 'in_person_monthly';
  status: 'active' | 'cancelled' | 'expired' | 'pending';
  currency: 'INR' | 'USD';
  amount: number;
  period_start: string;
  period_end: string;
}

interface SubscriptionContextType {
  subscription: Subscription | null;
  loading: boolean;
  hasActiveSubscription: boolean;
  plan: 'free' | 'online' | 'in_person';
  refresh: () => Promise<void>;
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export function SubscriptionProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchSubscription = useCallback(async () => {
    if (!user) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    // Don't query the table if payments are disabled (table may not exist)
    if (!FEATURES.PAYMENTS_ENABLED) {
      setSubscription(null);
      setLoading(false);
      return;
    }

    const { data, error } = await supabase
      .from('subscriptions')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .gte('period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error('Failed to fetch subscription:', error.message);
      // Don't block the app — treat as free tier
    }

    setSubscription(data || null);
    setLoading(false);
  }, [user]);

  useEffect(() => {
    fetchSubscription();
  }, [fetchSubscription]);

  // Check URL for payment success — trigger refresh
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('payment') === 'success') {
      // Delay slightly to let the serverless function finish writing
      setTimeout(fetchSubscription, 1500);
    }
  }, [fetchSubscription]);

  const hasActiveSubscription = !!subscription;

  const plan: 'free' | 'online' | 'in_person' = subscription
    ? subscription.plan.startsWith('in_person') ? 'in_person' : 'online'
    : 'free';

  return (
    <SubscriptionContext.Provider value={{ subscription, loading, hasActiveSubscription, plan, refresh: fetchSubscription }}>
      {children}
    </SubscriptionContext.Provider>
  );
}

export function useSubscription() {
  const context = useContext(SubscriptionContext);
  if (!context) throw new Error('useSubscription must be used within SubscriptionProvider');
  return context;
}

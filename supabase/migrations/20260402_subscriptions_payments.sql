-- Subscriptions and Payments for PayU integration
-- Run this migration in Supabase SQL editor

-- ── Subscriptions table ──
CREATE TABLE IF NOT EXISTS subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('online_monthly', 'online_yearly', 'in_person_monthly')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('active', 'cancelled', 'expired', 'pending')),
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  amount NUMERIC(10, 2) NOT NULL,
  period_start TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  period_end TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- One active subscription per user (allow multiple rows for history, but only one active)
CREATE UNIQUE INDEX IF NOT EXISTS idx_subscriptions_active_user
  ON subscriptions (user_id)
  WHERE status = 'active';

CREATE INDEX IF NOT EXISTS idx_subscriptions_user ON subscriptions (user_id);
CREATE INDEX IF NOT EXISTS idx_subscriptions_status ON subscriptions (status, period_end);

-- ── Payments table ──
CREATE TABLE IF NOT EXISTS payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subscription_id UUID REFERENCES subscriptions(id),
  txnid TEXT UNIQUE NOT NULL,
  payu_mihpayid TEXT,
  amount NUMERIC(10, 2) NOT NULL,
  currency TEXT NOT NULL CHECK (currency IN ('INR', 'USD')),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'success', 'failed', 'refunded')),
  plan TEXT NOT NULL,
  payu_response JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_payments_user ON payments (user_id);
CREATE INDEX IF NOT EXISTS idx_payments_txnid ON payments (txnid);
CREATE INDEX IF NOT EXISTS idx_payments_status ON payments (status);

-- ── RLS Policies ──
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Users can read their own subscriptions
CREATE POLICY "Users read own subscriptions"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Users can read their own payments
CREATE POLICY "Users read own payments"
  ON payments FOR SELECT
  USING (auth.uid() = user_id);

-- Service role can do everything (used by serverless functions)
CREATE POLICY "Service role full access subscriptions"
  ON subscriptions FOR ALL
  USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access payments"
  ON payments FOR ALL
  USING (auth.role() = 'service_role');

-- ── Updated_at trigger ──
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER subscriptions_updated_at
  BEFORE UPDATE ON subscriptions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER payments_updated_at
  BEFORE UPDATE ON payments
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

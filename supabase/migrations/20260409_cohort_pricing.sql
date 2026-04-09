-- Add pricing fields to cohorts

ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS monthly_fee INT DEFAULT 999900;  -- paise (₹9,999)
ALTER TABLE cohorts ADD COLUMN IF NOT EXISTS currency TEXT DEFAULT 'INR';

-- Discount codes
CREATE TABLE IF NOT EXISTS discount_codes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  description TEXT,
  discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value INT NOT NULL,                  -- percentage (e.g. 10 = 10%) or fixed amount in paise
  max_uses INT,                                 -- NULL = unlimited
  times_used INT DEFAULT 0,
  valid_from TIMESTAMPTZ DEFAULT NOW(),
  valid_until TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Track which enrollment used which discount
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS discount_code_id UUID REFERENCES discount_codes(id);
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS effective_monthly_fee INT;  -- after discount, in paise

ALTER TABLE discount_codes ENABLE ROW LEVEL SECURITY;

-- Only admins can manage discount codes
CREATE POLICY "admins_manage_discounts" ON discount_codes
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Anyone can read active codes (for validation during enrollment)
CREATE POLICY "read_active_discounts" ON discount_codes
  FOR SELECT USING (is_active = TRUE);

CREATE INDEX IF NOT EXISTS idx_discount_codes_code ON discount_codes (code);

NOTIFY pgrst, 'reload schema';

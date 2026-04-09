-- Program payment tracking

CREATE TABLE IF NOT EXISTS program_payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  amount INT NOT NULL,                          -- amount in paise (INR) or cents (USD)
  currency TEXT DEFAULT 'INR',
  month_label TEXT NOT NULL,                    -- e.g. "April 2026", "May 2026"
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'overdue', 'waived')),
  payment_method TEXT,                          -- 'upi', 'bank_transfer', 'card', 'cash', 'online'
  payment_date TIMESTAMPTZ,                     -- when the payment was made
  transaction_id TEXT,                          -- UPI ref, bank ref, etc.
  receipt_url TEXT,                              -- link to receipt if generated
  notes TEXT,                                    -- admin notes
  recorded_by UUID REFERENCES auth.users(id),   -- who recorded this (admin/mentor)
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(enrollment_id, month_label)
);

ALTER TABLE program_payments ENABLE ROW LEVEL SECURITY;

-- Parents and students can see their own payments
CREATE POLICY "own_payments_read" ON program_payments
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      WHERE e.id = program_payments.enrollment_id
      AND (e.student_id = auth.uid() OR e.parent_id = auth.uid())
    )
  );

-- Admins and mentors can manage all payments in their cohorts
CREATE POLICY "staff_payments_manage" ON program_payments
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN cohorts c ON c.id = e.cohort_id
      WHERE e.id = program_payments.enrollment_id
      AND (c.mentor_id = auth.uid() OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)))
    )
  );

CREATE INDEX IF NOT EXISTS idx_program_payments_enrollment ON program_payments (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_program_payments_status ON program_payments (status);

NOTIFY pgrst, 'reload schema';

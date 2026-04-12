-- Enrollment requests from guardians (public form → admin approval)
CREATE TABLE IF NOT EXISTS enrollment_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  guardian_name TEXT NOT NULL,
  guardian_email TEXT NOT NULL,
  guardian_phone TEXT,
  student_name TEXT NOT NULL,
  student_email TEXT NOT NULL,
  student_age INT,
  preferred_track TEXT,
  message TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  admin_notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

CREATE INDEX IF NOT EXISTS idx_enrollment_requests_status ON enrollment_requests(status);

ALTER TABLE enrollment_requests ENABLE ROW LEVEL SECURITY;

-- Anyone can submit (insert) but only admins can read/update
CREATE POLICY "anyone_can_submit" ON enrollment_requests
  FOR INSERT WITH CHECK (true);

CREATE POLICY "admins_manage_requests" ON enrollment_requests
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

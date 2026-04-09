-- Program messaging: parent, student, mentor, admin
-- All messages are tied to an enrollment (student in a cohort)

CREATE TABLE IF NOT EXISTS program_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  sender_type TEXT NOT NULL CHECK (sender_type IN ('parent', 'student', 'mentor', 'admin')),
  sender_id UUID,                               -- auth user id (NULL for parent who uses token)
  parent_token TEXT,                             -- set when sender is parent (for auth-free access)
  recipient_type TEXT NOT NULL CHECK (recipient_type IN ('parent', 'student', 'mentor', 'admin', 'all')),
  message TEXT NOT NULL,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE program_messages ENABLE ROW LEVEL SECURITY;

-- Parents can send and read messages via their token
CREATE POLICY "parents_access_messages" ON program_messages
  FOR ALL USING (
    parent_token IS NOT NULL
    AND EXISTS (SELECT 1 FROM parent_access WHERE token = program_messages.parent_token)
  );

-- Students can send/read messages for their own enrollment
CREATE POLICY "students_access_messages" ON program_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM enrollments WHERE id = program_messages.enrollment_id AND student_id = auth.uid())
  );

-- Mentors can read/write messages for their cohort students
CREATE POLICY "mentors_access_messages" ON program_messages
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN cohorts c ON c.id = e.cohort_id
      WHERE e.id = program_messages.enrollment_id AND c.mentor_id = auth.uid()
    )
  );

-- Admins can access all messages
CREATE POLICY "admins_access_messages" ON program_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE INDEX IF NOT EXISTS idx_program_messages_enrollment ON program_messages (enrollment_id, created_at);
CREATE INDEX IF NOT EXISTS idx_program_messages_token ON program_messages (parent_token);

NOTIFY pgrst, 'reload schema';

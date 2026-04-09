-- ============================================================
-- SCHOOL PROGRAM: Cohorts, Enrollment, Weekly Progress
-- ============================================================

-- A cohort is a group of students in a specific track with a mentor
CREATE TABLE IF NOT EXISTS cohorts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,                           -- e.g. "Robotics Batch 1 — Guwahati"
  track_id TEXT NOT NULL,                       -- matches school-curriculum.ts track ids: 'robotics', 'python-ai', 'creative', 'combined'
  mentor_id UUID REFERENCES auth.users(id),     -- mentor's auth user id
  city TEXT,                                    -- e.g. "Guwahati", "Thiruvananthapuram"
  max_students INT DEFAULT 12,
  start_date DATE NOT NULL,
  end_date DATE,                                -- auto: start_date + 48 weeks
  status TEXT DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'active', 'completed', 'paused')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enrollment links a student (+ parent) to a cohort
CREATE TABLE IF NOT EXISTS enrollments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cohort_id UUID NOT NULL REFERENCES cohorts(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_email TEXT,                            -- parent/guardian email for progress reports
  parent_name TEXT,
  enrolled_at TIMESTAMPTZ DEFAULT NOW(),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'paused', 'dropped', 'completed')),
  UNIQUE(cohort_id, student_id)
);

-- Weekly progress per student per week
CREATE TABLE IF NOT EXISTS weekly_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  week_number INT NOT NULL CHECK (week_number >= 1 AND week_number <= 48),

  -- Content progress
  story_completed BOOLEAN DEFAULT FALSE,        -- did they complete the assigned story levels?
  project_submitted BOOLEAN DEFAULT FALSE,      -- did they submit the weekly project?
  project_url TEXT,                              -- link to project (GitHub, photo, video)
  project_notes TEXT,                            -- student's notes on their project

  -- Mentor assessment
  mentor_score INT CHECK (mentor_score >= 0 AND mentor_score <= 5),  -- 0-5 rating
  mentor_feedback TEXT,                          -- written feedback

  -- Attendance
  attended BOOLEAN DEFAULT FALSE,               -- did they attend the session?

  -- Timestamps
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(enrollment_id, week_number)
);

-- Parent access tokens — allows parents to view progress without an account
CREATE TABLE IF NOT EXISTS parent_access (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  enrollment_id UUID NOT NULL REFERENCES enrollments(id) ON DELETE CASCADE,
  token TEXT NOT NULL UNIQUE,                   -- random token for parent URL
  parent_email TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  last_viewed_at TIMESTAMPTZ
);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================

ALTER TABLE cohorts ENABLE ROW LEVEL SECURITY;
ALTER TABLE enrollments ENABLE ROW LEVEL SECURITY;
ALTER TABLE weekly_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE parent_access ENABLE ROW LEVEL SECURITY;

-- Mentors can see/manage their own cohorts
CREATE POLICY "Mentors manage own cohorts" ON cohorts
  FOR ALL USING (auth.uid() = mentor_id);

-- Students can see cohorts they're enrolled in
CREATE POLICY "Students see own cohorts" ON cohorts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM enrollments WHERE enrollments.cohort_id = cohorts.id AND enrollments.student_id = auth.uid())
  );

-- Students see their own enrollment
CREATE POLICY "Students see own enrollment" ON enrollments
  FOR SELECT USING (student_id = auth.uid());

-- Mentors see enrollments in their cohorts
CREATE POLICY "Mentors manage cohort enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM cohorts WHERE cohorts.id = enrollments.cohort_id AND cohorts.mentor_id = auth.uid())
  );

-- Students see/update their own weekly progress
CREATE POLICY "Students manage own weekly progress" ON weekly_progress
  FOR ALL USING (
    EXISTS (SELECT 1 FROM enrollments WHERE enrollments.id = weekly_progress.enrollment_id AND enrollments.student_id = auth.uid())
  );

-- Mentors see/update progress in their cohorts
CREATE POLICY "Mentors manage cohort progress" ON weekly_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN cohorts c ON c.id = e.cohort_id
      WHERE e.id = weekly_progress.enrollment_id AND c.mentor_id = auth.uid()
    )
  );

-- Parent access is public-read by token (no auth needed)
CREATE POLICY "Anyone can read parent access by token" ON parent_access
  FOR SELECT USING (true);

-- Only mentors can create parent access tokens
CREATE POLICY "Mentors create parent access" ON parent_access
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM enrollments e
      JOIN cohorts c ON c.id = e.cohort_id
      WHERE e.id = parent_access.enrollment_id AND c.mentor_id = auth.uid()
    )
  );

-- ============================================================
-- INDEXES
-- ============================================================

CREATE INDEX IF NOT EXISTS idx_enrollments_cohort ON enrollments (cohort_id);
CREATE INDEX IF NOT EXISTS idx_enrollments_student ON enrollments (student_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_enrollment ON weekly_progress (enrollment_id);
CREATE INDEX IF NOT EXISTS idx_weekly_progress_week ON weekly_progress (enrollment_id, week_number);
CREATE INDEX IF NOT EXISTS idx_parent_access_token ON parent_access (token);

-- ============================================================
-- HELPER VIEWS
-- ============================================================

-- Mentor dashboard view: all students with current week progress
CREATE OR REPLACE VIEW cohort_dashboard AS
SELECT
  c.id AS cohort_id,
  c.name AS cohort_name,
  c.track_id,
  c.mentor_id,
  c.start_date,
  c.status AS cohort_status,
  e.id AS enrollment_id,
  e.student_id,
  e.parent_email,
  e.status AS student_status,
  up.display_name AS student_name,
  -- Current week number based on start date
  GREATEST(1, LEAST(48, EXTRACT(WEEK FROM NOW() - c.start_date::timestamp)::int + 1)) AS current_week,
  -- Count completed weeks
  (SELECT COUNT(*) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.project_submitted) AS weeks_completed,
  -- Count attended sessions
  (SELECT COUNT(*) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.attended) AS sessions_attended,
  -- Average mentor score
  (SELECT AVG(wp.mentor_score) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.mentor_score IS NOT NULL) AS avg_score
FROM cohorts c
JOIN enrollments e ON e.cohort_id = c.id
LEFT JOIN user_profiles up ON up.id = e.student_id;

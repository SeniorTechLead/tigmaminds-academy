-- Allow admins to see and manage ALL cohorts, enrollments, and progress

-- Drop existing restrictive policies
DROP POLICY IF EXISTS "Mentors manage own cohorts" ON cohorts;
DROP POLICY IF EXISTS "Students see own cohorts" ON cohorts;
DROP POLICY IF EXISTS "Mentors manage cohort enrollments" ON enrollments;

-- Recreate with admin access
CREATE POLICY "Admins and mentors manage cohorts" ON cohorts
  FOR ALL USING (
    auth.uid() = mentor_id
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

CREATE POLICY "Students see own cohorts" ON cohorts
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM enrollments WHERE enrollments.cohort_id = cohorts.id AND enrollments.student_id = auth.uid())
  );

CREATE POLICY "Admins and mentors manage enrollments" ON enrollments
  FOR ALL USING (
    EXISTS (SELECT 1 FROM cohorts WHERE cohorts.id = enrollments.cohort_id AND cohorts.mentor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

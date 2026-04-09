-- Allow invite-based enrollment (student may not have an account yet)

-- Add student_email to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS student_email TEXT;

-- Make student_id nullable
ALTER TABLE enrollments ALTER COLUMN student_id DROP NOT NULL;

-- Backfill student_email from existing enrollments
UPDATE enrollments SET student_email = up.email
FROM user_profiles up WHERE enrollments.student_id = up.id AND enrollments.student_email IS NULL;

-- Drop the old unique constraint and recreate with email support
ALTER TABLE enrollments DROP CONSTRAINT IF EXISTS enrollments_cohort_id_student_id_key;
CREATE UNIQUE INDEX IF NOT EXISTS enrollments_unique_student
  ON enrollments (cohort_id, COALESCE(student_id, '00000000-0000-0000-0000-000000000000'), COALESCE(student_email, ''));

-- When a user signs up, auto-link any pending enrollments by email
CREATE OR REPLACE FUNCTION public.link_enrollment_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE enrollments
  SET student_id = NEW.id
  WHERE student_email = NEW.email AND student_id IS NULL;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_signup_link_enrollment ON auth.users;
CREATE TRIGGER on_signup_link_enrollment
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.link_enrollment_on_signup();

-- Update RLS to also allow access for email-matched enrollments
DROP POLICY IF EXISTS "enrollments_access" ON enrollments;
CREATE POLICY "enrollments_access" ON enrollments
  FOR ALL USING (
    student_id = auth.uid()
    OR EXISTS (SELECT 1 FROM cohorts WHERE cohorts.id = enrollments.cohort_id AND cohorts.mentor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

NOTIFY pgrst, 'reload schema';

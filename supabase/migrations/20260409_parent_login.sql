-- Parent login support: parents sign up and auto-link to their child's enrollment

-- Add parent_id to enrollments
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS parent_id UUID REFERENCES auth.users(id);

-- Add 'parent' to user_profiles role check
ALTER TABLE user_profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;
ALTER TABLE user_profiles ADD CONSTRAINT user_profiles_role_check
  CHECK (role IN ('student', 'teacher', 'admin', 'parent'));

-- Update signup trigger to link both students AND parents
CREATE OR REPLACE FUNCTION public.link_enrollment_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Link as student
  UPDATE enrollments
  SET student_id = NEW.id
  WHERE student_email = NEW.email AND student_id IS NULL;

  -- Link as parent
  UPDATE enrollments
  SET parent_id = NEW.id
  WHERE parent_email = NEW.email AND parent_id IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update signup trigger to set role = 'parent' if they match a parent_email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  is_parent BOOLEAN;
BEGIN
  -- Check if this email is a parent_email in any enrollment
  SELECT EXISTS(SELECT 1 FROM enrollments WHERE parent_email = NEW.email) INTO is_parent;

  INSERT INTO public.user_profiles (id, display_name, email, role)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN is_parent THEN 'parent' ELSE 'student' END
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Parents can see enrollments where they are the parent
DROP POLICY IF EXISTS "enrollments_access" ON enrollments;
CREATE POLICY "enrollments_access" ON enrollments
  FOR ALL USING (
    student_id = auth.uid()
    OR parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM cohorts WHERE cohorts.id = enrollments.cohort_id AND cohorts.mentor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin')
  );

-- Parents can see weekly progress for their child's enrollment
DROP POLICY IF EXISTS "Students manage own weekly progress" ON weekly_progress;
CREATE POLICY "students_and_parents_weekly_progress" ON weekly_progress
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = weekly_progress.enrollment_id
      AND (enrollments.student_id = auth.uid() OR enrollments.parent_id = auth.uid())
    )
  );

-- Parents can access messages for their child's enrollment
DROP POLICY IF EXISTS "parents_access_messages" ON program_messages;
CREATE POLICY "parents_access_messages" ON program_messages
  FOR ALL USING (
    parent_token IS NOT NULL
    AND EXISTS (SELECT 1 FROM parent_access WHERE token = program_messages.parent_token)
  )
  OR (
    EXISTS (
      SELECT 1 FROM enrollments
      WHERE enrollments.id = program_messages.enrollment_id
      AND enrollments.parent_id = auth.uid()
    )
  );

NOTIFY pgrst, 'reload schema';

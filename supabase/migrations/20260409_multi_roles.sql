-- Migrate from single role to roles array

-- Add roles array column
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS roles TEXT[] DEFAULT '{student}';

-- Backfill: copy existing single role into array
UPDATE user_profiles SET roles = ARRAY[role] WHERE roles = '{student}' AND role != 'student';

-- Update signup trigger: new users get roles array, check for parent enrollment
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
DECLARE
  user_roles TEXT[];
  is_parent BOOLEAN;
  is_student BOOLEAN;
BEGIN
  user_roles := ARRAY['student'];

  -- Check if this email is a parent in any enrollment
  SELECT EXISTS(SELECT 1 FROM enrollments WHERE parent_email = NEW.email) INTO is_parent;
  IF is_parent THEN
    user_roles := array_append(user_roles, 'parent');
  END IF;

  INSERT INTO public.user_profiles (id, display_name, email, role, roles)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)),
    NEW.email,
    CASE WHEN is_parent THEN 'parent' ELSE 'student' END,
    user_roles
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to add a role to a user (admin use)
CREATE OR REPLACE FUNCTION add_role_to_user(target_user_id UUID, new_role TEXT)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE user_profiles
  SET roles = array_append(roles, new_role)
  WHERE id = target_user_id AND NOT (new_role = ANY(roles));
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to remove a role from a user (admin use)
CREATE OR REPLACE FUNCTION remove_role_from_user(target_user_id UUID, old_role TEXT)
RETURNS void AS $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  UPDATE user_profiles
  SET roles = array_remove(roles, old_role)
  WHERE id = target_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Update RLS policies to use roles array instead of single role
-- Cohorts
DROP POLICY IF EXISTS "Admins and mentors manage cohorts" ON cohorts;
DROP POLICY IF EXISTS "cohorts_access" ON cohorts;
CREATE POLICY "cohorts_access" ON cohorts
  FOR ALL USING (
    auth.uid() = mentor_id
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Enrollments
DROP POLICY IF EXISTS "enrollments_access" ON enrollments;
CREATE POLICY "enrollments_access" ON enrollments
  FOR ALL USING (
    student_id = auth.uid()
    OR parent_id = auth.uid()
    OR EXISTS (SELECT 1 FROM cohorts WHERE cohorts.id = enrollments.cohort_id AND cohorts.mentor_id = auth.uid())
    OR EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Messages admin policy
DROP POLICY IF EXISTS "admins_access_messages" ON program_messages;
CREATE POLICY "admins_access_messages" ON program_messages
  FOR ALL USING (
    EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles))
  );

-- Update lookup function to use roles array
CREATE OR REPLACE FUNCTION lookup_user_by_email(target_email TEXT)
RETURNS UUID AS $$
DECLARE
  uid UUID;
BEGIN
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND 'admin' = ANY(roles)) THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;
  SELECT id INTO uid FROM user_profiles WHERE email = target_email LIMIT 1;
  RETURN uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Link enrollment trigger: also add 'parent' role to existing users
CREATE OR REPLACE FUNCTION public.link_enrollment_on_signup()
RETURNS TRIGGER AS $$
BEGIN
  -- Link as student
  UPDATE enrollments SET student_id = NEW.id
  WHERE student_email = NEW.email AND student_id IS NULL;

  -- Link as parent
  UPDATE enrollments SET parent_id = NEW.id
  WHERE parent_email = NEW.email AND parent_id IS NULL;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- For EXISTING users who get added as parent later, we need a way to add the role
-- This is handled by the add_role_to_user() function above
-- The admin dashboard should call it when enrolling with a parent email that matches an existing account

NOTIFY pgrst, 'reload schema';

-- ============================================================
-- Final policy shape for public submission tables
--
-- The two earlier attempts today (20260422_restore_anon_inserts.sql
-- and 20260422b_force_anon_inserts.sql) both failed because of a
-- subtle PostgREST quirk:
--
--   CREATE POLICY ... FOR INSERT TO anon, authenticated WITH CHECK (true);
--
-- does NOT allow anon inserts through PostgREST. Only
--
--   CREATE POLICY ... AS PERMISSIVE FOR ALL TO PUBLIC USING (false) WITH CHECK (true);
--
-- does. The USING (false) blocks anon from reading back rows,
-- while WITH CHECK (true) allows writes. admin_select lets
-- authenticated admins read.
--
-- This matches what is live in the DB — committing so the
-- migration history matches reality.
-- ============================================================

-- contact_submissions --------------------------------------------
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname = 'public' AND tablename = 'contact_submissions'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.contact_submissions', r.policyname);
  END LOOP;
END $$;

CREATE POLICY anyone_insert ON public.contact_submissions
  AS PERMISSIVE FOR ALL TO PUBLIC
  USING (false)
  WITH CHECK (true);

CREATE POLICY admin_select ON public.contact_submissions
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
      AND 'admin' = ANY(user_profiles.roles)
  ));

-- student_applications -------------------------------------------
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname = 'public' AND tablename = 'student_applications'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.student_applications', r.policyname);
  END LOOP;
END $$;

CREATE POLICY anyone_insert ON public.student_applications
  AS PERMISSIVE FOR ALL TO PUBLIC
  USING (false)
  WITH CHECK (true);

CREATE POLICY admin_select ON public.student_applications
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
      AND 'admin' = ANY(user_profiles.roles)
  ));

-- enrollment_requests --------------------------------------------
DO $$ DECLARE r RECORD; BEGIN
  FOR r IN SELECT policyname FROM pg_policies
           WHERE schemaname = 'public' AND tablename = 'enrollment_requests'
  LOOP EXECUTE format('DROP POLICY IF EXISTS %I ON public.enrollment_requests', r.policyname);
  END LOOP;
END $$;

CREATE POLICY anyone_insert ON public.enrollment_requests
  AS PERMISSIVE FOR ALL TO PUBLIC
  USING (false)
  WITH CHECK (
    student_email IS NOT NULL
    AND length(trim(student_email)) > 0
    AND student_email LIKE '%@%'
  );

CREATE POLICY admin_select ON public.enrollment_requests
  FOR SELECT TO authenticated
  USING (EXISTS (
    SELECT 1 FROM public.user_profiles
    WHERE user_profiles.id = auth.uid()
      AND 'admin' = ANY(user_profiles.roles)
  ));

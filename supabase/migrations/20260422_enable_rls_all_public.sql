-- ============================================================
-- Security hardening: fix advisor findings
--
-- 1. Re-enable RLS on 5 tables that have policies but RLS off
-- 2. Recreate cohort_dashboard without SECURITY DEFINER
-- 3. Pin search_path on 9 SECURITY DEFINER-style functions
-- 4. Tighten enrollment_requests INSERT policy (no WITH CHECK true)
--
-- Note: "Leaked password protection" is an Auth dashboard
-- toggle, not SQL — enable it under Authentication → Policies.
-- ============================================================

-- 1. Re-enable RLS on flagged tables ---------------------------
ALTER TABLE public.contact_submissions   ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.courses               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.mentors               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_applications  ENABLE ROW LEVEL SECURITY;

-- 2. Recreate cohort_dashboard without SECURITY DEFINER --------
-- Same definition as in 20260409_school_program.sql, but with
-- security_invoker = true so it runs under the caller's RLS.
DROP VIEW IF EXISTS public.cohort_dashboard;
CREATE VIEW public.cohort_dashboard
WITH (security_invoker = true) AS
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
  GREATEST(1, LEAST(48, EXTRACT(WEEK FROM NOW() - c.start_date::timestamp)::int + 1)) AS current_week,
  (SELECT COUNT(*) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.project_submitted) AS weeks_completed,
  (SELECT COUNT(*) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.attended) AS sessions_attended,
  (SELECT AVG(wp.mentor_score) FROM weekly_progress wp WHERE wp.enrollment_id = e.id AND wp.mentor_score IS NOT NULL) AS avg_score
FROM cohorts c
JOIN enrollments e ON e.cohort_id = c.id
LEFT JOIN user_profiles up ON up.id = e.student_id;

-- 3. Pin search_path on existing functions ---------------------
-- SECURITY DEFINER functions with a mutable search_path are a
-- privilege-escalation risk: a malicious schema on the caller's
-- path can shadow built-in names. We pin search_path to
-- 'public, auth, pg_temp' — this matches what the function
-- bodies already assume (unqualified refs to public tables and
-- auth.uid()) while preventing a caller from inserting a
-- malicious schema ahead of these. ALTER FUNCTION is idempotent.
ALTER FUNCTION public.lookup_user_by_email(text)                SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.link_enrollment_on_signup()               SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.add_role_to_user(uuid, text)              SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.remove_role_from_user(uuid, text)         SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.create_auth_user(text, text, text)        SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.update_user_password(text, text)          SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.delete_auth_user(text)                    SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.remove_enrollment(uuid)                   SET search_path = 'public, auth, pg_temp';
ALTER FUNCTION public.handle_new_user()                         SET search_path = 'public, auth, pg_temp';

-- 4. Tighten enrollment_requests INSERT policy -----------------
-- Previously: WITH CHECK (true) — allowed any row to be inserted.
-- Tightened: require non-empty email (still open to anon, but
-- not trivially spammable with empty payloads). Real spam
-- control belongs at the API layer (captcha / rate limit).
DROP POLICY IF EXISTS anyone_can_submit ON public.enrollment_requests;
CREATE POLICY anyone_can_submit ON public.enrollment_requests
  FOR INSERT
  WITH CHECK (
    student_email IS NOT NULL
    AND length(trim(student_email)) > 0
    AND student_email LIKE '%@%'
  );

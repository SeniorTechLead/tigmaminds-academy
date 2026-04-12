-- Updated remove_enrollment: also cleans up guardian role + auth user if no other enrollments
CREATE OR REPLACE FUNCTION remove_enrollment(target_enrollment_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  student_email_val TEXT;
  student_id_val UUID;
  guardian_email_val TEXT;
  guardian_id_val UUID;
  other_student_enrollments INT;
  other_guardian_enrollments INT;
BEGIN
  -- Get student and guardian info before deleting
  SELECT student_email, student_id, parent_email, parent_id
  INTO student_email_val, student_id_val, guardian_email_val, guardian_id_val
  FROM enrollments WHERE id = target_enrollment_id;

  -- Delete child rows
  DELETE FROM weekly_progress WHERE enrollment_id = target_enrollment_id;
  DELETE FROM program_payments WHERE enrollment_id = target_enrollment_id;
  DELETE FROM parent_access WHERE enrollment_id = target_enrollment_id;
  DELETE FROM program_messages WHERE enrollment_id = target_enrollment_id;
  DELETE FROM email_tokens WHERE email = student_email_val;
  DELETE FROM enrollments WHERE id = target_enrollment_id;

  -- Clean up student auth if no other enrollments
  IF student_id_val IS NOT NULL THEN
    SELECT COUNT(*) INTO other_student_enrollments FROM enrollments WHERE student_id = student_id_val;
    IF other_student_enrollments = 0 THEN
      DELETE FROM user_profiles WHERE id = student_id_val;
      DELETE FROM auth.users WHERE id = student_id_val;
    END IF;
  END IF;

  -- Clean up guardian: remove 'parent' role if no more enrollments link to them
  IF guardian_id_val IS NOT NULL THEN
    SELECT COUNT(*) INTO other_guardian_enrollments
    FROM enrollments WHERE parent_id = guardian_id_val;

    IF other_guardian_enrollments = 0 THEN
      -- Remove ONLY 'parent' from roles array — preserve all other roles
      UPDATE user_profiles
      SET roles = array_remove(roles, 'parent'),
          role = CASE
            WHEN 'admin' = ANY(array_remove(roles, 'parent')) THEN 'admin'
            WHEN 'teacher' = ANY(array_remove(roles, 'parent')) THEN 'teacher'
            WHEN 'student' = ANY(array_remove(roles, 'parent')) THEN 'student'
            ELSE 'student'
          END
      WHERE id = guardian_id_val
      AND 'parent' = ANY(roles);  -- only touch if they actually have the parent role
    END IF;
  END IF;
END;
$$;

-- Add payu_txnid to program_payments for payment tracking
ALTER TABLE program_payments ADD COLUMN IF NOT EXISTS payu_txnid TEXT;

-- Guardian ward data is now served via /api/program/guardian-data (service role)
-- No RLS policy needed for cross-user profile reads — all handled server-side

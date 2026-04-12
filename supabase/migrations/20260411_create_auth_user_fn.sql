-- Function to create an auth user via SQL (bypasses unreliable admin API)
-- Called from our invite API route via supabase.rpc('create_auth_user', {...})
CREATE OR REPLACE FUNCTION create_auth_user(
  user_email TEXT,
  user_password TEXT,
  user_display_name TEXT DEFAULT NULL
) RETURNS UUID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  new_id UUID;
BEGIN
  -- Check if user already exists
  SELECT id INTO new_id FROM auth.users WHERE email = user_email;
  IF new_id IS NOT NULL THEN
    RETURN new_id;
  END IF;

  -- Create the user
  new_id := gen_random_uuid();
  INSERT INTO auth.users (
    id, instance_id, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    aud, role
  ) VALUES (
    new_id,
    '00000000-0000-0000-0000-000000000000',
    user_email,
    crypt(user_password, gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb,
    jsonb_build_object('display_name', COALESCE(user_display_name, split_part(user_email, '@', 1))),
    'authenticated',
    'authenticated'
  );

  -- The handle_new_user trigger auto-creates the user_profiles row
  RETURN new_id;
END;
$$;

-- Function to update a user's password via SQL (bypasses unreliable admin API)
CREATE OR REPLACE FUNCTION update_user_password(
  user_email TEXT,
  new_password TEXT
) RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  UPDATE auth.users
  SET encrypted_password = crypt(new_password, gen_salt('bf')),
      updated_at = now()
  WHERE email = user_email;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'User not found: %', user_email;
  END IF;
END;
$$;

-- Function to delete an auth user by email
CREATE OR REPLACE FUNCTION delete_auth_user(user_email TEXT)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM auth.users WHERE email = user_email;
END;
$$;

-- Function to fully remove a student enrollment and all linked data
CREATE OR REPLACE FUNCTION remove_enrollment(target_enrollment_id UUID)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  DELETE FROM weekly_progress WHERE enrollment_id = target_enrollment_id;
  DELETE FROM program_payments WHERE enrollment_id = target_enrollment_id;
  DELETE FROM parent_access WHERE enrollment_id = target_enrollment_id;
  DELETE FROM program_messages WHERE enrollment_id = target_enrollment_id;
  DELETE FROM enrollments WHERE id = target_enrollment_id;
END;
$$;

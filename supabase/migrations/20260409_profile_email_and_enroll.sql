-- Add email to user_profiles for lookup
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_profiles' AND column_name = 'email') THEN
    ALTER TABLE user_profiles ADD COLUMN email TEXT;
  END IF;
END $$;

-- Backfill existing profiles with email from auth.users
UPDATE user_profiles SET email = u.email
FROM auth.users u WHERE user_profiles.id = u.id AND user_profiles.email IS NULL;

-- Update the signup trigger to also store email
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_profiles (id, display_name, email)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', split_part(NEW.email, '@', 1)), NEW.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RPC to look up a user ID by email (admin only)
CREATE OR REPLACE FUNCTION lookup_user_by_email(target_email TEXT)
RETURNS UUID AS $$
DECLARE
  uid UUID;
BEGIN
  -- Only admins can call this
  IF NOT EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role = 'admin') THEN
    RAISE EXCEPTION 'unauthorized';
  END IF;

  SELECT id INTO uid FROM user_profiles WHERE email = target_email LIMIT 1;
  RETURN uid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Force PostgREST to pick up new functions immediately
NOTIFY pgrst, 'reload schema';

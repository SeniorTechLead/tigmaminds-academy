-- Email verification and password reset tokens
-- Our own flow, independent of Supabase auth emails
CREATE TABLE IF NOT EXISTS email_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  token TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL CHECK (type IN ('verify', 'reset')),
  expires_at TIMESTAMPTZ NOT NULL,
  used_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_email_tokens_token ON email_tokens(token);
CREATE INDEX IF NOT EXISTS idx_email_tokens_email_type ON email_tokens(email, type);

-- Add email_verified flag to user_profiles
ALTER TABLE user_profiles ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false;

-- RLS: tokens table only accessible via service role (API routes)
ALTER TABLE email_tokens ENABLE ROW LEVEL SECURITY;
-- No RLS policies = only service role can access (which is what we want)

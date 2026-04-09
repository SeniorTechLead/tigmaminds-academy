-- Create user_plans table as expected by LessonPlanPage and ProgressContext
-- This stores lesson plan entries and streak data per user

CREATE TABLE IF NOT EXISTS user_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_entries JSONB DEFAULT '[]',
  streak_data JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- RLS: users can only access their own plans
ALTER TABLE user_plans ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage own plans" ON user_plans
  FOR ALL USING (auth.uid() = user_id);

-- Index for fast user lookup
CREATE INDEX IF NOT EXISTS idx_user_plans_user_id ON user_plans (user_id);

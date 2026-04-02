-- Add granular level detail to user_progress
-- This stores quiz scores, mini-lesson progress, code execution tracking per level

-- Add lesson_id column if it doesn't exist
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'lesson_id') THEN
    ALTER TABLE user_progress ADD COLUMN lesson_id INT;
  END IF;
END $$;

-- Add levels detail column (JSONB — stores per-level granular data)
DO $$ BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_progress' AND column_name = 'level_details') THEN
    ALTER TABLE user_progress ADD COLUMN level_details JSONB DEFAULT '{}';
  END IF;
END $$;

-- Create index on lesson_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_user_progress_lesson_id ON user_progress (lesson_id);

-- Drop old unique constraint if it only has lesson_slug, recreate with both
-- (Safe: IF EXISTS prevents errors if constraint doesn't exist)
ALTER TABLE user_progress DROP CONSTRAINT IF EXISTS user_progress_user_id_lesson_slug_key;
ALTER TABLE user_progress ADD CONSTRAINT user_progress_user_id_lesson_slug_key UNIQUE (user_id, lesson_slug);

-- Example level_details structure:
-- {
--   "0": {"viewed": true, "quizScore": 4, "quizTotal": 5, "completedAt": "2026-04-02T..."},
--   "1": {"viewed": true, "miniLessonsSeen": 6, "miniLessonsTotal": 6, "codeRun": true, "completedAt": "..."},
--   "2": {"viewed": true, "miniLessonsSeen": 3, "miniLessonsTotal": 6}
-- }

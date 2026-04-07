-- Drop the foreign key constraint on lesson_id in user_progress.
-- Lesson definitions live in the codebase (lessons.ts), not in a database table.
-- The lesson_id column is kept for reference but should not enforce a FK
-- since new lessons are added in code without corresponding DB rows.

ALTER TABLE public.user_progress
  DROP CONSTRAINT IF EXISTS user_progress_lesson_id_fkey;

-- Also make lesson_id nullable (it may not always be set)
ALTER TABLE public.user_progress
  ALTER COLUMN lesson_id DROP NOT NULL;

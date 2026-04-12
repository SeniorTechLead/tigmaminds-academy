-- Add student_photo_url column to enrollments
-- This stores the Supabase Storage public URL for the student's profile photo
ALTER TABLE enrollments ADD COLUMN IF NOT EXISTS student_photo_url TEXT;

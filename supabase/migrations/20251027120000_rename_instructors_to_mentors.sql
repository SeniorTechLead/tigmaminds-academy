/*
  # Rename Instructors to Mentors

  1. Changes
    - Rename `instructors` table to `mentors`
    - Rename `instructor` column to `mentor` in courses table
    - Rename `instructor_title` column to `mentor_title` in courses table
    - Update RLS policies to reflect new table name

  2. Security
    - Maintain existing RLS policies with updated names
    - Ensure public read access continues to work
*/

ALTER TABLE instructors RENAME TO mentors;

ALTER TABLE courses RENAME COLUMN instructor TO mentor;
ALTER TABLE courses RENAME COLUMN instructor_title TO mentor_title;

DROP POLICY IF EXISTS "Instructors are publicly readable" ON mentors;

CREATE POLICY "Mentors are publicly readable"
  ON mentors FOR SELECT
  TO anon
  USING (true);

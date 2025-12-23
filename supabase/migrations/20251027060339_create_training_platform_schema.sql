/*
  # Training Platform Database Schema

  1. New Tables
    - `courses`
      - `id` (uuid, primary key)
      - `title` (text) - Course name
      - `description` (text) - Course description
      - `instructor` (text) - Instructor name
      - `instructor_title` (text) - Instructor professional title
      - `category` (text) - Course category
      - `level` (text) - Beginner, Intermediate, Advanced
      - `duration` (text) - Course duration
      - `students_enrolled` (integer) - Number of students
      - `rating` (numeric) - Course rating
      - `price` (numeric) - Course price
      - `image_url` (text) - Course image
      - `created_at` (timestamptz)
    
    - `testimonials`
      - `id` (uuid, primary key)
      - `student_name` (text) - Student name
      - `student_title` (text) - Student job title
      - `content` (text) - Testimonial content
      - `rating` (integer) - Rating out of 5
      - `image_url` (text) - Student photo
      - `created_at` (timestamptz)
    
    - `instructors`
      - `id` (uuid, primary key)
      - `name` (text) - Instructor name
      - `title` (text) - Professional title
      - `bio` (text) - Biography
      - `company` (text) - Current company
      - `expertise` (text[]) - Areas of expertise
      - `image_url` (text) - Profile photo
      - `linkedin_url` (text) - LinkedIn profile
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read access (courses are public)
    - These are informational tables, so read-only public access is appropriate
*/

CREATE TABLE IF NOT EXISTS courses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL,
  instructor text NOT NULL,
  instructor_title text NOT NULL,
  category text NOT NULL,
  level text NOT NULL DEFAULT 'Beginner',
  duration text NOT NULL,
  students_enrolled integer DEFAULT 0,
  rating numeric DEFAULT 0,
  price numeric DEFAULT 0,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS testimonials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  student_name text NOT NULL,
  student_title text NOT NULL,
  content text NOT NULL,
  rating integer DEFAULT 5,
  image_url text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS instructors (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  title text NOT NULL,
  bio text NOT NULL,
  company text NOT NULL,
  expertise text[] DEFAULT '{}',
  image_url text,
  linkedin_url text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;
ALTER TABLE instructors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Courses are publicly readable"
  ON courses FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Testimonials are publicly readable"
  ON testimonials FOR SELECT
  TO anon
  USING (true);

CREATE POLICY "Instructors are publicly readable"
  ON instructors FOR SELECT
  TO anon
  USING (true);
/*
  # Student Applications Schema

  1. New Tables
    - `student_applications`
      - `id` (uuid, primary key)
      - `full_name` (text, required)
      - `email` (text, required)
      - `phone` (text)
      - `linkedin_url` (text)
      - `portfolio_url` (text)
      - `github_url` (text)
      - `resume_url` (text)
      - `cover_letter` (text)
      - `education_level` (text)
      - `has_degree` (boolean)
      - `years_experience` (integer)
      - `preferred_course` (text)
      - `availability` (text)
      - `eligibility_responses` (jsonb) - stores checklist answers
      - `application_status` (text, default: 'pending')
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on `student_applications` table
    - Add policy for inserting applications (public can submit)
    - Add policy for authenticated admins to view all applications

  3. Notes
    - Applications are open to public submission
    - Admins will be able to review and manage applications
    - Eligibility responses stored as JSON for flexibility
*/

CREATE TABLE IF NOT EXISTS student_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text,
  linkedin_url text,
  portfolio_url text,
  github_url text,
  resume_url text,
  cover_letter text,
  education_level text,
  has_degree boolean DEFAULT false,
  years_experience integer DEFAULT 0,
  preferred_course text,
  availability text,
  eligibility_responses jsonb DEFAULT '{}',
  application_status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE student_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit applications"
  ON student_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view all applications"
  ON student_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON student_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

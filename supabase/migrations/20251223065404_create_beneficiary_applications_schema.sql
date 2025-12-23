/*
  # Create Beneficiary Applications Schema

  ## Overview
  This migration creates a system for accepting applications on behalf of individuals 
  who may benefit from TigmaMinds Foundation's assistance in Assam.

  ## New Tables
  
  ### `beneficiary_applications`
  Stores applications submitted on behalf of potential beneficiaries
  
  **Columns:**
  - `id` (uuid, primary key) - Unique identifier
  - `applicant_name` (text) - Name of person submitting application
  - `applicant_email` (text) - Email of applicant
  - `applicant_phone` (text) - Phone number of applicant
  - `applicant_relationship` (text) - Relationship to beneficiary
  - `beneficiary_name` (text) - Name of person who needs assistance
  - `beneficiary_age` (integer) - Age of beneficiary
  - `beneficiary_location` (text) - Location/address in Assam
  - `beneficiary_phone` (text, nullable) - Contact number for beneficiary
  - `assistance_type` (text) - Type of assistance needed
  - `situation_description` (text) - Detailed description of situation
  - `financial_status` (text) - Financial situation of beneficiary
  - `urgent` (boolean) - Whether case is urgent
  - `status` (text) - Application status (pending/under_review/approved/rejected)
  - `created_at` (timestamptz) - When application was submitted
  - `updated_at` (timestamptz) - Last update timestamp

  ## Security
  - Enable RLS on beneficiary_applications table
  - Allow anyone to insert applications (public submission)
  - Only authenticated staff can view/update applications
*/

CREATE TABLE IF NOT EXISTS beneficiary_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  applicant_name text NOT NULL,
  applicant_email text NOT NULL,
  applicant_phone text NOT NULL,
  applicant_relationship text NOT NULL,
  beneficiary_name text NOT NULL,
  beneficiary_age integer NOT NULL,
  beneficiary_location text NOT NULL,
  beneficiary_phone text,
  assistance_type text NOT NULL,
  situation_description text NOT NULL,
  financial_status text NOT NULL,
  urgent boolean DEFAULT false,
  status text DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE beneficiary_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit beneficiary applications"
  ON beneficiary_applications
  FOR INSERT
  TO anon
  WITH CHECK (true);

CREATE POLICY "Authenticated users can view applications"
  ON beneficiary_applications
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can update applications"
  ON beneficiary_applications
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

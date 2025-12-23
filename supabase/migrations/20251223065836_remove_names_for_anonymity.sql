/*
  # Remove Name Fields for Complete Anonymity

  ## Overview
  This migration removes name fields from beneficiary applications to ensure 
  complete anonymity for both applicants and beneficiaries.

  ## Changes
  1. Drop name columns from beneficiary_applications table
    - Remove applicant_name column
    - Remove beneficiary_name column
  
  ## Security
  - Maintains existing RLS policies
  - Ensures complete anonymity in applications
*/

DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'beneficiary_applications' AND column_name = 'applicant_name'
  ) THEN
    ALTER TABLE beneficiary_applications DROP COLUMN applicant_name;
  END IF;

  IF EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'beneficiary_applications' AND column_name = 'beneficiary_name'
  ) THEN
    ALTER TABLE beneficiary_applications DROP COLUMN beneficiary_name;
  END IF;
END $$;

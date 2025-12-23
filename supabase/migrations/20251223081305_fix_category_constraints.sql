/*
  # Fix Category Constraints for TigmaMinds Foundation

  1. Changes
    - Drop old environmental category constraints
    - Add correct category constraints for foundation programs: education, child_welfare, old_age
    - This fixes the mismatch between schema and actual foundation mission
*/

-- Fix programs table constraint
ALTER TABLE programs DROP CONSTRAINT IF EXISTS programs_category_check;
ALTER TABLE programs ADD CONSTRAINT programs_category_check CHECK (category IN ('education', 'child_welfare', 'old_age'));

-- Fix impact_stories table constraint
ALTER TABLE impact_stories DROP CONSTRAINT IF EXISTS impact_stories_category_check;
ALTER TABLE impact_stories ADD CONSTRAINT impact_stories_category_check CHECK (category IN ('education', 'child_welfare', 'old_age', 'general'));

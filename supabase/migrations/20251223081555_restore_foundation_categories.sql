/*
  # Restore Foundation Categories

  1. Changes
    - Set category constraints back to foundation mission: education, child_welfare, old_age
*/

ALTER TABLE programs DROP CONSTRAINT IF EXISTS programs_category_check;
ALTER TABLE programs ADD CONSTRAINT programs_category_check CHECK (category IN ('education', 'child_welfare', 'old_age'));

ALTER TABLE impact_stories DROP CONSTRAINT IF EXISTS impact_stories_category_check;
ALTER TABLE impact_stories ADD CONSTRAINT impact_stories_category_check CHECK (category IN ('education', 'child_welfare', 'old_age', 'general'));

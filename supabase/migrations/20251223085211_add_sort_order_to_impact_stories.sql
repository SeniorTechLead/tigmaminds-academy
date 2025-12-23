/*
  # Add sort order to impact stories

  1. Changes
    - Add `sort_order` column to `impact_stories` table
    - Set Kasturika's sort_order to 1 (first position)
    - Set other stories to higher numbers
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'impact_stories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE impact_stories ADD COLUMN sort_order integer DEFAULT 999;
  END IF;
END $$;

UPDATE impact_stories SET sort_order = 1 WHERE name = 'Kasturika';
UPDATE impact_stories SET sort_order = 2 WHERE name = 'Dipankar';
UPDATE impact_stories SET sort_order = 3 WHERE name = 'Ratul';
UPDATE impact_stories SET sort_order = 4 WHERE name = 'Korobi';
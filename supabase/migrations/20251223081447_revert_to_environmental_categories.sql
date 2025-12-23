/*
  # Revert to Environmental Categories

  1. Changes
    - Update category constraints to support environmental programs
    - Categories: renewable_energy, waste_management, water_conservation, sustainable_agriculture, reforestation, climate_education
*/

-- Fix programs table constraint
ALTER TABLE programs DROP CONSTRAINT IF EXISTS programs_category_check;
ALTER TABLE programs ADD CONSTRAINT programs_category_check CHECK (category IN ('renewable_energy', 'waste_management', 'water_conservation', 'sustainable_agriculture', 'reforestation', 'climate_education'));

-- Fix impact_stories table constraint
ALTER TABLE impact_stories DROP CONSTRAINT IF EXISTS impact_stories_category_check;
ALTER TABLE impact_stories ADD CONSTRAINT impact_stories_category_check CHECK (category IN ('renewable_energy', 'waste_management', 'water_conservation', 'sustainable_agriculture', 'reforestation', 'climate_education', 'general'));

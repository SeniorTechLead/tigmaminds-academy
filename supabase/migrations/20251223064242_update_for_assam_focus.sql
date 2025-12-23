/*
  # Update TigmaMinds Foundation Data for Assam Focus

  1. Updates
    - Clear existing programs and impact stories
    - Add new programs with realistic numbers for starting foundation
    - Add anonymized impact stories focused on Assam
    - Remove inflated metrics

  2. Changes
    - All locations changed to Assam
    - Beneficiary counts reduced to realistic numbers
    - Stories anonymized for privacy
*/

-- Clear existing data
DELETE FROM impact_stories;
DELETE FROM programs;

-- Insert realistic programs for starting foundation
INSERT INTO programs (title, category, description, image_url, beneficiaries_count, active) VALUES
  ('Digital Learning Initiative', 'education', 'Introducing computer literacy and digital skills to students in rural Assam, helping bridge the digital divide and prepare youth for modern opportunities.', 'https://images.pexels.com/photos/8190804/pexels-photo-8190804.jpeg', 25, true),
  ('Child Nutrition Program', 'child_welfare', 'Providing nutritious meals and nutrition education to underprivileged children in Guwahati and surrounding areas, ensuring no child goes hungry.', 'https://images.pexels.com/photos/6646917/pexels-photo-6646917.jpeg', 40, true),
  ('Senior Support Services', 'old_age', 'Offering companionship, health checkups, and essential support to elderly citizens in Assam who need care and dignity in their golden years.', 'https://images.pexels.com/photos/7551652/pexels-photo-7551652.jpeg', 15, true),
  ('Education Support Fund', 'education', 'Providing school supplies, books, and learning materials to children from economically disadvantaged families in Assam.', 'https://images.pexels.com/photos/8422149/pexels-photo-8422149.jpeg', 30, true),
  ('Community Health Awareness', 'old_age', 'Health education and basic medical support for senior citizens in rural and urban areas of Assam.', 'https://images.pexels.com/photos/7551585/pexels-photo-7551585.jpeg', 20, true);

-- Insert anonymized impact stories focused on Assam
INSERT INTO impact_stories (name, role, category, story, location, featured) VALUES
  ('Ananya D.', 'Student', 'education', 'The digital learning program opened new doors for me. I learned computer skills that helped me secure an internship. Education truly changes lives when given the right opportunities.', 'Guwahati, Assam', true),
  ('Ramesh K.', 'Community Volunteer', 'child_welfare', 'Seeing children receive nutritious meals and proper care has been incredibly rewarding. Small acts of kindness create big changes in young lives.', 'Kamrup, Assam', true),
  ('Lakshmi S.', 'Program Beneficiary', 'old_age', 'The care and companionship I receive through this program has brought joy to my days. It feels good to know someone cares about our wellbeing.', 'Beltola, Assam', false),
  ('Priya M.', 'Parent', 'child_welfare', 'My children now have proper school supplies and nutritious food. This support has made it possible for them to focus on their studies and dream bigger.', 'Guwahati, Assam', false);
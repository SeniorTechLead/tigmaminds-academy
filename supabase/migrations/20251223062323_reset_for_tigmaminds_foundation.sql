/*
  # Reset Database for TigmaMinds Foundation

  1. Cleanup
    - Drop all existing tables from previous project
  
  2. New Tables for TigmaMinds Foundation
    - `programs` - Foundation programs and initiatives
    - `impact_stories` - Success stories and testimonials
    - `volunteer_applications` - Volunteer sign-ups
    - `contact_submissions` - Contact form submissions
    - `donations` - Track donation information (future use)

  3. Security
    - Enable RLS on all tables
    - Public can view programs and stories
    - Anyone can submit applications and contact forms
*/

-- Drop old tables
DROP TABLE IF EXISTS blog_posts CASCADE;
DROP TABLE IF EXISTS faqs CASCADE;
DROP TABLE IF EXISTS faq_categories CASCADE;
DROP TABLE IF EXISTS student_applications CASCADE;
DROP TABLE IF EXISTS mentors CASCADE;
DROP TABLE IF EXISTS testimonials CASCADE;
DROP TABLE IF EXISTS courses CASCADE;

-- Programs table
CREATE TABLE IF NOT EXISTS programs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  category text NOT NULL CHECK (category IN ('education', 'child_welfare', 'old_age')),
  description text NOT NULL,
  image_url text DEFAULT '',
  beneficiaries_count integer DEFAULT 0,
  active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE programs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view active programs"
  ON programs FOR SELECT
  USING (active = true);

-- Impact stories (testimonials) table
CREATE TABLE IF NOT EXISTS impact_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  role text NOT NULL,
  category text CHECK (category IN ('education', 'child_welfare', 'old_age', 'general')),
  story text NOT NULL,
  image_url text DEFAULT '',
  featured boolean DEFAULT false,
  location text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

ALTER TABLE impact_stories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view impact stories"
  ON impact_stories FOR SELECT
  USING (true);

-- Volunteer applications table
CREATE TABLE IF NOT EXISTS volunteer_applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  interest_area text NOT NULL,
  availability text NOT NULL,
  message text DEFAULT '',
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE volunteer_applications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit volunteer applications"
  ON volunteer_applications FOR INSERT
  WITH CHECK (true);

-- Contact submissions table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  email text NOT NULL,
  phone text DEFAULT '',
  subject text NOT NULL,
  message text NOT NULL,
  status text DEFAULT 'new' CHECK (status IN ('new', 'in_progress', 'resolved')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can submit contact forms"
  ON contact_submissions FOR INSERT
  WITH CHECK (true);

-- Insert sample programs
INSERT INTO programs (title, category, description, image_url, beneficiaries_count, active) VALUES
  ('Digital Literacy Program', 'education', 'Empowering rural children and adults with computer skills and digital knowledge to bridge the digital divide in India. We provide free computer training, internet access, and ongoing support.', 'https://images.pexels.com/photos/5905700/pexels-photo-5905700.jpeg', 1250, true),
  ('Child Education Initiative', 'child_welfare', 'Providing free quality education, school supplies, and nutritious meals to underprivileged children across rural India. Every child deserves access to learning opportunities.', 'https://images.pexels.com/photos/8422087/pexels-photo-8422087.jpeg', 3400, true),
  ('Senior Care Program', 'old_age', 'Supporting elderly citizens with healthcare, companionship, and essential services to ensure dignity in their golden years. We believe every senior deserves respect and care.', 'https://images.pexels.com/photos/7551662/pexels-photo-7551662.jpeg', 850, true),
  ('Scholarship Fund', 'education', 'Merit-based scholarships for talented students from economically disadvantaged backgrounds to pursue higher education and achieve their dreams.', 'https://images.pexels.com/photos/5212317/pexels-photo-5212317.jpeg', 450, true),
  ('Nutrition Program', 'child_welfare', 'Ensuring no child goes to bed hungry. We provide nutritious meals and nutrition education to combat malnutrition in underserved communities.', 'https://images.pexels.com/photos/6646918/pexels-photo-6646918.jpeg', 2100, true),
  ('Elderly Healthcare', 'old_age', 'Free health checkups, medicines, and medical support for senior citizens who cannot afford healthcare services. Health is a right, not a privilege.', 'https://images.pexels.com/photos/7551617/pexels-photo-7551617.jpeg', 680, true);

-- Insert sample impact stories
INSERT INTO impact_stories (name, role, category, story, location, featured) VALUES
  ('Priya Sharma', 'Program Beneficiary', 'education', 'TigmaMinds Foundation changed my life forever. Through their digital literacy program, I learned computer skills and now work as a data entry operator, supporting my family. Education truly transforms lives.', 'Delhi, India', true),
  ('Rajesh Kumar', 'Volunteer', 'child_welfare', 'Volunteering with TigmaMinds has been the most rewarding experience of my life. Seeing the smiles on children''s faces when they receive education and care is priceless. I am proud to be part of this mission.', 'Mumbai, India', true),
  ('Lakshmi Devi', 'Senior Citizen', 'old_age', 'The senior care program has given me hope and companionship in my twilight years. The regular health checkups and social activities have improved my quality of life tremendously. I feel valued and cared for.', 'Chennai, India', true),
  ('Amit Patel', 'Scholarship Recipient', 'education', 'I come from a poor farming family and never thought I could attend college. TigmaMinds scholarship made my engineering degree possible. Today I work at a tech company and support my younger siblings'' education.', 'Gujarat, India', false),
  ('Meena Singh', 'Parent', 'child_welfare', 'My children were malnourished and struggling in school. The nutrition program not only provided healthy meals but also taught us about proper nutrition. My kids are now healthy, active, and excelling in their studies.', 'Uttar Pradesh, India', false);
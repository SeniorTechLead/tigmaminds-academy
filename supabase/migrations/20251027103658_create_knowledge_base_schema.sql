/*
  # Knowledge Base and FAQ Schema

  1. New Tables
    - `faq_categories`
      - `id` (uuid, primary key)
      - `name` (text, required)
      - `description` (text)
      - `display_order` (integer, default: 0)
      - `created_at` (timestamptz)
      
    - `faqs`
      - `id` (uuid, primary key)
      - `category_id` (uuid, foreign key to faq_categories)
      - `question` (text, required)
      - `answer` (text, required)
      - `tags` (text array)
      - `display_order` (integer, default: 0)
      - `view_count` (integer, default: 0)
      - `is_featured` (boolean, default: false)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Public can view FAQs and categories
    - Authenticated users can manage FAQs

  3. Indexes
    - Index on tags for search performance
    - Index on category_id for filtering

  4. Sample Data
    - Insert default FAQ categories
    - Insert sample FAQs for training-related questions
*/

CREATE TABLE IF NOT EXISTS faq_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS faqs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES faq_categories(id) ON DELETE CASCADE,
  question text NOT NULL,
  answer text NOT NULL,
  tags text[] DEFAULT '{}',
  display_order integer DEFAULT 0,
  view_count integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_faqs_category_id ON faqs(category_id);
CREATE INDEX IF NOT EXISTS idx_faqs_tags ON faqs USING gin(tags);

ALTER TABLE faq_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view FAQ categories"
  ON faq_categories
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Anyone can view FAQs"
  ON faqs
  FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert FAQ categories"
  ON faq_categories
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQ categories"
  ON faq_categories
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can insert FAQs"
  ON faqs
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update FAQs"
  ON faqs
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

INSERT INTO faq_categories (name, description, display_order) VALUES
  ('Getting Started', 'Learn about enrollment, prerequisites, and starting your journey', 1),
  ('Courses & Programs', 'Information about course structure, duration, and curriculum', 2),
  ('Payment & Pricing', 'Details about tuition, payment plans, and financial aid', 3),
  ('Technical Requirements', 'System requirements and technical setup', 4),
  ('Career Support', 'Job placement, career guidance, and mentorship', 5),
  ('Certificates & Credentials', 'Information about certifications and course completion', 6)
ON CONFLICT DO NOTHING;

DO $$
DECLARE
  getting_started_id uuid;
  courses_id uuid;
  payment_id uuid;
  technical_id uuid;
  career_id uuid;
  certificates_id uuid;
BEGIN
  SELECT id INTO getting_started_id FROM faq_categories WHERE name = 'Getting Started' LIMIT 1;
  SELECT id INTO courses_id FROM faq_categories WHERE name = 'Courses & Programs' LIMIT 1;
  SELECT id INTO payment_id FROM faq_categories WHERE name = 'Payment & Pricing' LIMIT 1;
  SELECT id INTO technical_id FROM faq_categories WHERE name = 'Technical Requirements' LIMIT 1;
  SELECT id INTO career_id FROM faq_categories WHERE name = 'Career Support' LIMIT 1;
  SELECT id INTO certificates_id FROM faq_categories WHERE name = 'Certificates & Credentials' LIMIT 1;

  INSERT INTO faqs (category_id, question, answer, tags, display_order, is_featured) VALUES
    (getting_started_id, 'Do I need a college degree to enroll?', 'No, you do not need a college degree to enroll at TigmaMinds Academy. We welcome learners from all educational backgrounds. What matters most is your passion, commitment, and willingness to learn. Many successful tech professionals are self-taught or have non-traditional educational backgrounds.', ARRAY['enrollment', 'requirements', 'education'], 1, true),
    (getting_started_id, 'How do I apply to TigmaMinds Academy?', 'You can apply by clicking the "Apply Now" button in the navigation menu or visiting our Students page. Fill out the application form with your details, confirm the eligibility requirements, and submit. Our admissions team will review your application and contact you within 5-7 business days.', ARRAY['application', 'enrollment', 'getting started'], 2, true),
    (getting_started_id, 'What are the eligibility requirements?', 'To be eligible, you need: access to a computer/laptop, reliable internet connection, ability to commit at least 10 hours per week to learning, motivation to build a career in technology, and basic English communication skills.', ARRAY['requirements', 'eligibility'], 3, true),
    (getting_started_id, 'How long does the application process take?', 'The application process typically takes 5-7 business days. After submitting your application, our admissions team will review it and contact you via email with next steps. In some cases, we may schedule a brief interview to learn more about your goals.', ARRAY['application', 'timeline'], 4, false),
    
    (courses_id, 'What courses do you offer?', 'We offer comprehensive training programs in Web Development, Data Science, Cloud Computing, UX/UI Design, Blockchain Development, and Mobile Development. Each program is designed by industry experts and includes hands-on projects, mentorship, and real-world applications.', ARRAY['courses', 'programs', 'curriculum'], 1, true),
    (courses_id, 'How long are the training programs?', 'Program duration varies by course. Most programs range from 12 to 24 weeks for full-time study, or 24 to 48 weeks for part-time study. Each program is self-paced within the enrollment period, allowing you to learn at a speed that works for you.', ARRAY['duration', 'timeline', 'courses'], 2, true),
    (courses_id, 'Can I switch courses after enrolling?', 'Yes, you can switch courses within the first two weeks of enrollment at no additional cost. After that period, course changes may be subject to availability and additional fees. We recommend carefully reviewing course descriptions before enrolling.', ARRAY['courses', 'enrollment', 'flexibility'], 3, false),
    (courses_id, 'Are courses live or pre-recorded?', 'Our courses include both live sessions and pre-recorded content. Live sessions with mentors occur 2-3 times per week, while pre-recorded lectures are available 24/7. This hybrid approach provides flexibility while ensuring you get personalized guidance.', ARRAY['courses', 'format', 'learning'], 4, false),
    
    (payment_id, 'How much do the programs cost?', 'Program costs vary by course and payment plan. Full programs typically range from $3,000 to $8,000. We offer flexible payment plans, income share agreements, and scholarship opportunities. Contact our admissions team for specific pricing details.', ARRAY['pricing', 'cost', 'tuition'], 1, true),
    (payment_id, 'Do you offer payment plans?', 'Yes, we offer flexible payment plans that allow you to pay in monthly installments. We also offer income share agreements where you pay nothing until you land a job earning above a certain threshold. Scholarships and financial aid are available for qualifying students.', ARRAY['payment', 'financing', 'financial aid'], 2, true),
    (payment_id, 'Is there a refund policy?', 'Yes, we offer a 14-day money-back guarantee. If you are not satisfied with the program within the first 14 days, you can request a full refund. After this period, refunds are evaluated on a case-by-case basis.', ARRAY['refund', 'policy', 'payment'], 3, false),
    
    (technical_id, 'What computer specifications do I need?', 'You need a computer with at least 8GB RAM, a modern processor (Intel i5 or equivalent), and 100GB of free storage. Both Windows, Mac, and Linux operating systems are supported. A stable internet connection with at least 5 Mbps download speed is required.', ARRAY['requirements', 'computer', 'technical'], 1, true),
    (technical_id, 'Do you provide software licenses?', 'Yes, we provide access to all necessary software and tools for the duration of your program. This includes development environments, design tools, cloud platforms, and educational licenses for premium software.', ARRAY['software', 'tools', 'technical'], 2, false),
    (technical_id, 'Can I use a tablet or Chromebook?', 'While you can access course materials on tablets and Chromebooks, we strongly recommend using a laptop or desktop computer for hands-on coding and development work. Most professional development tools require a full computer operating system.', ARRAY['devices', 'technical', 'requirements'], 3, false),
    
    (career_id, 'Do you offer job placement assistance?', 'Yes, we provide comprehensive career support including resume reviews, interview preparation, portfolio building, and job placement assistance. We have partnerships with numerous tech companies and maintain a job board exclusively for our students.', ARRAY['career', 'jobs', 'placement'], 1, true),
    (career_id, 'What is the job placement rate?', 'Our overall job placement rate is 85% within 6 months of graduation. Placement rates vary by program and geographic location. We track outcomes for all graduates and provide ongoing career support even after program completion.', ARRAY['career', 'placement', 'statistics'], 2, true),
    (career_id, 'Can I access mentors after graduation?', 'Yes, graduates maintain access to our mentor network for 12 months after program completion. You can schedule sessions for career advice, technical questions, and continued learning support. Alumni also have access to our community forums indefinitely.', ARRAY['mentorship', 'support', 'alumni'], 3, false),
    
    (certificates_id, 'Will I receive a certificate upon completion?', 'Yes, upon successfully completing your program and all required projects, you will receive a verified digital certificate. This certificate can be shared on LinkedIn, added to your resume, and verified by employers.', ARRAY['certificate', 'completion', 'credentials'], 1, true),
    (certificates_id, 'Are the certificates recognized by employers?', 'Our certificates are recognized by hundreds of tech companies and startups. Many of our hiring partners specifically seek out TigmaMinds graduates. The certificate demonstrates practical skills and project experience valued by employers.', ARRAY['certificate', 'recognition', 'employment'], 2, true),
    (certificates_id, 'Can I showcase my projects?', 'Absolutely! All students build a portfolio of projects throughout their program. We help you showcase these on GitHub, personal websites, and professional portfolios. Many students land interviews based on their project portfolios alone.', ARRAY['portfolio', 'projects', 'showcase'], 3, false)
  ON CONFLICT DO NOTHING;
END $$;

/*
  # Add Adult Education Programs

  1. Changes
    - Add new adult education programs to the programs table
    - Programs focus on basic reading, writing, and mathematics for adults
    - Includes functional literacy and numeracy skills for daily life

  2. New Programs
    - Adult Literacy Program - Basic reading and writing for adults
    - Adult Numeracy Program - Basic mathematics and financial literacy
    - Functional Literacy Initiative - Practical life skills education
*/

-- Insert adult education programs
INSERT INTO programs (title, category, description, image_url, beneficiaries_count, active) VALUES
  ('Adult Literacy Program', 'education', 'Teaching basic reading and writing skills to adults who never had the opportunity to learn. Our program helps adults gain confidence, read important documents, and communicate effectively in their daily lives.', 'https://images.pexels.com/photos/8197530/pexels-photo-8197530.jpeg', 580, true),
  ('Adult Numeracy Program', 'education', 'Basic mathematics and financial literacy for adults. Learn essential math skills for daily life including budgeting, measuring, calculating expenses, and understanding numbers for better financial decisions.', 'https://images.pexels.com/photos/8500706/pexels-photo-8500706.jpeg', 420, true),
  ('Functional Literacy Initiative', 'education', 'Comprehensive program combining reading, writing, and basic math skills tailored for adults. Focused on practical applications like filling forms, reading labels, managing household finances, and workplace communication.', 'https://images.pexels.com/photos/5905492/pexels-photo-5905492.jpeg', 350, true)
ON CONFLICT DO NOTHING;
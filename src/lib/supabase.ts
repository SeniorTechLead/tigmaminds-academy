import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Course {
  id: string;
  title: string;
  description: string;
  mentor: string;
  mentor_title: string;
  category: string;
  level: string;
  duration: string;
  students_enrolled: number;
  rating: number;
  price: number;
  image_url: string | null;
  created_at: string;
}

export interface Testimonial {
  id: string;
  student_name: string;
  student_title: string;
  content: string;
  rating: number;
  image_url: string | null;
  created_at: string;
}

export interface Mentor {
  id: string;
  name: string;
  title: string;
  bio: string;
  company: string;
  expertise: string[];
  image_url: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  bio: string;
  company: string;
  expertise: string[];
  image_url: string | null;
  linkedin_url: string | null;
  created_at: string;
}

export interface StudentApplication {
  id: string;
  full_name: string;
  email: string;
  phone?: string;
  linkedin_url?: string;
  portfolio_url?: string;
  github_url?: string;
  resume_url?: string;
  cover_letter?: string;
  education_level?: string;
  has_degree: boolean;
  years_experience: number;
  preferred_course?: string;
  availability?: string;
  eligibility_responses: Record<string, boolean | string>;
  application_status: string;
  created_at: string;
  updated_at: string;
}

export interface FaqCategory {
  id: string;
  name: string;
  description: string | null;
  display_order: number;
  created_at: string;
}

export interface Faq {
  id: string;
  category_id: string;
  question: string;
  answer: string;
  tags: string[];
  display_order: number;
  view_count: number;
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  author_name: string;
  author_title: string | null;
  author_image_url: string | null;
  featured_image_url: string | null;
  category: string | null;
  tags: string[];
  read_time_minutes: number;
  view_count: number;
  is_published: boolean;
  published_at: string;
  created_at: string;
  updated_at: string;
  seo_title: string | null;
  seo_description: string | null;
  seo_keywords: string[];
}

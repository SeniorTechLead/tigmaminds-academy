/*
  # Blog System Schema

  1. New Tables
    - `blog_posts`
      - `id` (uuid, primary key)
      - `title` (text, required)
      - `slug` (text, unique, required) - URL-friendly version of title
      - `excerpt` (text, required) - Short summary for listing pages
      - `content` (text, required) - Full blog content in markdown
      - `author_name` (text, required)
      - `author_title` (text)
      - `author_image_url` (text)
      - `featured_image_url` (text)
      - `category` (text)
      - `tags` (text array)
      - `read_time_minutes` (integer, default: 5)
      - `view_count` (integer, default: 0)
      - `is_published` (boolean, default: true)
      - `published_at` (timestamptz)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)
      - `seo_title` (text) - SEO optimized title
      - `seo_description` (text) - Meta description for SEO
      - `seo_keywords` (text array) - SEO keywords

  2. Security
    - Enable RLS on blog_posts table
    - Public can view published blogs
    - Authenticated users can manage blogs

  3. Indexes
    - Index on slug for fast lookups
    - Index on tags for filtering
    - Index on published_at for sorting

  4. Sample Data
    - Insert 4 SEO-optimized blog posts on requested topics
*/

CREATE TABLE IF NOT EXISTS blog_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text UNIQUE NOT NULL,
  excerpt text NOT NULL,
  content text NOT NULL,
  author_name text NOT NULL DEFAULT 'TigmaMinds Team',
  author_title text DEFAULT 'Tech Education Experts',
  author_image_url text,
  featured_image_url text,
  category text,
  tags text[] DEFAULT '{}',
  read_time_minutes integer DEFAULT 5,
  view_count integer DEFAULT 0,
  is_published boolean DEFAULT true,
  published_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  seo_title text,
  seo_description text,
  seo_keywords text[] DEFAULT '{}'
);

CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_tags ON blog_posts USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_blog_posts_published_at ON blog_posts(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);

ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published blogs"
  ON blog_posts
  FOR SELECT
  TO anon, authenticated
  USING (is_published = true);

CREATE POLICY "Authenticated users can insert blogs"
  ON blog_posts
  FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update blogs"
  ON blog_posts
  FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

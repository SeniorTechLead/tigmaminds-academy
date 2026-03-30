-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- User profiles (extends Supabase auth.users)
create table if not exists public.user_profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  display_name text,
  avatar_url text,
  role text default 'student',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Lessons (source of truth for all story-lessons)
create table if not exists public.lessons (
  id integer primary key,
  slug text unique not null,
  title text not null,
  tagline text,
  stem_title text,
  stem_description text,
  subjects text[] default '{}',
  tracks text[] default '{}',
  estimated_hours integer default 12,
  is_demo boolean default false,
  is_published boolean default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table public.lessons enable row level security;
create policy "Public read lessons" on public.lessons for select using (true);

-- Progress tracking
create table if not exists public.user_progress (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  lesson_id integer references public.lessons(id) not null,
  lesson_slug text not null,
  levels_completed text[] default '{}',
  completed_at timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, lesson_id)
);

-- Contact form submissions
create table if not exists public.contact_submissions (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  created_at timestamptz default now()
);

-- Student applications
create table if not exists public.student_applications (
  id uuid default uuid_generate_v4() primary key,
  full_name text not null,
  email text not null,
  phone text,
  linkedin_url text,
  portfolio_url text,
  github_url text,
  resume_url text,
  cover_letter text,
  education_level text,
  has_degree boolean default false,
  years_experience integer default 0,
  preferred_course text,
  availability text,
  eligibility_responses jsonb default '{}',
  application_status text default 'pending',
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Mentors
create table if not exists public.mentors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text,
  bio text,
  company text,
  expertise text[] default '{}',
  image_url text,
  linkedin_url text,
  created_at timestamptz default now()
);

-- Instructors
create table if not exists public.instructors (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  title text,
  bio text,
  company text,
  expertise text[] default '{}',
  image_url text,
  linkedin_url text,
  created_at timestamptz default now()
);

-- Courses
create table if not exists public.courses (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  description text,
  mentor text,
  mentor_title text,
  category text,
  level text,
  duration text,
  students_enrolled integer default 0,
  rating numeric(2,1) default 0,
  price numeric(10,2) default 0,
  image_url text,
  created_at timestamptz default now()
);

-- Row Level Security policies
alter table public.user_profiles enable row level security;
alter table public.user_progress enable row level security;
alter table public.contact_submissions enable row level security;
alter table public.student_applications enable row level security;
alter table public.mentors enable row level security;
alter table public.instructors enable row level security;
alter table public.courses enable row level security;

-- Users can read/write their own profile
create policy "Users can view own profile" on public.user_profiles for select using (auth.uid() = id);
create policy "Users can update own profile" on public.user_profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on public.user_profiles for insert with check (auth.uid() = id);

-- Users can read/write their own progress
create policy "Users can view own progress" on public.user_progress for select using (auth.uid() = user_id);
create policy "Users can insert own progress" on public.user_progress for insert with check (auth.uid() = user_id);
create policy "Users can update own progress" on public.user_progress for update using (auth.uid() = user_id);
create policy "Users can delete own progress" on public.user_progress for delete using (auth.uid() = user_id);

-- Anyone can submit contact forms
create policy "Anyone can submit contact" on public.contact_submissions for insert with check (true);

-- Anyone can submit applications
create policy "Anyone can apply" on public.student_applications for insert with check (true);

-- Everyone can read mentors, instructors, courses (public data)
create policy "Public read mentors" on public.mentors for select using (true);
create policy "Public read instructors" on public.instructors for select using (true);
create policy "Public read courses" on public.courses for select using (true);

-- Lesson plans
create table if not exists public.user_plans (
  user_id uuid references auth.users(id) on delete cascade primary key,
  lesson_entries jsonb default '[]',
  updated_at timestamptz default now()
);

alter table public.user_plans enable row level security;
create policy "Users manage own plan" on public.user_plans
  for all using (auth.uid() = user_id);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.user_profiles (id, display_name)
  values (new.id, new.raw_user_meta_data->>'display_name');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger: create profile when user signs up
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

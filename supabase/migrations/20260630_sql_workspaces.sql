-- Per-user SQL IDE workspace persistence.
-- Stores the sql.js (SQLite) database export so a signed-in user's created tables
-- and data follow them across devices/sessions. The blob is the base64 of the
-- binary export; the app caps it (~2MB) before writing.

create table if not exists public.sql_workspaces (
  user_id    uuid primary key references auth.users(id) on delete cascade,
  db_blob    text not null,                 -- base64 of sql.js export
  byte_size  integer not null default 0,    -- size of the raw blob, for monitoring
  updated_at timestamptz not null default now()
);

alter table public.sql_workspaces enable row level security;

-- A user can only read/write their own workspace.
drop policy if exists "own sql workspace" on public.sql_workspaces;
create policy "own sql workspace" on public.sql_workspaces
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

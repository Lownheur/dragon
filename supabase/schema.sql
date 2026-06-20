-- Dragon Life OS — Schema Supabase
-- Exécute ce fichier dans le SQL Editor de Supabase

-- =============================================
-- PROFILS (extension de auth.users)
-- =============================================
create table if not exists public.profils (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  nom         text not null default '',
  prenom      text not null default '',
  age         integer,
  date_aniv   text, -- YYYY-MM-DD
  adresse     text not null default '',
  taf         text not null default '', -- travail / métier
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  unique(user_id)
);

alter table public.profils enable row level security;

create policy "Users can view own profil"
  on public.profils for select using (auth.uid() = user_id);

create policy "Users can insert own profil"
  on public.profils for insert with check (auth.uid() = user_id);

create policy "Users can update own profil"
  on public.profils for update using (auth.uid() = user_id);

-- =============================================
-- DISCIPLINES
-- =============================================
create table if not exists public.disciplines (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references auth.users(id) on delete cascade,
  name        text not null,
  type        text not null,
  icon        text not null default '🎯',
  color       text not null default '#3498db',
  xp          integer not null default 0,
  level       integer not null default 1,
  created_at  timestamptz not null default now()
);

alter table public.disciplines enable row level security;

create policy "Users manage own disciplines"
  on public.disciplines for all using (auth.uid() = user_id);

-- =============================================
-- EVENEMENTS (EDT)
-- =============================================
create table if not exists public.evenements (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  type          text not null default 'other',
  start_time    timestamptz not null,
  end_time      timestamptz not null,
  all_day       boolean not null default false,
  discipline_id uuid references public.disciplines(id) on delete set null,
  objectif_id   uuid,
  location      text,
  reminder      integer, -- minutes before
  color         text not null default '#3498db',
  created_at    timestamptz not null default now()
);

alter table public.evenements enable row level security;

create policy "Users manage own evenements"
  on public.evenements for all using (auth.uid() = user_id);

-- =============================================
-- INDICATEURS (Journal du Jour)
-- =============================================
create table if not exists public.indicateurs (
  id              uuid primary key default gen_random_uuid(),
  user_id         uuid not null references auth.users(id) on delete cascade,
  date            text not null, -- YYYY-MM-DD
  mood            integer not null default 5,
  energy          integer not null default 5,
  stress          integer not null default 5,
  sleep_quality   integer not null default 5,
  sleep_hours     numeric(3,1) not null default 7,
  water_intake    numeric(4,2) not null default 2,
  exercise_minutes integer not null default 0,
  screen_time     integer not null default 0,
  notes           text not null default '',
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),
  unique(user_id, date)
);

alter table public.indicateurs enable row level security;

create policy "Users manage own indicateurs"
  on public.indicateurs for all using (auth.uid() = user_id);

-- =============================================
-- OBJECTIFS
-- =============================================
create table if not exists public.objectifs (
  id            uuid primary key default gen_random_uuid(),
  user_id       uuid not null references auth.users(id) on delete cascade,
  title         text not null,
  description   text not null default '',
  status        text not null default 'pending',
  priority      text not null default 'medium',
  progress      integer not null default 0, -- 0-100
  deadline      timestamptz,
  xp_reward     integer not null default 100,
  tags          text[] not null default '{}',
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  completed_at  timestamptz
);

alter table public.objectifs enable row level security;

create policy "Users manage own objectifs"
  on public.objectifs for all using (auth.uid() = user_id);

-- =============================================
-- PERSONNAGES (stats RPG)
-- =============================================
create table if not exists public.personnages (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid not null references auth.users(id) on delete cascade,
  name                text not null default 'Dragon',
  level               integer not null default 1,
  xp                  integer not null default 0,
  xp_to_next_level    integer not null default 100,
  total_xp_earned     integer not null default 0,
  discipline_xp       jsonb not null default '{}',
  streak_days         integer not null default 0,
  longest_streak      integer not null default 0,
  last_active_date    text,
  created_at          timestamptz not null default now(),
  updated_at          timestamptz not null default now(),
  unique(user_id)
);

alter table public.personnages enable row level security;

create policy "Users manage own personnage"
  on public.personnages for all using (auth.uid() = user_id);

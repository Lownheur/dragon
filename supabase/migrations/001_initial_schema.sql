-- Dragon Life OS - Initial Schema
-- Run this in Supabase SQL Editor

-- Personnages (character sheet)
CREATE TABLE IF NOT EXISTS personnages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT DEFAULT 'Dragon',
  level INTEGER DEFAULT 1,
  xp INTEGER DEFAULT 0,
  xp_to_next_level INTEGER DEFAULT 100,
  total_xp_earned INTEGER DEFAULT 0,
  discipline_xp JSONB DEFAULT '{}',
  streak_days INTEGER DEFAULT 0,
  longest_streak INTEGER DEFAULT 0,
  last_active_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Disciplines
CREATE TABLE IF NOT EXISTS disciplines (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  icon TEXT NOT NULL,
  color TEXT NOT NULL,
  xp INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Objectifs
CREATE TABLE IF NOT EXISTS objectifs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  status TEXT DEFAULT 'pending',
  priority TEXT DEFAULT 'medium',
  progress INTEGER DEFAULT 0,
  deadline TIMESTAMPTZ,
  xp_reward INTEGER DEFAULT 100,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  completed_at TIMESTAMPTZ
);

-- Evenements (calendar)
CREATE TABLE IF NOT EXISTS evenements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT DEFAULT '',
  type TEXT DEFAULT 'other',
  start_time TIMESTAMPTZ NOT NULL,
  end_time TIMESTAMPTZ NOT NULL,
  all_day BOOLEAN DEFAULT FALSE,
  discipline_id UUID REFERENCES disciplines(id) ON DELETE SET NULL,
  objectif_id UUID REFERENCES objectifs(id) ON DELETE SET NULL,
  location TEXT,
  reminder INTEGER,
  color TEXT DEFAULT '#3498db',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indicateurs (daily journal)
CREATE TABLE IF NOT EXISTS indicateurs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  mood INTEGER DEFAULT 5,
  energy INTEGER DEFAULT 5,
  stress INTEGER DEFAULT 5,
  sleep_quality INTEGER DEFAULT 5,
  sleep_hours NUMERIC(4,1) DEFAULT 7,
  water_intake NUMERIC(4,2) DEFAULT 2,
  exercise_minutes INTEGER DEFAULT 0,
  screen_time INTEGER DEFAULT 0,
  notes TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Row Level Security
ALTER TABLE personnages ENABLE ROW LEVEL SECURITY;
ALTER TABLE disciplines ENABLE ROW LEVEL SECURITY;
ALTER TABLE objectifs ENABLE ROW LEVEL SECURITY;
ALTER TABLE evenements ENABLE ROW LEVEL SECURITY;
ALTER TABLE indicateurs ENABLE ROW LEVEL SECURITY;

-- RLS Policies (user can only access their own data)
CREATE POLICY "Users can manage own personnage" ON personnages FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own disciplines" ON disciplines FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own objectifs" ON objectifs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own evenements" ON evenements FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own indicateurs" ON indicateurs FOR ALL USING (auth.uid() = user_id);

-- ============================================================================
-- EcoSense - Supabase PostgreSQL Schema & Realtime Setup
-- Copy and run this in your Supabase SQL Editor: (https://supabase.com/dashboard)
-- ============================================================================

-- 1. Create Incidents Table
CREATE TABLE IF NOT EXISTS public.incidents (
  id TEXT PRIMARY KEY,
  zone TEXT,
  "zoneTitle" TEXT,
  ward TEXT,
  location TEXT,
  society TEXT,
  lat FLOAT8,
  lng FLOAT8,
  "reportedBy" TEXT,
  "reportedAt" TEXT,
  timestamp BIGINT,
  status TEXT DEFAULT 'pending',
  "slaHours" INT,
  "slaDeadline" BIGINT,
  image TEXT,
  "resolvedImage" TEXT,
  description TEXT,
  "aiAnalysis" JSONB,
  "assignedCrew" JSONB,
  "fraudAlert" JSONB,
  dispute JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Create Users & EcoPoints Table
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT,
  role TEXT,
  ward TEXT,
  eco_points INT DEFAULT 0,
  reports_count INT DEFAULT 0,
  last_active TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security (RLS) & Allow Public Read/Write for EcoSense
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read on incidents" ON public.incidents FOR SELECT USING (true);
CREATE POLICY "Allow public insert on incidents" ON public.incidents FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on incidents" ON public.incidents FOR UPDATE USING (true);

CREATE POLICY "Allow public read on users" ON public.users FOR SELECT USING (true);
CREATE POLICY "Allow public insert on users" ON public.users FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update on users" ON public.users FOR UPDATE USING (true);

-- 4. Enable Realtime Publications (Enables instant multi-device live sync)
ALTER PUBLICATION supabase_realtime ADD TABLE public.incidents;
ALTER PUBLICATION supabase_realtime ADD TABLE public.users;

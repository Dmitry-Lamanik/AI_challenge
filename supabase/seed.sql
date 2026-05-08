-- Schema bootstrap for Supabase Postgres (public schema): tables, indexes, RLS policies only.
-- Apply via SQL Editor, or let scripts/run-seed.mjs run this file then insert demo data (npm run db:seed).
--
-- Tables mirror app types: numeric ids map to BIGINT IDENTITY in Postgres.

-- Dependent table first on re-run
DROP TABLE IF EXISTS public.activities;

DROP TABLE IF EXISTS public.users;
DROP TABLE IF EXISTS public.activity_categories;

CREATE TABLE public.users (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL,
  position TEXT NOT NULL
);

CREATE TABLE public.activity_categories (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  name TEXT NOT NULL
);

-- Surrogate id + FKs; "date" stored as timestamptz (datetime); "title" is user-visible activity line
CREATE TABLE public.activities (
  id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES public.users (id) ON DELETE CASCADE,
  category_id BIGINT NOT NULL REFERENCES public.activity_categories (id) ON DELETE RESTRICT,
  title TEXT NOT NULL,
  date TIMESTAMPTZ NOT NULL,
  points INTEGER NOT NULL
);

CREATE INDEX IF NOT EXISTS activities_user_id_idx ON public.activities (user_id);
CREATE INDEX IF NOT EXISTS activities_category_id_idx ON public.activities (category_id);
CREATE INDEX IF NOT EXISTS activities_date_idx ON public.activities (date);

ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS users_anon_all ON public.users;
CREATE POLICY users_anon_all ON public.users FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS users_authenticated_all ON public.users;
CREATE POLICY users_authenticated_all ON public.users FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS activity_categories_anon_all ON public.activity_categories;
CREATE POLICY activity_categories_anon_all ON public.activity_categories FOR ALL TO anon
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS activity_categories_authenticated_all ON public.activity_categories;
CREATE POLICY activity_categories_authenticated_all ON public.activity_categories FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS activities_anon_all ON public.activities;
CREATE POLICY activities_anon_all ON public.activities FOR ALL TO anon USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS activities_authenticated_all ON public.activities;
CREATE POLICY activities_authenticated_all ON public.activities FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

-- Data is inserted by scripts/run-seed.mjs (see npm run db:seed).

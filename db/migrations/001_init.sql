-- 001_init.sql
-- Creates schema_migrations and an example table.

CREATE TABLE IF NOT EXISTS public.schema_migrations (
  version     text PRIMARY KEY,
  applied_at  timestamptz NOT NULL DEFAULT now(),
  checksum    text NOT NULL,
  filename    text NOT NULL
);

-- Example domain table
CREATE TABLE IF NOT EXISTS public.health_check (
  id          bigserial PRIMARY KEY,
  created_at  timestamptz NOT NULL DEFAULT now(),
  note        text NOT NULL
);

INSERT INTO public.health_check(note) VALUES ('init ok');
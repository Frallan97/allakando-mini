-- Create migrations table to track applied migrations
-- Migration: 002_migrations_table.sql

CREATE TABLE IF NOT EXISTS migrations (
  id          SERIAL      PRIMARY KEY,
  filename    TEXT        NOT NULL UNIQUE,
  applied_at  TIMESTAMPTZ NOT NULL DEFAULT now()
); 
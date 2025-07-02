-- Initial schema for Allakando tutoring platform
-- Migration: 001_initial_schema.sql

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1) Tutors table
CREATE TABLE IF NOT EXISTS tutors (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT      NOT NULL,
  email       TEXT      NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2) Students table
CREATE TABLE IF NOT EXISTS students (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT      NOT NULL,
  email       TEXT      NOT NULL UNIQUE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 3) Availability slots table
CREATE TABLE IF NOT EXISTS availability_slots (
  id          UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  tutor_id    UUID      NOT NULL REFERENCES tutors(id) ON DELETE CASCADE,
  start_time  TIMESTAMPTZ NOT NULL,
  end_time    TIMESTAMPTZ NOT NULL,
  is_booked   BOOLEAN   NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),
  CONSTRAINT chk_time_order CHECK (end_time > start_time)
);

-- 4) Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id            UUID      PRIMARY KEY DEFAULT gen_random_uuid(),
  slot_id       UUID      NOT NULL REFERENCES availability_slots(id),
  student_id    UUID      NOT NULL REFERENCES students(id),
  booked_at     TIMESTAMPTZ NOT NULL DEFAULT now(),
  UNIQUE (slot_id)  -- prevents double-booking
);

-- Add exclusion constraint to prevent overlapping free slots per tutor
-- Note: This requires the btree_gist extension
CREATE EXTENSION IF NOT EXISTS "btree_gist";

ALTER TABLE availability_slots
  ADD CONSTRAINT exclude_overlapping_slots 
  EXCLUDE USING gist (
    tutor_id WITH =,
    tstzrange(start_time, end_time) WITH &&
  );

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_availability_slots_tutor_id ON availability_slots(tutor_id);
CREATE INDEX IF NOT EXISTS idx_availability_slots_start_time ON availability_slots(start_time);
CREATE INDEX IF NOT EXISTS idx_bookings_student_id ON bookings(student_id);
CREATE INDEX IF NOT EXISTS idx_bookings_slot_id ON bookings(slot_id); 
-- Adds editable user profile fields used by the app profile screen.
-- Run after the rider assignment migration has been applied.

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS first_name VARCHAR(120) NULL,
  ADD COLUMN IF NOT EXISTS last_name VARCHAR(120) NULL,
  ADD COLUMN IF NOT EXISTS phone VARCHAR(40) NULL,
  ADD COLUMN IF NOT EXISTS avatar_url TEXT NULL;

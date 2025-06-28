-- Migration: Clean up cars table
-- Remove legacy/unused fields and ensure canonical schema

ALTER TABLE cars
  DROP COLUMN IF EXISTS brand,
  DROP COLUMN IF EXISTS brand_name,
  DROP COLUMN IF EXISTS price,
  DROP COLUMN IF EXISTS specs,
  DROP COLUMN IF EXISTS mileage;

-- (Optional) You can add/alter columns here if any are missing or have wrong types, e.g.:
-- ALTER TABLE cars ADD COLUMN IF NOT EXISTS ...;
-- ALTER TABLE cars ALTER COLUMN ... TYPE ...; 
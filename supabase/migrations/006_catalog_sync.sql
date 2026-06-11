-- =====================================================================
-- 006: CATALOG SYNC SUPPORT
-- Lets the app import the live Magen Optic catalog from the public
-- WooCommerce Store API (shop.maop.co.il) so AI content generation is
-- grounded in real product data instead of hand-typed entries.
-- =====================================================================

-- Track where a product came from and its source-system id so re-syncing
-- updates existing rows instead of creating duplicates.
ALTER TABLE products
  ADD COLUMN IF NOT EXISTS source TEXT NOT NULL DEFAULT 'manual',
  ADD COLUMN IF NOT EXISTS external_id TEXT,
  ADD COLUMN IF NOT EXISTS last_synced_at TIMESTAMPTZ;

-- One row per (source, external_id) → upsert conflict target.
-- Non-partial so PostgREST can infer it as an ON CONFLICT target;
-- manual rows have external_id NULL and NULLs are distinct, so they
-- never collide with each other.
CREATE UNIQUE INDEX IF NOT EXISTS products_source_external_id
  ON products (source, external_id);

-- Allow categories to be upserted by name during sync without duplicating
-- the seeded Hebrew categories.
CREATE UNIQUE INDEX IF NOT EXISTS categories_name_unique
  ON categories (name);

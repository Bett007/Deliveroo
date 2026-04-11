-- Adds stable rider assignment fields for the Deliveroo order lifecycle.
-- Run after the 20260409_01 Alembic migration has been applied.

ALTER TABLE orders
  ADD COLUMN IF NOT EXISTS assigned_rider_id INTEGER NULL,
  ADD COLUMN IF NOT EXISTS assigned_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS picked_up_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS delivered_at TIMESTAMPTZ NULL,
  ADD COLUMN IF NOT EXISTS cancelled_at TIMESTAMPTZ NULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_orders_assigned_rider'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT fk_orders_assigned_rider
      FOREIGN KEY (assigned_rider_id)
      REFERENCES users(id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS ix_orders_assigned_rider_id
  ON orders(assigned_rider_id);

CREATE INDEX IF NOT EXISTS ix_orders_status_assigned_rider_id
  ON orders(status, assigned_rider_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'ck_orders_status'
  ) THEN
    ALTER TABLE orders
      ADD CONSTRAINT ck_orders_status
      CHECK (status IN ('pending', 'confirmed', 'in_transit', 'delivered', 'cancelled'));
  END IF;
END $$;

CREATE OR REPLACE FUNCTION ensure_assigned_rider_role()
RETURNS trigger AS $$
BEGIN
  IF NEW.assigned_rider_id IS NOT NULL AND NOT EXISTS (
    SELECT 1 FROM users WHERE id = NEW.assigned_rider_id AND role = 'rider'
  ) THEN
    RAISE EXCEPTION 'assigned_rider_id must reference a user with role rider';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_orders_assigned_rider_role ON orders;

CREATE TRIGGER trg_orders_assigned_rider_role
BEFORE INSERT OR UPDATE OF assigned_rider_id ON orders
FOR EACH ROW
EXECUTE FUNCTION ensure_assigned_rider_role();

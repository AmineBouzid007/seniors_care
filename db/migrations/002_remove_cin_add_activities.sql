-- Run ONLY if you already created the tables with the first version of this project (v2.0).
-- Fresh installs don't need this: `npm run db:push` creates everything.
-- Tip: make a Neon branch first (Neon console → Branches → Create branch).

-- 1) Clients are now recognised by phone number instead of CIN
ALTER TABLE clients ADD COLUMN IF NOT EXISTS phone_key text;
UPDATE clients
SET phone_key = CASE
  WHEN regexp_replace(phone, '\D', '', 'g') LIKE '00216%' THEN substr(regexp_replace(phone, '\D', '', 'g'), 6)
  WHEN regexp_replace(phone, '\D', '', 'g') LIKE '216%' AND length(regexp_replace(phone, '\D', '', 'g')) > 8 THEN substr(regexp_replace(phone, '\D', '', 'g'), 4)
  ELSE regexp_replace(phone, '\D', '', 'g')
END
WHERE phone_key IS NULL;

-- If the next line fails with "duplicate key", two clients share a phone number.
-- Fix: SELECT phone_key, count(*) FROM clients GROUP BY 1 HAVING count(*) > 1;
-- then merge them (UPDATE bookings SET client_id = <keep> WHERE client_id = <dup>; DELETE FROM clients WHERE id = <dup>;)
ALTER TABLE clients ALTER COLUMN phone_key SET NOT NULL;
ALTER TABLE clients ADD CONSTRAINT clients_phone_key_unique UNIQUE (phone_key);

-- 2) Remove the national ID column and its data permanently
ALTER TABLE clients DROP COLUMN IF EXISTS cin;

-- 3) Activities table (then run `npm run db:seed` to insert the starter activities)
CREATE TABLE IF NOT EXISTS activities (
  id          serial PRIMARY KEY,
  slug        text NOT NULL UNIQUE,
  title       text NOT NULL,
  description text NOT NULL,
  icon        text NOT NULL DEFAULT 'heart',
  active      boolean NOT NULL DEFAULT true,
  sort_order  integer NOT NULL DEFAULT 0
);

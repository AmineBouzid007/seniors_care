-- Senior Care Tunisia - PostgreSQL schema (Neon).
-- Equivalent to src/lib/schema.ts. Use `npm run db:push` normally;
-- paste this in the Neon SQL Editor only if you prefer doing it by hand.

CREATE TYPE booking_status AS ENUM ('pending','confirmed','completed','cancelled');

CREATE TABLE services (
  id               serial PRIMARY KEY,
  slug             text NOT NULL UNIQUE,
  name             text NOT NULL,
  description      text NOT NULL,
  price_tnd        numeric(10,2) NOT NULL DEFAULT 0,
  duration_minutes integer NOT NULL DEFAULT 60,
  active           boolean NOT NULL DEFAULT true,
  sort_order       integer NOT NULL DEFAULT 0
);

CREATE TABLE clients (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cin         text NOT NULL UNIQUE,
  full_name   text NOT NULL,
  email       text NOT NULL,
  phone       text NOT NULL,
  governorate text NOT NULL,
  address     text NOT NULL,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE bookings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  reference     text NOT NULL UNIQUE,
  client_id     uuid NOT NULL REFERENCES clients(id) ON DELETE RESTRICT,
  service_id    integer NOT NULL REFERENCES services(id) ON DELETE RESTRICT,
  price_tnd     numeric(10,2) NOT NULL,
  booking_date  date NOT NULL,
  booking_time  time NOT NULL,
  status        booking_status NOT NULL DEFAULT 'pending',
  notes         text,
  governorate   text NOT NULL,
  address       text NOT NULL,
  contact_phone text NOT NULL,
  contact_email text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX bookings_status_idx ON bookings(status);
CREATE INDEX bookings_date_idx   ON bookings(booking_date);
CREATE INDEX bookings_client_idx ON bookings(client_id);

CREATE TABLE contact_messages (
  id         serial PRIMARY KEY,
  name       text NOT NULL,
  email      text NOT NULL,
  phone      text,
  message    text NOT NULL,
  handled    boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE admin_users (
  id            serial PRIMARY KEY,
  email         text NOT NULL UNIQUE,
  name          text NOT NULL DEFAULT 'Admin',
  password_hash text NOT NULL,
  created_at    timestamptz NOT NULL DEFAULT now()
);

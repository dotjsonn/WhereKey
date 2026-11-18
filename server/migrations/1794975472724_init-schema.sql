-- Up Migration

CREATE TABLE users (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  email TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE keys (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  location TEXT NOT NULL
);

CREATE TABLE checkouts (
  id INTEGER GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id INTEGER NOT NULL REFERENCES users(id),
  key_id INTEGER NOT NULL REFERENCES keys(id),
  borrowed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  returned_at TIMESTAMPTZ CHECK (returned_at IS NULL OR returned_at >= borrowed_at)
);

CREATE UNIQUE INDEX one_active_checkout_per_key
  ON checkouts (key_id)
  WHERE returned_at IS NULL;

-- Down Migration
DROP TABLE checkouts;
DROP TABLE keys;
DROP TABLE users;
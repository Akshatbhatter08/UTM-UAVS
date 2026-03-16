
-- Alembic migration: initial schema (template)
-- Run this SQL against your Postgres DB if not using alembic autogenerate.
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  hashed_password TEXT NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE drones (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  owner_id INTEGER REFERENCES users(id),
  max_speed FLOAT DEFAULT 15.0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE flightplans (
  id SERIAL PRIMARY KEY,
  drone_id INTEGER REFERENCES drones(id),
  plan JSONB,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT now()
);

CREATE TABLE telemetry (
  id SERIAL PRIMARY KEY,
  drone_id INTEGER REFERENCES drones(id),
  timestamp TIMESTAMP DEFAULT now(),
  lat DOUBLE PRECISION,
  lon DOUBLE PRECISION,
  alt DOUBLE PRECISION,
  raw JSONB
);

CREATE TABLE geofences (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  polygon JSONB NOT NULL,
  type VARCHAR(50) DEFAULT 'no-fly',
  created_at TIMESTAMP DEFAULT now()
);

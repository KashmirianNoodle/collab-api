require("dotenv").config();

const pkg = require("pg");
const { Client } = pkg;

const client = new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

const schemaSQL = `
-- users
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- refresh tokens
CREATE TABLE IF NOT EXISTS refresh_tokens (
  token TEXT PRIMARY KEY,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT now()
);

-- project members (RBAC)
CREATE TABLE IF NOT EXISTS project_members (
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  role TEXT CHECK (role IN ('OWNER','COLLABORATOR','VIEWER')),
  PRIMARY KEY (project_id, user_id)
);

-- workspaces
CREATE TABLE IF NOT EXISTS workspaces (
  id UUID PRIMARY KEY,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT now()
);

-- jobs
CREATE TABLE IF NOT EXISTS jobs (
  id UUID PRIMARY KEY,
  status VARCHAR(20) NOT NULL CHECK (
    status IN ('PENDING', 'PROCESSING', 'SUCCESS', 'FAILED')
  ),
  payload JSONB NOT NULL,
  result JSONB,
  error TEXT,
  attempts INTEGER NOT NULL DEFAULT 0,
  max_attempts INTEGER NOT NULL DEFAULT 3,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  started_at TIMESTAMPTZ,
  finished_at TIMESTAMPTZ
);
`;

async function run() {
  await client.connect();
  await client.query(schemaSQL);
  await client.end();
  console.log("✅ Tables created successfully");
}

run().catch(console.error);

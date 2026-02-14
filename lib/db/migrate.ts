/**
 * Database Migration Script
 * 
 * Run this to create all tables in your Neon Postgres database.
 * Usage: npx tsx lib/db/migrate.ts
 */

import { neon } from "@neondatabase/serverless"

const DATABASE_URL = process.env.DATABASE_URL

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL environment variable is not set")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

const migrationSQL = `
-- ═══════════════════════════════════════════════════════════════════════════════
-- Groqy Agent — Full Database Schema Migration
-- Neon Postgres (Serverless)
-- ═══════════════════════════════════════════════════════════════════════════════

-- Enums
DO $$ BEGIN
  CREATE TYPE member_type AS ENUM ('HUMAN', 'AI');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE member_status AS ENUM ('ONLINE', 'OFFLINE', 'IDLE', 'BUSY');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE task_status AS ENUM ('available', 'assigned', 'in_progress', 'review', 'qa', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE task_priority AS ENUM ('low', 'medium', 'high', 'critical');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE agent_status AS ENUM ('idle', 'processing', 'error', 'offline');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE agent_type AS ENUM ('processor', 'analyzer', 'creator', 'reviewer', 'deployer', 'custom');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE workflow_status AS ENUM ('draft', 'active', 'paused', 'completed', 'failed');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE kanban_column AS ENUM ('backlog', 'in_progress', 'review', 'qa', 'done');
EXCEPTION WHEN duplicate_object THEN null; END $$;

DO $$ BEGIN
  CREATE TYPE schedule_status AS ENUM ('CONFIRMED', 'PENDING', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN null; END $$;

-- ─── Users & Auth ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255) NOT NULL,
  avatar_url TEXT,
  role VARCHAR(100) DEFAULT 'member',
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Agencies ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agencies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  logo TEXT,
  owner_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Teams ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Team Members (Human + AI Hybrid) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255) NOT NULL,
  type member_type NOT NULL,
  avatar TEXT,
  status member_status DEFAULT 'OFFLINE' NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  tasks_in_progress INTEGER DEFAULT 0,
  performance REAL DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── AI Agents ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID REFERENCES team_members(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  agent_type agent_type NOT NULL,
  status agent_status DEFAULT 'idle' NOT NULL,
  description TEXT,
  capabilities JSONB DEFAULT '[]',
  model_id VARCHAR(255) DEFAULT 'llama-3.3-70b-versatile',
  system_prompt TEXT,
  processing_speed REAL DEFAULT 0,
  accuracy REAL DEFAULT 0,
  current_load REAL DEFAULT 0,
  connected_agent_ids JSONB DEFAULT '[]',
  voice_id VARCHAR(100),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Tasks ─────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  status task_status DEFAULT 'available' NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  category VARCHAR(100),
  due_date TIMESTAMP,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  assigned_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  time_spent INTEGER DEFAULT 0,
  completed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Kanban Board ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS kanban_cards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  "column" kanban_column DEFAULT 'backlog' NOT NULL,
  position INTEGER DEFAULT 0,
  tags JSONB DEFAULT '[]',
  comments INTEGER DEFAULT 0,
  attachments INTEGER DEFAULT 0,
  qa_status VARCHAR(50),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Task Attachments ──────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS task_attachments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  task_id UUID NOT NULL REFERENCES tasks(id) ON DELETE CASCADE,
  name VARCHAR(500) NOT NULL,
  url TEXT NOT NULL,
  type VARCHAR(50) DEFAULT 'other',
  size INTEGER DEFAULT 0,
  uploaded_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Workflows ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflows (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  status workflow_status DEFAULT 'draft' NOT NULL,
  diagram_code TEXT,
  steps INTEGER DEFAULT 0,
  created_by_id UUID REFERENCES users(id) ON DELETE SET NULL,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Workflow Steps ────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  agent_id UUID REFERENCES agents(id) ON DELETE SET NULL,
  position INTEGER DEFAULT 0,
  config JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Workflow Agent Assignments ────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS workflow_agents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workflow_id UUID NOT NULL REFERENCES workflows(id) ON DELETE CASCADE,
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  role VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Scheduled Tasks (Weekly Planner) ──────────────────────────────────────
CREATE TABLE IF NOT EXISTS scheduled_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  agency_id UUID REFERENCES agencies(id) ON DELETE CASCADE,
  assigned_to_id UUID REFERENCES team_members(id) ON DELETE SET NULL,
  day VARCHAR(3) NOT NULL,
  start_time VARCHAR(5) NOT NULL,
  end_time VARCHAR(5) NOT NULL,
  priority task_priority DEFAULT 'medium' NOT NULL,
  status schedule_status DEFAULT 'PENDING' NOT NULL,
  week_of TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL,
  updated_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Time Entries (Timetable / Check-ins) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS time_entries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_member_id UUID NOT NULL REFERENCES team_members(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  check_in VARCHAR(5) NOT NULL,
  check_out VARCHAR(5),
  total_hours REAL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Time Entry Task Logs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS time_entry_tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  time_entry_id UUID NOT NULL REFERENCES time_entries(id) ON DELETE CASCADE,
  task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
  title VARCHAR(500) NOT NULL,
  time_spent INTEGER DEFAULT 0
);

-- ─── Analytics Snapshots ───────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS analytics_snapshots (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  date TIMESTAMP NOT NULL,
  tasks_completed INTEGER DEFAULT 0,
  bugs_resolved INTEGER DEFAULT 0,
  workflows_deployed INTEGER DEFAULT 0,
  team_efficiency REAL DEFAULT 0,
  data JSONB DEFAULT '{}',
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Agent Execution Logs ──────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS agent_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_id UUID NOT NULL REFERENCES agents(id) ON DELETE CASCADE,
  action VARCHAR(255) NOT NULL,
  input JSONB,
  output JSONB,
  status VARCHAR(50) DEFAULT 'success',
  duration_ms INTEGER,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Notifications ─────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  message TEXT,
  type VARCHAR(50) DEFAULT 'info',
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Embeddings (RAG / Vector Search Metadata) ────────────────────────────
CREATE TABLE IF NOT EXISTS embeddings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_type VARCHAR(50) NOT NULL,
  source_id UUID NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  qdrant_point_id VARCHAR(255),
  created_at TIMESTAMP DEFAULT NOW() NOT NULL
);

-- ─── Indexes ───────────────────────────────────────────────────────────────
CREATE INDEX IF NOT EXISTS idx_teams_agency ON teams(agency_id);
CREATE INDEX IF NOT EXISTS idx_team_members_team ON team_members(team_id);
CREATE INDEX IF NOT EXISTS idx_team_members_type ON team_members(type);
CREATE INDEX IF NOT EXISTS idx_agents_team_member ON agents(team_member_id);
CREATE INDEX IF NOT EXISTS idx_tasks_agency ON tasks(agency_id);
CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to_id);
CREATE INDEX IF NOT EXISTS idx_tasks_priority ON tasks(priority);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_task ON kanban_cards(task_id);
CREATE INDEX IF NOT EXISTS idx_kanban_cards_column ON kanban_cards("column");
CREATE INDEX IF NOT EXISTS idx_workflows_agency ON workflows(agency_id);
CREATE INDEX IF NOT EXISTS idx_workflow_steps_workflow ON workflow_steps(workflow_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_agency ON scheduled_tasks(agency_id);
CREATE INDEX IF NOT EXISTS idx_scheduled_tasks_day ON scheduled_tasks(day);
CREATE INDEX IF NOT EXISTS idx_time_entries_member ON time_entries(team_member_id);
CREATE INDEX IF NOT EXISTS idx_time_entries_date ON time_entries(date);
CREATE INDEX IF NOT EXISTS idx_analytics_agency_date ON analytics_snapshots(agency_id, date);
CREATE INDEX IF NOT EXISTS idx_agent_logs_agent ON agent_logs(agent_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_unread ON notifications(user_id, read);
CREATE INDEX IF NOT EXISTS idx_embeddings_source ON embeddings(source_type, source_id);
`

async function migrate() {
  console.log("🚀 Starting database migration...")
  console.log("📡 Connecting to Neon Postgres...")

  try {
    await sql`${migrationSQL}`
    console.log("✅ Migration completed successfully!")
    console.log("")
    console.log("Tables created:")
    console.log("  • users              — User accounts and auth")
    console.log("  • agencies           — Agency/organization management")
    console.log("  • teams              — Team groupings within agencies")
    console.log("  • team_members       — Human + AI team members")
    console.log("  • agents             — AI agent configurations")
    console.log("  • tasks              — Task management")
    console.log("  • kanban_cards       — Kanban board state")
    console.log("  • task_attachments   — File attachments on tasks")
    console.log("  • workflows          — Workflow definitions")
    console.log("  • workflow_steps     — Individual workflow steps")
    console.log("  • workflow_agents    — Agent-workflow assignments")
    console.log("  • scheduled_tasks    — Weekly planner entries")
    console.log("  • time_entries       — Check-in/check-out timetable")
    console.log("  • time_entry_tasks   — Time logged per task")
    console.log("  • analytics_snapshots— Performance metrics over time")
    console.log("  • agent_logs         — Agent execution audit trail")
    console.log("  • notifications      — User notification system")
    console.log("  • embeddings         — RAG/vector search metadata")
  } catch (error) {
    console.error("❌ Migration failed:", error)
    process.exit(1)
  }
}

migrate()

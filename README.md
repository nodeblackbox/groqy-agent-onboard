# Groqy Agent

**AI-Powered Human-Agent Hybrid Team Management Platform**

[![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Postgres](https://img.shields.io/badge/Neon_Postgres-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Groq](https://img.shields.io/badge/Groq_LLM-F55036?style=for-the-badge)](https://groq.com)

---

## What This Project Does

Groqy Agent is a **full-stack agency management platform** designed to screen, onboard, and manage hybrid teams of humans and AI agents. It solves a real problem: how do you evaluate whether a person (or an AI) can actually complete tasks, collaborate in workflows, and deliver results?

The platform provides:

- **Candidate screening** — assign real tasks to candidates, track their progress through a Kanban pipeline, and evaluate their output quality before making hiring decisions
- **Human-AI hybrid teams** — manage both human team members and autonomous AI agents in the same workspace, with shared task queues, workflows, and performance metrics
- **Agentic task automation** — AI agents powered by Groq's ultra-fast LLM inference can generate tasks, process data, create content, and execute multi-step workflows autonomously
- **Full operational visibility** — command center, analytics dashboards, timetable check-ins, and weekly planners give complete oversight of who's doing what

---

## Core Features

### Command Center
Real-time operational dashboard showing active agents, running workflows, completed tasks, and system load. Includes a live agent network visualization and an animated terminal showing agent activity.

### Hybrid Team Management
Unified view of all team members — human and AI. Filter by type, search by name/role, view individual performance metrics (tasks completed, in-progress, performance score). Each member has a status indicator (Online, Offline, Idle, Busy).

### Kanban Board
Full drag-and-drop task management with 5 columns: **Backlog → In Progress → Review → QA → Done**. Tasks carry priority levels, assignees, due dates, tags, comments, and file attachments. Supports task submission workflows with QA approval gates.

### Task Management & Screening
Dedicated task views for creating, assigning, filtering, and tracking tasks. Tasks can be assigned to both humans and AI agents. The admin view provides task creation, assignment, status filtering, and search — designed for screening candidates by giving them real work and evaluating delivery.

### AI Agent System
Visual agent pipeline with 5 agent types: **Processor, Analyzer, Creator, Reviewer, Deployer**. Each agent has capabilities, processing speed, accuracy metrics, and current load. Agents connect through a node-based workflow graph where tasks flow through processing stages.

### Agent Creation Flow
5-step wizard for creating new AI agents:
1. Select agent type (Personal Assistant, Research Assistant, Content Creator, Data Analyst, Custom)
2. Configure name, description, and skills
3. Upload resume/context documents for agent personality
4. Select voice profile
5. Review and deploy

### AI Task Generator
Autonomous agent that generates tasks based on project context. Simulates an agentic reasoning process — initializing, analyzing requirements, identifying priorities, scanning backlog, then generating structured task objects with title, description, priority, category, and due dates.

### Workflow Designer
Multi-tab workflow tool with:
- **Diagram Editor** — Mermaid-based visual workflow diagrams with zoom, node selection, and notes
- **Agent Manager** — assign agents to workflow steps, monitor automation tasks
- **Cosmic Nexus** — advanced agent orchestration with workflow execution
- **GitHub Integration** — connect workflows to repositories

### Weekly Planner
Time-grid scheduler showing agent/team member assignments across the week. Color-coded by agent type, with priority indicators and status tracking (Confirmed, Pending, Cancelled).

### Timetable & Check-ins
Time tracking system with check-in/check-out, per-task time logging, daily notes, and weekly summaries. Tracks total hours, average hours/day, and most time-intensive tasks.

### Analytics Dashboard
Performance analytics with:
- Weekly/monthly/quarterly views
- Bar charts (tasks, bugs, workflows by day)
- Line charts (monthly trends)
- Team performance comparisons
- Export and filter capabilities

### Admin Panel
Administrative task management with create, assign, filter, and search. Supports task lifecycle management from creation through assignment to completion, with time tracking.

---

## Architecture

### Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Framework** | Next.js 16 (App Router) | Server/client rendering, API routes, file-based routing |
| **Language** | TypeScript | Type safety across the entire codebase |
| **UI** | React 19 + shadcn/ui | Component library with Radix UI primitives |
| **Styling** | Tailwind CSS 3 | Utility-first CSS with custom dark theme |
| **Database** | Neon Postgres (Serverless) | Persistent storage via Drizzle ORM |
| **AI/LLM** | Groq API | Sub-second LLM inference for agent reasoning |
| **Vector DB** | Qdrant Cloud | Semantic search, agent memory, RAG embeddings |
| **Search** | Exa API | Real-time web search for agents |
| **ORM** | Drizzle ORM | Type-safe SQL queries with schema-first design |
| **Charts** | Recharts | Data visualization for analytics |
| **Animation** | Framer Motion | Smooth UI transitions and micro-interactions |
| **State** | React Context API | Client-side state management |

### Project Structure

```
groqy-agent-onboard/
├── app/
│   ├── api/
│   │   └── db/
│   │       ├── health/route.ts        # Database health check endpoint
│   │       └── migrate/route.ts       # Database migration endpoint
│   ├── layout.tsx                     # Root layout with providers
│   ├── page.tsx                       # Entry point → Dashboard
│   └── globals.css                    # Tailwind + shadcn CSS variables
├── components/
│   ├── dashboard/
│   │   ├── dashboard.tsx              # Main dashboard shell + view router
│   │   ├── sidebar.tsx                # Navigation sidebar
│   │   ├── header.tsx                 # Top bar with agency selector
│   │   ├── command-center.tsx         # Command center view
│   │   ├── team-management.tsx        # Human + AI team management
│   │   ├── kanban-board.tsx           # Drag-and-drop Kanban
│   │   ├── tasks-view.tsx             # Task list with file uploads
│   │   ├── workflows-view.tsx         # Workflow templates
│   │   ├── workflow-designer.tsx      # Visual workflow builder
│   │   ├── weekly-planner.tsx         # Weekly schedule grid
│   │   ├── timetable-view.tsx         # Check-in/check-out tracking
│   │   ├── analytics-view.tsx         # Performance charts
│   │   ├── admin-view.tsx             # Admin task management
│   │   ├── agent-system.tsx           # Agent pipeline visualization
│   │   ├── agent-creation-flow.tsx    # 5-step agent creation wizard
│   │   ├── task-generator-agent.tsx   # AI task generation
│   │   ├── onboarding.tsx             # First-run onboarding flow
│   │   └── ...                        # Supporting components
│   └── ui/                            # 30+ shadcn/ui components
├── context/
│   └── agency-context.tsx             # Global agency/team/member state
├── lib/
│   ├── db/
│   │   ├── index.ts                   # Neon + Drizzle connection
│   │   ├── schema.ts                  # Full database schema (18 tables)
│   │   ├── queries.ts                 # Type-safe query functions
│   │   └── migrate.ts                 # Migration runner
│   └── utils.ts                       # Utility functions (cn, etc.)
├── drizzle.config.ts                  # Drizzle Kit configuration
├── tailwind.config.js                 # Tailwind + shadcn theme
├── postcss.config.mjs                 # PostCSS configuration
└── next.config.mjs                    # Next.js configuration
```

---

## Database Schema

The database is designed around the core entities of the platform. **18 tables** with full referential integrity, indexes for query performance, and JSONB columns for flexible metadata.

### Entity Relationship Overview

```
users ──────────┐
                │
agencies ◄──────┤ (owner)
  │             │
  ├── teams     │
  │     │       │
  │     └── team_members ──┬── agents
  │              │         │     │
  │              │         │     ├── agent_logs
  │              │         │     ├── workflow_agents
  │              │         │     └── workflow_steps
  │              │         │
  │              ├── tasks ┬── kanban_cards
  │              │         ├── task_attachments
  │              │         └── time_entry_tasks
  │              │
  │              ├── scheduled_tasks (weekly planner)
  │              └── time_entries (check-ins)
  │
  ├── workflows ──── workflow_steps
  ├── analytics_snapshots
  └── notifications
  
embeddings (RAG metadata → Qdrant vectors)
```

### Table Descriptions

| Table | Purpose | Key Fields |
|-------|---------|------------|
| `users` | User accounts and authentication | email, name, role, is_admin |
| `agencies` | Top-level organizations | name, logo, owner_id |
| `teams` | Team groupings within agencies | name, agency_id |
| `team_members` | Human + AI members (hybrid) | name, role, type (HUMAN/AI), status, performance |
| `agents` | AI agent configurations | agent_type, capabilities, model_id, system_prompt, accuracy |
| `tasks` | Task management | title, status, priority, category, assigned_to, time_spent |
| `kanban_cards` | Kanban board state | task_id, column, position, tags, qa_status |
| `task_attachments` | File uploads on tasks | name, url, type, size |
| `workflows` | Workflow definitions | name, status, diagram_code, steps count |
| `workflow_steps` | Individual workflow steps | workflow_id, agent_id, position, config |
| `workflow_agents` | Agent-to-workflow assignments | workflow_id, agent_id, role |
| `scheduled_tasks` | Weekly planner entries | day, start_time, end_time, priority, status |
| `time_entries` | Check-in/check-out records | date, check_in, check_out, total_hours |
| `time_entry_tasks` | Per-task time logging | time_entry_id, task_id, time_spent |
| `analytics_snapshots` | Historical performance data | tasks_completed, bugs_resolved, team_efficiency |
| `agent_logs` | Agent execution audit trail | action, input, output, duration_ms |
| `notifications` | User notification system | title, message, type, read |
| `embeddings` | RAG/vector search metadata | source_type, source_id, content, qdrant_point_id |

### Design Decisions

- **UUID primary keys** — distributed-safe, no sequential ID leakage
- **Soft references via JSONB** — agent capabilities, kanban tags, and workflow configs use JSONB for schema flexibility without migrations
- **Enum types** — PostgreSQL enums for status fields ensure data integrity at the database level
- **Cascading deletes** — agency deletion cascades through teams → members → agents → logs, keeping the database clean
- **Indexed queries** — indexes on all foreign keys plus composite indexes on high-frequency query patterns (agency+date for analytics, user+read for notifications)
- **Separation of concerns** — `team_members` holds the unified human/AI identity; `agents` extends it with AI-specific config. This lets the Kanban, planner, and analytics treat humans and agents identically

---

## Agent Architecture & Dependencies

### Agent Types and Their Roles

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  PROCESSOR   │────▶│  ANALYZER   │────▶│   CREATOR   │
│ Data cleaning│     │ Pattern     │     │ Text/image  │
│ Validation   │     │ recognition │     │ generation  │
│ Format conv. │     │ Statistics  │     │ Templates   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                                        ┌─────────────┐     ┌─────────────┐
                                        │  REVIEWER    │────▶│  DEPLOYER   │
                                        │ Quality check│     │ Publishing  │
                                        │ Error detect │     │ Delivery    │
                                        │ Suggestions  │     │ Monitoring  │
                                        └─────────────┘     └─────────────┘
```

### How Agents Depend on Each Other

1. **Processor → Analyzer**: Raw data flows in, gets cleaned and validated, then passed to the analyzer for pattern extraction
2. **Analyzer → Creator**: Insights and structured data feed into content creation agents
3. **Creator → Reviewer**: Generated content goes through quality gates before deployment
4. **Reviewer → Deployer**: Approved content gets published; rejected content loops back to Creator
5. **All → Workflow Manager**: A meta-agent that orchestrates the pipeline, handles retries, and manages the execution DAG

### RAG & Embeddings Pipeline

The platform uses a hybrid approach for intelligent retrieval:

1. **Content ingestion** — tasks, documents, and agent outputs are stored in Postgres (`embeddings` table)
2. **Vector indexing** — content is embedded and stored in Qdrant Cloud with the `qdrant_point_id` linking back to the source
3. **Semantic search** — agents query Qdrant for relevant context before reasoning
4. **Context injection** — retrieved documents are injected into the Groq LLM prompt for grounded responses

---

## Getting Started

### Prerequisites

- **Node.js 18+**
- **pnpm** (recommended)
- **Neon Postgres** account — [neon.tech](https://neon.tech)
- **Groq API key** — [console.groq.com/keys](https://console.groq.com/keys)
- **Qdrant Cloud** account — [cloud.qdrant.io](https://cloud.qdrant.io)
- **Exa API key** — [exa.ai](https://exa.ai)

### Installation

```bash
# Clone the repository
git clone https://github.com/nodeblackbox/groqy-agent-onboard.git
cd groqy-agent-onboard

# Install dependencies
npx pnpm install

# Copy environment template and fill in your keys
cp .env.example .env.local

# Run database migration (creates all 18 tables)
npx pnpm db:migrate

# Start the development server
npx pnpm dev
```

### Environment Variables

```env
# Groq API — powers all AI agent reasoning
GROQ_API_KEY=your_key
NEXT_PUBLIC_GROQ_API_KEY=your_key

# Neon Postgres — persistent storage
DATABASE_URL=postgresql://user:pass@host/db?sslmode=require
PGHOST=your_neon_host
PGDATABASE=neondb
PGUSER=neondb_owner
PGPASSWORD=your_password
PGSSLMODE=require

# Qdrant — vector search and RAG
QDRANT_URL=https://your-cluster.qdrant.io:6333
QDRANT_API_KEY=your_key

# Exa — web search for agents
EXA_API_KEY=your_key

# Team config
TEAM_ID=your_team_id
TEAM_RATE_LIMIT=10
```

---

## Available Scripts

```bash
npx pnpm dev          # Start development server (Turbopack)
npx pnpm build        # Production build
npx pnpm start        # Start production server
npx pnpm lint         # Run ESLint
npx pnpm db:migrate   # Run database migrations
npx pnpm db:generate  # Generate Drizzle migration files
npx pnpm db:studio    # Open Drizzle Studio (visual DB browser)
```

### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/db/health` | Database connection health check |
| `POST` | `/api/db/migrate` | Run database migrations via HTTP |

---

## Security

- API keys are stored exclusively in environment variables, never committed to source control
- Server-side API routes handle all sensitive operations (database queries, LLM calls)
- Rate limiting configured per team (`TEAM_RATE_LIMIT`)
- PostgreSQL connection uses SSL (`sslmode=require`)
- UUID primary keys prevent sequential ID enumeration

## Performance

- **Groq LLM inference** — sub-second response times for agent reasoning
- **Neon Serverless Postgres** — auto-scaling, zero cold starts, branching for dev/staging
- **Turbopack** — Next.js 16 development builds in milliseconds
- **Drizzle ORM** — zero-overhead SQL generation, no N+1 queries
- **Indexed queries** — all high-frequency access patterns are indexed

---

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -m 'Add your feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a Pull Request

## License

MIT License — see [LICENSE](LICENSE) for details.

## Links

- **Groq Console**: [console.groq.com](https://console.groq.com)
- **Neon Postgres**: [neon.tech](https://neon.tech)
- **Qdrant Cloud**: [cloud.qdrant.io](https://cloud.qdrant.io)
- **Exa Search**: [exa.ai](https://exa.ai)
- **Next.js Docs**: [nextjs.org/docs](https://nextjs.org/docs)
- **Drizzle ORM**: [orm.drizzle.team](https://orm.drizzle.team)
- **shadcn/ui**: [ui.shadcn.com](https://ui.shadcn.com)

---

**Built by [nodeblackbox](https://github.com/nodeblackbox)** — Groqy Agent is a production-grade demonstration of full-stack engineering, AI agent orchestration, and human-AI hybrid team management.
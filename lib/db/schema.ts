import {
  pgTable,
  uuid,
  text,
  timestamp,
  integer,
  boolean,
  varchar,
  jsonb,
  real,
  pgEnum,
} from "drizzle-orm/pg-core"
import { relations } from "drizzle-orm"

// ─── Enums ───────────────────────────────────────────────────────────────────

export const memberTypeEnum = pgEnum("member_type", ["HUMAN", "AI"])
export const memberStatusEnum = pgEnum("member_status", [
  "ONLINE",
  "OFFLINE",
  "IDLE",
  "BUSY",
])
export const taskStatusEnum = pgEnum("task_status", [
  "available",
  "assigned",
  "in_progress",
  "review",
  "qa",
  "completed",
  "failed",
])
export const taskPriorityEnum = pgEnum("task_priority", [
  "low",
  "medium",
  "high",
  "critical",
])
export const agentStatusEnum = pgEnum("agent_status", [
  "idle",
  "processing",
  "error",
  "offline",
])
export const agentTypeEnum = pgEnum("agent_type", [
  "processor",
  "analyzer",
  "creator",
  "reviewer",
  "deployer",
  "custom",
])
export const workflowStatusEnum = pgEnum("workflow_status", [
  "draft",
  "active",
  "paused",
  "completed",
  "failed",
])
export const kanbanColumnEnum = pgEnum("kanban_column", [
  "backlog",
  "in_progress",
  "review",
  "qa",
  "done",
])
export const scheduleStatusEnum = pgEnum("schedule_status", [
  "CONFIRMED",
  "PENDING",
  "CANCELLED",
])

// ─── Users & Auth ────────────────────────────────────────────────────────────

export const users = pgTable("users", {
  id: uuid("id").defaultRandom().primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  name: varchar("name", { length: 255 }).notNull(),
  avatarUrl: text("avatar_url"),
  role: varchar("role", { length: 100 }).default("member"),
  isAdmin: boolean("is_admin").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Agencies ────────────────────────────────────────────────────────────────

export const agencies = pgTable("agencies", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  logo: text("logo"),
  ownerId: uuid("owner_id").references(() => users.id, { onDelete: "cascade" }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Teams ───────────────────────────────────────────────────────────────────

export const teams = pgTable("teams", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  agencyId: uuid("agency_id")
    .references(() => agencies.id, { onDelete: "cascade" })
    .notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Team Members (Human + AI hybrid) ────────────────────────────────────────

export const teamMembers = pgTable("team_members", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamId: uuid("team_id")
    .references(() => teams.id, { onDelete: "cascade" })
    .notNull(),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  name: varchar("name", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  type: memberTypeEnum("type").notNull(),
  avatar: text("avatar"),
  status: memberStatusEnum("status").default("OFFLINE").notNull(),
  tasksCompleted: integer("tasks_completed").default(0),
  tasksInProgress: integer("tasks_in_progress").default(0),
  performance: real("performance").default(0),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── AI Agents (extended config for AI team members) ─────────────────────────

export const agents = pgTable("agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamMemberId: uuid("team_member_id").references(() => teamMembers.id, {
    onDelete: "cascade",
  }),
  name: varchar("name", { length: 255 }).notNull(),
  agentType: agentTypeEnum("agent_type").notNull(),
  status: agentStatusEnum("status").default("idle").notNull(),
  description: text("description"),
  capabilities: jsonb("capabilities").$type<string[]>().default([]),
  modelId: varchar("model_id", { length: 255 }).default("llama-3.3-70b-versatile"),
  systemPrompt: text("system_prompt"),
  processingSpeed: real("processing_speed").default(0),
  accuracy: real("accuracy").default(0),
  currentLoad: real("current_load").default(0),
  connectedAgentIds: jsonb("connected_agent_ids").$type<string[]>().default([]),
  voiceId: varchar("voice_id", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Tasks ───────────────────────────────────────────────────────────────────

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  status: taskStatusEnum("status").default("available").notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  category: varchar("category", { length: 100 }),
  dueDate: timestamp("due_date"),
  agencyId: uuid("agency_id").references(() => agencies.id, {
    onDelete: "cascade",
  }),
  assignedToId: uuid("assigned_to_id").references(() => teamMembers.id, {
    onDelete: "set null",
  }),
  assignedById: uuid("assigned_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdById: uuid("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  timeSpent: integer("time_spent").default(0),
  completedAt: timestamp("completed_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Kanban Board ────────────────────────────────────────────────────────────

export const kanbanCards = pgTable("kanban_cards", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  column: kanbanColumnEnum("column").default("backlog").notNull(),
  position: integer("position").default(0),
  tags: jsonb("tags").$type<string[]>().default([]),
  comments: integer("comments").default(0),
  attachments: integer("attachments").default(0),
  qaStatus: varchar("qa_status", { length: 50 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Task Attachments ────────────────────────────────────────────────────────

export const taskAttachments = pgTable("task_attachments", {
  id: uuid("id").defaultRandom().primaryKey(),
  taskId: uuid("task_id")
    .references(() => tasks.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 500 }).notNull(),
  url: text("url").notNull(),
  type: varchar("type", { length: 50 }).default("other"),
  size: integer("size").default(0),
  uploadedById: uuid("uploaded_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Workflows ───────────────────────────────────────────────────────────────

export const workflows = pgTable("workflows", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  agencyId: uuid("agency_id").references(() => agencies.id, {
    onDelete: "cascade",
  }),
  status: workflowStatusEnum("status").default("draft").notNull(),
  diagramCode: text("diagram_code"),
  steps: integer("steps").default(0),
  createdById: uuid("created_by_id").references(() => users.id, {
    onDelete: "set null",
  }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Workflow Steps ──────────────────────────────────────────────────────────

export const workflowSteps = pgTable("workflow_steps", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id")
    .references(() => workflows.id, { onDelete: "cascade" })
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  agentId: uuid("agent_id").references(() => agents.id, {
    onDelete: "set null",
  }),
  position: integer("position").default(0),
  config: jsonb("config").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Workflow Agent Assignments ──────────────────────────────────────────────

export const workflowAgents = pgTable("workflow_agents", {
  id: uuid("id").defaultRandom().primaryKey(),
  workflowId: uuid("workflow_id")
    .references(() => workflows.id, { onDelete: "cascade" })
    .notNull(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  role: varchar("role", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Weekly Planner / Scheduled Tasks ────────────────────────────────────────

export const scheduledTasks = pgTable("scheduled_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  title: varchar("title", { length: 500 }).notNull(),
  description: text("description"),
  agencyId: uuid("agency_id").references(() => agencies.id, {
    onDelete: "cascade",
  }),
  assignedToId: uuid("assigned_to_id").references(() => teamMembers.id, {
    onDelete: "set null",
  }),
  day: varchar("day", { length: 3 }).notNull(),
  startTime: varchar("start_time", { length: 5 }).notNull(),
  endTime: varchar("end_time", { length: 5 }).notNull(),
  priority: taskPriorityEnum("priority").default("medium").notNull(),
  status: scheduleStatusEnum("status").default("PENDING").notNull(),
  weekOf: timestamp("week_of"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
})

// ─── Time Entries (Timetable / Check-ins) ────────────────────────────────────

export const timeEntries = pgTable("time_entries", {
  id: uuid("id").defaultRandom().primaryKey(),
  teamMemberId: uuid("team_member_id")
    .references(() => teamMembers.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  checkIn: varchar("check_in", { length: 5 }).notNull(),
  checkOut: varchar("check_out", { length: 5 }),
  totalHours: real("total_hours"),
  notes: text("notes"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Time Entry Task Logs ────────────────────────────────────────────────────

export const timeEntryTasks = pgTable("time_entry_tasks", {
  id: uuid("id").defaultRandom().primaryKey(),
  timeEntryId: uuid("time_entry_id")
    .references(() => timeEntries.id, { onDelete: "cascade" })
    .notNull(),
  taskId: uuid("task_id").references(() => tasks.id, { onDelete: "set null" }),
  title: varchar("title", { length: 500 }).notNull(),
  timeSpent: integer("time_spent").default(0),
})

// ─── Analytics Snapshots ─────────────────────────────────────────────────────

export const analyticsSnapshots = pgTable("analytics_snapshots", {
  id: uuid("id").defaultRandom().primaryKey(),
  agencyId: uuid("agency_id")
    .references(() => agencies.id, { onDelete: "cascade" })
    .notNull(),
  date: timestamp("date").notNull(),
  tasksCompleted: integer("tasks_completed").default(0),
  bugsResolved: integer("bugs_resolved").default(0),
  workflowsDeployed: integer("workflows_deployed").default(0),
  teamEfficiency: real("team_efficiency").default(0),
  data: jsonb("data").$type<Record<string, unknown>>().default({}),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Agent Execution Logs ────────────────────────────────────────────────────

export const agentLogs = pgTable("agent_logs", {
  id: uuid("id").defaultRandom().primaryKey(),
  agentId: uuid("agent_id")
    .references(() => agents.id, { onDelete: "cascade" })
    .notNull(),
  action: varchar("action", { length: 255 }).notNull(),
  input: jsonb("input").$type<Record<string, unknown>>(),
  output: jsonb("output").$type<Record<string, unknown>>(),
  status: varchar("status", { length: 50 }).default("success"),
  durationMs: integer("duration_ms"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Notifications ───────────────────────────────────────────────────────────

export const notifications = pgTable("notifications", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id")
    .references(() => users.id, { onDelete: "cascade" })
    .notNull(),
  title: varchar("title", { length: 255 }).notNull(),
  message: text("message"),
  type: varchar("type", { length: 50 }).default("info"),
  read: boolean("read").default(false),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Embeddings (for RAG / vector search) ────────────────────────────────────

export const embeddings = pgTable("embeddings", {
  id: uuid("id").defaultRandom().primaryKey(),
  sourceType: varchar("source_type", { length: 50 }).notNull(),
  sourceId: uuid("source_id").notNull(),
  content: text("content").notNull(),
  metadata: jsonb("metadata").$type<Record<string, unknown>>().default({}),
  qdrantPointId: varchar("qdrant_point_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
})

// ─── Relations ───────────────────────────────────────────────────────────────

export const agenciesRelations = relations(agencies, ({ one, many }) => ({
  owner: one(users, { fields: [agencies.ownerId], references: [users.id] }),
  teams: many(teams),
  tasks: many(tasks),
  workflows: many(workflows),
  scheduledTasks: many(scheduledTasks),
  analyticsSnapshots: many(analyticsSnapshots),
}))

export const teamsRelations = relations(teams, ({ one, many }) => ({
  agency: one(agencies, { fields: [teams.agencyId], references: [agencies.id] }),
  members: many(teamMembers),
}))

export const teamMembersRelations = relations(teamMembers, ({ one, many }) => ({
  team: one(teams, { fields: [teamMembers.teamId], references: [teams.id] }),
  user: one(users, { fields: [teamMembers.userId], references: [users.id] }),
  agent: one(agents),
  assignedTasks: many(tasks),
  timeEntries: many(timeEntries),
  scheduledTasks: many(scheduledTasks),
}))

export const agentsRelations = relations(agents, ({ one, many }) => ({
  teamMember: one(teamMembers, {
    fields: [agents.teamMemberId],
    references: [teamMembers.id],
  }),
  workflowSteps: many(workflowSteps),
  workflowAgents: many(workflowAgents),
  logs: many(agentLogs),
}))

export const tasksRelations = relations(tasks, ({ one, many }) => ({
  agency: one(agencies, { fields: [tasks.agencyId], references: [agencies.id] }),
  assignedTo: one(teamMembers, {
    fields: [tasks.assignedToId],
    references: [teamMembers.id],
  }),
  assignedBy: one(users, {
    fields: [tasks.assignedById],
    references: [users.id],
    relationName: "assignedBy",
  }),
  createdBy: one(users, {
    fields: [tasks.createdById],
    references: [users.id],
    relationName: "createdBy",
  }),
  kanbanCard: one(kanbanCards),
  attachments: many(taskAttachments),
}))

export const workflowsRelations = relations(workflows, ({ one, many }) => ({
  agency: one(agencies, {
    fields: [workflows.agencyId],
    references: [agencies.id],
  }),
  createdBy: one(users, {
    fields: [workflows.createdById],
    references: [users.id],
  }),
  steps: many(workflowSteps),
  agents: many(workflowAgents),
}))

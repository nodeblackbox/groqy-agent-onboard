import { db } from "./index"
import { eq, desc, and, sql } from "drizzle-orm"
import {
  users,
  agencies,
  teams,
  teamMembers,
  agents,
  tasks,
  kanbanCards,
  taskAttachments,
  workflows,
  workflowSteps,
  workflowAgents,
  scheduledTasks,
  timeEntries,
  timeEntryTasks,
  analyticsSnapshots,
  agentLogs,
  notifications,
  embeddings,
} from "./schema"

// ─── Users ───────────────────────────────────────────────────────────────────

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1)
  return result[0] ?? null
}

export async function createUser(data: { email: string; name: string; avatarUrl?: string; role?: string; isAdmin?: boolean }) {
  const result = await db.insert(users).values(data).returning()
  return result[0]
}

export async function updateUser(id: string, data: Partial<typeof users.$inferInsert>) {
  const result = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning()
  return result[0]
}

// ─── Agencies ────────────────────────────────────────────────────────────────

export async function getAgenciesByOwner(ownerId: string) {
  return db.select().from(agencies).where(eq(agencies.ownerId, ownerId)).orderBy(desc(agencies.createdAt))
}

export async function createAgency(data: { name: string; ownerId: string; logo?: string }) {
  const result = await db.insert(agencies).values(data).returning()
  return result[0]
}

export async function getAgencyWithTeams(agencyId: string) {
  return db.query.agencies.findFirst({
    where: eq(agencies.id, agencyId),
    with: {
      teams: {
        with: {
          members: true,
        },
      },
    },
  })
}

// ─── Teams ───────────────────────────────────────────────────────────────────

export async function getTeamsByAgency(agencyId: string) {
  return db.select().from(teams).where(eq(teams.agencyId, agencyId))
}

export async function createTeam(data: { name: string; agencyId: string }) {
  const result = await db.insert(teams).values(data).returning()
  return result[0]
}

// ─── Team Members ────────────────────────────────────────────────────────────

export async function getTeamMembers(teamId: string) {
  return db.select().from(teamMembers).where(eq(teamMembers.teamId, teamId))
}

export async function getAllTeamMembersByAgency(agencyId: string) {
  return db
    .select({
      member: teamMembers,
      team: teams,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teams.agencyId, agencyId))
}

export async function createTeamMember(data: typeof teamMembers.$inferInsert) {
  const result = await db.insert(teamMembers).values(data).returning()
  return result[0]
}

export async function updateTeamMemberStatus(id: string, status: "ONLINE" | "OFFLINE" | "IDLE" | "BUSY") {
  return db.update(teamMembers).set({ status, updatedAt: new Date() }).where(eq(teamMembers.id, id)).returning()
}

export async function updateTeamMemberPerformance(id: string, data: { tasksCompleted?: number; tasksInProgress?: number; performance?: number }) {
  return db.update(teamMembers).set({ ...data, updatedAt: new Date() }).where(eq(teamMembers.id, id)).returning()
}

// ─── Agents ──────────────────────────────────────────────────────────────────

export async function getAgentsByAgency(agencyId: string) {
  return db
    .select({
      agent: agents,
      member: teamMembers,
    })
    .from(agents)
    .innerJoin(teamMembers, eq(agents.teamMemberId, teamMembers.id))
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teams.agencyId, agencyId))
}

export async function createAgent(data: typeof agents.$inferInsert) {
  const result = await db.insert(agents).values(data).returning()
  return result[0]
}

export async function updateAgentStatus(id: string, status: "idle" | "processing" | "error" | "offline") {
  return db.update(agents).set({ status, updatedAt: new Date() }).where(eq(agents.id, id)).returning()
}

export async function getAgentWithLogs(agentId: string) {
  return db.query.agents.findFirst({
    where: eq(agents.id, agentId),
    with: {
      logs: {
        orderBy: desc(agentLogs.createdAt),
        limit: 50,
      },
      teamMember: true,
    },
  })
}

// ─── Tasks ───────────────────────────────────────────────────────────────────

export async function getTasksByAgency(agencyId: string) {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.agencyId, agencyId))
    .orderBy(desc(tasks.createdAt))
}

export async function getTasksByAssignee(assigneeId: string) {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.assignedToId, assigneeId))
    .orderBy(desc(tasks.createdAt))
}

export async function createTask(data: typeof tasks.$inferInsert) {
  const result = await db.insert(tasks).values(data).returning()
  return result[0]
}

export async function updateTask(id: string, data: Partial<typeof tasks.$inferInsert>) {
  const result = await db.update(tasks).set({ ...data, updatedAt: new Date() }).where(eq(tasks.id, id)).returning()
  return result[0]
}

export async function assignTask(taskId: string, assignedToId: string, assignedById: string) {
  return db
    .update(tasks)
    .set({
      assignedToId,
      assignedById,
      status: "assigned",
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning()
}

export async function completeTask(taskId: string) {
  return db
    .update(tasks)
    .set({
      status: "completed",
      completedAt: new Date(),
      updatedAt: new Date(),
    })
    .where(eq(tasks.id, taskId))
    .returning()
}

// ─── Kanban ──────────────────────────────────────────────────────────────────

export async function getKanbanByAgency(agencyId: string) {
  return db
    .select({
      card: kanbanCards,
      task: tasks,
    })
    .from(kanbanCards)
    .innerJoin(tasks, eq(kanbanCards.taskId, tasks.id))
    .where(eq(tasks.agencyId, agencyId))
    .orderBy(kanbanCards.position)
}

export async function moveKanbanCard(cardId: string, column: "backlog" | "in_progress" | "review" | "qa" | "done", position: number) {
  return db
    .update(kanbanCards)
    .set({ column, position, updatedAt: new Date() })
    .where(eq(kanbanCards.id, cardId))
    .returning()
}

export async function createKanbanCard(data: typeof kanbanCards.$inferInsert) {
  const result = await db.insert(kanbanCards).values(data).returning()
  return result[0]
}

// ─── Workflows ───────────────────────────────────────────────────────────────

export async function getWorkflowsByAgency(agencyId: string) {
  return db
    .select()
    .from(workflows)
    .where(eq(workflows.agencyId, agencyId))
    .orderBy(desc(workflows.createdAt))
}

export async function getWorkflowWithSteps(workflowId: string) {
  return db.query.workflows.findFirst({
    where: eq(workflows.id, workflowId),
    with: {
      steps: {
        orderBy: workflowSteps.position,
      },
      agents: {
        with: {
          // Note: agent relation resolved via workflowAgents
        },
      },
    },
  })
}

export async function createWorkflow(data: typeof workflows.$inferInsert) {
  const result = await db.insert(workflows).values(data).returning()
  return result[0]
}

export async function updateWorkflowStatus(id: string, status: "draft" | "active" | "paused" | "completed" | "failed") {
  return db.update(workflows).set({ status, updatedAt: new Date() }).where(eq(workflows.id, id)).returning()
}

// ─── Scheduled Tasks (Weekly Planner) ────────────────────────────────────────

export async function getScheduledTasksByAgency(agencyId: string, weekOf?: Date) {
  const conditions = [eq(scheduledTasks.agencyId, agencyId)]
  if (weekOf) {
    conditions.push(eq(scheduledTasks.weekOf, weekOf))
  }
  return db.select().from(scheduledTasks).where(and(...conditions))
}

export async function createScheduledTask(data: typeof scheduledTasks.$inferInsert) {
  const result = await db.insert(scheduledTasks).values(data).returning()
  return result[0]
}

export async function updateScheduledTaskStatus(id: string, status: "CONFIRMED" | "PENDING" | "CANCELLED") {
  return db.update(scheduledTasks).set({ status, updatedAt: new Date() }).where(eq(scheduledTasks.id, id)).returning()
}

// ─── Time Entries (Timetable / Check-ins) ────────────────────────────────────

export async function getTimeEntriesByMember(memberId: string) {
  return db
    .select()
    .from(timeEntries)
    .where(eq(timeEntries.teamMemberId, memberId))
    .orderBy(desc(timeEntries.date))
}

export async function createTimeEntry(data: typeof timeEntries.$inferInsert) {
  const result = await db.insert(timeEntries).values(data).returning()
  return result[0]
}

export async function checkIn(memberId: string, checkInTime: string) {
  return createTimeEntry({
    teamMemberId: memberId,
    date: new Date(),
    checkIn: checkInTime,
  })
}

export async function checkOut(timeEntryId: string, checkOutTime: string, totalHours: number, notes?: string) {
  return db
    .update(timeEntries)
    .set({ checkOut: checkOutTime, totalHours, notes })
    .where(eq(timeEntries.id, timeEntryId))
    .returning()
}

export async function logTimeEntryTask(data: typeof timeEntryTasks.$inferInsert) {
  const result = await db.insert(timeEntryTasks).values(data).returning()
  return result[0]
}

// ─── Analytics ───────────────────────────────────────────────────────────────

export async function getAnalyticsSnapshots(agencyId: string, limit = 30) {
  return db
    .select()
    .from(analyticsSnapshots)
    .where(eq(analyticsSnapshots.agencyId, agencyId))
    .orderBy(desc(analyticsSnapshots.date))
    .limit(limit)
}

export async function createAnalyticsSnapshot(data: typeof analyticsSnapshots.$inferInsert) {
  const result = await db.insert(analyticsSnapshots).values(data).returning()
  return result[0]
}

// ─── Agent Logs ──────────────────────────────────────────────────────────────

export async function getAgentLogs(agentId: string, limit = 100) {
  return db
    .select()
    .from(agentLogs)
    .where(eq(agentLogs.agentId, agentId))
    .orderBy(desc(agentLogs.createdAt))
    .limit(limit)
}

export async function createAgentLog(data: typeof agentLogs.$inferInsert) {
  const result = await db.insert(agentLogs).values(data).returning()
  return result[0]
}

// ─── Notifications ───────────────────────────────────────────────────────────

export async function getNotifications(userId: string, unreadOnly = false) {
  const conditions = [eq(notifications.userId, userId)]
  if (unreadOnly) {
    conditions.push(eq(notifications.read, false))
  }
  return db.select().from(notifications).where(and(...conditions)).orderBy(desc(notifications.createdAt))
}

export async function markNotificationRead(id: string) {
  return db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning()
}

export async function createNotification(data: typeof notifications.$inferInsert) {
  const result = await db.insert(notifications).values(data).returning()
  return result[0]
}

// ─── Embeddings (RAG) ────────────────────────────────────────────────────────

export async function createEmbedding(data: typeof embeddings.$inferInsert) {
  const result = await db.insert(embeddings).values(data).returning()
  return result[0]
}

export async function getEmbeddingsBySource(sourceType: string, sourceId: string) {
  return db
    .select()
    .from(embeddings)
    .where(and(eq(embeddings.sourceType, sourceType), eq(embeddings.sourceId, sourceId)))
}

// ─── Dashboard Aggregations ──────────────────────────────────────────────────

export async function getDashboardStats(agencyId: string) {
  const [taskStats] = await db
    .select({
      total: sql<number>`count(*)`,
      completed: sql<number>`count(*) filter (where ${tasks.status} = 'completed')`,
      inProgress: sql<number>`count(*) filter (where ${tasks.status} = 'in_progress')`,
      available: sql<number>`count(*) filter (where ${tasks.status} = 'available')`,
    })
    .from(tasks)
    .where(eq(tasks.agencyId, agencyId))

  const [memberStats] = await db
    .select({
      total: sql<number>`count(*)`,
      humans: sql<number>`count(*) filter (where ${teamMembers.type} = 'HUMAN')`,
      agents: sql<number>`count(*) filter (where ${teamMembers.type} = 'AI')`,
      online: sql<number>`count(*) filter (where ${teamMembers.status} = 'ONLINE')`,
    })
    .from(teamMembers)
    .innerJoin(teams, eq(teamMembers.teamId, teams.id))
    .where(eq(teams.agencyId, agencyId))

  const [workflowStats] = await db
    .select({
      total: sql<number>`count(*)`,
      active: sql<number>`count(*) filter (where ${workflows.status} = 'active')`,
    })
    .from(workflows)
    .where(eq(workflows.agencyId, agencyId))

  return {
    tasks: taskStats,
    members: memberStats,
    workflows: workflowStats,
  }
}

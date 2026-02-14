"use client"
import { createContext, useContext, useState, type ReactNode } from "react"

// Define agency types
export type Agency = {
  id: string
  name: string
  logo?: string
  teams: Team[]
}

export type Team = {
  id: string
  name: string
  members: TeamMember[]
}

export type TeamMember = {
  id: number
  name: string
  role: string
  type: "HUMAN" | "AI"
  avatar: string | null
  tasksCompleted: number
  tasksInProgress: number
  performance: number
  status: "ONLINE" | "OFFLINE" | "IDLE" | "BUSY"
}

// Sample data
const sampleAgencies: Agency[] = [
  {
    id: "agency-1",
    name: "Groqy AI",
    logo: "/placeholder.svg?key=2wlvc",
    teams: [
      {
        id: "team-1",
        name: "Core Team",
        members: [
          {
            id: 1,
            name: "Alex Chen",
            role: "Lead Developer",
            type: "HUMAN",
            avatar: "/placeholder.svg?key=hmrwy",
            tasksCompleted: 28,
            tasksInProgress: 3,
            performance: 92,
            status: "ONLINE",
          },
          {
            id: 2,
            name: "Sarah Johnson",
            role: "UX Designer",
            type: "HUMAN",
            avatar: "/placeholder.svg?key=tflmo",
            tasksCompleted: 19,
            tasksInProgress: 2,
            performance: 88,
            status: "OFFLINE",
          },
          {
            id: 3,
            name: "DATA_PROCESSOR",
            role: "Data Analyst",
            type: "AI",
            avatar: null,
            tasksCompleted: 145,
            tasksInProgress: 7,
            performance: 98,
            status: "ONLINE",
          },
          {
            id: 4,
            name: "CONTENT_CREATOR",
            role: "Content Writer",
            type: "AI",
            avatar: null,
            tasksCompleted: 87,
            tasksInProgress: 3,
            performance: 92,
            status: "ONLINE",
          },
        ],
      },
    ],
  },
  {
    id: "agency-2",
    name: "TechNova",
    logo: "/placeholder.svg?key=rt8pe",
    teams: [
      {
        id: "team-2",
        name: "Development Team",
        members: [
          {
            id: 5,
            name: "Michael Torres",
            role: "QA Engineer",
            type: "HUMAN",
            avatar: "/placeholder.svg?key=mnd5b",
            tasksCompleted: 34,
            tasksInProgress: 1,
            performance: 95,
            status: "ONLINE",
          },
          {
            id: 6,
            name: "SUPPORT_BOT",
            role: "Customer Support",
            type: "AI",
            avatar: null,
            tasksCompleted: 203,
            tasksInProgress: 0,
            performance: 95,
            status: "IDLE",
          },
        ],
      },
    ],
  },
  {
    id: "agency-3",
    name: "Quantum Solutions",
    logo: "/abstract-quantum-symbol.png",
    teams: [
      {
        id: "team-3",
        name: "Management Team",
        members: [
          {
            id: 7,
            name: "Emma Wilson",
            role: "Project Manager",
            type: "HUMAN",
            avatar: "/confident-woman-manager.png",
            tasksCompleted: 15,
            tasksInProgress: 4,
            performance: 90,
            status: "ONLINE",
          },
          {
            id: 8,
            name: "WORKFLOW_MANAGER",
            role: "Process Automation",
            type: "AI",
            avatar: null,
            tasksCompleted: 56,
            tasksInProgress: 5,
            performance: 99,
            status: "ONLINE",
          },
        ],
      },
    ],
  },
]

// Create context type
type AgencyContextType = {
  agencies: Agency[]
  currentAgency: Agency
  setCurrentAgency: (agency: Agency) => void
  allTeamMembers: TeamMember[]
  agentStatusData: any[]
  agentAvailability: Record<string, { available: boolean; nextAvailable: string | null }>
}

// Create context with default values
const AgencyContext = createContext<AgencyContextType>({
  agencies: [],
  currentAgency: sampleAgencies[0],
  setCurrentAgency: () => {},
  allTeamMembers: [],
  agentStatusData: [],
  agentAvailability: {},
})

// Create provider component
export const AgencyProvider = ({ children }: { children: ReactNode }) => {
  const [agencies, setAgencies] = useState<Agency[]>(sampleAgencies)
  const [currentAgency, setCurrentAgency] = useState<Agency>(sampleAgencies[0])

  // Compute all team members across all teams in the current agency
  const allTeamMembers = currentAgency.teams.flatMap((team) => team.members)

  // Agent status data for AI agents
  const agentStatusData = allTeamMembers
    .filter((member) => member.type === "AI")
    .map((agent) => ({
      id: agent.id,
      name: agent.name,
      status: agent.status === "IDLE" ? "IDLE" : "ACTIVE",
      cpu: Math.floor(Math.random() * 60) + 20, // Random CPU between 20-80%
      memory: Math.floor(Math.random() * 200) + 50, // Random memory between 50-250 MB
      tasks: agent.tasksInProgress,
    }))

  // Agent availability data
  const agentAvailability = Object.fromEntries(
    allTeamMembers
      .filter((member) => member.type === "AI")
      .map((agent) => [
        agent.name,
        {
          available: agent.status === "ONLINE",
          nextAvailable: agent.status !== "ONLINE" ? "16:00 TODAY" : null,
        },
      ]),
  )

  return (
    <AgencyContext.Provider
      value={{
        agencies,
        currentAgency,
        setCurrentAgency,
        allTeamMembers,
        agentStatusData,
        agentAvailability,
      }}
    >
      {children}
    </AgencyContext.Provider>
  )
}

// Create hook for using the context
export const useAgency = () => useContext(AgencyContext)

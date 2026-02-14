"use client"
import { AgencyProvider } from "@/context/agency-context"
import { useState, useEffect, useRef, type DragEvent } from "react"
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import {
  Menu,
  FileText,
  Bot,
  Activity,
  CheckCircle,
  Clock,
  Loader,
  ChevronRight,
  Database,
  Layers,
  GitBranch,
  Plus,
  Calendar,
  ChevronLeft,
  ChevronDown,
  X,
  AlertCircle,
  User,
  Zap,
  Upload,
  MessageSquare,
  Users,
  Shield,
  Eye,
  Clipboard,
  Star,
  Award,
  Filter,
  Search,
  PanelRight,
  PanelLeft,
  Paperclip,
} from "lucide-react"

// Weekly data for the chart
const data = [
  { name: "MON", tasks: 12, bugs: 5, workflows: 3 },
  { name: "TUE", tasks: 19, bugs: 3, workflows: 5 },
  { name: "WED", tasks: 15, bugs: 7, workflows: 4 },
  { name: "THU", tasks: 22, bugs: 2, workflows: 6 },
  { name: "FRI", tasks: 18, bugs: 4, workflows: 5 },
  { name: "SAT", tasks: 10, bugs: 1, workflows: 2 },
  { name: "SUN", tasks: 8, bugs: 0, workflows: 1 },
]

// Agent status data
const agentStatusData = [
  { id: 1, name: "DATA_PROCESSOR", status: "ACTIVE", cpu: 42, memory: 128, tasks: 7 },
  { id: 2, name: "CONTENT_CREATOR", status: "ACTIVE", cpu: 68, memory: 256, tasks: 3 },
  { id: 3, name: "SUPPORT_BOT", status: "IDLE", cpu: 12, memory: 64, tasks: 0 },
  { id: 4, name: "WORKFLOW_MANAGER", status: "ACTIVE", cpu: 54, memory: 192, tasks: 5 },
]

// Team members data (both human and AI)
const teamMembersData = [
  {
    id: 1,
    name: "Alex Chen",
    role: "Lead Developer",
    type: "HUMAN",
    avatar: "/air-conditioner-unit.png",
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
    avatar: "/stylized-initials.png",
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
  {
    id: 5,
    name: "Michael Torres",
    role: "QA Engineer",
    type: "HUMAN",
    avatar: "/abstract-geometric-mt.png",
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
  {
    id: 7,
    name: "Emma Wilson",
    role: "Project Manager",
    type: "HUMAN",
    avatar: "/graffiti-ew.png",
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
]

// Kanban board data
const initialKanbanData = {
  backlog: [
    {
      id: "task-1",
      title: "Implement User Authentication",
      description: "Add OAuth2 authentication to the platform",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-20",
      tags: ["SECURITY", "BACKEND"],
      comments: 3,
      attachments: 1,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-10",
    },
    {
      id: "task-2",
      title: "Design Landing Page",
      description: "Create wireframes and mockups for the new landing page",
      priority: "MEDIUM",
      assignee: "Sarah Johnson",
      dueDate: "2025-04-22",
      tags: ["DESIGN", "FRONTEND"],
      comments: 5,
      attachments: 2,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-11",
    },
    {
      id: "task-3",
      title: "Analyze User Behavior Data",
      description: "Process and analyze user interaction data from the last quarter",
      priority: "LOW",
      assignee: "DATA_PROCESSOR",
      dueDate: "2025-04-25",
      tags: ["ANALYTICS", "DATA"],
      comments: 1,
      attachments: 0,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-12",
    },
  ],
  inProgress: [
    {
      id: "task-4",
      title: "Optimize Database Queries",
      description: "Improve performance of slow-running database queries",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-18",
      tags: ["BACKEND", "PERFORMANCE"],
      comments: 2,
      attachments: 0,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-09",
    },
    {
      id: "task-5",
      title: "Generate Blog Content",
      description: "Create 5 blog posts about new product features",
      priority: "MEDIUM",
      assignee: "CONTENT_CREATOR",
      dueDate: "2025-04-19",
      tags: ["CONTENT", "MARKETING"],
      comments: 4,
      attachments: 3,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-10",
    },
  ],
  review: [
    {
      id: "task-6",
      title: "Fix Navigation Bug",
      description: "Address issue with dropdown menu not working on mobile devices",
      priority: "HIGH",
      assignee: "Alex Chen",
      dueDate: "2025-04-16",
      tags: ["FRONTEND", "BUG"],
      comments: 6,
      attachments: 2,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-08",
      submittedAt: "2025-04-15",
      submissionNotes: "Fixed the issue by updating the event listeners. Added tests to prevent regression.",
      submissionFiles: ["fix-navigation.zip", "test-results.pdf"],
      qaStatus: "TESTING",
      qaAssignee: "Michael Torres",
    },
  ],
  qa: [
    {
      id: "task-7",
      title: "Test Payment Integration",
      description: "Verify that the new payment gateway integration works correctly",
      priority: "HIGH",
      assignee: "Michael Torres",
      dueDate: "2025-04-17",
      tags: ["TESTING", "PAYMENTS"],
      comments: 8,
      attachments: 3,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-09",
      submittedAt: "2025-04-14",
      submissionNotes: "Implemented the Stripe integration. All test cases are passing.",
      submissionFiles: ["payment-integration.zip", "test-results.pdf"],
      qaStatus: "TESTING",
      qaAssignee: "Michael Torres",
    },
  ],
  done: [
    {
      id: "task-8",
      title: "Update Privacy Policy",
      description: "Update the privacy policy to comply with new regulations",
      priority: "MEDIUM",
      assignee: "CONTENT_CREATOR",
      dueDate: "2025-04-15",
      tags: ["LEGAL", "CONTENT"],
      comments: 4,
      attachments: 1,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-07",
      submittedAt: "2025-04-13",
      submissionNotes: "Updated the policy with all required changes. Legal team has approved.",
      submissionFiles: ["privacy-policy.docx", "legal-approval.pdf"],
      qaStatus: "APPROVED",
      qaAssignee: "Michael Torres",
      completedAt: "2025-04-15",
    },
    {
      id: "task-9",
      title: "Create Onboarding Tutorial",
      description: "Design and implement an interactive onboarding tutorial for new users",
      priority: "HIGH",
      assignee: "Sarah Johnson",
      dueDate: "2025-04-14",
      tags: ["UX", "FRONTEND"],
      comments: 7,
      attachments: 4,
      createdBy: "Emma Wilson",
      createdAt: "2025-04-05",
      submittedAt: "2025-04-12",
      submissionNotes: "Completed the tutorial with 5 interactive steps. User testing showed positive results.",
      submissionFiles: ["onboarding-tutorial.zip", "user-testing-results.pdf"],
      qaStatus: "APPROVED",
      qaAssignee: "Michael Torres",
      completedAt: "2025-04-14",
    },
  ],
}

// Workflow steps
const workflowSteps = [
  { id: 1, name: "DATA_COLLECTION", status: "COMPLETED", time: "00:12:34", agent: "DATA_PROCESSOR" },
  { id: 2, name: "DATA_ANALYSIS", status: "COMPLETED", time: "00:08:17", agent: "DATA_PROCESSOR" },
  { id: 3, name: "CONTENT_GENERATION", status: "IN_PROGRESS", time: "00:05:22", agent: "CONTENT_CREATOR" },
  { id: 4, name: "REVIEW", status: "PENDING", time: "--:--:--", agent: "WORKFLOW_MANAGER" },
  { id: 5, name: "DEPLOYMENT", status: "PENDING", time: "--:--:--", agent: "WORKFLOW_MANAGER" },
]

// Weekly planner data
const weekDays = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"]
const timeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
  "20:00",
]

// Scheduled tasks for the planner
const scheduledTasks = [
  {
    id: "SCH-001",
    title: "DATA ANALYSIS",
    agent: "DATA_PROCESSOR",
    day: "MON",
    startTime: "09:00",
    endTime: "11:00",
    priority: "HIGH",
    status: "CONFIRMED",
    description: "Analyze quarterly sales data and generate insights report",
  },
  {
    id: "SCH-002",
    title: "CONTENT CREATION",
    agent: "CONTENT_CREATOR",
    day: "MON",
    startTime: "14:00",
    endTime: "16:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Create blog posts for the company website",
  },
  {
    id: "SCH-003",
    title: "CUSTOMER SUPPORT",
    agent: "SUPPORT_BOT",
    day: "TUE",
    startTime: "10:00",
    endTime: "12:00",
    priority: "LOW",
    status: "CONFIRMED",
    description: "Handle customer inquiries and support tickets",
  },
  {
    id: "SCH-004",
    title: "WORKFLOW OPTIMIZATION",
    agent: "WORKFLOW_MANAGER",
    day: "WED",
    startTime: "13:00",
    endTime: "15:00",
    priority: "HIGH",
    status: "PENDING",
    description: "Optimize existing workflows for better performance",
  },
  {
    id: "SCH-005",
    title: "DATABASE MAINTENANCE",
    agent: "DATA_PROCESSOR",
    day: "THU",
    startTime: "16:00",
    endTime: "18:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Perform routine database maintenance and optimization",
  },
  {
    id: "SCH-006",
    title: "SOCIAL MEDIA POSTS",
    agent: "CONTENT_CREATOR",
    day: "FRI",
    startTime: "11:00",
    endTime: "13:00",
    priority: "MEDIUM",
    status: "CONFIRMED",
    description: "Create and schedule social media content for the week",
  },
  {
    id: "SCH-007",
    title: "SYSTEM BACKUP",
    agent: "DATA_PROCESSOR",
    day: "SAT",
    startTime: "08:00",
    endTime: "09:00",
    priority: "HIGH",
    status: "CONFIRMED",
    description: "Perform full system backup and verification",
  },
]

// Agent availability data
const agentAvailability = {
  DATA_PROCESSOR: { available: true, nextAvailable: null },
  CONTENT_CREATOR: { available: true, nextAvailable: null },
  SUPPORT_BOT: { available: false, nextAvailable: "16:00 TODAY" },
  WORKFLOW_MANAGER: { available: true, nextAvailable: null },
}

// Terminal messages for animation
const terminalMessages = [
  "INITIALIZING AGENT NETWORK...",
  "CONNECTING TO NEURAL CORE...",
  "LOADING AGENT PROTOCOLS...",
  "ESTABLISHING SECURE CHANNELS...",
  "SYNCING WITH CLOUD NODES...",
  "OPTIMIZING NEURAL PATHWAYS...",
  "CALIBRATING RESPONSE ALGORITHMS...",
  "AGENT NETWORK ONLINE.",
]

// Navigation items
const navItems = [
  { id: "dashboard", label: "DASHBOARD", icon: Activity },
  { id: "team", label: "TEAM", icon: Users },
  { id: "kanban", label: "KANBAN", icon: Layers },
  { id: "workflows", label: "WORKFLOWS", icon: GitBranch },
  { id: "planner", label: "PLANNER", icon: Calendar },
  { id: "analytics", label: "ANALYTICS", icon: Database },
]

// Animated Terminal Component
const AnimatedTerminal = () => {
  const [messages, setMessages] = useState<string[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (currentIndex < terminalMessages.length) {
      const timer = setTimeout(() => {
        setMessages((prev) => [...prev, terminalMessages[currentIndex]])
        setCurrentIndex((prev) => prev + 1)

        // Scroll to bottom
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight
        }
      }, 800)

      return () => clearTimeout(timer)
    }
  }, [currentIndex])

  return (
    <div
      className="border border-[#333] bg-black rounded-md p-4 font-mono text-sm h-[200px] overflow-auto"
      ref={terminalRef}
    >
      <div className="flex items-center justify-between mb-2 text-xs text-gray-500">
        <span>GROQY_TERMINAL v1.0.4</span>
        <span className="flex items-center">
          <span className="inline-block w-2 h-2 rounded-full bg-[#e91e63] mr-1 animate-pulse"></span>
          CONNECTED
        </span>
      </div>
      <div className="space-y-1">
        {messages.map((msg, i) => (
          <div key={i} className="terminal-line">
            <span className="text-[#e91e63]">{">"}</span>
            <span className="text-green-500 mr-2"> SYSTEM:</span>
            <span className={i === messages.length - 1 ? "typing-animation" : ""}>{msg}</span>
          </div>
        ))}
        {currentIndex < terminalMessages.length && (
          <div className="h-4 flex items-center">
            <span className="text-[#e91e63] mr-2">{">"}</span>
            <span className="w-2 h-4 bg-[#e91e63] animate-blink"></span>
          </div>
        )}
      </div>
    </div>
  )
}

// Agent Status Card Component
const AgentStatusCard = ({ agent }: { agent: (typeof agentStatusData)[0] }) => {
  return (
    <div className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300 group">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center">
          <div
            className={`w-2 h-2 rounded-full ${agent.status === "ACTIVE" ? "bg-[#e91e63]" : "bg-gray-500"} ${agent.status === "ACTIVE" ? "animate-pulse" : ""} mr-2`}
          ></div>
          <h3 className="text-sm font-bold">{agent.name}</h3>
        </div>
        <span
          className={`text-xs px-2 py-1 rounded ${agent.status === "ACTIVE" ? "bg-[#e91e63]/20 text-[#e91e63]" : "bg-gray-800 text-gray-400"}`}
        >
          {agent.status}
        </span>
      </div>

      <div className="space-y-3">
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">CPU</span>
            <span>{agent.cpu}%</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${agent.status === "ACTIVE" ? "bg-[#e91e63]" : "bg-gray-600"} rounded-full transition-all duration-500 ease-in-out`}
              style={{ width: `${agent.cpu}%` }}
            ></div>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">MEMORY</span>
            <span>{agent.memory} MB</span>
          </div>
          <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
            <div
              className={`h-full ${agent.status === "ACTIVE" ? "bg-[#e91e63]" : "bg-gray-600"} rounded-full`}
              style={{ width: `${(agent.memory / 300) * 100}%` }}
            ></div>
          </div>
        </div>

        <div className="flex justify-between items-center pt-2 text-xs">
          <span className="text-gray-400">ACTIVE TASKS: {agent.tasks}</span>
          <button className="text-[#e91e63] hover:underline group-hover:scale-105 transition-transform">DETAILS</button>
        </div>
      </div>
    </div>
  )
}

// Workflow Visualization Component
const WorkflowVisualization = () => {
  return (
    <div className="border border-[#333] bg-black/60 rounded-md p-6 relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.1),transparent_70%)]"></div>

      <h3 className="text-xl uppercase font-bold mb-6 flex items-center relative z-10">
        <GitBranch className="mr-2 text-[#e91e63]" size={20} />
        ACTIVE WORKFLOW: <span className="text-[#e91e63] ml-2">CONTENT_PIPELINE_003</span>
      </h3>

      <div className="relative workflow-container">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex mb-8 relative">
            {/* Connector Line */}
            {index < workflowSteps.length - 1 && (
              <div className="absolute left-[15px] top-[30px] w-[1px] h-[calc(100%+8px)] bg-[#333] z-0">
                {step.status === "COMPLETED" && (
                  <div className="absolute left-0 top-0 w-full bg-[#e91e63] h-full data-flow-animation"></div>
                )}
              </div>
            )}

            {/* Step Circle */}
            <div
              className={`relative z-10 flex-shrink-0 w-[30px] h-[30px] rounded-full border ${
                step.status === "COMPLETED"
                  ? "border-[#e91e63] bg-[#e91e63]/20"
                  : step.status === "IN_PROGRESS"
                    ? "border-[#e91e63] bg-black animate-pulse"
                    : "border-[#333] bg-black"
              } flex items-center justify-center mr-4`}
            >
              {step.status === "COMPLETED" ? (
                <CheckCircle size={16} className="text-[#e91e63]" />
              ) : step.status === "IN_PROGRESS" ? (
                <Loader size={16} className="text-[#e91e63] animate-spin" />
              ) : (
                <Clock size={16} className="text-gray-500" />
              )}
            </div>

            {/* Step Content */}
            <div className="flex-1">
              <div className="flex flex-wrap justify-between items-start">
                <div>
                  <h4 className="text-sm font-bold">{step.name}</h4>
                  <p className="text-xs text-gray-400 mt-1">AGENT: {step.agent}</p>
                </div>
                <div className="flex items-center">
                  <span
                    className={`text-xs px-2 py-1 rounded mr-2 ${
                      step.status === "COMPLETED"
                        ? "bg-green-900/30 text-green-500"
                        : step.status === "IN_PROGRESS"
                          ? "bg-[#e91e63]/20 text-[#e91e63]"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {step.status}
                  </span>
                  <span className="text-xs text-gray-400">{step.time}</span>
                </div>
              </div>

              {/* Progress animation for in-progress step */}
              {step.status === "IN_PROGRESS" && (
                <div className="mt-2 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e91e63] rounded-full progress-animation"></div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Agent Network Visualization
const AgentNetworkVisualization = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      const parent = canvas.parentElement
      if (parent) {
        canvas.width = parent.clientWidth
        canvas.height = parent.clientHeight
      }
    }

    resizeCanvas()
    window.addEventListener("resize", resizeCanvas)

    // Node data
    const nodes = [
      { x: canvas.width * 0.5, y: canvas.height * 0.5, radius: 15, color: "#e91e63", pulse: true, label: "CORE" },
      { x: canvas.width * 0.3, y: canvas.height * 0.3, radius: 10, color: "#e91e63", pulse: true, label: "AGENT_1" },
      { x: canvas.width * 0.7, y: canvas.height * 0.3, radius: 10, color: "#e91e63", pulse: true, label: "AGENT_2" },
      { x: canvas.width * 0.3, y: canvas.height * 0.7, radius: 10, color: "#e91e63", pulse: true, label: "AGENT_3" },
      { x: canvas.width * 0.7, y: canvas.height * 0.7, radius: 10, color: "#e91e63", pulse: true, label: "AGENT_4" },
      { x: canvas.width * 0.2, y: canvas.height * 0.5, radius: 8, color: "#666", pulse: false, label: "NODE_1" },
      { x: canvas.width * 0.8, y: canvas.height * 0.5, radius: 8, color: "#666", pulse: false, label: "NODE_2" },
      { x: canvas.width * 0.5, y: canvas.height * 0.2, radius: 8, color: "#666", pulse: false, label: "NODE_3" },
      { x: canvas.width * 0.5, y: canvas.height * 0.8, radius: 8, color: "#666", pulse: false, label: "NODE_4" },
    ]

    // Connection data
    const connections = [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 },
      { from: 1, to: 5 },
      { from: 2, to: 7 },
      { from: 3, to: 8 },
      { from: 4, to: 6 },
    ]

    // Data packets for animation
    let packets: { fromNode: number; toNode: number; progress: number; speed: number; active: boolean }[] = []

    // Initialize packets
    const initPackets = () => {
      packets = connections.map((conn) => ({
        fromNode: conn.from,
        toNode: conn.to,
        progress: Math.random(),
        speed: 0.002 + Math.random() * 0.003,
        active: Math.random() > 0.3,
      }))
    }

    initPackets()

    // Animation variables
    let animationFrame: number
    let time = 0

    // Draw function
    const draw = () => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update time
      time += 0.01

      // Draw connections
      connections.forEach((conn, i) => {
        const fromNode = nodes[conn.from]
        const toNode = nodes[conn.to]

        ctx.beginPath()
        ctx.moveTo(fromNode.x, fromNode.y)
        ctx.lineTo(toNode.x, toNode.y)
        ctx.strokeStyle = "#333"
        ctx.lineWidth = 1
        ctx.stroke()
      })

      // Update and draw packets
      packets.forEach((packet) => {
        if (!packet.active) return

        packet.progress += packet.speed
        if (packet.progress >= 1) {
          packet.progress = 0
          packet.active = Math.random() > 0.3
        }

        const fromNode = nodes[packet.fromNode]
        const toNode = nodes[packet.toNode]

        const x = fromNode.x + (toNode.x - fromNode.x) * packet.progress
        const y = fromNode.y + (toNode.y - fromNode.y) * packet.progress

        ctx.beginPath()
        ctx.arc(x, y, 3, 0, Math.PI * 2)
        ctx.fillStyle = "#e91e63"
        ctx.fill()
      })

      // Draw nodes
      nodes.forEach((node) => {
        // Draw node
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2)
        ctx.fillStyle = node.color
        ctx.fill()

        // Draw pulse effect
        if (node.pulse) {
          const pulseSize = node.radius + 5 + Math.sin(time * 3) * 3
          ctx.beginPath()
          ctx.arc(node.x, node.y, pulseSize, 0, Math.PI * 2)
          ctx.strokeStyle = `${node.color}40`
          ctx.lineWidth = 2
          ctx.stroke()
        }

        // Draw label
        ctx.fillStyle = "#fff"
        ctx.font = "8px monospace"
        ctx.textAlign = "center"
        ctx.fillText(node.label, node.x, node.y + node.radius + 12)
      })

      // Continue animation
      animationFrame = requestAnimationFrame(draw)
    }

    // Start animation
    draw()

    // Cleanup
    return () => {
      window.removeEventListener("resize", resizeCanvas)
      cancelAnimationFrame(animationFrame)
    }
  }, [])

  return (
    <div className="border border-[#333] bg-black/60 rounded-md p-4 h-[300px] relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.05),transparent_70%)]"></div>
      <h3 className="text-xl uppercase font-bold mb-2 flex items-center relative z-10">
        <Bot className="mr-2 text-[#e91e63]" size={20} />
        AGENT NETWORK
      </h3>
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full"></canvas>
    </div>
  )
}

// Team Members Component
const TeamMembers = () => {
  const [selectedMember, setSelectedMember] = useState(null)
  const [showMemberModal, setShowMemberModal] = useState(false)
  const [filterType, setFilterType] = useState("ALL")

  const filteredMembers =
    filterType === "ALL" ? teamMembersData : teamMembersData.filter((member) => member.type === filterType)

  const handleMemberClick = (member) => {
    setSelectedMember(member)
    setShowMemberModal(true)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">HYBRID</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">TEAM</h2>
        <h2 className="text-3xl font-bold uppercase">MANAGEMENT</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={() => setFilterType("ALL")}
            className={`px-4 py-2 rounded-md text-sm ${filterType === "ALL" ? "bg-[#e91e63] text-white" : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"}`}
          >
            ALL
          </button>
          <button
            onClick={() => setFilterType("HUMAN")}
            className={`px-4 py-2 rounded-md text-sm ${filterType === "HUMAN" ? "bg-[#e91e63] text-white" : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"}`}
          >
            HUMANS
          </button>
          <button
            onClick={() => setFilterType("AI")}
            className={`px-4 py-2 rounded-md text-sm ${filterType === "AI" ? "bg-[#e91e63] text-white" : "border border-[#333] text-gray-400 hover:border-[#e91e63]/30"}`}
          >
            AI AGENTS
          </button>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
          <input
            type="text"
            placeholder="Search team members..."
            className="pl-10 pr-4 py-2 bg-black border border-[#333] rounded-md focus:outline-none focus:border-[#e91e63] text-sm w-64"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {filteredMembers.map((member) => (
          <div
            key={member.id}
            onClick={() => handleMemberClick(member)}
            className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
          >
            <div className="flex items-start space-x-3">
              {member.type === "HUMAN" ? (
                <div className="w-10 h-10 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                  <img
                    src={member.avatar || "/placeholder.svg"}
                    alt={member.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center flex-shrink-0">
                  <Bot size={20} className="text-[#e91e63]" />
                </div>
              )}

              <div className="flex-1">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-bold text-sm">{member.name}</h3>
                    <p className="text-xs text-gray-400">{member.role}</p>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${member.status === "ONLINE" ? "bg-green-500 animate-pulse" : "bg-gray-500"} mr-1`}
                    ></div>
                    <span className="text-xs text-gray-400">{member.status}</span>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">TASKS COMPLETED</span>
                      <span>{member.tasksCompleted}</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e63] rounded-full"
                        style={{ width: `${Math.min(100, (member.tasksCompleted / 200) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-gray-400">PERFORMANCE</span>
                      <span>{member.performance}%</span>
                    </div>
                    <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${member.performance}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex justify-between items-center text-xs">
                  <span className="text-gray-400">IN PROGRESS: {member.tasksInProgress}</span>
                  <span className="text-[#e91e63]">VIEW DETAILS</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team Performance Overview */}
      <div className="border border-[#333] bg-black/60 rounded-md p-6">
        <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
          <Activity className="mr-2 text-[#e91e63]" size={20} />
          TEAM PERFORMANCE
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <Award className="mr-2 text-[#e91e63]" size={16} />
              TOP PERFORMERS
            </h4>
            <div className="space-y-3">
              {teamMembersData
                .sort((a, b) => b.performance - a.performance)
                .slice(0, 3)
                .map((member, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center">
                      {i === 0 && <Star size={14} className="text-yellow-500 mr-1" />}
                      <span className="text-sm">{member.name}</span>
                    </div>
                    <span className="text-sm font-bold">{member.performance}%</span>
                  </div>
                ))}
            </div>
          </div>

          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <CheckCircle className="mr-2 text-[#e91e63]" size={16} />
              TASK COMPLETION
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">HUMANS</span>
                <span className="text-sm font-bold">
                  {teamMembersData.filter((m) => m.type === "HUMAN").reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">AI AGENTS</span>
                <span className="text-sm font-bold">
                  {teamMembersData.filter((m) => m.type === "AI").reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-[#333]">
                <span className="text-sm">TOTAL</span>
                <span className="text-sm font-bold">
                  {teamMembersData.reduce((sum, m) => sum + m.tasksCompleted, 0)}
                </span>
              </div>
            </div>
          </div>

          <div className="border border-[#333] bg-black/40 rounded-md p-4">
            <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
              <Users className="mr-2 text-[#e91e63]" size={16} />
              TEAM COMPOSITION
            </h4>
            <div className="flex items-center justify-center h-[100px]">
              <div className="relative w-[100px] h-[100px]">
                <div
                  className="absolute inset-0 rounded-full border-8 border-[#e91e63]"
                  style={{
                    clipPath: `inset(0 ${100 - (teamMembersData.filter((m) => m.type === "HUMAN").length / teamMembersData.length) * 100}% 0 0)`,
                  }}
                ></div>
                <div
                  className="absolute inset-0 rounded-full border-8 border-blue-500"
                  style={{
                    clipPath: `inset(0 0 0 ${(teamMembersData.filter((m) => m.type === "HUMAN").length / teamMembersData.length) * 100}%)`,
                  }}
                ></div>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                  <span className="text-xs text-gray-400">HUMAN / AI</span>
                  <span className="text-sm font-bold">
                    {teamMembersData.filter((m) => m.type === "HUMAN").length} /{" "}
                    {teamMembersData.filter((m) => m.type === "AI").length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Member Modal */}
      {showMemberModal && selectedMember && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowMemberModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <div className="flex items-start space-x-4 mb-6">
              {selectedMember.type === "HUMAN" ? (
                <div className="w-16 h-16 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                  <img
                    src={selectedMember.avatar || "/placeholder.svg"}
                    alt={selectedMember.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-16 h-16 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center flex-shrink-0">
                  <Bot size={32} className="text-[#e91e63]" />
                </div>
              )}

              <div>
                <h3 className="text-xl font-bold">{selectedMember.name}</h3>
                <p className="text-gray-400">{selectedMember.role}</p>
                <div className="flex items-center mt-2">
                  <div
                    className={`w-2 h-2 rounded-full ${selectedMember.status === "ONLINE" ? "bg-green-500 animate-pulse" : "bg-gray-500"} mr-1`}
                  ></div>
                  <span className="text-sm text-gray-400">{selectedMember.status}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
                  <Activity className="mr-2 text-[#e91e63]" size={16} />
                  PERFORMANCE METRICS
                </h4>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">TASKS COMPLETED</span>
                      <span>{selectedMember.tasksCompleted}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#e91e63] rounded-full"
                        style={{ width: `${Math.min(100, (selectedMember.tasksCompleted / 200) * 100)}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">PERFORMANCE RATING</span>
                      <span>{selectedMember.performance}%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-green-500 rounded-full"
                        style={{ width: `${selectedMember.performance}%` }}
                      ></div>
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-400">TASKS IN PROGRESS</span>
                      <span>{selectedMember.tasksInProgress}</span>
                    </div>
                    <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-yellow-500 rounded-full"
                        style={{ width: `${(selectedMember.tasksInProgress / 10) * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm uppercase font-bold mb-3 flex items-center">
                  <Clipboard className="mr-2 text-[#e91e63]" size={16} />
                  ACTIVE TASKS
                </h4>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                  {Array.from({ length: selectedMember.tasksInProgress }).map((_, i) => (
                    <div key={i} className="border border-[#333] bg-black/40 rounded-md p-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <h5 className="text-sm font-bold">Task #{i + 1}</h5>
                          <p className="text-xs text-gray-400">In progress</p>
                        </div>
                        <div className="flex items-center">
                          <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 mr-1"></div>
                          <span className="text-xs">MEDIUM</span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {selectedMember.tasksInProgress === 0 && (
                    <div className="text-center text-gray-400 text-sm py-4">No active tasks</div>
                  )}
                </div>
              </div>
            </div>

            <div className="border-t border-[#333] pt-4 flex justify-between">
              <button className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm">
                VIEW FULL PROFILE
              </button>
              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                ASSIGN NEW TASK
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Kanban Board Component
const KanbanBoard = () => {
  const [kanbanData, setKanbanData] = useState(initialKanbanData)
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [showSubmitModal, setShowSubmitModal] = useState(false)
  const [draggedTask, setDraggedTask] = useState(null)
  const [dragOverColumn, setDragOverColumn] = useState(null)

  // Handle drag start
  const handleDragStart = (e: DragEvent<HTMLDivElement>, task, column) => {
    setDraggedTask({ task, fromColumn: column })
  }

  // Handle drag over
  const handleDragOver = (e: DragEvent<HTMLDivElement>, column) => {
    e.preventDefault()
    setDragOverColumn(column)
  }

  // Handle drop
  const handleDrop = (e: DragEvent<HTMLDivElement>, column) => {
    e.preventDefault()

    if (!draggedTask) return

    // Remove from original column
    const updatedData = { ...kanbanData }
    updatedData[draggedTask.fromColumn] = updatedData[draggedTask.fromColumn].filter(
      (task) => task.id !== draggedTask.task.id,
    )

    // Add to new column
    updatedData[column] = [...updatedData[column], draggedTask.task]

    setKanbanData(updatedData)
    setDraggedTask(null)
    setDragOverColumn(null)
  }

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle submit task
  const handleSubmitTask = (task) => {
    setSelectedTask(task)
    setShowSubmitModal(true)
    setShowTaskModal(false)
  }

  // Handle new task
  const handleNewTask = () => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }

  // Get column title
  const getColumnTitle = (column) => {
    switch (column) {
      case "backlog":
        return "BACKLOG"
      case "inProgress":
        return "IN PROGRESS"
      case "review":
        return "REVIEW"
      case "qa":
        return "QA"
      case "done":
        return "DONE"
      default:
        return column.toUpperCase()
    }
  }

  // Get column icon
  const getColumnIcon = (column) => {
    switch (column) {
      case "backlog":
        return Clipboard
      case "inProgress":
        return Loader
      case "review":
        return Eye
      case "qa":
        return Shield
      case "done":
        return CheckCircle
      default:
        return FileText
    }
  }

  // Get priority color
  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH":
        return "bg-[#e91e63]"
      case "MEDIUM":
        return "bg-yellow-500"
      case "LOW":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">TASK</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">MANAGEMENT</h2>
        <h2 className="text-3xl font-bold uppercase">SYSTEM</h2>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button className="flex items-center space-x-1 px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm">
            <Filter size={14} />
            <span>FILTER</span>
          </button>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
            <input
              type="text"
              placeholder="Search tasks..."
              className="pl-10 pr-4 py-2 bg-black border border-[#333] rounded-md focus:outline-none focus:border-[#e91e63] text-sm w-64"
            />
          </div>
        </div>

        <button
          onClick={handleNewTask}
          className="bg-[#e91e63] text-white px-4 py-2 rounded-md text-sm flex items-center space-x-1"
        >
          <Plus size={16} />
          <span>NEW TASK</span>
        </button>
      </div>

      <div className="flex overflow-x-auto pb-4 space-x-4">
        {Object.keys(kanbanData).map((column) => {
          const ColumnIcon = getColumnIcon(column)

          return (
            <div
              key={column}
              className={`flex-shrink-0 w-80 flex flex-col h-[calc(100vh-300px)] min-h-[500px] border ${dragOverColumn === column ? "border-[#e91e63]" : "border-[#333]"} rounded-md bg-black/60`}
              onDragOver={(e) => handleDragOver(e, column)}
              onDrop={(e) => handleDrop(e, column)}
            >
              <div className="p-3 border-b border-[#333] flex items-center justify-between">
                <div className="flex items-center">
                  <ColumnIcon size={16} className="text-[#e91e63] mr-2" />
                  <h3 className="font-bold text-sm">{getColumnTitle(column)}</h3>
                </div>
                <div className="flex items-center justify-center w-6 h-6 rounded-full bg-[#333] text-xs">
                  {kanbanData[column].length}
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-3 space-y-3">
                {kanbanData[column].map((task) => (
                  <div
                    key={task.id}
                    className="border border-[#333] bg-black/40 rounded-md p-3 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                    draggable
                    onDragStart={(e) => handleDragStart(e, task, column)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-bold text-sm">{task.title}</h4>
                      <div className={`w-2 h-2 rounded-full ${getPriorityColor(task.priority)}`}></div>
                    </div>

                    <p className="text-xs text-gray-400 mb-3 line-clamp-2">{task.description}</p>

                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center">
                          <MessageSquare size={12} className="text-gray-400 mr-1" />
                          <span className="text-gray-400">{task.comments}</span>
                        </div>

                        <div className="flex items-center">
                          <Paperclip size={12} className="text-gray-400 mr-1" />
                          <span className="text-gray-400">{task.attachments}</span>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <Clock size={12} className="text-gray-400 mr-1" />
                        <span className="text-gray-400">{task.dueDate}</span>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#333] flex items-center justify-between">
                      <div className="text-xs text-gray-400">
                        Assigned to: <span className="text-white">{task.assignee}</span>
                      </div>

                      {column === "inProgress" && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleSubmitTask(task)
                          }}
                          className="text-xs text-[#e91e63] hover:underline"
                        >
                          SUBMIT
                        </button>
                      )}

                      {column === "qa" && task.qaStatus && (
                        <div className="flex items-center">
                          <div
                            className={`w-1.5 h-1.5 rounded-full ${task.qaStatus === "APPROVED" ? "bg-green-500" : "bg-yellow-500"} mr-1`}
                          ></div>
                          <span className="text-xs">{task.qaStatus}</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {kanbanData[column].length === 0 && (
                  <div className="h-full flex items-center justify-center border border-dashed border-[#333] rounded-md">
                    <p className="text-gray-500 text-sm">Drop tasks here</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <FileText className="mr-2 text-[#e91e63]" size={20} />
              {selectedTask ? "TASK DETAILS" : "CREATE NEW TASK"}
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-4 md:col-span-2">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">TITLE</label>
                  <input
                    type="text"
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    defaultValue={selectedTask?.title || ""}
                  />
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">DESCRIPTION</label>
                  <textarea
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                    defaultValue={selectedTask?.description || ""}
                  ></textarea>
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">ASSIGNEE</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.assignee || ""}
                >
                  {teamMembersData.map((member) => (
                    <option key={member.id} value={member.name}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">PRIORITY</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.priority || "MEDIUM"}
                >
                  <option value="HIGH">HIGH</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">DUE DATE</label>
                <input
                  type="date"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.dueDate || ""}
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1">TAGS</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  defaultValue={selectedTask?.tags?.join(", ") || ""}
                  placeholder="Separate with commas"
                />
              </div>
            </div>

            {selectedTask && (
              <div className="border-t border-[#333] pt-4 mb-6">
                <h4 className="text-sm uppercase font-bold mb-3">ACTIVITY</h4>
                <div className="space-y-3 max-h-[150px] overflow-y-auto pr-2">
                  <div className="flex items-start space-x-3">
                    <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                    <div>
                      <div className="flex items-center">
                        <span className="text-sm font-bold">Emma Wilson</span>
                        <span className="text-xs text-gray-400 ml-2">2 days ago</span>
                      </div>
                      <p className="text-sm text-gray-300">
                        Created this task and assigned it to {selectedTask.assignee}
                      </p>
                    </div>
                  </div>

                  {selectedTask.comments > 0 && (
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 rounded-full bg-[#333] flex-shrink-0"></div>
                      <div>
                        <div className="flex items-center">
                          <span className="text-sm font-bold">{selectedTask.assignee}</span>
                          <span className="text-xs text-gray-400 ml-2">1 day ago</span>
                        </div>
                        <p className="text-sm text-gray-300">
                          Added a comment: "Working on this now, should be done by tomorrow."
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowTaskModal(false)}
                className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
              >
                CANCEL
              </button>

              {selectedTask && selectedTask.id.includes("task-") && (
                <button
                  onClick={() => handleSubmitTask(selectedTask)}
                  className="px-4 py-2 border border-[#e91e63] text-[#e91e63] rounded-md hover:bg-[#e91e63] hover:text-white transition-colors text-sm"
                >
                  SUBMIT FOR REVIEW
                </button>
              )}

              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                {selectedTask ? "UPDATE TASK" : "CREATE TASK"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Task Modal */}
      {showSubmitModal && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowSubmitModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <Upload className="mr-2 text-[#e91e63]" size={20} />
              SUBMIT TASK FOR REVIEW
            </h3>

            <div className="mb-6">
              <div className="border border-[#333] rounded-md p-4 mb-4">
                <h4 className="text-sm font-bold mb-1">{selectedTask.title}</h4>
                <p className="text-xs text-gray-400">{selectedTask.description}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">SUBMISSION NOTES</label>
                  <textarea
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                    placeholder="Describe what you've done and any notes for the reviewer..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-xs text-gray-400 mb-1">UPLOAD FILES</label>
                  <div className="border border-dashed border-[#333] rounded-md p-8 text-center">
                    <Upload size={24} className="text-gray-500 mx-auto mb-2" />
                    <p className="text-sm text-gray-400 mb-2">Drag and drop files here or click to browse</p>
                    <button className="px-4 py-1 border border-[#333] rounded-md text-xs hover:border-[#e91e63] transition-colors">
                      BROWSE FILES
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowSubmitModal(false)}
                className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
              >
                CANCEL
              </button>
              <button className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors text-sm">
                SUBMIT FOR REVIEW
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Weekly Planner Component
const WeeklyPlanner = () => {
  const [selectedWeek, setSelectedWeek] = useState("CURRENT WEEK")
  const [showTaskModal, setShowTaskModal] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [newTask, setNewTask] = useState({
    title: "",
    agent: "DATA_PROCESSOR",
    day: "MON",
    startTime: "09:00",
    endTime: "10:00",
    priority: "MEDIUM",
    description: "",
  })

  // Get time slot index
  const getTimeSlotIndex = (time) => {
    return timeSlots.findIndex((slot) => slot === time)
  }

  // Calculate task height based on duration
  const getTaskHeight = (startTime, endTime) => {
    const startIndex = getTimeSlotIndex(startTime)
    const endIndex = getTimeSlotIndex(endTime)
    return (endIndex - startIndex) * 60 // 60px per hour
  }

  // Get color based on agent
  const getAgentColor = (agent) => {
    switch (agent) {
      case "DATA_PROCESSOR":
        return "border-blue-500 bg-blue-500/20"
      case "CONTENT_CREATOR":
        return "border-green-500 bg-green-500/20"
      case "SUPPORT_BOT":
        return "border-yellow-500 bg-yellow-500/20"
      case "WORKFLOW_MANAGER":
        return "border-purple-500 bg-purple-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  // Get icon based on agent
  const getAgentIcon = (agent) => {
    switch (agent) {
      case "DATA_PROCESSOR":
        return Database
      case "CONTENT_CREATOR":
        return FileText
      case "SUPPORT_BOT":
        return User
      case "WORKFLOW_MANAGER":
        return GitBranch
      default:
        return Bot
    }
  }

  // Handle task click
  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setShowTaskModal(true)
  }

  // Handle new task
  const handleNewTask = () => {
    setSelectedTask(null)
    setShowTaskModal(true)
  }

  // Handle save task
  const handleSaveTask = () => {
    // In a real app, this would save to a database
    console.log("Saving task:", selectedTask ? selectedTask : newTask)
    setShowTaskModal(false)
  }

  // Handle week navigation
  const changeWeek = (direction) => {
    if (direction === "prev") {
      setSelectedWeek("PREVIOUS WEEK")
    } else if (direction === "next") {
      setSelectedWeek("NEXT WEEK")
    } else {
      setSelectedWeek("CURRENT WEEK")
    }
  }

  return (
    <div className="space-y-6">
      {/* Week selector */}
      <div className="flex justify-between items-center">
        <div className="flex flex-col space-y-1">
          <h2 className="text-3xl font-bold uppercase">AGENT</h2>
          <h2 className="text-3xl font-bold uppercase text-[#e91e63]">SCHEDULER</h2>
        </div>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => changeWeek("prev")}
            className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
          >
            <ChevronLeft size={20} />
          </button>
          <div className="relative">
            <button className="px-4 py-2 border border-[#333] rounded-md flex items-center space-x-2 hover:border-[#e91e63] transition-colors">
              <span>{selectedWeek}</span>
              <ChevronDown size={16} />
            </button>
          </div>
          <button
            onClick={() => changeWeek("next")}
            className="p-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      </div>

      {/* Agent availability */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {Object.entries(agentAvailability).map(([agent, status]) => (
          <div
            key={agent}
            className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center">
                <div
                  className={`w-2 h-2 rounded-full ${status.available ? "bg-green-500 animate-pulse" : "bg-yellow-500"} mr-2`}
                ></div>
                <h3 className="text-sm font-bold">{agent}</h3>
              </div>
              <span
                className={`text-xs px-2 py-1 rounded ${status.available ? "bg-green-900/30 text-green-500" : "bg-yellow-900/30 text-yellow-500"}`}
              >
                {status.available ? "AVAILABLE" : "BUSY"}
              </span>
            </div>
            {!status.available && <p className="text-xs text-gray-400">NEXT AVAILABLE: {status.nextAvailable}</p>}
          </div>
        ))}
      </div>

      {/* Weekly schedule */}
      <div className="border border-[#333] bg-black/60 rounded-md p-6 overflow-hidden">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl uppercase font-bold flex items-center">
            <Calendar className="mr-2 text-[#e91e63]" size={20} />
            WEEKLY SCHEDULE
          </h3>
          <button
            onClick={handleNewTask}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-full text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" /> SCHEDULE TASK
          </button>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            {/* Day headers */}
            <div className="grid grid-cols-8 border-b border-[#333]">
              <div className="p-3 text-center text-xs text-gray-400">TIME</div>
              {weekDays.map((day) => (
                <div key={day} className="p-3 text-center font-bold">
                  {day}
                </div>
              ))}
            </div>

            {/* Time slots */}
            <div className="relative">
              {timeSlots.map((time, i) => (
                <div key={time} className="grid grid-cols-8 border-b border-[#333]">
                  <div className="p-3 text-center text-xs text-gray-400 border-r border-[#333]">{time}</div>
                  {weekDays.map((day) => (
                    <div key={`${day}-${time}`} className="h-[60px] border-r border-[#333] relative"></div>
                  ))}
                </div>
              ))}

              {/* Scheduled tasks */}
              {scheduledTasks.map((task) => {
                const dayIndex = weekDays.indexOf(task.day) + 1 // +1 because first column is time
                const startIndex = getTimeSlotIndex(task.startTime)
                const taskHeight = getTaskHeight(task.startTime, task.endTime)
                const AgentIcon = getAgentIcon(task.agent)

                return (
                  <div
                    key={task.id}
                    onClick={() => handleTaskClick(task)}
                    className={`absolute border-l-4 ${getAgentColor(task.agent)} hover:border-[#e91e63] p-2 rounded-r-md cursor-pointer transition-colors overflow-hidden`}
                    style={{
                      left: `calc(${dayIndex} * 12.5%)`,
                      top: `${startIndex * 60 + 37}px`, // 37px is to account for the header
                      width: "calc(12.5% - 8px)",
                      height: `${taskHeight}px`,
                    }}
                  >
                    <div className="flex items-start mb-1">
                      <div
                        className={`w-2 h-2 rounded-full mt-1 ${task.priority === "HIGH" ? "bg-[#e91e63]" : task.priority === "MEDIUM" ? "bg-yellow-500" : "bg-green-500"} mr-1`}
                      ></div>
                      <h4 className="text-xs font-bold truncate">{task.title}</h4>
                    </div>
                    <div className="flex items-center text-xs text-gray-400">
                      <AgentIcon size={10} className="mr-1" />
                      <span className="truncate">{task.agent}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {task.startTime} - {task.endTime}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Task Modal */}
      {showTaskModal && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-md p-6 relative animate-fadeIn">
            <button
              onClick={() => setShowTaskModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>

            <h3 className="text-xl uppercase font-bold mb-6 flex items-center">
              <Calendar className="mr-2 text-[#e91e63]" size={20} />
              {selectedTask ? "TASK DETAILS" : "SCHEDULE NEW TASK"}
            </h3>

            <div className="space-y-4">
              {/* Task Title */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">TASK TITLE</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  value={selectedTask ? selectedTask.title : newTask.title}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, title: e.target.value })
                      : setNewTask({ ...newTask, title: e.target.value })
                  }
                />
              </div>

              {/* Agent Selection */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">ASSIGN AGENT</label>
                <select
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  value={selectedTask ? selectedTask.agent : newTask.agent}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, agent: e.target.value })
                      : setNewTask({ ...newTask, agent: e.target.value })
                  }
                >
                  <option value="DATA_PROCESSOR">DATA_PROCESSOR</option>
                  <option value="CONTENT_CREATOR">CONTENT_CREATOR</option>
                  <option value="SUPPORT_BOT">SUPPORT_BOT</option>
                  <option value="WORKFLOW_MANAGER">WORKFLOW_MANAGER</option>
                </select>
              </div>

              {/* Day and Time */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">DAY</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.day : newTask.day}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, day: e.target.value })
                        : setNewTask({ ...newTask, day: e.target.value })
                    }
                  >
                    {weekDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">PRIORITY</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.priority : newTask.priority}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, priority: e.target.value })
                        : setNewTask({ ...newTask, priority: e.target.value })
                    }
                  >
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>
              </div>

              {/* Time Range */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">START TIME</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.startTime : newTask.startTime}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, startTime: e.target.value })
                        : setNewTask({ ...newTask, startTime: e.target.value })
                    }
                  >
                    {timeSlots.slice(0, -1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">END TIME</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask ? selectedTask.endTime : newTask.endTime}
                    onChange={(e) =>
                      selectedTask
                        ? setSelectedTask({ ...selectedTask, endTime: e.target.value })
                        : setNewTask({ ...newTask, endTime: e.target.value })
                    }
                  >
                    {timeSlots.slice(1).map((time) => (
                      <option key={time} value={time}>
                        {time}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="block text-xs text-gray-400 mb-1">DESCRIPTION</label>
                <textarea
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-20"
                  value={selectedTask ? selectedTask.description : newTask.description}
                  onChange={(e) =>
                    selectedTask
                      ? setSelectedTask({ ...selectedTask, description: e.target.value })
                      : setNewTask({ ...newTask, description: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Status (for existing tasks) */}
              {selectedTask && (
                <div>
                  <label className="block text-xs text-gray-400 mb-1">STATUS</label>
                  <select
                    className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                    value={selectedTask.status}
                    onChange={(e) => setSelectedTask({ ...selectedTask, status: e.target.value })}
                  >
                    <option value="CONFIRMED">CONFIRMED</option>
                    <option value="PENDING">PENDING</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>
                </div>
              )}

              {/* Conflict Warning */}
              {selectedTask && selectedTask.status === "PENDING" && (
                <div className="flex items-start p-3 bg-yellow-900/20 border border-yellow-900 rounded-md">
                  <AlertCircle size={16} className="text-yellow-500 mr-2 mt-0.5" />
                  <div className="text-xs">
                    <p className="font-bold text-yellow-500">SCHEDULING CONFLICT</p>
                    <p className="text-gray-400">
                      This agent is already scheduled during this time slot. Confirm to override existing task.
                    </p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 pt-2">
                <button
                  onClick={() => setShowTaskModal(false)}
                  className="px-4 py-2 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors"
                >
                  CANCEL
                </button>
                <button
                  onClick={handleSaveTask}
                  className="px-4 py-2 bg-[#e91e63] rounded-md hover:bg-[#d81b60] transition-colors"
                >
                  {selectedTask ? "UPDATE TASK" : "SCHEDULE TASK"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Agent Task Load */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
            <Bot className="mr-2 text-[#e91e63]" size={20} />
            AGENT TASK LOAD
          </h3>
          <div className="space-y-6">
            {Object.keys(agentAvailability).map((agent) => {
              const taskCount = scheduledTasks.filter((task) => task.agent === agent).length
              const maxTasks =
                agent === "DATA_PROCESSOR" ? 10 : agent === "CONTENT_CREATOR" ? 8 : agent === "SUPPORT_BOT" ? 12 : 6
              const percentage = (taskCount / maxTasks) * 100

              return (
                <div key={agent}>
                  <div className="flex justify-between text-xs mb-1">
                    <span>{agent}</span>
                    <span>
                      {taskCount}/{maxTasks} TASKS
                    </span>
                  </div>
                  <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full ${percentage > 80 ? "bg-[#e91e63]" : percentage > 50 ? "bg-yellow-500" : "bg-green-500"}`}
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        <div className="border border-[#333] bg-black/60 rounded-md p-6">
          <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
            <Zap className="mr-2 text-[#e91e63]" size={20} />
            QUICK ACTIONS
          </h3>
          <div className="grid grid-cols-1 gap-3">
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <Calendar className="mr-2 text-[#e91e63]" size={16} />
                AUTO-SCHEDULE ALL PENDING TASKS
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <Bot className="mr-2 text-[#e91e63]" size={16} />
                OPTIMIZE AGENT WORKLOAD
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <GitBranch className="mr-2 text-[#e91e63]" size={16} />
                GENERATE WORKFLOW FROM SCHEDULE
              </span>
              <ChevronRight size={16} />
            </button>
            <button className="flex items-center justify-between p-3 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors">
              <span className="flex items-center">
                <FileText className="mr-2 text-[#e91e63]" size={16} />
                EXPORT SCHEDULE
              </span>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// Dashboard Component
const Dashboard = () => {
  const [activeView, setActiveView] = useState("dashboard")
  const [menuOpen, setMenuOpen] = useState(false)
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  // Simulated real-time data updates
  const [agentData, setAgentData] = useState(agentStatusData)

  useEffect(() => {
    const interval = setInterval(() => {
      setAgentData((prev) =>
        prev.map((agent) => ({
          ...agent,
          cpu:
            agent.status === "ACTIVE"
              ? Math.min(95, Math.max(5, agent.cpu + (Math.random() > 0.5 ? 1 : -1) * Math.floor(Math.random() * 5)))
              : agent.cpu,
        })),
      )
    }, 2000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-black text-white min-h-screen font-mono relative overflow-hidden flex">
      {/* Sidebar */}
      <div
        className={`fixed top-0 bottom-0 left-0 w-64 bg-black border-r border-[#333] z-20 transition-all duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="p-4 border-b border-[#333] flex items-center justify-between">
          <h1 className="text-xl font-bold text-[#e91e63] glitch-text" data-text="GROQY">
            GROQY
          </h1>
          <button onClick={() => setSidebarOpen(false)} className="text-gray-400 hover:text-white">
            <PanelLeft size={18} />
          </button>
        </div>

        <div className="p-4">
          <nav className="space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveView(item.id)}
                className={`w-full flex items-center space-x-3 p-2 rounded-md ${
                  activeView === item.id
                    ? "bg-[#e91e63]/20 text-[#e91e63]"
                    : "text-gray-400 hover:bg-[#333]/30 hover:text-white"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="mt-8 pt-4 border-t border-[#333]">
            <h3 className="text-xs text-gray-500 mb-2">TEAM MEMBERS</h3>
            <div className="space-y-2">
              {teamMembersData.slice(0, 4).map((member) => (
                <div key={member.id} className="flex items-center space-x-2 p-2 rounded-md hover:bg-[#333]/30">
                  {member.type === "HUMAN" ? (
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-[#333] flex-shrink-0">
                      <img
                        src={member.avatar || "/placeholder.svg"}
                        alt={member.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-6 h-6 rounded-full bg-[#e91e63]/20 border border-[#e91e63] flex items-center justify-center flex-shrink-0">
                      <Bot size={12} className="text-[#e91e63]" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm truncate">{member.name}</p>
                  </div>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${member.status === "ONLINE" ? "bg-green-500" : "bg-gray-500"}`}
                  ></div>
                </div>
              ))}
              <button className="text-xs text-[#e91e63] hover:underline mt-2">View All Members</button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "ml-64" : "ml-0"}`}>
        {/* Grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.05)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none"></div>

        {/* Large watermark text */}
        <div className="absolute right-0 top-0 bottom-0 text-[20vw] font-bold text-white/[0.02] pointer-events-none flex items-center">
          GROQY
        </div>

        {/* Content wrapper */}
        <div className="relative z-10 max-w-7xl mx-auto px-4">
          {/* Header */}
          <header className="py-4 flex justify-between items-center border-b border-[#333]">
            {!sidebarOpen && (
              <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white mr-4">
                <PanelRight size={20} />
              </button>
            )}

            <div className="flex-1 flex justify-between items-center">
              <div className="flex items-center">
                {activeView === "dashboard" && <h2 className="text-lg font-bold">Command Center</h2>}
                {activeView === "team" && <h2 className="text-lg font-bold">Team Management</h2>}
                {activeView === "kanban" && <h2 className="text-lg font-bold">Task Management</h2>}
                {activeView === "workflows" && <h2 className="text-lg font-bold">Workflows</h2>}
                {activeView === "planner" && <h2 className="text-lg font-bold">Scheduler</h2>}
                {activeView === "analytics" && <h2 className="text-lg font-bold">Analytics</h2>}
              </div>

              {/* Auth buttons */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center text-xs text-[#e91e63]">
                  <span className="inline-block w-2 h-2 rounded-full bg-[#e91e63] mr-1 animate-pulse"></span>
                  SYSTEM ONLINE
                </div>
                <button className="uppercase text-sm font-medium bg-[#e91e63] px-4 py-2 rounded-full hover:bg-[#d81b60] transition-colors">
                  DEPLOY AGENT
                </button>
              </div>
            </div>

            {/* Mobile menu button */}
            <button className="md:hidden p-2" onClick={() => setMenuOpen(!menuOpen)}>
              <Menu size={24} className="text-white" />
            </button>
          </header>

          {/* Mobile menu */}
          {menuOpen && (
            <div className="md:hidden absolute z-50 top-20 left-0 right-0 bg-black border-y border-[#333] py-4">
              <nav className="flex flex-col space-y-4 px-4">
                {navItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveView(item.id)
                      setMenuOpen(false)
                    }}
                    className={`uppercase text-sm font-medium flex items-center ${
                      activeView === item.id ? "text-[#e91e63]" : "text-gray-400"
                    }`}
                  >
                    <item.icon size={16} className="mr-2" />
                    {item.label}
                  </button>
                ))}
              </nav>
            </div>
          )}

          {/* Main Content */}
          <main className="py-6">
            {/* Dashboard View */}
            {activeView === "dashboard" && (
              <div className="space-y-6">
                {/* Dashboard Header */}
                <div className="flex flex-col space-y-1">
                  <h2 className="text-3xl font-bold uppercase">AGENT</h2>
                  <h2 className="text-3xl font-bold uppercase text-[#e91e63]">COMMAND</h2>
                  <h2 className="text-3xl font-bold uppercase">CENTER</h2>
                </div>

                {/* System Status */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {[
                    { label: "AGENTS ACTIVE", value: "4/6", icon: Bot, color: "text-[#e91e63]" },
                    { label: "WORKFLOWS", value: "3", icon: GitBranch, color: "text-[#e91e63]" },
                    { label: "TASKS COMPLETED", value: "28", icon: CheckCircle, color: "text-green-500" },
                    { label: "SYSTEM LOAD", value: "42%", icon: Activity, color: "text-[#e91e63]" },
                  ].map((stat, i) => (
                    <div
                      key={i}
                      className="border border-[#333] bg-black/60 rounded-md p-4 hover:border-[#e91e63]/30 transition-all duration-300"
                    >
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-400 uppercase">{stat.label}</p>
                          <p className="text-2xl font-bold mt-1">{stat.value}</p>
                        </div>
                        <div className="w-12 h-12 bg-black border border-[#333] rounded-md flex items-center justify-center">
                          <stat.icon size={24} className={stat.color} />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Active Workflow */}
                <WorkflowVisualization />
              </div>
            )}

            {/* Team View */}
            {activeView === "team" && <TeamMembers />}

            {/* Kanban View */}
            {activeView === "kanban" && <KanbanBoard />}

            {/* Workflows View */}
            {activeView === "workflows" && (
              <div className="space-y-6">
                <div className="flex flex-col space-y-1">
                  <h2 className="text-3xl font-bold uppercase">AUTOMATE</h2>
                  <h2 className="text-3xl font-bold uppercase text-[#e91e63]">WORKFLOWS</h2>
                </div>

                <WorkflowVisualization />

                <div className="border border-[#333] bg-black/60 rounded-md p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl uppercase font-bold flex items-center">
                      <GitBranch className="mr-2 text-[#e91e63]" size={20} />
                      WORKFLOW TEMPLATES
                    </h3>
                    <button className="bg-[#e91e63] text-white px-4 py-2 rounded-full text-sm flex items-center">
                      <Plus size={16} className="mr-1" /> CREATE WORKFLOW
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                      {
                        name: "CONTENT_PIPELINE",
                        description: "Generate, review, and publish content automatically.",
                        agents: ["DATA_PROCESSOR", "CONTENT_CREATOR", "WORKFLOW_MANAGER"],
                        steps: 5,
                      },
                      {
                        name: "CUSTOMER_SUPPORT",
                        description: "Handle customer inquiries and escalate when necessary.",
                        agents: ["SUPPORT_BOT", "WORKFLOW_MANAGER"],
                        steps: 3,
                      },
                      {
                        name: "DATA_ANALYSIS",
                        description: "Collect, process, and visualize data from multiple sources.",
                        agents: ["DATA_PROCESSOR", "WORKFLOW_MANAGER"],
                        steps: 4,
                      },
                    ].map((workflow, i) => (
                      <div
                        key={i}
                        className="border border-[#333] bg-black/40 rounded-md p-6 hover:border-[#e91e63]/30 transition-all duration-300"
                      >
                        <h3 className="text-lg uppercase font-bold mb-2">{workflow.name}</h3>
                        <p className="text-gray-400 mb-4 text-sm">{workflow.description}</p>
                        <div className="mb-4">
                          <h4 className="text-xs uppercase text-gray-500 mb-2">AGENTS REQUIRED</h4>
                          <div className="flex flex-wrap gap-2">
                            {workflow.agents.map((agent, j) => (
                              <span key={j} className="text-xs bg-black px-2 py-1 rounded border border-[#333]">
                                {agent}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-gray-400">{workflow.steps} STEPS</span>
                          <button className="text-[#e91e63] text-sm flex items-center hover:underline">
                            DEPLOY <ChevronRight size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Planner View */}
            {activeView === "planner" && <WeeklyPlanner />}

            {/* Analytics View */}
            {activeView === "analytics" && (
              <div className="space-y-6">
                <div className="flex flex-col space-y-1">
                  <h2 className="text-3xl font-bold uppercase">SYSTEM</h2>
                  <h2 className="text-3xl font-bold uppercase text-[#e91e63]">ANALYTICS</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border border-[#333] bg-black/60 rounded-md p-6">
                    <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
                      <Activity className="mr-2 text-[#e91e63]" size={20} />
                      PERFORMANCE METRICS
                    </h3>
                    <div className="p-4 rounded-md border border-[#333] bg-black/40">
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={data}>
                          <XAxis
                            dataKey="name"
                            stroke="#666"
                            tick={{ fill: "#999" }}
                            axisLine={{ stroke: "#333" }}
                            tickLine={{ stroke: "#333" }}
                          />
                          <YAxis
                            stroke="#666"
                            tick={{ fill: "#999" }}
                            axisLine={{ stroke: "#333" }}
                            tickLine={{ stroke: "#333" }}
                          />
                          <Tooltip
                            contentStyle={{
                              backgroundColor: "rgba(0, 0, 0, 0.8)",
                              border: "1px solid #333",
                              borderRadius: "4px",
                            }}
                          />
                          <Line
                            type="monotone"
                            dataKey="tasks"
                            stroke="#e91e63"
                            strokeWidth={2}
                            dot={{ fill: "#e91e63", strokeWidth: 0 }}
                            activeDot={{ fill: "#e91e63", stroke: "#000", strokeWidth: 2, r: 6 }}
                          />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="border border-[#333] bg-black/60 rounded-md p-6">
                    <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
                      <Database className="mr-2 text-[#e91e63]" size={20} />
                      RESOURCE USAGE
                    </h3>
                    <div className="space-y-6">
                      {[
                        { label: "CPU UTILIZATION", value: 42, max: 100, unit: "%" },
                        { label: "MEMORY USAGE", value: 3.2, max: 8, unit: "GB" },
                        { label: "NETWORK BANDWIDTH", value: 120, max: 1000, unit: "Mbps" },
                        { label: "STORAGE", value: 256, max: 1000, unit: "GB" },
                      ].map((resource, i) => (
                        <div key={i}>
                          <div className="flex justify-between text-xs mb-1">
                            <span className="text-gray-400">{resource.label}</span>
                            <span>
                              {resource.value} {resource.unit}
                            </span>
                          </div>
                          <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-[#e91e63] rounded-full"
                              style={{ width: `${(resource.value / resource.max) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="border border-[#333] bg-black/60 rounded-md p-6">
                  <h3 className="text-xl uppercase font-bold mb-4 flex items-center">
                    <Bot className="mr-2 text-[#e91e63]" size={20} />
                    AGENT PERFORMANCE
                  </h3>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#333]">
                          <th className="text-left py-2 px-4">AGENT</th>
                          <th className="text-left py-2 px-4">TASKS COMPLETED</th>
                          <th className="text-left py-2 px-4">SUCCESS RATE</th>
                          <th className="text-left py-2 px-4">AVG. RESPONSE TIME</th>
                          <th className="text-left py-2 px-4">UPTIME</th>
                        </tr>
                      </thead>
                      <tbody>
                        {[
                          { name: "DATA_PROCESSOR", tasks: 145, rate: 98, time: "1.2s", uptime: "99.8%" },
                          { name: "CONTENT_CREATOR", tasks: 87, rate: 92, time: "2.5s", uptime: "99.5%" },
                          { name: "SUPPORT_BOT", tasks: 203, rate: 95, time: "0.8s", uptime: "99.9%" },
                          { name: "WORKFLOW_MANAGER", tasks: 56, rate: 99, time: "1.5s", uptime: "100%" },
                        ].map((agent, i) => (
                          <tr key={i} className="border-b border-[#333] hover:bg-black/40">
                            <td className="py-3 px-4">{agent.name}</td>
                            <td className="py-3 px-4">{agent.tasks}</td>
                            <td className="py-3 px-4">{agent.rate}%</td>
                            <td className="py-3 px-4">{agent.time}</td>
                            <td className="py-3 px-4">{agent.uptime}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>

      {/* CSS for animations and styling */}
      <style jsx global>{`
        /* Glitch text effect */
        .glitch-text {
          position: relative;
          display: inline-block;
        }
        
        .glitch-text::before,
        .glitch-text::after {
          content: attr(data-text);
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          clip: rect(0, 0, 0, 0);
        }
        
        .glitch-text::before {
          left: 2px;
          text-shadow: -1px 0 #e91e63;
          animation: glitch-anim 2s infinite linear alternate-reverse;
        }
        
        .glitch-text::after {
          left: -2px;
          text-shadow: 1px 0 #e91e63;
          animation: glitch-anim2 3s infinite linear alternate-reverse;
        }
        
        @keyframes glitch-anim {
          0% {
            clip: rect(24px, 550px, 90px, 0);
          }
          20% {
            clip: rect(42px, 550px, 73px, 0);
          }
          40% {
            clip: rect(17px, 550px, 54px, 0);
          }
          60% {
            clip: rect(62px, 550px, 78px, 0);
          }
          80% {
            clip: rect(15px, 550px, 34px, 0);
          }
          100% {
            clip: rect(32px, 550px, 26px, 0);
          }
        }
        
        @keyframes glitch-anim2 {
          0% {
            clip: rect(32px, 550px, 26px, 0);
          }
          20% {
            clip: rect(15px, 550px, 34px, 0);
          }
          40% {
            clip: rect(62px, 550px, 78px, 0);
          }
          60% {
            clip: rect(17px, 550px, 54px, 0);
          }
          80% {
            clip: rect(42px, 550px, 73px, 0);
          }
          100% {
            clip: rect(24px, 550px, 90px, 0);
          }
        }
        
        /* Terminal typing animation */
        .typing-animation {
          overflow: hidden;
          border-right: 2px solid #e91e63;
          white-space: nowrap;
          animation: typing 3s steps(40, end), blink-caret 0.75s step-end infinite;
        }
        
        @keyframes typing {
          from { width: 0 }
          to { width: 100% }
        }
        
        @keyframes blink-caret {
          from, to { border-color: transparent }
          50% { border-color: #e91e63 }
        }
        
        /* Blinking cursor */
        .animate-blink {
          animation: blink 1s step-end infinite;
        }
        
        @keyframes blink {
          from, to { opacity: 1 }
          50% { opacity: 0 }
        }
        
        /* Progress animation */
        .progress-animation {
          animation: progress 3s infinite;
          width: 0%;
        }
        
        @keyframes progress {
          0% { width: 0% }
          50% { width: 70% }
          100% { width: 0% }
        }
        
        /* Data flow animation */
        .data-flow-animation {
          animation: dataFlow 2s infinite;
          height: 0%;
        }
        
        @keyframes dataFlow {
          0% { height: 0% }
          100% { height: 100% }
        }

        /* Fade In Animation */
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(-10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}

export default Dashboard

function CyberpunkDashboard() {
  return (
    <AgencyProvider>
      <Dashboard />
    </AgencyProvider>
  )
}

"use client"
import { useState, useRef, useEffect } from "react"
import type React from "react"

import { Bot, ArrowRight, Plus, X, Settings, Play, Pause, RefreshCw, Zap, FileText, Check } from "lucide-react"

// Agent types
type AgentStatus = "idle" | "processing" | "error" | "offline"
type AgentType = "processor" | "analyzer" | "creator" | "reviewer" | "deployer"
type NodeType = "input" | "output" | "process" | "decision" | "storage"

interface Agent {
  id: string
  name: string
  type: AgentType
  status: AgentStatus
  description: string
  capabilities: string[]
  processingSpeed: number // tasks per minute
  accuracy: number // percentage
  currentLoad: number // percentage
  connectedNodes: string[]
}

interface Node {
  id: string
  name: string
  type: NodeType
  description: string
  connectedTo: string[]
  position: { x: number; y: number }
}

interface Connection {
  id: string
  from: string
  to: string
  label?: string
}

interface Task {
  id: string
  title: string
  status: "pending" | "processing" | "completed" | "failed"
  assignedTo?: string
  currentNode?: string
  path: string[]
}

// Sample data
const sampleAgents: Agent[] = [
  {
    id: "agent-001",
    name: "DataBot",
    type: "processor",
    status: "idle",
    description: "Processes and cleans raw data inputs",
    capabilities: ["Data cleaning", "Format conversion", "Validation"],
    processingSpeed: 12,
    accuracy: 99.2,
    currentLoad: 15,
    connectedNodes: ["node-001", "node-002"],
  },
  {
    id: "agent-002",
    name: "AnalyzerAI",
    type: "analyzer",
    status: "processing",
    description: "Analyzes data and extracts insights",
    capabilities: ["Pattern recognition", "Statistical analysis", "Trend identification"],
    processingSpeed: 8,
    accuracy: 97.5,
    currentLoad: 65,
    connectedNodes: ["node-002", "node-003"],
  },
  {
    id: "agent-003",
    name: "ContentCreator",
    type: "creator",
    status: "idle",
    description: "Creates content based on analyzed data",
    capabilities: ["Text generation", "Image creation", "Template application"],
    processingSpeed: 5,
    accuracy: 92.8,
    currentLoad: 30,
    connectedNodes: ["node-003", "node-004"],
  },
  {
    id: "agent-004",
    name: "QualityChecker",
    type: "reviewer",
    status: "idle",
    description: "Reviews and validates created content",
    capabilities: ["Quality assessment", "Error detection", "Improvement suggestions"],
    processingSpeed: 10,
    accuracy: 98.6,
    currentLoad: 10,
    connectedNodes: ["node-004", "node-005"],
  },
  {
    id: "agent-005",
    name: "DeploymentBot",
    type: "deployer",
    status: "offline",
    description: "Deploys approved content to production",
    capabilities: ["Version control", "Deployment scheduling", "Rollback management"],
    processingSpeed: 15,
    accuracy: 99.9,
    currentLoad: 0,
    connectedNodes: ["node-005"],
  },
]

const sampleNodes: Node[] = [
  {
    id: "node-001",
    name: "Data Input",
    type: "input",
    description: "Receives raw data from various sources",
    connectedTo: ["node-002"],
    position: { x: 100, y: 200 },
  },
  {
    id: "node-002",
    name: "Processing Hub",
    type: "process",
    description: "Central processing node for data transformation",
    connectedTo: ["node-003"],
    position: { x: 300, y: 200 },
  },
  {
    id: "node-003",
    name: "Analysis Junction",
    type: "process",
    description: "Node for analytical operations",
    connectedTo: ["node-004", "node-006"],
    position: { x: 500, y: 200 },
  },
  {
    id: "node-004",
    name: "Content Workshop",
    type: "process",
    description: "Creates and refines content",
    connectedTo: ["node-005"],
    position: { x: 700, y: 150 },
  },
  {
    id: "node-005",
    name: "Deployment Gateway",
    type: "output",
    description: "Final stage before production deployment",
    connectedTo: [],
    position: { x: 900, y: 200 },
  },
  {
    id: "node-006",
    name: "Archive Storage",
    type: "storage",
    description: "Stores processed data for future reference",
    connectedTo: [],
    position: { x: 700, y: 300 },
  },
]

const sampleConnections: Connection[] = [
  { id: "conn-001", from: "node-001", to: "node-002", label: "Raw Data" },
  { id: "conn-002", from: "node-002", to: "node-003", label: "Processed Data" },
  { id: "conn-003", from: "node-003", to: "node-004", label: "Analysis Results" },
  { id: "conn-004", from: "node-003", to: "node-006", label: "Archive" },
  { id: "conn-005", from: "node-004", to: "node-005", label: "Final Content" },
]

const sampleTasks: Task[] = [
  {
    id: "task-001",
    title: "Process customer survey data",
    status: "processing",
    assignedTo: "agent-002",
    currentNode: "node-003",
    path: ["node-001", "node-002", "node-003"],
  },
  {
    id: "task-002",
    title: "Generate quarterly report",
    status: "pending",
    assignedTo: "agent-003",
    currentNode: "node-003",
    path: ["node-001", "node-002", "node-003"],
  },
  {
    id: "task-003",
    title: "Update website content",
    status: "completed",
    path: ["node-001", "node-002", "node-003", "node-004", "node-005"],
  },
]

export default function AgentSystem() {
  const [agents, setAgents] = useState<Agent[]>(sampleAgents)
  const [nodes, setNodes] = useState<Node[]>(sampleNodes)
  const [connections, setConnections] = useState<Connection[]>(sampleConnections)
  const [tasks, setTasks] = useState<Task[]>(sampleTasks)
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [showAgentDetails, setShowAgentDetails] = useState(false)
  const [showNodeDetails, setShowNodeDetails] = useState(false)
  const [showTaskDetails, setShowTaskDetails] = useState(false)
  const [systemRunning, setSystemRunning] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 })
  const [draggedNode, setDraggedNode] = useState<string | null>(null)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })

  // Update canvas dimensions on mount and resize
  useEffect(() => {
    const updateDimensions = () => {
      if (canvasRef.current) {
        const { width, height } = canvasRef.current.getBoundingClientRect()
        setCanvasDimensions({ width, height })
      }
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  // Start/stop the agent system
  const toggleSystem = () => {
    setSystemRunning(!systemRunning)

    if (!systemRunning) {
      // Start the system - update agent statuses
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: agent.status === "offline" ? "offline" : "idle",
        })),
      )
    } else {
      // Stop the system - set all agents to idle
      setAgents((prev) =>
        prev.map((agent) => ({
          ...agent,
          status: agent.status === "offline" ? "offline" : "idle",
        })),
      )
    }
  }

  // Handle node drag start
  const handleNodeDragStart = (nodeId: string, e: React.MouseEvent) => {
    if (!canvasRef.current) return

    const node = nodes.find((n) => n.id === nodeId)
    if (!node) return

    const rect = canvasRef.current.getBoundingClientRect()
    const offsetX = e.clientX - rect.left - node.position.x
    const offsetY = e.clientY - rect.top - node.position.y

    setDraggedNode(nodeId)
    setDragOffset({ x: offsetX, y: offsetY })
  }

  // Handle node drag
  const handleNodeDrag = (e: React.MouseEvent) => {
    if (!draggedNode || !canvasRef.current) return

    const rect = canvasRef.current.getBoundingClientRect()
    const x = e.clientX - rect.left - dragOffset.x
    const y = e.clientY - rect.top - dragOffset.y

    setNodes((prev) => prev.map((node) => (node.id === draggedNode ? { ...node, position: { x, y } } : node)))
  }

  // Handle node drag end
  const handleNodeDragEnd = () => {
    setDraggedNode(null)
  }

  // Get agent type color
  const getAgentTypeColor = (type: AgentType) => {
    switch (type) {
      case "processor":
        return "bg-blue-500"
      case "analyzer":
        return "bg-purple-500"
      case "creator":
        return "bg-green-500"
      case "reviewer":
        return "bg-yellow-500"
      case "deployer":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Get agent status color
  const getAgentStatusColor = (status: AgentStatus) => {
    switch (status) {
      case "idle":
        return "bg-gray-500"
      case "processing":
        return "bg-green-500 animate-pulse"
      case "error":
        return "bg-red-500"
      case "offline":
        return "bg-gray-800"
      default:
        return "bg-gray-500"
    }
  }

  // Get node type color
  const getNodeTypeColor = (type: NodeType) => {
    switch (type) {
      case "input":
        return "border-blue-500 bg-blue-500/20"
      case "output":
        return "border-green-500 bg-green-500/20"
      case "process":
        return "border-purple-500 bg-purple-500/20"
      case "decision":
        return "border-yellow-500 bg-yellow-500/20"
      case "storage":
        return "border-gray-500 bg-gray-500/20"
      default:
        return "border-gray-500 bg-gray-500/20"
    }
  }

  // Get task status color
  const getTaskStatusColor = (status: Task["status"]) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500"
      case "processing":
        return "bg-blue-500 animate-pulse"
      case "completed":
        return "bg-green-500"
      case "failed":
        return "bg-red-500"
      default:
        return "bg-gray-500"
    }
  }

  // Create a new task
  const createNewTask = () => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: `New Task ${tasks.length + 1}`,
      status: "pending",
      currentNode: nodes[0].id,
      path: [nodes[0].id],
    }

    setTasks([...tasks, newTask])
  }

  // Move task to next node
  const moveTaskToNextNode = (taskId: string) => {
    setTasks((prev) =>
      prev.map((task) => {
        if (task.id !== taskId || !task.currentNode) return task

        const currentNode = nodes.find((n) => n.id === task.currentNode)
        if (!currentNode || currentNode.connectedTo.length === 0) return task

        // For simplicity, just move to the first connected node
        const nextNodeId = currentNode.connectedTo[0]

        return {
          ...task,
          currentNode: nextNodeId,
          path: [...task.path, nextNodeId],
          status: "processing",
        }
      }),
    )
  }

  // Complete task
  const completeTask = (taskId: string) => {
    setTasks((prev) => prev.map((task) => (task.id === taskId ? { ...task, status: "completed" } : task)))
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">AGENT</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">SYSTEM</h2>
      </div>

      {/* Control panel */}
      <div className="flex justify-between items-center">
        <div className="flex space-x-2">
          <button
            onClick={toggleSystem}
            className={`flex items-center space-x-2 px-4 py-2 rounded-md ${
              systemRunning ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"
            } text-white transition-colors`}
          >
            {systemRunning ? (
              <>
                <Pause size={16} />
                <span>Stop System</span>
              </>
            ) : (
              <>
                <Play size={16} />
                <span>Start System</span>
              </>
            )}
          </button>
          <button
            onClick={() => {
              // Reset all tasks to pending and first node
              setTasks((prev) =>
                prev.map((task) => ({
                  ...task,
                  status: "pending",
                  currentNode: nodes[0].id,
                  path: [nodes[0].id],
                })),
              )
            }}
            className="flex items-center space-x-2 px-4 py-2 bg-[#333] hover:bg-[#444] rounded-md transition-colors"
          >
            <RefreshCw size={16} />
            <span>Reset Tasks</span>
          </button>
        </div>
        <button
          onClick={createNewTask}
          className="flex items-center space-x-2 px-4 py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors"
        >
          <Plus size={16} />
          <span>New Task</span>
        </button>
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Agents list */}
        <div className="lg:col-span-1 border border-[#333] rounded-md bg-black/60 p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Bot className="mr-2 text-[#e91e63]" size={20} />
            Agents
          </h3>
          <div className="space-y-3 max-h-[400px] overflow-y-auto custom-scrollbar">
            {agents.map((agent) => (
              <div
                key={agent.id}
                className="border border-[#333] rounded-md p-3 hover:border-[#e91e63]/30 transition-all duration-300 cursor-pointer"
                onClick={() => {
                  setSelectedAgent(agent)
                  setShowAgentDetails(true)
                }}
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-bold">{agent.name}</h4>
                  <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent.status)}`}></div>
                </div>
                <div className="flex items-center text-xs text-gray-400 mb-2">
                  <span className={`w-2 h-2 rounded-full ${getAgentTypeColor(agent.type)} mr-2`}></span>
                  <span className="capitalize">{agent.type}</span>
                </div>
                <p className="text-xs text-gray-400 line-clamp-2">{agent.description}</p>
                <div className="mt-2 flex justify-between items-center text-xs">
                  <span>Load: {agent.currentLoad}%</span>
                  <span>Accuracy: {agent.accuracy}%</span>
                </div>
                <div className="mt-1 w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div className="h-full bg-[#e91e63] rounded-full" style={{ width: `${agent.currentLoad}%` }}></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Workflow visualization */}
        <div className="lg:col-span-3 border border-[#333] rounded-md bg-black/60 p-4">
          <h3 className="text-lg font-bold mb-4 flex items-center">
            <Zap className="mr-2 text-[#e91e63]" size={20} />
            Workflow Visualization
          </h3>
          <div
            ref={canvasRef}
            className="relative w-full h-[500px] border border-[#333] rounded-md bg-black/80 overflow-hidden"
            onMouseMove={draggedNode ? handleNodeDrag : undefined}
            onMouseUp={draggedNode ? handleNodeDragEnd : undefined}
            onMouseLeave={draggedNode ? handleNodeDragEnd : undefined}
          >
            {/* Draw connections */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none">
              {connections.map((connection) => {
                const fromNode = nodes.find((n) => n.id === connection.from)
                const toNode = nodes.find((n) => n.id === connection.to)

                if (!fromNode || !toNode) return null

                const fromX = fromNode.position.x + 60 // Half of node width
                const fromY = fromNode.position.y + 30 // Half of node height
                const toX = toNode.position.x + 60
                const toY = toNode.position.y + 30

                // Find tasks on this connection
                const tasksOnConnection = tasks.filter(
                  (task) => task.currentNode === connection.from && task.path.includes(connection.to),
                )

                return (
                  <g key={connection.id}>
                    <path
                      d={`M${fromX},${fromY} L${toX},${toY}`}
                      stroke="#333"
                      strokeWidth="2"
                      fill="none"
                      markerEnd="url(#arrowhead)"
                    />

                    {/* Connection label */}
                    {connection.label && (
                      <text
                        x={(fromX + toX) / 2}
                        y={(fromY + toY) / 2 - 10}
                        textAnchor="middle"
                        fill="#666"
                        fontSize="10"
                      >
                        {connection.label}
                      </text>
                    )}

                    {/* Tasks on connection */}
                    {tasksOnConnection.map((task, index) => {
                      // Calculate position along the line
                      const progress = 0.5 // Middle of the line
                      const taskX = fromX + (toX - fromX) * progress
                      const taskY = fromY + (toY - fromY) * progress

                      return (
                        <circle
                          key={task.id}
                          cx={taskX}
                          cy={taskY}
                          r="6"
                          fill={getTaskStatusColor(task.status)}
                          onClick={() => {
                            setSelectedTask(task)
                            setShowTaskDetails(true)
                          }}
                          className="cursor-pointer"
                        />
                      )
                    })}
                  </g>
                )
              })}

              {/* Arrow marker definition */}
              <defs>
                <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                  <polygon points="0 0, 10 3.5, 0 7" fill="#333" />
                </marker>
              </defs>
            </svg>

            {/* Draw nodes */}
            {nodes.map((node) => (
              <div
                key={node.id}
                className={`absolute w-120 p-3 rounded-md border-2 ${getNodeTypeColor(node.type)} cursor-move`}
                style={{
                  left: `${node.position.x}px`,
                  top: `${node.position.y}px`,
                  width: "120px",
                  zIndex: draggedNode === node.id ? 10 : 1,
                }}
                onMouseDown={(e) => handleNodeDragStart(node.id, e)}
                onClick={() => {
                  if (!draggedNode) {
                    setSelectedNode(node)
                    setShowNodeDetails(true)
                  }
                }}
              >
                <div className="text-xs font-bold mb-1">{node.name}</div>
                <div className="text-[10px] text-gray-400 capitalize">{node.type}</div>

                {/* Tasks in this node */}
                <div className="mt-2 flex flex-wrap gap-1">
                  {tasks
                    .filter((task) => task.currentNode === node.id)
                    .map((task) => (
                      <div
                        key={task.id}
                        className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)}`}
                        title={task.title}
                      ></div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Tasks list */}
      <div className="border border-[#333] rounded-md bg-black/60 p-4">
        <h3 className="text-lg font-bold mb-4 flex items-center">
          <FileText className="mr-2 text-[#e91e63]" size={20} />
          Tasks
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="text-left py-2 px-4">ID</th>
                <th className="text-left py-2 px-4">Title</th>
                <th className="text-left py-2 px-4">Status</th>
                <th className="text-left py-2 px-4">Current Node</th>
                <th className="text-left py-2 px-4">Assigned To</th>
                <th className="text-left py-2 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => {
                const currentNodeName = nodes.find((n) => n.id === task.currentNode)?.name || "N/A"
                const assignedAgentName = agents.find((a) => a.id === task.assignedTo)?.name || "N/A"

                return (
                  <tr key={task.id} className="border-b border-[#333] hover:bg-[#111]">
                    <td className="py-2 px-4">{task.id}</td>
                    <td className="py-2 px-4">{task.title}</td>
                    <td className="py-2 px-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 rounded-full text-xs ${
                          task.status === "pending"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : task.status === "processing"
                              ? "bg-blue-500/20 text-blue-500"
                              : task.status === "completed"
                                ? "bg-green-500/20 text-green-500"
                                : "bg-red-500/20 text-red-500"
                        }`}
                      >
                        {task.status === "processing" && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 mr-1 animate-pulse"></div>
                        )}
                        {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-2 px-4">{currentNodeName}</td>
                    <td className="py-2 px-4">{assignedAgentName}</td>
                    <td className="py-2 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => moveTaskToNextNode(task.id)}
                          disabled={task.status === "completed" || !task.currentNode}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Move to next node"
                        >
                          <ArrowRight size={16} />
                        </button>
                        <button
                          onClick={() => completeTask(task.id)}
                          disabled={task.status === "completed"}
                          className="p-1 text-gray-400 hover:text-white disabled:opacity-50 disabled:cursor-not-allowed"
                          title="Mark as completed"
                        >
                          <Check size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setSelectedTask(task)
                            setShowTaskDetails(true)
                          }}
                          className="p-1 text-gray-400 hover:text-white"
                          title="View details"
                        >
                          <Settings size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Agent details modal */}
      {showAgentDetails && selectedAgent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-black z-10">
              <div className="flex items-center">
                <h2 className="text-xl font-bold">{selectedAgent.name}</h2>
                <div className={`ml-3 w-3 h-3 rounded-full ${getAgentStatusColor(selectedAgent.status)}`}></div>
              </div>
              <button onClick={() => setShowAgentDetails(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="md:col-span-2">
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-300 mb-6">{selectedAgent.description}</p>

                  <h3 className="font-bold mb-2">Capabilities</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedAgent.capabilities.map((capability, index) => (
                      <span key={index} className="bg-[#333] text-xs px-2 py-1 rounded-full">
                        {capability}
                      </span>
                    ))}
                  </div>

                  <h3 className="font-bold mb-2">Connected Nodes</h3>
                  <div className="space-y-2">
                    {selectedAgent.connectedNodes.map((nodeId) => {
                      const node = nodes.find((n) => n.id === nodeId)
                      if (!node) return null

                      return (
                        <div key={nodeId} className="flex items-center p-2 border border-[#333] rounded-md bg-black/40">
                          <div
                            className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type).split(" ")[0]} mr-2`}
                          ></div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            <p className="text-xs text-gray-400">{node.description}</p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="border border-[#333] rounded-md p-4 bg-black/40 mb-6">
                    <h3 className="font-bold mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="font-medium capitalize">{selectedAgent.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Status</p>
                        <p className="font-medium capitalize">{selectedAgent.status}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Processing Speed</p>
                        <p className="font-medium">{selectedAgent.processingSpeed} tasks/min</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Accuracy</p>
                        <p className="font-medium">{selectedAgent.accuracy}%</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Current Load</p>
                        <p className="font-medium">{selectedAgent.currentLoad}%</p>
                        <div className="mt-1 w-full h-2 bg-gray-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-[#e91e63] rounded-full"
                            style={{ width: `${selectedAgent.currentLoad}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    <button
                      onClick={() => {
                        // Toggle agent status
                        setAgents((prev) =>
                          prev.map((agent) =>
                            agent.id === selectedAgent.id
                              ? { ...agent, status: agent.status === "idle" ? "processing" : "idle" }
                              : agent,
                          ),
                        )
                        setSelectedAgent((prev) =>
                          prev ? { ...prev, status: prev.status === "idle" ? "processing" : "idle" } : null,
                        )
                      }}
                      disabled={selectedAgent.status === "offline"}
                      className="w-full py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {selectedAgent.status === "idle" ? "Start Processing" : "Stop Processing"}
                    </button>

                    <button
                      onClick={() => {
                        // Toggle agent online/offline
                        setAgents((prev) =>
                          prev.map((agent) =>
                            agent.id === selectedAgent.id
                              ? { ...agent, status: agent.status === "offline" ? "idle" : "offline" }
                              : agent,
                          ),
                        )
                        setSelectedAgent((prev) =>
                          prev ? { ...prev, status: prev.status === "offline" ? "idle" : "offline" } : null,
                        )
                      }}
                      className="w-full py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                    >
                      {selectedAgent.status === "offline" ? "Bring Online" : "Take Offline"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Node details modal */}
      {showNodeDetails && selectedNode && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-black z-10">
              <h2 className="text-xl font-bold">{selectedNode.name}</h2>
              <button onClick={() => setShowNodeDetails(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold mb-2">Description</h3>
                  <p className="text-gray-300 mb-6">{selectedNode.description}</p>

                  <h3 className="font-bold mb-2">Connected To</h3>
                  <div className="space-y-2">
                    {selectedNode.connectedTo.length > 0 ? (
                      selectedNode.connectedTo.map((nodeId) => {
                        const node = nodes.find((n) => n.id === nodeId)
                        if (!node) return null

                        return (
                          <div
                            key={nodeId}
                            className="flex items-center p-2 border border-[#333] rounded-md bg-black/40"
                          >
                            <div
                              className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type).split(" ")[0]} mr-2`}
                            ></div>
                            <div>
                              <p className="font-medium">{node.name}</p>
                              <p className="text-xs text-gray-400">{node.description}</p>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-gray-400">No connections</p>
                    )}
                  </div>
                </div>

                <div>
                  <div className="border border-[#333] rounded-md p-4 bg-black/40 mb-6">
                    <h3 className="font-bold mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">Type</p>
                        <p className="font-medium capitalize">{selectedNode.type}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-400">Position</p>
                        <p className="font-medium">
                          X: {selectedNode.position.x}, Y: {selectedNode.position.y}
                        </p>
                      </div>
                    </div>
                  </div>

                  <h3 className="font-bold mb-2">Tasks at this Node</h3>
                  <div className="space-y-2">
                    {tasks.filter((task) => task.currentNode === selectedNode.id).length > 0 ? (
                      tasks
                        .filter((task) => task.currentNode === selectedNode.id)
                        .map((task) => (
                          <div
                            key={task.id}
                            className="flex items-center justify-between p-2 border border-[#333] rounded-md bg-black/40"
                          >
                            <div className="flex items-center">
                              <div className={`w-3 h-3 rounded-full ${getTaskStatusColor(task.status)} mr-2`}></div>
                              <p className="font-medium">{task.title}</p>
                            </div>
                            <span className="text-xs text-gray-400 capitalize">{task.status}</span>
                          </div>
                        ))
                    ) : (
                      <p className="text-gray-400">No tasks at this node</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Task details modal */}
      {showTaskDetails && selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <div className="bg-black border border-[#333] rounded-md w-full max-w-2xl max-h-[90vh] overflow-y-auto custom-scrollbar">
            <div className="p-6 border-b border-[#333] flex justify-between items-center sticky top-0 bg-black z-10">
              <h2 className="text-xl font-bold">{selectedTask.title}</h2>
              <button onClick={() => setShowTaskDetails(false)} className="text-gray-400 hover:text-white">
                <X size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h3 className="font-bold mb-2">Status</h3>
                  <div className="flex items-center mb-6">
                    <div className={`w-3 h-3 rounded-full ${getTaskStatusColor(selectedTask.status)} mr-2`}></div>
                    <p className="font-medium capitalize">{selectedTask.status}</p>
                  </div>

                  <h3 className="font-bold mb-2">Path</h3>
                  <div className="space-y-2">
                    {selectedTask.path.map((nodeId, index) => {
                      const node = nodes.find((n) => n.id === nodeId)
                      if (!node) return null

                      const isCurrentNode = nodeId === selectedTask.currentNode

                      return (
                        <div
                          key={`${nodeId}-${index}`}
                          className={`flex items-center p-2 border ${isCurrentNode ? "border-[#e91e63]" : "border-[#333]"} rounded-md bg-black/40`}
                        >
                          <div
                            className={`w-3 h-3 rounded-full ${getNodeTypeColor(node.type).split(" ")[0]} mr-2`}
                          ></div>
                          <div>
                            <p className="font-medium">{node.name}</p>
                            {isCurrentNode && <p className="text-xs text-[#e91e63]">Current Node</p>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

                <div>
                  <div className="border border-[#333] rounded-md p-4 bg-black/40 mb-6">
                    <h3 className="font-bold mb-4">Details</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-gray-400">ID</p>
                        <p className="font-medium">{selectedTask.id}</p>
                      </div>
                      {selectedTask.assignedTo && (
                        <div>
                          <p className="text-xs text-gray-400">Assigned To</p>
                          <p className="font-medium">
                            {agents.find((a) => a.id === selectedTask.assignedTo)?.name || "Unknown Agent"}
                          </p>
                        </div>
                      )}
                      <div>
                        <p className="text-xs text-gray-400">Current Node</p>
                        <p className="font-medium">
                          {nodes.find((n) => n.id === selectedTask.currentNode)?.name || "None"}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action buttons */}
                  <div className="space-y-3">
                    {selectedTask.status !== "completed" && (
                      <>
                        <button
                          onClick={() => moveTaskToNextNode(selectedTask.id)}
                          disabled={!selectedTask.currentNode}
                          className="w-full py-2 bg-[#e91e63] hover:bg-[#d81b60] text-white rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Move to Next Node
                        </button>

                        <button
                          onClick={() => {
                            completeTask(selectedTask.id)
                            setSelectedTask((prev) => (prev ? { ...prev, status: "completed" } : null))
                          }}
                          className="w-full py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                        >
                          Mark as Completed
                        </button>
                      </>
                    )}

                    {selectedTask.status === "completed" && (
                      <button
                        onClick={() => {
                          // Reset task to pending and first node
                          setTasks((prev) =>
                            prev.map((task) =>
                              task.id === selectedTask.id
                                ? { ...task, status: "pending", currentNode: nodes[0].id, path: [nodes[0].id] }
                                : task,
                            ),
                          )
                          setSelectedTask((prev) =>
                            prev ? { ...prev, status: "pending", currentNode: nodes[0].id, path: [nodes[0].id] } : null,
                          )
                        }}
                        className="w-full py-2 bg-[#333] hover:bg-[#444] text-white rounded-md transition-colors"
                      >
                        Reset Task
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

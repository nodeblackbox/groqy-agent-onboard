"use client"

import { useState, useRef, useCallback, useReducer, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GitBranch, Play, Plus, Bot, Sparkles, Github } from "lucide-react"

// Import your components
import { ActionsBetweenNodes } from "./workflow-designer/actions-between-nodes"
import { AIConfig } from "./workflow-designer/ai-config"
import { Console } from "./workflow-designer/console"
import { DiagramEditor } from "./workflow-designer/diagram-editor"
import { NodeNotes } from "./workflow-designer/node-notes"
import { MermaidGenerator } from "./workflow-designer/mermaid-generator"
import { CosmicAgentManager } from "./workflow-designer/cosmic-agent-manager"
import { CosmicSettings } from "./workflow-designer/cosmic-settings"
import { CosmicWorkflowExecution } from "./workflow-designer/cosmic-workflow-execution"
import { useDiagramState } from "@/hooks/use-diagram-state"
import { cosmicReducer, initialCosmicState } from "@/utils/cosmic-reducer"

const initialDiagramCode = `graph TD
    A[Start] --> B[Process]
    B --> C[Decision]
    C -->|Yes| D[Action 1]
    C -->|No| E[Action 2]
    D --> F[End]
    E --> F`

export default function WorkflowDesigner() {
  const {
    diagramCode,
    setDiagramCode,
    notes,
    error,
    setError,
    zoom,
    logs,
    actions,
    isFocused,
    setIsFocused,
    selectedNodes,
    setSelectedNodes,
    logMessage,
    handleNodeClick,
    handleNoteChange,
    handleDeleteNote,
    handleZoomIn,
    handleZoomOut,
    handleResetZoom,
    isExecuting,
    setIsExecuting,
  } = useDiagramState(initialDiagramCode)

  const [cosmicState, cosmicDispatch] = useReducer(cosmicReducer, initialCosmicState)
  const diagramRef = useRef<HTMLDivElement>(null)
  const [apiKey, setApiKey] = useState("")
  const [activeTab, setActiveTab] = useState("diagram")

  useEffect(() => {
    // Load API key from localStorage if available
    const storedApiKey = localStorage.getItem("groqApiKey")
    if (storedApiKey) {
      setApiKey(storedApiKey)
      cosmicDispatch({ type: "SET_API_KEY", payload: storedApiKey })
    }
  }, [])

  const renderDiagram = useCallback(async () => {
    try {
      const mermaid = (await import("mermaid")).default

      mermaid.initialize({
        startOnLoad: false,
        securityLevel: "loose",
        theme: "dark",
        themeVariables: {
          primaryColor: "#e91e63",
          primaryTextColor: "#ffffff",
          primaryBorderColor: "#e91e63",
          lineColor: "#e91e63",
          secondaryColor: "#333333",
          tertiaryColor: "#111111",
        },
      })

      setError("")
      logMessage("Rendering diagram...")

      if (diagramRef.current) {
        diagramRef.current.innerHTML = ""

        const { svg } = await mermaid.render("mermaid-diagram", diagramCode)
        diagramRef.current.innerHTML = svg

        logMessage("Diagram rendered successfully.")

        setTimeout(() => {
          const svgNodes = diagramRef.current?.querySelectorAll(".node[id]")
          svgNodes?.forEach((node) => {
            const nodeId = node.id.replace(/^flowchart-|^graph-/, "").replace(/-.*$/, "")
            if (nodeId) {
              node.style.cursor = "pointer"
              node.onclick = () => handleNodeClick(nodeId, notes[nodeId]?.nodeInfo.label || nodeId)
            }
          })

          logMessage(`Added click handlers to ${svgNodes?.length} nodes.`)
        }, 100)
      }
    } catch (err: any) {
      setError("Invalid Mermaid syntax. Please check your diagram code.")
      logMessage(`Error rendering diagram: ${err.message || err}`)
      console.error(err)
    }
  }, [diagramCode, handleNodeClick, notes, setError, logMessage])

  const handleGeneratedDiagram = (generatedCode: string) => {
    setDiagramCode(generatedCode)
    renderDiagram()
  }

  const handleExecuteNode = async (nodeId: string) => {
    setIsExecuting(true)
    logMessage(`Executing node: ${nodeId} - ${notes[nodeId]?.nodeInfo.label || nodeId}`)

    try {
      // Simulate execution
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Update node with AI-generated content
      const nodeNote = notes[nodeId]
      if (nodeNote) {
        const updatedNotes = {
          ...notes,
          [nodeId]: {
            ...nodeNote,
            aiContent: `# Execution Results\n\nNode "${nodeNote.nodeInfo.label}" executed successfully.\n\n## Output\n\`\`\`json\n{\n  "status": "success",\n  "executionTime": "2.3s",\n  "result": "Task completed"\n}\n\`\`\``,
          },
        }
        logMessage(`Node ${nodeId} executed successfully.`)
      }
    } catch (error: any) {
      logMessage(`Error executing node: ${error.message || error}`)
      setError(`Failed to execute node: ${error.message || error}`)
    } finally {
      setIsExecuting(false)
    }
  }

  const handleExecuteWorkflow = (key: string) => {
    if (!key) {
      setError("API key is required to execute the workflow")
      return
    }

    localStorage.setItem("groqApiKey", key)
    logMessage("Executing workflow...")

    // Simulate workflow execution
    setIsExecuting(true)
    setTimeout(() => {
      logMessage("Workflow executed successfully.")
      setIsExecuting(false)
    }, 3000)
  }

  // Dummy GitHubIntegration component
  function GitHubIntegration() {
    return (
      <div>
        <h2>GitHub Integration</h2>
        <p>This is a placeholder for the GitHub integration.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-1">
        <h2 className="text-3xl font-bold uppercase">WORKFLOW</h2>
        <h2 className="text-3xl font-bold uppercase text-[#e91e63]">DESIGNER</h2>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="diagram" className="data-[state=active]:bg-[#e91e63] data-[state=active]:text-white">
            <GitBranch className="mr-2 h-4 w-4" />
            Diagram Editor
          </TabsTrigger>
          <TabsTrigger value="agents" className="data-[state=active]:bg-[#e91e63] data-[state=active]:text-white">
            <Bot className="mr-2 h-4 w-4" />
            Agent Manager
          </TabsTrigger>
          <TabsTrigger value="cosmic" className="data-[state=active]:bg-[#e91e63] data-[state=active]:text-white">
            <Sparkles className="mr-2 h-4 w-4" />
            Cosmic Nexus
          </TabsTrigger>
          <TabsTrigger value="github" className="data-[state=active]:bg-[#e91e63] data-[state=active]:text-white">
            <Github className="mr-2 h-4 w-4" />
            GitHub
          </TabsTrigger>
        </TabsList>

        <TabsContent value="diagram" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div className="space-y-4">
              <MermaidGenerator onGenerate={handleGeneratedDiagram} apiKey={apiKey} />
              <DiagramEditor
                diagramCode={diagramCode}
                setDiagramCode={setDiagramCode}
                zoom={zoom}
                error={error}
                handleZoomIn={handleZoomIn}
                handleZoomOut={handleZoomOut}
                handleResetZoom={handleResetZoom}
                renderDiagram={renderDiagram}
                isFocused={isFocused}
                setIsFocused={setIsFocused}
                selectedNodes={selectedNodes}
                setSelectedNodes={setSelectedNodes}
                notes={notes}
                diagramRef={diagramRef}
              />
            </div>
            <div className="space-y-4">
              <AIConfig onExecute={handleExecuteWorkflow} onApiKeyChange={setApiKey} apiKey={apiKey} />
              <NodeNotes
                notes={notes}
                isFocused={isFocused}
                selectedNodes={selectedNodes}
                handleNoteChange={handleNoteChange}
                handleDeleteNote={handleDeleteNote}
                handleExecuteNode={handleExecuteNode}
                isExecuting={isExecuting}
              />
              <ActionsBetweenNodes actions={actions} notes={notes} />
            </div>
          </div>
          <Console logs={logs} error={error} />
        </TabsContent>

        <TabsContent value="agents">
          <div className="space-y-4">
            <AgentManagerIntegrated />
          </div>
        </TabsContent>

        <TabsContent value="cosmic">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            <CosmicAgentManager state={cosmicState} dispatch={cosmicDispatch} />
            <CosmicWorkflowExecution state={cosmicState} dispatch={cosmicDispatch} />
          </div>
          <CosmicSettings state={cosmicState} dispatch={cosmicDispatch} />
        </TabsContent>

        <TabsContent value="github">
          <GitHubIntegration />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// Integrated Agent Manager component
function AgentManagerIntegrated() {
  const [agents, setAgents] = useState([
    { id: 1, name: "DATA_PROCESSOR", status: "ACTIVE", type: "AI", tasks: 45, successRate: 92 },
    { id: 2, name: "CONTENT_CREATOR", status: "IDLE", type: "AI", tasks: 30, successRate: 88 },
    { id: 3, name: "SUPPORT_BOT", status: "TRAINING", type: "Human-AI Hybrid", tasks: 100, successRate: 95 },
    { id: 4, name: "WORKFLOW_MANAGER", status: "ACTIVE", type: "AI", tasks: 67, successRate: 97 },
  ])
  const [showCreateAgent, setShowCreateAgent] = useState(false)
  const [showTaskAutomation, setShowTaskAutomation] = useState(false)
  const [newAgentName, setNewAgentName] = useState("")
  const [newAgentType, setNewAgentType] = useState("AI")
  const [newAgentPrompt, setNewAgentPrompt] = useState("")
  const [automationTasks, setAutomationTasks] = useState([
    { id: 1, name: "Generate Product Descriptions", status: "running", completedTasks: 23, totalTasks: 50 },
    { id: 2, name: "Analyze Customer Feedback", status: "paused", completedTasks: 75, totalTasks: 100 },
  ])

  const handleCreateAgent = () => {
    const newAgent = {
      id: agents.length + 1,
      name: newAgentName,
      status: "IDLE",
      type: newAgentType,
      tasks: 0,
      successRate: 0,
    }
    setAgents([...agents, newAgent])
    setShowCreateAgent(false)
    setNewAgentName("")
    setNewAgentType("AI")
    setNewAgentPrompt("")
  }

  const handleDeleteAgent = (id: number) => {
    setAgents(agents.filter((agent) => agent.id !== id))
  }

  const handleStartAutomation = (taskId: number) => {
    setAutomationTasks(automationTasks.map((task) => (task.id === taskId ? { ...task, status: "running" } : task)))
  }

  const handlePauseAutomation = (taskId: number) => {
    setAutomationTasks(automationTasks.map((task) => (task.id === taskId ? { ...task, status: "paused" } : task)))
  }

  return (
    <div className="space-y-6">
      <Card className="border border-[#333] bg-black/60 rounded-md p-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl uppercase font-bold flex items-center">
            <Bot className="mr-2 text-[#e91e63]" size={20} />
            AGENTS
          </h2>
          <Button
            onClick={() => setShowCreateAgent(true)}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-md text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" /> CREATE AGENT
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-black/40 rounded-lg">
            <thead>
              <tr className="border-b border-[#333]">
                <th className="px-4 py-2 text-left text-gray-400">NAME</th>
                <th className="px-4 py-2 text-left text-gray-400">STATUS</th>
                <th className="px-4 py-2 text-left text-gray-400">TYPE</th>
                <th className="px-4 py-2 text-left text-gray-400">TASKS COMPLETED</th>
                <th className="px-4 py-2 text-left text-gray-400">SUCCESS RATE</th>
                <th className="px-4 py-2 text-left text-gray-400">ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {agents.map((agent) => (
                <tr key={agent.id} className="border-b border-[#333]">
                  <td className="px-4 py-2 text-white">{agent.name}</td>
                  <td className="px-4 py-2">
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        agent.status === "ACTIVE"
                          ? "bg-green-500/20 text-green-500"
                          : agent.status === "IDLE"
                            ? "bg-yellow-500/20 text-yellow-500"
                            : "bg-blue-500/20 text-blue-500"
                      }`}
                    >
                      {agent.status}
                    </span>
                  </td>
                  <td className="px-4 py-2 text-white">{agent.type}</td>
                  <td className="px-4 py-2 text-white">{agent.tasks}</td>
                  <td className="px-4 py-2 text-white">{agent.successRate}%</td>
                  <td className="px-4 py-2 flex space-x-2">
                    <Button className="bg-[#333] hover:bg-[#444] p-1 rounded">
                      <Play size={16} className="text-[#e91e63]" />
                    </Button>
                    <Button
                      onClick={() => handleDeleteAgent(agent.id)}
                      className="bg-[#333] hover:bg-[#444] p-1 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="text-red-500"
                      >
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                      </svg>
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="border border-[#333] bg-black/60 rounded-md p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl uppercase font-bold flex items-center">
            <GitBranch className="mr-2 text-[#e91e63]" size={20} />
            TASK AUTOMATION
          </h2>
          <Button
            onClick={() => setShowTaskAutomation(true)}
            className="bg-[#e91e63] text-white px-4 py-2 rounded-md text-sm flex items-center"
          >
            <Plus size={16} className="mr-1" /> NEW AUTOMATION
          </Button>
        </div>
        <div className="space-y-4">
          {automationTasks.map((task) => (
            <div key={task.id} className="bg-black/40 border border-[#333] rounded-lg p-4">
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-semibold text-white">{task.name}</h3>
                <div className="space-x-2">
                  {task.status === "running" ? (
                    <Button
                      onClick={() => handlePauseAutomation(task.id)}
                      className="bg-yellow-500/20 text-yellow-500 p-1 rounded"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="6" y="4" width="4" height="16"></rect>
                        <rect x="14" y="4" width="4" height="16"></rect>
                      </svg>
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleStartAutomation(task.id)}
                      className="bg-green-500/20 text-green-500 p-1 rounded"
                    >
                      <Play size={16} />
                    </Button>
                  )}
                </div>
              </div>
              <div className="flex items-center">
                <div className="w-full bg-[#333] rounded-full h-2 mr-4">
                  <div
                    className="bg-[#e91e63] h-2 rounded-full"
                    style={{ width: `${(task.completedTasks / task.totalTasks) * 100}%` }}
                  ></div>
                </div>
                <span className="text-gray-400">
                  {task.completedTasks} / {task.totalTasks}
                </span>
              </div>
            </div>
          ))}
        </div>
      </Card>

      {showCreateAgent && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border border-[#333] rounded-md w-full max-w-md p-6 relative animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl uppercase font-bold text-[#e91e63]">CREATE NEW AGENT</h2>
              <Button onClick={() => setShowCreateAgent(false)} className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">AGENT NAME</label>
                <input
                  type="text"
                  value={newAgentName}
                  onChange={(e) => setNewAgentName(e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter agent name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">AGENT TYPE</label>
                <select
                  value={newAgentType}
                  onChange={(e) => setNewAgentType(e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                >
                  <option value="AI">AI</option>
                  <option value="Human-AI Hybrid">Human-AI Hybrid</option>
                  <option value="Rule-based">Rule-based</option>
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">INITIAL PROMPT</label>
                <textarea
                  value={newAgentPrompt}
                  onChange={(e) => setNewAgentPrompt(e.target.value)}
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-32"
                  placeholder="Enter initial prompt for the agent"
                />
              </div>
              <Button
                onClick={handleCreateAgent}
                className="w-full bg-[#e91e63] hover:bg-[#d81b60] transition-colors text-white py-2 rounded-md"
              >
                CREATE AGENT
              </Button>
            </div>
          </Card>
        </div>
      )}

      {showTaskAutomation && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
          <Card className="bg-black border border-[#333] rounded-md w-full max-w-2xl p-6 relative animate-fadeIn">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl uppercase font-bold text-[#e91e63]">CREATE NEW TASK AUTOMATION</h2>
              <Button onClick={() => setShowTaskAutomation(false)} className="text-gray-400 hover:text-white">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </svg>
              </Button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs text-gray-400 mb-1">TASK NAME</label>
                <input
                  type="text"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                  placeholder="Enter task name"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">SELECT AGENT</label>
                <select className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none">
                  {agents.map((agent) => (
                    <option key={agent.id} value={agent.id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">TASK PROMPT</label>
                <textarea
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none h-32"
                  placeholder="Enter the prompt for this task"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-400 mb-1">INPUT DATA (CSV OR JSON)</label>
                <input
                  type="file"
                  className="w-full bg-black border border-[#333] rounded-md p-2 focus:border-[#e91e63] focus:outline-none"
                />
              </div>
              <div className="flex items-center">
                <input type="checkbox" id="repeat" className="mr-2" />
                <label htmlFor="repeat" className="text-gray-400">
                  REPEAT TASK
                </label>
              </div>
              <Button className="w-full bg-[#e91e63] hover:bg-[#d81b60] transition-colors text-white py-2 rounded-md">
                CREATE TASK AUTOMATION
              </Button>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}

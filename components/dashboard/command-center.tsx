"use client"
import { useState, useEffect } from "react"
import { Bot, GitBranch, CheckCircle, Activity, Maximize, Minimize } from "lucide-react"
import { useAgency } from "@/context/agency-context"
import WorkflowVisualization from "@/components/dashboard/workflow-visualization"
import AnimatedTerminal from "@/components/dashboard/animated-terminal"
import AgentNetworkVisualization from "@/components/dashboard/agent-network-visualization"
import AgentList from "@/components/dashboard/agent-list"

export default function CommandCenter() {
  const { agentStatusData } = useAgency()
  const [expandedCard, setExpandedCard] = useState<string | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Check if mobile on mount and when window resizes
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    // Initial check
    checkIfMobile()

    // Add event listener
    window.addEventListener("resize", checkIfMobile)

    // Cleanup
    return () => window.removeEventListener("resize", checkIfMobile)
  }, [])

  return (
    <div className="space-y-4 md:space-y-6 w-full overflow-x-hidden">
      {/* Dashboard Header */}
      <div className="flex flex-col space-y-1">
        <h2 className="text-2xl md:text-3xl font-bold uppercase">AGENT</h2>
        <h2 className="text-2xl md:text-3xl font-bold uppercase text-[#e91e63]">COMMAND</h2>
        <h2 className="text-2xl md:text-3xl font-bold uppercase">CENTER</h2>
      </div>

      {/* System Status */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-4">
        {[
          {
            label: "AGENTS ACTIVE",
            value: `${agentStatusData.filter((a) => a.status === "ACTIVE").length}/${agentStatusData.length}`,
            icon: Bot,
            color: "text-[#e91e63]",
          },
          { label: "WORKFLOWS", value: "3", icon: GitBranch, color: "text-[#e91e63]" },
          { label: "TASKS COMPLETED", value: "28", icon: CheckCircle, color: "text-green-500" },
          { label: "SYSTEM LOAD", value: "42%", icon: Activity, color: "text-[#e91e63]" },
        ].map((stat, i) => (
          <div
            key={i}
            className="border border-[#333] bg-black/60 rounded-md p-3 md:p-4 hover:border-[#e91e63]/30 transition-all duration-300"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="text-[10px] md:text-xs text-gray-400 uppercase">{stat.label}</p>
                <p className="text-xl md:text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="w-8 h-8 md:w-12 md:h-12 bg-black border border-[#333] rounded-md flex items-center justify-center">
                <stat.icon size={isMobile ? 16 : 24} className={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Agent List */}
      <div className="border border-[#333] bg-black/60 rounded-md p-4 md:p-6">
        <AgentList />
      </div>

      {/* Terminal and Agent Network */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
        <div
          className={`${
            expandedCard === "terminal" ? "md:col-span-2" : ""
          } relative border border-[#333] bg-black/60 rounded-md p-3 md:p-4`}
        >
          <div className="absolute top-2 right-2 z-10">
            <button
              onClick={() => setExpandedCard(expandedCard === "terminal" ? null : "terminal")}
              className="text-gray-400 hover:text-white"
            >
              {expandedCard === "terminal" ? <Minimize size={16} /> : <Maximize size={16} />}
            </button>
          </div>
          <h3 className="text-lg md:text-xl uppercase font-bold mb-2 flex items-center">
            <Bot className="mr-2 text-[#e91e63]" size={isMobile ? 16 : 20} />
            TERMINAL
          </h3>
          <AnimatedTerminal />
        </div>

        {expandedCard !== "terminal" && (
          <div
            className={`${
              expandedCard === "network" ? "md:col-span-2" : ""
            } relative border border-[#333] bg-black/60 rounded-md p-3 md:p-4`}
          >
            <div className="absolute top-2 right-2 z-10">
              <button
                onClick={() => setExpandedCard(expandedCard === "network" ? null : "network")}
                className="text-gray-400 hover:text-white"
              >
                {expandedCard === "network" ? <Minimize size={16} /> : <Maximize size={16} />}
              </button>
            </div>
            <h3 className="text-lg md:text-xl uppercase font-bold mb-2 flex items-center">
              <Bot className="mr-2 text-[#e91e63]" size={isMobile ? 16 : 20} />
              AGENT NETWORK
            </h3>
            <div className="h-[200px] md:h-[300px]">
              <AgentNetworkVisualization />
            </div>
          </div>
        )}
      </div>

      {/* Active Workflow */}
      <div className="border border-[#333] bg-black/60 rounded-md p-3 md:p-6">
        <WorkflowVisualization />
      </div>
    </div>
  )
}

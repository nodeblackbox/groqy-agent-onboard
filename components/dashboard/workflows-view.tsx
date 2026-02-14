"use client"
import { GitBranch, Plus, ChevronRight } from "lucide-react"
import WorkflowVisualization from "@/components/dashboard/workflow-visualization"

export default function WorkflowsView() {
  return (
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
  )
}

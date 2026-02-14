"use client"
import { useState, useEffect } from "react"
import { CheckCircle, Clock, GitBranch, Loader } from "lucide-react"

// Workflow steps
const workflowSteps = [
  { id: 1, name: "DATA_COLLECTION", status: "COMPLETED", time: "00:12:34", agent: "DATA_PROCESSOR" },
  { id: 2, name: "DATA_ANALYSIS", status: "COMPLETED", time: "00:08:17", agent: "DATA_PROCESSOR" },
  { id: 3, name: "CONTENT_GENERATION", status: "IN_PROGRESS", time: "00:05:22", agent: "CONTENT_CREATOR" },
  { id: 4, name: "REVIEW", status: "PENDING", time: "--:--:--", agent: "WORKFLOW_MANAGER" },
  { id: 5, name: "DEPLOYMENT", status: "PENDING", time: "--:--:--", agent: "WORKFLOW_MANAGER" },
]

export default function WorkflowVisualization() {
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
    <div className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(233,30,99,0.1),transparent_70%)]"></div>

      <h3 className="text-lg md:text-xl uppercase font-bold mb-4 md:mb-6 flex items-center relative z-10">
        <GitBranch className="mr-2 text-[#e91e63]" size={isMobile ? 16 : 20} />
        ACTIVE WORKFLOW: <span className="text-[#e91e63] ml-2">CONTENT_PIPELINE_003</span>
      </h3>

      <div className="relative workflow-container">
        {workflowSteps.map((step, index) => (
          <div key={step.id} className="flex mb-6 md:mb-8 relative">
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
                  <h4 className="text-xs md:text-sm font-bold">{step.name}</h4>
                  <p className="text-[10px] md:text-xs text-gray-400 mt-1">AGENT: {step.agent}</p>
                </div>
                <div className="flex flex-col md:flex-row items-end md:items-center">
                  <span
                    className={`text-[10px] md:text-xs px-2 py-1 rounded mb-1 md:mb-0 md:mr-2 ${
                      step.status === "COMPLETED"
                        ? "bg-green-900/30 text-green-500"
                        : step.status === "IN_PROGRESS"
                          ? "bg-[#e91e63]/20 text-[#e91e63]"
                          : "bg-gray-800 text-gray-400"
                    }`}
                  >
                    {step.status}
                  </span>
                  <span className="text-[10px] md:text-xs text-gray-400">{step.time}</span>
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

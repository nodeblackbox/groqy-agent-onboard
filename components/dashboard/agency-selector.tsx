"use client"
import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useAgency } from "@/context/agency-context"

export default function AgencySelector() {
  const { agencies, currentAgency, setCurrentAgency } = useAgency()
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-1.5 border border-[#333] rounded-md hover:border-[#e91e63] transition-colors text-sm"
      >
        <img src={currentAgency.logo || "/placeholder.svg"} alt={currentAgency.name} className="w-5 h-5 rounded-sm" />
        <span>{currentAgency.name}</span>
        <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-full bg-black border border-[#333] rounded-md shadow-lg z-50 py-1">
          {agencies.map((agency) => (
            <button
              key={agency.id}
              className={`w-full text-left px-3 py-2 flex items-center space-x-2 hover:bg-[#333]/30 ${agency.id === currentAgency.id ? "text-[#e91e63]" : ""}`}
              onClick={() => {
                setCurrentAgency(agency)
                setIsOpen(false)
              }}
            >
              <img src={agency.logo || "/placeholder.svg"} alt={agency.name} className="w-5 h-5 rounded-sm" />
              <span>{agency.name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

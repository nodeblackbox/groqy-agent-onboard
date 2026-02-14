"use client"
import { useState } from "react"
import { Menu, Bell, Search, ChevronDown, PanelRight, SkipForward } from "lucide-react"
import { useAgency } from "@/context/agency-context"

interface HeaderProps {
  activeView: string
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
}

export default function Header({ activeView, sidebarOpen, setSidebarOpen }: HeaderProps) {
  const { currentAgency, agencies, setCurrentAgency } = useAgency()
  const [showAgencyDropdown, setShowAgencyDropdown] = useState(false)
  // Add a new state for the secret toggle
  const [showSecretToggle, setShowSecretToggle] = useState(false)

  // Format the view name for display
  const formatViewName = (view: string) => {
    switch (view) {
      case "dashboard":
        return "Command Center"
      default:
        return view.charAt(0).toUpperCase() + view.slice(1)
    }
  }

  // Add this function after the formatViewName function
  const toggleOnboardingBypass = () => {
    localStorage.setItem("onboardingCompleted", "true")
    // Force reload to apply the change
    window.location.reload()
  }

  return (
    <header className="py-4 flex items-center justify-between">
      {/* Left side - Title and toggle */}
      <div className="flex items-center">
        {!sidebarOpen && (
          <button
            onClick={() => setSidebarOpen(true)}
            className="mr-4 text-gray-400 hover:text-white flex items-center justify-center"
            aria-label="Open sidebar"
          >
            <PanelRight size={20} />
          </button>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="mr-4 text-gray-400 hover:text-white md:hidden flex items-center justify-center"
          aria-label="Toggle sidebar"
        >
          <Menu size={20} />
        </button>
        <h1 className="text-lg md:text-xl font-bold">{formatViewName(activeView)}</h1>
      </div>

      {/* Right side - Actions */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Bypass Toggle - Now always visible */}
        <button
          onClick={toggleOnboardingBypass}
          className="bg-[#111] border border-[#333] rounded-md p-2 hover:border-[#e91e63] transition-colors flex items-center"
          title="Bypass Onboarding"
        >
          <SkipForward size={16} className="text-[#e91e63] mr-1" />
          <span className="text-xs hidden md:inline">BYPASS</span>
        </button>

        {/* Search */}
        <div className="hidden md:flex items-center bg-[#111] border border-[#333] rounded-md px-3 py-1.5">
          <Search size={16} className="text-gray-500 mr-2" />
          <input type="text" placeholder="Search..." className="bg-transparent border-none outline-none text-sm w-40" />
        </div>

        {/* Agency Selector */}
        <div className="relative">
          <button
            onClick={() => setShowAgencyDropdown(!showAgencyDropdown)}
            onDoubleClick={() => setShowSecretToggle(!showSecretToggle)}
            className="flex items-center bg-[#111] border border-[#333] rounded-md px-3 py-1.5 text-sm"
          >
            <span className="hidden md:inline mr-2">Agency:</span>
            <span className="font-medium truncate max-w-[100px] md:max-w-[150px]">{currentAgency.name}</span>
            <ChevronDown size={16} className="ml-2" />
          </button>

          {showAgencyDropdown && (
            <div className="absolute right-0 mt-1 w-48 bg-[#111] border border-[#333] rounded-md shadow-lg z-50">
              {agencies.map((agency) => (
                <button
                  key={agency.id}
                  onClick={() => {
                    setCurrentAgency(agency)
                    setShowAgencyDropdown(false)
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm hover:bg-[#222] ${
                    agency.id === currentAgency.id ? "bg-[#222] text-[#e91e63]" : ""
                  }`}
                >
                  {agency.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Notifications */}
        <button className="relative bg-[#111] border border-[#333] rounded-md p-2">
          <Bell size={16} />
          <span className="absolute top-0 right-0 w-2 h-2 bg-[#e91e63] rounded-full"></span>
        </button>
        {/* Secret toggle - only shows when double-clicked on the agency name */}
        {showSecretToggle && (
          <button
            onClick={toggleOnboardingBypass}
            className="bg-[#111] border border-[#333] rounded-md p-2 hover:border-[#e91e63] transition-colors"
            title="Bypass Onboarding"
          >
            <span className="text-[#e91e63] text-xs">BYPASS</span>
          </button>
        )}
      </div>
    </header>
  )
}

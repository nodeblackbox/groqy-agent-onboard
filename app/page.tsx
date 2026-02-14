"use client"
import { AgencyProvider } from "@/context/agency-context"
import Dashboard from "@/components/dashboard/dashboard"

export default function Home() {
  return (
    <AgencyProvider>
      <Dashboard />
    </AgencyProvider>
  )
}

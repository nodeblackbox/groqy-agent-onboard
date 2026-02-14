"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Plus } from "lucide-react"

interface Repository {
  name: string
  status: string
  lastSync: string
}

interface Activity {
  action: string
  repo: string
  user: string
  time: string
}

export function GitHubIntegration() {
  const [cloneUrl, setCloneUrl] = useState("")
  const [repositories, setRepositories] = useState<Repository[]>([
    { name: "frontend-app", status: "Connected", lastSync: "5 minutes ago" },
    { name: "backend-api", status: "Connected", lastSync: "1 hour ago" },
    { name: "mobile-app", status: "Disconnected", lastSync: "N/A" },
    { name: "data-processing", status: "Connected", lastSync: "3 days ago" },
  ])
  const [activities] = useState<Activity[]>([
    { action: "Opened Pull Request", repo: "frontend-app", user: "John Doe", time: "10 minutes ago" },
    { action: "Merged Branch", repo: "backend-api", user: "Jane Smith", time: "1 hour ago" },
    { action: "Pushed Commit", repo: "data-processing", user: "Bob Johnson", time: "3 hours ago" },
    { action: "Created Issue", repo: "frontend-app", user: "Alice Williams", time: "Yesterday" },
  ])

  const handleCloneRepo = (e: React.FormEvent) => {
    e.preventDefault()
    setRepositories([
      ...repositories,
      {
        name: cloneUrl.split("/").pop()?.replace(".git", "") || "Unknown Repo",
        status: "Cloning",
        lastSync: "Just now",
      },
    ])
    setCloneUrl("")
  }

  return (
    <div className="space-y-8">
      <Card className="border border-[#333] bg-black/60 p-6 rounded-md shadow-md">
        <h3 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Clone Repository</h3>
        <form onSubmit={handleCloneRepo} className="flex space-x-4">
          <Input
            type="text"
            value={cloneUrl}
            onChange={(e) => setCloneUrl(e.target.value)}
            placeholder="Enter GitHub repository URL"
            className="bg-black border border-[#333] flex-grow"
          />
          <Button type="submit" className="bg-[#e91e63] hover:bg-[#d81b60] flex items-center space-x-2">
            <Plus size={20} />
            <span>Clone</span>
          </Button>
        </form>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border border-[#333] bg-black/60 p-6 rounded-md shadow-md">
          <h3 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Connected Repositories</h3>
          <ul className="space-y-2">
            {repositories.map((repo, index) => (
              <li key={index} className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-white">{repo.name}</p>
                  <p className="text-sm text-gray-400">Last synced: {repo.lastSync}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    repo.status === "Connected"
                      ? "bg-green-500/20 text-green-500"
                      : repo.status === "Cloning"
                        ? "bg-yellow-500/20 text-yellow-500"
                        : "bg-red-500/20 text-red-500"
                  }`}
                >
                  {repo.status}
                </span>
              </li>
            ))}
          </ul>
        </Card>
        <Card className="border border-[#333] bg-black/60 p-6 rounded-md shadow-md">
          <h3 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Recent Activities</h3>
          <ul className="space-y-4">
            {activities.map((activity, index) => (
              <li key={index} className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-[#e91e63] rounded-full"></div>
                <span className="text-white">
                  {activity.user} {activity.action} in {activity.repo}
                </span>
                <span className="text-xs text-gray-400">{activity.time}</span>
              </li>
            ))}
          </ul>
        </Card>
      </div>

      <Card className="border border-[#333] bg-black/60 p-6 rounded-md shadow-md">
        <h3 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Pull Requests</h3>
        <ul className="space-y-4">
          {[
            { title: "Update README.md", repo: "frontend-app", author: "John Doe", status: "Open" },
            { title: "Fix login bug", repo: "backend-api", author: "Jane Smith", status: "Merged" },
            { title: "Add new feature", repo: "mobile-app", author: "Bob Johnson", status: "Draft" },
          ].map((pr, index) => (
            <li
              key={index}
              className="flex items-center justify-between bg-black/40 p-4 rounded-md border border-[#333]"
            >
              <div>
                <p className="font-semibold text-white">{pr.title}</p>
                <p className="text-sm text-gray-400">
                  {pr.repo} • by {pr.author}
                </p>
              </div>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  pr.status === "Open"
                    ? "bg-green-500/20 text-green-500"
                    : pr.status === "Merged"
                      ? "bg-purple-500/20 text-purple-500"
                      : "bg-yellow-500/20 text-yellow-500"
                }`}
              >
                {pr.status}
              </span>
            </li>
          ))}
        </ul>
      </Card>
    </div>
  )
}

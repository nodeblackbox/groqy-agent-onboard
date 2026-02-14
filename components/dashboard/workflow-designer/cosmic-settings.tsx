"use client"

import type React from "react"
import { useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Settings, Save, Download, Upload, Trash2 } from "lucide-react"

interface CosmicSettingsProps {
  state: any
  dispatch: React.Dispatch<any>
}

export const CosmicSettings: React.FC<CosmicSettingsProps> = ({ state, dispatch }) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const saveCosmicConfiguration = () => {
    if (!state.configName) {
      alert("Please enter a cosmic configuration name.")
      return
    }
    const newConfig = {
      id: Math.random().toString(36).substring(2, 15),
      name: state.configName,
      agents: state.agents,
      connections: state.connections,
    }
    dispatch({ type: "ADD_SAVED_CONFIG", payload: newConfig })
    dispatch({ type: "SET_CONFIG_NAME", payload: "" })
  }

  const loadCosmicConfiguration = (config: any) => {
    dispatch({ type: "LOAD_CONFIG", payload: config })
  }

  const deleteCosmicConfiguration = (configId: string) => {
    dispatch({ type: "DELETE_SAVED_CONFIG", payload: configId })
  }

  const exportCosmicConfiguration = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2))
    const downloadAnchorNode = document.createElement("a")
    downloadAnchorNode.setAttribute("href", dataStr)
    downloadAnchorNode.setAttribute("download", `cosmic_workflow_configuration_${Date.now()}.json`)
    document.body.appendChild(downloadAnchorNode)
    downloadAnchorNode.click()
    downloadAnchorNode.remove()
  }

  const importCosmicConfiguration = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string)
          dispatch({ type: "IMPORT_CONFIG", payload: importedData })
        } catch (error) {
          alert("Error importing cosmic configuration: Invalid JSON file.")
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <Card
      className="border border-[#333] bg-black/60 shadow-md mt-8"
      style={{ boxShadow: "0 0 30px rgba(233, 30, 99, 0.1)" }}
    >
      <CardHeader>
        <CardTitle className="flex items-center text-[#e91e63]">
          <Settings className="mr-2 text-[#e91e63]" />
          Cosmic Nexus Settings
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <label htmlFor="apiKey" className="block text-xs text-gray-400 mb-1">
              Cosmic API Key
            </label>
            <Input
              id="apiKey"
              type="password"
              value={state.apiKey}
              onChange={(e) => dispatch({ type: "SET_API_KEY", payload: e.target.value })}
              placeholder="Enter your cosmic API key"
              className="bg-black border border-[#333] text-white focus:border-[#e91e63] focus:ring-[#e91e63]"
            />
          </div>
          <div>
            <label htmlFor="knowledgeBase" className="block text-xs text-gray-400 mb-1">
              Cosmic Knowledge Base
            </label>
            <textarea
              id="knowledgeBase"
              className="w-full h-32 p-2 bg-black text-white border border-[#333] rounded-md focus:border-[#e91e63] focus:ring-[#e91e63]"
              value={state.knowledgeBase}
              onChange={(e) => dispatch({ type: "SET_KNOWLEDGE_BASE", payload: e.target.value })}
              placeholder="Enter cosmic knowledge base information..."
            />
          </div>
          <div>
            <label htmlFor="configName" className="block text-xs text-gray-400 mb-1">
              Cosmic Configuration Name
            </label>
            <div className="flex mt-1">
              <Input
                id="configName"
                value={state.configName}
                onChange={(e) => dispatch({ type: "SET_CONFIG_NAME", payload: e.target.value })}
                placeholder="Enter configuration name"
                className="mr-2 bg-black border border-[#333] text-white focus:border-[#e91e63] focus:ring-[#e91e63]"
              />
              <Button onClick={saveCosmicConfiguration} className="bg-[#e91e63] hover:bg-[#d81b60] text-white">
                <Save size={16} className="mr-2" />
                Save Config
              </Button>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button onClick={exportCosmicConfiguration} className="bg-[#333] hover:bg-[#444] text-white">
              <Download size={16} className="mr-2" />
              Export Config
            </Button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={importCosmicConfiguration}
              style={{ display: "none" }}
              accept=".json"
            />
            <Button onClick={() => fileInputRef.current?.click()} className="bg-[#333] hover:bg-[#444] text-white">
              <Upload size={16} className="mr-2" />
              Import Config
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <h3 className="text-lg font-semibold mb-4 text-[#e91e63]">Saved Cosmic Configurations</h3>
          {state.savedConfigs.length === 0 ? (
            <p className="text-gray-400">No saved cosmic configurations.</p>
          ) : (
            <ScrollArea className="h-64 bg-black/40 rounded-md p-4 overflow-auto border border-[#333]">
              {state.savedConfigs.map((config: any) => (
                <div
                  key={config.id}
                  className="flex items-center justify-between bg-black/60 p-2 rounded-md mb-2 border border-[#333]"
                >
                  <span className="text-white">{config.name}</span>
                  <div className="flex items-center space-x-2">
                    <Button
                      onClick={() => loadCosmicConfiguration(config)}
                      className="bg-[#333] hover:bg-[#444] text-white"
                      aria-label={`Load ${config.name}`}
                    >
                      <Download size={16} />
                    </Button>
                    <Button
                      onClick={() => deleteCosmicConfiguration(config.id)}
                      className="bg-red-900 hover:bg-red-800 text-white"
                      aria-label={`Delete ${config.name}`}
                    >
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              ))}
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

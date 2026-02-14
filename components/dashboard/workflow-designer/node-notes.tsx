"use client"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Trash2, Play } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface NodeNotesProps {
  notes: Record<
    string,
    {
      content: string
      nodeInfo: {
        id: string
        label: string
        action?: string[]
        subgraph?: string
      }
      aiContent?: string
    }
  >
  isFocused: boolean
  selectedNodes: string[]
  handleNoteChange: (nodeId: string, newNote: string) => void
  handleDeleteNote: (nodeId: string) => void
  handleExecuteNode: (nodeId: string) => void
  isExecuting: boolean
}

export function NodeNotes({
  notes,
  isFocused,
  selectedNodes,
  handleNoteChange,
  handleDeleteNote,
  handleExecuteNode,
  isExecuting,
}: NodeNotesProps) {
  return (
    <Card className="border border-[#333] bg-black/60 p-4 flex-1 shadow-md mb-4">
      <h2 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Node Notes</h2>
      <Accordion type="multiple" className="w-full">
        {Object.entries(notes)
          .filter(([nodeId, _]) => {
            if (!isFocused) return true
            return selectedNodes.includes(nodeId)
          })
          .map(([nodeId, note]) => (
            <AccordionItem value={nodeId} key={nodeId} className="border-[#333]">
              <AccordionTrigger className="flex justify-between items-center text-white hover:text-[#e91e63]">
                <span className="font-medium">
                  Node: {note.nodeInfo.label} ({nodeId})
                </span>
              </AccordionTrigger>
              <div className="py-2 px-4 flex justify-between items-center">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => handleDeleteNote(nodeId)}
                  disabled={isExecuting}
                  aria-label={`Delete note for node ${nodeId}`}
                  className="bg-red-900 hover:bg-red-800 text-white"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleExecuteNode(nodeId)}
                  disabled={isExecuting}
                  aria-label={`Execute node ${nodeId}`}
                  className="border border-[#333] hover:border-[#e91e63]"
                >
                  <Play className="w-4 h-4" />
                </Button>
              </div>
              <AccordionContent>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Node ID</label>
                    <Input
                      value={note.nodeInfo.id}
                      disabled
                      className="bg-black border border-[#333]"
                      aria-label="Node ID"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Node Label</label>
                    <Input
                      value={note.nodeInfo.label}
                      disabled
                      className="bg-black border border-[#333]"
                      aria-label="Node Label"
                    />
                  </div>
                  {note.nodeInfo.subgraph && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Subgraph</label>
                      <Input
                        value={note.nodeInfo.subgraph}
                        disabled
                        className="bg-black border border-[#333]"
                        aria-label="Subgraph"
                      />
                    </div>
                  )}
                  {note.nodeInfo.action && note.nodeInfo.action.length > 0 && (
                    <div>
                      <label className="block text-xs text-gray-400 mb-1">Actions</label>
                      <ul className="list-disc pl-5 text-gray-300">
                        {note.nodeInfo.action.map((action, index) => (
                          <li key={index}>{action}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <label className="block text-xs text-gray-400 mb-1">Note (Markdown)</label>
                    <Textarea
                      value={note.content}
                      onChange={(e) => handleNoteChange(nodeId, e.target.value)}
                      placeholder="Enter your markdown note here..."
                      className="bg-black border border-[#333] mt-1 min-h-32"
                      aria-label="Markdown Note"
                    />
                  </div>
                  <Card className="border border-[#333] bg-black/40 p-4 rounded-md shadow-inner">
                    <h3 className="text-sm font-semibold mb-2 text-gray-400">Preview:</h3>
                    <ReactMarkdown className="text-gray-300">{note.content}</ReactMarkdown>
                  </Card>
                  {note.aiContent && (
                    <div className="mt-4">
                      <h4 className="text-sm font-semibold mb-2 text-gray-400">AI-Generated Content:</h4>
                      <div className="bg-black/40 border border-[#333] p-2 rounded-md">
                        <ReactMarkdown className="text-gray-300">{note.aiContent}</ReactMarkdown>
                      </div>
                    </div>
                  )}
                </div>
              </AccordionContent>
            </AccordionItem>
          ))}
      </Accordion>
      {Object.keys(notes).length === 0 && (
        <p className="text-gray-400 text-center py-4">Click on any node in the diagram to add notes</p>
      )}
    </Card>
  )
}

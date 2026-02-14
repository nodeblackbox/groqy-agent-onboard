import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"

interface ActionsBetweenNodesProps {
  actions: { action: string; source: string; target: string }[]
  notes: Record<string, { nodeInfo: { label: string } }>
}

export function ActionsBetweenNodes({ actions, notes }: ActionsBetweenNodesProps) {
  return (
    <Card className="border border-[#333] bg-black/60 p-4 flex-1 shadow-md">
      <h2 className="text-xl uppercase font-bold mb-4 text-[#e91e63]">Actions Between Nodes</h2>
      <Accordion type="multiple" className="w-full">
        {actions.map((action, index) => (
          <AccordionItem value={`action-${index}`} key={`action-${index}`} className="border-[#333]">
            <AccordionTrigger className="flex justify-between items-center text-white hover:text-[#e91e63]">
              <span className="font-medium">Action: {action.action}</span>
            </AccordionTrigger>
            <AccordionContent>
              <div className="space-y-4">
                <div>
                  <label className="block text-xs text-gray-400 mb-1">Action</label>
                  <Input value={action.action} disabled className="bg-black border border-[#333]" aria-label="Action" />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">From Node</label>
                  <Input
                    value={`${action.source} (${notes[action.source]?.nodeInfo.label || action.source})`}
                    disabled
                    className="bg-black border border-[#333]"
                    aria-label="From Node"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1">To Node</label>
                  <Input
                    value={`${action.target} (${notes[action.target]?.nodeInfo.label || action.target})`}
                    disabled
                    className="bg-black border border-[#333]"
                    aria-label="To Node"
                  />
                </div>
              </div>
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
      {actions.length === 0 && (
        <p className="text-gray-400 text-center py-4">No actions found. Add actions by editing the diagram code.</p>
      )}
    </Card>
  )
}

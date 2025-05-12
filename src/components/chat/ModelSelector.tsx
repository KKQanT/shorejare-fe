"use client"

import { Brain } from "lucide-react"
import Select from "../ui/Select"
import type { SelectOption } from "../ui/Select"

interface ModelSelectorProps {
  selectedModel: string
  onModelChange: (e: React.ChangeEvent<HTMLSelectElement>) => void
}

export default function ModelSelector({ selectedModel, onModelChange }: ModelSelectorProps) {
  // Convert the onModelChange function to match our custom Select component
  const handleModelChange = (value: string) => {
    // Create a synthetic event to match the expected interface
    const syntheticEvent = {
      target: { value },
      currentTarget: { value },
      preventDefault: () => {},
      stopPropagation: () => {}
    } as unknown as React.ChangeEvent<HTMLSelectElement>
    
    onModelChange(syntheticEvent)
  }

  const modelOptions: SelectOption[] = [
    { key: "gpt-4o", label: "GPT-4o" },
    { key: "claude-3", label: "Claude 3" },
    { key: "gemini-pro", label: "Gemini Pro" },
    { key: "llama-3", label: "Llama 3" }
  ]

  return (
    <div className="p-3 border-b border-gray-800 bg-gray-900 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <Brain className="h-4 w-4 text-green-400" />
        <span className="text-sm text-gray-400">Model:</span>
      </div>
      <Select
        value={selectedModel}
        onChange={handleModelChange}
        options={modelOptions}
        className="w-[180px]"
        placeholder="Select Model"
      />
    </div>
  )
}


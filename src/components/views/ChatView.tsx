import { useState } from "react"
import ModelSelector from "../chat/ModelSelector"
import CaptureScreen from "../chat/CaptureScreen"
import ChatPanel from "../chat/ChatPanel"

export default function ChatView() {
  const [selectedModel, setSelectedModel] = useState("gpt-4o")  

  return (
    <div className="flex flex-col h-full">
      <ModelSelector selectedModel={selectedModel} onModelChange={(e) => setSelectedModel(e.target.value)} /> 
      <CaptureScreen />
      <ChatPanel />
    </div>
  )
}
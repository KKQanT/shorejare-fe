import { useState } from "react"
import ModelSelector from "./ModelSelector"

export default function ChatScreen() {

  const [selectedModel, setSelectedModel] = useState("gpt-4o")  

  return (
    <>
      <ModelSelector selectedModel={selectedModel} onModelChange={(e) => setSelectedModel(e.target.value)} /> 
    </>
  )
}
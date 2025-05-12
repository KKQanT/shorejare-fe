"use client"

import type React from "react"
import { useRef, useEffect, useState } from "react"
import { Button } from "@heroui/react"
import { Send } from "lucide-react"
import Textarea from "../ui/Textarea"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

interface ChatPanelProps {
  suggestedPrompts?: string[]
}

const DEFAULT_PROMPTS = [
  "Should I buy based on this chart?",
  "What's the trend analysis for this?",
  "Identify support and resistance",
  "Is this a good entry point?",
  "Should I short this position?"
]

export default function ChatPanel({ suggestedPrompts = DEFAULT_PROMPTS }: ChatPanelProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  const handleInputChange = (value: string) => {
    setInput(value)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim()
    }
    setMessages(prev => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "This is a placeholder response. Please implement the actual API integration."
      }
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get response:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col h-full bg-gray-900">
      <div className="flex-1 p-3 overflow-y-auto" ref={chatContainerRef}>
        <div className="space-y-4">
          {messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8 text-center">
              <div className="h-12 w-12 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 flex items-center justify-center mb-4">
                <Send className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-300">Trading Assistant</h3>
              <p className="text-sm text-gray-400 max-w-xs mt-2">
                Capture your trading screen and ask questions to get AI-powered insights
              </p>

              <div className="mt-6 grid grid-cols-2 gap-2 w-full">
                {suggestedPrompts.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="flat"
                    className="w-full flex flex-row items-center justify-center bg-gray-800 border-gray-700 rounded-md hover:bg-gray-700 hover:text-green-400 p-2 cursor-pointer text-xs"
                    onClick={() => setInput(prompt)}
                  >
                    {prompt}
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message) => (
              <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-green-600 to-emerald-700 text-white"
                      : "bg-gray-800 text-gray-100"
                  }`}
                >
                  {message.content}
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-800 bg-gray-900">
        <form onSubmit={handleSubmit} className="flex items-end gap-2 focus:outline-none">
          <Textarea
            value={input}
            onChange={(e) => handleInputChange(e.target.value)}
            placeholder="Ask about your trading screen..."
            className="min-h-[60px] max-h-[120px] overflow-y-auto"
          />
          <Button
            type="submit"
            variant="flat"
            className="flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 cursor-pointer"
            disabled={isLoading || !input.trim()}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  )
}

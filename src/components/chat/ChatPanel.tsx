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
  useStreaming?: boolean
}

const DEFAULT_PROMPTS = [
  "Should I buy based on this chart?",
  "What's the trend analysis for this?",
  "Identify support and resistance",
  "Is this a good entry point?",
  "Should I short this position?"
]

const API_BASE_URL = 'http://localhost:3001';

export default function ChatPanel({ 
  suggestedPrompts = DEFAULT_PROMPTS,
  useStreaming = true 
}: ChatPanelProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)
  const abortControllerRef = useRef<AbortController | null>(null);
  const [debugInfo, setDebugInfo] = useState<string>('');

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }, [messages])

  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close()
      }
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    }
  }, [])

  const handleInputChange = (value: string) => {
    setInput(value)
  }

  const handleStreamingResponse = async (userInput: string, tempId: string) => {
    try {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      abortControllerRef.current = new AbortController();
      
      setDebugInfo(`Starting POST request to: ${API_BASE_URL}/agent/chat-stream`);
      
      const response = await fetch(`${API_BASE_URL}/agent/chat-stream`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
        signal: abortControllerRef.current.signal
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      if (!response.body) {
        throw new Error("Response body is null");
      }
      
      setDebugInfo(prev => prev + '\nResponse received, setting up reader');
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      let done = false;
      
      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        
        if (value) {
          const text = decoder.decode(value);
          setDebugInfo(prev => prev + '\nReceived chunk: ' + text);
          
          const lines = text.split('\n\n');
          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const jsonStr = line.substring(6);
                const data = JSON.parse(jsonStr);
                
                if (data.content) {
                  setDebugInfo(prev => prev + '\nProcessing content: ' + data.content);
                  setMessages(prev => prev.map(msg => 
                    msg.id === tempId 
                      ? { ...msg, content: msg.content + data.content } 
                      : msg
                  ));
                }
                
                if (data.done || data.error) {
                  if (data.error) {
                    console.error('Streaming error:', data.error);
                    setDebugInfo(prev => prev + '\nError: ' + data.error);
                  } else if (data.done) {
                    setDebugInfo(prev => prev + '\nStream complete');
                  }
                }
              } catch (err) {
                console.error('Error parsing SSE data:', err);
                setDebugInfo(prev => prev + '\nParse error: ' + (err instanceof Error ? err.message : String(err)));
              }
            }
          }
        }
      }
      
      setIsLoading(false);
      
    } catch (error) {
      console.error('Failed to set up streaming:', error);
      setDebugInfo(prev => prev + '\nSetup error: ' + (error instanceof Error ? error.message : String(error)));
      setIsLoading(false);
    } finally {
      abortControllerRef.current = null;
    }
  }

  const handleRegularResponse = async (userInput: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/agent/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ message: userInput }),
      })
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response
      }
      
      setMessages(prev => [...prev, assistantMessage])
    } catch (error) {
      console.error('Failed to get response:', error)
      
      // Add error message
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: "Sorry, I encountered an error while processing your request."
      }
      
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
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
    setDebugInfo(''); // Clear debug info

    const userInput = input.trim()

    if (useStreaming) {
      const tempId = (Date.now() + 1).toString()
      setMessages(prev => [...prev, {
        id: tempId,
        role: 'assistant',
        content: ''
      }])
      
      await handleStreamingResponse(userInput, tempId)
    } else {
      await handleRegularResponse(userInput)
    }
  }

  // Debugging toggle
  const [showDebug, setShowDebug] = useState(false);

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
                  {message.content || (isLoading ? "Loading..." : "")}
                </div>
              </div>
            ))
          )}
          {isLoading && !useStreaming && (
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
          
          {showDebug && debugInfo && (
            <div className="mt-4 p-2 bg-black/70 rounded text-xs font-mono text-green-400 whitespace-pre-wrap">
              {debugInfo}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-800 bg-gray-900">
        <div className="mb-2 flex justify-end">
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
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

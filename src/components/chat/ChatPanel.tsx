"use client"

import type { FormEvent } from "react"
import { useState } from "react"
import { Button } from "@heroui/react"
import { Send, Upload, X } from "lucide-react"
import Textarea from "../ui/Textarea"
import { SUGGESTED_PROMPTS } from "../../constants/chat"
import { useChat } from "../../hooks/useChat"
import { useImageUpload } from "../../hooks/useImageUpload"

export default function ChatPanel() {
  const {
    messages,
    input,
    isLoading,
    debugInfo,
    chatContainerRef,
    handleInputChange,
    sendMessage,
  } = useChat();

  const {
    uploadedImage,
    isLoading: isImageLoading,
    fileInputRef,
    handleImageUpload,
    clearUploadedImage
  } = useImageUpload();

  const [showDebug, setShowDebug] = useState(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendMessage(input, uploadedImage?.filename);
    clearUploadedImage();
  };

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
                {SUGGESTED_PROMPTS.map((prompt, index) => (
                  <Button
                    key={index}
                    variant="flat"
                    className="w-full flex flex-row items-center justify-center bg-gray-800 border-gray-700 rounded-md hover:bg-gray-700 hover:text-green-400 p-2 cursor-pointer text-xs"
                    onClick={() => handleInputChange(prompt)}
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
                  {message.imageUrl && (
                    <div className="mb-2">
                      <img 
                        src={message.imageUrl} 
                        alt="Trading chart" 
                        className="rounded-md max-w-full h-auto max-h-60 object-contain"
                      />
                    </div>
                  )}
                  {message.content || (isLoading ? "Loading..." : "")}
                </div>
              </div>
            ))
          )}
          {/*isLoading && !useStreaming && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-3 bg-gray-800 text-gray-100">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-150"></div>
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse delay-300"></div>
                </div>
              </div>
            </div>
          )*/}
          
          {showDebug && debugInfo && (
            <div className="mt-4 p-2 bg-black/70 rounded text-xs font-mono text-green-400 whitespace-pre-wrap">
              {debugInfo}
            </div>
          )}
        </div>
      </div>

      <div className="p-3 border-t border-gray-800 bg-gray-900">
        <div className="mb-2 flex justify-between items-center">
          <div>
            <input 
              type="file" 
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
            <Button
              type="button"
              variant="flat"
              className="flex items-center justify-center h-8 px-3 rounded-md bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-green-400 cursor-pointer text-xs"
              onClick={() => fileInputRef.current?.click()}
              disabled={isLoading || isImageLoading || !!uploadedImage}
            >
              <Upload className="h-3 w-3 mr-1" />
              Upload Chart
            </Button>
          </div>
          <button 
            onClick={() => setShowDebug(!showDebug)} 
            className="text-xs text-gray-500 hover:text-gray-300"
          >
            {showDebug ? 'Hide Debug' : 'Show Debug'}
          </button>
        </div>
        
        {uploadedImage && (
          <div className="mb-3 p-2 bg-gray-800 rounded-md relative">
            <img 
              src={uploadedImage.url} 
              alt="Uploaded chart" 
              className="rounded-md w-full h-auto max-h-32 object-contain"
            />
            <button 
              className="absolute top-1 right-1 bg-red-500 hover:bg-red-600 rounded-full p-1"
              onClick={clearUploadedImage}
            >
              <X className="h-3 w-3 text-white" />
            </button>
          </div>
        )}
        
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

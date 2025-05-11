"use client"

import { Button } from "@heroui/react"
import { Settings, Menu, Zap } from "lucide-react"


export default function AppHeader() {
  return (
    <div className="flex items-center justify-between p-3 border-b border-gray-800 bg-gradient-to-r from-gray-900 to-gray-950">
      <div className="flex items-center gap-2">
        <Zap className="h-5 w-5 text-green-400" />
        <h1 className="text-lg font-bold bg-gradient-to-r from-green-400 to-emerald-600 bg-clip-text text-transparent">
          TradingCopilot
        </h1>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Settings className="h-5 w-5" />
        </Button>
        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
          <Menu className="h-5 w-5" />
        </Button>
      </div>
    </div>
  )
}

"use client"

import { Tabs, Tab } from "@heroui/react"
import { MessageSquare, Wallet, ArrowUpRight, Clock } from "lucide-react"
import { useState } from "react"


const TABS = [
  {
    id: "chat",
    label: "Chat"
  },
  {
    id: "wallet",
    label: "Wallet"
  },
  {
    id: "transfer",
    label: "Transfer"
  },
  {
    id: "stake",
    label: "Stake"
  }
]

export default function NavigationTabs() {
  const [selected, setSelected] = useState(TABS[0].id);

  return (
    <Tabs aria-label="Options" selectedKey={selected} onSelectionChange={(key) => setSelected(key as string)}>
      <Tab key="chat" title="Chat" className="data-[state=active]:bg-gray-800 flex items-center gap-1">
        <MessageSquare className="h-4 w-4" />
        <span className="hidden sm:inline">Chat</span>
      </Tab>
      <Tab key="wallet" title="Wallet" className="data-[state=active]:bg-gray-800 flex items-center gap-1">
        <Wallet className="h-4 w-4" />
        <span className="hidden sm:inline">Wallet</span>
      </Tab>
      <Tab key="transfer" title="Transfer" className="data-[state=active]:bg-gray-800 flex items-center gap-1">
        <ArrowUpRight className="h-4 w-4" />
        <span className="hidden sm:inline">Transfer</span>
      </Tab>
      <Tab key="stake" title="Stake" className="data-[state=active]:bg-gray-800 flex items-center gap-1">
        <Clock className="h-4 w-4" />
        <span className="hidden sm:inline">Stake</span>
      </Tab>
    </Tabs>
  )
}

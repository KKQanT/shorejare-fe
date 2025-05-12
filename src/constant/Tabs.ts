import { MessageSquare } from "lucide-react";

import { ArrowUpRight, Wallet } from "lucide-react";

import { Clock } from "lucide-react";

export type TabOption = {
  id: string;
  label: string;
  icon: React.ElementType;
}

export const TABS: TabOption[] = [
  {
    id: "chat",
    label: "Chat",
    icon: MessageSquare
  },
  {
    id: "wallet",
    label: "Wallet",
    icon: Wallet
  }
]
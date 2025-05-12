"use client"

import { Tabs, Tab } from "@heroui/react"
import { useState } from "react"
import type {  TabOption } from "../../constant/Tabs"

interface NavigationTabsProps {
  tabList: TabOption[],
  selectedTabId: string,
  onTabChange: (tabId: string) => void  
}

function NavigationTabs({ tabList, selectedTabId, onTabChange }: NavigationTabsProps) {

  return (
    <div className="flex items-center justify-center bg-gray-900">
      <Tabs
        aria-label="Options"
        selectedKey={selectedTabId}
        onSelectionChange={(key) => onTabChange(key as string)}
        className="w-full"
      >
        {tabList.map((tab) => (
          <Tab key={tab.id}
            className="data-[selected]:bg-gray-800 data-[selected]:text-white text-gray-600 hover:text-white font-bold"
            title={
              <div className="flex items-center p-2">
                <tab.icon className="h-4 w-4 mr-2" />
                <span className="text-sm">{tab.label}</span>
              </div>
            }
          />
        ))}
      </Tabs>
    </div>
  )
}

export default NavigationTabs;
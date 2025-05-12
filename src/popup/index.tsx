import { useState } from "react"
import AppHeader from "../components/layout/AppHeader"
import NavigationTabs from "../components/layout/NavBar"
import { TABS } from "../constant/Tabs"
import ChatScreen from "../components/chat/screen"

function Popup() {

  const [selectedTabId, setSelectedTabId] = useState(TABS[0].id)

  return (
    <div className="flex flex-col h-full bg-app-darktext-white w-full">
      <AppHeader />
      <NavigationTabs tabList={TABS} selectedTabId={selectedTabId} onTabChange={setSelectedTabId} />
      {selectedTabId === "chat" && <ChatScreen />}
    </div>
  )
}

export default Popup

import { useState } from "react"
import AppHeader from "../components/layout/AppHeader"
import NavigationTabs from "../components/layout/NavBar"
import { TABS } from "../constant/Tabs"


function Popup() {

  const [selectedTabId, setSelectedTabId] = useState(TABS[0].id)

  return (
    <div className="flex flex-col h-full bg-app-dark text-white">
      <AppHeader />
      <NavigationTabs tabList={TABS} selectedTabId={selectedTabId} onTabChange={setSelectedTabId} />
    </div>
  )
}

export default Popup

function App() {

  return (
    <div className="flex flex-col h-full bg-app-dark text-white">
      <header className="px-4 py-3 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-gradient-green flex items-center">
          ShareJore AI
        </h1>
      </header>
      <main className="flex-1 p-4 flex flex-col items-center justify-center">
        <p className="text-gray-300 mb-6">Chrome Extension Initialized</p>
        <button className="px-4 py-2 rounded-md bg-gradient-green text-white font-medium hover:shadow-lg transition-all">
          Get Started
        </button>
      </main>
    </div>
  )
}

export default App

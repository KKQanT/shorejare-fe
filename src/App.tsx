function App() {

  return (
    <div className="flex flex-col h-full bg-app-dark text-white">
      <header className="px-4 py-3 border-b border-gray-700">
        <h1 className="text-2xl font-bold text-gradient-green flex items-center">
          <svg 
            className="w-7 h-7 mr-2" 
            fill="#10b981" 
            viewBox="0 0 20 20" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
          </svg>
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

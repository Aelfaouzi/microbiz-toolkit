import { useState } from 'react'
import Home from './pages/HomePage'

function App() {
  return (
    <div className="min-h-screen py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold mb-4">Micro Business Toolkit</h1>
        <p className="mb-2 text-slate-700">Welcome to the Micro Business Toolkit! This is a simple dashboard to help you track your sales and expenses.</p>
        <p className="mb-6 text-slate-600">Use the forms below to add your sales and expenses, and see your profit calculated in real-time.</p>
        <Home />
      </div>
    </div>
  )
}

export default App

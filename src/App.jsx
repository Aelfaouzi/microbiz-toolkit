import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage';
import SalesPage from './pages/SalesPage';
import ExpensesPage from './pages/ExpensesPage';
import BottomNav from './components/BottomNav';

function App() {
  return (
    <Router>
      <div className="min-h-screen py-8 pb-24">
        <div className="max-w-6xl mx-auto px-4">
          <h1 className="text-3xl font-semibold mb-4">Micro Business Toolkit</h1>
          <p className="mb-2 text-slate-700">Welcome to the Micro Business Toolkit! This is a simple dashboard to help you track your sales and expenses.</p>
          <p className="mb-6 text-slate-600">Use the forms below to add your sales and expenses, and see your profit calculated in real-time.</p>
          
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sales" element={<SalesPage />} />
            <Route path="/expenses" element={<ExpensesPage />} />
          </Routes>
        </div>
        <BottomNav />
      </div>
    </Router>
  )
}

export default App

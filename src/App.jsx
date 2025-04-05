import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateDeal from './pages/CreateDeal'

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-surface-50 dark:bg-surface-900 text-surface-900 dark:text-surface-50">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/create-deal" element={<CreateDeal />} />
        </Routes>
      </div>
    </Router>
  )
}

export default App
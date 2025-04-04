import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import CreateDeal from './pages/CreateDeal'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/create-deal" element={<CreateDeal />} />
      </Routes>
    </Router>
  )
}

export default App
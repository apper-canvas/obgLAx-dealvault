import { useState, useEffect } from 'react'
import { Routes, Route, NavLink } from 'react-router-dom'
import { Sun, Moon, Menu, X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Home from './pages/Home'
import NotFound from './pages/NotFound'

function App() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem('darkMode') === 'true' || 
    window.matchMedia('(prefers-color-scheme: dark)').matches
  )
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', darkMode)
  }, [darkMode])

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen)
  }

  // Function to determine active link styles
  const getNavLinkClass = ({ isActive }) => {
    return isActive 
      ? "font-medium text-primary dark:text-primary-light transition" 
      : "font-medium text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light transition"
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-surface-800/80 backdrop-blur-md border-b border-surface-200 dark:border-surface-700">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xl">
              DV
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
              DealVault
            </span>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <NavLink to="/" className={getNavLinkClass}>Dashboard</NavLink>
            <NavLink to="/deals" className={getNavLinkClass}>My Deals</NavLink>
            <NavLink to="/analytics" className={getNavLinkClass}>Analytics</NavLink>
            <NavLink to="/marketplaces" className={getNavLinkClass}>Marketplaces</NavLink>
          </nav>

          <div className="flex items-center gap-3">
            <button 
              onClick={toggleDarkMode}
              className="p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition"
              aria-label="Toggle dark mode"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>

            <button 
              className="md:hidden p-2 rounded-full bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition"
              onClick={toggleMobileMenu}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>

            <button className="hidden md:block px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition">
              Sign In
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden border-t border-surface-200 dark:border-surface-700"
            >
              <div className="container mx-auto px-4 py-3 flex flex-col gap-3">
                <NavLink to="/" className={({ isActive }) => 
                  `py-2 font-medium ${isActive 
                    ? "text-primary dark:text-primary-light" 
                    : "text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light"
                  } transition`
                }>Dashboard</NavLink>
                <NavLink to="/deals" className={({ isActive }) => 
                  `py-2 font-medium ${isActive 
                    ? "text-primary dark:text-primary-light" 
                    : "text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light"
                  } transition`
                }>My Deals</NavLink>
                <NavLink to="/analytics" className={({ isActive }) => 
                  `py-2 font-medium ${isActive 
                    ? "text-primary dark:text-primary-light" 
                    : "text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light"
                  } transition`
                }>Analytics</NavLink>
                <NavLink to="/marketplaces" className={({ isActive }) => 
                  `py-2 font-medium ${isActive 
                    ? "text-primary dark:text-primary-light" 
                    : "text-surface-600 hover:text-primary dark:text-surface-300 dark:hover:text-primary-light"
                  } transition`
                }>Marketplaces</NavLink>
                <button className="mt-2 px-4 py-2 rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition">
                  Sign In
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Main Content */}
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="bg-white dark:bg-surface-800 border-t border-surface-200 dark:border-surface-700 py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-2 mb-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-sm">
                  DV
                </div>
                <span className="text-lg font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  DealVault
                </span>
              </div>
              <p className="text-sm text-surface-500 dark:text-surface-400">
                Track and optimize your lifetime deal investments
              </p>
            </div>
            <div className="flex gap-6">
              <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition">Terms</a>
              <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition">Privacy</a>
              <a href="#" className="text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition">Help</a>
            </div>
          </div>
          <div className="mt-6 text-center text-sm text-surface-500 dark:text-surface-400">
            © {new Date().getFullYear()} DealVault. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
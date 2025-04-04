import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { 
  BarChart3, 
  PieChart, 
  Calendar, 
  Clock, 
  DollarSign, 
  TrendingUp, 
  Award, 
  AlertCircle,
  Plus
} from 'lucide-react'
import MainFeature from '../components/MainFeature'

const Home = () => {
  const navigate = useNavigate()
  
  // Sample data for demonstration
  const stats = [
    { 
      id: 1, 
      title: 'Monthly Spend', 
      value: '$349', 
      change: '+12%', 
      isPositive: false,
      icon: <DollarSign size={20} className="text-primary" />
    },
    { 
      id: 2, 
      title: 'Total Lifetime Spend', 
      value: '$4,872', 
      change: '', 
      isPositive: true,
      icon: <TrendingUp size={20} className="text-secondary" />
    },
    { 
      id: 3, 
      title: 'Buying Score', 
      value: '78/100', 
      change: '+3', 
      isPositive: true,
      icon: <Award size={20} className="text-accent" />
    },
    { 
      id: 4, 
      title: 'Upcoming Refunds', 
      value: '3', 
      change: '', 
      isPositive: true,
      icon: <Clock size={20} className="text-primary" />
    }
  ]
  
  const upcomingRefunds = [
    {
      id: 1,
      name: "DesignPro Suite",
      marketplace: "AppSumo",
      price: 69,
      purchaseDate: "2023-10-15",
      refundDeadline: "2023-11-14",
      daysLeft: 2
    },
    {
      id: 2,
      name: "SEO Toolkit Pro",
      marketplace: "DealMirror",
      price: 129,
      purchaseDate: "2023-10-20",
      refundDeadline: "2023-11-19",
      daysLeft: 7
    },
    {
      id: 3,
      name: "EmailMaster",
      marketplace: "PitchGround",
      price: 49,
      purchaseDate: "2023-10-25",
      refundDeadline: "2023-11-24",
      daysLeft: 12
    }
  ]

  const handleAddNewDeal = () => {
    navigate('/create-deal')
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Welcome to DealVault</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Track, analyze, and optimize your lifetime deal investments
        </p>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: stat.id * 0.1 }}
            className="card-neu p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
                {stat.icon}
              </div>
              {stat.change && (
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                  stat.isPositive ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400' : 
                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
                }`}>
                  {stat.change}
                </span>
              )}
            </div>
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Main Feature - Deal Entry Form */}
        <div className="lg:col-span-2">
          <MainFeature />
        </div>
        
        {/* Upcoming Refunds */}
        <div className="card p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold flex items-center gap-2">
              <Calendar size={20} className="text-primary" />
              <span>Upcoming Refunds</span>
            </h2>
            <button className="btn btn-outline text-sm py-1">View All</button>
          </div>
          
          <div className="space-y-4">
            {upcomingRefunds.map((deal) => (
              <div 
                key={deal.id} 
                className={`p-4 rounded-lg border ${
                  deal.daysLeft <= 3 
                    ? 'border-red-200 bg-red-50 dark:border-red-900/50 dark:bg-red-900/20' 
                    : 'border-surface-200 bg-surface-50 dark:border-surface-700 dark:bg-surface-800'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-medium">{deal.name}</h3>
                  <span className="badge badge-primary">{deal.marketplace}</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-surface-600 dark:text-surface-400">${deal.price}</span>
                  <div className="flex items-center gap-1">
                    {deal.daysLeft <= 3 && (
                      <AlertCircle size={14} className="text-red-500" />
                    )}
                    <span className={deal.daysLeft <= 3 ? 'text-red-500 font-medium' : 'text-surface-600 dark:text-surface-400'}>
                      {deal.daysLeft} days left
                    </span>
                  </div>
                </div>
              </div>
            ))}
            
            <button 
              className="w-full py-3 border border-dashed border-surface-300 dark:border-surface-600 rounded-lg text-surface-500 dark:text-surface-400 hover:bg-surface-100 dark:hover:bg-surface-700 transition flex items-center justify-center gap-2"
              onClick={handleAddNewDeal}
            >
              <Plus size={16} />
              <span>Add New Deal</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Analytics Preview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <BarChart3 size={20} className="text-primary" />
            <h2 className="text-xl font-bold">Monthly Spending</h2>
          </div>
          <div className="h-64 flex items-center justify-center bg-surface-100/50 dark:bg-surface-700/50 rounded-lg">
            <p className="text-surface-500 dark:text-surface-400 text-center">
              Monthly spending chart will appear here<br />
              <span className="text-sm">(Premium feature)</span>
            </p>
          </div>
        </div>
        
        <div className="card p-6">
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-secondary" />
            <h2 className="text-xl font-bold">Marketplace Distribution</h2>
          </div>
          <div className="h-64 flex items-center justify-center bg-surface-100/50 dark:bg-surface-700/50 rounded-lg">
            <p className="text-surface-500 dark:text-surface-400 text-center">
              Marketplace distribution chart will appear here<br />
              <span className="text-sm">(Premium feature)</span>
            </p>
          </div>
        </div>
      </div>
      
      {/* Call to Action */}
      <div className="card overflow-hidden">
        <div className="relative p-8 md:p-10 overflow-hidden">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10 dark:opacity-5">
            <div className="absolute -right-10 -top-10 w-64 h-64 rounded-full bg-primary"></div>
            <div className="absolute -left-10 -bottom-10 w-64 h-64 rounded-full bg-secondary"></div>
          </div>
          
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h2 className="text-2xl font-bold mb-2">Unlock Premium Analytics</h2>
              <p className="text-surface-600 dark:text-surface-400 max-w-xl">
                Get detailed insights, advanced reporting, and marketplace integrations to make smarter purchasing decisions.
              </p>
            </div>
            <button className="btn btn-primary whitespace-nowrap">
              Upgrade to Premium
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home
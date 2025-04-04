import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Plus, 
  X, 
  Calendar, 
  DollarSign, 
  Tag, 
  ShoppingBag, 
  AlertCircle,
  Check,
  Info
} from 'lucide-react'

const MainFeature = () => {
  const [deals, setDeals] = useState([
    {
      id: 1,
      name: "WebFlow Master Suite",
      marketplace: "AppSumo",
      price: 99,
      purchaseDate: "2023-09-10",
      refundDeadline: "2023-10-10",
      category: "Design",
      status: "active"
    },
    {
      id: 2,
      name: "ContentAI Pro",
      marketplace: "StackSocial",
      price: 59,
      purchaseDate: "2023-08-15",
      refundDeadline: "2023-09-14",
      category: "AI Tools",
      status: "active"
    }
  ])
  
  const [formData, setFormData] = useState({
    name: '',
    marketplace: '',
    price: '',
    purchaseDate: '',
    refundWindow: '30',
    category: '',
    status: 'active'
  })
  
  const [formErrors, setFormErrors] = useState({})
  const [isFormOpen, setIsFormOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [successMessage, setSuccessMessage] = useState('')
  
  const marketplaces = [
    "AppSumo", "DealMirror", "SaasMantra", "Rockethub", 
    "DealFuel", "Dealify", "PitchGround", "Prime Club", "StackSocial", "Other"
  ]
  
  const categories = [
    "Design", "Development", "Marketing", "SEO", "AI Tools", 
    "Productivity", "Business", "Education", "Finance", "Other"
  ]
  
  const toggleForm = () => {
    setIsFormOpen(!isFormOpen)
    if (!isFormOpen) {
      // Reset form when opening
      setFormData({
        name: '',
        marketplace: '',
        price: '',
        purchaseDate: '',
        refundWindow: '30',
        category: '',
        status: 'active'
      })
      setFormErrors({})
      setSuccessMessage('')
    }
  }
  
  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }
  
  const validateForm = () => {
    const errors = {}
    
    if (!formData.name.trim()) errors.name = "Deal name is required"
    if (!formData.marketplace) errors.marketplace = "Marketplace is required"
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Valid price is required"
    }
    if (!formData.purchaseDate) errors.purchaseDate = "Purchase date is required"
    if (!formData.category) errors.category = "Category is required"
    
    return errors
  }
  
  const handleSubmit = (e) => {
    e.preventDefault()
    
    const errors = validateForm()
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors)
      return
    }
    
    setIsSubmitting(true)
    
    // Calculate refund deadline based on purchase date and refund window
    const purchaseDate = new Date(formData.purchaseDate)
    const refundDeadline = new Date(purchaseDate)
    refundDeadline.setDate(refundDeadline.getDate() + parseInt(formData.refundWindow))
    
    // Format date to YYYY-MM-DD
    const formatDate = (date) => {
      return date.toISOString().split('T')[0]
    }
    
    // Simulate API call with timeout
    setTimeout(() => {
      const newDeal = {
        id: Date.now(),
        name: formData.name,
        marketplace: formData.marketplace,
        price: parseFloat(formData.price),
        purchaseDate: formData.purchaseDate,
        refundDeadline: formatDate(refundDeadline),
        category: formData.category,
        status: formData.status
      }
      
      setDeals(prev => [newDeal, ...prev])
      setSuccessMessage("Deal added successfully!")
      
      // Reset form after successful submission
      setFormData({
        name: '',
        marketplace: '',
        price: '',
        purchaseDate: '',
        refundWindow: '30',
        category: '',
        status: 'active'
      })
      
      setIsSubmitting(false)
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccessMessage('')
      }, 3000)
    }, 1000)
  }
  
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }
  
  return (
    <div className="card">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <ShoppingBag size={20} className="text-primary" />
            <span>My Lifetime Deals</span>
          </h2>
          <button 
            onClick={toggleForm}
            className={`btn ${isFormOpen ? 'btn-outline' : 'btn-primary'} flex items-center gap-2`}
          >
            {isFormOpen ? (
              <>
                <X size={18} />
                <span>Cancel</span>
              </>
            ) : (
              <>
                <Plus size={18} />
                <span>Add Deal</span>
              </>
            )}
          </button>
        </div>
        
        <AnimatePresence>
          {isFormOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="p-6 bg-surface-50 dark:bg-surface-800/50 rounded-xl mb-6 border border-surface-200 dark:border-surface-700">
                <h3 className="text-lg font-semibold mb-4">Add New Lifetime Deal</h3>
                
                {successMessage && (
                  <div className="mb-4 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2">
                    <Check size={18} />
                    <span>{successMessage}</span>
                  </div>
                )}
                
                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="name">
                        Deal Name*
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className={`input-field ${formErrors.name ? 'border-red-500 dark:border-red-500' : ''}`}
                        placeholder="e.g. WebFlow Master Suite"
                      />
                      {formErrors.name && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{formErrors.name}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="marketplace">
                        Marketplace*
                      </label>
                      <select
                        id="marketplace"
                        name="marketplace"
                        value={formData.marketplace}
                        onChange={handleChange}
                        className={`select-field ${formErrors.marketplace ? 'border-red-500 dark:border-red-500' : ''}`}
                      >
                        <option value="">Select marketplace</option>
                        {marketplaces.map(marketplace => (
                          <option key={marketplace} value={marketplace}>
                            {marketplace}
                          </option>
                        ))}
                      </select>
                      {formErrors.marketplace && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{formErrors.marketplace}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="price">
                        Price ($)*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <DollarSign size={16} className="text-surface-500" />
                        </div>
                        <input
                          type="number"
                          id="price"
                          name="price"
                          value={formData.price}
                          onChange={handleChange}
                          className={`input-field pl-9 ${formErrors.price ? 'border-red-500 dark:border-red-500' : ''}`}
                          placeholder="0.00"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      {formErrors.price && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{formErrors.price}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="purchaseDate">
                        Purchase Date*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Calendar size={16} className="text-surface-500" />
                        </div>
                        <input
                          type="date"
                          id="purchaseDate"
                          name="purchaseDate"
                          value={formData.purchaseDate}
                          onChange={handleChange}
                          className={`input-field pl-9 ${formErrors.purchaseDate ? 'border-red-500 dark:border-red-500' : ''}`}
                        />
                      </div>
                      {formErrors.purchaseDate && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{formErrors.purchaseDate}</span>
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="refundWindow">
                        Refund Window (days)
                      </label>
                      <select
                        id="refundWindow"
                        name="refundWindow"
                        value={formData.refundWindow}
                        onChange={handleChange}
                        className="select-field"
                      >
                        <option value="14">14 days</option>
                        <option value="30">30 days</option>
                        <option value="60">60 days</option>
                        <option value="90">90 days</option>
                      </select>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium mb-1" htmlFor="category">
                        Category*
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                          <Tag size={16} className="text-surface-500" />
                        </div>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleChange}
                          className={`select-field pl-9 ${formErrors.category ? 'border-red-500 dark:border-red-500' : ''}`}
                        >
                          <option value="">Select category</option>
                          {categories.map(category => (
                            <option key={category} value={category}>
                              {category}
                            </option>
                          ))}
                        </select>
                      </div>
                      {formErrors.category && (
                        <p className="mt-1 text-sm text-red-500 flex items-center gap-1">
                          <AlertCircle size={14} />
                          <span>{formErrors.category}</span>
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between mt-6">
                    <div className="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
                      <Info size={14} />
                      <span>Fields marked with * are required</span>
                    </div>
                    <button 
                      type="submit" 
                      className="btn btn-primary"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          <span>Saving...</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-2">
                          <Check size={18} />
                          <span>Save Deal</span>
                        </span>
                      )}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        {/* Deals List */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-surface-200 dark:border-surface-700">
                <th className="text-left py-3 px-4 font-semibold">Deal</th>
                <th className="text-left py-3 px-4 font-semibold">Marketplace</th>
                <th className="text-left py-3 px-4 font-semibold">Price</th>
                <th className="text-left py-3 px-4 font-semibold">Purchase Date</th>
                <th className="text-left py-3 px-4 font-semibold">Refund Deadline</th>
                <th className="text-left py-3 px-4 font-semibold">Category</th>
              </tr>
            </thead>
            <tbody>
              {deals.length > 0 ? (
                deals.map((deal) => (
                  <tr 
                    key={deal.id} 
                    className="border-b border-surface-200 dark:border-surface-700 hover:bg-surface-50 dark:hover:bg-surface-800/50 transition"
                  >
                    <td className="py-3 px-4 font-medium">{deal.name}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-primary">{deal.marketplace}</span>
                    </td>
                    <td className="py-3 px-4">${deal.price}</td>
                    <td className="py-3 px-4">{formatDate(deal.purchaseDate)}</td>
                    <td className="py-3 px-4">{formatDate(deal.refundDeadline)}</td>
                    <td className="py-3 px-4">
                      <span className="badge badge-secondary">{deal.category}</span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-surface-500 dark:text-surface-400">
                    No deals added yet. Click "Add Deal" to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default MainFeature
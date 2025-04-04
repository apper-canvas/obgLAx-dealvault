import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  Tag, 
  AlertCircle,
  Check,
  Info
} from 'lucide-react'

const CreateDeal = () => {
  const navigate = useNavigate()
  
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
      
      // In a real app, you would update global state or make an API call here
      
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
      
      // Redirect back to home after a delay
      setTimeout(() => {
        navigate('/')
      }, 2000)
    }, 1000)
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-3xl mx-auto">
        {/* Page Header */}
        <div className="mb-8 flex items-center">
          <button 
            onClick={() => navigate('/')}
            className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Deal</h1>
            <p className="text-surface-600 dark:text-surface-400">
              Add a new lifetime deal to your collection
            </p>
          </div>
        </div>
        
        {/* Form Card */}
        <div className="card p-6 bg-surface-50 dark:bg-surface-800/50 rounded-xl mb-6 border border-surface-200 dark:border-surface-700">
          {successMessage && (
            <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2">
              <Check size={18} />
              <span>{successMessage}</span>
            </div>
          )}
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
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
            
            <div className="flex items-center justify-between mt-8">
              <div className="flex items-center gap-1 text-sm text-surface-500 dark:text-surface-400">
                <Info size={14} />
                <span>Fields marked with * are required</span>
              </div>
              <div className="flex gap-4">
                <button 
                  type="button" 
                  className="btn btn-outline" 
                  onClick={() => navigate('/')}
                >
                  Cancel
                </button>
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
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default CreateDeal
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  AlertCircle,
  Info,
  Check,
  Calendar,
  DollarSign,
  Tag,
  FileText,
  Clock
} from 'lucide-react';
import { format } from 'date-fns';

const DealForm = ({ initialData = {}, onSubmit, formTitle, submitButtonText, isEdit = false }) => {
  const navigate = useNavigate();
  
  const defaultFormData = {
    name: '',
    marketplace: '',
    price: '',
    purchaseDate: format(new Date(), 'yyyy-MM-dd'),
    refundWindow: '30',
    expiryDate: '',
    category: '',
    status: 'Active',
    description: '',
    notes: '',
    favorite: false
  };
  
  const [formData, setFormData] = useState({...defaultFormData, ...initialData});
  const [formErrors, setFormErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Update form when initialData changes (for edit mode)
  useEffect(() => {
    if (initialData && Object.keys(initialData).length > 0) {
      setFormData({...defaultFormData, ...initialData});
    }
  }, [initialData]);
  
  const marketplaces = [
    "AppSumo", "DealMirror", "SaasMantra", "Rockethub", 
    "DealFuel", "Dealify", "PitchGround", "Prime Club", "StackSocial", "Other"
  ];
  
  const categories = [
    "Design", "Development", "Marketing", "SEO", "AI Tools", 
    "Productivity", "Business", "Education", "Finance", "Other"
  ];
  
  const statuses = [
    "Active", "Refundable", "Expired", "Expiring Soon", "Inactive"
  ];
  
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error for this field if it exists
    if (formErrors[name]) {
      setFormErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };
  
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name.trim()) errors.name = "Deal name is required";
    if (!formData.marketplace) errors.marketplace = "Marketplace is required";
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      errors.price = "Valid price is required";
    }
    if (!formData.purchaseDate) errors.purchaseDate = "Purchase date is required";
    if (!formData.category) errors.category = "Category is required";
    
    return errors;
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Process form data
      const dealData = {
        ...formData,
        price: parseFloat(formData.price)
      };
      
      // Call the onSubmit callback
      await onSubmit(dealData);
      
      setSuccessMessage(isEdit ? "Deal updated successfully!" : "Deal added successfully!");
      
      // Reset form after successful submission (only for create, not edit)
      if (!isEdit) {
        setFormData(defaultFormData);
      }
      
      // Redirect after a delay
      setTimeout(() => {
        navigate('/deals');
      }, 2000);
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleCancel = () => {
    navigate('/deals');
  };
  
  return (
    <div className="form-section">
      <h2 className="text-xl font-semibold mb-6">{formTitle}</h2>
      
      {successMessage && (
        <div className="mb-6 p-3 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg flex items-center gap-2">
          <Check size={18} />
          <span>{successMessage}</span>
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Left Column */}
          <div className="space-y-6">
            <div>
              <label className="form-label" htmlFor="name">
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
                <p className="form-error">
                  <AlertCircle size={14} />
                  <span>{formErrors.name}</span>
                </p>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="marketplace">
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
                <p className="form-error">
                  <AlertCircle size={14} />
                  <span>{formErrors.marketplace}</span>
                </p>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="price">
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
                <p className="form-error">
                  <AlertCircle size={14} />
                  <span>{formErrors.price}</span>
                </p>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="purchaseDate">
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
                <p className="form-error">
                  <AlertCircle size={14} />
                  <span>{formErrors.purchaseDate}</span>
                </p>
              )}
            </div>
          </div>
          
          {/* Right Column */}
          <div className="space-y-6">
            <div>
              <label className="form-label" htmlFor="refundWindow">
                Refund Window (days)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Clock size={16} className="text-surface-500" />
                </div>
                <select
                  id="refundWindow"
                  name="refundWindow"
                  value={formData.refundWindow}
                  onChange={handleChange}
                  className="select-field pl-9"
                >
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                  <option value="60">60 days</option>
                  <option value="90">90 days</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="form-label" htmlFor="expiryDate">
                Expiry Date (if applicable)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <Calendar size={16} className="text-surface-500" />
                </div>
                <input
                  type="date"
                  id="expiryDate"
                  name="expiryDate"
                  value={formData.expiryDate || ''}
                  onChange={handleChange}
                  className="input-field pl-9"
                />
              </div>
              <p className="form-hint">Leave blank for lifetime deals with no expiry</p>
            </div>
            
            <div>
              <label className="form-label" htmlFor="category">
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
                <p className="form-error">
                  <AlertCircle size={14} />
                  <span>{formErrors.category}</span>
                </p>
              )}
            </div>
            
            <div>
              <label className="form-label" htmlFor="status">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="select-field"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>
                    {status}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
        
        {/* Full Width Fields */}
        <div className="space-y-6 mb-6">
          <div>
            <label className="form-label" htmlFor="description">
              Description
            </label>
            <div className="relative">
              <div className="absolute top-3 left-3 pointer-events-none">
                <FileText size={16} className="text-surface-500" />
              </div>
              <textarea
                id="description"
                name="description"
                value={formData.description || ''}
                onChange={handleChange}
                className="input-field pl-9 min-h-[100px]"
                placeholder="Describe what this deal includes..."
              />
            </div>
          </div>
          
          <div>
            <label className="form-label" htmlFor="notes">
              Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes || ''}
              onChange={handleChange}
              className="input-field min-h-[80px]"
              placeholder="Any personal notes about this deal..."
            />
          </div>
          
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              name="favorite"
              checked={formData.favorite}
              onChange={handleChange}
              className="h-4 w-4 text-primary focus:ring-primary border-surface-300 dark:border-surface-600 rounded"
            />
            <label htmlFor="favorite" className="ml-2 block text-sm">
              Mark as favorite
            </label>
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
              onClick={handleCancel}
              className="btn btn-outline"
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
                  <span>{submitButtonText}</span>
                </span>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default DealForm;
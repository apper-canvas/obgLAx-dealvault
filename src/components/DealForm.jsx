import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CalendarIcon, InfoIcon } from 'lucide-react';

const DealForm = ({ initialData, onSubmit, formTitle = "Deal Information", submitButtonText = "Save", isEdit = false }) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  
  // Form state with default values or initial data
  const [formData, setFormData] = useState({
    name: '',
    marketplace: 'AppSumo',
    price: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    status: 'Active',
    favorite: false,
    category: '',
    description: '',
    notes: '',
    refundWindow: '30'
  });

  // Initialize form with provided data if editing
  useEffect(() => {
    if (initialData) {
      setFormData({
        name: initialData.name || '',
        marketplace: initialData.marketplace || 'AppSumo',
        price: initialData.price || '',
        purchaseDate: initialData.purchaseDate || new Date().toISOString().split('T')[0],
        expiryDate: initialData.expiryDate || '',
        status: initialData.status || 'Active',
        favorite: initialData.favorite || false,
        category: initialData.category || '',
        description: initialData.description || '',
        notes: initialData.notes || '',
        refundWindow: initialData.refundWindow || '30'
      });
    }
  }, [initialData]);

  // Handle input changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Form validation
  const validateForm = () => {
    if (!formData.name.trim()) {
      setFormError('Deal name is required');
      return false;
    }
    
    if (!formData.marketplace.trim()) {
      setFormError('Marketplace is required');
      return false;
    }
    
    if (!formData.price || isNaN(formData.price) || Number(formData.price) <= 0) {
      setFormError('Please enter a valid price');
      return false;
    }
    
    if (!formData.purchaseDate) {
      setFormError('Purchase date is required');
      return false;
    }
    
    setFormError(null);
    return true;
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      // Format the data
      const submissionData = {
        ...formData,
        price: Number(formData.price)
      };
      
      const success = await onSubmit(submissionData);
      
      if (success) {
        setSuccessMessage(isEdit ? 'Deal updated successfully!' : 'Deal created successfully!');
        
        // Redirect after a brief delay to show success message
        setTimeout(() => {
          navigate(isEdit ? `/deals/${initialData.id}` : '/deals');
        }, 1500);
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setFormError('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="card p-6">
      <h2 className="text-xl font-bold mb-6">{formTitle}</h2>
      
      {/* Success message */}
      {successMessage && (
        <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 rounded-lg">
          {successMessage}
        </div>
      )}
      
      {/* Error message */}
      {formError && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
          {formError}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Deal Name */}
          <div className="col-span-2">
            <label htmlFor="name" className="form-label">
              Deal Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-input"
              placeholder="e.g. DesignPro Suite"
              required
            />
          </div>
          
          {/* Marketplace */}
          <div>
            <label htmlFor="marketplace" className="form-label">
              Marketplace <span className="text-red-500">*</span>
            </label>
            <select
              id="marketplace"
              name="marketplace"
              value={formData.marketplace}
              onChange={handleChange}
              className="form-select"
              required
            >
              <option value="AppSumo">AppSumo</option>
              <option value="StackSocial">StackSocial</option>
              <option value="DealMirror">DealMirror</option>
              <option value="PitchGround">PitchGround</option>
              <option value="Dealify">Dealify</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Price */}
          <div>
            <label htmlFor="price" className="form-label">
              Price (USD) <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <span className="text-surface-400">$</span>
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                className="form-input pl-8"
                placeholder="0.00"
                min="0"
                step="0.01"
                required
              />
            </div>
          </div>
          
          {/* Category */}
          <div>
            <label htmlFor="category" className="form-label">Category</label>
            <select
              id="category"
              name="category"
              value={formData.category}
              onChange={handleChange}
              className="form-select"
            >
              <option value="">Select a category</option>
              <option value="Marketing">Marketing</option>
              <option value="Design">Design</option>
              <option value="Development">Development</option>
              <option value="Business">Business</option>
              <option value="AI Tools">AI Tools</option>
              <option value="Productivity">Productivity</option>
              <option value="Other">Other</option>
            </select>
          </div>
          
          {/* Status */}
          <div>
            <label htmlFor="status" className="form-label">Status</label>
            <select
              id="status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="form-select"
            >
              <option value="Active">Active</option>
              <option value="Inactive">Inactive</option>
              <option value="Refundable">Refundable</option>
              <option value="Expiring Soon">Expiring Soon</option>
              <option value="Expired">Expired</option>
            </select>
          </div>
          
          {/* Purchase Date */}
          <div>
            <label htmlFor="purchaseDate" className="form-label">
              Purchase Date <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon size={16} className="text-surface-400" />
              </div>
              <input
                type="date"
                id="purchaseDate"
                name="purchaseDate"
                value={formData.purchaseDate}
                onChange={handleChange}
                className="form-input pl-10"
                required
              />
            </div>
          </div>
          
          {/* Expiry Date */}
          <div>
            <label htmlFor="expiryDate" className="form-label">Expiry Date</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <CalendarIcon size={16} className="text-surface-400" />
              </div>
              <input
                type="date"
                id="expiryDate"
                name="expiryDate"
                value={formData.expiryDate}
                onChange={handleChange}
                className="form-input pl-10"
              />
            </div>
          </div>
          
          {/* Refund Window */}
          <div>
            <label htmlFor="refundWindow" className="form-label">Refund Window (days)</label>
            <input
              type="number"
              id="refundWindow"
              name="refundWindow"
              value={formData.refundWindow}
              onChange={handleChange}
              className="form-input"
              min="0"
            />
            <p className="mt-1 text-sm text-surface-500 dark:text-surface-400">
              Number of days you can request a refund
            </p>
          </div>
          
          {/* Favorite */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="favorite"
              name="favorite"
              checked={formData.favorite}
              onChange={handleChange}
              className="form-checkbox"
            />
            <label htmlFor="favorite" className="ml-2 text-surface-700 dark:text-surface-300">
              Mark as favorite
            </label>
          </div>
          
          {/* Description */}
          <div className="col-span-2">
            <label htmlFor="description" className="form-label">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Brief description of what this deal includes"
            ></textarea>
          </div>
          
          {/* Notes */}
          <div className="col-span-2">
            <label htmlFor="notes" className="form-label">
              Notes
              <span className="ml-1 text-surface-500">
                <InfoIcon size={14} className="inline" />
                <span className="ml-1 text-sm font-normal">
                  (private, e.g., license keys, redemption codes, etc.)
                </span>
              </span>
            </label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              className="form-textarea"
              rows="3"
              placeholder="Any private notes, codes, or important details"
            ></textarea>
          </div>
        </div>
        
        {/* Form Actions */}
        <div className="flex justify-end gap-4 mt-8">
          <button
            type="button"
            onClick={() => navigate('/deals')}
            className="btn btn-outline"
            disabled={isSubmitting}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <div className="flex items-center">
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Processing...</span>
              </div>
            ) : submitButtonText}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DealForm;
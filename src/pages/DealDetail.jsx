import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, parseISO, isValid, differenceInDays } from 'date-fns';
import { 
  ChevronRight, 
  Edit, 
  Trash, 
  Calendar, 
  DollarSign, 
  Tag, 
  ShoppingBag, 
  Star, 
  StarOff,
  AlertCircle,
  ArrowLeft
} from 'lucide-react';
import { motion } from 'framer-motion';
import { useDeals } from '../context/DealContext';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDealById, deleteDeal, toggleFavorite } = useDeals();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  
  useEffect(() => {
    const fetchDeal = () => {
      try {
        const foundDeal = getDealById(parseInt(id));
        if (foundDeal) {
          setDeal(foundDeal);
        } else {
          setError('Deal not found');
          // Redirect after a delay
          setTimeout(() => {
            navigate('/deals', { replace: true });
          }, 2000);
        }
      } catch (err) {
        setError('Error loading deal details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeal();
  }, [id, getDealById, navigate]);
  
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMMM d, yyyy') : 'N/A';
    } catch (e) {
      return 'N/A';
    }
  };
  
  const handleDeleteClick = () => {
    setDeleteModalOpen(true);
  };
  
  const confirmDelete = () => {
    deleteDeal(parseInt(id));
    setDeleteModalOpen(false);
    navigate('/deals', { replace: true });
  };
  
  const handleFavoriteToggle = () => {
    toggleFavorite(parseInt(id));
    // Update the local state to reflect the change
    setDeal(prev => ({
      ...prev,
      favorite: !prev.favorite
    }));
  };
  
  // Calculate days left for refund or until expiry
  const getTimeRemaining = () => {
    if (!deal) return null;
    
    const now = new Date();
    const refundDate = deal.refundDeadline ? parseISO(deal.refundDeadline) : null;
    const expiryDate = deal.expiryDate ? parseISO(deal.expiryDate) : null;
    
    // If still refundable
    if (refundDate && refundDate > now) {
      const daysLeft = differenceInDays(refundDate, now);
      return {
        type: 'refund',
        days: daysLeft,
        text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} left for refund`
      };
    }
    
    // If expiry date is set
    if (expiryDate) {
      if (expiryDate < now) {
        return {
          type: 'expired',
          days: 0,
          text: 'Deal has expired'
        };
      } else {
        const daysLeft = differenceInDays(expiryDate, now);
        return {
          type: 'expiry',
          days: daysLeft,
          text: `${daysLeft} day${daysLeft !== 1 ? 's' : ''} until expiry`
        };
      }
    }
    
    return null;
  };
  
  // Determine status badge color
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'Active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'Inactive':
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
      case 'Refundable':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'Expiring Soon':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'Expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Get time remaining badge style
  const getTimeRemainingBadgeClass = (type) => {
    switch (type) {
      case 'refund':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'expiry':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">Loading deal details...</span>
        </div>
      </div>
    );
  }
  
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="p-6 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
          <h2 className="text-xl font-bold mb-2">Error</h2>
          <p>{error}</p>
          <div className="mt-4">
            <Link to="/deals" className="btn btn-outline">
              Return to Deals
            </Link>
          </div>
        </div>
      </div>
    );
  }
  
  if (!deal) return null;
  
  const timeRemaining = getTimeRemaining();
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-6">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-separator">
          <ChevronRight size={16} />
        </span>
        <Link to="/deals" className="breadcrumb-item">My Deals</Link>
        <span className="breadcrumb-separator">
          <ChevronRight size={16} />
        </span>
        <span className="text-surface-900 dark:text-surface-100">{deal.name}</span>
      </div>
      
      {/* Deal Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl md:text-3xl font-bold">{deal.name}</h1>
          <button 
            onClick={handleFavoriteToggle}
            className={`p-1 text-${deal.favorite ? 'yellow-500' : 'surface-400'} hover:text-yellow-500 transition`}
            aria-label={deal.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            {deal.favorite ? <Star size={24} fill="currentColor" /> : <StarOff size={24} />}
          </button>
        </div>
        
        <div className="flex items-center gap-3">
          <Link 
            to={`/deals/${id}/edit`}
            className="btn btn-outline flex items-center gap-2"
          >
            <Edit size={18} />
            <span>Edit</span>
          </Link>
          <button 
            onClick={handleDeleteClick}
            className="btn btn-danger flex items-center gap-2"
          >
            <Trash size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      {/* Deal Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="card-neu p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
              <DollarSign size={20} className="text-primary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Price</h3>
              <p className="text-2xl font-bold">${deal.price.toFixed(2)}</p>
            </div>
          </div>
          <div className="text-sm text-surface-600 dark:text-surface-400">
            Purchased from <span className="font-medium text-surface-900 dark:text-surface-100">{deal.marketplace}</span>
          </div>
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="card-neu p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
              <Calendar size={20} className="text-secondary" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Purchase Date</h3>
              <p className="text-xl font-bold">{formatDate(deal.purchaseDate)}</p>
            </div>
          </div>
          {timeRemaining && (
            <div className={`text-sm px-3 py-1 rounded-full inline-block ${getTimeRemainingBadgeClass(timeRemaining.type)}`}>
              {timeRemaining.text}
            </div>
          )}
        </motion.div>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="card-neu p-6"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
              <Tag size={20} className="text-accent" />
            </div>
            <div>
              <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400">Status</h3>
              <div className="flex items-center gap-2">
                <span className={`px-3 py-1 text-sm font-medium rounded-full ${getStatusBadgeClass(deal.status)}`}>
                  {deal.status}
                </span>
              </div>
            </div>
          </div>
          {deal.category && (
            <div className="text-sm text-surface-600 dark:text-surface-400">
              Category: <span className="font-medium text-surface-900 dark:text-surface-100">{deal.category}</span>
            </div>
          )}
        </motion.div>
      </div>
      
      {/* Deal Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Main Details */}
        <div className="lg:col-span-2">
          <div className="card p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">Deal Details</h2>
            
            {deal.description ? (
              <div className="mb-6">
                <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Description</h3>
                <p className="text-surface-800 dark:text-surface-200">{deal.description}</p>
              </div>
            ) : (
              <div className="mb-6 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg border border-dashed border-surface-200 dark:border-surface-600 text-surface-500 dark:text-surface-400 text-center">
                No description available
              </div>
            )}
            
            {deal.notes ? (
              <div>
                <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-2">Notes</h3>
                <div className="p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
                  <p className="text-surface-800 dark:text-surface-200 whitespace-pre-line">{deal.notes}</p>
                </div>
              </div>
            ) : null}
          </div>
          
          {/* Important Dates */}
          <div className="card p-6">
            <h2 className="text-xl font-bold mb-4">Important Dates</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-surface-400" />
                  <span className="text-surface-700 dark:text-surface-300">Purchase Date</span>
                </div>
                <span className="font-medium">{formatDate(deal.purchaseDate)}</span>
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Calendar size={18} className={new Date(deal.refundDeadline) > new Date() ? "text-blue-500" : "text-surface-400"} />
                  <span className="text-surface-700 dark:text-surface-300">Refund Deadline</span>
                </div>
                <span className="font-medium">{formatDate(deal.refundDeadline)}</span>
              </div>
              
              {deal.expiryDate && (
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Calendar size={18} className={new Date(deal.expiryDate) > new Date() ? "text-yellow-500" : "text-red-500"} />
                    <span className="text-surface-700 dark:text-surface-300">Expiry Date</span>
                  </div>
                  <span className="font-medium">{formatDate(deal.expiryDate)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="lg:col-span-1">
          {/* Quick Actions */}
          <div className="card p-6 mb-6">
            <h2 className="text-lg font-bold mb-4">Quick Actions</h2>
            <div className="space-y-3">
              <Link 
                to={`/deals/${id}/edit`}
                className="flex items-center justify-between p-3 rounded-lg bg-surface-50 hover:bg-surface-100 dark:bg-surface-700 dark:hover:bg-surface-600 transition"
              >
                <span className="font-medium">Edit Deal</span>
                <Edit size={18} />
              </Link>
              <button 
                onClick={handleFavoriteToggle}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-surface-50 hover:bg-surface-100 dark:bg-surface-700 dark:hover:bg-surface-600 transition"
              >
                <span className="font-medium">{deal.favorite ? "Remove from Favorites" : "Add to Favorites"}</span>
                {deal.favorite ? <Star size={18} /> : <StarOff size={18} />}
              </button>
              <button 
                onClick={handleDeleteClick}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-red-50 hover:bg-red-100 dark:bg-red-900/20 dark:hover:bg-red-900/30 text-red-800 dark:text-red-400 transition"
              >
                <span className="font-medium">Delete Deal</span>
                <Trash size={18} />
              </button>
            </div>
          </div>
          
          {/* Refund Information */}
          {new Date(deal.refundDeadline) > new Date() && (
            <div className="card p-6 mb-6 border-l-4 border-blue-500 dark:border-blue-600">
              <div className="flex items-start gap-3">
                <AlertCircle size={24} className="text-blue-500 mt-1" />
                <div>
                  <h3 className="font-bold text-lg mb-1">Refund Available</h3>
                  <p className="text-surface-600 dark:text-surface-400 mb-3">
                    This deal is still within its refund window. You have {differenceInDays(new Date(deal.refundDeadline), new Date())} days left.
                  </p>
                  <div className="text-sm font-medium">
                    Refund deadline: {formatDate(deal.refundDeadline)}
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Related Information */}
          <div className="card p-6">
            <h2 className="text-lg font-bold mb-4">Marketplace</h2>
            <div className="flex items-center gap-3 p-4 bg-surface-50 dark:bg-surface-700 rounded-lg">
              <ShoppingBag size={24} className="text-surface-400" />
              <div>
                <h3 className="font-medium mb-1">{deal.marketplace}</h3>
                <p className="text-sm text-surface-500 dark:text-surface-400">Visit the marketplace to manage your purchase</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Back Navigation */}
      <div className="mb-8">
        <Link to="/deals" className="btn btn-outline flex items-center gap-2">
          <ArrowLeft size={18} />
          <span>Back to All Deals</span>
        </Link>
      </div>
      
      {/* Delete Confirmation Modal */}
      {deleteModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-2">Delete Deal</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to delete <span className="font-medium">{deal.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteModalOpen(false)}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn btn-danger"
              >
                Delete Deal
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealDetail;
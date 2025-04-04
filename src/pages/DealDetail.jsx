import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { format, isPast, isFuture, isToday } from 'date-fns';
import { 
  ChevronRight, 
  Calendar, 
  DollarSign, 
  Building, 
  Tag, 
  Clock, 
  Edit, 
  Trash2, 
  ArrowLeft, 
  Star, 
  FileText, 
  Link as LinkIcon,
  AlertTriangle,
  ExternalLink
} from 'lucide-react';
import { useDeals } from '../context/DealContext';
import DealTagBadge from '../components/DealTagBadge';

const DealDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDealById, toggleFavorite, deleteDeal } = useDeals();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  
  useEffect(() => {
    const fetchDeal = () => {
      try {
        const foundDeal = getDealById(parseInt(id));
        if (foundDeal) {
          setDeal(foundDeal);
        } else {
          // Deal not found, redirect
          navigate('/deals', { replace: true });
        }
      } catch (error) {
        console.error('Error fetching deal:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchDeal();
  }, [id, getDealById, navigate]);
  
  const handleToggleFavorite = () => {
    toggleFavorite(id);
    setDeal(prev => ({ ...prev, favorite: !prev.favorite }));
  };
  
  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };
  
  const confirmDelete = () => {
    deleteDeal(id);
    navigate('/deals', { replace: true });
  };
  
  const cancelDelete = () => {
    setShowDeleteConfirm(false);
  };
  
  const formatDateDisplay = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      return format(date, 'MMM d, yyyy');
    } catch (error) {
      return 'Invalid Date';
    }
  };
  
  // Check if the deal is within the refund period
  const isRefundable = (deal) => {
    if (!deal || !deal.refundDeadline) return false;
    const deadline = new Date(deal.refundDeadline);
    return isFuture(deadline) || isToday(deadline);
  };
  
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center h-64">
        <div className="flex items-center gap-2">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="text-lg">Loading deal...</span>
        </div>
      </div>
    );
  }
  
  if (!deal) return null;
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb">
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
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => navigate('/deals')}
            className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition"
            aria-label="Go back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl md:text-3xl font-bold">{deal.name}</h1>
          <button 
            onClick={handleToggleFavorite}
            className={`p-2 rounded-lg ${deal.favorite ? 'text-yellow-500' : 'text-surface-400 hover:text-yellow-500'} transition`}
            aria-label={deal.favorite ? "Remove from favorites" : "Add to favorites"}
          >
            <Star size={20} fill={deal.favorite ? "currentColor" : "none"} />
          </button>
        </div>
        <div className="flex gap-3">
          <Link to={`/deals/${id}/edit`} className="btn btn-outline flex items-center gap-2">
            <Edit size={18} />
            <span>Edit</span>
          </Link>
          <button onClick={handleDeleteClick} className="btn btn-outline border-red-300 hover:bg-red-50 text-red-600 dark:border-red-700 dark:hover:bg-red-900/20 dark:text-red-400 flex items-center gap-2">
            <Trash2 size={18} />
            <span>Delete</span>
          </button>
        </div>
      </div>
      
      {/* Status Banner - Show if refundable */}
      {isRefundable(deal) && deal.status === "Refundable" && (
        <div className="mb-8 p-4 bg-amber-50 border border-amber-200 dark:bg-amber-900/20 dark:border-amber-700 rounded-lg flex items-center gap-3">
          <AlertTriangle size={24} className="text-amber-500 dark:text-amber-400" />
          <div>
            <h3 className="font-semibold text-amber-800 dark:text-amber-300">Refund Period Active</h3>
            <p className="text-amber-700 dark:text-amber-400">
              This deal is still within its refund window which ends on {formatDateDisplay(deal.refundDeadline)}.
            </p>
          </div>
        </div>
      )}
      
      {/* Deal Info Card */}
      <div className="card mb-8">
        <div className="p-6 border-b border-surface-200 dark:border-surface-700 flex flex-wrap items-center justify-between gap-4">
          <DealTagBadge status={deal.status} />
          <div className="flex items-center gap-3">
            <div className="badge badge-primary">{deal.marketplace}</div>
            <div className="badge badge-secondary">{deal.category}</div>
          </div>
        </div>
        
        {/* Deal Details */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h2 className="text-lg font-semibold mb-4">Deal Information</h2>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <DollarSign size={16} className="text-primary" />
                    <span>Price</span>
                  </div>
                </div>
                <div className="detail-value font-semibold">${deal.price.toFixed(2)}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <Building size={16} className="text-primary" />
                    <span>Marketplace</span>
                  </div>
                </div>
                <div className="detail-value">{deal.marketplace}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <Tag size={16} className="text-primary" />
                    <span>Category</span>
                  </div>
                </div>
                <div className="detail-value">{deal.category}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>Purchase Date</span>
                  </div>
                </div>
                <div className="detail-value">{formatDateDisplay(deal.purchaseDate)}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-primary" />
                    <span>Refund Deadline</span>
                  </div>
                </div>
                <div className="detail-value">{formatDateDisplay(deal.refundDeadline)}</div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-primary" />
                    <span>Expiry Date</span>
                  </div>
                </div>
                <div className="detail-value">
                  {deal.expiryDate ? formatDateDisplay(deal.expiryDate) : 'Lifetime Deal (No Expiry)'}
                </div>
              </div>
            </div>
            
            <div>
              <h2 className="text-lg font-semibold mb-4">Additional Information</h2>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span>Description</span>
                  </div>
                </div>
                <div className="detail-value">
                  {deal.description || 'No description provided'}
                </div>
              </div>
              
              <div className="detail-row">
                <div className="detail-label">
                  <div className="flex items-center gap-2">
                    <FileText size={16} className="text-primary" />
                    <span>Notes</span>
                  </div>
                </div>
                <div className="detail-value whitespace-pre-line">
                  {deal.notes || 'No notes added'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Actions Card */}
      <div className="card mb-8">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">Deal Actions</h2>
          <div className="flex flex-wrap gap-4">
            <a 
              href={`https://${deal.marketplace.toLowerCase().replace(' ', '')}.com`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-outline flex items-center gap-2"
            >
              <ExternalLink size={18} />
              <span>Visit Marketplace</span>
            </a>
            <button className="btn btn-outline flex items-center gap-2">
              <LinkIcon size={18} />
              <span>Copy Deal Link</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 dark:bg-black/70 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-surface-800 rounded-xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold mb-4">Delete Deal?</h3>
            <p className="mb-6 text-surface-600 dark:text-surface-400">
              Are you sure you want to delete <span className="font-semibold text-surface-900 dark:text-surface-100">{deal.name}</span>? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button 
                onClick={cancelDelete}
                className="btn btn-outline"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDelete}
                className="btn bg-red-600 hover:bg-red-700 text-white"
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
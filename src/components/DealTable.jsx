import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Star, 
  StarOff, 
  ArrowUpDown, 
  Eye, 
  Edit, 
  Trash, 
  MoreHorizontal 
} from 'lucide-react';
import { useDeals } from '../context/DealContext';
import { format, parseISO, isValid } from 'date-fns';

const DealTable = ({ deals }) => {
  const { toggleFavorite, deleteDeal } = useDeals();
  const [sortConfig, setSortConfig] = useState({ key: 'purchaseDate', direction: 'desc' });
  const [showConfirmDelete, setShowConfirmDelete] = useState(null);

  // Format date for display
  const formatDate = (dateString) => {
    try {
      const date = parseISO(dateString);
      return isValid(date) ? format(date, 'MMM d, yyyy') : 'N/A';
    } catch (e) {
      return 'N/A';
    }
  };

  // Handle sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };
  
  // Get status badge color
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
  
  // Sort the deals
  const sortedDeals = [...deals].sort((a, b) => {
    if (sortConfig.key === 'price') {
      return sortConfig.direction === 'asc' 
        ? a.price - b.price 
        : b.price - a.price;
    }
    
    if (sortConfig.key === 'purchaseDate' || sortConfig.key === 'expiryDate') {
      const dateA = new Date(a[sortConfig.key] || 0);
      const dateB = new Date(b[sortConfig.key] || 0);
      return sortConfig.direction === 'asc' 
        ? dateA - dateB 
        : dateB - dateA;
    }
    
    if (a[sortConfig.key] < b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (a[sortConfig.key] > b[sortConfig.key]) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
  
  // Handle delete confirmation
  const handleDeleteClick = (dealId) => {
    setShowConfirmDelete(dealId);
  };
  
  const confirmDelete = (dealId) => {
    deleteDeal(dealId);
    setShowConfirmDelete(null);
  };
  
  const cancelDelete = () => {
    setShowConfirmDelete(null);
  };

  // Handle favorite toggle
  const handleFavoriteToggle = (dealId) => {
    toggleFavorite(dealId);
  };
  
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-surface-800 rounded-lg overflow-hidden">
        <thead className="bg-surface-50 dark:bg-surface-700 text-surface-500 dark:text-surface-300">
          <tr>
            <th className="p-3 text-left font-medium">
              <span className="sr-only">Favorite</span>
            </th>
            <th 
              className="p-3 text-left font-medium cursor-pointer" 
              onClick={() => requestSort('name')}
            >
              <div className="flex items-center gap-1">
                <span>Deal</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th 
              className="p-3 text-left font-medium cursor-pointer" 
              onClick={() => requestSort('marketplace')}
            >
              <div className="flex items-center gap-1">
                <span>Marketplace</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th 
              className="p-3 text-left font-medium cursor-pointer" 
              onClick={() => requestSort('price')}
            >
              <div className="flex items-center gap-1">
                <span>Price</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th 
              className="p-3 text-left font-medium cursor-pointer" 
              onClick={() => requestSort('purchaseDate')}
            >
              <div className="flex items-center gap-1">
                <span>Purchase Date</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th 
              className="p-3 text-left font-medium cursor-pointer" 
              onClick={() => requestSort('status')}
            >
              <div className="flex items-center gap-1">
                <span>Status</span>
                <ArrowUpDown size={14} />
              </div>
            </th>
            <th className="p-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-surface-100 dark:divide-surface-700">
          {sortedDeals.map((deal) => (
            <tr 
              key={deal.id} 
              className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition"
            >
              <td className="p-3">
                <button 
                  onClick={() => handleFavoriteToggle(deal.id)}
                  className={`text-${deal.favorite ? 'yellow-500' : 'surface-400'} hover:text-yellow-500 transition`}
                  aria-label={deal.favorite ? "Remove from favorites" : "Add to favorites"}
                >
                  {deal.favorite ? <Star size={18} fill="currentColor" /> : <StarOff size={18} />}
                </button>
              </td>
              <td className="p-3 font-medium">
                <Link to={`/deals/${deal.id}`} className="hover:text-primary dark:hover:text-primary-light transition">
                  {deal.name}
                </Link>
              </td>
              <td className="p-3 text-surface-600 dark:text-surface-400">{deal.marketplace}</td>
              <td className="p-3 text-surface-600 dark:text-surface-400">${deal.price.toFixed(2)}</td>
              <td className="p-3 text-surface-600 dark:text-surface-400">{formatDate(deal.purchaseDate)}</td>
              <td className="p-3">
                <span className={`inline-block px-2 py-1 text-xs font-medium rounded-full ${getStatusBadgeClass(deal.status)}`}>
                  {deal.status}
                </span>
              </td>
              <td className="p-3 text-right">
                <div className="flex items-center justify-end gap-2">
                  <Link 
                    to={`/deals/${deal.id}`}
                    className="p-1 text-surface-500 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light transition"
                    aria-label="View deal details"
                  >
                    <Eye size={18} />
                  </Link>
                  <Link 
                    to={`/deals/${deal.id}/edit`}
                    className="p-1 text-surface-500 hover:text-blue-600 dark:text-surface-400 dark:hover:text-blue-400 transition"
                    aria-label="Edit deal"
                  >
                    <Edit size={18} />
                  </Link>
                  <button 
                    onClick={() => handleDeleteClick(deal.id)}
                    className="p-1 text-surface-500 hover:text-red-600 dark:text-surface-400 dark:hover:text-red-400 transition"
                    aria-label="Delete deal"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Delete Confirmation Modal */}
      {showConfirmDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-surface-800 rounded-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="text-surface-600 dark:text-surface-400 mb-6">
              Are you sure you want to delete this deal? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={cancelDelete}
                className="px-4 py-2 rounded-lg bg-surface-200 hover:bg-surface-300 dark:bg-surface-700 dark:hover:bg-surface-600 text-surface-700 dark:text-surface-300 transition"
              >
                Cancel
              </button>
              <button 
                onClick={() => confirmDelete(showConfirmDelete)}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white transition"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealTable;
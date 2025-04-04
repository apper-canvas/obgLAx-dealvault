import React, { useState } from 'react';
import { ChevronDown, ChevronUp, MoreHorizontal, Star, Download, Edit, Trash2 } from 'lucide-react';
import DealTagBadge from './DealTagBadge';
import { format } from 'date-fns';

const DealTable = ({ deals }) => {
  const [sortField, setSortField] = useState('name');
  const [sortDirection, setSortDirection] = useState('asc');
  const [actionsOpenFor, setActionsOpenFor] = useState(null);

  // Function to toggle sort direction or set a new sort field
  const handleSort = (field) => {
    if (field === sortField) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon based on field and current sort state
  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    return sortDirection === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />;
  };

  // Sort deals based on current sort field and direction
  const sortedDeals = [...deals].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];
    
    // Handle special cases (date fields, nested objects, etc.)
    if (sortField === 'purchaseDate' || sortField === 'refundDeadline' || sortField === 'expiryDate') {
      valA = new Date(valA);
      valB = new Date(valB);
    }
    
    if (valA === valB) return 0;
    
    if (sortDirection === 'asc') {
      return valA > valB ? 1 : -1;
    } else {
      return valA < valB ? 1 : -1;
    }
  });

  // Toggle actions dropdown for a specific deal
  const toggleActions = (dealId) => {
    if (actionsOpenFor === dealId) {
      setActionsOpenFor(null);
    } else {
      setActionsOpenFor(dealId);
    }
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return format(new Date(dateString), 'MMM d, yyyy');
    } catch (e) {
      return 'Invalid Date';
    }
  };

  return (
    <div className="overflow-x-auto rounded-lg border border-surface-200 dark:border-surface-700">
      <table className="min-w-full divide-y divide-surface-200 dark:divide-surface-700">
        <thead className="bg-surface-50 dark:bg-surface-800">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('name')} 
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-light transition"
              >
                Deal Name {getSortIcon('name')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('marketplace')} 
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-light transition"
              >
                Marketplace {getSortIcon('marketplace')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('price')} 
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-light transition"
              >
                Price {getSortIcon('price')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('purchaseDate')} 
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-light transition"
              >
                Purchase Date {getSortIcon('purchaseDate')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              <button 
                onClick={() => handleSort('status')} 
                className="flex items-center gap-1 hover:text-primary dark:hover:text-primary-light transition"
              >
                Status {getSortIcon('status')}
              </button>
            </th>
            <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-surface-500 dark:text-surface-400 uppercase tracking-wider">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-surface-800 divide-y divide-surface-200 dark:divide-surface-700">
          {sortedDeals.map((deal) => (
            <tr key={deal.id} className="hover:bg-surface-50 dark:hover:bg-surface-700/50 transition">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  {deal.favorite && (
                    <Star size={16} className="text-yellow-500 mr-2" fill="currentColor" />
                  )}
                  <div className="text-sm font-medium">{deal.name}</div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-surface-900 dark:text-surface-200">{deal.marketplace}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-surface-900 dark:text-surface-200">${deal.price}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-surface-900 dark:text-surface-200">{formatDate(deal.purchaseDate)}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <DealTagBadge status={deal.status} />
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium relative">
                <button 
                  onClick={() => toggleActions(deal.id)}
                  className="text-surface-400 hover:text-surface-600 dark:text-surface-300 dark:hover:text-surface-100 transition"
                  aria-label="More options"
                >
                  <MoreHorizontal size={20} />
                </button>
                
                {/* Actions Dropdown */}
                {actionsOpenFor === deal.id && (
                  <div className="absolute right-6 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-surface-700 ring-1 ring-black ring-opacity-5 z-10">
                    <div className="py-1" role="menu" aria-orientation="vertical">
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-600 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Edit size={16} />
                        Edit Deal
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-surface-700 dark:text-surface-200 hover:bg-surface-100 dark:hover:bg-surface-600 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Download size={16} />
                        Download Invoice
                      </button>
                      <button
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 flex items-center gap-2"
                        role="menuitem"
                      >
                        <Trash2 size={16} />
                        Delete Deal
                      </button>
                    </div>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DealTable;
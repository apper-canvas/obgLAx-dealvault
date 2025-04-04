import { useState, useEffect } from 'react';
import { Search, Filter, X } from 'lucide-react';

const DealFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [status, setStatus] = useState('all');
  const [marketplace, setMarketplace] = useState('all');
  const [priceRange, setPriceRange] = useState('all');
  const [dateRange, setDateRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Marketplaces list for the filter
  const marketplaces = [
    { id: 'all', name: 'All Marketplaces' },
    { id: 'appsumo', name: 'AppSumo' },
    { id: 'dealmirror', name: 'DealMirror' },
    { id: 'pitchground', name: 'PitchGround' },
    { id: 'stacksocial', name: 'StackSocial' },
    { id: 'dealify', name: 'Dealify' },
    { id: 'other', name: 'Other' }
  ];

  // Status options for the filter
  const statuses = [
    { id: 'all', name: 'All Statuses' },
    { id: 'active', name: 'Active' },
    { id: 'inactive', name: 'Inactive' },
    { id: 'refundable', name: 'Refundable' },
    { id: 'expiring', name: 'Expiring Soon' },
    { id: 'expired', name: 'Expired' }
  ];

  // Price range options
  const priceRanges = [
    { id: 'all', name: 'All Prices' },
    { id: '0-50', name: 'Under $50' },
    { id: '50-100', name: '$50 - $100' },
    { id: '100-200', name: '$100 - $200' },
    { id: '200-500', name: '$200 - $500' },
    { id: '500-+', name: 'Over $500' }
  ];

  // Date range options
  const dateRanges = [
    { id: 'all', name: 'All Time' },
    { id: 'last-30', name: 'Last 30 Days' },
    { id: 'last-90', name: 'Last 90 Days' },
    { id: 'this-year', name: 'This Year' },
    { id: 'last-year', name: 'Last Year' }
  ];

  // Update filters
  useEffect(() => {
    const filterOptions = {
      searchTerm,
      status,
      marketplace,
      priceRange,
      dateRange
    };
    
    onFilterChange(filterOptions);
  }, [searchTerm, status, marketplace, priceRange, dateRange, onFilterChange]);

  // Handle search input changes
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setStatus('all');
    setMarketplace('all');
    setPriceRange('all');
    setDateRange('all');
  };

  // Count active filters
  const activeFilterCount = [
    status !== 'all',
    marketplace !== 'all',
    priceRange !== 'all',
    dateRange !== 'all'
  ].filter(Boolean).length;

  return (
    <div className="mb-6">
      {/* Search and Filter Toggle */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex-grow relative">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <Search size={18} className="text-surface-400" />
          </div>
          <input
            type="text"
            className="w-full py-2 px-10 border border-surface-200 dark:border-surface-700 rounded-lg bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute inset-y-0 right-0 flex items-center pr-3 text-surface-400 hover:text-surface-600"
              aria-label="Clear search"
            >
              <X size={18} />
            </button>
          )}
        </div>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="btn btn-outline flex items-center gap-2"
        >
          <Filter size={18} />
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="ml-1 px-2 py-0.5 text-xs font-medium bg-primary text-white rounded-full">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Panel */}
      {showFilters && (
        <div className="p-4 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700 mb-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label htmlFor="statusFilter" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                Status
              </label>
              <select
                id="statusFilter"
                className="w-full form-select"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                {statuses.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* Marketplace Filter */}
            <div>
              <label htmlFor="marketplaceFilter" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                Marketplace
              </label>
              <select
                id="marketplaceFilter"
                className="w-full form-select"
                value={marketplace}
                onChange={(e) => setMarketplace(e.target.value)}
              >
                {marketplaces.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label htmlFor="priceFilter" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                Price Range
              </label>
              <select
                id="priceFilter"
                className="w-full form-select"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
              >
                {priceRanges.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label htmlFor="dateFilter" className="block mb-1 text-sm font-medium text-surface-700 dark:text-surface-300">
                Purchase Date
              </label>
              <select
                id="dateFilter"
                className="w-full form-select"
                value={dateRange}
                onChange={(e) => setDateRange(e.target.value)}
              >
                {dateRanges.map(option => (
                  <option key={option.id} value={option.id}>{option.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={clearFilters}
              className="flex items-center gap-1 text-surface-600 hover:text-primary dark:text-surface-400 dark:hover:text-primary-light"
            >
              <X size={16} />
              <span>Clear filters</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealFilter;
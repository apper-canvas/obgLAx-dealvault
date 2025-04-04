import React, { useState } from 'react';
import { Search, Filter, X } from 'lucide-react';

const DealFilter = ({ onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    status: 'all',
    marketplace: 'all',
    priceRange: 'all',
    dateRange: 'all'
  });

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onFilterChange({ searchTerm: value, ...filters });
  };

  const handleFilterChange = (key, value) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange({ searchTerm, ...newFilters });
  };

  const clearFilters = () => {
    const resetFilters = {
      status: 'all',
      marketplace: 'all',
      priceRange: 'all',
      dateRange: 'all'
    };
    setFilters(resetFilters);
    setSearchTerm('');
    onFilterChange({ searchTerm: '', ...resetFilters });
  };

  const toggleFilter = () => {
    setFilterOpen(!filterOpen);
  };

  return (
    <div className="mb-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center">
        {/* Search Box */}
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-surface-400" />
          </div>
          <input
            type="text"
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Search deals..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        {/* Filter Toggle Button */}
        <button
          onClick={toggleFilter}
          className="px-4 py-2 rounded-lg border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 hover:bg-surface-100 dark:hover:bg-surface-700 flex items-center gap-2 transition"
        >
          <Filter size={18} />
          <span className="font-medium">Filters</span>
        </button>

        {/* Filter Clear Button - Only show if filters are applied */}
        {(filters.status !== 'all' || filters.marketplace !== 'all' || filters.priceRange !== 'all' || filters.dateRange !== 'all' || searchTerm) && (
          <button
            onClick={clearFilters}
            className="px-4 py-2 rounded-lg bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 flex items-center gap-2 transition text-surface-700 dark:text-surface-300"
          >
            <X size={16} />
            <span className="font-medium">Clear</span>
          </button>
        )}
      </div>

      {/* Filter Panel */}
      {filterOpen && (
        <div className="mt-4 p-4 bg-white dark:bg-surface-800 border border-surface-200 dark:border-surface-700 rounded-lg">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Status Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">Status</label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange('status', e.target.value)}
                className="w-full p-2 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
              >
                <option value="all">All Statuses</option>
                <option value="active">Active</option>
                <option value="expired">Expired</option>
                <option value="expiring soon">Expiring Soon</option>
                <option value="refundable">Refundable</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>

            {/* Marketplace Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">Marketplace</label>
              <select
                value={filters.marketplace}
                onChange={(e) => handleFilterChange('marketplace', e.target.value)}
                className="w-full p-2 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
              >
                <option value="all">All Marketplaces</option>
                <option value="appsumo">AppSumo</option>
                <option value="stacksocial">StackSocial</option>
                <option value="dealmirror">DealMirror</option>
                <option value="pitchground">PitchGround</option>
                <option value="dealfy">Dealfy</option>
              </select>
            </div>

            {/* Price Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">Price Range</label>
              <select
                value={filters.priceRange}
                onChange={(e) => handleFilterChange('priceRange', e.target.value)}
                className="w-full p-2 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
              >
                <option value="all">All Prices</option>
                <option value="0-50">$0 - $50</option>
                <option value="51-100">$51 - $100</option>
                <option value="101-200">$101 - $200</option>
                <option value="201+">$201+</option>
              </select>
            </div>

            {/* Date Range Filter */}
            <div>
              <label className="block text-sm font-medium mb-2 text-surface-700 dark:text-surface-300">Purchase Date</label>
              <select
                value={filters.dateRange}
                onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                className="w-full p-2 rounded-md border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800"
              >
                <option value="all">All Time</option>
                <option value="last-30">Last 30 Days</option>
                <option value="last-90">Last 90 Days</option>
                <option value="last-year">Last Year</option>
                <option value="this-year">This Year</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DealFilter;
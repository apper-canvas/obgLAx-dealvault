import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  PackageOpen, 
  Download, 
  Filter, 
  BarChart3, 
  PieChart,
  Calendar
} from 'lucide-react';
import DealFilter from '../components/DealFilter';
import DealTable from '../components/DealTable';

const MyDeals = () => {
  // Sample deals data
  const [deals, setDeals] = useState([
    {
      id: 1,
      name: "DesignPro Suite",
      marketplace: "AppSumo",
      price: 69,
      purchaseDate: "2023-10-15",
      refundDeadline: "2023-11-14",
      expiryDate: "2024-10-15",
      status: "Active",
      favorite: true
    },
    {
      id: 2,
      name: "SEO Toolkit Pro",
      marketplace: "DealMirror",
      price: 129,
      purchaseDate: "2023-10-20",
      refundDeadline: "2023-11-19",
      expiryDate: "2024-10-20",
      status: "Active",
      favorite: false
    },
    {
      id: 3,
      name: "EmailMaster",
      marketplace: "PitchGround",
      price: 49,
      purchaseDate: "2023-10-25",
      refundDeadline: "2023-11-24",
      expiryDate: "2024-04-25",
      status: "Refundable",
      favorite: false
    },
    {
      id: 4,
      name: "ContentWriter AI",
      marketplace: "AppSumo",
      price: 199,
      purchaseDate: "2023-09-05",
      refundDeadline: "2023-10-05",
      expiryDate: "2024-09-05",
      status: "Active",
      favorite: true
    },
    {
      id: 5,
      name: "VideoEditor Pro",
      marketplace: "StackSocial",
      price: 79,
      purchaseDate: "2023-08-15",
      refundDeadline: "2023-09-14",
      expiryDate: "2023-11-15",
      status: "Expiring Soon",
      favorite: false
    },
    {
      id: 6,
      name: "Analytics Dashboard",
      marketplace: "Dealfy",
      price: 149,
      purchaseDate: "2023-07-10",
      refundDeadline: "2023-08-09",
      expiryDate: "2023-10-10",
      status: "Expired",
      favorite: false
    },
    {
      id: 7,
      name: "WebsiteBooster",
      marketplace: "AppSumo",
      price: 39,
      purchaseDate: "2023-11-01",
      refundDeadline: "2023-12-01",
      expiryDate: "2024-11-01",
      status: "Refundable",
      favorite: true
    },
    {
      id: 8,
      name: "SocialMediaKit",
      marketplace: "DealMirror",
      price: 59,
      purchaseDate: "2023-05-20",
      refundDeadline: "2023-06-19",
      expiryDate: "2023-08-20",
      status: "Inactive",
      favorite: false
    }
  ]);

  // Summary statistics
  const stats = [
    { 
      id: 'active', 
      title: 'Active Deals', 
      value: deals.filter(d => d.status === 'Active').length,
      icon: <PackageOpen size={20} className="text-primary" />
    },
    { 
      id: 'total', 
      title: 'Total Investment', 
      value: `$${deals.reduce((sum, deal) => sum + deal.price, 0)}`, 
      icon: <BarChart3 size={20} className="text-secondary" />
    },
    { 
      id: 'refundable', 
      title: 'Refundable', 
      value: deals.filter(d => d.status === 'Refundable').length, 
      icon: <Calendar size={20} className="text-accent" />
    },
    { 
      id: 'expiring', 
      title: 'Expiring Soon', 
      value: deals.filter(d => d.status === 'Expiring Soon').length, 
      icon: <PieChart size={20} className="text-primary" />
    }
  ];

  // State for filtered deals
  const [filteredDeals, setFilteredDeals] = useState(deals);

  // Handle filter changes
  const handleFilterChange = (filterOptions) => {
    let filtered = [...deals];
    
    // Apply search term filter
    if (filterOptions.searchTerm) {
      const searchTerm = filterOptions.searchTerm.toLowerCase();
      filtered = filtered.filter(deal => 
        deal.name.toLowerCase().includes(searchTerm) || 
        deal.marketplace.toLowerCase().includes(searchTerm)
      );
    }
    
    // Apply status filter
    if (filterOptions.status !== 'all') {
      filtered = filtered.filter(deal => deal.status.toLowerCase() === filterOptions.status.toLowerCase());
    }
    
    // Apply marketplace filter
    if (filterOptions.marketplace !== 'all') {
      filtered = filtered.filter(deal => 
        deal.marketplace.toLowerCase() === filterOptions.marketplace.toLowerCase()
      );
    }
    
    // Apply price range filter
    if (filterOptions.priceRange !== 'all') {
      const [min, max] = filterOptions.priceRange.split('-');
      if (max === '+') {
        filtered = filtered.filter(deal => deal.price >= parseInt(min));
      } else {
        filtered = filtered.filter(deal => 
          deal.price >= parseInt(min) && deal.price <= parseInt(max)
        );
      }
    }
    
    // Apply date range filter
    if (filterOptions.dateRange !== 'all') {
      const now = new Date();
      let dateLimit;
      
      switch(filterOptions.dateRange) {
        case 'last-30':
          dateLimit = new Date(now.setDate(now.getDate() - 30));
          break;
        case 'last-90':
          dateLimit = new Date(now.setDate(now.getDate() - 90));
          break;
        case 'last-year':
          dateLimit = new Date(now.setFullYear(now.getFullYear() - 1));
          break;
        case 'this-year':
          dateLimit = new Date(now.getFullYear(), 0, 1);
          break;
        default:
          dateLimit = null;
      }
      
      if (dateLimit) {
        filtered = filtered.filter(deal => new Date(deal.purchaseDate) >= dateLimit);
      }
    }
    
    setFilteredDeals(filtered);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">My Deals</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Manage and track all your lifetime deal investments
          </p>
        </div>
        <button className="btn btn-primary flex items-center gap-2">
          <Plus size={18} />
          <span>Add New Deal</span>
        </button>
      </div>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <motion.div
            key={stat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: stat.id === 'active' ? 0 : 0.1 * ['active', 'total', 'refundable', 'expiring'].indexOf(stat.id) }}
            className="card-neu p-6"
          >
            <div className="flex justify-between items-start mb-4">
              <div className="p-2 rounded-lg bg-surface-100 dark:bg-surface-700">
                {stat.icon}
              </div>
            </div>
            <h3 className="text-sm font-medium text-surface-500 dark:text-surface-400 mb-1">
              {stat.title}
            </h3>
            <p className="text-2xl font-bold">{stat.value}</p>
          </motion.div>
        ))}
      </div>
      
      {/* Filter Section */}
      <DealFilter onFilterChange={handleFilterChange} />
      
      {/* Deal Table */}
      <div className="mb-8">
        <DealTable deals={filteredDeals} />
        
        {/* Empty State */}
        {filteredDeals.length === 0 && (
          <div className="mt-4 p-8 text-center bg-surface-50 dark:bg-surface-800 rounded-lg border border-dashed border-surface-300 dark:border-surface-600">
            <PackageOpen size={48} className="mx-auto mb-4 text-surface-400" />
            <h3 className="text-lg font-medium mb-2">No deals found</h3>
            <p className="text-surface-500 dark:text-surface-400 mb-4">
              Try adjusting your filters or add a new deal to get started.
            </p>
            <button className="btn btn-primary">
              Add Your First Deal
            </button>
          </div>
        )}
      </div>
      
      {/* Pagination - Only show if there are deals */}
      {filteredDeals.length > 0 && (
        <div className="flex justify-between items-center">
          <div className="text-sm text-surface-500 dark:text-surface-400">
            Showing <span className="font-medium">{filteredDeals.length}</span> of <span className="font-medium">{deals.length}</span> deals
          </div>
          <div className="flex gap-2">
            <button className="px-3 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
              Previous
            </button>
            <button className="px-3 py-1 rounded bg-primary text-white hover:bg-primary-dark">
              1
            </button>
            <button className="px-3 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
              2
            </button>
            <button className="px-3 py-1 rounded border border-surface-200 dark:border-surface-700 bg-white dark:bg-surface-800 text-surface-700 dark:text-surface-300 hover:bg-surface-100 dark:hover:bg-surface-700">
              Next
            </button>
          </div>
        </div>
      )}
      
      {/* Export Section */}
      <div className="mt-12 card p-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h2 className="text-xl font-bold mb-2">Export Your Deal Data</h2>
            <p className="text-surface-600 dark:text-surface-400">
              Download your deals data for backup or analysis in your preferred format
            </p>
          </div>
          <div className="flex gap-4">
            <button className="btn btn-outline flex items-center gap-2">
              <Download size={18} />
              <span>Export CSV</span>
            </button>
            <button className="btn btn-outline flex items-center gap-2">
              <Download size={18} />
              <span>Export PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyDeals;
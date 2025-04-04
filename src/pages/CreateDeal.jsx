import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, Plus } from 'lucide-react';
import DealForm from '../components/DealForm';
import { useDeals } from '../context/DealContext';

const CreateDeal = () => {
  const { addDeal } = useDeals();
  const [error, setError] = useState(null);
  
  const handleSubmit = async (dealData) => {
    try {
      // Add the deal
      await addDeal(dealData);
      return true;
    } catch (err) {
      setError('Failed to create deal. Please try again.');
      console.error(err);
      return false;
    }
  };
  
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
        <span className="text-surface-900 dark:text-surface-100">Create New Deal</span>
      </div>
      
      {/* Page Title */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Deal</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Add details about your new lifetime deal purchase
          </p>
        </div>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-400 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Deal Form */}
      <DealForm
        onSubmit={handleSubmit}
        formTitle="Deal Information"
        submitButtonText="Create Deal"
      />
      
      {/* Helpful Tips */}
      <div className="mt-8 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-100 dark:border-blue-900/30">
        <h3 className="text-lg font-semibold mb-4 text-blue-800 dark:text-blue-300">Tips for Managing Deals</h3>
        <ul className="list-disc pl-5 space-y-2 text-blue-700 dark:text-blue-300">
          <li>Add deals right after purchase to track refund windows</li>
          <li>Include any redemption codes or license keys in the notes section</li>
          <li>Mark deals as favorites to find them quickly</li>
          <li>Set expiry dates for deals with time-limited offers</li>
          <li>Keep descriptions detailed to remember what each deal includes</li>
        </ul>
      </div>
    </div>
  );
};

export default CreateDeal;
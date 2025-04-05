import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import DealForm from '../components/DealForm';
import { useDeals } from '../context/DealContext';

const CreateDeal = () => {
  const navigate = useNavigate();
  const { addDeal } = useDeals();
  
  const handleSubmit = async (dealData) => {
    try {
      // Add the new deal using the context
      const newDeal = await addDeal(dealData);
      if (newDeal) {
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error creating deal:', error);
      return false;
    }
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link to="/" className="breadcrumb-item">Dashboard</Link>
        <span className="breadcrumb-separator">
          <ChevronRight size={16} />
        </span>
        <Link to="/deals" className="breadcrumb-item">My Deals</Link>
        <span className="breadcrumb-separator">
          <ChevronRight size={16} />
        </span>
        <span className="text-surface-900 dark:text-surface-100">Create Deal</span>
      </div>
      
      {/* Page Header */}
      <div className="mb-8 flex items-center">
        <button 
          onClick={() => navigate('/deals')}
          className="mr-4 p-2 rounded-full hover:bg-surface-100 dark:hover:bg-surface-800 transition"
          aria-label="Go back"
        >
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-2">Create New Deal</h1>
          <p className="text-surface-600 dark:text-surface-400">
            Add a new lifetime deal to your collection
          </p>
        </div>
      </div>
      
      {/* Deal Form */}
      <DealForm
        onSubmit={handleSubmit}
        formTitle="New Deal Information"
        submitButtonText="Create Deal"
        isEdit={false}
      />
      
      {/* Quick Links */}
      <div className="mt-8 flex justify-end">
        <Link to="/deals" className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition">
          View all deals →
        </Link>
      </div>
    </div>
  );
};

export default CreateDeal;
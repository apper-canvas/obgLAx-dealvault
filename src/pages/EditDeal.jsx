import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import DealForm from '../components/DealForm';
import { useDeals } from '../context/DealContext';

const EditDeal = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getDealById, updateDeal } = useDeals();
  const [deal, setDeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
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
  
  const handleSubmit = async (updatedData) => {
    try {
      // Update the deal with the parsed ID
      await updateDeal(parseInt(id), updatedData);
      return true;
    } catch (err) {
      setError('Failed to update deal. Please try again.');
      console.error(err);
      return false;
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
          <span className="text-lg">Loading deal...</span>
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
        <Link to={`/deals/${id}`} className="breadcrumb-item">{deal.name}</Link>
        <span className="breadcrumb-separator">
          <ChevronRight size={16} />
        </span>
        <span className="text-surface-900 dark:text-surface-100">Edit</span>
      </div>
      
      {/* Page Title */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold mb-2">Edit Deal</h1>
        <p className="text-surface-600 dark:text-surface-400">
          Update information for {deal.name}
        </p>
      </div>
      
      {/* Deal Form */}
      <DealForm
        initialData={deal}
        onSubmit={handleSubmit}
        formTitle="Edit Deal Information"
        submitButtonText="Save Changes"
        isEdit={true}
      />
      
      {/* Quick Links */}
      <div className="mt-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <Link to={`/deals/${id}`} className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition">
          ← Return to deal details
        </Link>
        <Link to="/deals" className="text-primary hover:text-primary-dark dark:text-primary-light dark:hover:text-primary transition">
          View all deals →
        </Link>
      </div>
    </div>
  );
};

export default EditDeal;
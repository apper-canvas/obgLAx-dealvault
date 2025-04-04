import { createContext, useState, useContext, useEffect } from 'react';
import { format, addDays } from 'date-fns';

// Create the context
const DealContext = createContext();

// Custom hook to use the deal context
export const useDeals = () => {
  const context = useContext(DealContext);
  if (!context) {
    throw new Error('useDeals must be used within a DealProvider');
  }
  return context;
};

// Provider component
export const DealProvider = ({ children }) => {
  // State for deals
  const [deals, setDeals] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize deals with sample data
  useEffect(() => {
    // This would normally be an API call to fetch deals
    const sampleDeals = [
      {
        id: 1,
        name: "DesignPro Suite",
        marketplace: "AppSumo",
        price: 69,
        purchaseDate: "2023-10-15",
        refundDeadline: "2023-11-14",
        expiryDate: "2024-10-15",
        status: "Active",
        favorite: true,
        category: "Design",
        description: "All-in-one design toolkit for professionals with templates and assets.",
        notes: "Great value. Includes lifetime updates.",
        refundWindow: 30
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
        favorite: false,
        category: "Marketing",
        description: "Advanced SEO tools for keyword research and competitor analysis.",
        notes: "Includes 3 codes for different domains.",
        refundWindow: 30
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
        favorite: false,
        category: "Marketing",
        description: "Email marketing platform with automation and segmentation.",
        notes: "Limited to 10,000 subscribers.",
        refundWindow: 30
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
        favorite: true,
        category: "AI Tools",
        description: "AI-powered content generation tool for blog posts and social media.",
        notes: "100,000 words per month limit.",
        refundWindow: 30
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
        favorite: false,
        category: "Design",
        description: "Professional video editing software with effects and templates.",
        notes: "Includes desktop app for Mac and Windows.",
        refundWindow: 30
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
        favorite: false,
        category: "Business",
        description: "Business analytics platform with custom dashboards and reports.",
        notes: "Need to renew by Nov 1st to keep data.",
        refundWindow: 30
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
        favorite: true,
        category: "Development",
        description: "Website optimization tools for improved performance and SEO.",
        notes: "Works with WordPress, Shopify, and custom sites.",
        refundWindow: 30
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
        favorite: false,
        category: "Marketing",
        description: "Complete toolkit for social media management and scheduling.",
        notes: "Supports up to 10 social accounts.",
        refundWindow: 30
      }
    ];
    
    setDeals(sampleDeals);
    setIsLoading(false);
  }, []);

  // Format date helper
  const formatDate = (dateString) => {
    try {
      return format(new Date(dateString), 'yyyy-MM-dd');
    } catch (e) {
      return '';
    }
  };

  // Calculate refund deadline based on purchase date and refund window
  const calculateRefundDeadline = (purchaseDate, refundWindow) => {
    const date = new Date(purchaseDate);
    return formatDate(addDays(date, parseInt(refundWindow)));
  };

  // Get a deal by ID
  const getDealById = (id) => {
    return deals.find(deal => deal.id === parseInt(id));
  };

  // Add a new deal
  const addDeal = (dealData) => {
    const newDeal = {
      id: Date.now(),
      ...dealData,
      refundDeadline: calculateRefundDeadline(dealData.purchaseDate, dealData.refundWindow)
    };
    
    setDeals(prevDeals => [newDeal, ...prevDeals]);
    return newDeal;
  };

  // Update an existing deal
  const updateDeal = (id, updatedData) => {
    const updatedDeals = deals.map(deal => 
      deal.id === parseInt(id) 
        ? { 
            ...deal, 
            ...updatedData,
            refundDeadline: calculateRefundDeadline(
              updatedData.purchaseDate || deal.purchaseDate,
              updatedData.refundWindow || deal.refundWindow
            )
          } 
        : deal
    );
    
    setDeals(updatedDeals);
    return getDealById(id);
  };

  // Delete a deal
  const deleteDeal = (id) => {
    setDeals(prevDeals => prevDeals.filter(deal => deal.id !== parseInt(id)));
  };

  // Toggle favorite status
  const toggleFavorite = (id) => {
    setDeals(prevDeals => 
      prevDeals.map(deal => 
        deal.id === parseInt(id) 
          ? { ...deal, favorite: !deal.favorite } 
          : deal
      )
    );
  };

  // Value provided by the context
  const value = {
    deals,
    isLoading,
    getDealById,
    addDeal,
    updateDeal,
    deleteDeal,
    toggleFavorite
  };

  return <DealContext.Provider value={value}>{children}</DealContext.Provider>;
};
import React from 'react';

const DealTagBadge = ({ status }) => {
  // Define color schemes based on status
  const getStatusStyles = () => {
    switch(status.toLowerCase()) {
      case 'active':
        return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400';
      case 'expiring soon':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-400';
      case 'refundable':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400';
      case 'inactive':
        return 'bg-surface-100 text-surface-800 dark:bg-surface-700 dark:text-surface-300';
      default:
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-400';
    }
  };

  return (
    <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusStyles()}`}>
      {status}
    </span>
  );
};

export default DealTagBadge;
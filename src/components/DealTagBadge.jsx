import React from 'react';

const DealTagBadge = ({ status }) => {
  let badgeClass;
  
  switch (status.toLowerCase()) {
    case 'active':
      badgeClass = 'badge-success';
      break;
    case 'refundable':
      badgeClass = 'badge-info';
      break;
    case 'expired':
      badgeClass = 'badge-danger';
      break;
    case 'expiring soon':
      badgeClass = 'badge-warning';
      break;
    case 'inactive':
      badgeClass = 'badge-danger';
      break;
    default:
      badgeClass = 'badge-secondary';
  }
  
  return (
    <span className={`badge ${badgeClass}`}>
      {status}
    </span>
  );
};

export default DealTagBadge;
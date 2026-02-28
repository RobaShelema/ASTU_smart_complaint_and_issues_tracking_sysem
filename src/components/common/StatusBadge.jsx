import React from 'react';

const statusConfig = {
  pending: { color: 'yellow', text: 'Pending' },
  in_progress: { color: 'blue', text: 'In Progress' },
  resolved: { color: 'green', text: 'Resolved' },
  closed: { color: 'gray', text: 'Closed' }
};

const StatusBadge = ({ status }) => {
  const config = statusConfig[status] || { color: 'gray', text: status };
  
  return (
    <span className={`px-2 py-1 text-xs font-medium rounded-full bg-${config.color}-100 text-${config.color}-800`}>
      {config.text}
    </span>
  );
};

export default StatusBadge;
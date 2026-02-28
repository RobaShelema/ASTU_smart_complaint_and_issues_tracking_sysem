import React from 'react';

const statusConfig = {
  pending: {
    color: 'bg-yellow-100 text-yellow-800',
    label: 'Pending',
    icon: '⏳'
  },
  in_progress: {
    color: 'bg-blue-100 text-blue-800',
    label: 'In Progress',
    icon: '🔄'
  },
  resolved: {
    color: 'bg-green-100 text-green-800',
    label: 'Resolved',
    icon: '✅'
  },
  closed: {
    color: 'bg-gray-100 text-gray-800',
    label: 'Closed',
    icon: '🔒'
  },
  rejected: {
    color: 'bg-red-100 text-red-800',
    label: 'Rejected',
    icon: '❌'
  }
};

const StatusBadge = ({ status, showIcon = true, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig.pending;
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base'
  };

  return (
    <span className={`inline-flex items-center rounded-full font-medium ${sizeClasses[size]} ${config.color}`}>
      {showIcon && <span className="mr-1">{config.icon}</span>}
      {config.label}
    </span>
  );
};

export default StatusBadge;
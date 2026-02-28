import React from 'react';
import { 
  Clock, 
  AlertCircle, 
  CheckCircle, 
  XCircle, 
  RefreshCw,
  Eye,
  ThumbsUp,
  Archive
} from 'lucide-react';

const statusConfig = {
  // Main statuses
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Clock,
    description: 'Awaiting initial review',
    progress: 25,
    animation: 'animate-pulse-slow'
  },
  in_progress: {
    label: 'In Progress',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: RefreshCw,
    description: 'Being worked on',
    progress: 50,
    animation: 'animate-spin-slow'
  },
  resolved: {
    label: 'Resolved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
    description: 'Successfully resolved',
    progress: 100,
    animation: 'animate-bounce-light'
  },
  closed: {
    label: 'Closed',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: Archive,
    description: 'Complaint closed',
    progress: 100,
    animation: ''
  },
  
  // Additional statuses
  assigned: {
    label: 'Assigned',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Eye,
    description: 'Assigned to staff',
    progress: 30,
    animation: ''
  },
  escalated: {
    label: 'Escalated',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertCircle,
    description: 'Escalated to higher authority',
    progress: 40,
    animation: 'animate-pulse'
  },
  on_hold: {
    label: 'On Hold',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: XCircle,
    description: 'Temporarily on hold',
    progress: 20,
    animation: ''
  },
  rejected: {
    label: 'Rejected',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: XCircle,
    description: 'Complaint rejected',
    progress: 0,
    animation: ''
  },
  approved: {
    label: 'Approved',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: ThumbsUp,
    description: 'Resolution approved',
    progress: 90,
    animation: ''
  }
};

const StatusBadge = ({ 
  status, 
  size = 'md', 
  showIcon = true, 
  showLabel = true,
  showTooltip = false,
  animated = false,
  onClick
}) => {
  const config = statusConfig[status] || statusConfig.pending;
  const Icon = config.icon;

  const sizeClasses = {
    sm: {
      badge: 'px-2 py-0.5 text-xs',
      icon: 'h-3 w-3',
      tooltip: 'text-xs'
    },
    md: {
      badge: 'px-2.5 py-1 text-sm',
      icon: 'h-4 w-4',
      tooltip: 'text-sm'
    },
    lg: {
      badge: 'px-3 py-1.5 text-base',
      icon: 'h-5 w-5',
      tooltip: 'text-base'
    },
    xl: {
      badge: 'px-4 py-2 text-lg',
      icon: 'h-6 w-6',
      tooltip: 'text-lg'
    }
  };

  const BadgeContent = () => (
    <div className="flex items-center space-x-1.5">
      {showIcon && <Icon className={`${sizeClasses[size].icon} ${animated ? config.animation : ''}`} />}
      {showLabel && <span>{config.label}</span>}
    </div>
  );

  if (showTooltip) {
    return (
      <div className="relative group">
        <div
          className={`inline-flex items-center rounded-full border ${config.color} ${sizeClasses[size].badge} ${
            onClick ? 'cursor-pointer hover:opacity-80' : ''
          }`}
          onClick={onClick}
        >
          <BadgeContent />
        </div>
        
        {/* Tooltip */}
        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-3 py-2 bg-gray-900 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50 pointer-events-none">
          <p className={`font-medium ${sizeClasses[size].tooltip}`}>{config.label}</p>
          <p className={`text-gray-300 ${sizeClasses[size].tooltip}`}>{config.description}</p>
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 -mt-1">
            <div className="border-4 border-transparent border-t-gray-900"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`inline-flex items-center rounded-full border ${config.color} ${sizeClasses[size].badge} ${
        onClick ? 'cursor-pointer hover:opacity-80' : ''
      }`}
      onClick={onClick}
    >
      <BadgeContent />
    </div>
  );
};

export default StatusBadge;
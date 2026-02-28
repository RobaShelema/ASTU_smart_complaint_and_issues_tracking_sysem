import React from 'react';
import { 
  Clock, 
  RefreshCw, 
  CheckCircle, 
  Archive,
  AlertCircle,
  Eye,
  TrendingUp
} from 'lucide-react';

const StatusCards = ({ stats = {}, onStatusClick }) => {
  const cards = [
    {
      key: 'pending',
      label: 'Pending',
      count: stats.pending || 0,
      icon: Clock,
      color: 'yellow',
      bgColor: 'bg-yellow-50',
      textColor: 'text-yellow-700',
      borderColor: 'border-yellow-200',
      iconBg: 'bg-yellow-100',
      iconColor: 'text-yellow-600'
    },
    {
      key: 'assigned',
      label: 'Assigned',
      count: stats.assigned || 0,
      icon: Eye,
      color: 'purple',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-700',
      borderColor: 'border-purple-200',
      iconBg: 'bg-purple-100',
      iconColor: 'text-purple-600'
    },
    {
      key: 'in_progress',
      label: 'In Progress',
      count: stats.inProgress || 0,
      icon: RefreshCw,
      color: 'blue',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-700',
      borderColor: 'border-blue-200',
      iconBg: 'bg-blue-100',
      iconColor: 'text-blue-600'
    },
    {
      key: 'resolved',
      label: 'Resolved',
      count: stats.resolved || 0,
      icon: CheckCircle,
      color: 'green',
      bgColor: 'bg-green-50',
      textColor: 'text-green-700',
      borderColor: 'border-green-200',
      iconBg: 'bg-green-100',
      iconColor: 'text-green-600'
    },
    {
      key: 'closed',
      label: 'Closed',
      count: stats.closed || 0,
      icon: Archive,
      color: 'gray',
      bgColor: 'bg-gray-50',
      textColor: 'text-gray-700',
      borderColor: 'border-gray-200',
      iconBg: 'bg-gray-100',
      iconColor: 'text-gray-600'
    },
    {
      key: 'escalated',
      label: 'Escalated',
      count: stats.escalated || 0,
      icon: AlertCircle,
      color: 'red',
      bgColor: 'bg-red-50',
      textColor: 'text-red-700',
      borderColor: 'border-red-200',
      iconBg: 'bg-red-100',
      iconColor: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        
        return (
          <div
            key={card.key}
            onClick={() => onStatusClick?.(card.key)}
            className={`${card.bgColor} border ${card.borderColor} rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className={`${card.iconBg} p-2 rounded-lg`}>
                <Icon className={`h-5 w-5 ${card.iconColor}`} />
              </div>
              <span className={`text-2xl font-bold ${card.textColor}`}>
                {card.count}
              </span>
            </div>
            <p className={`text-sm font-medium ${card.textColor}`}>
              {card.label}
            </p>
            <p className="text-xs text-gray-500 mt-1">
              {card.count === 1 ? 'complaint' : 'complaints'}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StatusCards;
import React from 'react';
import { Filter, X } from 'lucide-react';
import StatusBadge from './StatusBadge';

const StatusFilter = ({ selectedStatuses = [], onStatusChange, onClear }) => {
  const statusOptions = [
    { value: 'pending', label: 'Pending' },
    { value: 'assigned', label: 'Assigned' },
    { value: 'in_progress', label: 'In Progress' },
    { value: 'resolved', label: 'Resolved' },
    { value: 'closed', label: 'Closed' },
    { value: 'escalated', label: 'Escalated' },
    { value: 'on_hold', label: 'On Hold' },
    { value: 'rejected', label: 'Rejected' }
  ];

  const toggleStatus = (status) => {
    if (selectedStatuses.includes(status)) {
      onStatusChange(selectedStatuses.filter(s => s !== status));
    } else {
      onStatusChange([...selectedStatuses, status]);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by Status</span>
        </div>
        {selectedStatuses.length > 0 && (
          <button
            onClick={onClear}
            className="text-xs text-red-600 hover:text-red-800 flex items-center"
          >
            <X className="h-3 w-3 mr-1" />
            Clear all
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        {statusOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => toggleStatus(option.value)}
            className={`transition-opacity ${
              selectedStatuses.includes(option.value) 
                ? 'opacity-100' 
                : 'opacity-50 hover:opacity-75'
            }`}
          >
            <StatusBadge 
              status={option.value} 
              size="sm"
              showTooltip={false}
            />
          </button>
        ))}
      </div>

      {selectedStatuses.length > 0 && (
        <div className="mt-3 text-xs text-gray-500">
          Showing complaints with status: {selectedStatuses.map(s => 
            s.replace('_', ' ')
          ).join(', ')}
        </div>
      )}
    </div>
  );
};

export default StatusFilter;
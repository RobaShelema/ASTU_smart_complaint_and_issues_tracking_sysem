import React, { useEffect } from 'react';
import { useNotifications } from '../../context/NotificationContext';
import { X, AlertCircle, CheckCircle, Info, AlertTriangle } from 'lucide-react';

const NotificationToast = ({ notification, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(notification.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [notification.id, onClose]);

  const getIcon = () => {
    switch(notification.type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'error':
        return <X className="h-5 w-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-400" />;
      default:
        return <Info className="h-5 w-5 text-blue-400" />;
    }
  };

  const getBgColor = () => {
    switch(notification.type) {
      case 'success': return 'bg-green-50';
      case 'error': return 'bg-red-50';
      case 'warning': return 'bg-yellow-50';
      default: return 'bg-blue-50';
    }
  };

  return (
    <div className={`fixed bottom-4 right-4 max-w-sm w-full ${getBgColor()} rounded-lg shadow-lg p-4 border border-gray-200 animate-slide-up`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          {getIcon()}
        </div>
        <div className="ml-3 w-0 flex-1">
          <p className="text-sm font-medium text-gray-900">
            {notification.title || notification.type}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {notification.message}
          </p>
        </div>
        <div className="ml-4 flex-shrink-0 flex">
          <button
            onClick={() => onClose(notification.id)}
            className="inline-flex text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotificationToast;
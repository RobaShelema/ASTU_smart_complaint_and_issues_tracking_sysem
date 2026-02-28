import React from 'react';
import { MessageCircle, X } from 'lucide-react';

const ChatButton = ({ unreadCount, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="fixed bottom-6 right-6 z-50 group"
    >
      {/* Ripple effect */}
      <span className="absolute inset-0 rounded-full bg-blue-400 animate-ping opacity-75"></span>
      
      {/* Main button */}
      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-shadow">
        <MessageCircle className="h-6 w-6" />
        
        {/* Unread badge */}
        {unreadCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-6 w-6 flex items-center justify-center animate-bounce">
            {unreadCount}
          </span>
        )}
      </div>

      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <div className="bg-gray-900 text-white text-sm py-1 px-3 rounded-lg whitespace-nowrap">
          Chat with Assistant
        </div>
      </div>
    </button>
  );
};

export default ChatButton;
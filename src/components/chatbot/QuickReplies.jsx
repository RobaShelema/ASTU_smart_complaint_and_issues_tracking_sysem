import React from 'react';
import { useChatbot } from '../../context/ChatbotContext';

const QuickReplies = () => {
  const { suggestions, handleSuggestionClick } = useChatbot();

  if (!suggestions || suggestions.length === 0) {
    return null;
  }

  return (
    <div className="px-4 py-2 border-t border-gray-200 bg-gray-50">
      <p className="text-xs text-gray-500 mb-2">Quick replies:</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <button
            key={index}
            onClick={() => handleSuggestionClick(suggestion)}
            className="text-xs bg-white border border-gray-200 rounded-full px-3 py-1 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-600 transition-colors"
          >
            {suggestion}
          </button>
        ))}
      </div>
    </div>
  );
};

export default QuickReplies;
import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';

const safeTimeAgo = (dateStr) => {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return '';
  return formatDistanceToNow(d, { addSuffix: true });
};

const ChatMessage = ({ message, isLast }) => {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(null);
  const msgText = message.text || message.content || '';

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(msgText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard not available */
    }
  };

  const handleRating = (value) => {
    setRating(value);
  };

  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div
            className={`h-8 w-8 rounded-full flex items-center justify-center ${
              isBot ? 'bg-blue-100' : 'bg-green-100'
            }`}
          >
            {isBot ? (
              <Bot className="h-5 w-5 text-blue-600" />
            ) : (
              <User className="h-5 w-5 text-green-600" />
            )}
          </div>
        </div>

        {/* Message content */}
        <div className="flex-1">
          <div
            className={`rounded-lg p-3 ${
              isBot
                ? 'bg-white border border-gray-200'
                : 'bg-blue-600 text-white'
            }`}
          >
            <p className="text-sm whitespace-pre-wrap">{msgText}</p>

            {/* Timestamp */}
            <div className={`text-xs mt-1 ${isBot ? 'text-gray-400' : 'text-blue-200'}`}>
              {safeTimeAgo(message.timestamp)}
            </div>
          </div>

          {/* Message actions (for bot messages) */}
          {isBot && (
            <div className="flex items-center space-x-2 mt-1 ml-1">
              <button
                onClick={handleCopy}
                className="text-gray-400 hover:text-gray-600 transition-colors"
                title="Copy message"
              >
                {copied ? (
                  <Check className="h-3 w-3 text-green-500" />
                ) : (
                  <Copy className="h-3 w-3" />
                )}
              </button>

              <button
                onClick={() => handleRating('up')}
                className={`transition-colors ${
                  rating === 'up' ? 'text-green-500' : 'text-gray-400 hover:text-green-500'
                }`}
                title="Helpful"
              >
                <ThumbsUp className="h-3 w-3" />
              </button>

              <button
                onClick={() => handleRating('down')}
                className={`transition-colors ${
                  rating === 'down' ? 'text-red-500' : 'text-gray-400 hover:text-red-500'
                }`}
                title="Not helpful"
              >
                <ThumbsDown className="h-3 w-3" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;

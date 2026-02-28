import React, { useState } from 'react';
import { formatDistanceToNow } from 'date-fns';
import { Bot, User, ThumbsUp, ThumbsDown, Copy, Check } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import chatbotService from '../../services/api/chatbotService';

const ChatMessage = ({ message, isLast }) => {
  const [copied, setCopied] = useState(false);
  const [rating, setRating] = useState(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRating = async (value) => {
    setRating(value);
    await chatbotService.rateResponse(message.id, value);
  };

  const isBot = message.type === 'bot';

  return (
    <div className={`flex ${isBot ? 'justify-start' : 'justify-end'}`}>
      <div className={`flex max-w-[80%] ${isBot ? 'flex-row' : 'flex-row-reverse'}`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 ${isBot ? 'mr-3' : 'ml-3'}`}>
          <div className={`h-8 w-8 rounded-full flex items-center justify-center ${
            isBot ? 'bg-blue-100' : 'bg-green-100'
          }`}>
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
            } ${message.isFallback ? 'border-yellow-300' : ''}`}
          >
            {/* Message text with markdown support */}
            {isBot ? (
              <ReactMarkdown
                className="prose prose-sm max-w-none"
                components={{
                  a: ({ node, ...props }) => (
                    <a {...props} className="text-blue-600 hover:underline" target="_blank" />
                  ),
                  p: ({ node, ...props }) => <p {...props} className="mb-2 last:mb-0" />
                }}
              >
                {message.content}
              </ReactMarkdown>
            ) : (
              <p className="text-sm">{message.content}</p>
            )}

            {/* Timestamp */}
            <div className={`text-xs mt-1 ${isBot ? 'text-gray-400' : 'text-blue-200'}`}>
              {formatDistanceToNow(new Date(message.timestamp), { addSuffix: true })}
            </div>
          </div>

          {/* Message actions (for bot messages) */}
          {isBot && (
            <div className="flex items-center space-x-2 mt-1 ml-1">
              {/* Copy button */}
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

              {/* Rating buttons */}
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

              {/* Fallback indicator */}
              {message.isFallback && (
                <span className="text-xs text-yellow-600 ml-2">
                  (Offline mode)
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage;
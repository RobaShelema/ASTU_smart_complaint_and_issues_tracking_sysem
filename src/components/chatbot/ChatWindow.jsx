import React, { useRef, useEffect } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import QuickReplies from './QuickReplies';
import TypingIndicator from './TypingIndicator';

const ChatWindow = () => {
  const { messages, isTyping, clearChat } = useChatbot();
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  return (
    <div className="flex flex-col h-[500px]">
      {/* Chat header with actions */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 bg-gray-50">
        <span className="text-sm text-gray-600">
          {messages.length} messages
        </span>
        <button
          onClick={clearChat}
          className="text-xs text-gray-500 hover:text-gray-700"
        >
          Clear chat
        </button>
      </div>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((message, index) => (
          <ChatMessage
            key={message.id || index}
            message={message}
            isLast={index === messages.length - 1}
          />
        ))}
        
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Quick replies */}
      <QuickReplies />

      {/* Input area */}
      <ChatInput />
    </div>
  );
};

export default ChatWindow;
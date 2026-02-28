import React, { useState, useEffect, useRef } from 'react';
import { useChatbot } from '../../context/ChatbotContext';
import ChatWindow from './ChatWindow';
import ChatButton from './ChatButton';
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react';

const Chatbot = () => {
  const { isOpen, toggleChat, unreadCount } = useChatbot();
  const [isMinimized, setIsMinimized] = useState(false);
  const [position, setPosition] = useState({ x: window.innerWidth - 400, y: window.innerHeight - 600 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const chatbotRef = useRef(null);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setPosition({
        x: Math.min(position.x, window.innerWidth - 400),
        y: Math.min(position.y, window.innerHeight - 100)
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [position]);

  // Handle dragging
  const handleMouseDown = (e) => {
    if (e.target.closest('.chat-header')) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      const newX = e.clientX - dragOffset.x;
      const newY = e.clientY - dragOffset.y;
      
      // Constrain to window bounds
      setPosition({
        x: Math.max(0, Math.min(newX, window.innerWidth - 400)),
        y: Math.max(0, Math.min(newY, window.innerHeight - 100))
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) {
    return <ChatButton unreadCount={unreadCount} onClick={toggleChat} />;
  }

  return (
    <div
      ref={chatbotRef}
      className={`fixed z-50 ${isMinimized ? 'w-80' : 'w-96'} shadow-2xl rounded-lg bg-white border border-gray-200`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        cursor: isDragging ? 'grabbing' : 'default'
      }}
    >
      {/* Header */}
      <div
        className={`chat-header flex items-center justify-between p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-t-lg cursor-grab ${
          isDragging ? 'cursor-grabbing' : ''
        }`}
        onMouseDown={handleMouseDown}
      >
        <div className="flex items-center space-x-2">
          <MessageCircle className="h-5 w-5" />
          <span className="font-semibold">ASTU Assistant</span>
          <span className="text-xs bg-blue-500 px-2 py-0.5 rounded-full">Online</span>
        </div>
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsMinimized(!isMinimized)}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            {isMinimized ? <Maximize2 className="h-4 w-4" /> : <Minimize2 className="h-4 w-4" />}
          </button>
          <button
            onClick={toggleChat}
            className="p-1 hover:bg-blue-500 rounded transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Chat Window */}
      {!isMinimized && <ChatWindow />}
    </div>
  );
};

export default Chatbot;
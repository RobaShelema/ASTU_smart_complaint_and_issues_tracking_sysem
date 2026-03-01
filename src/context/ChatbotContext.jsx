import React, { createContext, useState, useContext, useCallback } from 'react';

const ChatbotContext = createContext(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: 'Hello! I\'m the ASTU Assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => {
      if (!prev) setUnreadCount(0);
      return !prev;
    });
  }, []);

  const openChat = useCallback(() => {
    setIsOpen(true);
    setUnreadCount(0);
  }, []);

  const closeChat = useCallback(() => {
    setIsOpen(false);
  }, []);

  const addMessage = useCallback((message) => {
    const newMessage = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...message,
    };
    setMessages(prev => [...prev, newMessage]);

    if (message.type === 'bot' && !isOpen) {
      setUnreadCount(prev => prev + 1);
    }
  }, [isOpen]);

  const sendMessage = useCallback(async (text) => {
    addMessage({ type: 'user', text });
    setIsTyping(true);

    setTimeout(() => {
      const responses = [
        'I can help you with filing complaints, checking status, and general university inquiries.',
        'To submit a new complaint, go to the "New Complaint" section from your dashboard.',
        'You can track your complaint status in the "My Complaints" section.',
        'For urgent matters, please contact the administration office directly.',
        'Is there anything else I can help you with?',
      ];
      const response = responses[Math.floor(Math.random() * responses.length)];
      addMessage({ type: 'bot', text: response });
      setIsTyping(false);
    }, 1000 + Math.random() * 1500);
  }, [addMessage]);

  const clearMessages = useCallback(() => {
    setMessages([{
      id: 'welcome',
      type: 'bot',
      text: 'Hello! I\'m the ASTU Assistant. How can I help you today?',
      timestamp: new Date().toISOString(),
    }]);
  }, []);

  const value = {
    isOpen,
    messages,
    unreadCount,
    isTyping,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    addMessage,
    clearMessages,
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

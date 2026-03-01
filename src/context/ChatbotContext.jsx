import React, { createContext, useState, useContext, useCallback } from 'react';
import chatbotService from '../services/api/chatbotService';

const ChatbotContext = createContext(null);

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

const DEFAULT_SUGGESTIONS = [
  'How do I submit a complaint?',
  'Track my complaint',
  'What categories are available?',
  'How long does resolution take?',
];

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 'welcome',
      type: 'bot',
      text: "Hello! I'm the ASTU Assistant. How can I help you today?",
      timestamp: new Date().toISOString(),
    },
  ]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isTyping, setIsTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);

  const toggleChat = useCallback(() => {
    setIsOpen((prev) => {
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

  const addMessage = useCallback(
    (message) => {
      const newMessage = {
        id: Date.now().toString(),
        timestamp: new Date().toISOString(),
        ...message,
      };
      setMessages((prev) => [...prev, newMessage]);

      if (message.type === 'bot' && !isOpen) {
        setUnreadCount((prev) => prev + 1);
      }
    },
    [isOpen]
  );

  const sendMessage = useCallback(
    async (text) => {
      addMessage({ type: 'user', text });
      setIsTyping(true);

      setTimeout(() => {
        const fallback = chatbotService.getFallbackResponse(text);
        addMessage({ type: 'bot', text: fallback.response });
        setSuggestions(fallback.suggestions || []);
        setIsTyping(false);
      }, 800 + Math.random() * 1200);
    },
    [addMessage]
  );

  const handleSuggestionClick = useCallback(
    (suggestion) => {
      sendMessage(suggestion);
    },
    [sendMessage]
  );

  const clearMessages = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        text: "Hello! I'm the ASTU Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
      },
    ]);
    setSuggestions(DEFAULT_SUGGESTIONS);
  }, []);

  const value = {
    isOpen,
    messages,
    unreadCount,
    isTyping,
    suggestions,
    toggleChat,
    openChat,
    closeChat,
    sendMessage,
    addMessage,
    clearMessages,
    handleSuggestionClick,
  };

  return (
    <ChatbotContext.Provider value={value}>{children}</ChatbotContext.Provider>
  );
};

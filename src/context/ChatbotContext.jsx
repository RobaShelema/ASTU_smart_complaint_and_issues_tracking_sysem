import React, { createContext, useContext, useState, useCallback } from 'react';
import chatbotService from '../services/api/chatbotService';

const ChatbotContext = createContext(null);

export const ChatbotProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);

  // Initialize with welcome message
  useState(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your ASTU Complaint Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
        suggestions: [
          'Submit a complaint',
          'Check complaint status',
          'FAQ',
          'Contact support'
        ]
      }
    ]);
  }, []);

  const sendMessage = useCallback(async (content) => {
    // Add user message
    const userMessage = {
      id: `user-${Date.now()}`,
      type: 'user',
      content,
      timestamp: new Date().toISOString()
    };
    
    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const response = await chatbotService.sendMessage(content);
      
      // Add bot response
      const botMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: response.response,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions || [],
        quickReplies: response.quick_replies || []
      };
      
      setMessages(prev => [...prev, botMessage]);
      setSuggestions(response.suggestions || []);
      
      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }
    } catch (error) {
      // Use fallback response
      const fallback = chatbotService.getFallbackResponse(content);
      
      const errorMessage = {
        id: `bot-${Date.now()}`,
        type: 'bot',
        content: fallback.response,
        timestamp: new Date().toISOString(),
        suggestions: fallback.suggestions || [],
        isFallback: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
      setSuggestions(fallback.suggestions || []);
    } finally {
      setIsTyping(false);
    }
  }, [isOpen]);

  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  const clearChat = useCallback(() => {
    setMessages([
      {
        id: 'welcome',
        type: 'bot',
        content: "Hello! I'm your ASTU Complaint Assistant. How can I help you today?",
        timestamp: new Date().toISOString(),
        suggestions: [
          'Submit a complaint',
          'Check complaint status',
          'FAQ',
          'Contact support'
        ]
      }
    ]);
    chatbotService.clearConversation();
  }, []);

  const handleSuggestionClick = useCallback((suggestion) => {
    sendMessage(suggestion);
  }, [sendMessage]);

  const value = {
    isOpen,
    messages,
    isTyping,
    unreadCount,
    suggestions,
    sendMessage,
    toggleChat,
    clearChat,
    handleSuggestionClick
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};
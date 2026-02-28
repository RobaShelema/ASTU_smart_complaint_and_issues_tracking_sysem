import React, { createContext, useState, useContext, useCallback, useRef, useEffect } from 'react';
import { useAuth } from './AuthContext';
import chatbotService from '../services/api/chatbotService';

// Create context
const ChatbotContext = createContext(null);

// Custom hook
export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const { user, isAuthenticated } = useAuth();
  
  // State
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [suggestions, setSuggestions] = useState([]);
  const [context, setContext] = useState({});
  const [sessionId, setSessionId] = useState(null);
  const [error, setError] = useState(null);

  // Refs
  const messagesEndRef = useRef(null);
  const sessionStartTime = useRef(Date.now());

  // Load chat history from localStorage
  useEffect(() => {
    const savedHistory = localStorage.getItem('chatHistory');
    if (savedHistory) {
      try {
        const parsed = JSON.parse(savedHistory);
        // Only load history from last 24 hours
        const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
        const recentMessages = parsed.filter(m => 
          new Date(m.timestamp).getTime() > oneDayAgo
        );
        setMessages(recentMessages);
      } catch (error) {
        console.error('Failed to parse chat history:', error);
      }
    }
  }, []);

  // Save messages to localStorage
  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem('chatHistory', JSON.stringify(messages));
    }
  }, [messages]);

  // Auto-close after inactivity
  useEffect(() => {
    if (!isOpen) return;

    const timeout = setTimeout(() => {
      setIsOpen(false);
      setIsMinimized(false);
    }, 10 * 60 * 1000); // 10 minutes

    return () => clearTimeout(timeout);
  }, [isOpen, messages]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Update context based on user role and page
  useEffect(() => {
    if (user) {
      setContext(prev => ({
        ...prev,
        role: user.role,
        department: user.department,
        name: user.name,
        isAuthenticated: true
      }));
    } else {
      setContext(prev => ({
        ...prev,
        role: 'guest',
        isAuthenticated: false
      }));
    }
  }, [user]);

  // Send message
  const sendMessage = useCallback(async (content, options = {}) => {
    if (!content.trim()) return;

    // Add user message
    const userMessage = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type: 'user',
      content: content.trim(),
      timestamp: new Date().toISOString(),
      status: 'sent'
    };

    setMessages(prev => [...prev, userMessage]);
    setIsTyping(true);
    setError(null);

    try {
      // Prepare context for chatbot
      const chatContext = {
        ...context,
        sessionId,
        page: window.location.pathname,
        previousMessages: messages.slice(-5),
        sessionDuration: Date.now() - sessionStartTime.current
      };

      // Send to chatbot service
      const response = await chatbotService.sendMessage(content, chatContext);

      // Add bot response
      const botMessage = {
        id: `bot-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type: 'bot',
        content: response.response,
        timestamp: new Date().toISOString(),
        suggestions: response.suggestions || [],
        quickReplies: response.quick_replies || [],
        actions: response.actions || [],
        metadata: response.metadata || {},
        confidence: response.confidence
      };

      setMessages(prev => [...prev, botMessage]);
      
      // Update session ID
      if (response.session_id) {
        setSessionId(response.session_id);
      }

      // Update suggestions
      if (response.suggestions) {
        setSuggestions(response.suggestions);
      }

      // Increment unread count if chat is closed
      if (!isOpen) {
        setUnreadCount(prev => prev + 1);
      }

    } catch (error) {
      console.error('Chatbot error:', error);
      setError('Failed to get response');

      // Add error message
      const errorMessage = {
        id: `error-${Date.now()}`,
        type: 'system',
        content: 'Sorry, I\'m having trouble connecting. Please try again.',
        timestamp: new Date().toISOString(),
        isError: true
      };

      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  }, [context, sessionId, messages, isOpen]);

  // Send quick reply
  const sendQuickReply = useCallback((reply) => {
    sendMessage(reply);
  }, [sendMessage]);

  // Clear chat
  const clearChat = useCallback(() => {
    setMessages([]);
    setSessionId(null);
    setSuggestions([]);
    setError(null);
    sessionStartTime.current = Date.now();
    localStorage.removeItem('chatHistory');
  }, []);

  // Toggle chat
  const toggleChat = useCallback(() => {
    setIsOpen(prev => !prev);
    if (!isOpen) {
      setUnreadCount(0);
    }
  }, [isOpen]);

  // Minimize chat
  const minimizeChat = useCallback(() => {
    setIsMinimized(prev => !prev);
  }, []);

  // Rate message
  const rateMessage = useCallback(async (messageId, rating, feedback = '') => {
    try {
      await chatbotService.rateResponse(messageId, rating, feedback);
      
      // Update message in state
      setMessages(prev =>
        prev.map(msg =>
          msg.id === messageId
            ? { ...msg, rating, rated: true }
            : msg
        )
      );
    } catch (error) {
      console.error('Failed to rate message:', error);
    }
  }, []);

  // Get conversation context
  const getConversationContext = useCallback(() => {
    return {
      messages,
      sessionId,
      duration: Date.now() - sessionStartTime.current,
      messageCount: messages.length
    };
  }, [messages, sessionId]);

  // Export conversation
  const exportConversation = useCallback(() => {
    const conversation = messages.map(msg => ({
      type: msg.type,
      content: msg.content,
      timestamp: msg.timestamp,
      rating: msg.rating
    }));

    const blob = new Blob([JSON.stringify(conversation, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `chat-${new Date().toISOString()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [messages]);

  // Context value
  const value = {
    // State
    isOpen,
    isMinimized,
    messages,
    isTyping,
    unreadCount,
    suggestions,
    context,
    error,
    
    // Actions
    sendMessage,
    sendQuickReply,
    clearChat,
    toggleChat,
    minimizeChat,
    rateMessage,
    exportConversation,
    
    // Getters
    getConversationContext,
    
    // Refs
    messagesEndRef,
    
    // Status
    hasUnread: unreadCount > 0
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};
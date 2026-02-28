import { api } from './axiosConfig';

class ChatbotService {
  constructor() {
    this.sessionId = null;
    this.conversationHistory = [];
  }

  // Send message to chatbot
  async sendMessage(message) {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        session_id: this.sessionId,
        context: this.getContext()
      });

      if (response.data.session_id) {
        this.sessionId = response.data.session_id;
      }

      // Add to conversation history
      this.conversationHistory.push({
        type: 'user',
        message,
        timestamp: new Date().toISOString()
      });

      this.conversationHistory.push({
        type: 'bot',
        message: response.data.response,
        timestamp: new Date().toISOString(),
        suggestions: response.data.suggestions,
        quickReplies: response.data.quick_replies
      });

      return response.data;
    } catch (error) {
      console.error('Chatbot error:', error);
      throw this.handleError(error);
    }
  }

  // Get conversation history
  getConversationHistory() {
    return this.conversationHistory;
  }

  // Clear conversation
  clearConversation() {
    this.sessionId = null;
    this.conversationHistory = [];
  }

  // Get FAQ categories
  async getFaqCategories() {
    try {
      const response = await api.get('/chatbot/faq/categories');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get FAQs by category
  async getFaqsByCategory(categoryId) {
    try {
      const response = await api.get(`/chatbot/faq/${categoryId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Search FAQs
  async searchFaqs(query) {
    try {
      const response = await api.get(`/chatbot/faq/search?q=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get quick replies based on context
  async getQuickReplies(context) {
    try {
      const response = await api.post('/chatbot/quick-replies', { context });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Rate chatbot response
  async rateResponse(messageId, rating, feedback = '') {
    try {
      const response = await api.post('/chatbot/rate', {
        message_id: messageId,
        rating,
        feedback
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get user context for personalized responses
  getContext() {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    return {
      role: user.role,
      department: user.department,
      hasPendingComplaints: false, // This would be fetched from actual data
      recentActivity: []
    };
  }

  // Handle fallback responses (offline mode)
  getFallbackResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Simple rule-based fallback responses
    if (lowerMessage.includes('hello') || lowerMessage.includes('hi')) {
      return {
        response: "Hello! How can I help you with the complaint system today?",
        suggestions: ["Submit complaint", "Check status", "FAQ"]
      };
    }
    
    if (lowerMessage.includes('complaint') && lowerMessage.includes('how')) {
      return {
        response: "To submit a complaint, click on the 'New Complaint' button in your dashboard. You'll need to provide a title, category, description, and location.",
        suggestions: ["Categories", "Track complaint", "Contact support"]
      };
    }
    
    if (lowerMessage.includes('status') || lowerMessage.includes('track')) {
      return {
        response: "You can track your complaints in the 'My Complaints' section. Each complaint shows its current status and progress.",
        suggestions: ["View complaints", "Status meanings", "Update time"]
      };
    }
    
    if (lowerMessage.includes('category')) {
      return {
        response: "Complaint categories include: Dormitory Maintenance, Laboratory Equipment, Internet Connectivity, Classroom Facilities, Library Services, Cafeteria Issues, Security Concerns, and Other.",
        suggestions: ["Dormitory", "Internet", "Laboratory"]
      };
    }
    
    if (lowerMessage.includes('time') || lowerMessage.includes('how long')) {
      return {
        response: "Typical resolution times vary by category. Urgent issues are addressed within 24 hours, while standard complaints may take 3-5 business days.",
        suggestions: ["Urgent issues", "Track progress", "Escalate"]
      };
    }
    
    // Default fallback
    return {
      response: "I'm not sure I understand. Could you please rephrase your question? You can also check our FAQ section for common questions.",
      suggestions: ["FAQ", "Contact support", "Submit complaint"]
    };
  }

  handleError(error) {
    if (error.response) {
      return {
        status: error.response.status,
        message: error.response.data.message || 'Chatbot communication failed',
        errors: error.response.data.errors || {}
      };
    }
    return {
      status: 503,
      message: 'Chatbot service unavailable. Using offline mode.',
      errors: {}
    };
  }
}

export default new ChatbotService();
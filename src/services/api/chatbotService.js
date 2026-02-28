import { api } from './axiosConfig';

class ChatbotService {
  // Send message to chatbot
  async sendMessage(message, sessionId = null) {
    try {
      const response = await api.post('/chatbot/message', {
        message,
        session_id: sessionId
      });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Get conversation history
  async getConversationHistory(sessionId) {
    try {
      const response = await api.get(`/chatbot/history/${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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

  // Get quick replies
  async getQuickReplies() {
    try {
      const response = await api.get('/chatbot/quick-replies');
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Rate chatbot response
  async rateResponse(messageId, rating) {
    try {
      const response = await api.post(`/chatbot/rate/${messageId}`, { rating });
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
  }

  // Clear conversation
  async clearConversation(sessionId) {
    try {
      const response = await api.delete(`/chatbot/conversation/${sessionId}`);
      return response.data;
    } catch (error) {
      throw this.handleError(error);
    }
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
      status: 500,
      message: 'Unable to connect to chatbot service',
      errors: {}
    };
  }
}

export default new ChatbotService();
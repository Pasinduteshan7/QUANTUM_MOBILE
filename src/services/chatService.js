import api from './api';

/**
 * REST API Chat helpers for customer & admin messaging
 */
export const chatService = {
  /**
   * Send message via REST
   */
  sendMessageRest: async (payload) => {
    const res = await api.post('/chat/send', payload);
    return res.data;
  },

  /**
   * Get all conversations for the logged-in customer
   */
  getCustomerConversations: async () => {
    const res = await api.get('/chat/conversations');
    return res.data;
  },

  /**
   * Get all conversations across the store (Store Owner / Admin only)
   */
  getAdminConversations: async () => {
    const res = await api.get('/chat/admin/conversations');
    return res.data;
  },

  /**
   * Fetch complete message history for a conversation thread
   */
  getConversationMessages: async (conversationId) => {
    const res = await api.get(`/chat/conversations/${conversationId}/messages`);
    return res.data;
  },

  /**
   * Mark messages in a conversation as read
   */
  markAsRead: async (conversationId) => {
    await api.post(`/chat/conversations/${conversationId}/read`);
  }
};

export default chatService;

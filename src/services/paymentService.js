import api from './api';

export const paymentService = {
  /**
   * Requests a Stripe PaymentIntent from the Express backend
   */
  createPaymentIntent: async (amount, orderId = null, currency = 'lkr') => {
    const response = await api.post('/payments/create-intent', {
      amount,
      orderId,
      currency
    });
    return response.data;
  },

  /**
   * Verifies the payment and marks order as paid
   */
  confirmPayment: async (paymentIntentId, orderId = null) => {
    const response = await api.post(`/payments/confirm/${paymentIntentId}`, {
      orderId
    });
    return response.data;
  },

  /**
   * Fetches Stripe configuration (Publishable Key)
   */
  getConfig: async () => {
    const response = await api.get('/payments/config');
    return response.data;
  },

  /**
   * Generates MD5 hash signature for PayHere Sri Lanka Sandbox
   */
  getPayHereHash: async (orderId, amount, currency = 'LKR') => {
    const response = await api.post('/payments/payhere/hash', {
      orderId,
      amount,
      currency
    });
    return response.data;
  }
};

export default paymentService;

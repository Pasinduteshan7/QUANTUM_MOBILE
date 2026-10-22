import api from './api';
export const paymentService = {
    /**
     * Requests a Stripe PaymentIntent from the Spring Boot backend
     * Returns the clientSecret needed by Stripe Elements to confirm the card
     */
    createPaymentIntent: async (orderId) => {
        const response = await api.post('/payments/create-intent', {
            orderId: Number(orderId)
        });
        return response.data;
    },
    /**
     * Tells the backend to verify the Stripe payment status and mark the order as PROCESSING
     */
    confirmPayment: async (paymentIntentId) => {
        const response = await api.post(`/payments/confirm/${paymentIntentId}`);
        return response.data;
    }
};

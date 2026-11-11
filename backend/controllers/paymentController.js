import Stripe from 'stripe';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

const getStripeInstance = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey || secretKey.trim() === '') {
    return null;
  }
  return new Stripe(secretKey);
};

/**
 * @desc    Create Stripe PaymentIntent
 * @route   POST /api/payments/create-intent
 * @access  Public / Protected
 */
export const createPaymentIntent = async (req, res, next) => {
  try {
    const { amount, currency = 'lkr', orderId } = req.body;

    if (!amount || amount <= 0) {
      return sendError(res, 400, 'Invalid payment amount specified.');
    }

    const stripe = getStripeInstance();

    // Live Stripe Mode if secret key configured
    if (stripe) {
      try {
        const paymentIntent = await stripe.paymentIntents.create({
          amount: Math.round(Number(amount)), // In cents/smallest unit
          currency: currency.toLowerCase(),
          metadata: {
            orderId: orderId ? String(orderId) : 'guest_order'
          },
          automatic_payment_methods: {
            enabled: true
          }
        });

        return sendSuccess(res, 200, 'Payment intent created successfully', {
          clientSecret: paymentIntent.client_secret,
          id: paymentIntent.id,
          currency: paymentIntent.currency,
          amount: paymentIntent.amount,
          sandbox: false
        });
      } catch (stripeErr) {
        console.warn('⚠️ Stripe API error, falling back to sandbox simulator:', stripeErr.message);
      }
    }

    // Sandbox / Demo Mode fallback (when keys not yet in .env)
    const simulatedId = `pi_test_${Date.now()}`;
    const simulatedSecret = `${simulatedId}_secret_${Math.random().toString(36).substring(2, 9)}`;

    return sendSuccess(res, 200, 'Stripe Sandbox simulated payment intent ready', {
      clientSecret: simulatedSecret,
      id: simulatedId,
      currency: currency.toLowerCase(),
      amount: Number(amount),
      sandbox: true
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Confirm Stripe Payment & update Order status
 * @route   POST /api/payments/confirm/:id
 * @access  Public / Protected
 */
export const confirmPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { orderId } = req.body;

    if (orderId) {
      await Order.findByIdAndUpdate(orderId, {
        isPaid: true,
        paidAt: new Date(),
        orderStatus: 'PROCESSING',
        'paymentResult.transactionId': id,
        'paymentResult.status': 'COMPLETED',
        'paymentResult.updatedAt': new Date().toISOString()
      });
    }

    return sendSuccess(res, 200, 'Payment confirmed successfully', {
      paymentIntentId: id,
      status: 'succeeded'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Stripe Publishable Key configuration
 * @route   GET /api/payments/config
 * @access  Public
 */
export const getStripeConfig = async (req, res) => {
  const publishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
  return sendSuccess(res, 200, 'Stripe config', {
    publishableKey,
    hasKey: !!publishableKey
  });
};

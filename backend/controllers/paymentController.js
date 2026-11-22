import crypto from 'crypto';
import Stripe from 'stripe';
import Order from '../models/Order.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitOrderStatusUpdated } from '../socket.js';

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
      const updatedOrder = await Order.findByIdAndUpdate(
        orderId,
        {
          isPaid: true,
          paidAt: new Date(),
          orderStatus: 'PROCESSING',
          'paymentResult.transactionId': id,
          'paymentResult.status': 'COMPLETED',
          'paymentResult.updatedAt': new Date().toISOString()
        },
        { new: true }
      );

      if (updatedOrder) {
        emitOrderStatusUpdated(updatedOrder);
      }
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

/**
 * @desc    Generate PayHere Checkout Hash (Sri Lanka Sandbox / Live)
 * @route   POST /api/payments/payhere/hash
 * @access  Public
 */
export const generatePayHereHash = async (req, res, next) => {
  try {
    const orderId = req.body.orderId || req.body.order_id;
    const amount = req.body.amount;
    const currency = req.body.currency || 'LKR';

    if (!orderId || !amount) {
      return sendError(res, 400, 'Order ID and amount are required to generate PayHere signature.');
    }

    const merchantId = process.env.PAYHERE_MERCHANT_ID || '1211149';
    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '4MTYwMDk5NDY4NzE1NjQ4NDU3NDQyMTUzMDI4MDU=';

    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const amountFormatted = parseFloat(amount).toFixed(2);
    const hashString = `${merchantId}${orderId}${amountFormatted}${currency}${hashedSecret}`;
    const hash = crypto
      .createHash('md5')
      .update(hashString)
      .digest('hex')
      .toUpperCase();

    return sendSuccess(res, 200, 'PayHere hash generated successfully', {
      merchantId,
      orderId,
      amount: amountFormatted,
      currency,
      hash,
      sandbox: process.env.PAYHERE_MODE !== 'live'
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    PayHere Server-to-Server IPN / Notification Webhook
 * @route   POST /api/payments/payhere/notify
 * @access  Public
 */
export const handlePayHereNotify = async (req, res, next) => {
  try {
    const {
      merchant_id,
      order_id,
      payment_id,
      payhere_amount,
      payhere_currency,
      status_code,
      md5sig
    } = req.body;

    const merchantSecret = process.env.PAYHERE_MERCHANT_SECRET || '4MTYwMDk5NDY4NzE1NjQ4NDU3NDQyMTUzMDI4MDU=';

    const hashedSecret = crypto
      .createHash('md5')
      .update(merchantSecret)
      .digest('hex')
      .toUpperCase();

    const verificationString = `${merchant_id}${order_id}${payhere_amount}${payhere_currency}${status_code}${hashedSecret}`;
    const localMd5sig = crypto
      .createHash('md5')
      .update(verificationString)
      .digest('hex')
      .toUpperCase();

    if (localMd5sig === md5sig) {
      if (Number(status_code) === 2) {
        let order = null;
        if (order_id && order_id.length === 24) {
          order = await Order.findById(order_id);
        }
        if (!order) {
          order = await Order.findOne({ 'paymentResult.transactionId': order_id });
        }

        if (order) {
          order.isPaid = true;
          order.paidAt = new Date();
          order.orderStatus = 'PROCESSING';
          order.paymentMethod = 'PayHere';
          order.paymentResult = {
            transactionId: payment_id,
            status: 'COMPLETED',
            updatedAt: new Date().toISOString()
          };
          await order.save();
          console.log(`✅ [PayHere IPN] Order #${order_id} marked as PAID via PayHere (Payment ID: ${payment_id})`);
        }
      }
      return res.status(200).send('OK');
    } else {
      console.warn('⚠️ [PayHere IPN] Invalid signature received.');
      return res.status(400).send('Invalid signature');
    }
  } catch (error) {
    console.error('PayHere notify error:', error);
    return res.status(500).send('Internal Server Error');
  }
};


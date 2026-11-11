import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendOrderConfirmationEmail } from '../utils/emailService.js';

/**
 * @desc    Create new order & checkout
 * @route   POST /api/orders
 * @access  Private (Requires Logged-In User)
 */
export const createOrder = async (req, res, next) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      totalPrice
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return sendError(res, 400, 'Cannot place order with empty items list.');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      return sendError(res, 400, 'Complete shipping address and phone number are required.');
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'PayHere',
      itemsPrice: Number(itemsPrice),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice),
      orderStatus: 'PENDING'
    });

    const createdOrder = await order.save();

    // Automatically empty the user's cart after successful order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Asynchronously send order confirmation email without blocking checkout response
    if (req.user && req.user.email) {
      sendOrderConfirmationEmail(req.user.email, req.user.name, createdOrder).catch(
        (err) => console.error('Failed to dispatch order email:', err.message)
      );
    }

    return sendSuccess(res, 201, 'Order placed successfully!', createdOrder);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get logged in user orders
 * @route   GET /api/orders/my-orders
 * @access  Private
 */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get order by ID
 * @route   GET /api/orders/:id
 * @access  Private
 */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id).populate('user', 'name email phone');

    if (!order) {
      return sendError(res, 404, 'Order not found.');
    }

    // Security check: ensure requesting user owns the order or is an admin
    if (order.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return sendError(res, 403, 'Not authorized to view this order.');
    }

    return sendSuccess(res, 200, 'Order details retrieved', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    PayHere IPN (Instant Payment Notification) Webhook
 * @route   POST /api/orders/payhere-notify
 * @access  Public (Called by PayHere gateway)
 */
export const payhereNotify = async (req, res, next) => {
  try {
    const { order_id, status_code, payment_id } = req.body;

    console.log(`[PayHere Webhook] Order: ${order_id} | Status: ${status_code} | PaymentId: ${payment_id}`);

    // status_code 2 indicates success in PayHere Sri Lanka
    if (status_code === '2' || status_code === 2) {
      const order = await Order.findById(order_id);
      if (order) {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = {
          transactionId: payment_id,
          status: 'SUCCESS',
          updatedAt: new Date().toISOString()
        };
        order.orderStatus = 'PROCESSING';
        await order.save();
      }
    }

    // Acknowledge receipt to PayHere
    return res.status(200).send('OK');
  } catch (error) {
    console.error('[PayHere Webhook Error]:', error.message);
    return res.status(500).send('Error');
  }
};

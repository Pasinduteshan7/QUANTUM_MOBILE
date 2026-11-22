import Order from '../models/Order.js';
import Cart from '../models/Cart.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { sendOrderReceiptEmail } from '../utils/emailService.js';
import { emitOrderCreated, emitBulkStockUpdated, emitOrderStatusUpdated } from '../socket.js';

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
      totalPrice,
      isPaid,
      paidAt,
      paymentResult
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return sendError(res, 400, 'Cannot place order with empty items list.');
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street) {
      return sendError(res, 400, 'Complete shipping address and phone number are required.');
    }

    const normalizedItems = orderItems.map((item) => ({
      name: item.name,
      quantity: Number(item.quantity || item.qty || 1),
      image: item.image || '/accessories.jpg',
      price: Number(item.price || item.unitPrice || 0),
      selectedFinish: item.selectedFinish || {},
      product: item.product || item.productId || item.id || 'standard_item'
    }));

    const order = new Order({
      user: req.user._id,
      orderItems: normalizedItems,
      shippingAddress: {
        ...shippingAddress,
        district: shippingAddress.district || shippingAddress.city || 'Colombo',
        postalCode: shippingAddress.postalCode || '00300'
      },
      paymentMethod: paymentMethod || 'Stripe',
      isPaid: !!isPaid,
      paidAt: isPaid ? (paidAt || new Date()) : null,
      paymentResult: paymentResult || {},
      itemsPrice: Number(itemsPrice),
      shippingPrice: Number(shippingPrice || 0),
      totalPrice: Number(totalPrice),
      orderStatus: isPaid ? 'PROCESSING' : 'PENDING'
    });

    const createdOrder = await order.save();

    // Broadcast new order creation & inventory deduction via WebSockets
    emitOrderCreated(createdOrder);
    emitBulkStockUpdated(normalizedItems);

    // Automatically empty the user's cart after successful order creation
    await Cart.findOneAndUpdate({ user: req.user._id }, { items: [] });

    // Asynchronously send order receipt email without blocking checkout response
    const recipientEmail = req.body.customerEmail || req.user?.email;
    const recipientName = req.body.shippingAddress?.fullName || req.user?.name || 'Valued Customer';
    if (recipientEmail) {
      sendOrderReceiptEmail(recipientEmail, recipientName, createdOrder).catch(
        (err) => console.error('Failed to dispatch order receipt email:', err.message)
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
 * @desc    Lookup orders live status & tracking by Order Reference / ID list (Public Status Sync)
 * @route   POST /api/orders/lookup-status
 * @access  Public
 */
export const lookupOrdersStatus = async (req, res, next) => {
  try {
    const { orderIds } = req.body;
    if (!Array.isArray(orderIds) || orderIds.length === 0) {
      return sendSuccess(res, 200, 'No order references provided', []);
    }

    const objectIds = [];
    const shortIds = [];

    for (const ref of orderIds) {
      if (!ref || typeof ref !== 'string') continue;
      const clean = ref.replace(/^ORD-/, '').trim().toLowerCase();
      if (clean.length === 24 && /^[0-9a-f]{24}$/.test(clean)) {
        objectIds.push(clean);
      } else if (clean.length >= 4) {
        shortIds.push(clean);
      }
    }

    let foundOrders = [];
    if (objectIds.length > 0) {
      const byId = await Order.find({ _id: { $in: objectIds } });
      foundOrders.push(...byId);
    }

    if (shortIds.length > 0) {
      const recent = await Order.find().sort({ createdAt: -1 }).limit(100);
      const matched = recent.filter(ord => {
        const hex = ord._id.toString().toLowerCase();
        return shortIds.some(s => hex.endsWith(s));
      });
      foundOrders.push(...matched);
    }

    const uniqueMap = new Map();
    foundOrders.forEach(o => uniqueMap.set(o._id.toString(), o));

    return sendSuccess(res, 200, 'Live order statuses retrieved', Array.from(uniqueMap.values()));
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
        emitOrderStatusUpdated(order);
      }
    }

    // Acknowledge receipt to PayHere
    return res.status(200).send('OK');
  } catch (error) {
    console.error('[PayHere Webhook Error]:', error.message);
    return res.status(500).send('Error');
  }
};

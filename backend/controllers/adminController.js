import Product from '../models/Product.js';
import Order from '../models/Order.js';
import User from '../models/User.js';
import AuditLog from '../models/AuditLog.js';
import ChatMessage from '../models/ChatMessage.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Get Admin Dashboard Stats & Stock Counters
 * @route   GET /api/admin/stats
 * @access  Private / Admin
 */
export const getAdminStats = async (req, res, next) => {
  try {
    const totalOrders = await Order.countDocuments();
    const pendingOrders = await Order.countDocuments({
      orderStatus: { $in: ['PENDING', 'PROCESSING'] }
    });

    // Calculate total revenue from paid orders or all completed orders
    const revenueAgg = await Order.aggregate([
      { $match: { orderStatus: { $ne: 'CANCELLED' } } },
      { $group: { _id: null, total: { $sum: '$totalPrice' } } }
    ]);
    const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    const totalProducts = await Product.countDocuments();
    const lowStockCount = await Product.countDocuments({ stock: { $gt: 0, $lte: 5 } });
    const outOfStockCount = await Product.countDocuments({ stock: { $lte: 0 } });

    // Stock units aggregation
    const stockAgg = await Product.aggregate([
      { $group: { _id: null, totalUnits: { $sum: '$stock' }, totalValue: { $sum: { $multiply: ['$price', '$stock'] } } } }
    ]);
    const totalStockUnits = stockAgg.length > 0 ? stockAgg[0].totalUnits : 0;
    const inventoryValue = stockAgg.length > 0 ? stockAgg[0].totalValue : 0;

    const totalUsers = await User.countDocuments({ role: 'customer' });
    const unreadChats = await ChatMessage.countDocuments({ isStaff: false, isRead: false });

    const recentOrders = await Order.find()
      .sort({ createdAt: -1 })
      .limit(6)
      .populate('user', 'name email');

    const lowStockProducts = await Product.find({ stock: { $lte: 5 } })
      .sort({ stock: 1 })
      .limit(8)
      .select('name brand price stock mainImage category');

    return sendSuccess(res, 200, 'Admin stats loaded successfully', {
      totalRevenue,
      totalOrders,
      pendingOrders,
      totalProducts,
      totalStockUnits,
      inventoryValue,
      lowStockCount,
      outOfStockCount,
      totalUsers,
      unreadChats,
      recentOrders,
      lowStockProducts
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Products with stock status for Admin inventory table
 * @route   GET /api/admin/products
 * @access  Private / Admin
 */
export const getAllAdminProducts = async (req, res, next) => {
  try {
    const { search, category, stockStatus } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { brand: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) {
      query.category = { $regex: new RegExp(`^${category}$`, 'i') };
    }

    if (stockStatus === 'out') {
      query.stock = { $lte: 0 };
    } else if (stockStatus === 'low') {
      query.stock = { $gt: 0, $lte: 5 };
    } else if (stockStatus === 'in') {
      query.stock = { $gt: 5 };
    }

    const products = await Product.find(query).sort({ stock: 1, createdAt: -1 });
    return sendSuccess(res, 200, 'Products retrieved for admin', products);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Fast Quick Stock Counter Update (+1, -1, direct count)
 * @route   PUT /api/admin/products/:id/stock
 * @access  Private / Admin
 */
export const updateProductStock = async (req, res, next) => {
  try {
    const { stock, delta } = req.body;
    const product = await Product.findById(req.params.id);

    if (!product) {
      return sendError(res, 404, 'Product not found.');
    }

    const oldStock = product.stock;
    let newStock = oldStock;

    if (typeof stock === 'number') {
      newStock = Math.max(0, stock);
    } else if (typeof delta === 'number') {
      newStock = Math.max(0, oldStock + delta);
    }

    product.stock = newStock;
    await product.save();

    // Record in Audit Trail
    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'PRODUCT_STOCK_UPDATE',
      target: `${product.name} (Stock: ${oldStock} -> ${newStock})`,
      details: { productId: product._id, oldStock, newStock, delta },
      level: newStock === 0 ? 'danger' : newStock <= 5 ? 'warning' : 'info',
      ip: req.ip || req.connection?.remoteAddress
    });

    return sendSuccess(res, 200, 'Stock count updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Create Product
 * @route   POST /api/admin/products
 * @access  Private / Admin
 */
export const adminCreateProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'PRODUCT_CREATE',
      target: `${product.name} (${product.brand} - LKR ${product.price?.toLocaleString()})`,
      details: { productId: product._id, brand: product.brand, price: product.price, stock: product.stock },
      level: 'success',
      ip: req.ip
    });

    return sendSuccess(res, 201, 'Product created successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Update Product
 * @route   PUT /api/admin/products/:id
 * @access  Private / Admin
 */
export const adminUpdateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!product) {
      return sendError(res, 404, 'Product not found.');
    }

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'PRODUCT_UPDATE',
      target: `${product.name}`,
      details: { productId: product._id, updatedFields: Object.keys(req.body) },
      level: 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Product updated successfully', product);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Delete Product
 * @route   DELETE /api/admin/products/:id
 * @access  Private / Admin
 */
export const adminDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return sendError(res, 404, 'Product not found.');
    }

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'PRODUCT_DELETE',
      target: `${product.name} (Removed from catalog)`,
      details: { productId: product._id },
      level: 'danger',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Product removed from catalog');
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Orders for Admin fulfillment
 * @route   GET /api/admin/orders
 * @access  Private / Admin
 */
export const getAllAdminOrders = async (req, res, next) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user', 'name email phone');

    return sendSuccess(res, 200, 'Orders retrieved successfully', orders);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Update Order Status
 * @route   PUT /api/admin/orders/:id/status
 * @access  Private / Admin
 */
export const updateAdminOrderStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const order = await Order.findById(req.params.id);

    if (!order) {
      return sendError(res, 404, 'Order not found.');
    }

    const oldStatus = order.orderStatus;
    order.orderStatus = status;

    if (status === 'DELIVERED') {
      order.deliveredAt = new Date();
    }

    await order.save();

    await AuditLog.create({
      user: req.user?._id,
      userName: req.user?.name || 'Store Admin',
      userRole: req.user?.role || 'admin',
      action: 'ORDER_STATUS_UPDATE',
      target: `Order #${order._id.toString().slice(-6).toUpperCase()} (${oldStatus} -> ${status})`,
      details: { orderId: order._id, oldStatus, newStatus: status },
      level: status === 'CANCELLED' ? 'danger' : 'info',
      ip: req.ip
    });

    return sendSuccess(res, 200, 'Order status updated', order);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Registered Customers
 * @route   GET /api/admin/users
 * @access  Private / Admin
 */
export const getAllAdminUsers = async (req, res, next) => {
  try {
    const users = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    return sendSuccess(res, 200, 'Customers retrieved', users);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Live Customer Chat Inquiries
 * @route   GET /api/admin/chats
 * @access  Private / Admin
 */
export const getAdminChats = async (req, res, next) => {
  try {
    // Group messages by threadId (or fallback to conversationId)
    const threads = await ChatMessage.aggregate([
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: {
            $cond: [
              { $and: [{ $ne: ['$threadId', ''] }, { $ne: ['$threadId', null] }] },
              '$threadId',
              '$conversationId'
            ]
          },
          conversationId: { $last: '$conversationId' },
          threadId: { $last: '$threadId' },
          customerName: { $last: '$senderName' },
          customerEmail: { $last: '$senderEmail' },
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          lastSenderRole: { $last: '$senderRole' },
          isStaffReply: { $last: '$isStaff' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$isStaff', false] }, { $eq: ['$isRead', false] }] }, 1, 0]
            }
          },
          totalMessages: { $sum: 1 },
          productContext: { $last: '$productContext' }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    return sendSuccess(res, 200, 'Chat threads retrieved', threads);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get full message history for a specific conversation or thread
 * @route   GET /api/admin/chats/:conversationId
 * @access  Private / Admin
 */
export const getConversationMessages = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const messages = await ChatMessage.find({
      $or: [
        { conversationId },
        { threadId: conversationId }
      ]
    }).sort({ createdAt: 1 });

    // Mark customer messages in this thread as read
    await ChatMessage.updateMany(
      {
        $or: [{ conversationId }, { threadId: conversationId }],
        isStaff: false,
        isRead: false
      },
      { $set: { isRead: true } }
    );

    return sendSuccess(res, 200, 'Conversation messages retrieved', messages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Admin Reply to Customer Inquiry
 * @route   POST /api/admin/chats/reply
 * @access  Private / Admin
 */
export const replyAdminChat = async (req, res, next) => {
  try {
    const { conversationId, threadId, message } = req.body;

    if (!conversationId || !message) {
      return sendError(res, 400, 'Conversation ID and message are required.');
    }

    // Lookup existing productContext from previous message in this thread
    const prevMsg = await ChatMessage.findOne({
      $or: [{ threadId: threadId || conversationId }, { conversationId }]
    }).sort({ createdAt: -1 });

    const reply = await ChatMessage.create({
      conversationId: prevMsg?.conversationId || conversationId,
      threadId: threadId || prevMsg?.threadId || conversationId,
      senderName: req.user?.name || 'Quantum Specialist',
      senderEmail: req.user?.email || 'support@quick.lk',
      senderRole: req.user?.role || 'admin',
      message,
      productContext: prevMsg?.productContext || null,
      isStaff: true,
      isRead: true
    });

    return sendSuccess(res, 201, 'Reply sent to customer', reply);
  } catch (error) {
    next(error);
  }
};

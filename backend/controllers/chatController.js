import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import ChatMessage from '../models/ChatMessage.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { emitChatMessage } from '../socket.js';

/**
 * Helper to safely extract authenticated user from Bearer token
 */
const getAuthenticatedUser = async (req) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      const token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return await User.findById(decoded.id).select('-password');
    } catch (e) {
      return null;
    }
  }
  return null;
};

/**
 * @desc    Customer Send Inquiry / Live Chat Message
 * @route   POST /api/chat/send
 * @access  Public (Guest or Authenticated)
 */
export const customerSendMessage = async (req, res, next) => {
  try {
    const { conversationId, threadId, name, email, message, productContext } = req.body;

    if (!conversationId || !message) {
      return sendError(res, 400, 'Conversation ID and message are required.');
    }

    // If caller has auth token, resolve their actual verified identity
    const authUser = await getAuthenticatedUser(req);
    const effectiveSenderName = authUser?.name || name || 'Guest Customer';
    const effectiveSenderEmail = authUser?.email || email || '';
    const effectiveConvId = authUser
      ? (conversationId.startsWith('user_') ? conversationId : `user_${authUser._id}`)
      : conversationId;

    const effectiveThreadId = threadId || (productContext?.id ? `${effectiveConvId}_${productContext.id}` : effectiveConvId);

    const chatMsg = await ChatMessage.create({
      conversationId: effectiveConvId,
      threadId: effectiveThreadId,
      senderName: effectiveSenderName,
      senderEmail: effectiveSenderEmail,
      senderRole: authUser ? (authUser.role || 'customer') : 'customer',
      message,
      productContext: productContext || null,
      isStaff: false,
      isRead: false
    });

    emitChatMessage(chatMsg);

    return sendSuccess(res, 201, 'Message sent to store specialists', chatMsg);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Chat History for a Customer or specific Thread
 * @route   GET /api/chat/history/:conversationId
 * @access  Public / Protected (Enforces ownership check if user_<id>)
 */
export const getCustomerChatHistory = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { threadId } = req.query;

    // Strict privacy boundary: Registered user histories require verified JWT
    if (conversationId.startsWith('user_')) {
      const authUser = await getAuthenticatedUser(req);
      const targetUserId = conversationId.replace('user_', '');

      if (!authUser) {
        return sendError(res, 401, 'Authentication required to access registered account conversation history.');
      }

      const role = String(authUser.role || '').toLowerCase();
      const isAdmin =
        ['admin', 'super_admin', 'store_admin', 'tech_admin', 'technician'].includes(role) ||
        role.includes('admin');
      const isOwner = authUser._id.toString() === targetUserId;

      if (!isOwner && !isAdmin) {
        return sendError(res, 403, 'Access denied: You do not have permission to view another customer\'s chat history.');
      }
    }

    const query = { conversationId };
    if (threadId) {
      query.threadId = threadId;
    }

    const messages = await ChatMessage.find(query).sort({ createdAt: 1 });
    return sendSuccess(res, 200, 'Chat history retrieved', messages);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get All Product Threads for a Customer
 * @route   GET /api/chat/threads/:conversationId
 * @access  Public / Protected (Enforces ownership check if user_<id>)
 */
export const getCustomerThreads = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

    // Strict privacy boundary: Registered user inquiry lists require verified JWT
    if (conversationId.startsWith('user_')) {
      const authUser = await getAuthenticatedUser(req);
      const targetUserId = conversationId.replace('user_', '');

      if (!authUser) {
        return sendError(res, 401, 'Authentication required to access registered account inquiry history.');
      }

      const role = String(authUser.role || '').toLowerCase();
      const isAdmin =
        ['admin', 'super_admin', 'store_admin', 'tech_admin', 'technician'].includes(role) ||
        role.includes('admin');
      const isOwner = authUser._id.toString() === targetUserId;

      if (!isOwner && !isAdmin) {
        return sendError(res, 403, 'Access denied: You do not have permission to view another customer\'s inquiry threads.');
      }
    }

    const threads = await ChatMessage.aggregate([
      { $match: { conversationId } },
      { $sort: { createdAt: 1 } },
      {
        $group: {
          _id: '$threadId',
          conversationId: { $last: '$conversationId' },
          productContext: { $last: '$productContext' },
          lastMessage: { $last: '$message' },
          lastMessageTime: { $last: '$createdAt' },
          isStaffReply: { $last: '$isStaff' },
          unreadCount: {
            $sum: {
              $cond: [{ $and: [{ $eq: ['$isStaff', true] }, { $eq: ['$isRead', false] }] }, 1, 0]
            }
          },
          totalMessages: { $sum: 1 }
        }
      },
      { $sort: { lastMessageTime: -1 } }
    ]);

    return sendSuccess(res, 200, 'Customer threads retrieved', threads);
  } catch (error) {
    next(error);
  }
};

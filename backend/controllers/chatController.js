import ChatMessage from '../models/ChatMessage.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

/**
 * @desc    Customer Send Inquiry / Live Chat Message
 * @route   POST /api/chat/send
 * @access  Public
 */
export const customerSendMessage = async (req, res, next) => {
  try {
    const { conversationId, threadId, name, email, message, productContext } = req.body;

    if (!conversationId || !message) {
      return sendError(res, 400, 'Conversation ID and message are required.');
    }

    const effectiveThreadId = threadId || (productContext?.id ? `${conversationId}_${productContext.id}` : conversationId);

    const chatMsg = await ChatMessage.create({
      conversationId,
      threadId: effectiveThreadId,
      senderName: name || 'Guest Customer',
      senderEmail: email || '',
      senderRole: 'customer',
      message,
      productContext: productContext || null,
      isStaff: false,
      isRead: false
    });

    return sendSuccess(res, 201, 'Message sent to store specialists', chatMsg);
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get Chat History for a Customer or specific Thread
 * @route   GET /api/chat/history/:conversationId
 * @access  Public
 */
export const getCustomerChatHistory = async (req, res, next) => {
  try {
    const { conversationId } = req.params;
    const { threadId } = req.query;

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
 * @access  Public
 */
export const getCustomerThreads = async (req, res, next) => {
  try {
    const { conversationId } = req.params;

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

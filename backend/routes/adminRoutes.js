import express from 'express';
import {
  getAdminStats,
  getAllAdminProducts,
  updateProductStock,
  adminCreateProduct,
  adminUpdateProduct,
  adminDeleteProduct,
  getAllAdminOrders,
  updateAdminOrderStatus,
  getAllAdminUsers,
  getAdminChats,
  getConversationMessages,
  replyAdminChat
} from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & admin to all admin routes
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/products', getAllAdminProducts);
router.put('/products/:id/stock', updateProductStock);
router.post('/products', adminCreateProduct);
router.put('/products/:id', adminUpdateProduct);
router.delete('/products/:id', adminDeleteProduct);

router.get('/orders', getAllAdminOrders);
router.put('/orders/:id/status', updateAdminOrderStatus);

router.get('/users', getAllAdminUsers);

router.get('/chats', getAdminChats);
router.get('/chats/:conversationId', getConversationMessages);
router.post('/chats/reply', replyAdminChat);

export default router;

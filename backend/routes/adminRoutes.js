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
  replyAdminChat,
  sendAdminTestEmail
} from '../controllers/adminController.js';
import { protect, admin, requirePrivilege } from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply protect & admin to all admin routes
router.use(protect, admin);

router.get('/stats', getAdminStats);
router.get('/products', requirePrivilege('inventory:view'), getAllAdminProducts);
router.put('/products/:id/stock', requirePrivilege('inventory:adjust'), updateProductStock);
router.post('/products', requirePrivilege('products:create'), adminCreateProduct);
router.put('/products/:id', requirePrivilege('products:edit'), adminUpdateProduct);
router.delete('/products/:id', requirePrivilege('products:edit'), adminDeleteProduct);

router.get('/orders', requirePrivilege('orders:view'), getAllAdminOrders);
router.put('/orders/:id/status', requirePrivilege('orders:dispatch'), updateAdminOrderStatus);

router.get('/users', getAllAdminUsers);

router.get('/chats', requirePrivilege('chats:view'), getAdminChats);
router.get('/chats/:conversationId', requirePrivilege('chats:view'), getConversationMessages);
router.post('/chats/reply', requirePrivilege('chats:reply'), replyAdminChat);
router.post('/test-email', sendAdminTestEmail);

export default router;

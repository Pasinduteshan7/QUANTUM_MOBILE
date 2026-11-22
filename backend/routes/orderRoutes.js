import express from 'express';
import {
  createOrder,
  getMyOrders,
  getOrderById,
  payhereNotify,
  lookupOrdersStatus
} from '../controllers/orderController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public order status lookup (tracking receipts & local storage order sync)
router.post('/lookup-status', lookupOrdersStatus);

// PayHere Payment Webhook (Public callback from payment processor)
router.post('/payhere-notify', payhereNotify);

// Protected order operations
router.route('/')
  .post(protect, createOrder);

router.get('/my-orders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);

export default router;

import express from 'express';
import {
  getUserCart,
  addToCart,
  updateCartItemQty,
  removeFromCart,
  clearCart
} from '../controllers/cartController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// ALL CART OPERATIONS REQUIRE LOGGED-IN USER
router.use(protect);

router.route('/')
  .get(getUserCart)
  .delete(clearCart);

router.post('/add', addToCart);

router.route('/item/:itemId')
  .put(updateCartItemQty)
  .delete(removeFromCart);

export default router;

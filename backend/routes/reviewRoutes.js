import express from 'express';
import {
  checkProductReviewEligibility,
  createProductReview,
  getProductReviews,
  createRepairReview,
  getRepairReviews,
  getAllReviewsAdmin,
  replyToReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/product/:productId', getProductReviews);
router.get('/repairs', getRepairReviews);

// Customer protected routes (Verification enforced)
router.get('/product/:productId/eligibility', protect, checkProductReviewEligibility);
router.post('/product', protect, createProductReview);
router.post('/repair', protect, createRepairReview);

// Admin management routes
router.get('/admin', protect, admin, getAllReviewsAdmin);
router.post('/:id/reply', protect, admin, replyToReview);
router.delete('/:id', protect, admin, deleteReview);

export default router;


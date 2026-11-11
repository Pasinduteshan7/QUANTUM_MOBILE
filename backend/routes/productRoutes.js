import express from 'express';
import {
  getProducts,
  getProductById,
  getProductsByBrand,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes (Anyone can browse products & ecosystem catalogs)
router.get('/', getProducts);
router.get('/featured', getFeaturedProducts);
router.get('/brand/:brand', getProductsByBrand);
router.get('/:id', getProductById);

// Admin-only management routes
router.post('/', protect, admin, createProduct);
router.put('/:id', protect, admin, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

export default router;

import express from 'express';
import {
  createPosSale,
  getPosSales,
  getDailyPosSummary
} from '../controllers/posController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.post('/checkout', createPosSale);
router.get('/sales', getPosSales);
router.get('/daily-summary', getDailyPosSummary);

export default router;

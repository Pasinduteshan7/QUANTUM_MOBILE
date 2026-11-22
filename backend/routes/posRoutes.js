import express from 'express';
import {
  createPosSale,
  getPosSales,
  getDailyPosSummary
} from '../controllers/posController.js';
import { protect, admin, requirePrivilege } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.post('/checkout', requirePrivilege('pos:terminal'), createPosSale);
router.get('/sales', requirePrivilege('pos:terminal'), getPosSales);
router.get('/daily-summary', requirePrivilege('pos:terminal'), getDailyPosSummary);

export default router;

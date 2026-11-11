import express from 'express';
import {
  getLogisticsBoard,
  updateParcel
} from '../controllers/logisticsController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/board', getLogisticsBoard);
router.patch('/parcel/:id', updateParcel);

export default router;

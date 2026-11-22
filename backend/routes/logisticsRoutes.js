import express from 'express';
import {
  getLogisticsBoard,
  updateParcel
} from '../controllers/logisticsController.js';
import { protect, admin, requirePrivilege } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect, admin);

router.get('/board', requirePrivilege('logistics:dispatch'), getLogisticsBoard);
router.patch('/parcel/:id', requirePrivilege('logistics:dispatch'), updateParcel);

export default router;

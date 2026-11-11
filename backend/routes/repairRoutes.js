import express from 'express';
import {
  bookRepair,
  getOccupiedSlots,
  trackRepair,
  approveEstimate,
  getAllRepairs,
  updateRepairStatus,
  deleteRepair
} from '../controllers/repairController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes for customers
router.post('/book', bookRepair);
router.get('/slots', getOccupiedSlots);
router.get('/track/:ticketId', trackRepair);
router.put('/track/:ticketId/approve', approveEstimate);

// Protected routes for Store Admins and Super Admins
router.get('/', protect, admin, getAllRepairs);
router.put('/:id/status', protect, admin, updateRepairStatus);
router.delete('/:id', protect, admin, deleteRepair);

export default router;

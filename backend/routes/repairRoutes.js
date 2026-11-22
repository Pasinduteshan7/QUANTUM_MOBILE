import express from 'express';
import {
  bookRepair,
  getOccupiedSlots,
  trackRepair,
  getMyRepairs,
  approveEstimate,
  payRepairTicket,
  getAllRepairs,
  updateRepairStatus,
  deleteRepair
} from '../controllers/repairController.js';
import { protect, admin, requirePrivilege } from '../middleware/authMiddleware.js';

const router = express.Router();

// Customer repair routes
router.post('/book', bookRepair);
router.get('/slots', getOccupiedSlots);
router.get('/my-repairs', protect, getMyRepairs);
router.get('/track/:ticketId', trackRepair);
router.put('/track/:ticketId/approve', approveEstimate);
router.post('/track/:ticketId/pay', payRepairTicket);

// Protected routes for Store Admins and Super Admins
router.get('/', protect, admin, requirePrivilege('repairs:bench'), getAllRepairs);
router.put('/:id/status', protect, admin, requirePrivilege('repairs:bench'), updateRepairStatus);
router.delete('/:id', protect, admin, requirePrivilege('repairs:bench'), deleteRepair);

export default router;

import express from 'express';
import {
  getSuperAdminOverview,
  getStaffMembers,
  createStaffMember,
  toggleStaffStatus,
  updateStaffRole,
  deleteStaffMember,
  getAuditLogs
} from '../controllers/superAdminController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict Super Admin protection
router.use(protect, superAdmin);

router.get('/overview', getSuperAdminOverview);
router.get('/staff', getStaffMembers);
router.post('/staff', createStaffMember);
router.put('/staff/:id/status', toggleStaffStatus);
router.put('/staff/:id/role', updateStaffRole);
router.delete('/staff/:id', deleteStaffMember);

router.get('/audit-logs', getAuditLogs);

export default router;

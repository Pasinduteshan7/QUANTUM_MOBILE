import express from 'express';
import {
  getAllRoles,
  createRole,
  updateRole,
  deleteRole
} from '../controllers/roleController.js';
import { protect, admin, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Read roles: any admin or super admin can read to populate role switchers
router.get('/', protect, admin, getAllRoles);

// Mutate roles: strictly Super Admin
router.post('/', protect, superAdmin, createRole);
router.put('/:id', protect, superAdmin, updateRole);
router.delete('/:id', protect, superAdmin, deleteRole);

export default router;


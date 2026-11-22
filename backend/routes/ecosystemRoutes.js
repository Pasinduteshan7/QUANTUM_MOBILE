import express from 'express';
import {
  getAllEcosystems,
  getEcosystemBySlug,
  createEcosystem,
  updateEcosystem,
  deleteEcosystem
} from '../controllers/ecosystemController.js';
import { protect, admin, requirePrivilege } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getAllEcosystems);
router.get('/:slug', getEcosystemBySlug);

// Protected Admin routes
router.post('/', protect, admin, requirePrivilege('ecosystems:manage'), createEcosystem);
router.put('/:id', protect, admin, requirePrivilege('ecosystems:manage'), updateEcosystem);
router.delete('/:id', protect, admin, requirePrivilege('ecosystems:manage'), deleteEcosystem);

export default router;


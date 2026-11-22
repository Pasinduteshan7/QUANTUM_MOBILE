import express from 'express';
import {
  getAllEmployees,
  getEmployeeById,
  createEmployee,
  updateEmployee,
  updateEmployeeStatus,
  deleteEmployee
} from '../controllers/employeeController.js';
import { protect, superAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

// Strict Super Admin protection
router.use(protect, superAdmin);

router.get('/', getAllEmployees);
router.post('/', createEmployee);
router.get('/:id', getEmployeeById);
router.put('/:id', updateEmployee);
router.put('/:id/status', updateEmployeeStatus);
router.delete('/:id', deleteEmployee);

export default router;


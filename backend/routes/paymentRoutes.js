import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm/:id', confirmPayment);

export default router;

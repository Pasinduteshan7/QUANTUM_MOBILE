import express from 'express';
import {
  createPaymentIntent,
  confirmPayment,
  getStripeConfig,
  generatePayHereHash,
  handlePayHereNotify
} from '../controllers/paymentController.js';

const router = express.Router();

router.get('/config', getStripeConfig);
router.post('/create-intent', createPaymentIntent);
router.post('/confirm/:id', confirmPayment);

// PayHere Sri Lanka Sandbox & Live Endpoints
router.post('/payhere/hash', generatePayHereHash);
router.post('/payhere/notify', handlePayHereNotify);

export default router;


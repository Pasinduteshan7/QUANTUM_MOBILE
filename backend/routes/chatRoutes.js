import express from 'express';
import { customerSendMessage, getCustomerChatHistory, getCustomerThreads } from '../controllers/chatController.js';

const router = express.Router();

router.post('/send', customerSendMessage);
router.get('/history/:conversationId', getCustomerChatHistory);
router.get('/threads/:conversationId', getCustomerThreads);

export default router;

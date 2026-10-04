import { Router } from 'express';
import { protect } from '../middleware/auth.js';
import {
  getUserConversations,
  getOrCreateConversation,
  getConversationMessages,
  sendMessageHttp,
  getUnreadCount,
} from '../controllers/messageController.js';

const router = Router();

// All message routes require authentication
router.use(protect);

router.get('/conversations', getUserConversations);
router.post('/conversations', getOrCreateConversation);
router.get('/conversations/:id/messages', getConversationMessages);
router.post('/conversations/:id/messages', sendMessageHttp);
router.get('/unread-count', getUnreadCount);

export default router;

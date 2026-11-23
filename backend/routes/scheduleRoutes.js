import express from 'express';
import { getScheduledEvents, schedulePost, reschedulePost, cancelSchedule } from '../controllers/scheduleController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/', authenticate, getScheduledEvents);
router.post('/', authenticate, schedulePost);
router.put('/:id', authenticate, reschedulePost);
router.delete('/:id', authenticate, cancelSchedule);

export default router;

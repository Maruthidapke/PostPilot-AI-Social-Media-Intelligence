import express from 'express';
import { getOverview, getEngagementTrends } from '../controllers/analyticsController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/overview', authenticate, getOverview);
router.get('/engagement', authenticate, getEngagementTrends);

export default router;

import express from 'express';
import { getHealth, getMetrics, getAuditLogs } from '../controllers/systemController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/health', getHealth);
router.get('/metrics', getMetrics);
router.get('/audit-logs', authenticate, getAuditLogs);

export default router;

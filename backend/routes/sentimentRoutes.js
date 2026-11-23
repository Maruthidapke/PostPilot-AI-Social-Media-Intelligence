import express from 'express';
import {
  analyzeText,
  getSentimentHistory,
  getSentimentAnalytics,
  runBenchmark
} from '../controllers/sentimentController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/analyze', authenticate, analyzeText);
router.get('/history', authenticate, getSentimentHistory);
router.get('/analytics', authenticate, getSentimentAnalytics);
router.get('/benchmark', authenticate, runBenchmark);

export default router;

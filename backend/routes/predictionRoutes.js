import express from 'express';
import { generatePrediction, getBestTimeToPost, getContentPatterns } from '../controllers/predictionController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', authenticate, generatePrediction);
router.get('/best-time', authenticate, getBestTimeToPost);
router.get('/patterns', authenticate, getContentPatterns);

export default router;

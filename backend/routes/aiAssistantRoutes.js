import express from 'express';
import { generateContent } from '../controllers/aiAssistantController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate-captions', authenticate, generateContent);

export default router;

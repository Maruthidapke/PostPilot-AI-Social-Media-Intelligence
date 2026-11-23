import express from 'express';
import {
  getProviders,
  getAccounts,
  connectProvider,
  disconnectAccount,
  syncAccount,
  handleLoadDemo,
  handleResetDemo
} from '../controllers/socialController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/providers', authenticate, getProviders);
router.get('/accounts', authenticate, getAccounts);
router.post('/:provider/connect', authenticate, connectProvider);
router.post('/:provider/disconnect/:id', authenticate, disconnectAccount);
router.post('/accounts/:id/sync', authenticate, syncAccount);
router.post('/demo/load', authenticate, handleLoadDemo);
router.post('/demo/reset', authenticate, handleResetDemo);

export default router;

import express from 'express';
import {
  getSDLCData,
  getRequirements,
  getAIToolsComparison,
  getSprints,
  getKanbanTasks,
  updateKanbanTask,
  createKanbanTask,
  getPlanningPoker,
  getLeanWaste,
  getSyllabus,
  updateSyllabusItem
} from '../controllers/sepmController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/sdlc', authenticate, getSDLCData);
router.get('/requirements', authenticate, getRequirements);
router.get('/tools', authenticate, getAIToolsComparison);
router.get('/sprints', authenticate, getSprints);
router.get('/kanban', authenticate, getKanbanTasks);
router.post('/kanban', authenticate, createKanbanTask);
router.put('/kanban/:id', authenticate, updateKanbanTask);
router.get('/planning-poker', authenticate, getPlanningPoker);
router.get('/lean-waste', authenticate, getLeanWaste);
router.get('/syllabus', authenticate, getSyllabus);
router.put('/syllabus/:id', authenticate, updateSyllabusItem);

export default router;

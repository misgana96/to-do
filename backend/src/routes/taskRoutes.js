import express from 'express';
import {
  createTask,
  getTasks,
  getTaskById,
  updateTask,
  deleteTask
} from '../controllers/taskController.js';
import { authenticateUser } from '../middleware/auth.js';
import {
  validateCreateTask,
  validateUpdateTask
} from '../middleware/validation.js';

const router = express.Router();

// All task routes require authentication
router.use(authenticateUser);

// Task routes
router.post('/', validateCreateTask, createTask);
router.get('/', getTasks);
router.get('/:id', getTaskById);
router.put('/:id', validateUpdateTask, updateTask);
router.delete('/:id', deleteTask);

export default router;


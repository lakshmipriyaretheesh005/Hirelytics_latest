import express from 'express';
import {
  getMockTests,
  getMockTest,
  submitTest,
  getMyAttempts,
  createMockTest
} from '../controllers/mockTestController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', getMockTests);
router.get('/my-attempts', getMyAttempts);
router.get('/:id', getMockTest);
router.post('/:id/submit', submitTest);

// Admin routes
router.post('/', createMockTest);

export default router;

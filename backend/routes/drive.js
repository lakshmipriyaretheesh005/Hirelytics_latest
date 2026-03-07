import express from 'express';
import {
  getDrives,
  getDrive,
  applyToDrive,
  getMyApplications,
  createDrive,
  updateDrive
} from '../controllers/driveController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', getDrives);
router.get('/my-applications', getMyApplications);
router.get('/:id', getDrive);
router.post('/:id/apply', applyToDrive);

// Admin routes
router.post('/', createDrive);
router.put('/:id', updateDrive);

export default router;

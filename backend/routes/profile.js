import express from 'express';
import { 
  getProfile, 
  updateProfile, 
  completeOnboarding 
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All profile routes require authentication

router.get('/', getProfile);
router.put('/', updateProfile);
router.post('/onboarding', completeOnboarding);

export default router;

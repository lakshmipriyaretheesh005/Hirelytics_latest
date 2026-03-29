import express from 'express';
import {
  getCompanies,
  getCompany,
  getEligibleCompanies,
  createCompany,
  updateCompany,
  deleteCompany
} from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', getCompanies);
router.get('/eligible', getEligibleCompanies);
router.get('/:id', getCompany);

// Admin routes (you can add role middleware here later)
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;

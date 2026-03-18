import express from 'express';
import {
  getCompanies,
  getCompany,
  getEligibleCompanies,
  createCompany,
  updateCompany,
  deleteCompany,
  submitCompanyContribution,
  getPendingContributions,
  verifyContribution,
  getMyCompanyContributions
} from '../controllers/companyController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.use(authenticate); // All routes require authentication

router.get('/', getCompanies);
router.get('/eligible', getEligibleCompanies);
router.get('/contributions/pending', getPendingContributions);
router.get('/:id', getCompany);
router.get('/:id/contributions/mine', getMyCompanyContributions);
router.post('/:id/contributions', submitCompanyContribution);
router.patch('/:id/contributions/:contributionId/verify', verifyContribution);

// Admin routes (you can add role middleware here later)
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;

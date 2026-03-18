import Company from '../models/Company.js';
import User from '../models/User.js';

const sanitizeCompanyForRole = (companyDoc, isAdmin = false) => {
  const company = companyDoc.toObject();

  if (isAdmin) {
    return company;
  }

  company.studentContributions = (company.studentContributions || [])
    .filter((contribution) => contribution.status === 'approved')
    .map((contribution) => ({
      _id: contribution._id,
      type: contribution.type,
      question: contribution.question,
      topic: contribution.topic,
      round: contribution.round,
      difficulty: contribution.difficulty,
      status: contribution.status,
      reviewedAt: contribution.reviewedAt,
      createdAt: contribution.createdAt
    }));

  return company;
};

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isActive: true }).sort('-createdAt');
    const isAdmin = req.userRole === 'admin';
    const sanitizedCompanies = companies.map((company) => sanitizeCompanyForRole(company, isAdmin));

    res.json({
      success: true,
      count: companies.length,
      companies: sanitizedCompanies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single company
// @route   GET /api/companies/:id
// @access  Private
export const getCompany = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const sanitizedCompany = sanitizeCompanyForRole(company, req.userRole === 'admin');

    res.json({
      success: true,
      company: sanitizedCompany
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get eligible companies for user
// @route   GET /api/companies/eligible
// @access  Private
export const getEligibleCompanies = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId);

    if (!user || !user.onboardingCompleted) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    // Build eligibility filter
    const filter = {
      isActive: true,
      'eligibility.minCGPA': { $lte: user.cgpa || 0 }
    };

    // Add branch filter if user has branch
    if (user.branch) {
      filter['eligibility.branches'] = user.branch;
    }

    const companies = await Company.find(filter);
    const sanitizedCompanies = companies.map((company) => sanitizeCompanyForRole(company, false));

    res.json({
      success: true,
      count: companies.length,
      companies: sanitizedCompanies
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Submit student-contributed interview question
// @route   POST /api/companies/:id/contributions
// @access  Private
export const submitCompanyContribution = async (req, res, next) => {
  try {
    const { question, type, topic, round, difficulty } = req.body;

    if (!question || !question.trim()) {
      return res.status(400).json({ error: 'Question is required' });
    }

    const company = await Company.findById(req.params.id);

    if (!company || !company.isActive) {
      return res.status(404).json({ error: 'Company not found' });
    }

    company.studentContributions.push({
      question: question.trim(),
      type: type || 'question',
      topic: topic?.trim(),
      round: round?.trim(),
      difficulty: difficulty || 'Medium',
      submittedBy: req.userId,
      status: 'pending'
    });

    await company.save();

    res.status(201).json({
      success: true,
      message: 'Question submitted for admin verification'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all pending student contributions (Admin)
// @route   GET /api/companies/contributions/pending
// @access  Private/Admin
export const getPendingContributions = async (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const companies = await Company.find({
      isActive: true,
      'studentContributions.status': 'pending'
    })
      .select('name industry studentContributions')
      .populate('studentContributions.submittedBy', 'fullName email');

    const pending = companies.map((company) => ({
      _id: company._id,
      name: company.name,
      industry: company.industry,
      contributions: (company.studentContributions || []).filter(
        (contribution) => contribution.status === 'pending'
      )
    }));

    res.json({
      success: true,
      companies: pending,
      count: pending.reduce((total, company) => total + company.contributions.length, 0)
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify/reject a student contribution (Admin)
// @route   PATCH /api/companies/:id/contributions/:contributionId/verify
// @access  Private/Admin
export const verifyContribution = async (req, res, next) => {
  try {
    if (req.userRole !== 'admin') {
      return res.status(403).json({ error: 'Access denied' });
    }

    const { status, reviewNote } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use approved or rejected.' });
    }

    const company = await Company.findById(req.params.id);

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const contribution = company.studentContributions.id(req.params.contributionId);

    if (!contribution) {
      return res.status(404).json({ error: 'Contribution not found' });
    }

    contribution.status = status;
    contribution.reviewedBy = req.userId;
    contribution.reviewedAt = new Date();
    contribution.reviewNote = reviewNote?.trim() || '';

    await company.save();

    res.json({
      success: true,
      message: `Contribution ${status} successfully`
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current student's own contributions for a company
// @route   GET /api/companies/:id/contributions/mine
// @access  Private
export const getMyCompanyContributions = async (req, res, next) => {
  try {
    const company = await Company.findById(req.params.id).select('studentContributions');

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    const myContributions = (company.studentContributions || [])
      .filter((contribution) => contribution.submittedBy?.toString() === req.userId)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .map((contribution) => ({
        _id: contribution._id,
        type: contribution.type,
        question: contribution.question,
        topic: contribution.topic,
        round: contribution.round,
        difficulty: contribution.difficulty,
        status: contribution.status,
        reviewNote: contribution.reviewNote,
        reviewedAt: contribution.reviewedAt,
        createdAt: contribution.createdAt
      }));

    res.json({
      success: true,
      contributions: myContributions,
      count: myContributions.length
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create company (Admin only)
// @route   POST /api/companies
// @access  Private/Admin
export const createCompany = async (req, res, next) => {
  try {
    const company = new Company(req.body);
    await company.save();

    res.status(201).json({
      success: true,
      message: 'Company created successfully',
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update company (Admin only)
// @route   PUT /api/companies/:id
// @access  Private/Admin
export const updateCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company updated successfully',
      company
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete company (Admin only)
// @route   DELETE /api/companies/:id
// @access  Private/Admin
export const deleteCompany = async (req, res, next) => {
  try {
    const company = await Company.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );

    if (!company) {
      return res.status(404).json({ error: 'Company not found' });
    }

    res.json({
      success: true,
      message: 'Company deleted successfully'
    });
  } catch (error) {
    next(error);
  }
};

import Company from '../models/Company.js';
import User from '../models/User.js';

// @desc    Get all companies
// @route   GET /api/companies
// @access  Private
export const getCompanies = async (req, res, next) => {
  try {
    const companies = await Company.find({ isActive: true }).sort('-createdAt');

    res.json({
      success: true,
      count: companies.length,
      companies
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

    res.json({
      success: true,
      company
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

    res.json({
      success: true,
      count: companies.length,
      companies
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

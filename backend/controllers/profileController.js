import User from '../models/User.js';

// @desc    Get user profile
// @route   GET /api/profile
// @access  Private
export const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      profile: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/profile
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const allowedUpdates = [
      'fullName', 'branch', 'semester', 'cgpa', 'graduationYear',
      'phone', 'dateOfBirth', 'skills', 'bio', 'linkedinProfile',
      'githubProfile', 'portfolioWebsite'
    ];

    const updates = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: user
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Complete onboarding
// @route   POST /api/profile/onboarding
// @access  Private
export const completeOnboarding = async (req, res, next) => {
  try {
    const { branch, semester, cgpa, graduationYear, skills } = req.body;

    const user = await User.findByIdAndUpdate(
      req.userId,
      {
        branch,
        semester,
        cgpa,
        graduationYear,
        skills,
        onboardingCompleted: true
      },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Onboarding completed successfully',
      profile: user
    });
  } catch (error) {
    next(error);
  }
};

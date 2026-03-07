import Drive from '../models/Drive.js';
import User from '../models/User.js';
import Notification from '../models/Notification.js';

// @desc    Get all drives
// @route   GET /api/drives
// @access  Private
export const getDrives = async (req, res, next) => {
  try {
    const drives = await Drive.find({ isActive: true })
      .populate('company', 'name logo industry')
      .sort('-driveDate');
    
    res.json({
      success: true,
      count: drives.length,
      drives
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single drive
// @route   GET /api/drives/:id
// @access  Private
export const getDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id)
      .populate('company', 'name logo industry website location');
    
    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json({
      success: true,
      drive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Apply to drive
// @route   POST /api/drives/:id/apply
// @access  Private
export const applyToDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findById(req.params.id);
    
    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    // Check if already applied
    const alreadyApplied = drive.applicants.some(
      app => app.user.toString() === req.userId
    );

    if (alreadyApplied) {
      return res.status(400).json({ error: 'You have already applied to this drive' });
    }

    // Check eligibility
    const user = await User.findById(req.userId);
    if (!user.onboardingCompleted) {
      return res.status(400).json({ error: 'Please complete your profile first' });
    }

    drive.applicants.push({
      user: req.userId,
      status: 'applied'
    });

    await drive.save();

    // Create notification
    await Notification.create({
      user: req.userId,
      title: 'Application Submitted',
      message: `Your application for ${drive.role} has been submitted successfully`,
      type: 'application'
    });

    res.json({
      success: true,
      message: 'Applied to drive successfully'
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user's applications
// @route   GET /api/drives/my-applications
// @access  Private
export const getMyApplications = async (req, res, next) => {
  try {
    const drives = await Drive.find({
      'applicants.user': req.userId
    })
    .populate('company', 'name logo')
    .sort('-createdAt');

    const applications = drives.map(drive => {
      const application = drive.applicants.find(
        app => app.user.toString() === req.userId
      );
      
      return {
        drive: {
          _id: drive._id,
          role: drive.role,
          packageOffered: drive.packageOffered,
          company: drive.company,
          driveDate: drive.driveDate
        },
        appliedAt: application.appliedAt,
        status: application.status
      };
    });

    res.json({
      success: true,
      count: applications.length,
      applications
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create drive (Admin only)
// @route   POST /api/drives
// @access  Private/Admin
export const createDrive = async (req, res, next) => {
  try {
    const drive = new Drive(req.body);
    await drive.save();

    res.status(201).json({
      success: true,
      message: 'Drive created successfully',
      drive
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update drive (Admin only)
// @route   PUT /api/drives/:id
// @access  Private/Admin
export const updateDrive = async (req, res, next) => {
  try {
    const drive = await Drive.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!drive) {
      return res.status(404).json({ error: 'Drive not found' });
    }

    res.json({
      success: true,
      message: 'Drive updated successfully',
      drive
    });
  } catch (error) {
    next(error);
  }
};

import mongoose from 'mongoose';

const driveSchema = new mongoose.Schema({
  company: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Company',
    required: true
  },
  role: {
    type: String,
    required: true
  },
  packageOffered: String, // e.g., "12-15 LPA"
  location: String,
  jobType: {
    type: String,
    enum: ['Full-time', 'Internship', 'Internship + FTE'],
    default: 'Full-time'
  },
  
  description: String,
  requirements: [String],
  
  // Timeline
  registrationDeadline: Date,
  driveDate: Date,
  
  // Selection process
  selectionProcess: [String], // e.g., ["Aptitude Test", "Technical Round", "HR Round"]
  
  // Eligibility
  eligibility: {
    minCGPA: Number,
    allowedBranches: [String],
    maxBacklogs: Number,
    graduationYears: [Number]
  },
  
  // Application tracking
  applicants: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    },
    status: {
      type: String,
      enum: ['applied', 'shortlisted', 'rejected', 'selected'],
      default: 'applied'
    }
  }],
  
  status: {
    type: String,
    enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
    default: 'upcoming'
  },
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Drive', driveSchema);

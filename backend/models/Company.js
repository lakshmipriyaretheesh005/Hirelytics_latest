import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true
  },
  logo: String,
  industry: String,
  description: String,
  website: String,

  // Eligibility
  eligibility: {
    minCGPA: Number,
    branches: [String],
    backlogAllowed: Boolean,
    yearOfPassing: Number
  },

  // Roles
  roles: [{
    title: { type: String },
    type: { type: String },
    package: { type: String },
    description: { type: String },
    _id: false
  }],

  // Selection Process
  selectionProcess: {
    rounds: [{
      name: { type: String },
      duration: { type: String },
      sections: [String],
      cutoff: { type: String },
      topics: [String],
      difficulty: { type: String },
      description: { type: String },
      _id: false
    }]
  },

  // Preparation Topics
  aptitudeTopics: [String],
  technicalTopics: [String],
  codingLanguages: [String],

  // Questions
  hrQuestions: [String],
  sampleQuestions: [{
    topic: { type: String },
    question: { type: String },
    difficulty: { type: String },
    _id: false
  }],

  // Student-contributed interview questions (requires admin review)
  studentContributions: [{
    type: {
      type: String,
      enum: ['question', 'coding', 'mcq', 'hr', 'technical', 'aptitude', 'other'],
      default: 'question'
    },
    question: {
      type: String,
      required: true,
      trim: true
    },
    topic: {
      type: String,
      trim: true
    },
    round: {
      type: String,
      trim: true
    },
    difficulty: {
      type: String,
      enum: ['Easy', 'Medium', 'Hard'],
      default: 'Medium'
    },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending'
    },
    submittedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    reviewedAt: Date,
    reviewNote: {
      type: String,
      trim: true
    }
  }],

  // Timeline and Stats
  interviewTimeline: String,
  averagePackage: String,
  previouslyVisited: Boolean,
  studentPlaced: Number,

  // Admin fields
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);

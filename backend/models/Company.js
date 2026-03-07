import mongoose from 'mongoose';

const companySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  logo: String,
  industry: String,
  description: String,
  website: String,
  location: String,
  size: String, // e.g., "1000-5000 employees"
  
  // Eligibility criteria
  eligibilityCriteria: {
    minCGPA: Number,
    allowedBranches: [String],
    maxBacklogs: Number,
    graduationYears: [Number]
  },
  
  rating: {
    type: Number,
    min: 0,
    max: 5
  },
  
  tags: [String], // e.g., ["Product Based", "High Paying", "Remote"]
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Company', companySchema);

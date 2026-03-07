import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true
  },
  options: [String],
  correctAnswer: String,
  explanation: String,
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard']
  }
});

const mockTestSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: String,
  category: {
    type: String,
    enum: ['Aptitude', 'Technical', 'Coding', 'Verbal', 'Logical'],
    required: true
  },
  duration: Number, // in minutes
  totalMarks: Number,
  questions: [questionSchema],
  
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  
  // Attempts tracking
  attempts: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    score: Number,
    timeTaken: Number, // in minutes
    answers: [String],
    attemptedAt: {
      type: Date,
      default: Date.now
    }
  }],
  
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('MockTest', mockTestSchema);

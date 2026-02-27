import mongoose from 'mongoose';

const skillSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  level: {
    type: Number,
    min: 0,
    max: 100,
  },
  category: {
    type: String,
    enum: ['Frontend', 'Backend', 'Database', 'DevOps', 'Language', 'Tools', 'Soft Skills', 'Other'],
  },
  yearsOfExperience: {
    type: Number,
    default: 0,
  },
});

const resumeSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  fileName: {
    type: String,
    required: true,
  },
  filePath: {
    type: String,
    required: true,
  },
  fileSize: {
    type: Number,
    required: true,
  },
  extractedText: {
    type: String,
  },
  extractedSkills: [skillSchema],
  personalInfo: {
    name: String,
    email: String,
    phone: String,
    location: String,
    summary: String,
  },
  experience: [{
    title: String,
    company: String,
    duration: String,
    description: String,
  }],
  education: [{
    degree: String,
    institution: String,
    year: String,
  }],
  processed: {
    type: Boolean,
    default: false,
  },
  processedAt: {
    type: Date,
  },
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
  },
}, {
  timestamps: true,
});

// Index for faster queries
resumeSchema.index({ user: 1, createdAt: -1 });

const Resume = mongoose.model('Resume', resumeSchema);

export default Resume;

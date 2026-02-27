import mongoose from 'mongoose';

const skillGapAnalysisSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resume: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Resume',
    required: true,
  },
  targetRole: {
    title: {
      type: String,
      required: true,
    },
    category: String,
    requiredSkills: [String],
  },
  overallScore: {
    type: Number,
    min: 0,
    max: 100,
    required: true,
  },
  matchedSkills: [{
    name: String,
    currentLevel: Number,
    requiredLevel: Number,
    gap: Number,
  }],
  missingSkills: [{
    name: String,
    priority: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    requiredLevel: Number,
    demand: Number,
  }],
  weakSkills: [{
    name: String,
    currentLevel: Number,
    requiredLevel: Number,
    gap: Number,
    priority: String,
  }],
  strongSkills: [{
    name: String,
    currentLevel: Number,
    requiredLevel: Number,
  }],
  recommendedCourses: [{
    title: String,
    provider: String,
    duration: String,
    rating: Number,
    students: Number,
    relevance: Number,
    price: String,
    url: String,
    skills: [String],
    level: String,
  }],
  careerRoadmap: [{
    phase: String,
    duration: String,
    skills: [String],
    milestone: String,
    resources: [String],
  }],
  aiConfidence: {
    type: Number,
    min: 0,
    max: 100,
  },
  analysis: {
    strengths: [String],
    improvements: [String],
    recommendations: [String],
  },
}, {
  timestamps: true,
});

// Index for faster queries
skillGapAnalysisSchema.index({ user: 1, createdAt: -1 });
skillGapAnalysisSchema.index({ resume: 1 });

const SkillGapAnalysis = mongoose.model('SkillGapAnalysis', skillGapAnalysisSchema);

export default SkillGapAnalysis;

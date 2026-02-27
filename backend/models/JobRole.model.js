import mongoose from 'mongoose';

const jobRoleSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  category: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  requiredSkills: [{
    name: String,
    level: Number, // Expected proficiency level 0-100
    importance: {
      type: String,
      enum: ['Critical', 'Important', 'Nice to Have'],
      default: 'Important',
    },
  }],
  salaryRange: {
    min: Number,
    max: Number,
    currency: {
      type: String,
      default: 'USD',
    },
  },
  experienceRequired: {
    min: Number,
    max: Number,
  },
  demandLevel: {
    type: String,
    enum: ['Very High', 'High', 'Medium', 'Low'],
    default: 'Medium',
  },
  growthRate: {
    type: Number, // Percentage
  },
  averageCompanies: {
    type: Number,
  },
  relatedRoles: [String],
  industryTrends: {
    description: String,
    keyTechnologies: [String],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

// Index for searching
jobRoleSchema.index({ title: 'text', category: 'text', description: 'text' });

const JobRole = mongoose.model('JobRole', jobRoleSchema);

export default JobRole;

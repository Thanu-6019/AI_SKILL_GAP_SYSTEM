import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'],
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minlength: 6,
    select: false,
  },
  role: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
  },
  currentSkills: [{
    name: String,
    level: Number,
    category: String,
  }],
  targetRole: {
    type: String,
  },
  careerGoals: {
    type: String,
  },
  jobTitle: {
    type: String,
    default: null,
  },
  department: {
    type: String,
    default: null,
  },
  resumeSkills: [{
    name: String,
    level: Number,
    category: String,
  }],
  roadmap: {
    phases: [{
      phaseNumber: Number,
      title: String,
      duration: String,
      locked: { type: Boolean, default: true },
      completed: { type: Boolean, default: false },
      skills: [{
        name: String,
        completed: { type: Boolean, default: false },
        approved: { type: Boolean, default: false },
        certificateUrl: { type: String, default: null },
        platform: { type: String, default: null },
      }],
      resources: [{
        courseName: String,
        platform: String,
        link: String,
      }],
    }],
  },
  notifications: [{
    type: String,
    message: String,
    read: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
  }],
  completedCourses: [{
    courseId: String,
    courseName: String,
    completedAt: Date,
  }],
  isActive: {
    type: Boolean,
    default: true,
  },
  lastLogin: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    return next();
  }
  
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Method to compare passwords
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

const User = mongoose.model('User', userSchema);

export default User;

import User from '../models/User.model.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '7d',
  });
};

// @desc    Register new user
// @route   POST /api/users/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user exists
    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({
        success: false,
        error: 'User already exists with this email',
      });
    }

    // Create user
    const user = await User.create({
      name,
      email,
      password,
    });

    // Generate token
    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/users/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Validate email & password
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Please provide email and password',
      });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Check if password matches
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        error: 'Invalid credentials',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token,
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current user profile
// @route   GET /api/users/me
// @access  Private
export const getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user profile
// @route   PUT /api/users/me
// @access  Private
export const updateProfile = async (req, res, next) => {
  try {
    const fieldsToUpdate = {
      name: req.body.name,
      currentSkills: req.body.currentSkills,
      targetRole: req.body.targetRole,
      careerGoals: req.body.careerGoals,
      jobTitle: req.body.jobTitle,
      department: req.body.department,
      resumeSkills: req.body.resumeSkills,
    };

    // Only update roadmap if provided
    if (req.body.roadmap) {
      fieldsToUpdate.roadmap = req.body.roadmap;
    }

    const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user roadmap
// @route   PUT /api/users/me/roadmap
// @access  Private
export const updateRoadmap = async (req, res, next) => {
  try {
    const { roadmap } = req.body;

    if (!roadmap) {
      return res.status(400).json({
        success: false,
        error: 'Roadmap data is required',
      });
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      { roadmap },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Add notification
// @route   POST /api/users/me/notifications
// @access  Private
export const addNotification = async (req, res, next) => {
  try {
    const { type, message } = req.body;

    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    user.notifications.push({
      type,
      message,
      read: false,
      createdAt: new Date(),
    });

    await user.save();

    res.status(200).json({
      success: true,
      data: user.notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get user notifications
// @route   GET /api/users/me/notifications
// @access  Private
export const getNotifications = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user.notifications || [],
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/users/me/notifications/:notificationId/read
// @access  Private
export const markNotificationRead = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      });
    }

    const notification = user.notifications.id(req.params.notificationId);
    
    if (!notification) {
      return res.status(404).json({
        success: false,
        error: 'Notification not found',
      });
    }

    notification.read = true;
    await user.save();

    res.status(200).json({
      success: true,
      data: user.notifications,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Upload certificate
// @route   POST /api/users/me/certificate
// @access  Private
export const uploadCertificate = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: 'Please upload a certificate file',
      });
    }

    const { phaseIndex, skillIndex, platform } = req.body;

    if (phaseIndex === undefined || skillIndex === undefined) {
      return res.status(400).json({
        success: false,
        error: 'Phase index and skill index are required',
      });
    }

    const certificateUrl = `/uploads/certificates/${req.file.filename}`;

    res.status(200).json({
      success: true,
      data: {
        certificateUrl,
        fileName: req.file.originalname,
        fileSize: req.file.size,
        mimeType: req.file.mimetype,
      },
    });
  } catch (error) {
    console.error('Certificate upload error:', error);
    next(error);
  }
};

import JobRole from '../models/JobRole.model.js';

// @desc    Get all job roles
// @route   GET /api/roles
// @access  Public
export const getAllRoles = async (req, res, next) => {
  try {
    const roles = await JobRole.find({ isActive: true })
      .select('-__v')
      .sort({ demandLevel: -1, title: 1 });

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get role by ID
// @route   GET /api/roles/:id
// @access  Public
export const getRoleById = async (req, res, next) => {
  try {
    const role = await JobRole.findById(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Search roles
// @route   GET /api/roles/search?q=keyword
// @access  Public
export const searchRoles = async (req, res, next) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const roles = await JobRole.find({
      $text: { $search: q },
      isActive: true,
    })
      .select('-__v')
      .limit(20);

    res.status(200).json({
      success: true,
      count: roles.length,
      data: roles,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create new role (admin)
// @route   POST /api/roles
// @access  Private/Admin
export const createRole = async (req, res, next) => {
  try {
    const role = await JobRole.create(req.body);

    res.status(201).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update role (admin)
// @route   PUT /api/roles/:id
// @access  Private/Admin
export const updateRole = async (req, res, next) => {
  try {
    const role = await JobRole.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      data: role,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete role (admin)
// @route   DELETE /api/roles/:id
// @access  Private/Admin
export const deleteRole = async (req, res, next) => {
  try {
    const role = await JobRole.findByIdAndDelete(req.params.id);

    if (!role) {
      return res.status(404).json({
        success: false,
        error: 'Role not found',
      });
    }

    res.status(200).json({
      success: true,
      message: 'Role deleted successfully',
    });
  } catch (error) {
    next(error);
  }
};

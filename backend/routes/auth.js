/**
 * Authentication routes for user registration, login, and profile management
 */
const express = require('express');
const router = express.Router();

// Import auth controller
const { 
  register, 
  login, 
  forgotPassword, 
  resetPassword, 
  getProfile, 
  updateProfile,
  updatePassword
} = require('../controllers/auth');

// Import auth middleware
const { protect } = require('../middleware/auth');

// Import validators
const {
  registerValidator,
  loginValidator,
  forgotPasswordValidator,
  resetPasswordValidator,
  profileUpdateValidator,
  passwordUpdateValidator
} = require('../middleware/validators');

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post('/register', registerValidator, register);

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate user & get token
 * @access  Public
 */
router.post('/login', loginValidator, login);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Process forgot password request
 * @access  Public
 */
router.post('/forgot-password', forgotPasswordValidator, forgotPassword);

/**
 * @route   POST /api/auth/reset-password
 * @desc    Reset password with token
 * @access  Public
 */
router.post('/reset-password', resetPasswordValidator, resetPassword);

/**
 * @route   GET /api/auth/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', protect, getProfile);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put('/profile', protect, profileUpdateValidator, updateProfile);

/**
 * @route   PUT /api/auth/password
 * @desc    Update user password
 * @access  Private
 */
router.put('/password', protect, passwordUpdateValidator, updatePassword);

module.exports = router; 
/**
 * Authentication controller
 * Handles user registration, login, password reset, and profile management
 */
const User = require('../models/User');
const { generateToken, generateResetToken, verifyResetToken } = require('../utils/jwtUtils');
const { sendPasswordResetEmail } = require('../utils/emailService');

/**
 * Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const register = async (req, res) => {
  try {
    const { firstName, email, password } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Create new user
    const user = await User.create({
      firstName,
      email,
      password
    });

    if (user) {
      // Generate JWT token
      const token = generateToken(user, false);

      res.status(201).json({
        message: 'Registration successful',
        user: {
          id: user._id,
          firstName: user.firstName,
          email: user.email,
          themePreference: user.themePreference
        },
        token
      });
    }
  } catch (error) {
    console.error(`Registration error: ${error.message}`);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

/**
 * Login user and get token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = async (req, res) => {
  try {
    const { email, password, rememberMe = false } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check if password matches
    const isMatch = await user.matchPassword(password);
    
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Update last login time and remember me preference
    user.lastLogin = new Date();
    user.rememberMe = rememberMe;
    await user.save();

    // Generate JWT token
    const token = generateToken(user, rememberMe);

    res.json({
      message: 'Login successful',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        themePreference: user.themePreference
      },
      token
    });
  } catch (error) {
    console.error(`Login error: ${error.message}`);
    res.status(500).json({ message: 'Server error during login' });
  }
};

/**
 * Request password reset
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      // For security, don't reveal that the user doesn't exist
      return res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
    }

    // Generate reset token and save to user
    const resetToken = generateResetToken(user._id);
    
    // Store token and expiration
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 3600000; // 1 hour
    await user.save();

    // Create reset URL
    const resetUrl = `${req.protocol}://${req.get('host')}/reset-password`;
    
    // Send password reset email
    await sendPasswordResetEmail(user.email, resetToken, resetUrl);

    res.json({ message: 'If an account with that email exists, a password reset link has been sent' });
  } catch (error) {
    console.error(`Forgot password error: ${error.message}`);
    res.status(500).json({ message: 'Server error during password reset request' });
  }
};

/**
 * Reset password with token
 * @route   POST /api/auth/reset-password
 * @access  Public
 */
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    // Verify token
    const decoded = verifyResetToken(token);
    if (!decoded) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Find user by id and with matching token
    const user = await User.findOne({
      _id: decoded.id,
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired token' });
    }

    // Set new password and clear reset fields
    user.password = password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error(`Reset password error: ${error.message}`);
    res.status(500).json({ message: 'Server error during password reset' });
  }
};

/**
 * Get current user profile
 * @route   GET /api/auth/profile
 * @access  Private
 */
const getProfile = async (req, res) => {
  try {
    // User is already attached to req by the auth middleware
    const user = req.user;

    res.json({
      id: user._id,
      firstName: user.firstName,
      email: user.email,
      themePreference: user.themePreference,
      lastLogin: user.lastLogin,
      createdAt: user.createdAt
    });
  } catch (error) {
    console.error(`Get profile error: ${error.message}`);
    res.status(500).json({ message: 'Server error fetching profile' });
  }
};

/**
 * Update user profile
 * @route   PUT /api/auth/profile
 * @access  Private
 */
const updateProfile = async (req, res) => {
  try {
    // Get user from request
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields if provided
    const { firstName, themePreference } = req.body;

    if (firstName) user.firstName = firstName;
    if (themePreference) user.themePreference = themePreference;

    await user.save();

    res.json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        firstName: user.firstName,
        email: user.email,
        themePreference: user.themePreference
      }
    });
  } catch (error) {
    console.error(`Update profile error: ${error.message}`);
    res.status(500).json({ message: 'Server error updating profile' });
  }
};

/**
 * Update user password
 * @route   PUT /api/auth/password
 * @access  Private
 */
const updatePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    // Get user with password
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if current password is correct
    const isMatch = await user.matchPassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    console.error(`Update password error: ${error.message}`);
    res.status(500).json({ message: 'Server error updating password' });
  }
};

module.exports = {
  register,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
  updateProfile,
  updatePassword
}; 
/**
 * JWT utility functions for token generation and validation
 */
const jwt = require('jsonwebtoken');

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object from database
 * @param {boolean} rememberMe - Whether to extend token expiration
 * @returns {string} JWT token
 */
const generateToken = (user, rememberMe = false) => {
  const payload = {
    id: user._id,
    email: user.email,
    firstName: user.firstName
  };

  // Set token expiration based on rememberMe flag
  const expiresIn = rememberMe 
    ? process.env.JWT_REMEMBER_ME_EXPIRE || '30d' 
    : process.env.JWT_EXPIRE || '1d';

  return jwt.sign(payload, process.env.JWT_SECRET || 'allmyducks_jwt_secret_key', {
    expiresIn
  });
};

/**
 * Generate a password reset token
 * @param {string} userId - User ID
 * @returns {string} Reset token
 */
const generateResetToken = (userId) => {
  const resetToken = jwt.sign(
    { id: userId },
    process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'allmyducks_reset_secret',
    { expiresIn: '1h' }
  );
  
  return resetToken;
};

/**
 * Verify a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyToken = (token) => {
  try {
    return jwt.verify(
      token, 
      process.env.JWT_SECRET || 'allmyducks_jwt_secret_key'
    );
  } catch (error) {
    return null;
  }
};

/**
 * Verify a password reset token
 * @param {string} token - Reset token to verify
 * @returns {Object|null} Decoded token payload or null if invalid
 */
const verifyResetToken = (token) => {
  try {
    return jwt.verify(
      token,
      process.env.JWT_RESET_SECRET || process.env.JWT_SECRET || 'allmyducks_reset_secret'
    );
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateToken,
  generateResetToken,
  verifyToken,
  verifyResetToken
}; 
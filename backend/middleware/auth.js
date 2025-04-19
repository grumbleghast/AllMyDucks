/**
 * Authentication middleware for JWT token verification
 * Protects routes that require authentication
 */
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { verifyToken } = require('../utils/jwtUtils');

/**
 * Verifies JWT token in request headers
 * If valid, adds user data to request object and allows request to proceed
 * If invalid, returns 401 Unauthorized response
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const protect = async (req, res, next) => {
  let token;
  
  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = verifyToken(token);
      
      if (!decoded) {
        throw new Error('Invalid token');
      }
      
      // Find user with the ID from token
      const user = await User.findById(decoded.id).select('-password');
      
      // If user not found
      if (!user) {
        throw new Error('User not found');
      }
      
      // Add decoded user data to request object
      req.user = user;
      
      next();
    } catch (error) {
      console.error(`Authentication error: ${error.message}`);
      res.status(401).json({ message: 'Not authorized, token failed' });
    }
  } else {
    // No authorization header or no Bearer token
    res.status(401).json({ message: 'Not authorized, no token' });
  }
};

/**
 * Optional authentication middleware
 * Similar to protect, but doesn't return 401 if no token is provided
 * Instead, it sets req.user if the token is valid, otherwise leaves it undefined
 * 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 */
const optionalAuth = async (req, res, next) => {
  let token;
  
  // Check if authorization header exists and starts with Bearer
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header (remove 'Bearer ')
      token = req.headers.authorization.split(' ')[1];
      
      // Verify token
      const decoded = verifyToken(token);
      
      if (decoded) {
        // Find user with the ID from token
        const user = await User.findById(decoded.id).select('-password');
        
        // Set user if found
        if (user) {
          req.user = user;
        }
      }
    } catch (error) {
      console.error(`Optional auth error: ${error.message}`);
      // Don't return error, just don't set req.user
    }
  }
  
  // Always proceed to next middleware
  next();
};

module.exports = { protect, optionalAuth }; 
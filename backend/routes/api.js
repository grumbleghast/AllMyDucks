/**
 * Main API router
 * Centralizes all API routes
 */
const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const todosRoutes = require('./todos');
const taskTransferRoutes = require('./taskTransfer');

/**
 * @route   GET /api
 * @desc    API status check
 * @access  Public
 */
router.get('/', (req, res) => {
  res.status(200).json({
    message: 'AllMyDucks API is running',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Mount routes
router.use('/auth', authRoutes);
router.use('/todos', todosRoutes);
router.use('/transfer', taskTransferRoutes);

module.exports = router; 
/**
 * Routes for task transfer operations
 * Handles automatic task transfer endpoints
 */
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { executeTaskTransfer, getTransferStats } = require('../controllers/taskTransfer');

/**
 * @route   POST /api/transfer
 * @desc    Execute task transfer for the current user
 * @access  Private
 */
router.post('/', protect, executeTaskTransfer);

/**
 * @route   GET /api/transfer/stats
 * @desc    Get statistics about transferable tasks
 * @access  Private
 */
router.get('/stats', protect, getTransferStats);

module.exports = router; 
/**
 * Task Transfer Controller
 * Handles endpoints for task transfer operations
 */
const taskTransferService = require('../services/taskTransferService');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * Execute the task transfer process manually
 * 
 * @route   POST /api/todo/transfer
 * @access  Private
 */
exports.executeTaskTransfer = asyncHandler(async (req, res, next) => {
  // Execute transfer only for the current user
  const result = await taskTransferService.executeMidnightTaskTransfer(req.user.id);
  
  if (!result.success) {
    return next(new ErrorResponse('Task transfer failed', 500));
  }
  
  res.status(200).json({
    success: true,
    data: {
      identified: result.identified,
      transferred: result.transferred
    }
  });
});

/**
 * Get statistics about transferable tasks for the current user
 * 
 * @route   GET /api/todo/transfer/stats
 * @access  Private
 */
exports.getTransferStats = asyncHandler(async (req, res, next) => {
  // Get tasks that would be transferred
  const tasksToTransfer = await taskTransferService.identifyIncompleteTasksForTransfer({
    userId: req.user.id
  });
  
  // Group by priority
  const priorityCounts = tasksToTransfer.reduce((acc, task) => {
    const priority = task.priority || 'medium';
    acc[priority] = (acc[priority] || 0) + 1;
    return acc;
  }, {});
  
  // Group by age
  const ageCounts = tasksToTransfer.reduce((acc, task) => {
    const age = Math.min(Math.floor(task.getAgeInDays()), 7);
    const ageGroup = age <= 1 ? '1' : 
                    age <= 3 ? '2-3' : 
                    age <= 7 ? '4-7' : '7+';
    acc[ageGroup] = (acc[ageGroup] || 0) + 1;
    return acc;
  }, {});
  
  res.status(200).json({
    success: true,
    data: {
      total: tasksToTransfer.length,
      byPriority: priorityCounts,
      byAge: ageCounts
    }
  });
}); 
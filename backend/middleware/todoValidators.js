/**
 * Input validation middleware for ToDo operations
 * Validates todo list and task-related requests
 */
const { body, param, query, validationResult } = require('express-validator');
const { PRIORITY_LEVELS } = require('../models/Task');

/**
 * Format validation errors into a standard response
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express next middleware function
 * @returns {Object|void} Error response or continues to next middleware
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    return res.status(400).json({
      message: 'Validation failed',
      errors: errors.array().map(err => ({
        field: err.path,
        message: err.msg
      }))
    });
  }
  
  next();
};

/**
 * Validation rules for creating a new Todo list
 */
const createTodoListValidator = [
  body('date')
    .isISO8601()
    .withMessage('Date must be a valid ISO8601 date format (YYYY-MM-DD)'),
    
  handleValidationErrors
];

/**
 * Validation rules for getting todo lists by date range
 */
const getTodoListsValidator = [
  query('startDate')
    .optional()
    .isISO8601()
    .withMessage('startDate must be a valid ISO8601 date format (YYYY-MM-DD)'),
    
  query('endDate')
    .optional()
    .isISO8601()
    .withMessage('endDate must be a valid ISO8601 date format (YYYY-MM-DD)'),
    
  handleValidationErrors
];

/**
 * Validation rules for getting a todo list by ID
 */
const getTodoListValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid list ID format'),
    
  handleValidationErrors
];

/**
 * Validation rules for creating a new task
 */
const createTaskValidator = [
  body('content')
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Task content must be between 1 and 2000 characters'),
    
  body('priority')
    .optional()
    .isIn(Object.values(PRIORITY_LEVELS))
    .withMessage(`Priority must be one of: ${Object.values(PRIORITY_LEVELS).join(', ')}`),
    
  body('listId')
    .isMongoId()
    .withMessage('Invalid list ID format'),
    
  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a non-negative integer'),
    
  handleValidationErrors
];

/**
 * Validation rules for updating a task
 */
const updateTaskValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
    
  body('content')
    .optional()
    .trim()
    .isLength({ min: 1, max: 2000 })
    .withMessage('Task content must be between 1 and 2000 characters'),
    
  body('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed status must be a boolean'),
    
  body('priority')
    .optional()
    .isIn(Object.values(PRIORITY_LEVELS))
    .withMessage(`Priority must be one of: ${Object.values(PRIORITY_LEVELS).join(', ')}`),
    
  body('position')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Position must be a non-negative integer'),
    
  handleValidationErrors
];

/**
 * Validation rules for toggling task completion status
 */
const toggleTaskCompletionValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
    
  handleValidationErrors
];

/**
 * Validation rules for deleting a task
 */
const deleteTaskValidator = [
  param('id')
    .isMongoId()
    .withMessage('Invalid task ID format'),
    
  handleValidationErrors
];

/**
 * Validation rules for getting tasks by status
 */
const getTasksByStatusValidator = [
  query('completed')
    .optional()
    .isBoolean()
    .withMessage('Completed status must be a boolean'),
    
  query('priority')
    .optional()
    .isIn(Object.values(PRIORITY_LEVELS))
    .withMessage(`Priority must be one of: ${Object.values(PRIORITY_LEVELS).join(', ')}`),
    
  query('overdueOnly')
    .optional()
    .isBoolean()
    .withMessage('overdueOnly must be a boolean'),
    
  handleValidationErrors
];

module.exports = {
  createTodoListValidator,
  getTodoListsValidator,
  getTodoListValidator,
  createTaskValidator,
  updateTaskValidator,
  toggleTaskCompletionValidator,
  deleteTaskValidator,
  getTasksByStatusValidator
}; 
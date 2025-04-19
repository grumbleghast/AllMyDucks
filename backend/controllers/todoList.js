/**
 * Controller for Todo List operations
 */
const ToDoList = require('../models/ToDoList');
const Task = require('../models/Task');
const mongoose = require('mongoose');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');

/**
 * Create a new ToDo list for a specific date
 * 
 * @route   POST /api/todo/lists
 * @access  Private
 */
exports.createTodoList = asyncHandler(async (req, res, next) => {
  const { date } = req.body;
  
  // Check if a list already exists for this user and date
  const existingList = await ToDoList.findOne({
    user: req.user.id,
    date: new Date(date)
  });
  
  if (existingList) {
    return next(new ErrorResponse('Todo list for this date already exists', 400));
  }
  
  // Create new todo list
  const todoList = await ToDoList.create({
    date,
    user: req.user.id,
    tasks: []
  });
  
  res.status(201).json({
    success: true,
    data: todoList
  });
});

/**
 * Get all ToDo lists for the current user, with optional date filtering
 * 
 * @route   GET /api/todo/lists
 * @access  Private
 */
exports.getTodoLists = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  const query = { user: req.user.id };
  
  // Add date filtering if provided
  if (startDate || endDate) {
    query.date = {};
    
    if (startDate) {
      query.date.$gte = new Date(startDate);
    }
    
    if (endDate) {
      query.date.$lte = new Date(endDate);
    }
  }
  
  const todoLists = await ToDoList.find(query)
    .sort({ date: -1 })
    .populate({
      path: 'tasks',
      select: 'content completed position priority originalDate',
      options: { sort: { position: 1 } }
    });
  
  res.status(200).json({
    success: true,
    count: todoLists.length,
    data: todoLists
  });
});

/**
 * Get a specific ToDo list by ID
 * 
 * @route   GET /api/todo/lists/:id
 * @access  Private
 */
exports.getTodoList = asyncHandler(async (req, res, next) => {
  const todoList = await ToDoList.findById(req.params.id)
    .populate({
      path: 'tasks',
      select: 'content completed position priority originalDate',
      options: { sort: { position: 1 } }
    });
  
  if (!todoList) {
    return next(new ErrorResponse(`Todo list not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user owns this list
  if (todoList.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to access this todo list', 403));
  }
  
  res.status(200).json({
    success: true,
    data: todoList
  });
});

/**
 * Get ToDo list by date
 * 
 * @route   GET /api/todo/lists/date/:date
 * @access  Private
 */
exports.getTodoListByDate = asyncHandler(async (req, res, next) => {
  const date = new Date(req.params.date);
  
  // Find or create todo list for the specific date
  let todoList = await ToDoList.findOne({
    user: req.user.id,
    date: {
      $gte: new Date(date.setHours(0, 0, 0, 0)),
      $lt: new Date(date.setHours(23, 59, 59, 999))
    }
  }).populate({
    path: 'tasks',
    select: 'content completed position priority originalDate',
    options: { sort: { position: 1 } }
  });
  
  // If list doesn't exist, create a new one
  if (!todoList) {
    todoList = await ToDoList.create({
      date: date,
      user: req.user.id,
      tasks: []
    });
    
    // Populate tasks (will be empty for a new list)
    todoList = await ToDoList.findById(todoList._id).populate({
      path: 'tasks',
      select: 'content completed position priority originalDate',
      options: { sort: { position: 1 } }
    });
  }
  
  res.status(200).json({
    success: true,
    data: todoList
  });
});

/**
 * Delete a ToDo list by ID
 * 
 * @route   DELETE /api/todo/lists/:id
 * @access  Private
 */
exports.deleteTodoList = asyncHandler(async (req, res, next) => {
  const todoList = await ToDoList.findById(req.params.id);
  
  if (!todoList) {
    return next(new ErrorResponse(`Todo list not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user owns this list
  if (todoList.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this todo list', 403));
  }
  
  // Delete all tasks associated with this list
  await Task.deleteMany({ list: todoList._id });
  
  // Delete the list
  await todoList.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Get user stats for todo completion
 * 
 * @route   GET /api/todo/stats
 * @access  Private
 */
exports.getTodoStats = asyncHandler(async (req, res, next) => {
  const { startDate, endDate } = req.query;
  
  const dateQuery = {};
  
  if (startDate) {
    dateQuery.$gte = new Date(startDate);
  }
  
  if (endDate) {
    dateQuery.$lte = new Date(endDate);
  }
  
  // Get stats from ToDo lists
  const lists = await ToDoList.find({
    user: req.user.id,
    ...(Object.keys(dateQuery).length > 0 ? { date: dateQuery } : {})
  });
  
  // Get completed vs. total tasks
  const completedTasks = await Task.countDocuments({
    user: req.user.id,
    completed: true,
    ...(Object.keys(dateQuery).length > 0 ? { originalDate: dateQuery } : {})
  });
  
  const totalTasks = await Task.countDocuments({
    user: req.user.id,
    ...(Object.keys(dateQuery).length > 0 ? { originalDate: dateQuery } : {})
  });
  
  // Calculate overall completion percentage
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
  
  // Calculate average tasks per day
  const tasksPerDay = lists.length > 0
    ? Math.round((totalTasks / lists.length) * 10) / 10
    : 0;
  
  // Calculate streak (consecutive days with completed tasks)
  let currentStreak = 0;
  let longestStreak = 0;
  
  // Sort lists by date (oldest first)
  const sortedLists = [...lists].sort((a, b) => new Date(a.date) - new Date(b.date));
  
  for (const list of sortedLists) {
    if (list.statistics.completedTasks > 0) {
      currentStreak++;
      longestStreak = Math.max(longestStreak, currentStreak);
    } else {
      currentStreak = 0;
    }
  }
  
  res.status(200).json({
    success: true,
    data: {
      totalLists: lists.length,
      totalTasks,
      completedTasks,
      completionPercentage,
      tasksPerDay,
      currentStreak,
      longestStreak
    }
  });
}); 
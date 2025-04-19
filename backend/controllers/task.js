/**
 * Controller for Task operations
 */
const Task = require('../models/Task');
const ToDoList = require('../models/ToDoList');
const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const mongoose = require('mongoose');

/**
 * Create a new task in a ToDo list
 * 
 * @route   POST /api/todo/tasks
 * @access  Private
 */
exports.createTask = asyncHandler(async (req, res, next) => {
  const { content, priority, listId, position } = req.body;
  
  // Check if list exists and user owns it
  const todoList = await ToDoList.findById(listId);
  
  if (!todoList) {
    return next(new ErrorResponse(`Todo list not found with id of ${listId}`, 404));
  }
  
  if (todoList.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to add tasks to this list', 403));
  }
  
  // Get highest position if not provided
  let taskPosition = position;
  if (!taskPosition) {
    const lastTask = await Task.findOne({ list: listId }).sort('-position');
    taskPosition = lastTask ? lastTask.position + 1 : 0;
  }
  
  // Create task
  const task = await Task.create({
    content,
    priority: priority || 'medium',
    position: taskPosition,
    list: listId,
    user: req.user.id,
    originalDate: todoList.date
  });
  
  // Add task reference to todo list
  todoList.tasks.push(task._id);
  await todoList.save();
  
  res.status(201).json({
    success: true,
    data: task
  });
});

/**
 * Update an existing task
 * 
 * @route   PUT /api/todo/tasks/:id
 * @access  Private
 */
exports.updateTask = asyncHandler(async (req, res, next) => {
  const { content, priority, position } = req.body;
  
  // Find task by ID
  let task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user owns this task
  if (task.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this task', 403));
  }
  
  // Update task
  task = await Task.findByIdAndUpdate(
    req.params.id,
    { 
      content: content || task.content,
      priority: priority || task.priority,
      position: position !== undefined ? position : task.position
    },
    { new: true, runValidators: true }
  );
  
  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * Toggle completion status of a task
 * 
 * @route   PUT /api/todo/tasks/:id/toggle
 * @access  Private
 */
exports.toggleTaskCompletion = asyncHandler(async (req, res, next) => {
  // Find task by ID
  let task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user owns this task
  if (task.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to update this task', 403));
  }
  
  // Toggle completion status
  task.completed = !task.completed;
  task.completedAt = task.completed ? Date.now() : null;
  
  await task.save();
  
  // Update list statistics
  const todoList = await ToDoList.findById(task.list);
  if (todoList) {
    await todoList.updateStats();
  }
  
  res.status(200).json({
    success: true,
    data: task
  });
});

/**
 * Delete a task
 * 
 * @route   DELETE /api/todo/tasks/:id
 * @access  Private
 */
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const task = await Task.findById(req.params.id);
  
  if (!task) {
    return next(new ErrorResponse(`Task not found with id of ${req.params.id}`, 404));
  }
  
  // Check if user owns this task
  if (task.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to delete this task', 403));
  }
  
  // Remove task reference from todo list
  const todoList = await ToDoList.findById(task.list);
  if (todoList) {
    todoList.tasks = todoList.tasks.filter(
      taskId => taskId.toString() !== task._id.toString()
    );
    await todoList.save();
    await todoList.updateStats();
  }
  
  // Delete the task
  await task.deleteOne();
  
  res.status(200).json({
    success: true,
    data: {}
  });
});

/**
 * Get tasks by status (completed/incomplete) with optional filtering
 * 
 * @route   GET /api/todo/tasks
 * @access  Private
 */
exports.getTasksByStatus = asyncHandler(async (req, res, next) => {
  const { completed, priority, overdue } = req.query;
  
  const query = { user: req.user.id };
  
  // Filter by completion status if provided
  if (completed !== undefined) {
    query.completed = completed === 'true';
  }
  
  // Filter by priority if provided
  if (priority) {
    query.priority = priority;
  }
  
  // Filter overdue tasks if requested
  if (overdue === 'true') {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    query.originalDate = { $lt: today };
    query.completed = false;
  }
  
  const tasks = await Task.find(query)
    .sort({ position: 1 })
    .populate({
      path: 'list',
      select: 'date'
    });
  
  res.status(200).json({
    success: true,
    count: tasks.length,
    data: tasks
  });
});

/**
 * Reorder tasks within a list
 * 
 * @route   PUT /api/todo/lists/:listId/reorder
 * @access  Private
 */
exports.reorderTasks = asyncHandler(async (req, res, next) => {
  const { listId } = req.params;
  const { taskOrders } = req.body;
  
  if (!taskOrders || !Array.isArray(taskOrders)) {
    return next(new ErrorResponse('Task orders array is required', 400));
  }
  
  // Check if list exists and user owns it
  const todoList = await ToDoList.findById(listId);
  
  if (!todoList) {
    return next(new ErrorResponse(`Todo list not found with id of ${listId}`, 404));
  }
  
  if (todoList.user.toString() !== req.user.id) {
    return next(new ErrorResponse('Not authorized to reorder tasks in this list', 403));
  }
  
  // Start a session for transaction
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Update each task's position
    for (const order of taskOrders) {
      const { id, position } = order;
      
      await Task.findByIdAndUpdate(
        id,
        { position },
        { session }
      );
    }
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    // Fetch the updated list with tasks in new order
    const updatedList = await ToDoList.findById(listId).populate({
      path: 'tasks',
      select: 'content completed position priority originalDate',
      options: { sort: { position: 1 } }
    });
    
    res.status(200).json({
      success: true,
      data: updatedList
    });
  } catch (error) {
    // Abort transaction on error
    await session.abortTransaction();
    session.endSession();
    next(error);
  }
}); 
/**
 * Task Transfer Service
 * Handles the automatic transfer of incomplete tasks from previous days to the current day
 */
const { Task } = require('../models/Task');
const ToDoList = require('../models/ToDoList');
const mongoose = require('mongoose');

/**
 * Identify incomplete tasks from previous days that need to be transferred
 * @param {Object} options - Configuration options
 * @param {Date} options.cutoffDate - Date to use as cutoff (defaults to current date)
 * @param {String} options.userId - User ID to filter tasks by (optional)
 * @returns {Promise<Array>} Array of tasks to be transferred
 */
const identifyIncompleteTasksForTransfer = async (options = {}) => {
  const { cutoffDate = new Date(), userId } = options;
  
  // Set cutoff date to beginning of the day
  const cutoff = new Date(cutoffDate);
  cutoff.setHours(0, 0, 0, 0);
  
  // Build query to find incomplete tasks from previous days
  const query = {
    completed: false,
    originalDate: { $lt: cutoff }
  };
  
  // Add user filter if provided
  if (userId) {
    query.user = userId;
  }
  
  // Find eligible tasks
  const tasks = await Task.find(query)
    .populate({
      path: 'list',
      select: 'date'
    });
  
  return tasks;
};

/**
 * Transfer incomplete tasks to the current day
 * @param {Array} tasks - Array of tasks to transfer
 * @param {Object} options - Configuration options
 * @param {Date} options.targetDate - Date to transfer tasks to (defaults to current date)
 * @returns {Promise<Array>} Array of transferred tasks
 */
const transferIncompleteTasks = async (tasks, options = {}) => {
  if (!tasks || tasks.length === 0) {
    return [];
  }
  
  // Set target date to beginning of the specified day or today
  const { targetDate = new Date() } = options;
  const target = new Date(targetDate);
  target.setHours(0, 0, 0, 0);
  
  // Start a transaction for data integrity
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const transferredTasks = [];
    
    // Group tasks by user to process efficiently
    const tasksByUser = tasks.reduce((acc, task) => {
      const userId = task.user.toString();
      if (!acc[userId]) {
        acc[userId] = [];
      }
      acc[userId].push(task);
      return acc;
    }, {});
    
    // Process each user's tasks
    for (const [userId, userTasks] of Object.entries(tasksByUser)) {
      // Find or create todo list for the target date for this user
      let todoList = await ToDoList.findOne({
        user: userId,
        date: {
          $gte: new Date(target.setHours(0, 0, 0, 0)),
          $lt: new Date(target.setHours(23, 59, 59, 999))
        }
      }).session(session);
      
      // Create a new todo list if it doesn't exist
      if (!todoList) {
        todoList = await ToDoList.create([{
          date: target,
          user: userId,
          tasks: []
        }], { session });
        todoList = todoList[0]; // Extract the created document from the array
      }
      
      // Get the highest position for the new list
      const lastTask = await Task.findOne({ 
        list: todoList._id 
      }).sort('-position').session(session);
      
      let nextPosition = lastTask ? lastTask.position + 1 : 0;
      
      // Transfer each task
      for (const task of userTasks) {
        // Create a new task in the target list
        const newTask = await Task.create([{
          content: task.content,
          priority: task.priority,
          position: nextPosition++,
          list: todoList._id,
          user: userId,
          originalDate: task.originalDate, // Preserve the original date
          isTransferred: true
        }], { session });
        
        // Add task to the list
        todoList.tasks.push(newTask[0]._id);
        
        // Optionally, mark the original task as handled or delete it
        await Task.findByIdAndUpdate(
          task._id, 
          { $set: { isHandled: true } },
          { session }
        );
        
        transferredTasks.push(newTask[0]);
      }
      
      // Save the updated list
      await todoList.save({ session });
    }
    
    // Commit the transaction
    await session.commitTransaction();
    session.endSession();
    
    return transferredTasks;
  } catch (error) {
    // Abort transaction if any error occurs
    await session.abortTransaction();
    session.endSession();
    console.error('Error transferring tasks:', error);
    throw error;
  }
};

/**
 * Execute the midnight task transfer process
 * @param {String} userId - Optional user ID to process tasks for a specific user
 * @returns {Promise<Object>} Result object with counts of identified and transferred tasks
 */
const executeMidnightTaskTransfer = async (userId = null) => {
  try {
    // Identify tasks that need to be transferred
    const tasksToTransfer = await identifyIncompleteTasksForTransfer({
      userId
    });
    
    // Transfer the identified tasks
    const transferredTasks = await transferIncompleteTasks(tasksToTransfer);
    
    return {
      identified: tasksToTransfer.length,
      transferred: transferredTasks.length,
      success: true
    };
  } catch (error) {
    console.error('Error executing task transfer:', error);
    return {
      identified: 0,
      transferred: 0,
      success: false,
      error: error.message
    };
  }
};

module.exports = {
  identifyIncompleteTasksForTransfer,
  transferIncompleteTasks,
  executeMidnightTaskTransfer
}; 
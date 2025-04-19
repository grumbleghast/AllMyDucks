/**
 * Todo Service
 * Handles API requests for todo tasks and lists
 */
import api from './api';

/**
 * Get todo lists for a date range
 * @param {string} startDate - Start date in YYYY-MM-DD format
 * @param {string} endDate - End date in YYYY-MM-DD format
 * @returns {Promise} API response
 */
export const getTodoLists = async (startDate, endDate) => {
  return api.get('/todos', {
    params: { startDate, endDate }
  });
};

/**
 * Get a todo list for a specific date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response
 */
export const getTodoListByDate = async (date) => {
  return api.get(`/todos/date/${date}`);
};

/**
 * Create a new todo list for a date
 * @param {string} date - Date in YYYY-MM-DD format
 * @returns {Promise} API response
 */
export const createTodoList = async (date) => {
  return api.post('/todos', { date });
};

/**
 * Add a task to a todo list
 * @param {string} listId - Todo list ID
 * @param {Object} task - Task object
 * @param {string} task.content - Task content
 * @param {string} task.priority - Task priority
 * @returns {Promise} API response
 */
export const createTask = async (listId, task) => {
  return api.post(`/todos/${listId}/tasks`, task);
};

/**
 * Update a task
 * @param {string} taskId - Task ID
 * @param {Object} updates - Fields to update
 * @returns {Promise} API response
 */
export const updateTask = async (taskId, updates) => {
  return api.put(`/tasks/${taskId}`, updates);
};

/**
 * Toggle task completion
 * @param {string} taskId - Task ID
 * @returns {Promise} API response
 */
export const toggleTaskCompletion = async (taskId) => {
  return api.patch(`/tasks/${taskId}/toggle`);
};

/**
 * Delete a task
 * @param {string} taskId - Task ID
 * @returns {Promise} API response
 */
export const deleteTask = async (taskId) => {
  return api.delete(`/tasks/${taskId}`);
};

/**
 * Get tasks by status
 * @param {boolean} completed - Completion status
 * @param {string} priority - Priority level filter
 * @param {boolean} overdueOnly - Filter for overdue tasks only
 * @returns {Promise} API response
 */
export const getTasksByStatus = async (completed, priority, overdueOnly) => {
  return api.get('/tasks', {
    params: { completed, priority, overdueOnly }
  });
};

/**
 * Reorder tasks
 * @param {string} listId - Todo list ID
 * @param {Array} taskIds - Array of task IDs in the new order
 * @returns {Promise} API response
 */
export const reorderTasks = async (listId, taskIds) => {
  return api.put(`/todos/${listId}/reorder`, { taskIds });
};

export default {
  getTodoLists,
  getTodoListByDate,
  createTodoList,
  createTask,
  updateTask,
  toggleTaskCompletion,
  deleteTask,
  getTasksByStatus,
  reorderTasks
}; 
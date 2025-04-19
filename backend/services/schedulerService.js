/**
 * Scheduler Service
 * Configures and manages scheduled tasks using node-cron
 */
const cron = require('node-cron');
const taskTransferService = require('./taskTransferService');
const logger = require('../utils/logger');

// Store active scheduled tasks
const scheduledTasks = {};

/**
 * Configure the midnight task transfer job
 * Runs every day at 12:01 AM to transfer incomplete tasks
 */
function scheduleMidnightTransfer() {
  // Schedule task to run at 12:01 AM every day (server time)
  // Format: second(0-59) minute(0-59) hour(0-23) day-of-month(1-31) month(1-12) day-of-week(0-6)(Sunday=0)
  scheduledTasks.midnightTransfer = cron.schedule('1 0 * * *', async () => {
    logger.info('Running scheduled midnight task transfer');
    
    try {
      const result = await taskTransferService.executeMidnightTaskTransfer();
      
      if (result.success) {
        logger.info(`Task transfer complete: ${result.transferred} tasks transferred out of ${result.identified} identified`);
      } else {
        logger.error(`Task transfer failed: ${result.error}`);
      }
    } catch (error) {
      logger.error('Error during scheduled task transfer:', error);
    }
  });
  
  logger.info('Midnight task transfer scheduled');
  return scheduledTasks.midnightTransfer;
}

/**
 * Initialize all scheduled tasks
 * Called during application startup
 */
function initScheduler() {
  logger.info('Initializing scheduler service');
  
  // Schedule midnight task transfer
  scheduleMidnightTransfer();
  
  // Add other scheduled tasks here as needed
  
  logger.info('Scheduler service initialized successfully');
}

/**
 * Stop all scheduled tasks
 * Called during application shutdown
 */
function stopScheduler() {
  logger.info('Stopping scheduled tasks');
  
  // Stop all active scheduled tasks
  Object.values(scheduledTasks).forEach(task => {
    if (task && typeof task.stop === 'function') {
      task.stop();
    }
  });
  
  logger.info('All scheduled tasks stopped');
}

module.exports = {
  initScheduler,
  stopScheduler,
  scheduleMidnightTransfer
}; 
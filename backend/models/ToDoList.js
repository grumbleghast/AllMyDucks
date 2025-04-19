/**
 * ToDoList model for storing daily to-do lists
 * Defines the schema for a daily to-do list with tasks and completion statistics
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * ToDoList schema
 * Contains a date, user reference, tasks array, and completion statistics
 */
const ToDoListSchema = new Schema(
  {
    date: {
      type: Date,
      required: [true, 'Date is required for a ToDoList'],
      index: true
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    tasks: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Task'
      }
    ],
    // Completion statistics are calculated and stored for efficiency
    statistics: {
      totalTasks: {
        type: Number,
        default: 0
      },
      completedTasks: {
        type: Number,
        default: 0
      },
      completionPercentage: {
        type: Number,
        default: 0
      }
    }
  },
  {
    timestamps: true
  }
);

/**
 * Index for efficient querying by user and date
 * Allows quick access to a user's to-do list for a specific date
 */
ToDoListSchema.index({ user: 1, date: 1 }, { unique: true });

/**
 * Method to recalculate completion statistics
 * Updates totalTasks, completedTasks, and completionPercentage
 * @returns {Promise<void>}
 */
ToDoListSchema.methods.calculateStatistics = async function() {
  try {
    const taskCount = this.tasks.length;
    
    // If there are no tasks, set all statistics to 0
    if (taskCount === 0) {
      this.statistics.totalTasks = 0;
      this.statistics.completedTasks = 0;
      this.statistics.completionPercentage = 0;
      return;
    }
    
    // Populate the tasks to get their completion status
    await this.populate('tasks');
    
    // Count the completed tasks
    const completedCount = this.tasks.filter(task => 
      task && task.completed
    ).length;
    
    // Calculate the percentage
    const percentage = Math.round((completedCount / taskCount) * 100);
    
    // Update the statistics
    this.statistics.totalTasks = taskCount;
    this.statistics.completedTasks = completedCount;
    this.statistics.completionPercentage = percentage;
  } catch (error) {
    console.error('Error calculating statistics:', error);
    throw error;
  }
};

/**
 * Pre-save hook to ensure statistics are up to date
 */
ToDoListSchema.pre('save', async function(next) {
  if (this.isModified('tasks')) {
    await this.calculateStatistics();
  }
  next();
});

const ToDoList = mongoose.model('ToDoList', ToDoListSchema);

module.exports = ToDoList; 
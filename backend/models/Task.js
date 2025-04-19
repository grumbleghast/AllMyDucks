/**
 * Task model for individual to-do items
 * Defines the schema for tasks in to-do lists
 */
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Priority levels for tasks
 * LOW: Low priority - can be done later
 * MEDIUM: Medium priority - should be done soon
 * HIGH: High priority - urgent tasks
 */
const PRIORITY_LEVELS = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high'
};

/**
 * Task schema
 * Contains content, dates, status, position, and priority information
 */
const TaskSchema = new Schema(
  {
    content: {
      type: String,
      required: [true, 'Task content is required'],
      trim: true,
      maxlength: [2000, 'Task content cannot exceed 2000 characters']
    },
    completed: {
      type: Boolean,
      default: false
    },
    position: {
      type: Number,
      required: [true, 'Position is required for ordering tasks'],
      min: [0, 'Position must be a non-negative number']
    },
    priority: {
      type: String,
      enum: Object.values(PRIORITY_LEVELS),
      default: PRIORITY_LEVELS.MEDIUM
    },
    originalDate: {
      type: Date,
      required: [true, 'Original creation date is required'],
      default: Date.now
    },
    list: {
      type: Schema.Types.ObjectId,
      ref: 'ToDoList',
      required: [true, 'Task must belong to a to-do list']
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User reference is required']
    },
    // New fields for task transfer functionality
    isTransferred: {
      type: Boolean, 
      default: false
    },
    isHandled: {
      type: Boolean,
      default: false
    }
  },
  {
    timestamps: true
  }
);

/**
 * Indexes for efficient querying
 */
TaskSchema.index({ list: 1, position: 1 }); // Efficiently find tasks in a list by position
TaskSchema.index({ user: 1, completed: 1 }); // Efficiently find incomplete tasks for a user
TaskSchema.index({ originalDate: 1, completed: 1 }); // For finding incomplete tasks by date
TaskSchema.index({ isTransferred: 1 }); // For querying transferred tasks

/**
 * Calculate the age of a task in days
 * @returns {number} Age in days
 */
TaskSchema.methods.getAgeInDays = function() {
  const now = new Date();
  const created = this.originalDate || this.createdAt;
  const ageMs = now - created;
  return Math.floor(ageMs / (1000 * 60 * 60 * 24)); // Convert ms to days
};

/**
 * Check if the task is overdue
 * A task is considered overdue if:
 * 1. It's not completed
 * 2. It's more than 1 day old for high priority
 * 3. It's more than 3 days old for medium priority
 * 4. It's more than 7 days old for low priority
 * @returns {boolean} Whether the task is overdue
 */
TaskSchema.methods.isOverdue = function() {
  if (this.completed) return false;
  
  const ageInDays = this.getAgeInDays();
  
  switch (this.priority) {
    case PRIORITY_LEVELS.HIGH:
      return ageInDays > 1;
    case PRIORITY_LEVELS.MEDIUM:
      return ageInDays > 3;
    case PRIORITY_LEVELS.LOW:
      return ageInDays > 7;
    default:
      return ageInDays > 3; // Default to medium priority rule
  }
};

/**
 * Pre-save hook to handle tasks when they're completed
 * Automatically moves completed tasks to the end of the list
 */
TaskSchema.pre('save', async function(next) {
  try {
    // If the completion status is changing to true
    if (this.isModified('completed') && this.completed) {
      // Find the maximum position value in the list for completed tasks
      const Task = this.constructor;
      const maxPositionTask = await Task.findOne({ 
        list: this.list, 
        completed: true 
      }).sort('-position');
      
      if (maxPositionTask) {
        // Place after the last completed task
        this.position = maxPositionTask.position + 1;
      } else {
        // This is the first completed task, find the max position of incomplete tasks
        const maxIncompleteTask = await Task.findOne({ 
          list: this.list, 
          completed: false 
        }).sort('-position');
        
        if (maxIncompleteTask) {
          // Place after the last incomplete task
          this.position = maxIncompleteTask.position + 1;
        } else {
          // No other tasks in the list, set position to 0
          this.position = 0;
        }
      }
    }
    
    next();
  } catch (error) {
    next(error);
  }
});

// Export the model and priority levels
const Task = mongoose.model('Task', TaskSchema);

module.exports = {
  Task,
  PRIORITY_LEVELS
}; 
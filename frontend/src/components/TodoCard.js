/**
 * TodoCard component for displaying a daily to-do list
 * Shows tasks for a specific date with completion status
 */
import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Button, ProgressBar, Spinner, Alert, InputGroup, FormControl, Modal, Dropdown } from 'react-bootstrap';
import { BsChevronLeft, BsChevronRight, BsPlus, BsX, BsCheck2, BsPencil, BsFlag } from 'react-icons/bs';
import todoService from '../services/todoService';
import RichTextEditor from './RichTextEditor';
import './TodoCard.css';

/**
 * Format a date as a string for display
 * @param {Date} date - The date to format
 * @returns {string} Formatted date string
 */
const formatDate = (date) => {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return date.toLocaleDateString('en-US', options);
};

/**
 * Convert Date to YYYY-MM-DD format for API calls
 * @param {Date} date - The date to format
 * @returns {string} Date in YYYY-MM-DD format
 */
const formatDateForApi = (date) => {
  return date.toISOString().split('T')[0];
};

/**
 * TodoCard component
 * @param {Object} props - Component props
 * @param {Date} props.initialDate - Initial date for the to-do list
 * @param {boolean} props.useApi - Whether to use API for data (if false, uses sample data)
 * @returns {JSX.Element} The rendered component
 */
const TodoCard = ({ initialDate = new Date(), useApi = false }) => {
  // State for current date and tasks
  const [currentDate, setCurrentDate] = useState(initialDate);
  const [todoList, setTodoList] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskText, setNewTaskText] = useState('');
  
  // New state for rich text editing
  const [richTaskContent, setRichTaskContent] = useState('');
  const [selectedPriority, setSelectedPriority] = useState('medium');
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTaskContent, setEditTaskContent] = useState('');
  const [editTaskPriority, setEditTaskPriority] = useState('medium');
  
  /**
   * Fetch tasks for the current date
   */
  const fetchTasks = useCallback(async () => {
    if (!useApi) {
      // Use sample data when not using API
      setTasks([
        { id: 1, content: 'Complete project setup', completed: false, priority: 'high' },
        { id: 2, content: 'Create user authentication', completed: false, priority: 'medium' },
        { id: 3, content: 'Design database schema', completed: true, priority: 'low' },
        { id: 4, content: 'Implement API endpoints', completed: false, priority: 'high' },
      ]);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const formattedDate = formatDateForApi(currentDate);
      const response = await todoService.getTodoListByDate(formattedDate);
      
      if (response.data) {
        setTodoList(response.data);
        setTasks(response.data.tasks || []);
      } else {
        // Create a new todo list for this date if none exists
        const newListResponse = await todoService.createTodoList(formattedDate);
        setTodoList(newListResponse.data);
        setTasks([]);
      }
    } catch (err) {
      console.error('Error fetching tasks:', err);
      setError('Failed to load tasks. Please try again later.');
      setTasks([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentDate, useApi]);
  
  // Load tasks when component mounts or date changes
  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);
  
  /**
   * Toggle task completion status
   * @param {number|string} taskId - Task ID
   */
  const toggleTaskCompletion = async (taskId) => {
    // Create optimistic update
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    
    // Update UI immediately
    setTasks(updatedTasks);
    
    if (useApi) {
      try {
        await todoService.toggleTaskCompletion(taskId);
      } catch (err) {
        console.error('Error toggling task:', err);
        // Rollback to previous state if API call fails
        setTasks(tasks);
        setError('Failed to update task. Please try again.');
      }
    }
  };
  
  /**
   * Navigate to the previous day
   */
  const navigateToPreviousDay = () => {
    const prevDay = new Date(currentDate);
    prevDay.setDate(prevDay.getDate() - 1);
    setCurrentDate(prevDay);
  };
  
  /**
   * Navigate to the next day
   */
  const navigateToNextDay = () => {
    const nextDay = new Date(currentDate);
    nextDay.setDate(nextDay.getDate() + 1);
    setCurrentDate(nextDay);
  };
  
  /**
   * Add a new task
   */
  const addTask = async () => {
    // When using rich text editor
    const content = showAddTask ? newTaskText : richTaskContent;
    if (!content.trim()) return;
    
    // Create a new task object
    const newTask = {
      content: content,
      priority: selectedPriority
    };
    
    if (useApi && todoList) {
      try {
        const response = await todoService.createTask(todoList._id, newTask);
        setTasks([...tasks, response.data]);
      } catch (err) {
        console.error('Error adding task:', err);
        setError('Failed to add task. Please try again.');
      }
    } else {
      // For demo mode, add a task locally
      const newTaskWithId = {
        ...newTask,
        id: Date.now(),
        completed: false
      };
      setTasks([...tasks, newTaskWithId]);
    }
    
    // Reset the new task input
    setNewTaskText('');
    setRichTaskContent('');
    setSelectedPriority('medium');
    setShowAddTask(false);
  };
  
  /**
   * Delete a task
   * @param {number|string} taskId - Task ID
   */
  const deleteTask = async (taskId) => {
    // Optimistic update
    setTasks(tasks.filter(task => task.id !== taskId));
    
    if (useApi) {
      try {
        await todoService.deleteTask(taskId);
      } catch (err) {
        console.error('Error deleting task:', err);
        // Rollback if API call fails
        fetchTasks();
        setError('Failed to delete task. Please try again.');
      }
    }
  };
  
  /**
   * Open the edit modal for a task
   * @param {Object} task - The task to edit
   */
  const openEditModal = (task) => {
    setEditingTask(task);
    setEditTaskContent(task.content);
    setEditTaskPriority(task.priority || 'medium');
    setShowEditModal(true);
  };
  
  /**
   * Save edited task
   */
  const saveEditedTask = async () => {
    if (!editTaskContent.trim()) return;
    
    const updatedTask = {
      ...editingTask,
      content: editTaskContent,
      priority: editTaskPriority
    };
    
    // Optimistic update
    const updatedTasks = tasks.map(task => 
      task.id === editingTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    
    if (useApi) {
      try {
        await todoService.updateTask(editingTask.id, {
          content: editTaskContent,
          priority: editTaskPriority
        });
      } catch (err) {
        console.error('Error updating task:', err);
        // Rollback if API call fails
        fetchTasks();
        setError('Failed to update task. Please try again.');
      }
    }
    
    // Close modal and reset state
    setShowEditModal(false);
    setEditingTask(null);
    setEditTaskContent('');
    setEditTaskPriority('medium');
  };
  
  /**
   * Handle Enter key in new task input
   * @param {Object} e - Event object
   */
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      addTask();
      e.preventDefault();
    }
  };
  
  // Sort tasks - incomplete first, then by priority
  const sortedTasks = [...tasks].sort((a, b) => {
    if (a.completed !== b.completed) return a.completed ? 1 : -1;
    
    const priorityOrder = { high: 0, medium: 1, low: 2 };
    return priorityOrder[a.priority || 'medium'] - priorityOrder[b.priority || 'medium'];
  });
  
  // Calculate completion statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(task => task.completed).length;
  const completionPercentage = totalTasks ? (completedTasks / totalTasks) * 100 : 0;
  
  // Determine progress bar variant based on completion percentage
  let progressVariant = 'info';
  if (completionPercentage >= 70) progressVariant = 'success';
  else if (completionPercentage >= 30) progressVariant = 'warning';
  else if (completionPercentage > 0) progressVariant = 'danger';
  
  // Priority display options
  const priorityOptions = [
    { value: 'high', label: 'High Priority', color: '#dc3545' },
    { value: 'medium', label: 'Medium Priority', color: '#ffc107' },
    { value: 'low', label: 'Low Priority', color: '#6c757d' }
  ];
  
  // Find priority label
  const getPriorityLabel = (value) => {
    const option = priorityOptions.find(opt => opt.value === value);
    return option ? option.label : 'Medium Priority';
  };
  
  /**
   * Calculate the age of a task in days
   * @param {Object} task - The task to check
   * @returns {number} Age in days
   */
  const getTaskAgeInDays = (task) => {
    const now = new Date();
    const created = task.originalDate ? new Date(task.originalDate) : new Date(task.createdAt);
    const ageMs = now - created;
    return Math.floor(ageMs / (1000 * 60 * 60 * 24)); // Convert ms to days
  };

  /**
   * Check if the task is overdue based on priority
   * @param {Object} task - The task to check
   * @returns {boolean} Whether the task is overdue
   */
  const isTaskOverdue = (task) => {
    if (task.completed) return false;
    
    const ageInDays = getTaskAgeInDays(task);
    
    switch (task.priority) {
      case 'high':
        return ageInDays > 1;
      case 'medium':
        return ageInDays > 3;
      case 'low':
        return ageInDays > 7;
      default:
        return ageInDays > 3; // Default to medium priority rule
    }
  };
  
  return (
    <Card className="todo-card mb-4">
      <Card.Header className="text-center position-relative">
        <h2 className="todo-date">Tasks for {formatDate(currentDate)}</h2>
      </Card.Header>
      
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {isLoading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="primary" />
            <p className="mt-2">Loading tasks...</p>
          </div>
        ) : (
          <>
            <div className="task-list">
              {sortedTasks.length === 0 ? (
                <div className="text-center py-3 text-muted">
                  <p>No tasks for this day. Add a new task to get started.</p>
                </div>
              ) : (
                sortedTasks.map(task => (
                  <div 
                    key={task.id} 
                    className={`task-item d-flex align-items-center ${task.completed ? 'completed' : ''} priority-${task.priority || 'medium'}`}
                  >
                    <Form.Check 
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => toggleTaskCompletion(task.id)}
                    />
                    <div
                      className="task-content ms-2"
                      dangerouslySetInnerHTML={{ __html: task.content }}
                    />
                    <div className="ms-auto d-flex task-actions">
                      {!task.completed && task.originalDate && isTaskOverdue(task) && (
                        <small className="text-danger me-2 overdue-indicator">
                          ({getTaskAgeInDays(task)} days overdue)
                        </small>
                      )}
                      <Button 
                        variant="link" 
                        className="edit-task-btn"
                        onClick={() => openEditModal(task)}
                        aria-label="Edit task"
                      >
                        <BsPencil />
                      </Button>
                      <Button 
                        variant="link" 
                        className="delete-task-btn"
                        onClick={() => deleteTask(task.id)}
                        aria-label="Delete task"
                      >
                        <BsX />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
            
            {showAddTask ? (
              <div className="mt-3 add-task-container">
                <RichTextEditor 
                  value={richTaskContent}
                  onChange={setRichTaskContent}
                  placeholder="Enter task details..."
                />
                <div className="d-flex mt-2">
                  <Dropdown className="me-2">
                    <Dropdown.Toggle 
                      variant="outline-secondary" 
                      id="priority-dropdown"
                      className={`priority-dropdown priority-${selectedPriority}`}
                    >
                      <BsFlag className="me-1" /> {getPriorityLabel(selectedPriority)}
                    </Dropdown.Toggle>

                    <Dropdown.Menu>
                      {priorityOptions.map(option => (
                        <Dropdown.Item 
                          key={option.value}
                          onClick={() => setSelectedPriority(option.value)}
                          className={`priority-item priority-${option.value}`}
                        >
                          <BsFlag className="me-2" /> {option.label}
                        </Dropdown.Item>
                      ))}
                    </Dropdown.Menu>
                  </Dropdown>
                  <Button variant="primary" onClick={addTask} className="me-2">
                    Add Task
                  </Button>
                  <Button 
                    variant="outline-secondary" 
                    onClick={() => {
                      setShowAddTask(false);
                      setRichTaskContent('');
                      setSelectedPriority('medium');
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <Button 
                variant="outline-primary" 
                className="w-100 mt-3 add-task-btn"
                onClick={() => setShowAddTask(true)}
              >
                <BsPlus /> Add Task
              </Button>
            )}
          </>
        )}
      </Card.Body>
      
      <Card.Footer className="d-flex justify-content-between align-items-center">
        <Button 
          variant="link" 
          className="navigation-btn" 
          onClick={navigateToPreviousDay}
          aria-label="Previous day"
        >
          <BsChevronLeft />
        </Button>
        
        <div className="completion-stats text-center">
          <ProgressBar 
            variant={progressVariant} 
            now={completionPercentage} 
            className="mb-2" 
          />
          <small>{completedTasks} of {totalTasks} completed</small>
        </div>
        
        <Button 
          variant="link" 
          className="navigation-btn" 
          onClick={navigateToNextDay}
          aria-label="Next day"
        >
          <BsChevronRight />
        </Button>
      </Card.Footer>
      
      {/* Edit Task Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Task</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <RichTextEditor 
            value={editTaskContent}
            onChange={setEditTaskContent}
            placeholder="Edit task details..."
          />
          <Form.Group className="mt-3">
            <Form.Label>Priority</Form.Label>
            <Form.Select 
              value={editTaskPriority} 
              onChange={(e) => setEditTaskPriority(e.target.value)}
              className={`priority-select priority-${editTaskPriority}`}
            >
              {priorityOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={saveEditedTask}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </Card>
  );
};

export default TodoCard; 
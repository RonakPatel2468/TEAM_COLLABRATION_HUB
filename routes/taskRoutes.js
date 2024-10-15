const express = require('express');
const {
  createTask,
  updateTask,
  deleteTask,
  getTasks,
  filterTasks
} = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware'); // Make sure this is correct

const router = express.Router();

// Create new task
router.post('/create', authMiddleware, createTask);

// Update an existing task
router.put('/:taskId', authMiddleware, updateTask);

// Delete a task
router.delete('/:taskId', authMiddleware, deleteTask);

// Get all tasks
router.get('/get', authMiddleware, getTasks);

// Filter tasks by criteria (e.g., status, priority)
router.get('/filter', authMiddleware, filterTasks);

module.exports = router;


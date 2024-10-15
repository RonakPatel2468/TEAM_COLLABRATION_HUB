const Task = require('../models/Task');

// Create a new task
exports.createTask = async (req, res) => {
  const { title, description, assignedTo } = req.body;
  console.log("body:", req.body);
  
  try {
    const task = new Task({ title, description, createdBy: req.user.id, assignedTo });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all tasks created by the logged-in user
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update an existing task
exports.updateTask = async (req, res) => {
  const { taskId } = req.params;
  const { title, description, assignedTo, status } = req.body;

  try {
    const task = await Task.findOneAndUpdate(
      { _id: taskId, createdBy: req.user.id }, // Ensure only the task owner can update
      { title, description, assignedTo, status },
      { new: true } // Return the updated task
    );

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  const { taskId } = req.params;

  try {
    const task = await Task.findOneAndDelete({ _id: taskId, createdBy: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.status(200).json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Filter tasks by criteria (e.g., status, priority)
exports.filterTasks = async (req, res) => {
  const { status, priority } = req.query;

  try {
    const query = { createdBy: req.user.id };

    if (status) query.status = status;
    if (priority) query.priority = priority;

    const tasks = await Task.find(query);
    res.json(tasks);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

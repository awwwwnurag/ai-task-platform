const Task = require('../models/Task');
const redisClient = require('../config/redis');

// @desc    Create a new task and push to Redis queue
// @route   POST /api/tasks
// @access  Private
exports.createTask = async (req, res) => {
  try {
    const { title, input_text, operation, agent } = req.body;

    if (!title || !input_text || !operation || !agent) {
      return res.status(400).json({ success: false, message: 'Please provide title, input_text, operation, and agent' });
    }

    const validOperations = ['uppercase', 'lowercase', 'reverse string', 'word count', 'ai_prompt'];
    if (!validOperations.includes(operation)) {
      return res.status(400).json({ success: false, message: 'Invalid operation' });
    }

    // Create a pending task in MongoDB
    const task = await Task.create({
      title,
      input_text,
      operation,
      agent,
      status: 'pending',
      user: req.user._id,
    });

    // Push the job into Redis queue using native list
    await redisClient.lpush('ai-task-queue', JSON.stringify({
      taskId: task._id
    }));

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get all tasks for user
// @route   GET /api/tasks
// @access  Private
exports.getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Private
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createTask, getTasks, deleteTask } = require('../controllers/taskController');

// All task routes will be protected by JWT
router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);
router.delete('/:id', deleteTask);

module.exports = router;

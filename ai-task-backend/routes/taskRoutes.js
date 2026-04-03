const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { createTask, getTasks } = require('../controllers/taskController');

// All task routes will be protected by JWT
router.use(protect);

router.post('/', createTask);
router.get('/', getTasks);

module.exports = router;

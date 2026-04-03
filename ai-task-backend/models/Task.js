const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  input_text: {
    type: String,
    required: true,
  },
  operation: {
    type: String,
    enum: ['uppercase', 'lowercase', 'reverse string', 'word count'],
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'running', 'success', 'failed'],
    default: 'pending',
  },
  result: {
    type: mongoose.Schema.Types.Mixed, // Could be text, could be number
    default: null,
  },
  logs: {
    type: [String],
    default: []
  },
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('Task', TaskSchema);

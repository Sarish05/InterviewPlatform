const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    required: true
  },
  question: {
    type: String,
    required: true
  },
  transcript: {
    type: String,
    required: true
  },
  audio_analysis: {
    type: Object,
    required: true
  },
  content_analysis: {
    type: Object,
    required: true
  }
});

const sessionSchema = new mongoose.Schema({
  session_id: {
    type: String,
    required: true,
    unique: true
  },
  user_id: {
    type: String,
    required: true
  },
  created_at: {
    type: Date,
    required: true,
    default: Date.now
  },
  results: [resultSchema]
});

module.exports = mongoose.model('session-output', sessionSchema); 
const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/sessionController');

// Get session by ID
router.get('/:sessionId', sessionController.getSessionById);

// Get session summary for report page
router.get('/summary/:sessionId', sessionController.getSessionSummary);

module.exports = router; 
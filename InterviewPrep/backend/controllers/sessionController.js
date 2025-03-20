const Session = require('../models/session');

// Get session by ID
exports.getSessionById = async (req, res) => {
  try {
    console.log("Fetching session with ID:", req.params.sessionId);
    const session = await Session.findOne({ session_id: req.params.sessionId });
    console.log("Session found:", session);

    if (!session) {
      console.log("Session not found in DB");
      return res.status(404).json({ message: 'Session not found' });
    }

    res.json(session);
  } catch (error) {
    console.error("Error fetching session:", error);
    res.status(500).json({ message: 'Error fetching session', error: error.message });
  }
};


// Get session summary (for the report page)
exports.getSessionSummary = async (req, res) => {
  try {
    console.log(`Fetching summary for session: ${req.params.sessionId}`);
    const session = await Session.findOne({ session_id: req.params.sessionId });
    
    if (!session) {
      console.log(`Session ${req.params.sessionId} not found`);
      return res.status(404).json({ message: 'Session not found' });
    }
    
    console.log(`Found session: ${session}`);
    // ... rest of your code ...
  } catch (error) {
    console.error('Error in getSessionSummary:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
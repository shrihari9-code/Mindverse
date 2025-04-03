const express = require('express');
const dotenv = require('dotenv');
const { verifySlackRequest } = require('./middleware/slackVerification');
const slackEvents = require('./routes/slackEvents');

// Load environment variables
dotenv.config();

const app = express();

// Parse JSON payloads
app.use(express.json());

// Verify all Slack requests
app.use('/slack', verifySlackRequest);

// Route handler for Slack events
app.use('/slack/events', slackEvents);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
}); 
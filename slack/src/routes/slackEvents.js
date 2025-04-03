const express = require('express');
const router = express.Router();
const slackService = require('../services/slackService');

router.post('/', async (req, res) => {
  // Immediately respond to Slack to acknowledge receipt
  res.status(200).send();

  const { type, event, challenge } = req.body;

  // Handle URL verification challenge
  if (type === 'url_verification') {
    return res.send({ challenge });
  }

  // Handle message events
  if (event && event.type === 'message' && !event.subtype) {
    try {
      // Process message asynchronously
      await slackService.sendMessage(event.channel, 'Message Received');
      console.log('Automated reply sent for message:', event.text);
    } catch (error) {
      console.error('Error processing message:', error);
    }
  }
});

module.exports = router; 
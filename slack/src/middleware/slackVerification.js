const crypto = require('crypto');

const verifySlackRequest = (req, res, next) => {
  const slackSignature = req.headers['x-slack-signature'];
  const timestamp = req.headers['x-slack-request-timestamp'];
  const body = JSON.stringify(req.body);

  // Verify request is not older than 5 minutes
  const fiveMinutesAgo = Math.floor(Date.now() / 1000) - (60 * 5);
  if (timestamp < fiveMinutesAgo) {
    return res.status(400).send('Request is too old');
  }

  const signingSecret = process.env.SLACK_SIGNING_SECRET;
  const baseString = `v0:${timestamp}:${body}`;
  const signature = 'v0=' + crypto
    .createHmac('sha256', signingSecret)
    .update(baseString)
    .digest('hex');

  if (crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(slackSignature)
  )) {
    next();
  } else {
    res.status(401).send('Invalid signature');
  }
};

module.exports = { verifySlackRequest }; 
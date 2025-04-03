const { WebClient } = require('@slack/web-api');

class SlackService {
  constructor() {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN);
  }

  async sendMessage(channel, text) {
    try {
      await this.client.chat.postMessage({
        channel,
        text,
      });
      console.log('Message sent successfully');
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }
}

module.exports = new SlackService(); 
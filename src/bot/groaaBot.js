const { ActivityHandler, MessageFactory } = require('botbuilder');
const logger = require('../utils/logger');

const createGroaaBot = () => {
    const bot = new ActivityHandler();

    // Handler for messages
    bot.onMessage(async (context, next) => {
        try {
            // Verify the channel ID matches GROAA channel
            if (context.activity.channelData?.teamsChannelId !== process.env.TEAMS_CHANNEL_ID) {
                logger.warn('Message received from unauthorized channel:', {
                    channelId: context.activity.channelData?.teamsChannelId
                });
                return;
            }

            // Log the incoming message with detailed information
            logger.info('Message received in GROAA channel:', {
                text: context.activity.text,
                from: context.activity.from.name,
                channelId: context.activity.channelData?.teamsChannelId,
                timestamp: context.activity.timestamp,
                messageId: context.activity.id,
                conversationType: context.activity.conversation.conversationType
            });

            // Send the acknowledgment message
            const replyText = 'Message Received';
            await context.sendActivity(MessageFactory.text(replyText));

            await next();
        } catch (error) {
            logger.error('Error in message handler:', error);
            throw error;
        }
    });

    // Handler for members being added to the conversation
    bot.onMembersAdded(async (context, next) => {
        try {
            // Verify it's the GROAA channel
            if (context.activity.channelData?.teamsChannelId === process.env.TEAMS_CHANNEL_ID) {
                const membersAdded = context.activity.membersAdded;
                for (const member of membersAdded) {
                    if (member.id !== context.activity.recipient.id) {
                        await context.sendActivity('Welcome to the GROAA channel! I will acknowledge all messages with "Message Received".');
                    }
                }
            }
            await next();
        } catch (error) {
            logger.error('Error in members added handler:', error);
            throw error;
        }
    });

    return bot;
}

module.exports = createGroaaBot;
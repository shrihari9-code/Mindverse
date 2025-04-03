require('dotenv').config();
const express = require('express');
const { BotFrameworkAdapter, MemoryStorage, UserState, ConversationState } = require('botbuilder');
const logger = require('./utils/logger');
const createGroaaBot = require('./bot/groaaBot');

// Validate required environment variables
const requiredEnvVars = [
    'BOT_APP_ID',
    'BOT_APP_PASSWORD',
    'MICROSOFT_APP_TENANT_ID',
    'TEAMS_CHANNEL_ID'
];

requiredEnvVars.forEach(varName => {
    if (!process.env[varName]) {
        throw new Error(`Required environment variable ${varName} is not set`);
    }
});

// Create bot adapter with authentication
const adapter = new BotFrameworkAdapter({
    appId: process.env.BOT_APP_ID,
    appPassword: process.env.BOT_APP_PASSWORD,
    channelAuthTenant: process.env.MICROSOFT_APP_TENANT_ID,
    authConfig: {
        validateAuthority: true,
        allowedTenants: [process.env.MICROSOFT_APP_TENANT_ID]
    }
});

// Create storage and state
const memoryStorage = new MemoryStorage();
const conversationState = new ConversationState(memoryStorage);
const userState = new UserState(memoryStorage);

// Error handler with detailed logging
adapter.onTurnError = async (context, error) => {
    logger.error('Bot error:', {
        error: error.message,
        stack: error.stack,
        activity: context.activity
    });
    await context.sendActivity('An error occurred. Please try again later.');
    
    // Clear conversation state on error
    await conversationState.delete(context);
};

// Create bot instance
const bot = createGroaaBot();

// Create Express app with security middleware
const app = express();
const port = process.env.PORT || 3000;

// Security middleware
app.use(express.json());
app.use((req, res, next) => {
    // Require HTTPS in production
    if (process.env.NODE_ENV === 'production' && !req.secure) {
        return res.status(403).send('HTTPS required in production');
    }
    // Add security headers
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    next();
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy',
        botId: process.env.BOT_APP_ID,
        channelId: process.env.TEAMS_CHANNEL_ID
    });
});

// Teams webhook endpoint with authentication
app.post('/api/messages', async (req, res) => {
    adapter.processActivity(req, res, async (context) => {
        // Save state at the end of turn
        await bot.run(context);
        await conversationState.saveChanges(context, false);
        await userState.saveChanges(context, false);
    });
});

// Start server with logging
app.listen(port, () => {
    logger.info(`Server running on port ${port}`, {
        environment: process.env.NODE_ENV,
        botId: process.env.BOT_APP_ID,
        channelId: process.env.TEAMS_CHANNEL_ID
    });
}); 
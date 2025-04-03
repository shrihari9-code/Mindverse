# MindVerse MS Teams GROAA Integration

This project implements a Microsoft Teams bot that automatically acknowledges messages in the GROAA channel with "Message Received".

## Prerequisites

- Node.js (v14 or higher)
- Microsoft Azure Account
- Microsoft Teams Admin Access
- ngrok (for local development)

## Setup Instructions

### 1. Environment Configuration

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Fill in the environment variables in `.env` with your values:
   - `BOT_APP_ID`: Your Azure Bot registration App ID
   - `BOT_APP_PASSWORD`: Your Azure Bot registration password
   - `MICROSOFT_APP_TENANT_ID`: Your Microsoft Teams tenant ID
   - `TEAMS_CHANNEL_ID`: The ID of your GROAA channel
   - `WEBHOOK_ENDPOINT`: Your bot's webhook endpoint

### 2. Azure Bot Registration

1. Go to [Azure Portal](https://portal.azure.com)
2. Create a new Bot Registration
3. Note down the App ID and password
4. Configure the messaging endpoint (e.g., https://your-domain.com/api/messages)

### 3. Teams Channel Setup

1. Create a new Teams channel named "GROAA"
2. Add the bot to your Teams workspace
3. Configure the bot's permissions

### 4. Installation

```bash
# Install dependencies
npm install

# Start the server
npm start

# For development with hot reload
npm run dev
```

## Development

### Local Development with ngrok

1. Install ngrok
2. Run ngrok:
   ```bash
   ngrok http 3000
   ```
3. Update your bot's messaging endpoint in Azure with the ngrok URL

### Project Structure

```
├── src/
│   ├── bot/
│   │   └── groaaBot.js      # Bot implementation
│   ├── utils/
│   │   └── logger.js        # Logging utility
│   └── index.js             # Main application file
├── .env.example             # Environment variables template
├── package.json             # Project dependencies
└── README.md               # This file
```

### Logging

Logs are stored in the `logs/` directory:
- `combined.log`: All logs
- `error.log`: Error logs only

## Security

- All sensitive information is stored in environment variables
- HTTPS is required for production
- JWT token validation is implemented
- Bot Framework security best practices are followed

## Testing

```bash
npm test
``` 
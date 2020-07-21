require('dotenv').config();
const BotClient = require('./src/struct/BotClient');
const client = new BotClient();

client.start(process.env.TOKEN);

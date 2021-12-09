const TelegramBot = require('node-telegram-bot-api');

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN);

const sendMessage = (message) => {
  bot.sendMessage(TELEGRAM_CHAT_ID, message);
}

module.exports = {
  sendMessage: sendMessage,
};
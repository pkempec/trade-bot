const TelegramBot = require('node-telegram-bot-api');
const { getWallet } = require('./wallet');

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const sendMessage = (message) => {
  bot.sendMessage(TELEGRAM_CHAT_ID, message);
}

const initCommunication = () => {
  bot.onText(/\/status/, ()=> {
    const wallet = getWallet();
    const estCrypto = (wallet.crypto.value + wallet.stable.estimateCrypto).toFixed(2);
    const estStable = (wallet.crypto.estimateStable + wallet.stable.value).toFixed(2);
    const message = wallet.crypto? 'Crypto: ' + wallet.crypto.value.toFixed(2) + '\nStable: ' + wallet.stable.value.toFixed(2) +  '\nEst. crypto: ' + estCrypto + '\nEst. stable: ' + estStable : wallet;
    bot.sendMessage(TELEGRAM_CHAT_ID, message);
  });
}

module.exports = {
  sendMessage: sendMessage,
  initCommunication: initCommunication,
};
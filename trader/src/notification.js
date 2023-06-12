require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const { getState } = require('./wallet');
const { setConfigState, getConfig } = require('./config');

const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
const bot = new TelegramBot(TELEGRAM_BOT_TOKEN, { polling: true });

const sendMessage = (message) => {
  bot.sendMessage(TELEGRAM_CHAT_ID, message);
}

const initCommunication = () => {
  bot.onText(/\/status/, ()=> {
    const state = getState();
    const wallet = state.wallet;
    let message = 'Loading check later.'
    if (wallet) {
      const estCrypto = (wallet.crypto.value + wallet.stable.estimateCrypto).toFixed(2);
      const estStable = (wallet.crypto.estimateStable + wallet.stable.value).toFixed(2);
      message =
      'Crypto: ' + wallet.crypto.value.toFixed(2) 
      + '\nStable: ' + wallet.stable.value.toFixed(2) 
      + '\nEst. crypto: ' + estCrypto 
      + '\nEst. stable: ' + estStable
      + '\n' + state.indicator.type + ": " + state.indicator.value
      + '\nState: ' + getConfig().state;
    }
    bot.sendMessage(TELEGRAM_CHAT_ID, message);
  });
  bot.onText(/\/pause/, () => {
    setConfigState('paused');
    bot.sendMessage(TELEGRAM_CHAT_ID, 'Setting paused state.');
  });
  bot.onText(/\/trade/, () => {
    setConfigState('trade');
    bot.sendMessage(TELEGRAM_CHAT_ID, 'Setting trade state.');
  });
  bot.onText(/\/state/, () => {
    bot.sendMessage(TELEGRAM_CHAT_ID, 'Current state: ' + getConfig().state);
  });
  bot.onText(/\/help/, () => {
    bot.sendMessage(TELEGRAM_CHAT_ID, 'Commands: /pause, /trade, /state, /status');
  });
}

export {
  sendMessage,
  initCommunication,
};
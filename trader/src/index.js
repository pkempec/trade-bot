require('dotenv').config();
var moment = require('moment');
const { getStrategy } = require('./strategies/rsi-v4');
const { trade, getWallet } = require('./binance');
const { sendMessage, initCommunication } = require('./notification');
const { setState } = require('./wallet');
const { logger, loadLastTrade } = require('./logger');
const { store } = require('./storage');
const { calculate } = require('./indicators/rsi-indicator-ewm');

var cron = require('node-cron');

const CRYPTO = process.env.CRYPTO;
const STABLE = process.env.STABLE;

const BINANCE_CRYPTO_SYMBOL = CRYPTO + STABLE;

initCommunication();
let lastTrade = loadLastTrade();

cron.schedule('* * * * *', async () => {
    const time = moment().format('YYYY.MM.DD HH:mm:ss');

    const wallet = await getWallet(CRYPTO, STABLE);
    const rsi = await calculate(wallet.crypto.askPrice);
    setState(wallet, rsi);
    const strategy = getStrategy(rsi, wallet, lastTrade);
    trade(strategy, BINANCE_CRYPTO_SYMBOL);

    const indicator = {
        type: 'rsi/1h-ewm',
        value: (rsi !== undefined ? rsi.toFixed(2) : rsi)
    }

    const data = {time, indicator, wallet, strategy}
    // logger.info('Stats', data);
    await store(data);

    if (strategy.action != 'WAIT') {
        logger.log('trade', {time, indicator, wallet, strategy});
        lastTrade = {time, indicator, wallet, strategy};
        const estCrypto = (wallet.crypto.value + wallet.stable.estimateCrypto).toFixed(2);
        const estStable = (wallet.crypto.estimateStable + wallet.stable.value).toFixed(2);
        sendMessage(strategy.action + '\nBid: ' + wallet.crypto.bidPrice.toFixed(2) + '\nAmount: '+ strategy.amount.toFixed(2) + '\nEst. crypto: ' + estCrypto + '\nEst. stable: ' + estStable);
    }
});
require('dotenv').config();
var moment = require('moment');
const { analyze } = require('./analyzer');
const { getStrategy } = require('./strategies/rsi-v4');
const { trade, getWallet } = require('./binance');
const { sendMessage, initCommunication } = require('./notification');
const { setState } = require('./wallet');
const { logger, loadLastTrade } = require('./logger');
const { store } = require('./storage');
const { calculate } = require('./rsi-indicator');

var cron = require('node-cron');

const CRYPTO = process.env.CRYPTO;
const STABLE = process.env.STABLE;
const INDICATOR_TYPE = process.env.INDICATOR;
const INTERVAL = process.env.INTERVAL;

const TAAPI_CRYPTO = CRYPTO + '/' + STABLE;
const BINANCE_CRYPTO_SYMBOL = CRYPTO + STABLE;

initCommunication();
let lastTrade = loadLastTrade();

cron.schedule('* * * * *', async () => {
    const time = moment().format('YYYY.MM.DD HH:mm:ss');

    const indicatorValue = await analyze(INDICATOR_TYPE, TAAPI_CRYPTO, INTERVAL);
    const wallet = await getWallet(CRYPTO, STABLE);
    const rsiCalc = await calculate(wallet.crypto.askPrice);
    setState(wallet, indicatorValue);
    const strategy = getStrategy(indicatorValue, wallet, lastTrade);
    trade(strategy, BINANCE_CRYPTO_SYMBOL);

    const indicator = {
        type: INDICATOR_TYPE + '/' + INTERVAL,
        value: (indicatorValue !== undefined ? indicatorValue.toFixed(2) : indicatorValue),
        custom: (rsiCalc !== undefined ? rsiCalc.toFixed(2) : rsiCalc)
    }

    const data = {time, indicator, wallet, strategy}
    logger.info('Stats', data);
    await store(data);

    if (strategy.action != 'WAIT') {
        logger.log('trade', {time, indicator, wallet, strategy});
        lastTrade = {time, indicator, wallet, strategy};
        const estCrypto = (wallet.crypto.value + wallet.stable.estimateCrypto).toFixed(2);
        const estStable = (wallet.crypto.estimateStable + wallet.stable.value).toFixed(2);
        sendMessage(strategy.action + '\nBid: ' + wallet.crypto.bidPrice.toFixed(2) + '\nAmount: '+ strategy.amount.toFixed(2) + '\nEst. crypto: ' + estCrypto + '\nEst. stable: ' + estStable);
    }
});
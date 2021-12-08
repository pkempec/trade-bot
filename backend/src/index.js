require('dotenv').config();
var moment = require('moment');
const { analyze } = require('./analyzer');
const { getStrategy } = require('./strategy');
const { trade, getWallet } = require('./binance');
const { sendMessage } = require('./notification');
const { logger } = require('./logger');

var cron = require('node-cron');

const CRYPTO = process.env.CRYPTO;
const STABLE = process.env.STABLE;
const INDICATOR_TYPE = process.env.INDICATOR;
const INTERVAL = process.env.INTERVAL;

const TAAPI_CRYPTO = CRYPTO + '/' + STABLE;
const BINANCE_CRYPTO_SYMBOL = CRYPTO + STABLE;

cron.schedule('* * * * *', async () => {
    const time = moment().format('YYYY.MM.DD HH:mm:ss');

    const indicatorValue = await analyze(INDICATOR_TYPE, TAAPI_CRYPTO, INTERVAL);
    const wallet = await getWallet(CRYPTO, STABLE);
    const strategy = getStrategy(indicatorValue, wallet);
    trade(strategy, BINANCE_CRYPTO_SYMBOL);

    const indicator = {
        type: INDICATOR_TYPE + '/' + INTERVAL,
        value: (indicatorValue !== undefined ? indicatorValue.toFixed(2) : indicatorValue)
    }

    logger.info('Stats', {time, indicator, wallet, strategy});

    if (strategy.action != 'WAIT') {
        sendMessage(strategy.action + ' Bid: ' + wallet.crypto.bidPrice.toFixed(2) + ' Amount: '+ strategy.amount.toFixed(2));
    }
});
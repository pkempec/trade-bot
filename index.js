require('dotenv').config();
var moment = require('moment');
const { analyze } = require('./analyzer');
const { getStrategy } = require('./strategy');
const { trade, getWallet } = require('./binance');

var cron = require('node-cron');

const CRYPTO = process.env.CRYPTO;
const STABLE = process.env.STABLE;
const INDICATOR_TYPE = process.env.INDICATOR;
const INTERVAL = process.env.INTERVAL;

const TAAPI_CRYPTO = CRYPTO + '/' + STABLE;
const BINANCE_CRYPTO_SYMBOL = CRYPTO + STABLE;

cron.schedule('* * * * *', async () => {

    console.log('-----------------------------------------');
    console.log('TIME:              ' + moment().format('YYYY.MM.DD HH:mm:ss'));
    const indicator = await analyze(INDICATOR_TYPE, TAAPI_CRYPTO, INTERVAL);
    console.log('Current Indicator: ' + indicator);

    const wallet = await getWallet(CRYPTO, STABLE);
    console.log('Wallet:            ' + JSON.stringify(wallet));

    const strategy = getStrategy(indicator, wallet);
    console.log('Strategy:          ' + JSON.stringify(strategy));

    trade(strategy, BINANCE_CRYPTO_SYMBOL);
    console.log('-----------------------------------------');

});
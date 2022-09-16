require('dotenv').config();
import moment from 'moment';
import { getStrategy } from './strategies/rsi-v4';
import { trade, getWallet } from './binance';
import { sendMessage, initCommunication } from './notification';
import { setState } from './wallet';
import { logger } from './logger';
import { store } from './storage';
import { calculate } from './indicators/rsi-indicator-ewm';
import * as cron from 'node-cron';

const CRYPTO = process.env.CRYPTO;
const STABLE = process.env.STABLE;

const BINANCE_CRYPTO_SYMBOL = CRYPTO + STABLE;

initCommunication();

cron.schedule('* * * * *', async () => {
    const time = moment().format('YYYY.MM.DD HH:mm:ss');

    const wallet = await getWallet(CRYPTO, STABLE);
    if (wallet) {
        const rsi = await calculate(wallet.crypto.askPrice);
        const strategy = getStrategy(rsi, wallet);
        trade(strategy, BINANCE_CRYPTO_SYMBOL);

        const indicator = {
            type: 'rsi/1h-ewm',
            value: rsi?.toFixed(2)
        }

        const data = { time, indicator, wallet, strategy }
        // logger.info('Stats', data);
        await store(data);
        setState(wallet, indicator);

        if (strategy.action != 'WAIT') {
            logger.log('trade', { time, indicator, wallet, strategy });
            const estCrypto = (wallet.crypto.value + wallet.stable.estimateCrypto).toFixed(2);
            const estStable = (wallet.crypto.estimateStable + wallet.stable.value).toFixed(2);
            sendMessage(strategy.action + '\nBid: ' + wallet.crypto.bidPrice.toFixed(2) + '\nAmount: ' + strategy.amount.toFixed(2) + '\nEst. crypto: ' + estCrypto + '\nEst. stable: ' + estStable);
        }
    }
});
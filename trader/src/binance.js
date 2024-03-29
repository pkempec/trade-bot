require('dotenv').config();
import moment from 'moment';
import crypto from 'crypto';
import axios from 'axios';
import { logger } from './logger';

const BASE_URL = 'https://api.binance.com';
const ENDPOINT_ORDER = '/api/v3/order';
const ENDPOINT_BALANCE = '/api/v3/account';
const ENDPOINT_PRICE = '/api/v3/ticker/24hr';

const API_KEY = process.env.BINANCE_API_KEY;
const SECREY_KEY = process.env.BINANCE_SECREY_KEY;

const trade = async (strategy, tradeSymbol) => {

    if (strategy.action === 'BUY' || strategy.action === 'SELL') {
        const query = 'symbol=' + tradeSymbol + '' + '&side=' + strategy.action + '&quoteOrderQty=' + strategy.amount + '&type=MARKET' + '&timestamp=' + Date.now();
        const signature =
            crypto
                .createHmac('sha256', SECREY_KEY)
                .update(query)
                .digest('hex');

        const url = BASE_URL + ENDPOINT_ORDER + '?' + query + '&signature=' + signature;
        try {
            await axios({ method: 'post', url: url, headers: { 'X-MBX-APIKEY': API_KEY } });
        } catch (error) {
            const time = moment().format('YYYY.MM.DD HH:mm:ss');
            logger.error('Binance', { time, error, reason: error.response.data.msg});
        }
    }
}

const getWallet = async (cryptoCoin, stableCoin) => {
    const price = await currentPrice(cryptoCoin, stableCoin);

    const query = 'timestamp=' + Date.now();
    const signature =
        crypto
            .createHmac('sha256', SECREY_KEY)
            .update(query)
            .digest('hex');

    const url = BASE_URL + ENDPOINT_BALANCE + '?' + query + '&signature=' + signature;
    let result =
    {
        crypto: {
            symbol: cryptoCoin,
            value: 0,
            estimateStable: 0,
            askPrice: 0,
            bidPrice: 0,
        },
        stable: {
            symbol: stableCoin,
            value: 0,
            estimateCrypto: 0,
        },
        fee: {
            symbol: 'BNB',
            value: 0,
        },
        total: {
            estimate: 0
        }
    };
    try {
        const response = await axios({ method: 'get', url: url, headers: { 'X-MBX-APIKEY': API_KEY } });
        for (let coin of response.data.balances) {
            if (coin.asset === cryptoCoin) {
                result.crypto.value = Number(Number(coin.free).toFixed(6));
                result.crypto.askPrice = Number(Number(price.askPrice).toFixed(2));
                result.crypto.bidPrice = Number(Number(price.bidPrice).toFixed(2));
                result.crypto.estimateStable = Number((Number(coin.free) * Number(price.bidPrice)).toFixed(2));
            }
            if (coin.asset === stableCoin) {
                result.stable.value = Number(Number(coin.free).toFixed(2));
                result.stable.estimateCrypto = Number((Number(coin.free) / Number(price.askPrice)).toFixed(2));
            }
            if (coin.asset === 'BNB') {
                result.fee.value = Number(Number(coin.free).toFixed(6));
            }
        }
        result.total.estimate = Number((result.stable.value + result.crypto.estimateStable).toFixed(2));
        return result;
    } catch (error) {
        const time = moment().format('YYYY.MM.DD HH:mm:ss');
        logger.error('Binance', { time, error});
    }
}

const currentPrice = async (cryptoCoin, stableCoin) => {
    const query = 'symbol=' + cryptoCoin + stableCoin;
    const url = BASE_URL + ENDPOINT_PRICE + '?' + query;

    try {
        const response = await axios({ method: 'get', url: url });

        return {
            askPrice: response?.data?.askPrice,
            bidPrice: response?.data?.bidPrice
        };
    } catch (error) {
        const time = moment().format('YYYY.MM.DD HH:mm:ss');
        logger.error('Binance', { time, error, reason: error.response.data.msg, response});
    }

}

export {
    trade,
    getWallet,
};
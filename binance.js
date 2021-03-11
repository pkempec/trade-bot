const crypto = require('crypto');
const axios = require('axios');

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
        } catch (err) {
            console.log(err);
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
        for (coin of response.data.balances) {
            if (coin.asset === cryptoCoin) {
                result.crypto.value = Number(coin.free);
                result.crypto.estimateStable = Number(coin.free) * Number(price.bidPrice);
            }
            if (coin.asset === stableCoin) {
                result.stable.value = Number(coin.free);
                result.stable.estimateCrypto = Number(coin.free) / Number(price.askPrice);
            }
            if (coin.asset === 'BNB') {
                result.fee.value = Number(coin.free);
            }
        }
        result.total.estimate = result.stable.value + result.crypto.estimateStable;
        return result;
    } catch (err) {
        console.log(err);
    }
}

const currentPrice = async (cryptoCoin, stableCoin) => {
    const query = 'symbol=' + cryptoCoin + stableCoin;
    const url = BASE_URL + ENDPOINT_PRICE + '?' + query;

    try {
        const response = await axios({ method: 'get', url: url });

        return {
            askPrice: response.data.askPrice,
            bidPrice: response.data.bidPrice
        };
    } catch (err) {
        console.log(err);
    }

}

module.exports = {
    trade: trade,
    getWallet: getWallet,
};
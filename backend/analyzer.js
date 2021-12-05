const taapi = require("taapi");

const apiKey = process.env.TAAPI_API_KEY;
const client = taapi.client(apiKey);

const EXCHANGE = 'binance';

const analyze = async (type, symbol, interval) => {
    try {
        const result = await client.getIndicator(type, EXCHANGE, symbol, interval);
        return Number(result.value);
    } catch (err) {
        console.log('Error:' + err);
    }
}

module.exports = {
    analyze: analyze,
};
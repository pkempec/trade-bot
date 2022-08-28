const { logger } = require('../logger');
import { loadClosePrices } from "../storage";

const calculate = async (currentPrice) => {
    try {
        const records = await loadClosePrices();
        let last15ClosePrice = records.reverse().map(record => record.w_crypto_ask);
        last15ClosePrice.push(currentPrice);

        if (last15ClosePrice.length < 15) {
            logger.error('RSI', { error: 'Not enough data to calculate RSI' });
            return -1;
        }

        const change = [];
        for (let i = 0; i < last15ClosePrice.length - 1; i++) {
            const diff = last15ClosePrice[i + 1] - last15ClosePrice[i];
            change.push(diff);
        }

        const up = Math.max(...change);
        const down = -Math.min(...change);

        const rsi = down == 0 ? 100 : up == 0 ? 0 : 100 - (100 / (1 + up / down));
        return rsi;
    } catch (error) {
        logger.error('Analyzer', { error });
        return -1;
    }
}

module.exports = {
    calculate: calculate,
};
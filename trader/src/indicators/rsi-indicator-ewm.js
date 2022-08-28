const { logger } = require('../logger');
import { loadClosePrices } from "../storage";

const calculate = async (currentPrice) => {
    try {
        const records = await loadClosePrices();
        let closePrices = records.reverse().map(record => record.w_crypto_ask);
        closePrices.push(currentPrice);

        if (closePrices.length < 15) {
            logger.error('RSI', { error: 'Not enough data to calculate RSI' });
            return -1;
        }

        let last14UpwardMovement = [];
        let last14DownwardMovement = [];

        for (let i = 0; i < closePrices.length - 1; i++) {
            const diff = closePrices[i + 1] - closePrices[i];
            if (diff > 0) {
                last14UpwardMovement.push(diff);
                last14DownwardMovement.push(0);
            } else {
                last14UpwardMovement.push(0);
                last14DownwardMovement.push(Math.abs(diff));
            }
        }

        let avgUp = getAverage(last14UpwardMovement.splice(0, 14));
        let avgDown = getAverage(last14DownwardMovement.splice(0, 14));

        for (let i = 0; i < last14UpwardMovement.length; i++) {
            avgUp = getMovingAvg(avgUp, last14UpwardMovement[i]);
            avgDown = getMovingAvg(avgDown, last14DownwardMovement[i]);
        }

        const rsi = 100 - 100 / (1 + avgUp / avgDown);
        return rsi;
    } catch (error) {
        logger.error('Analyzer', { error });
        return -1;
    }
}

const getAverage = (prices) => {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
}

const getMovingAvg = (prevAvg, price) => {
    return (prevAvg * 13 + price) / 14;
}

module.exports = {
    calculate: calculate,
};
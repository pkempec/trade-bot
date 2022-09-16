import { logger } from '../logger';
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

        let last14UpwardMovement = [];
        let last14DownwardMovement = [];

        for (let i = 0; i < last15ClosePrice.length - 1; i++) {
            const diff = last15ClosePrice[i + 1] - last15ClosePrice[i];
            if (diff > 0) {
                last14UpwardMovement.push(diff);
                last14DownwardMovement.push(0);
            } else {
                last14UpwardMovement.push(0);
                last14DownwardMovement.push(Math.abs(diff));
            }
        }

        const avrgUp = getAverage(last14UpwardMovement);
        const avrgDown = getAverage(last14DownwardMovement);

        const rsi = 100 - (100 / (1 + avrgUp / avrgDown));
        return rsi;
    } catch (error) {
        logger.error('Analyzer', { error });
        return -1;
    }
}

const getAverage = (prices) => {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
}

export {
    calculate,
};
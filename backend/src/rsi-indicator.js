const { logger } = require('./logger');
import moment from 'moment';
import { loadLast15Hours } from "./storage";

let last15ClosePrice = [];

const calculate = async (currentPrice) => {
    try {
        if(last15ClosePrice.length < 14) {
            last15ClosePrice = await loadClosePrices();
        }
        if(last15ClosePrice.length < 14) {
            logger.error('RSI', { error: 'Not enough data to calculate RSI'});
            return -1;
        }

        const time = moment().format('mm');
        if(time === '00') {
            last15ClosePrice.shift();
        } else {
            last15ClosePrice.pop();
        }
        last15ClosePrice.push(currentPrice);

        const last14UpwardMovement = [];
        const last14DownwardMovement = [];

        for (let i = 0; i < last15ClosePrice.length- 1; i++) {
            const diff = last15ClosePrice[i + 1] - last15ClosePrice[i];
            if (diff > 0) {
                last14UpwardMovement.push(diff);
                last14DownwardMovement.push(0);
            } else {
                last14DownwardMovement.push(Math.abs(diff));
                last14UpwardMovement.push(0);
            }
        }
        const avrgUp = getAverage(last14UpwardMovement);
        const avrgDown = getAverage(last14DownwardMovement);

        const rsi = 100 - (100 / ( 1 + avrgUp / avrgDown ));
        return rsi;
    } catch (error) {
        logger.error('Analyzer', { error });
        return -1;
    }
}

const getAverage = (prices) => {
    return prices.reduce((a, b) => a + b, 0) / prices.length;
}

const loadClosePrices = async () => {
    const records = await loadLast15Hours();
    return records.reverse().map(record => record.w_crypto_ask);
}

module.exports = {
    calculate: calculate,
};
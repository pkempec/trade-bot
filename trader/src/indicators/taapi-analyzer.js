import moment from 'moment';
import taapi from "taapi";
import { logger } from './logger';

const apiKey = process.env.TAAPI_API_KEY;
const client = taapi.client(apiKey);

const EXCHANGE = 'binance';

const analyze = async (type, symbol, interval) => {
    try {
        const result = await client.getIndicator(type, EXCHANGE, symbol, interval);
        return Number(result.value);
    } catch (error) {
        const time = moment().format('YYYY.MM.DD HH:mm:ss');
        logger.error('Analyzer', { time, error });
    }
}

export {
    analyze,
};
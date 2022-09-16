const winston = require('winston');
require('winston-daily-rotate-file');
const fs = require('fs');
const path = require('path');

const { format } = winston;
const { combine, printf, json } = format;
const LOG_PATH = '.';
const LOG_TRADES = 'trades.log';

const customFormat = printf((msg) => {
  return `${JSON.stringify(msg)},`;
});

const logger = winston.createLogger({
  levels: {
    trade: 'trade',
    info: 3,
    warn: 2,
    error: 1
  },
  format: combine(
    json(),
    customFormat
  ),
  exitOnError: false,
  transports: [
    //
    // - Write all logs with level `error` and below to `error.log`
    // - Write all logs with level `info` and below to `combined.log`
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'warning.log', level: 'warn' }),
    new winston.transports.DailyRotateFile({ filename: 'trade-%DATE%.log', level: 'info', dirname: LOG_PATH, datePattern:'YYYY-MM-DD' }),
    new winston.transports.File({ filename: LOG_TRADES, level: 'trade', dirname: LOG_PATH }),
  ],
});

//
// If we're not in production then log to the `console` with the format:
// `${info.level}: ${info.message} JSON.stringify({ ...rest }) `
//
if (process.env.NODE_ENV !== 'production') {
  const format = winston.format.combine(
    winston.format.colorize(),
    winston.format.simple(),
  );
  logger.add(new winston.transports.Console({
    format,
  }));
}

export {
  logger,
};
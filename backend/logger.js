const winston = require('winston');
const { format } = winston;
const { combine, printf, json } = format;

const customFormat = printf((msg) => {
  return `${JSON.stringify(msg)},`;
});

const logger = winston.createLogger({
  level: 'info',
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
    new winston.transports.File({ filename: 'trade.log', dirname: '../frontend/src/' }),
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

module.exports = {
  logger: logger,
};
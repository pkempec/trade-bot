require('dotenv').config();
const { logger } = require('./logger');
import moment from 'moment';
import { Sequelize, DataTypes } from 'sequelize';

const DB_USER = process.env.DB_USER;
const DB_PASS = process.env.DB_PASS;
const DB_HOST = process.env.DB_HOST;
const DB_PORT = process.env.DB_PORT;
const DB_NAME = process.env.DB_NAME;

const sequelize = new Sequelize(
  'postgres://' + DB_USER + ':' + DB_PASS + '@' + DB_HOST + ':' + DB_PORT + '/' + DB_NAME,
  { logging: false }
);

const Record = sequelize.define('strategy_action', {
  indicator_type: DataTypes.STRING,
  indicator_value: DataTypes.NUMBER,
  w_crypto_symbol: DataTypes.STRING,
  w_crypto_value: DataTypes.NUMBER,
  w_crypto_estimate_stable: DataTypes.NUMBER,
  w_crypto_ask: DataTypes.NUMBER,
  w_crypto_bid: DataTypes.NUMBER,
  w_stable_symbol: DataTypes.STRING,
  w_stable_value: DataTypes.NUMBER,
  w_stable_estimate_crypto: DataTypes.NUMBER,
  fee_symbol: DataTypes.STRING,
  fee_value: DataTypes.NUMBER,
  total_estimate: DataTypes.NUMBER,
  strategy_action: DataTypes.STRING,
  strategy_amount: DataTypes.NUMBER,
  strategy_level: DataTypes.STRING,
  created_on: DataTypes.DATE,
},
  {
    tableName: "strategy_action",
    timestamps: false,
  });

const store = async (data) => {
  try {
    await Record.create({
      indicator_type: data.indicator.type,
      indicator_value: data.indicator.value ? data.indicator.value : -1,
      w_crypto_symbol: data.wallet.crypto.symbol,
      w_crypto_value: data.wallet.crypto.value,
      w_crypto_estimate_stable: data.wallet.crypto.estimateStable,
      w_crypto_ask: data.wallet.crypto.askPrice,
      w_crypto_bid: data.wallet.crypto.askPrice,
      w_stable_symbol: data.wallet.stable.symbol,
      w_stable_value: data.wallet.stable.value,
      w_stable_estimate_crypto: data.wallet.stable.estimateCrypto,
      fee_symbol: data.wallet.fee.symbol,
      fee_value: data.wallet.fee.value,
      total_estimate: data.wallet.total.estimate,
      strategy_action: data.strategy.action,
      strategy_amount: data.strategy.amount,
      strategy_level: data.strategy.level,
      created_on: moment(data.time, 'YYYY.MM.DD HH:mm:ss').toDate(),
    });
  } catch (error) {
    logger.error('Storage', { error, reason: 'Unable to store data.', data: data});
  }
}

module.exports = {
  store: store,
};
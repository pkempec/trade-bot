require('dotenv').config();
const { logger } = require('./logger');
import moment from 'moment';
import { sequelize, Record } from './data-access/sequelize';

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
      indicator_value_custom: data.indicator.custom,
    });
  } catch (error) {
    logger.error('Storage', { error, reason: 'Unable to store data.', data: data});
  }
}

const loadClosePrices = async () => {
  return await sequelize.query('SELECT * FROM strategy_action WHERE EXTRACT (MINUTE FROM created_on) = 0 ORDER BY created_on DESC LIMIT 14', {
    model: Record,
    mapToModel: true
  });
}

module.exports = {
  store: store,
  loadClosePrices: loadClosePrices,
};
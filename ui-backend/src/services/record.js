import Sequelize from 'sequelize';
import { Record, sequelize } from '../data-access/sequelize';
import moment from 'moment';

const { Op, col, fn, Model } = Sequelize;


const findFirst = async () => {
  return await findOneEdge(true);
}

const findLast = async () => {
  return await findOneEdge(false);
}

const findOneEdge = async (first) => {
  const ordering = first ? 'ASC' : 'DESC';
  try {
    const record = await Record.findOne({
      limit: 1,
      order: [['created_on', ordering]]
    });
    return mapRecord(record);
  } catch (e) {
    console.log("ERROR - unable to find edge record.");
    console.log(e);
  }
  return null;
}

const findTrades = async () => {
  try {
    const records = await Record.findAll({
      where: {
        [Op.or]: [
          { strategy_action: 'SELL' },
          { strategy_action: 'BUY' }
        ]
      },
      order: [['created_on', 'ASC']]
    });
    return records.map(record => mapRecord(record));
  } catch (e) {
    console.log("ERROR - unable to find trade record.");
    console.log(e);
  }
  return null;
}

const findDaily = async () => {
  try {
    const records = await sequelize.query('SELECT * FROM "strategy_action" WHERE EXTRACT(hour FROM created_on) = 0 AND EXTRACT(minute FROM created_on) = 0 ORDER BY created_on ASC', {
      model: Record,
      mapToModel: true
    });
    return records.map(record => mapRecord(record));
  } catch (e) {
    console.log("ERROR - unable to find findDaily.");
    console.log(e);
  }
  return null;
}

const find24hour = async (date) => {
  try {
    const mDate = moment(date, "YYYY-MM-DD");
    const from = Date.UTC(
      mDate.year(),
      mDate.month(),
      mDate.date()
    )

    const to = Date.UTC(
      mDate.year(),
      mDate.month(),
      mDate.date(),
      23,
      59,
      59,
    )

    const records = await Record.findAll({
      where: {
        created_on: {
          [Op.and]: [
            { [Op.gte]: from },
            { [Op.lte]: to }
          ]
        },
      },
      order: [['created_on', 'ASC']]
    });
    return records.map(record => mapRecord(record));
  } catch (e) {
    console.log("ERROR - unable to find find24hour.");
    console.log(e);
  }
  return null;
}

const findDates = async () => {
  try {
    const records = await Record.findAll({
      attributes: [[fn('date_trunc', 'day', col('created_on')), 'dates']],
      group: ['dates'],
      order: [['dates', 'DESC']],
      limit: 10,
    });
    return records.map(r => moment(r.get("dates")).format("YYYY-MM-DD"));
  } catch (e) {
    console.log("ERROR - unable to find dates.");
    console.log(e);
  }
  return null;
}

const mapRecord = (record) => {
  return {
    "time": record.created_on,
    "indicator": {
      "type": record.indicator_type,
      "value": record.indicator_value
    },
    "wallet": {
      "crypto": {
        "symbol": record.w_crypto_symbol,
        "value": record.w_crypto_value,
        "estimateStable": record.w_crypto_estimate_stable,
        "askPrice": record.w_crypto_ask,
        "bidPrice": record.w_crypto_bid
      },
      "stable": {
        "symbol": record.w_stable_symbol,
        "value": record.w_stable_value,
        "estimateCrypto": record.w_stable_estimate_crypto
      },
      "fee": {
        "symbol": record.fee_symbol,
        "value": record.fee_value
      },
      "total": {
        "estimate": record.total_estimate
      }
    },
    "strategy": {
      "action": record.strategy_action,
      "amount": record.strategy_amount,
    }
  }
}

export {
  findFirst,
  findLast,
  findTrades,
  findDaily,
  find24hour,
  findDates,
}
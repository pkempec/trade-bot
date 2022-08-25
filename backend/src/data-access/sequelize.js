require('dotenv').config();
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
  indicator_value_custom: DataTypes.NUMBER,
},
  {
    tableName: "strategy_action",
    timestamps: false,
  });

module.exports = {
  sequelize,
  Record,
};
import { Sequelize } from 'sequelize';
import RecordModel from '../models/record';

const {
  DB_HOST, DB_NAME, DB_USER, DB_PASS, DB_TIMEZONE
} = process.env;
const DB_PORT = process.env.DB_PORT || 5432;

if (!DB_HOST || !DB_NAME || !DB_USER || !DB_PASS) {
  // logger.error('PLEASE PROVIDE DATABASE CONFIGURATION', { method: 'sequelize', error: 'Missing environmnet variables' });
  process.exit(1);
}

const sequelize = new Sequelize(
  DB_NAME,
  DB_USER,
  DB_PASS,
  {
    host: DB_HOST,
    port: DB_PORT,
    dialect: 'postgres',
    logging: true,
    timezone: DB_TIMEZONE,
  },
);

Sequelize.postgres.DECIMAL.parse = function (value) { return parseFloat(value); };

const Record = RecordModel.init(sequelize);

export {
  sequelize,
  Record
};

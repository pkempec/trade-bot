import { DataTypes, Model } from 'sequelize';

class Record extends Model {
  static init(sequelize) {
    const model = super.init({
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
      },
      indicator_type: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      indicator_value: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_crypto_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      w_crypto_value: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_crypto_estimate_stable: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_crypto_ask: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_crypto_bid: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_stable_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      w_stable_value: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      w_stable_estimate_crypto: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      fee_symbol: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      fee_value: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      total_estimate: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      strategy_action: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      strategy_amount: {
        type: DataTypes.NUMERIC,
        allowNull: false,
      },
      strategy_level: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      created_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      indicator_value_custom: {
        type: DataTypes.NUMERIC,
        allowNull: true,
      },
    }, {
      sequelize,
      tableName: "strategy_action",
      timestamps: false,
      
    });
    return model;
  }
}

export default Record;
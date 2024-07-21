'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_food_criteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_food_criteria.belongsTo(models.food, {
        foreignKey: 'food_id',
        as: 'food_criteria'
      });

      trx_food_criteria.belongsTo(models.criteria, {
        foreignKey: 'criteria_id',
        as: 'criteriaview'
      })
    }
  }

  trx_food_criteria.init({
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'food', 
        key: 'id'
      }
    },
    criteria_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'criteria',
        key: 'id'
      }
    },
    calculation: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    // calculation_tren: {
    //   type: DataTypes.DECIMAL,
    //   allowNull: false
    // },
    // calculation_bobot: {
    //   type: DataTypes.DECIMAL,
    //   allowNull: false
    // },
    // rank: {
    //   type: DataTypes.INTEGER,
    //   allowNull: false
    // },
  }, {
    sequelize,
    modelName: 'trx_food_criteria',
  });
  return trx_food_criteria;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class food extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      food.hasMany(models.trx_food_criteria, {
        foreignKey: 'food_id',
        as: 'food_criteria'
      })

      food.hasMany(models.trx_calculations, {
        foreignKey: 'food_id',
        as: 'user_calculation'
      })
    }
  }
  food.init({
    food_code: {
      type : DataTypes.STRING,
      allowNull : false
    },
    food_name: {
      type : DataTypes.STRING,
      allowNull : false
    },
    food_desc: {
      type : DataTypes.STRING,
      allowNull : false
    },
  }, {
    sequelize,
    modelName: 'food',
  });
  return food;
};
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class trx_calculation extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      trx_calculation.belongsTo(models.food, {
        foreignKey: 'food_id',
        as: 'user_calculation'
      });

      trx_calculation.belongsTo(models.activities, {
        foreignKey: 'activity_id',
        as: 'calculation_act'
      })

      trx_calculation.belongsTo(models.users, {
        foreignKey: 'user_id',
        as: 'calculation_user'
      })

      trx_calculation.hasMany(models.user_calculation_v, {
        foreignKey: 'calculation_id',
        as: 'calculation_user_v'
      })
      
    }
  }
  
  trx_calculation.init({
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    food_id: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    activity_id: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    weight: { 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    height:{ 
      type: DataTypes.INTEGER,
      allowNull: false
    },
    gender: {
      type: DataTypes.STRING,
      allowNull: false
    },
    age: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    calories: {
      type: DataTypes.STRING,
      allowNull: false
    },
    calories_score: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
  }, {
    sequelize,
    modelName: 'trx_calculations',
  });
  return trx_calculation;
};
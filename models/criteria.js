'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class criteria extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      criteria.hasMany(models.trx_food_criteria, {
        foreignKey: 'criteria_id',
        as: 'criteriaview'
      })
    }
  }
  criteria.init({
    criteria_code: {
      type: DataTypes.STRING,
      allowNull: false
    },
    criteria_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bobot: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
    tren: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'criteria',
  });
  return criteria;
};
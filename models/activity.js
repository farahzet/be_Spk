'use strict';
const {
  Model
} = require('sequelize');
const { hasMany } = require('sequelize/lib/associations/mixin');
module.exports = (sequelize, DataTypes) => {
  class activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      activity.hasMany(models.trx_calculations, {
        foreignKey: 'calculation_id',
        as: 'calculation_act'
      })
    }
  }
  activity.init({
    activity_name: {
      type: DataTypes.STRING,
      allowNull: false
    },
    activity_level: {
      type: DataTypes.STRING,
      allowNull: false
    },
    bobot: {
      type: DataTypes.DECIMAL,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'activities',
  });
  return activity;
};
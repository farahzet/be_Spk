'use strict';
const {
  Model
} = require('sequelize');
const { hasMany } = require('sequelize/lib/associations/mixin');
module.exports = (sequelize, DataTypes) => {
  class activities extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      activities.hasMany(models.trx_calculations, {
        foreignKey: 'activity_id',
        as: 'calculation_act'
      })

      
    }
  }
  activities.init({
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
  return activities;
};
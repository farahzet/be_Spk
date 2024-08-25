// 'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      users.hasMany(models.trx_calculations, {
        foreignKey: 'user_id',
        as: 'calculation_user'
      })

      users.hasMany(models.user_calculation_v, {
        foreignKey: 'user_id',
        as: 'calculation_users_v'
      })

    }
  }
  users.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false
    },
    role: {
      type: DataTypes.ENUM('admin','endUser'),
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    confirmPassword: {
      type: DataTypes.STRING,
      allowNull: false
    },
    phone: {
      type: DataTypes.STRING,
      allowNull: false
    },
  }, {
    sequelize,
    modelName: 'users',
  });
  return users;
};
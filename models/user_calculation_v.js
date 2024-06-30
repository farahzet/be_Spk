const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require('../config/db');

module.exports = sequelize.define(
    'user_calculation_v',
    {
        calculation_id: {
            type: DataTypes.INTEGER,
        },
        user_id: {
            type: DataTypes.INTEGER,
        },
        username: {
            type: DataTypes.STRING,
        },
        weight: {
            type: DataTypes.INTEGER,
        },
        height: {
            type: DataTypes.INTEGER,
        },
        age: {
            type: DataTypes.INTEGER,
        },
        gender: {
            type: DataTypes.STRING,
        },
        activity_name: {
            type: DataTypes.STRING,
        },
        activity_level: {
            type: DataTypes.STRING,
        },
        bobot: {
            type: DataTypes.INTEGER,
        }
    }
);
'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class user_calculation_v extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        
    }
    }

    user_calculation_v.init({
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
    },
    }, {
    sequelize,
    modelName: 'user_calculation_v',
    });
    return user_calculation_v;
};
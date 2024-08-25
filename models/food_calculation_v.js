'use strict';
const {
    Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
    class food_calculation_v extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        
        
    }
    }

    food_calculation_v.init({
    calculation_id: {
        type: DataTypes.INTEGER,
    },
    food_id: {
        type: DataTypes.INTEGER,
    },
    criteria_id: {
        type: DataTypes.INTEGER,
    },
    food_code: {
        type: DataTypes.STRING,
    },
    food_name: {
        type: DataTypes.STRING,
    },
    criteria_name: {
        type: DataTypes.STRING,
    },
    criteria_code: {
        type: DataTypes.STRING,
    },
    bobot: {
        type: DataTypes.INTEGER,
    },
    tren: {
        type: DataTypes.STRING,
    },
    calculation: {
        type: DataTypes.INTEGER,
    },
    }, {
    sequelize,
    modelName: 'food_calculation_v',
    });
    return food_calculation_v;
};
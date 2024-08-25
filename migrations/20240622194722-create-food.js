'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('food', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      food_code: {
        type: Sequelize.STRING,
        allowNull : false
      },
      food_name: {
        type: Sequelize.STRING,
        allowNull : false
      },
      food_desc: {
        type: Sequelize.STRING,
        allowNull : false
      },
      food_calories: {
        type: Sequelize.DECIMAL,
        allowNull : true
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('food');
  }
};
'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('trx_food_criteria', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      food_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      criteria_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      calculation: {
        type: Sequelize.DECIMAL,
        allowNull: false
      },
      calculation_tren: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      total_score: {
        type: Sequelize.DECIMAL,
        allowNull: true
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: true
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
    await queryInterface.dropTable('trx_food_criteria');
  }
};
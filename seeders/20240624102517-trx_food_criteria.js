'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const foodCriteriaData = [];

    for(let i = 1; i<=5; i++){
      foodCriteriaData.push({
        food_id: 1,
        criteria_id: 1 ,
        calculation: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('trx_food_criteria', foodCriteriaData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('trx_food_criteria', null, {});
  }
};

'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const calculationData = [];

    for(let i = 1; i<=5; i++){
      calculationData.push({
        user_id: 1,
        food_id: 1,
        activity_id: 1 ,
        weight: 1 ,
        height: 4,
        gender: 'hghgj',
        age: 6,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('trx_calculations', calculationData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('trx_calculations', null, {});
  }
};

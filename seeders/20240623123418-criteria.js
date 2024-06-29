'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const criteriaData = [];

    for(let i = 1; i<=5; i++){
      criteriaData.push({
        criteria_code: 'C11',
        criteria_name: 'Karbo',
        bobot: 0.2,
        tren: 'positif',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('criteria', criteriaData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('criteria', null, {});
  }
};

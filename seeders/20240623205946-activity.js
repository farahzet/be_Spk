'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const activityData = [];

    for(let i = 1; i<=5; i++){
      activityData.push({
        activity_name: 'far',
        activity_level: 'far@',
        bobot: 0.5 ,
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('activities', activityData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('activities', null, {});
  }
};

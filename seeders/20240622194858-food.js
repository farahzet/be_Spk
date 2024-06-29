'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {

    const foodData = [];

    for(let i = 1; i<=5; i++){
      foodData.push({
        food_code: '',
        food_name: 'Ayam',
        food_desc: 'asjhks',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('food', foodData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('food', null, {});
  }
};

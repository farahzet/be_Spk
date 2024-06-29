'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const userData = [];

    for(let i = 1; i<=5; i++){
      userData.push({
        username: 'far',
        email: 'far@gmail.com',
        role: "endUser",
        password: 'admin123',
        confirmPassword:"admin123",
        phone: '09876',
        createdAt: new Date(),
        updatedAt: new Date(),
      })
    }
    return queryInterface.bulkInsert('users', userData);
  },

  async down (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('users', null, {});
  }
};

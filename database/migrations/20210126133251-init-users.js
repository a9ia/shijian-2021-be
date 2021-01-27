'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      net_id: { type: STRING, primaryKey:true },
      name: STRING(30),
      phone: STRING(11),
      role: { type: INTEGER, defaultvalue: 0 },
      college: STRING,
      grade: STRING,
      class: STRING
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};
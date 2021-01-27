'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING,
      content: STRING,
      net_id:STRING,
      name:STRING,
      created_at: DATE,
      read: { defaultvalue: 0, type: INTEGER },
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('comments');
  },
};
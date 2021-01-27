'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, JSON } = Sequelize;
    await queryInterface.createTable('teammates', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      net_id: STRING,
      team_id: STRING,
      cap: INTEGER,
      vice: INTEGER
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('teammates');
  },

};

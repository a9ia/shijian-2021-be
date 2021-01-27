'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, JSON } = Sequelize;
    await queryInterface.createTable('teams', {
      team_id:{ type: STRING, primaryKey: true },
      team_name: STRING,
      project_name: STRING,
      state: INTEGER,
      gkdw: INTEGER,
      target_place: STRING,
      team_details: JSON,
      team_need: JSON
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('teams');
  },

};

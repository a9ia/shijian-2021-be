/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:33:02
 * @LastEditTime: 2021-02-09 08:24:36
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER, JSON } = Sequelize;
    await queryInterface.createTable('teams', {
      team_id: { type: STRING, primaryKey: true },
      team_name: STRING,
      project_name: STRING,
      state: INTEGER,
      gkdw: INTEGER,
      teacher: STRING,
      target_place: JSON,
      team_details: JSON,
      team_need: JSON,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('teams');
  },

};

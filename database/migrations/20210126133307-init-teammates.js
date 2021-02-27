/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:33:07
 * @LastEditTime: 2021-02-09 08:24:28
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { STRING, INTEGER } = Sequelize;
    await queryInterface.createTable('teammates', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      net_id: STRING,
      team_id: STRING,
      cap: INTEGER,
      vice: INTEGER,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('teammates');
  },

};

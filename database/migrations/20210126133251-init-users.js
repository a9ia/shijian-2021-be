/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:32:51
 * @LastEditTime: 2021-02-09 08:24:01
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      net_id: { type: STRING, primaryKey: true },
      name: STRING(30),
      phone: STRING(11),
      role: { type: INTEGER, defaultvalue: 1 },
      college: STRING,
      grade: STRING,
      class: STRING,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('users');
  },
};

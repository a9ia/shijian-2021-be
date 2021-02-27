/*
 * @Author: A9ia
 * @Date: 2021-02-03 14:11:04
 * @LastEditTime: 2021-02-09 08:25:44
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING } = Sequelize;
    await queryInterface.createTable('datas', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      key: STRING,
      value: INTEGER,
    });
  },

  down: async queryInterface => {
    await queryInterface.dropTable('datas');
  },
};

/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:36:22
 * @LastEditTime: 2021-02-17 10:05:13
 */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, DATE } = Sequelize;
    await queryInterface.createTable('comments', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING,
      content: STRING,
      net_id: STRING,
      created_at: DATE,
      read: { defaultvalue: 0, type: INTEGER },
      response: STRING,
    });
  },
  down: async queryInterface => {
    await queryInterface.dropTable('comments');
  },
};

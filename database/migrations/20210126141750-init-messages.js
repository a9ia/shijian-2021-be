/*
 * @Author: A9ia
 * @Date: 2021-01-26 22:17:50
 * @LastEditTime: 2021-02-09 12:07:12
 */

module.exports = {
  // 在执行数据库升级时调用的函数，创建 messages 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, TINYINT, DATE } = Sequelize;
    await queryInterface.createTable('messages', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      content: STRING,
      net_id: STRING,
      target: STRING,
      hasread: { type: TINYINT, defaultValue: 0 },
      created_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 messages 表
  down: async queryInterface => {
    await queryInterface.dropTable('messages');
  },
};

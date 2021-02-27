/*
 * @Author: A9ia
 * @Date: 2021-01-26 21:35:18
 * @LastEditTime: 2021-02-09 08:24:49
 */

module.exports = {
  // 在执行数据库升级时调用的函数，创建 zhaomu 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, STRING, TINYINT, DATE } = Sequelize;
    await queryInterface.createTable('recruits', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      title: STRING,
      content: STRING,
      net_id: STRING,
      type: TINYINT,
      created_at: DATE,
    });
  },
  // 在执行数据库降级时调用的函数，删除 zhaomu 表
  down: async queryInterface => {
    await queryInterface.dropTable('recruits');
  },
};

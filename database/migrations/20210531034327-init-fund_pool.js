'use strict';

module.exports = {
  // 在执行数据库升级时调用的函数，创建 users 表
  up: async (queryInterface, Sequelize) => {
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('fund_pools', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      created_at: DATE,
      updated_at: DATE,
      address: STRING,
      chain_id: STRING,
      time: STRING,
      apy: STRING,
      total_deposit: STRING,
      net_value: STRING,
      total_profit: STRING,
      day_profit: STRING,
    });
  },
  // 在执行数据库降级时调用的函数，删除 users 表
  down: async queryInterface => {
    await queryInterface.dropTable('fund_pools');
  },
};

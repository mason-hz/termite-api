'use strict';
require('../config/date');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const fundPool = app.model.define('fund_pools', {
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
  app.model.fundPool = fundPool;
  router.get('/api/getProof', controller.home.index);
  router.get('/api/getAll', controller.home.getAll);
  router.get('/api/delete', controller.home.delete);
};

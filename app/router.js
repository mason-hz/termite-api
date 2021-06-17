'use strict';

const { fundPoolsDBName } = require('./constants');

require('../config/date');
/**
 * @param {Egg.Application} app - egg application
 */
module.exports = app => {
  const { router, controller } = app;
  const { STRING, INTEGER, DATE } = app.Sequelize;
  const fundPool = app.model.define(
    fundPoolsDBName,
    {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      createdAt: DATE,
      updatedAt: DATE,
      address: STRING,
      chainId: STRING,
      time: STRING,
      apy: STRING,
      totalDeposit: STRING,
      netValue: STRING,
      totalProfit: STRING,
      dayProfit: STRING,
    },
    { underscored: true }
  );
  app.model.fundPool = fundPool;
  app.model.sequelize = app.Sequelize;
  router.get('/api/getAll', controller.home.getAll);
  router.get('/api/getFundPool', controller.home.getFundPool);
  router.get('/api/deleteDayData', controller.home.delete);
  router.get('/api/fundPoolDaySnapshot', controller.home.fundPoolDaySnapshot);
  router.get('/api/allFundPoolDayAPY', controller.home.allFundPoolDayAPY);
};

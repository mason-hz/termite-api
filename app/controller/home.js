'use strict';
const merkle = require('./prod');
const Controller = require('../core/baseController');
const {
  utils: { isAddress, getAddress },
} = require('ethers');
const { getUTCYesterdayTime } = require('../utils');
// const BigNumber = require('bignumber.js');
class HomeController extends Controller {
  async index() {
    const ctx = this.ctx;
    const { startTime, endTime } = this.config;
    try {
      const { chainId = '1', account } = ctx.request.query;
      if (!isAddress(account)) {
        throw new Error(`Found invalid address: ${account}`);
      }
      const parsed = getAddress(account);
      const { proof, index, amount } = merkle.claims[parsed] || {};
      const nowTine = new Date().getTime();
      let timeUp = 1;
      // 结束了
      if (nowTine > endTime) {
        timeUp = 2;
        // 还没开始
      } else if (nowTine < startTime) {
        timeUp = 3;
      }
      if (proof) {
        this.sendBody({
          index,
          proof,
          timeUp,
          amount,
          chainId,
          endTime,
          startTime,
          account: parsed,
        });
      } else {
        this.error({
          message: 'no account',
          code: 1,
        });
      }
      const user = await ctx.model.Accounts.findOne({
        where: {
          account,
          chain_id: chainId,
        },
      });
      const info = {
        time: new Date().getTime(),
        account,
        chain_id: chainId,
        target: proof ? 1 : 0,
      };
      if (!user) {
        await ctx.model.Accounts.create(info);
      } else {
        user.update(info);
      }
    } catch (error) {
      this.error(error);
    }
  }
  async getAll() {
    const ctx = this.ctx;
    try {
      const dayTime = getUTCYesterdayTime();
      const fundPool = await ctx.model.fundPool.findAll();
      this.sendBody({ dayTime, fundPool });
    } catch (error) {
      this.error(error);
    }
  }
  async getConfig() {
    try {
      const { startTime, endTime } = this.config;
      this.sendBody({
        startTime,
        endTime,
        nowTime: new Date().getTime(),
        formatStartTime: new Date(startTime).format('yyyy-MM-dd hh:mm:ss'),
        formatEndTime: new Date(endTime).format('yyyy-MM-dd hh:mm:ss'),
      });
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = HomeController;

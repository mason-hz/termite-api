'use strict';
const Controller = require('../core/baseController');
const { Op } = require('sequelize');

const {
  getUTCDayTime,
  getCurrentNetValue,
  getNetValue,
  getFundPoolAPY,
} = require('../utils');
const { web3 } = require('../config/contract');
const ContractBasic = require('../utils/contract');
const { SVaultNetValueABI, fundPoolABI } = require('../abis');
const { SVaultNetValue, blockDay } = require('../constants');
function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}
class HomeController extends Controller {
  async getAll() {
    const ctx = this.ctx;
    try {
      const fundPool = await ctx.model.fundPool.findAll();
      this.sendBody(fundPool);
    } catch (error) {
      this.error(error);
    }
  }
  async getFundPool() {
    const ctx = this.ctx;
    try {
      const {
        id = '0xee69707feb63b799d018ad3bd9285d39eb7ca6ae',
        startupTime = '1623836432',
      } = ctx.request.query;
      const dayTime = getUTCDayTime();
      const latestBlockNumber = await web3.eth.getBlockNumber();
      const netValueContract = new ContractBasic({
        contractABI: SVaultNetValueABI,
        contractAddress: SVaultNetValue,
      });
      // 七天前区块
      const preBlock = latestBlockNumber - 7 * blockDay;
      const contract = new ContractBasic({
        contractABI: fundPoolABI,
        contractAddress: id,
      });
      const [values, preValues, totalShares, preTotalShares] =
        await Promise.all([
          netValueContract.callViewMethod('getNetValues'),
          netValueContract.callViewMethod('getNetValues', undefined, {
            defaultBlock: preBlock,
          }),
          contract.callViewMethod('totalShares'),
          contract.callViewMethod('totalShares', undefined, {
            defaultBlock: preBlock,
          }),
        ]);
      const netValues = getCurrentNetValue(values, id);
      const preNetValues = getCurrentNetValue(preValues, id);

      // 净值
      const netValue = getNetValue(
        netValues ? netValues.totalTokens : 0,
        totalShares
      ).toFixed();
      // 上期净值
      const preNetValue = getNetValue(
        preNetValues ? preNetValues.totalTokens : 0,
        preTotalShares
      ).toFixed();
      const fundPoolAPY = getFundPoolAPY(preNetValue, netValue, 7, startupTime);
      // const fundPool = await ctx.model.fundPool.findAll();
      this.sendBody({
        latestBlockNumber,
        dayTime,
        // fundPool,
        totalShares,
        preTotalShares,
        netValues,
        preNetValues,
        netValue,
        preNetValue,
        fundPoolAPY,
        SVaultNetValue,
      });
    } catch (error) {
      this.error(error);
    }
  }
  async delete() {
    const ctx = this.ctx;
    try {
      const time = getUTCDayTime();
      await ctx.model.fundPool.destroy({
        where: {
          time,
        },
      });
      this.sendBody();
    } catch (error) {
      this.error(error);
    }
  }
  async fundPoolDaySnapshot() {
    const ctx = this.ctx;
    try {
      const { limit, offset, id } = ctx.request.query;
      const query = {
        order: [['time', 'DESC']],
        limit: toInt(limit),
        offset: toInt(offset),
        ...(id ? { where: { address: id } } : {}),
      };
      this.sendBody(await ctx.model.fundPool.findAll(query));
    } catch (error) {
      this.error(error);
    }
  }
  async allFundPoolDayAPY() {
    const ctx = this.ctx;
    try {
      const { limit = '30' } = ctx.request.query;
      const day = getUTCDayTime();
      const query = {
        order: [['time', 'DESC']],
        where: { time: { [Op.gt]: day - 86400000 * toInt(limit) } },
      };
      const fundPools = await ctx.model.fundPool.findAll(query);
      const obj = {};
      if (Array.isArray(fundPools)) {
        for (let i = 0, j = fundPools.length; i < j; i++) {
          const element = fundPools[i];
          const { address, apy, time } = element;
          if (!obj[address]) obj[address] = [];
          obj[element.address].push({ apy, time });
        }
      }
      this.sendBody(obj);
    } catch (error) {
      this.error(error);
    }
  }
}

module.exports = HomeController;

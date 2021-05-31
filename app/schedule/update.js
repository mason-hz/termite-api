'use strict';

const { KovanSVaultClient } = require('../config/clients');
const { queryFundPools } = require('../config/queries');
const { SVaultNetValueABI, fundPoolABI, PriceViewABI } = require('../abis');
// const BigNumber = require('bignumber.js');
const { SVaultNetValue, PriceView } = require('../constants');
const ContractBasic = require('../utils/contract');
const {
  getCurrentNetValue,
  getProfit,
  divDecimals,
  getNetValue,
  getUTCYesterdayTime,
  getFundPoolAPY,
  getDayProfit,
  getUTCDayTime,
} = require('../utils');
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  static get schedule() {
    return {
      // interval: '5s', // 1 分钟间隔
      type: 'all',
      immediate: true, // 项目启动就执行一次定时任务
      cron: '0 0 0/6 * * *', // 每天0点开始每6小时执行一次
    };
  }

  async subscribe() {
    const ctx = this.ctx;
    try {
      const netValueContract = new ContractBasic({
        contractABI: SVaultNetValueABI,
        contractAddress: SVaultNetValue,
      });
      const priceViewContract = new ContractBasic({
        contractABI: PriceViewABI,
        contractAddress: PriceView,
      });
      const [values, result] = await Promise.all([
        netValueContract.callViewMethod('getNetValues'),
        KovanSVaultClient.query({
          query: queryFundPools(),
          fetchPolicy: 'network-only',
        }),
      ]);
      const { fundPools } = result.data;
      if (fundPools) {
        Promise.all(
          fundPools.map(async i => {
            const { id, token } = i || {};
            const { decimals, id: tokenAddress } = token || {};
            const contract = new ContractBasic({
              contractABI: fundPoolABI,
              contractAddress: id,
            });
            const [totalTokenSupply, totalShares, price] = await Promise.all([
              contract.callViewMethod('totalTokenSupply'),
              contract.callViewMethod('totalShares'),
              priceViewContract.callViewMethod('getPriceInUSDT', [
                tokenAddress,
              ]),
            ]);
            const netValues = getCurrentNetValue(values, id);

            // 收益
            const profit = divDecimals(
              getProfit(
                netValues ? netValues.totalTokens : 0,
                totalTokenSupply
              ),
              decimals
            ).toFixed();
            // 净值
            const netValue = getNetValue(
              netValues ? netValues.totalTokens : 0,
              totalShares
            ).toFixed();
            // 价格
            const tokenPrice = divDecimals(price, 6);
            // token总锁仓量
            const totalValueLocked = divDecimals(totalTokenSupply, decimals);
            // 锁仓量 $
            const totalDeposit = tokenPrice.times(totalValueLocked).toFixed();
            const time = getUTCDayTime();
            const info = {
              time,
              address: id,
              chain_id: '42',
              total_deposit: totalDeposit,
              net_value: netValue,
              total_profit: profit,
            };
            const dayTime = getUTCYesterdayTime();
            const fundPool = await ctx.model.fundPool.findOne({
              where: {
                time: dayTime,
                address: '0xcbdbbe645872ce2c5d65df08fd260b9666695c7b',
                chain_id: '42',
              },
            });
            if (fundPool !== null) {
              info.apy = getFundPoolAPY(fundPool.net_value, netValue);
              info.day_profit = getDayProfit(fundPool.total_profit, profit);
            }
            const now = await ctx.model.fundPool.findOne({
              where: {
                time,
                address: id,
                chain_id: '42',
              },
            });
            if (now === null) {
              await ctx.model.fundPool.create(info);
            }
          })
        );
      }
    } catch (error) {
      console.log(error, '======error');
    }
  }
}

module.exports = UpdateCache;

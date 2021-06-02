'use strict';

const { KovanSVaultClient } = require('../config/clients');
const { queryFundPools } = require('../config/queries');
const { SVaultNetValueABI, fundPoolABI, PriceViewABI } = require('../abis');
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
  getUTCWeekAgoTime,
} = require('../utils');
const Subscription = require('egg').Subscription;

class UpdateCache extends Subscription {
  static get schedule() {
    return {
      // interval: '1m', // 1 分钟间隔
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
            priceViewContract.callViewMethod('getPriceInUSDT', [tokenAddress]),
          ]);
          const netValues = getCurrentNetValue(values, id);

          // 收益
          const profit = divDecimals(
            getProfit(netValues ? netValues.totalTokens : 0, totalTokenSupply),
            decimals
          ).toFixed();
          // 净值
          const netValue = getNetValue(
            netValues ? netValues.totalTokens : 0,
            totalShares
          ).toFixed();
          // 价格
          const tokenPrice = divDecimals(price, 6);
          console.log(price, '=============price');
          console.log(totalTokenSupply, '=======totalTokenSupply');
          console.log(tokenAddress, id, '=======tokenAddress');
          // token总锁仓量
          const totalValueLocked = divDecimals(totalTokenSupply, decimals);
          // 锁仓量 $
          const totalDeposit = tokenPrice.times(totalValueLocked).toFixed();
          const time = getUTCDayTime();
          const info = {
            time,
            address: id,
            chainId: '42',
            totalDeposit,
            netValue,
            totalProfit: profit,
          };
          const yesterdayFundPool = await ctx.model.fundPool.findOne({
            where: {
              time: getUTCYesterdayTime(),
              address: id,
              chainId: '42',
            },
          });
          if (yesterdayFundPool !== null) {
            const weekAgoFundPool = await ctx.model.fundPool.findOne({
              where: {
                time: getUTCWeekAgoTime(),
                address: id,
                chainId: '42',
              },
            });
            console.log(weekAgoFundPool, '======weekAgoFundPool');
            // 一周 apy
            if (weekAgoFundPool !== null) {
              info.apy = getFundPoolAPY(weekAgoFundPool.netValue, netValue, 7);
              // 一天 apy
            } else {
              info.apy = getFundPoolAPY(yesterdayFundPool.netValue, netValue);
            }

            info.dayProfit = getDayProfit(
              yesterdayFundPool.totalProfit,
              profit
            );
          }
          const now = await ctx.model.fundPool.findOne({
            where: {
              time,
              address: id,
              chainId: '42',
            },
          });
          if (now === null) {
            await ctx.model.fundPool.create(info);
          }
        });
      }
    } catch (error) {
      console.log(error, '======error');
    }
  }
}

module.exports = UpdateCache;

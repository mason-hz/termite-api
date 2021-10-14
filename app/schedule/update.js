'use strict';

const { KovanSVaultClient } = require('../config/clients');
const { queryFundPools } = require('../config/queries');
const { SVaultNetValueABI, fundPoolABI, PriceViewABI } = require('../abis');
const {
  SVaultNetValue,
  PriceView,
  blockDay,
  USDT_DECIMALS,
  CHAIN_ID,
} = require('../constants');
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
  parseNetValues,
} = require('../utils');
const Subscription = require('egg').Subscription;
const { web3 } = require('../config/contract');
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
        }),
        priceViewContract = new ContractBasic({
          contractABI: PriceViewABI,
          contractAddress: PriceView,
        });

      const latestBlockNumber = await web3.eth.getBlockNumber();
      // 七天前区块
      const preBlock = latestBlockNumber - 7 * blockDay;

      // const [values, preValues, result] = await Promise.all([
      //   netValueContract.callViewMethod('getNetValues'),
      //   // 七天前净值
      //   netValueContract.callViewMethod('getNetValues', undefined, {
      //     defaultBlock: preBlock,
      //   }),
      //   KovanSVaultClient.query({
      //     query: queryFundPools(),
      //     fetchPolicy: 'network-only',
      //   }),
      // ]);

      const [valuesInView, preValuesInView, result] = await Promise.all([
        netValueContract.callViewMethod('getNetValuesInView'),
        netValueContract.callViewMethod('getNetValuesInView', undefined, {
          defaultBlock: preBlock,
        }),
        KovanSVaultClient.query({
          query: queryFundPools(),
          fetchPolicy: 'network-only',
        }),
      ]);

      const [values, preValues] = parseNetValues(valuesInView, preValuesInView);

      const time = getUTCDayTime();
      const { fundPools } = result.data;
      if (fundPools) {
        fundPools.map(async i => {
          const { id, token, startupTime, totalUserProfit } = i || {};
          const { decimals, id: tokenAddress } = token || {};
          const contract = new ContractBasic({
            contractABI: fundPoolABI,
            contractAddress: id,
          });
          const [totalTokenSupply, totalShares, preTotalShares, price] =
            await Promise.all([
              contract.callViewMethod('totalTokenSupply'),
              contract.callViewMethod('totalShares'),
              contract.callViewMethod('totalShares', undefined, {
                defaultBlock: preBlock,
              }),
              priceViewContract.callViewMethod('getPriceInUSDT', [
                tokenAddress,
              ]),
            ]);

          const netValues = getCurrentNetValue(values, id);
          const preNetValues = getCurrentNetValue(preValues, id);

          // 收益
          const profit = divDecimals(
            getProfit(netValues ? netValues.totalTokens : 0, totalTokenSupply),
            decimals
          )
            // 用户赎回收益
            .plus(totalUserProfit || 0)
            .toFixed();
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

          // 价格
          const tokenPrice = divDecimals(price, USDT_DECIMALS);
          // token总锁仓量
          const totalValueLocked = divDecimals(totalTokenSupply, decimals);
          // 锁仓量 $
          const totalDeposit = tokenPrice.times(totalValueLocked).toFixed();
          const info = {
            time,
            address: id,
            chainId: CHAIN_ID,
            totalDeposit,
            netValue,
            totalProfit: profit,
          };
          const yesterdayFundPool = await ctx.model.fundPool.findOne({
            where: {
              time: getUTCYesterdayTime(),
              address: id,
              chainId: CHAIN_ID,
            },
          });
          if (yesterdayFundPool !== null) {
            info.apy = getFundPoolAPY(preNetValue, netValue, 7, startupTime);

            // const weekAgoFundPool = await ctx.model.fundPool.findOne({
            //   where: {
            //     time: getUTCWeekAgoTime(),
            //     address: id,
            //     chainId: CHAIN_ID,
            //   },
            // });
            // // 有一周前的数据
            // if (weekAgoFundPool !== null) {
            //   info.apy = getFundPoolAPY(weekAgoFundPool.netValue, netValue, 7);
            // } else {
            //   const firstFundPool = await ctx.model.fundPool.findOne({
            //     where: {
            //       address: id,
            //       chainId: CHAIN_ID,
            //     },
            //   });
            //   // 有第一条数据
            //   if (firstFundPool !== null) {
            //     info.apy = getFundPoolAPY(
            //       firstFundPool.netValue,
            //       netValue,
            //       // 日期差值
            //       Math.floor((time - firstFundPool.time) / 86400000)
            //     );
            //   } else {
            //     info.apy = getFundPoolAPY(yesterdayFundPool.netValue, netValue);
            //   }
            // }

            info.dayProfit = getDayProfit(
              yesterdayFundPool.totalProfit,
              profit
            );
          } else {
            info.apy = getFundPoolAPY(preNetValue, netValue, 7, startupTime);
          }
          const now = await ctx.model.fundPool.findOne({
            where: {
              time,
              address: id,
              chainId: CHAIN_ID,
            },
          });
          if (now !== null) return;
          // 插入数据库
          await ctx.model.fundPool.create(info);
        });
      }
    } catch (error) {
      console.log(error, '======error');
    }
  }
}

module.exports = UpdateCache;

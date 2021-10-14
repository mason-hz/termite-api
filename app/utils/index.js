'use strict';

const { isAddress, getAddress } = require('@ethersproject/address');
const { default: BigNumber } = require('bignumber.js');

function ethersToString(v) {
  if (v._isBigNumber) {
    return new BigNumber(v.toString());
  }
  return v;
}
function isEqAddress(a1, a2) {
  if (!isAddress(a1) || !isAddress(a2)) return false;
  try {
    return getAddress(a1) === getAddress(a2);
  } catch (error) {
    return false;
  }
}
function getCurrentNetValue(netValues, poolId) {
  if (!Array.isArray(netValues)) return;
  return netValues.find(i => {
    return isEqAddress(i.pool, poolId);
  });
}
function getProfit(totalTokens, totalTokensSupply) {
  if (
    !totalTokens ||
    !totalTokensSupply ||
    totalTokens === '0' ||
    totalTokensSupply === '0'
  ) {
    return new BigNumber('0');
  }
  const total = new BigNumber(totalTokens);
  return total.minus(totalTokensSupply);
}
function getNetValue(totalTokens, totalShares) {
  if (
    !totalTokens ||
    !totalShares ||
    totalShares === '0' ||
    totalTokens === '0'
  ) {
    return new BigNumber('1');
  }
  const molecular = new BigNumber(totalTokens);
  return molecular.div(totalShares);
}
function divDecimals(a, decimals) {
  if (!a) return new BigNumber('0');
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a);
  if (bigA.isNaN()) return new BigNumber('0');
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.div(decimals);
  }
  return bigA.div(`1e${decimals || 18}`);
}
function timesDecimals(a, decimals) {
  const bigA = BigNumber.isBigNumber(a) ? a : new BigNumber(a || '');
  if (bigA.isNaN()) return new BigNumber('0');
  if (typeof decimals === 'string' && decimals.length > 10) {
    return bigA.times(decimals);
  }
  return bigA.times(`1e${decimals || 18}`);
}
function getUTCDayTime() {
  const time = new Date();
  // utc 日期
  const utcDate = `${time.getUTCFullYear()}/${
    time.getUTCMonth() + 1
  }/${time.getUTCDate()}`;

  const timestamp = new Date(utcDate).getTime();
  const offset = new Date().getTimezoneOffset() * 60000;
  return timestamp - offset;
}
function getUTCYesterdayTime() {
  return getUTCDayTime() - 86400000;
}
function getUTCWeekAgoTime() {
  return getUTCDayTime() - 86400000 * 7;
}

function getFundPoolAPY(preNetValue, netValue, apyDays = 1, startupTime) {
  let bigPre = new BigNumber(preNetValue);
  const bigC = new BigNumber(netValue);
  if (bigPre.eq(0) || bigPre.isNaN()) {
    bigPre = new BigNumber(1);
  }
  if (bigC.eq(0) || bigC.isNaN()) {
    return new BigNumber(0);
  }
  if (startupTime) {
    const hours = new BigNumber(new Date().getTime() / 1000)
      .minus(startupTime)
      .div(3600)
      .dp(0, BigNumber.ROUND_DOWN);
    if (!hours.isNaN() && hours.div(24).lt(apyDays)) {
      if (hours.lte(1)) {
        apyDays = 1 / 24;
      } else {
        apyDays = hours.div(24).toNumber();
      }
    }
  }
  const difference = bigC.minus(bigPre);

  const numerator = difference.times(365 / apyDays);

  return numerator.div(bigPre).times(100).toFixed();
}
function getDayProfit(pre, c) {
  const bigC = new BigNumber(c);
  if (bigC.isNaN()) return '0';
  if (!pre) return bigC.toFixed();
  return bigC.minus(pre).toFixed();
}

function parseNetValues(valuesInView, preValuesInView) {
  const { netValues, netValuesNew } = valuesInView || {};
  const values = netValuesNew
    ? netValuesNew.map((i, k) => ({
        ...netValues[k],
        totalTokens: i.totalTokens,
        totalTokensInUSD: i.totalTokensInUSD,
      }))
    : undefined;

  const { netValues: netValuesPre, netValuesNew: netValuesNewPre } =
    preValuesInView || {};

  const preValues = netValuesNewPre
    ? netValuesNewPre.map((i, k) => ({
        ...netValuesPre[k],
        totalTokens: i.totalTokens,
        totalTokensInUSD: i.totalTokensInUSD,
      }))
    : undefined;
  return [values, preValues];
}
module.exports = {
  getUTCWeekAgoTime,
  divDecimals,
  getUTCDayTime,
  getUTCYesterdayTime,
  timesDecimals,
  getProfit,
  getNetValue,
  isEqAddress,
  ethersToString,
  getCurrentNetValue,
  getFundPoolAPY,
  getDayProfit,
  parseNetValues,
};

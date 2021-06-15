'use strict';
const config = {
  exploreUrl: 'https://kovan.etherscan.io/',
  rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',

  Controller: '0x07eAe6689403E6737719CFB4d24aa8f7F0A31Aca',
  WETH_ADDRESS: '0xA050886815CFc52a24B9C4aD044ca199990B6690',
  SwapFactory: '0x8017f90d1332cc63Ff9Cc32F4461edd85F537b56',
  SwapRouter: '0xC4ED01EeB878aa2cAFDC1EB60C88d84187d2ab51',
  SVaultNetValue: '0xC1Adef553c3Efea8923AC6333Fb1b70AB5507391',
  PriceView: '0xBBc31dfE4effCFB8a9D04896a79aA5f15013526b',

  blockDay: 21600,
  blockPerYear: 21600 * 365,
};

module.exports = config;

'use strict';

const config = {
  exploreUrl: 'https://kovan.etherscan.io/',
  rpcUrl: 'https://kovan.infura.io/v3/7c746e03937a4f3085785ef7cb673db0',
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',

  Controller: '0x4731E500F85eA8523959751D105a59425dcC6db8',
  WETH_ADDRESS: '0xA050886815CFc52a24B9C4aD044ca199990B6690',
  SwapFactory: '0x8017f90d1332cc63Ff9Cc32F4461edd85F537b56',
  SwapRouter: '0xC4ED01EeB878aa2cAFDC1EB60C88d84187d2ab51',
  SVaultNetValue: '0xD69802B0D92F0aCBc1e4eA788B4DaDF5e7C0048c',
  PriceView: '0x24D687F6C23DB83B8A283Eff9279Ab4216eb0b57',

  blockDay: 21600,
  blockPerYear: 21600 * 365,
};

module.exports = config;

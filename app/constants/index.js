'use strict';
const env = process.env.TERMITE_ENV;
const bscConfig = {
  CHAIN_ID: '56',
  rpcUrl: 'https://bsc-dataseed.binance.org',
  blockDay: 28800,
  blockPerYear: 28800 * 365,
  USDT_DECIMALS: 18,
  Controller: '0x53285424353633A38EEAACE94041649729426066',
  SVaultNetValue: '0x569C682d11eE4550aF79B09F9870384b4c5B7510',
  PriceView: '0xFE8D2f0259cc7c26133A82C7A231605A8D77cf9a',
  fundPoolsDBName: 'fund_pools',
};

const kovanDefaultConfig = {
  CHAIN_ID: '42',
  rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
  blockDay: 21600,
  blockPerYear: 21600 * 365,
  USDT_DECIMALS: 18,
};

const kovanConfig = {
  ...kovanDefaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/termite-finance/termite-kovan',

  Controller: '0x6586e97481C16E67d3bd3Abb769CEb1A1e9eA7e6',
  SVaultNetValue: '0xfc18a7f6c3d1b9fa714ad053c2f8afb87c3de9f9',
  PriceView: '0xa1534e26b55c54115c95220bfa2f98baf3c99899',
  fundPoolsDBName: 'fund_pools',
};

const kovanPreviewConfig = {
  ...kovanDefaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/termite-kovan',

  Controller: '0x7818884BD0Dc4ffD717074a30248A14b8eb3bb55',
  SVaultNetValue: '0x562035B58c053b0Dc05C72FfF87AFCF52Db3f379',
  PriceView: '0x23a6689E396de01386C76F4aFec0001b6658D72D',
  fundPoolsDBName: 'preview_fund_pools',
};

const config = {
  preview: kovanPreviewConfig,
  kovan: kovanConfig,
  bsc: bscConfig,
};
module.exports = config[env] || config.kovan;

'use strict';
const env = process.env.TERMITE_ENV;

const defaultConfig = {
  rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
  blockDay: 21600,
  blockPerYear: 21600 * 365,
};

const config = {
  ...defaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault',

  Controller: '0xcD14bBa03529c2B27FA70FA2c6366cFdE4e1d83D',
  SVaultNetValue: '0x5a57166FFECF50f36C0f7A4D6d6Acd1962326Ad9',
  PriceView: '0xbFf1Dd2C9543540Aa0aFF21657cB8B6670D185A9',
  fundPoolsDBName: 'fund_pools',
};

const previewConfig = {
  ...defaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/termite-kovan',

  Controller: '0x7818884BD0Dc4ffD717074a30248A14b8eb3bb55',
  SVaultNetValue: '0x562035B58c053b0Dc05C72FfF87AFCF52Db3f379',
  PriceView: '0x23a6689E396de01386C76F4aFec0001b6658D72D',
  fundPoolsDBName: 'preview_fund_pools',
};

module.exports = env === 'preview' ? previewConfig : config;

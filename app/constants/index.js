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

  Controller: '0x4d706BEe4CAE123a4b33EB919D6523eFB2C1C173',
  SVaultNetValue: '0xC530D5561DEF36BA859982585f28a81f20B2Ce20',
  PriceView: '0x3D892a7b6E04E4B3Ed786F6438B8e6d2a9F568bb',
  fundPoolsDBName: 'fund_pools',
};

const previewConfig = {
  ...defaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/termite-kovan',

  Controller: '0x10Bb968006b1eF671dC9261C9477A5827c1ad69C',
  SVaultNetValue: '0xEf7D9773820371eE953c03d7eC62B7E41985ec8F',
  PriceView: '0x250d9e491c6cC11A9A413492a980FD638BF4145F',
  fundPoolsDBName: 'preview_fund_pools',
};

module.exports = env === 'preview' ? previewConfig : config;

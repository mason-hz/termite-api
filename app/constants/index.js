'use strict';
const env = process.env.TERMITE_ENV;

const defaultConfig = {
  rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
  blockDay: 21600,
  blockPerYear: 21600 * 365,
};

const config = {
  ...defaultConfig,
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',

  Controller: '0xd98cf5C109aA130556eb81344c6303B6fe99f722',
  SVaultNetValue: '0x2A28F3Dc81869Ce0dE70edC27777fbB5189c0f72',
  PriceView: '0x9219f24F6B7D5AccF6C6d34044937EF882948b1e',

  blockDay: 21600,
  blockPerYear: 21600 * 365,
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

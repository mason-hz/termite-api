'use strict';
const config = {
  exploreUrl: 'https://kovan.etherscan.io/',
  rpcUrl: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
  apolloUrl: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',

  Controller: '0xd98cf5C109aA130556eb81344c6303B6fe99f722',
  SVaultNetValue: '0x2A28F3Dc81869Ce0dE70edC27777fbB5189c0f72',
  PriceView: '0x9219f24F6B7D5AccF6C6d34044937EF882948b1e',

  blockDay: 21600,
  blockPerYear: 21600 * 365,
};

module.exports = config;

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

  Controller: '0x7818884BD0Dc4ffD717074a30248A14b8eb3bb55',
  SVaultNetValue: '0x562035B58c053b0Dc05C72FfF87AFCF52Db3f379',
  PriceView: '0x23a6689E396de01386C76F4aFec0001b6658D72D',
  fundPoolsDBName: 'preview_fund_pools',
};

module.exports = env === 'preview' ? previewConfig : config;

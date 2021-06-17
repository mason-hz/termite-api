'use strict';

// const { ethers } = require('ethers');
const Web3 = require('web3');
const { rpcUrl } = require('../constants');

// const provider = new ethers.providers.JsonRpcProvider({
//   url: 'https://eth-kovan.alchemyapi.io/v2/xySGYPfffRK4wIUO1AqWgwgi2-Q2O1wy',
// });

const provider = new Web3.providers.HttpProvider(
  rpcUrl,
  {
    keepAlive: true,
    withCredentials: false,
    timeout: 20000, // ms
  }
);
const web3 = new Web3(provider);

module.exports = {
  provider,
  web3,
};

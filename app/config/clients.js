'use strict';
const fetch = require('node-fetch');
const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} = require('@apollo/client');
const KovanSVaultClient = new ApolloClient({
  // link: new HttpLink({
  //   uri: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',
  // }),
  link: createHttpLink({
    uri: 'https://api.thegraph.com/subgraphs/name/zhxymh/svault-kovan',
    fetch,
  }),
  cache: new InMemoryCache(),
});
module.exports = {
  KovanSVaultClient,
};

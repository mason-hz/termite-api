'use strict';
const fetch = require('node-fetch');
const {
  ApolloClient,
  InMemoryCache,
  createHttpLink,
} = require('@apollo/client');
const { apolloUrl } = require('../constants');
const KovanSVaultClient = new ApolloClient({
  link: createHttpLink({
    uri: apolloUrl,
    fetch,
  }),
  cache: new InMemoryCache(),
});
module.exports = {
  KovanSVaultClient,
};

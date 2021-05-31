'use strict';
const gql = require('graphql-tag');
const token = `{
  id
  symbol
  decimals
}`;

function queryFundPools() {
  return gql`
    query fundPools {
      fundPools {
        id
        token ${token}
        max
      }
    }
  `;
}

module.exports = {
  queryFundPools,
};

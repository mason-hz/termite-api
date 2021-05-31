'use strict';

const { web3 } = require('../config/contract');
class ContractBasic {
  constructor(options) {
    const { contractABI, contractAddress } = options;

    this.contractForView = this.initViewOnlyContract(
      contractAddress,
      contractABI
    );
    this.address = contractAddress;
  }
  initViewOnlyContract = (address, ABI) => {
    return new web3.eth.Contract(ABI, address);
  };

  callViewMethod = async (
    functionName,
    paramsOption,
    callOptions = { defaultBlock: 'latest' }
  ) => {
    try {
      const { defaultBlock, options } = callOptions;

      const contract = this.contractForView;

      // BlockTag
      contract.defaultBlock = defaultBlock;

      return await contract.methods[functionName](...(paramsOption || [])).call(
        options
      );
    } catch (e) {
      return { error: e };
    }
  };
}
module.exports = ContractBasic;

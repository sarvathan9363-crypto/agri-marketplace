require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config({ path: '../backend/.env' });

const RELAYER_PRIVATE_KEY = process.env.BLOCKCHAIN_RELAYER_PRIVATE_KEY || process.env.RELAYER_PRIVATE_KEY || '0x0000000000000000000000000000000000000000000000000000000000000001';

module.exports = {
  solidity: {
    version: '0.8.20',
    settings: {
      optimizer: {
        enabled: true,
        runs: 200,
      },
    },
  },
  networks: {
    hardhat: {},
    kavaTestnet: {
      url: process.env.BLOCKCHAIN_RPC_URL || 'https://evm.testnet.kava.io',
      chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '2221', 10),
      accounts: [RELAYER_PRIVATE_KEY],
    },
  },
  mocha: {
    timeout: 40000,
  },
};

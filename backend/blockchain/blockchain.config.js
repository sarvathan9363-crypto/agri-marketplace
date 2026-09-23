/**
 * Blockchain Module Configuration
 * Reads server-only environment variables for Kava EVM Testnet integration.
 * NEVER expose relayer private key to frontend or client applications.
 */

module.exports = {
  network: process.env.BLOCKCHAIN_NETWORK || 'kava-testnet',
  chainId: parseInt(process.env.BLOCKCHAIN_CHAIN_ID || '2221', 10),
  rpcUrl: process.env.BLOCKCHAIN_RPC_URL || 'https://evm.testnet.kava.io',
  contractAddress: process.env.BLOCKCHAIN_CONTRACT_ADDRESS || process.env.AGRI_BAZAAR_CONTRACT_ADDRESS || '0x8133cBde7b4cF6096920F34cE342Bc851b4950F1',
  relayerPrivateKey: process.env.BLOCKCHAIN_RELAYER_PRIVATE_KEY || process.env.RELAYER_PRIVATE_KEY || '',
  explorerBaseUrl: process.env.BLOCKCHAIN_EXPLORER_URL || 'https://explorer.testnet.kava.io',
  enabled: process.env.BLOCKCHAIN_ENABLED !== 'false',
  gasLimitMultiplier: parseFloat(process.env.BLOCKCHAIN_GAS_MULTIPLIER || '1.2'),
  maxRetries: parseInt(process.env.BLOCKCHAIN_MAX_RETRIES || '3', 10),
};

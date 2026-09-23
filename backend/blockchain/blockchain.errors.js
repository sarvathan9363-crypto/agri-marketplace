/**
 * Custom Error classes for Blockchain Audit Module.
 */

class BlockchainError extends Error {
  constructor(message, code = 'BLOCKCHAIN_ERROR', statusCode = 500) {
    super(message);
    this.name = 'BlockchainError';
    this.code = code;
    this.statusCode = statusCode;
  }
}

class BlockchainConfigError extends BlockchainError {
  constructor(message) {
    super(message, 'BLOCKCHAIN_CONFIG_ERROR', 500);
    this.name = 'BlockchainConfigError';
  }
}

class BlockchainRPCError extends BlockchainError {
  constructor(message, originalError = null) {
    super(message, 'BLOCKCHAIN_RPC_ERROR', 502);
    this.name = 'BlockchainRPCError';
    this.originalError = originalError;
  }
}

class BlockchainRelayerError extends BlockchainError {
  constructor(message) {
    super(message, 'BLOCKCHAIN_RELAYER_ERROR', 503);
    this.name = 'BlockchainRelayerError';
  }
}

class BlockchainTxError extends BlockchainError {
  constructor(message, txHash = null) {
    super(message, 'BLOCKCHAIN_TX_ERROR', 500);
    this.name = 'BlockchainTxError';
    this.txHash = txHash;
  }
}

module.exports = {
  BlockchainError,
  BlockchainConfigError,
  BlockchainRPCError,
  BlockchainRelayerError,
  BlockchainTxError,
};

const { ethers } = require('ethers');
const config = require('./blockchain.config');
const abi = require('./abi/AgriBazaarPaymentAudit.json');
const { hashId, formatAddress } = require('./blockchain.utils');
const {
  BlockchainError,
  BlockchainRPCError,
  BlockchainRelayerError,
  BlockchainTxError,
} = require('./blockchain.errors');

class BlockchainService {
  constructor() {
    this.config = config;
    this.provider = null;
    this.wallet = null;
    this.contract = null;
    this.readOnlyContract = null;
    this.initialized = false;
    this.init();
  }

  init() {
    try {
      if (!this.config.rpcUrl) {
        console.warn('[BlockchainService] RPC URL not provided.');
        return;
      }

      this.provider = new ethers.JsonRpcProvider(
        this.config.rpcUrl,
        this.config.chainId,
        { staticNetwork: true }
      );
      this.provider.resolveName = async (name) => {
        if (!name) return null;
        if (ethers.isAddress(name)) return ethers.getAddress(name);
        return null;
      };

      const validContractAddress = formatAddress(this.config.contractAddress);
      if (validContractAddress && validContractAddress !== ethers.ZeroAddress) {
        this.readOnlyContract = new ethers.Contract(
          validContractAddress,
          abi,
          this.provider
        );
      }

      if (this.config.relayerPrivateKey && this.config.relayerPrivateKey.trim().length >= 64) {
        const pk = this.config.relayerPrivateKey.trim().startsWith('0x')
          ? this.config.relayerPrivateKey.trim()
          : `0x${this.config.relayerPrivateKey.trim()}`;
        this.wallet = new ethers.Wallet(pk, this.provider);
        if (validContractAddress && validContractAddress !== ethers.ZeroAddress) {
          this.contract = new ethers.Contract(validContractAddress, abi, this.wallet);
        }
        console.log(`[BlockchainService] Relayer wallet ready: ${this.wallet.address} on chain ${this.config.chainId}`);
      } else {
        console.warn('[BlockchainService] BLOCKCHAIN_RELAYER_PRIVATE_KEY not configured. Write operations disabled.');
      }

      this.initialized = true;
    } catch (error) {
      console.error('[BlockchainService] Initialization failed:', error.message);
    }
  }

  ensureWriteCapable() {
    if (!this.config.enabled) {
      throw new BlockchainError('Blockchain integration is disabled in environment config', 'BLOCKCHAIN_DISABLED');
    }
    if (!this.wallet || !this.contract) {
      throw new BlockchainRelayerError('Relayer wallet or contract is not configured for write operations');
    }
  }

  async sendTransaction(methodName, args) {
    this.ensureWriteCapable();
    try {
      const tx = await this.contract[methodName](...args);
      console.log(`[BlockchainService] ${methodName} submitted. Tx hash: ${tx.hash}`);

      const receipt = await tx.wait(1); // Wait for 1 block confirmation
      console.log(`[BlockchainService] ${methodName} confirmed in block ${receipt.blockNumber}`);

      return {
        success: true,
        transactionHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        contractAddress: this.config.contractAddress,
        network: this.config.network,
        chainId: this.config.chainId,
      };
    } catch (error) {
      console.error(`[BlockchainService] ${methodName} execution failed:`, error.message);

      if (error.code === 'CALL_EXCEPTION') {
        throw new BlockchainTxError(`Smart contract execution reverted in ${methodName}: ${error.reason || error.message}`);
      } else if (error.code === 'SERVER_ERROR' || error.code === 'NETWORK_ERROR' || error.code === 'TIMEOUT') {
        throw new BlockchainRPCError(`RPC node connection error in ${methodName}: ${error.message}`, error);
      }
      throw new BlockchainTxError(`Transaction failed in ${methodName}: ${error.message}`);
    }
  }

  // ------------------------------------------------------------------------
  // IMMUTABLE PAYMENT & SETTLEMENT AUDIT METHODS
  // ------------------------------------------------------------------------

  /**
   * Records an immutable payment event on-chain using hashed references.
   */
  async recordPaymentEvent(paymentId, orderId, buyerId, sellerIds = [], razorpayPaymentId, amountPaise, statusInt = 2) {
    const paymentIdStr = String(paymentId);
    const orderIdStr = String(orderId);
    const buyerIdStr = String(buyerId);
    const rzpRefStr = String(razorpayPaymentId || paymentIdStr);

    const eventIdHash = hashId(`evt_pay_${paymentIdStr}_${statusInt}_${Date.now()}`);
    const paymentIdHash = hashId(`AGR-PAY-${paymentIdStr}`);
    const orderIdHash = hashId(`AGR-O-${orderIdStr}`);
    const buyerIdHash = hashId(`AGR-B-${buyerIdStr}`);
    const sellerIdHashes = (Array.isArray(sellerIds) ? sellerIds : [sellerIds]).map(id => hashId(`AGR-F-${String(id)}`));
    const paymentReferenceHash = hashId(rzpRefStr);

    return this.sendTransaction('recordPaymentEvent', [
      eventIdHash,
      paymentIdHash,
      orderIdHash,
      buyerIdHash,
      sellerIdHashes,
      paymentReferenceHash,
      BigInt(amountPaise),
      Number(statusInt),
    ]);
  }

  /**
   * Records an immutable seller settlement split event on-chain.
   */
  async recordSettlementEvent(settlementId, orderId, sellerId, sellerAmountPaise, statusInt = 2) {
    const settlementIdStr = String(settlementId);
    const orderIdStr = String(orderId);
    const sellerIdStr = String(sellerId);

    const eventIdHash = hashId(`evt_settle_${settlementIdStr}_${statusInt}_${Date.now()}`);
    const settlementIdHash = hashId(`AGR-S-${settlementIdStr}`);
    const orderIdHash = hashId(`AGR-O-${orderIdStr}`);
    const sellerIdHash = hashId(`AGR-F-${sellerIdStr}`);

    return this.sendTransaction('recordSettlementEvent', [
      eventIdHash,
      settlementIdHash,
      orderIdHash,
      sellerIdHash,
      BigInt(sellerAmountPaise),
      Number(statusInt),
    ]);
  }

  // ------------------------------------------------------------------------
  // READ-ONLY QUERY METHODS
  // ------------------------------------------------------------------------

  async getPaymentEvent(eventIdHash) {
    if (!this.readOnlyContract) return null;
    return this.readOnlyContract.getPaymentEvent(eventIdHash);
  }

  async getSettlementEvent(eventIdHash) {
    if (!this.readOnlyContract) return null;
    return this.readOnlyContract.getSettlementEvent(eventIdHash);
  }

  async getPaymentEventCount() {
    if (!this.readOnlyContract) return 0;
    return this.readOnlyContract.getPaymentEventCount();
  }

  async getSettlementEventCount() {
    if (!this.readOnlyContract) return 0;
    return this.readOnlyContract.getSettlementEventCount();
  }
}

module.exports = new BlockchainService();

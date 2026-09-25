const { ethers } = require('ethers');
const config = require('./blockchain.config');
const abiRaw = require('./abi/AgriBazaarPaymentAudit.json');
const abi = Array.isArray(abiRaw) ? abiRaw : (abiRaw.abi || []);
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

  async init() {
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

      // Run asynchronous on-chain verification check
      this.verifyOnChainStartup().catch((err) => {
        console.warn('[BlockchainService] On-chain verification warning:', err.message);
      });
    } catch (error) {
      console.error('[BlockchainService] Initialization failed:', error.message);
    }
  }

  async verifyOnChainStartup() {
    if (!this.provider || !this.config.contractAddress) return;
    const addr = formatAddress(this.config.contractAddress);
    if (!addr || addr === ethers.ZeroAddress) return;

    try {
      const code = await this.provider.getCode(addr);
      if (code === '0x') {
        console.warn(`[BlockchainService] ❌ CONTRACT UNINITIALIZED: No bytecode deployed at address ${addr} on chain ${this.config.chainId}.`);
        return;
      }

      const recPayFunc = new ethers.Interface(abi).getFunction('recordPaymentEvent');
      if (recPayFunc && !code.includes(recPayFunc.selector.slice(2))) {
        console.warn(`[BlockchainService] ⚠️ STUB CONTRACT DETECTED: Address ${addr} does NOT contain selector ${recPayFunc.selector} (recordPaymentEvent). Writes will revert until contract is deployed.`);
        return;
      }

      if (this.readOnlyContract) {
        const owner = await this.readOnlyContract.owner().catch(() => null);
        const relayer = await this.readOnlyContract.relayer().catch(() => null);

        if (this.wallet && owner && relayer) {
          const signerAddr = this.wallet.address.toLowerCase();
          const isAuthorized = signerAddr === owner.toLowerCase() || signerAddr === relayer.toLowerCase();
          if (!isAuthorized) {
            console.warn(`[BlockchainService] ⚠️ RELAYER UNAUTHORIZED: Signer ${this.wallet.address} is not authorized on-chain (Owner: ${owner}, Relayer: ${relayer}).`);
          } else {
            console.log(`[BlockchainService] ✅ Contract verified & Relayer ${this.wallet.address} authorized on-chain!`);
          }
        }
      }
    } catch (err) {
      console.warn('[BlockchainService] On-chain startup check error:', err.message);
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

    // Run staticCall pre-flight to capture and decode exact revert reasons
    try {
      await this.contract[methodName].staticCall(...args);
    } catch (staticErr) {
      let decodedReason = staticErr.reason || staticErr.message;
      if (staticErr.data) {
        try {
          const parsed = this.contract.interface.parseError(staticErr.data);
          if (parsed) decodedReason = `Custom error ${parsed.name}(${parsed.args.join(', ')})`;
        } catch {
          // Keep default message
        }
      }
      console.error(`[BlockchainService] ${methodName} staticCall pre-flight failed: ${decodedReason}`);
      throw new BlockchainTxError(`Smart contract execution reverted in ${methodName}: ${decodedReason}`);
    }

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
   * Includes duplicate protection (idempotency check).
   */
  /**
   * Records an immutable payment event on-chain using hashed references.
   * Includes duplicate protection (idempotency check).
   */
  async recordPaymentEvent(paymentId, orderGroupId, buyerId, sellerSplitsInput = [], razorpayPaymentId, amountPaise, statusInt = 2, itemsSummary = '') {
    const paymentIdStr = String(paymentId);
    const orderGroupIdStr = String(orderGroupId || paymentId);
    const buyerIdStr = String(buyerId);
    const rzpRefStr = String(razorpayPaymentId || paymentIdStr);
    const summaryStr = String(itemsSummary || 'Agricultural Produce');

    const eventIdHash = hashId(`evt_pay_${paymentIdStr}_${statusInt}`);
    const paymentIdHash = hashId(`AGR-PAY-${paymentIdStr}`);
    const orderIdHash = hashId(`AGR-GRP-${orderGroupIdStr}`);
    const buyerIdHash = hashId(`AGR-B-${buyerIdStr}`);
    const paymentReferenceHash = hashId(rzpRefStr);
    const itemsSummaryHash = hashId(summaryStr);
    const amountRupees = BigInt(Math.round(Number(amountPaise) / 100));

    const sellerSplits = (Array.isArray(sellerSplitsInput) ? sellerSplitsInput : []).map(s => {
      const fId = String(s.farmerId || s.sellerId || s);
      const sPaise = BigInt(s.sellerAmountPaise || s.amountPaise || (s.amountRupees ? Math.round(s.amountRupees * 100) : 0));
      const sRupees = BigInt(Math.round(Number(sPaise) / 100));
      const sSummary = String(s.itemsSummary || s.sellerItemsSummary || 'Agricultural Produce');
      return {
        sellerIdHash: hashId(`AGR-F-${fId}`),
        sellerAmountRupees: sRupees,
        sellerAmountPaise: sPaise,
        sellerItemsSummary: sSummary,
      };
    });

    // Idempotency check: check if event already recorded on-chain
    if (this.readOnlyContract) {
      const exists = await this.readOnlyContract.eventExists(eventIdHash).catch(() => false);
      if (exists) {
        console.log(`[BlockchainService] Payment event ${eventIdHash} already recorded on-chain. Skipping duplicate.`);
        return {
          success: true,
          alreadyExists: true,
          eventIdHash,
          contractAddress: this.config.contractAddress,
          chainId: this.config.chainId,
        };
      }
    }

    const input = {
      eventIdHash,
      paymentIdHash,
      orderIdHash,
      buyerIdHash,
      paymentReferenceHash,
      itemsSummaryHash,
      itemsSummary: summaryStr,
      amountRupees,
      amountPaise: BigInt(amountPaise),
      status: Number(statusInt),
      sellerSplits,
    };

    return this.sendTransaction('recordPaymentEvent', [input]);
  }

  /**
   * Records an immutable seller settlement split event on-chain.
   * Includes duplicate protection (idempotency check).
   */
  async recordSettlementEvent(settlementId, orderId, sellerId, sellerAmountPaise, statusInt = 2) {
    const settlementIdStr = String(settlementId);
    const orderIdStr = String(orderId);
    const sellerIdStr = String(sellerId);
    const sellerAmountRupees = BigInt(Math.round(Number(sellerAmountPaise) / 100));

    const eventIdHash = hashId(`evt_settle_${settlementIdStr}_${statusInt}`);
    const settlementIdHash = hashId(`AGR-S-${settlementIdStr}`);
    const orderIdHash = hashId(`AGR-O-${orderIdStr}`);
    const sellerIdHash = hashId(`AGR-F-${sellerIdStr}`);

    // Idempotency check: check if event already recorded on-chain
    if (this.readOnlyContract) {
      const exists = await this.readOnlyContract.eventExists(eventIdHash).catch(() => false);
      if (exists) {
        console.log(`[BlockchainService] Settlement event ${eventIdHash} already recorded on-chain. Skipping duplicate.`);
        return {
          success: true,
          alreadyExists: true,
          eventIdHash,
          contractAddress: this.config.contractAddress,
          chainId: this.config.chainId,
        };
      }
    }

    const input = {
      eventIdHash,
      settlementIdHash,
      orderIdHash,
      sellerIdHash,
      sellerAmountRupees,
      sellerAmountPaise: BigInt(sellerAmountPaise),
      status: Number(statusInt),
    };

    return this.sendTransaction('recordSettlementEvent', [input]);
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

  async getAllPaymentEvents() {
    if (!this.readOnlyContract) return [];
    try {
      const count = await this.readOnlyContract.getPaymentEventCount();
      const numCount = Number(count);
      const events = [];
      const paymentStatusMap = ['CREATED', 'AUTHORIZED', 'CAPTURED', 'FAILED', 'REFUNDED'];

      for (let i = 0; i < numCount; i++) {
        const eventIdHash = await this.readOnlyContract.getPaymentEventIdAtIndex(i);
        const evt = await this.readOnlyContract.getPaymentEvent(eventIdHash);
        let rawSplits = [];
        try {
          if (evt.sellerSplits) rawSplits = Array.from(evt.sellerSplits);
        } catch {
          rawSplits = [];
        }
        const splits = rawSplits.map(s => ({
          sellerIdHash: s.sellerIdHash || s[0] || '',
          sellerAmountRupees: s.sellerAmountRupees !== undefined ? Number(s.sellerAmountRupees).toFixed(2) : (Number(s.sellerAmountPaise || s[2] || 0) / 100).toFixed(2),
          sellerAmountPaise: Number(s.sellerAmountPaise || s[2] || 0),
          sellerItemsSummary: s.sellerItemsSummary || s[3] || '',
        }));
        const sellerIdHashes = splits.map(s => s.sellerIdHash);

        events.push({
          eventIdHash: evt.eventIdHash,
          paymentIdHash: evt.paymentIdHash,
          orderIdHash: evt.orderIdHash,
          buyerIdHash: evt.buyerIdHash,
          sellerIdHashes,
          sellerSplits: splits,
          paymentReferenceHash: evt.paymentReferenceHash,
          itemsSummaryHash: evt.itemsSummaryHash || '',
          itemsSummary: evt.itemsSummary || 'Agricultural Produce',
          amountPaise: Number(evt.amountPaise || 0),
          amountRupees: evt.amountRupees ? Number(evt.amountRupees).toFixed(2) : (Number(evt.amountPaise || 0) / 100).toFixed(2),
          status: Number(evt.status),
          statusText: paymentStatusMap[Number(evt.status)] || 'UNKNOWN',
          recordedAt: new Date(Number(evt.recordedAt || 0) * 1000).toISOString(),
          timestampUnix: Number(evt.recordedAt || 0),
        });
      }
      return events.reverse(); // Return most recent first
    } catch (err) {
      console.error('[BlockchainService] getAllPaymentEvents failed:', err.message);
      return [];
    }
  }

  async getAllSettlementEvents() {
    if (!this.readOnlyContract) return [];
    try {
      const count = await this.readOnlyContract.getSettlementEventCount();
      const numCount = Number(count);
      const events = [];
      const settlementStatusMap = ['PENDING', 'PROCESSING', 'TRANSFERRED', 'FAILED', 'REVERSED', 'REFUNDED'];

      for (let i = 0; i < numCount; i++) {
        const eventIdHash = await this.readOnlyContract.getSettlementEventIdAtIndex(i);
        const evt = await this.readOnlyContract.getSettlementEvent(eventIdHash);
        events.push({
          eventIdHash: evt.eventIdHash,
          settlementIdHash: evt.settlementIdHash,
          orderIdHash: evt.orderIdHash,
          sellerIdHash: evt.sellerIdHash,
          sellerAmountPaise: Number(evt.sellerAmountPaise),
          sellerAmountRupees: (Number(evt.sellerAmountPaise) / 100).toFixed(2),
          status: Number(evt.status),
          statusText: settlementStatusMap[Number(evt.status)] || 'UNKNOWN',
          recordedAt: new Date(Number(evt.recordedAt) * 1000).toISOString(),
          timestampUnix: Number(evt.recordedAt),
        });
      }
      return events.reverse(); // Return most recent first
    } catch (err) {
      console.error('[BlockchainService] getAllSettlementEvents failed:', err.message);
      return [];
    }
  }
}

module.exports = new BlockchainService();

const blockchainConfig = require('../blockchain/blockchain.config');
const blockchainService = require('../blockchain/blockchain.service');

// @desc    Get blockchain audit contract status and counts
// @route   GET /api/blockchain/audit/info
exports.getAuditInfo = async (req, res, next) => {
  try {
    const paymentCount = await blockchainService.getPaymentEventCount().catch(() => 0);
    const settlementCount = await blockchainService.getSettlementEventCount().catch(() => 0);

    res.json({
      success: true,
      enabled: blockchainConfig.enabled,
      network: blockchainConfig.network,
      chainId: blockchainConfig.chainId,
      contractAddress: blockchainConfig.contractAddress,
      explorerBaseUrl: blockchainConfig.explorerBaseUrl,
      auditStats: {
        paymentEventCount: Number(paymentCount),
        settlementEventCount: Number(settlementCount),
      },
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get blockchain audit provenance status for an event hash
// @route   GET /api/blockchain/audit/:eventIdHash
exports.getAuditStatus = async (req, res, next) => {
  try {
    const { eventIdHash } = req.params;

    const event = await blockchainService.getPaymentEvent(eventIdHash).catch(() => null);

    if (!event || !event.eventIdHash || event.eventIdHash === '0x0000000000000000000000000000000000000000000000000000000000000000') {
      return res.json({
        success: true,
        verified: false,
        status: 'UNRECORDED',
        message: 'No on-chain audit record found for this hash.',
        network: blockchainConfig.network,
        chainId: blockchainConfig.chainId,
        contractAddress: blockchainConfig.contractAddress,
      });
    }

    res.json({
      success: true,
      verified: true,
      status: 'CONFIRMED',
      event: {
        eventIdHash: event.eventIdHash,
        paymentIdHash: event.paymentIdHash,
        orderIdHash: event.orderIdHash,
        buyerIdHash: event.buyerIdHash,
        amountPaise: Number(event.amountPaise),
        status: Number(event.status),
        recordedAt: new Date(Number(event.recordedAt) * 1000).toISOString(),
      },
      network: blockchainConfig.network,
      chainId: blockchainConfig.chainId,
      contractAddress: blockchainConfig.contractAddress,
    });
  } catch (error) {
    next(error);
  }
};

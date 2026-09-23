const MarketplaceSettlement = require('../models/MarketplaceSettlement');
const Farmer = require('../models/Farmer');
const razorpayRouteService = require('./razorpayRouteService');
const blockchainService = require('../blockchain/blockchain.service');

const statusMap = { PENDING: 0, PROCESSING: 1, TRANSFERRED: 2, FAILED: 3, REVERSED: 4 };

class SettlementService {
  getCommissionRate() {
    const raw = parseFloat(process.env.MARKETPLACE_COMMISSION_PERCENT);
    return !isNaN(raw) && raw >= 0 && raw <= 100 ? raw / 100 : 0.10; // Default 10%
  }

  async processOrderSettlement(payment, order) {
    if (!payment || !order) return null;
    if (payment.status !== 'CAPTURED') return null;

    const farmerUserId = order.farmerId;
    const grossAmount = Number(order.totalAmount);
    if (!farmerUserId || isNaN(grossAmount) || grossAmount <= 0) return null;

    // Server-side calculation of platform commission and seller payout
    const commissionRate = this.getCommissionRate();
    const platformCommission = Math.round(grossAmount * commissionRate * 100) / 100;
    const sellerAmount = Math.max(0, Math.round((grossAmount - platformCommission) * 100) / 100);

    // Idempotent settlement record retrieval / creation
    let settlement = await MarketplaceSettlement.findOne({ orderId: order._id, farmerId: farmerUserId });

    if (settlement && settlement.status === 'TRANSFERRED') {
      console.info('[SettlementService] Settlement already transferred for order:', order._id.toString());
      return settlement;
    }

    if (!settlement) {
      settlement = new MarketplaceSettlement({
        orderId: order._id,
        farmerId: farmerUserId,
        grossAmount,
        platformCommission,
        sellerAmount,
        currency: 'INR',
        status: 'PENDING',
        razorpayPaymentId: payment.razorpayPaymentId || payment.razorpayOrderId || '',
      });
    } else {
      settlement.grossAmount = grossAmount;
      settlement.platformCommission = platformCommission;
      settlement.sellerAmount = sellerAmount;
      settlement.razorpayPaymentId = payment.razorpayPaymentId || payment.razorpayOrderId || settlement.razorpayPaymentId;
    }

    // Step 11 Checks: Verify Farmer & Route activation status
    const farmer = await Farmer.findOne({ userId: farmerUserId });
    const isRouteActive = razorpayRouteService.isRouteEnabled();

    if (!farmer) {
      settlement.status = 'PENDING';
      settlement.failureReason = 'Farmer profile not found for order item';
      await settlement.save();
      return settlement;
    }

    settlement.razorpayLinkedAccountId = farmer.razorpayLinkedAccountId || null;

    const canTransfer = isRouteActive &&
                        farmer.razorpaySellerStatus === 'ACTIVE' &&
                        farmer.razorpayLinkedAccountId &&
                        farmer.razorpaySettlementEnabled;

    if (!canTransfer) {
      const reason = !isRouteActive
        ? 'Marketplace settlement setup is pending Razorpay activation.'
        : `Farmer Razorpay account status is ${farmer.razorpaySellerStatus || 'NOT_STARTED'}.`;
      settlement.status = 'PENDING';
      settlement.failureReason = reason;
      await settlement.save();
      console.info('[SettlementService] Settlement recorded as PENDING:', { orderId: order._id.toString(), reason });
      return settlement;
    }

    // Initiate documented Razorpay Route transfer
    try {
      settlement.status = 'PROCESSING';
      await settlement.save();

      const transferAmountPaise = Math.round(sellerAmount * 100);
      const razorpayResponse = await razorpayRouteService.transferToSeller(
        payment.razorpayPaymentId,
        [
          {
            account: farmer.razorpayLinkedAccountId,
            amount: transferAmountPaise,
            currency: 'INR',
            notes: { orderId: order._id.toString(), farmerId: farmerUserId.toString() },
          },
        ]
      );

      const transferItem = razorpayResponse.items?.[0] || razorpayResponse;
      settlement.status = 'TRANSFERRED';
      settlement.razorpayTransferId = transferItem.id || `trf_${Date.now()}`;
      settlement.failureReason = '';
      await settlement.save();
    } catch (err) {
      settlement.status = 'FAILED';
      settlement.failureReason = err.message || 'Razorpay Route transfer failed';
      await settlement.save();
      console.error('[SettlementService] Transfer execution failed:', err.message);
    }

    // Record Settlement Audit Event on Blockchain asynchronously
    const orderId = order._id.toString();
    const settlementId = settlement._id.toString();
    const sellerId = farmerUserId.toString();
    const sellerAmountPaise = Math.round(Number(settlement.sellerAmount) * 100);
    const statusInt = statusMap[settlement.status] !== undefined ? statusMap[settlement.status] : 0;

    blockchainService.recordSettlementEvent(
      settlementId,
      orderId,
      sellerId,
      sellerAmountPaise,
      statusInt
    ).catch(err => console.error('[SettlementService] Blockchain settlement audit error:', err.message));

    return settlement;
  }

  async processRefundSettlement(orderId, refundAmount) {
    const settlements = await MarketplaceSettlement.find({ orderId });
    for (const s of settlements) {
      if (s.status === 'TRANSFERRED' && s.razorpayTransferId && razorpayRouteService.isRouteEnabled()) {
        try {
          const reverseAmount = Math.min(s.sellerAmount, refundAmount || s.sellerAmount);
          await razorpayRouteService.reverseTransfer(s.razorpayTransferId, reverseAmount);
          s.status = 'REVERSED';
          await s.save();
        } catch (err) {
          console.error('[SettlementService] Reversal failed for transfer:', s.razorpayTransferId, err.message);
        }
      } else if (s.status === 'PENDING') {
        s.status = 'REFUNDED';
        await s.save();
      }
    }
  }
}

module.exports = new SettlementService();

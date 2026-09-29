/**
 * Service Wrapper for Isolated Blockchain Module
 * Bridges application requests to the backend/blockchain/ module.
 */

const blockchainModule = require('../blockchain/blockchain.service');
const { hashId, hashReference, toPaise } = require('../blockchain/blockchain.utils');

class ApplicationBlockchainService {
  async registerFarmer(farmerId, farmerWallet) {
    return blockchainModule.registerFarmerWallet(farmerId, farmerWallet);
  }

  async verifyFarmer(farmerWallet, isVerified, verificationData) {
    return blockchainModule.updateFarmerVerification(farmerWallet, isVerified, verificationData);
  }

  async registerBuyer(buyerId, buyerWallet) {
    return blockchainModule.registerBuyerWallet(buyerId, buyerWallet);
  }

  async createListing(productId, farmerWallet, productData) {
    return blockchainModule.createListingRecord(productId, farmerWallet, productData);
  }

  async updateListingStatus(productId, active) {
    return blockchainModule.updateListingStatus(productId, active);
  }

  async recordOrder(orderId, buyerWallet, farmerWallets, totalAmountPaise, orderData) {
    return blockchainModule.recordMarketplaceOrder(orderId, buyerWallet, farmerWallets, totalAmountPaise, orderData);
  }

  async recordPaymentCaptured(orderId, razorpayPaymentId, amountCapturedPaise) {
    return blockchainModule.recordPaymentCaptured(orderId, razorpayPaymentId, amountCapturedPaise);
  }

  async recordSettlementSplit(orderId, settlementId, farmerWallet, sellerAmountPaise, status) {
    return blockchainModule.recordSettlementSplit(orderId, settlementId, farmerWallet, sellerAmountPaise, status);
  }

  async updateOrderStatus(orderId, statusEnumInt) {
    return blockchainModule.updateOrderStatus(orderId, statusEnumInt);
  }

  async getListing(productId) {
    return blockchainModule.getListing(productId);
  }

  async getOrder(orderId) {
    return blockchainModule.getOrder(orderId);
  }

  async getSettlement(settlementId) {
    return blockchainModule.getSettlement(settlementId);
  }
}

module.exports = new ApplicationBlockchainService();

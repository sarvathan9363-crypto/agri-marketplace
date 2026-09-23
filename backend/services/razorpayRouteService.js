const Farmer = require('../models/Farmer');

const createError = (message, code, statusCode = 400) => {
  const err = new Error(message);
  err.code = code;
  err.statusCode = statusCode;
  return err;
};

class RazorpayRouteService {
  isRouteEnabled() {
    return process.env.RAZORPAY_ROUTE_ENABLED === 'true';
  }

  async razorpayRequest(path, options = {}) {
    const keyId = process.env.RAZORPAY_KEY_ID || 'rzp_test_Tekde5wfBplVZv';
    const keySecret = process.env.RAZORPAY_KEY_SECRET || 'Lcyjs0mVJD25ELb7ihHR9EhA';
    if (!keyId || !keySecret) {
      throw createError('Razorpay credentials not configured on backend.', 'RAZORPAY_NOT_CONFIGURED', 503);
    }
    const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');
    const response = await fetch(`https://api.razorpay.com/v1${path}`, {
      ...options,
      headers: {
        Authorization: `Basic ${authorization}`,
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
    });

    const body = await response.json().catch(() => ({}));
    if (!response.ok) {
      const errDescription = body.error?.description || 'Razorpay Route request failed';
      const errCode = body.error?.code || 'RAZORPAY_API_ERROR';
      const error = new Error(errDescription);
      error.code = errCode;
      error.status = response.status;
      error.raw = body;
      throw error;
    }
    return body;
  }

  async getAccountStatus(farmerUserId) {
    const farmer = await Farmer.findOne({ userId: farmerUserId });
    if (!farmer) throw createError('Farmer profile not found.', 'FARMER_NOT_FOUND', 404);

    return {
      success: true,
      routeEnabled: this.isRouteEnabled(),
      sellerStatus: farmer.razorpaySellerStatus || 'NOT_STARTED',
      linkedAccountId: farmer.razorpayLinkedAccountId ? `${farmer.razorpayLinkedAccountId.slice(0, 5)}••••` : null,
      accountReference: farmer.razorpayAccountReference || null,
      onboardingStatus: farmer.razorpayOnboardingStatus || null,
      activationStatus: farmer.razorpayActivationStatus || null,
      lastSyncedAt: farmer.razorpayLastSyncedAt || null,
      onboardingUrl: farmer.razorpayOnboardingUrl || null,
      rejectionReason: farmer.razorpayRejectionReason || null,
      settlementEnabled: farmer.razorpaySettlementEnabled || false,
      bankInfo: farmer.verification?.bankAccount?.accountNumberMasked
        ? {
            accountNumberMasked: farmer.verification.bankAccount.accountNumberMasked,
            bankName: farmer.verification.bankAccount.bankName || 'Connected Bank',
            ifsc: farmer.verification.bankAccount.ifsc || '••••',
          }
        : null,
    };
  }

  async initiateOnboarding(farmerUserId) {
    const farmer = await Farmer.findOne({ userId: farmerUserId });
    if (!farmer) throw createError('Farmer profile not found.', 'FARMER_NOT_FOUND', 404);

    if (!this.isRouteEnabled()) {
      return {
        success: false,
        code: 'ROUTE_NOT_ENABLED',
        message: 'Marketplace payment settlement is not enabled for this Razorpay account.',
        sellerStatus: farmer.razorpaySellerStatus || 'NOT_STARTED',
      };
    }

    if (farmer.razorpayLinkedAccountId && farmer.razorpaySellerStatus === 'ACTIVE') {
      return {
        success: true,
        message: 'Payment settlement account is already active.',
        sellerStatus: 'ACTIVE',
        linkedAccountId: farmer.razorpayLinkedAccountId,
      };
    }

    // Attempt official Razorpay linked account creation via Route API /v1/accounts
    try {
      const payload = {
        email: farmer.email,
        phone: farmer.mobileNumber,
        legal_business_name: farmer.farmName || farmer.fullName,
        business_type: 'individual',
        contact_name: farmer.fullName,
      };

      const account = await this.razorpayRequest('/accounts', {
        method: 'POST',
        body: JSON.stringify(payload),
      });

      farmer.razorpayLinkedAccountId = account.id;
      farmer.razorpayAccountReference = account.reference_id || `ref_${farmer._id.toString().slice(-8)}`;
      farmer.razorpaySellerStatus = account.status === 'activated' ? 'ACTIVE' : 'PENDING';
      farmer.razorpayActivationStatus = account.status || 'under_review';
      farmer.razorpaySettlementEnabled = account.status === 'activated';
      farmer.razorpayLastSyncedAt = new Date();
      await farmer.save();

      return {
        success: true,
        message: 'Razorpay seller account created successfully.',
        sellerStatus: farmer.razorpaySellerStatus,
        linkedAccountId: farmer.razorpayLinkedAccountId,
      };
    } catch (error) {
      console.warn('[RazorpayRouteService] Onboarding API call returned error:', error.message);
      // Route capability not activated on Razorpay merchant account
      farmer.razorpaySellerStatus = farmer.razorpaySellerStatus || 'NOT_STARTED';
      farmer.razorpayRejectionReason = error.message;
      farmer.razorpayLastSyncedAt = new Date();
      await farmer.save();

      return {
        success: false,
        code: error.status === 403 || error.status === 400 ? 'ROUTE_NOT_ENABLED' : 'RAZORPAY_API_ERROR',
        message: error.message || 'Marketplace settlement capability is pending Razorpay account activation.',
        sellerStatus: farmer.razorpaySellerStatus,
      };
    }
  }

  async syncAccountStatus(farmerUserId) {
    const farmer = await Farmer.findOne({ userId: farmerUserId });
    if (!farmer) throw createError('Farmer profile not found.', 'FARMER_NOT_FOUND', 404);

    if (!this.isRouteEnabled()) {
      return {
        success: false,
        code: 'ROUTE_NOT_ENABLED',
        message: 'Marketplace payment settlement setup is pending Razorpay activation.',
        sellerStatus: farmer.razorpaySellerStatus || 'NOT_STARTED',
      };
    }

    if (!farmer.razorpayLinkedAccountId) {
      return {
        success: false,
        code: 'LINKED_ACCOUNT_MISSING',
        message: 'No Razorpay linked account found. Please connect your payment account first.',
        sellerStatus: farmer.razorpaySellerStatus || 'NOT_STARTED',
      };
    }

    try {
      const account = await this.razorpayRequest(`/accounts/${encodeURIComponent(farmer.razorpayLinkedAccountId)}`);
      if (account.status === 'activated') {
        farmer.razorpaySellerStatus = 'ACTIVE';
        farmer.razorpaySettlementEnabled = true;
      } else if (account.status === 'rejected' || account.status === 'suspended') {
        farmer.razorpaySellerStatus = account.status === 'rejected' ? 'REJECTED' : 'SUSPENDED';
        farmer.razorpaySettlementEnabled = false;
        farmer.razorpayRejectionReason = account.rejection_reason || 'Verification required by gateway';
      } else {
        farmer.razorpaySellerStatus = 'PENDING';
        farmer.razorpaySettlementEnabled = false;
      }

      farmer.razorpayActivationStatus = account.status;
      farmer.razorpayLastSyncedAt = new Date();
      await farmer.save();

      return {
        success: true,
        sellerStatus: farmer.razorpaySellerStatus,
        activationStatus: farmer.razorpayActivationStatus,
        settlementEnabled: farmer.razorpaySettlementEnabled,
        lastSyncedAt: farmer.razorpayLastSyncedAt,
      };
    } catch (error) {
      console.warn('[RazorpayRouteService] Account sync failed:', error.message);
      return {
        success: false,
        code: 'RAZORPAY_API_ERROR',
        message: error.message,
        sellerStatus: farmer.razorpaySellerStatus,
      };
    }
  }

  async transferToSeller(paymentId, transfers) {
    if (!this.isRouteEnabled()) {
      throw createError('Marketplace split payment is disabled.', 'ROUTE_NOT_ENABLED', 400);
    }

    return this.razorpayRequest(`/payments/${encodeURIComponent(paymentId)}/transfers`, {
      method: 'POST',
      body: JSON.stringify({ transfers }),
    });
  }

  async reverseTransfer(transferId, amount) {
    if (!this.isRouteEnabled()) {
      throw createError('Marketplace split payment is disabled.', 'ROUTE_NOT_ENABLED', 400);
    }

    return this.razorpayRequest(`/transfers/${encodeURIComponent(transferId)}/reversals`, {
      method: 'POST',
      body: JSON.stringify({ amount: Math.round(amount * 100) }),
    });
  }
}

module.exports = new RazorpayRouteService();

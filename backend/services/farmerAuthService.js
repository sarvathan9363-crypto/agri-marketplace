const mongoose = require('mongoose');

/**
 * Normalizes an Indian phone number into standard 10-digit format.
 * Examples:
 *   "+91 98765 43210" -> "9876543210"
 *   "09876543210"     -> "9876543210"
 *   "+919876543210"   -> "9876543210"
 *   "9876543210"      -> "9876543210"
 * 
 * @param {string} phone
 * @returns {string}
 */
function normalizePhoneNumber(phone) {
  if (!phone || typeof phone !== 'string') return '';
  const digits = phone.replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) {
    return digits.substring(2);
  }
  if (digits.length === 11 && digits.startsWith('0')) {
    return digits.substring(1);
  }
  return digits;
}

/**
 * Authenticates or resolves a caller's identity via their incoming phone number.
 * 
 * NOTE ON SECURITY ARCHITECTURE:
 * Caller ID lookup maps an incoming call to a known farmer profile for personalization.
 * For high-security environments, an IVR PIN or voice OTP verification step can be added.
 * If no registered farmer matches the caller ID, the session continues as an unauthenticated guest.
 * 
 * @param {string} rawPhone - Incoming phone number from Exotel (e.g. "+919876543210")
 * @returns {Promise<{ authenticated: boolean, farmer: Object|null, reason: string }>}
 */
async function authenticateFarmerByPhone(rawPhone) {
  const normalized = normalizePhoneNumber(rawPhone);

  if (!normalized || normalized.length < 10) {
    return {
      authenticated: false,
      farmer: null,
      reason: 'INVALID_PHONE_NUMBER'
    };
  }

  // Ensure MongoDB connection is ready before querying
  if (mongoose.connection.readyState !== 1) {
    return {
      authenticated: false,
      farmer: null,
      reason: 'DATABASE_OFFLINE'
    };
  }

  try {
    const Farmer = require('../models/Farmer');
    const possibleFormats = [
      normalized,
      `+91${normalized}`,
      `91${normalized}`,
      `0${normalized}`
    ];

    const farmer = await Farmer.findOne({
      mobileNumber: { $in: possibleFormats }
    });

    if (farmer) {
      return {
        authenticated: true,
        farmer: {
          farmerId: farmer._id,
          farmerUserId: farmer.userId,
          farmerName: farmer.farmName || farmer.fullName,
          farmerVerificationStatus: farmer.verificationStatus,
          mobileNumber: farmer.mobileNumber,
          location: farmer.location
        },
        reason: 'MATCH_FOUND'
      };
    }

    return {
      authenticated: false,
      farmer: null,
      reason: 'FARMER_NOT_REGISTERED'
    };

  } catch (error) {
    console.error('[AgriVoice][Auth] Error querying farmer by phone:', error.message);
    return {
      authenticated: false,
      farmer: null,
      reason: 'QUERY_ERROR'
    };
  }
}

module.exports = {
  normalizePhoneNumber,
  authenticateFarmerByPhone
};

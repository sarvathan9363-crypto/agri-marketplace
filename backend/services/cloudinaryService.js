const cloudinary = require('../config/cloudinary');
const crypto = require('crypto');

/**
 * Maps verification subcategory enum to standardized Cloudinary folder path
 */
const getVerificationSubfolder = (subCategory) => {
  const map = {
    IDENTITY: 'identity/documents',
    FARMER_ID: 'farmer-id/documents',
    LAND: 'land/documents',
    PAN: 'pan/documents',
    BANK: 'bank/documents',
    GST: 'gst/documents',
    REGISTRATION: 'registration/documents',
    AUTHORIZATION: 'authorization/documents',
    UDYAM: 'udyam/documents',
    FSSAI: 'fssai/documents',
    PM_KISAN: 'pm-kisan/documents',
    ADDRESS: 'address/documents',
    BUSINESS: 'business/documents',
    REPRESENTATIVE: 'representative/documents',
    OTHER: 'other/documents',
  };
  return map[subCategory?.toUpperCase()] || `${(subCategory || 'other').toLowerCase()}/documents`;
};

/**
 * Constructs the canonical Cloudinary folder structure
 * Pattern: agri_bazaar/users/{userId}/[category]/...
 */
const getCloudinaryFolder = ({ userId, category, subCategory, entityId }) => {
  if (!userId) {
    throw new Error('UserId is required to construct Cloudinary folder structure.');
  }

  const baseFolder = `agri_bazaar/users/${userId}`;

  switch (category?.toUpperCase()) {
    case 'PROFILE':
      return `${baseFolder}/profile/avatar`;

    case 'VERIFICATION': {
      const subFolder = getVerificationSubfolder(subCategory);
      return `${baseFolder}/verification/${subFolder}`;
    }

    case 'PRODUCT': {
      const prodId = entityId || 'temp';
      const typeSubFolder = subCategory?.toUpperCase() === 'DOCUMENTS' ? 'documents' : 'images';
      return `${baseFolder}/products/${prodId}/${typeSubFolder}`;
    }

    case 'ORDER': {
      const ordId = entityId || 'temp';
      return `${baseFolder}/orders/${ordId}/documents`;
    }

    default:
      return `${baseFolder}/other/documents`;
  }
};

/**
 * Generates a clean, unique Public ID filename
 * Example: PATTA_1726834920123_a8f92c
 */
const generatePublicIdFilename = (documentType) => {
  const cleanDocType = (documentType || 'DOCUMENT')
    .toUpperCase()
    .replace(/[^A-Z0-9_]/g, '_');
  const timestamp = Date.now();
  const randomHex = crypto.randomBytes(3).toString('hex');
  return `${cleanDocType}_${timestamp}_${randomHex}`;
};

/**
 * Uploads a file buffer directly to Cloudinary via stream
 */
const uploadBufferToCloudinary = (fileBuffer, options = {}) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );
    uploadStream.end(fileBuffer);
  });
};

/**
 * Destroys an existing asset from Cloudinary
 */
const destroyCloudinaryAsset = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) return null;
    const result = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
      invalidate: true,
    });
    return result;
  } catch (error) {
    console.error(`Failed to delete Cloudinary asset (${publicId}):`, error);
    // Suppress error so DB deletion or replace can proceed gracefully
    return null;
  }
};

module.exports = {
  getCloudinaryFolder,
  generatePublicIdFilename,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
};

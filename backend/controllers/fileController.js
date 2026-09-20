const multer = require('multer');
const UploadedFile = require('../models/UploadedFile');
const Farmer = require('../models/Farmer');
const Buyer = require('../models/Buyer');
const Product = require('../models/Product');
const User = require('../models/User');
const {
  getCloudinaryFolder,
  generatePublicIdFilename,
  uploadBufferToCloudinary,
  destroyCloudinaryAsset,
} = require('../services/cloudinaryService');

// Multer memory storage configuration
const storage = multer.memoryStorage();

// Allowed File Specifications & Size Limits
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/jpg',
  'application/pdf',
];

const ALLOWED_DOCUMENT_TYPES = [
  // Farmer documents
  'IDENTITY_DOC',
  'FARMER_ID',
  'PATTA',
  'LAND_DOCUMENT',
  'BANK_PROOF',
  'PAN_DOC',
  'PM_KISAN_DOC',
  // FPO documents
  'REGISTRATION_CERT',
  'GST_CERT',
  'AUTHORIZATION_LETTER',
  'UDYAM_CERT',
  'FSSAI_CERT',
  // Buyer documents
  'ADDRESS_PROOF',
  'BUSINESS_CERT',
  'REPRESENTATIVE_AUTH',
  // Common / Product / Profile
  'AVATAR_IMAGE',
  'PRODUCT_IMAGE',
  'PRODUCT_DOCUMENT',
  'ORDER_DOCUMENT',
  'OTHER_DOC',
];

const uploadMiddleware = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES },
  fileFilter: (req, file, cb) => {
    if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      return cb(new Error('Invalid file type. Only PDF, JPG, JPEG, PNG, and WEBP formats are allowed.'));
    }
    cb(null, true);
  },
});

/**
 * Helper to update linked system models when a file asset is created/updated
 */
const updateLinkedEntity = async (user, uploadedFile) => {
  try {
    const { category, subCategory, secureUrl, entityId, documentType } = uploadedFile;

    // 1. Profile Avatar
    if (category === 'PROFILE') {
      await User.findByIdAndUpdate(user._id, { profileImage: secureUrl });
      await Farmer.findOneAndUpdate({ userId: user._id }, { profileImage: secureUrl });
      await Buyer.findOneAndUpdate({ userId: user._id }, { profileImage: secureUrl });
    }

    // 2. Product Image
    if (category === 'PRODUCT' && entityId && documentType === 'PRODUCT_IMAGE') {
      await Product.findByIdAndUpdate(entityId, {
        $addToSet: { images: secureUrl },
      });
    }

    // 3. Verification Document Flags for Farmers
    if (category === 'VERIFICATION' && user.role === 'FARMER') {
      const farmer = await Farmer.findOne({ userId: user._id });
      if (farmer) {
        if (subCategory === 'LAND') farmer.verification.landRecord.status = 'pending';
        if (subCategory === 'BANK') farmer.verification.bankAccount.status = 'pending';
        if (subCategory === 'PAN') farmer.verification.pan.status = 'pending';
        if (subCategory === 'FARMER_ID') farmer.verification.farmerRegistry.status = 'pending';
        if (subCategory === 'PM_KISAN') farmer.verification.pmKisan.status = 'pending';
        if (['REGISTRATION', 'GST', 'AUTHORIZATION', 'UDYAM', 'FSSAI'].includes(subCategory)) {
          farmer.verification.orgDocuments = farmer.verification.orgDocuments || {};
          farmer.verification.orgDocuments.status = 'under_review';
          if (subCategory === 'REGISTRATION') farmer.verification.orgDocuments.regCertUploaded = true;
          if (subCategory === 'PAN') farmer.verification.orgDocuments.panDocUploaded = true;
          if (subCategory === 'BANK') farmer.verification.orgDocuments.bankProofUploaded = true;
          if (subCategory === 'AUTHORIZATION') farmer.verification.orgDocuments.authDocUploaded = true;
          if (subCategory === 'GST') farmer.verification.orgDocuments.gstCertUploaded = true;
        }
        await farmer.save();
      }
    }

    // 4. Verification Document Flags for Buyers
    if (category === 'VERIFICATION' && user.role === 'BUYER') {
      const buyer = await Buyer.findOne({ userId: user._id });
      if (buyer) {
        buyer.verification = buyer.verification || {};
        buyer.verification.documents = buyer.verification.documents || {};
        buyer.verification.documents.status = 'under_review';
        if (subCategory === 'BUSINESS') buyer.verification.documents.businessCert = true;
        if (subCategory === 'PAN') buyer.verification.documents.panDoc = true;
        if (subCategory === 'BANK') buyer.verification.documents.bankProof = true;
        if (subCategory === 'AUTHORIZATION') buyer.verification.documents.authDoc = true;
        if (subCategory === 'GST') buyer.verification.documents.gstCert = true;
        if (subCategory === 'UDYAM') buyer.verification.documents.udyamCert = true;
        if (subCategory === 'FSSAI') buyer.verification.documents.fssaiCert = true;
        await buyer.save();
      }
    }
  } catch (err) {
    console.error('Error syncing file asset with linked entity:', err);
  }
};

/**
 * @desc    Upload file to Cloudinary & save metadata in MongoDB
 * @route   POST /api/files/upload
 * @access  Private
 */
exports.uploadFile = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded.' });
    }

    const userId = req.user._id.toString();
    const {
      category = 'VERIFICATION',
      subCategory = 'OTHER',
      documentType = 'OTHER_DOC',
      entityType = 'VERIFICATION',
      entityId = '',
    } = req.body;

    // Validate Document Type
    if (!ALLOWED_DOCUMENT_TYPES.includes(documentType)) {
      return res.status(400).json({
        success: false,
        message: `Invalid document type '${documentType}'.`,
      });
    }

    // Determine target Cloudinary folder
    const targetFolder = getCloudinaryFolder({
      userId,
      category,
      subCategory,
      entityId,
    });

    // Generate controlled Cloudinary Public ID
    const publicIdFilename = generatePublicIdFilename(documentType);
    const fullPublicId = `${targetFolder}/${publicIdFilename}`;

    // Upload to Cloudinary via stream
    const uploadResult = await uploadBufferToCloudinary(req.file.buffer, {
      folder: targetFolder,
      public_id: publicIdFilename,
      resource_type: 'auto',
    });

    // Check if replacing an existing file asset of same type for user/entity
    const existingQuery = {
      ownerId: req.user._id,
      category,
      subCategory,
      documentType,
      status: 'UPLOADED',
    };
    if (entityId) existingQuery.entityId = entityId;

    const existingFile = await UploadedFile.findOne(existingQuery);

    if (existingFile) {
      existingFile.status = 'REPLACED';
      await existingFile.save();
      // Destroy old Cloudinary asset silently
      destroyCloudinaryAsset(existingFile.cloudinaryPublicId, existingFile.resourceType);
    }

    // Create new UploadedFile record
    const uploadedFile = await UploadedFile.create({
      ownerId: req.user._id,
      ownerType: req.user.role || 'FARMER',
      category,
      subCategory,
      documentType,
      entityType,
      entityId,
      fileName: req.file.originalname,
      mimeType: req.file.mimetype,
      fileSize: req.file.size,
      cloudinaryPublicId: uploadResult.public_id,
      secureUrl: uploadResult.secure_url,
      resourceType: uploadResult.resource_type || 'auto',
      format: uploadResult.format || req.file.originalname.split('.').pop(),
      status: 'UPLOADED',
      uploadedBy: req.user._id,
    });

    // Sync metadata with system entities (Farmer, Buyer, Product, User)
    await updateLinkedEntity(req.user, uploadedFile);

    res.status(201).json({
      success: true,
      message: 'File uploaded successfully to Cloudinary.',
      file: uploadedFile,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get user's uploaded files
 * @route   GET /api/files
 * @access  Private
 */
exports.getUserFiles = async (req, res, next) => {
  try {
    const { category, subCategory, entityId } = req.query;
    const query = { ownerId: req.user._id, status: 'UPLOADED' };

    if (category) query.category = category;
    if (subCategory) query.subCategory = subCategory;
    if (entityId) query.entityId = entityId;

    const files = await UploadedFile.find(query).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: files.length,
      files,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Get single file asset by ID
 * @route   GET /api/files/:id
 * @access  Private
 */
exports.getFileById = async (req, res, next) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File asset not found.' });
    }

    // Ownership check
    if (file.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to view this file asset.' });
    }

    res.json({ success: true, file });
  } catch (error) {
    next(error);
  }
};

/**
 * @desc    Delete a document/file asset
 * @route   DELETE /api/files/:id
 * @access  Private
 */
exports.deleteFile = async (req, res, next) => {
  try {
    const file = await UploadedFile.findById(req.params.id);
    if (!file) {
      return res.status(404).json({ success: false, message: 'File asset not found.' });
    }

    // Authorize ownership
    if (file.ownerId.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({ success: false, message: 'Not authorized to delete this file asset.' });
    }

    // Destroy Cloudinary Asset
    await destroyCloudinaryAsset(file.cloudinaryPublicId, file.resourceType);

    // Update DB status or remove
    file.status = 'DELETED';
    await file.save();

    // Clean up entity arrays if product image
    if (file.category === 'PRODUCT' && file.entityId) {
      await Product.findByIdAndUpdate(file.entityId, {
        $pull: { images: file.secureUrl },
      });
    }

    res.json({
      success: true,
      message: 'File asset deleted successfully from Cloudinary and database.',
    });
  } catch (error) {
    next(error);
  }
};

exports.uploadMiddleware = uploadMiddleware;

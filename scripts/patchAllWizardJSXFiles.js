import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

// 1. Patch BuyerVerificationWizard.jsx
const buyerWizardPath = path.join(rootDir, 'frontend', 'src', 'pages', 'buyer', 'BuyerVerificationWizard.jsx');
let bw = fs.readFileSync(buyerWizardPath, 'utf8');

bw = bw.replace(
  `National Agricultural Buyer Verification Service`,
  `{t('buyerVerificationWizard.goiPortalBannerTitle', { defaultValue: 'National Agricultural Buyer Verification Service' })}`
);

bw = bw.replace(
  `Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal`,
  `{t('buyerVerificationWizard.goiPortalMinistryTag', { defaultValue: 'Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal' })}`
);

bw = bw.replace(
  `Buyer Type: {rawBuyerType}`,
  `{t('buyerVerificationWizard.buyerTypeLabel', { defaultValue: 'Buyer Type' })}: {rawBuyerType === 'BULK_BUYER' ? t('register.wholesaleBulkBuyer', { defaultValue: 'Wholesale Bulk Buyer' }) : rawBuyerType === 'BUSINESS' ? t('register.businessRetailer', { defaultValue: 'Business / Retailer' }) : t('register.individualConsumer', { defaultValue: 'Individual Consumer' })}`
);

bw = bw.replace(
  `Ref: ABV-BUYER-`,
  `{t('buyerVerificationWizard.referenceTag', { defaultValue: 'Ref' })}: ABV-BUYER-`
);

bw = bw.replace(
  `<span>{t('buyerVerificationWizard.saveExitToDashboard')}</span>`,
  `<span>{t('buyerVerificationWizard.saveExitToDashboard', { defaultValue: 'Save & Exit to Dashboard' })}</span>`
);

bw = bw.replace(
  `Verification Steps`,
  `{t('buyerVerificationWizard.verificationSteps', { defaultValue: 'Verification Steps' })}`
);

bw = bw.replace(
  `<span>STEP {currentStep} OF {steps.length}</span>`,
  `<span>{t('buyerVerificationWizard.stepProgressUpper', { current: currentStep, total: steps.length, defaultValue: \`STEP \${currentStep} OF \${steps.length}\` })}</span>`
);

// Placeholders & Field labels for Address step
bw = bw.replace(
  `placeholder={t('buyerVerificationWizard.flatHouseNoBuildingStreetArea')}`,
  `placeholder={t('buyerVerificationWizard.flatHouseNoBuildingStreetArea', { defaultValue: 'Flat, House no., Building, Street, Area' })}`
);

bw = bw.replace(
  `placeholder={t('buyerVerificationWizard.districtName')}`,
  `placeholder={t('buyerVerificationWizard.districtName', { defaultValue: 'District Name' })}`
);

bw = bw.replace(
  `placeholder={t('buyerVerificationWizard.cityOrTown')}`,
  `placeholder={t('buyerVerificationWizard.cityOrTown', { defaultValue: 'City or Town' })}`
);

bw = bw.replace(
  `placeholder={t('buyerVerificationWizard.6digitPinCode')}`,
  `placeholder={t('buyerVerificationWizard.6digitPinCode', { defaultValue: '6-digit PIN Code' })}`
);

bw = bw.replace(
  `<span>{t('buyerVerificationWizard.verifyAddressContinue')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyAddressContinue', { defaultValue: 'Verify Address & Continue' })}</span>`
);

bw = bw.replace(
  `<span>{t('buyerVerificationWizard.back')}</span>`,
  `<span>{t('buyerVerificationWizard.back', { defaultValue: 'Back' })}</span>`
);

// Identity Step Checkbox Consent Text
bw = bw.replace(
  `I provide my explicit consent to AgriBazaar portal to verify my identity details with official identity registries for buyer authentication.`,
  `{t('buyerVerificationWizard.explicitConsentNotice', { defaultValue: 'I provide my explicit consent to AgriBazaar portal to verify my identity details with official identity registries for buyer authentication.' })}`
);

fs.writeFileSync(buyerWizardPath, bw, 'utf8');
console.log('Successfully patched BuyerVerificationWizard.jsx');

// 2. Patch VerificationWizard.jsx (Farmer)
const farmerWizardPath = path.join(rootDir, 'frontend', 'src', 'pages', 'farmer', 'VerificationWizard.jsx');
let fw = fs.readFileSync(farmerWizardPath, 'utf8');

fw = fw.replace(
  `National Agricultural Farmer Verification Service`,
  `{t('farmerVerificationWizard.goiPortalBannerTitle', { defaultValue: 'National Agricultural Farmer Verification Service' })}`
);

fw = fw.replace(
  `Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal`,
  `{t('farmerVerificationWizard.goiPortalMinistryTag', { defaultValue: 'Ministry of Agriculture & Farmers Welfare • AgriBazaar Portal' })}`
);

fw = fw.replace(
  `Complete required verification steps to become a verified seller.`,
  `{t('farmerVerificationWizard.completeSellerStepsNotice', { defaultValue: 'Complete required verification steps to become a verified seller.' })}`
);

fw = fw.replace(
  `Verification Steps`,
  `{t('farmerVerificationWizard.verificationSteps', { defaultValue: 'Verification Steps' })}`
);

fs.writeFileSync(farmerWizardPath, fw, 'utf8');
console.log('Successfully patched VerificationWizard.jsx');

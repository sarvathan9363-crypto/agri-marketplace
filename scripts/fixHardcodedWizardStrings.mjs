import fs from 'fs';
import path from 'path';

function fixFile(filePath, replacements) {
  let content = fs.readFileSync(filePath, 'utf8');
  let count = 0;
  for (const { target, replacement } of replacements) {
    if (content.includes(target)) {
      content = content.replaceAll(target, replacement);
      count++;
    }
  }
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${path.basename(filePath)} with ${count} replacements.`);
}

// BuyerVerificationWizard replacements
const buyerReplacements = [
  { target: 'Loading Official Verification Portal...', replacement: "{t('buyerWizard.loadingPortal', { defaultValue: 'Loading Official Verification Portal...' })}" },
  { target: 'Mobile Authentication Protocol', replacement: "{t('buyerWizard.mobileProtocol', { defaultValue: 'Mobile Authentication Protocol' })}" },
  { target: 'Enter your 10-digit mobile number to receive a secure One-Time Password (OTP). OTP will not be stored permanently.', replacement: "{t('buyerWizard.mobileHelp', { defaultValue: 'Enter your 10-digit mobile number to receive a secure One-Time Password (OTP). OTP will not be stored permanently.' })}" },
  { target: '<span>Back</span>', replacement: "<span>{t('common.back', { defaultValue: 'Back' })}</span>" },
  { target: 'Authorized Identity Verification', replacement: "{t('buyerWizard.identityTitle', { defaultValue: 'Authorized Identity Verification' })}" },
  { target: 'Identity is validated securely via authorized verification reference. Full raw identity document numbers are never permanently stored.', replacement: "{t('buyerWizard.identityHelp', { defaultValue: 'Identity is validated securely via authorized verification reference. Full raw identity document numbers are never permanently stored.' })}" },
  { target: 'Aadhaar-based Authorized Verification', replacement: "{t('buyerWizard.aadhaarMethod', { defaultValue: 'Aadhaar-based Authorized Verification' })}" },
  { target: 'PAN-based Identity Verification', replacement: "{t('buyerWizard.panMethod', { defaultValue: 'PAN-based Identity Verification' })}" },
  { target: 'Voter ID / National Portal Verification', replacement: "{t('buyerWizard.voterMethod', { defaultValue: 'Voter ID / National Portal Verification' })}" },
  { target: 'Retailer / Agribusiness Dealer', replacement: "{t('buyerWizard.retailer', { defaultValue: 'Retailer / Agribusiness Dealer' })}" },
  { target: 'Wholesaler / Trader', replacement: "{t('buyerWizard.wholesaler', { defaultValue: 'Wholesaler / Trader' })}" },
  { target: 'Food Processor / Mill', replacement: "{t('buyerWizard.processor', { defaultValue: 'Food Processor / Mill' })}" },
  { target: 'Exporter / Institutional Buyer', replacement: "{t('buyerWizard.exporter', { defaultValue: 'Exporter / Institutional Buyer' })}" },
  { target: 'Proprietorship Firm', replacement: "{t('buyerWizard.proprietorship', { defaultValue: 'Proprietorship Firm' })}" },
  { target: 'Partnership Firm', replacement: "{t('buyerWizard.partnership', { defaultValue: 'Partnership Firm' })}" },
  { target: 'Private Limited Company', replacement: "{t('buyerWizard.pvtLtd', { defaultValue: 'Private Limited Company' })}" },
  { target: 'Verify Business Identity', replacement: "{t('buyerWizard.verifyBizIdentity', { defaultValue: 'Verify Business Identity' })}" },
  { target: 'Income Tax Department PAN Verification', replacement: "{t('buyerWizard.panTitle', { defaultValue: 'Income Tax Department PAN Verification' })}" },
  { target: 'Enter the 10-character Permanent Account Number issued in the legal name of the entity.', replacement: "{t('buyerWizard.panHelp', { defaultValue: 'Enter the 10-character Permanent Account Number issued in the legal name of the entity.' })}" },
  { target: 'Verify Business PAN', replacement: "{t('buyerWizard.verifyBizPan', { defaultValue: 'Verify Business PAN' })}" },
  { target: 'Goods and Services Tax Identification (GSTIN)', replacement: "{t('buyerWizard.gstinTitle', { defaultValue: 'Goods and Services Tax Identification (GSTIN)' })}" },
  { target: 'GSTIN verification is conditional. Small traders or exempt agricultural businesses can select "GSTIN Not Applicable".', replacement: "{t('buyerWizard.gstinHelp', { defaultValue: 'GSTIN verification is conditional. Small traders or exempt agricultural businesses can select \"GSTIN Not Applicable\".' })}" },
  { target: 'GSTIN Not Applicable', replacement: "{t('buyerWizard.gstinNA', { defaultValue: 'GSTIN Not Applicable' })}" },
  { target: 'Private / Public Limited Company (CIN)', replacement: "{t('buyerWizard.cinOption', { defaultValue: 'Private / Public Limited Company (CIN)' })}" },
  { target: 'Limited Liability Partnership (LLPIN)', replacement: "{t('buyerWizard.llpinOption', { defaultValue: 'Limited Liability Partnership (LLPIN)' })}" },
  { target: 'Registered Partnership Firm', replacement: "{t('buyerWizard.regPartnershipOption', { defaultValue: 'Registered Partnership Firm' })}" },
  { target: 'Registered Sole Proprietorship', replacement: "{t('buyerWizard.regSolePropOption', { defaultValue: 'Registered Sole Proprietorship' })}" },
  { target: 'Cooperative Society / Farmer Federation', replacement: "{t('buyerWizard.coopOption', { defaultValue: 'Cooperative Society / Farmer Federation' })}" },
  { target: 'Verify Registration', replacement: "{t('buyerWizard.verifyReg', { defaultValue: 'Verify Registration' })}" },
  { target: 'Owner / Proprietor', replacement: "{t('buyerWizard.roleProprietor', { defaultValue: 'Owner / Proprietor' })}" },
  { target: 'Partner', replacement: "{t('buyerWizard.rolePartner', { defaultValue: 'Partner' })}" },
  { target: 'Director', replacement: "{t('buyerWizard.roleDirector', { defaultValue: 'Director' })}" },
  { target: 'CEO / Managing Director', replacement: "{t('buyerWizard.roleCEO', { defaultValue: 'CEO / Managing Director' })}" },
  { target: 'Manager / Procurement Officer', replacement: "{t('buyerWizard.roleManager', { defaultValue: 'Manager / Procurement Officer' })}" },
  { target: 'Authorized Signatory', replacement: "{t('buyerWizard.roleSignatory', { defaultValue: 'Authorized Signatory' })}" },
  { target: 'I confirm I possess official board authorization / power of attorney to act as authorized buyer representative.', replacement: "{t('buyerWizard.repConfirmText', { defaultValue: 'I confirm I possess official board authorization / power of attorney to act as authorized buyer representative.' })}" },
  { target: 'Verify Bank Account', replacement: "{t('buyerWizard.verifyBankAccount', { defaultValue: 'Verify Bank Account' })}" },
  { target: 'Udyam MSME Registration', replacement: "{t('buyerWizard.udyamTitle', { defaultValue: 'Udyam MSME Registration' })}" },
  { target: 'Conditional check. Enter your Udyam Registration Number if registered as MSME enterprise, or select "Udyam Not Applicable".', replacement: "{t('buyerWizard.udyamHelp', { defaultValue: 'Conditional check. Enter your Udyam Registration Number if registered as MSME enterprise, or select \"Udyam Not Applicable\".' })}" },
  { target: 'Udyam Not Applicable', replacement: "{t('buyerWizard.udyamNA', { defaultValue: 'Udyam Not Applicable' })}" },
  { target: 'FSSAI / Commodity Trade License', replacement: "{t('buyerWizard.licenseTitle', { defaultValue: 'FSSAI / Commodity Trade License' })}" },
  { target: 'Show this only where buyer activity requires food safety/commodity trading permits. Select "Not Applicable" if non-food operations.', replacement: "{t('buyerWizard.licenseHelp', { defaultValue: 'Show this only where buyer activity requires food safety/commodity trading permits. Select \"Not Applicable\" if non-food operations.' })}" },
  { target: 'FSSAI Registration / License', replacement: "{t('buyerWizard.fssaiOpt', { defaultValue: 'FSSAI Registration / License' })}" },
  { target: 'APMC / Mandi Trade License', replacement: "{t('buyerWizard.apmcOpt', { defaultValue: 'APMC / Mandi Trade License' })}" },
  { target: 'Agricultural Commodity Trade License', replacement: "{t('buyerWizard.commodityOpt', { defaultValue: 'Agricultural Commodity Trade License' })}" },
  { target: 'License Not Applicable', replacement: "{t('buyerWizard.licenseNA', { defaultValue: 'License Not Applicable' })}" },
  { target: 'Upload clear scan or PDF copies of required business certificates. Max file size: 5MB.', replacement: "{t('buyerWizard.dossierHelp', { defaultValue: 'Upload clear scan or PDF copies of required business certificates. Max file size: 5MB.' })}" },
  { target: 'Back to Review', replacement: "{t('buyerWizard.backToReview', { defaultValue: 'Back to Review' })}" },
  { target: 'Finalize Buyer Verification', replacement: "{t('buyerWizard.finalizeVerification', { defaultValue: 'Finalize Buyer Verification' })}" },
];

fixFile('c:/Volume D/projects/temp/agri/frontend/src/pages/buyer/BuyerVerificationWizard.jsx', buyerReplacements);

// FarmerVerificationWizard replacements
const farmerReplacements = [
  { target: 'Aadhaar Authentication Protocol', replacement: "{t('farmerWizard.aadhaarProtocol', { defaultValue: 'Aadhaar Authentication Protocol' })}" },
  { target: 'Enter your 12-digit Aadhaar number to receive a One-Time Password (OTP) via UIDAI authorized gateway.', replacement: "{t('farmerWizard.aadhaarHelp', { defaultValue: 'Enter your 12-digit Aadhaar number to receive a One-Time Password (OTP) via UIDAI authorized gateway.' })}" },
  { target: 'Send Aadhaar OTP', replacement: "{t('farmerWizard.sendAadhaarOtp', { defaultValue: 'Send Aadhaar OTP' })}" },
  { target: 'Skip Step', replacement: "{t('common.skipStep', { defaultValue: 'Skip Step' })}" },
  { target: 'Next Step', replacement: "{t('common.nextStep', { defaultValue: 'Next Step' })}" },
  { target: 'Farmer Database Protocol', replacement: "{t('farmerWizard.databaseProtocol', { defaultValue: 'Farmer Database Protocol' })}" },
  { target: 'Enter your official Farmer / Agristack ID along with state and district to verify active agricultural registry status.', replacement: "{t('farmerWizard.databaseHelp', { defaultValue: 'Enter your official Farmer / Agristack ID along with state and district to verify active agricultural registry status.' })}" },
  { target: 'FARMER ID', replacement: "{t('farmerWizard.farmerIdLabel', { defaultValue: 'FARMER ID' })}" },
  { target: 'LOCATION', replacement: "{t('farmerWizard.locationLabel', { defaultValue: 'LOCATION' })}" },
  { target: '<span>Back</span>', replacement: "<span>{t('common.back', { defaultValue: 'Back' })}</span>" },
  { target: 'Land Holding Protocol', replacement: "{t('farmerWizard.landProtocol', { defaultValue: 'Land Holding Protocol' })}" },
  { target: 'Enter state, district, taluk, village, Patta / 7-12 number, survey number, and total acreage.', replacement: "{t('farmerWizard.landHelp', { defaultValue: 'Enter state, district, taluk, village, Patta / 7-12 number, survey number, and total acreage.' })}" },
  { target: 'PATTA / 7-12 NO.', replacement: "{t('farmerWizard.pattaLabel', { defaultValue: 'PATTA / 7-12 NO.' })}" },
  { target: 'SURVEY NO.', replacement: "{t('farmerWizard.surveyLabel', { defaultValue: 'SURVEY NO.' })}" },
  { target: 'EXTENT', replacement: "{t('farmerWizard.extentLabel', { defaultValue: 'EXTENT' })}" },
  { target: 'Land Type', replacement: "{t('farmerWizard.landType', { defaultValue: 'Land Type' })}" },
  { target: 'Irrigated / Wet', replacement: "{t('farmerWizard.irrigated', { defaultValue: 'Irrigated / Wet' })}" },
  { target: 'Dry / Rainfed', replacement: "{t('farmerWizard.rainfed', { defaultValue: 'Dry / Rainfed' })}" },
  { target: 'Horticulture', replacement: "{t('farmerWizard.horticulture', { defaultValue: 'Horticulture' })}" },
  { target: 'Bank Settlement Protocol', replacement: "{t('farmerWizard.bankProtocol', { defaultValue: 'Bank Settlement Protocol' })}" },
  { target: 'Link your active bank account for direct payments and automated sales settlements.', replacement: "{t('farmerWizard.bankHelp', { defaultValue: 'Link your active bank account for direct payments and automated sales settlements.' })}" },
  { target: 'ACCOUNT HOLDER', replacement: "{t('farmerWizard.accountHolderLabel', { defaultValue: 'ACCOUNT HOLDER' })}" },
  { target: 'BANK NAME', replacement: "{t('farmerWizard.bankNameLabel', { defaultValue: 'BANK NAME' })}" },
  { target: 'ACCOUNT NO.', replacement: "{t('farmerWizard.accountNoLabel', { defaultValue: 'ACCOUNT NO.' })}" },
  { target: 'Branch Name', replacement: "{t('farmerWizard.branchName', { defaultValue: 'Branch Name' })}" },
  { target: 'PAN Verification Protocol', replacement: "{t('farmerWizard.panProtocol', { defaultValue: 'PAN Verification Protocol' })}" },
  { target: 'PAN NUMBER', replacement: "{t('farmerWizard.panNoLabel', { defaultValue: 'PAN NUMBER' })}" },
  { target: 'MATCH STATUS', replacement: "{t('farmerWizard.matchStatusLabel', { defaultValue: 'MATCH STATUS' })}" },
  { target: 'Name as per PAN (Optional)', replacement: "{t('farmerWizard.panNameLabel', { defaultValue: 'Name as per PAN (Optional)' })}" },
  { target: 'PM-KISAN Scheme Protocol', replacement: "{t('farmerWizard.pmkisanProtocol', { defaultValue: 'PM-KISAN Scheme Protocol' })}" },
  { target: 'Optionally link PM-KISAN Beneficiary Reference for added seller credibility on the marketplace.', replacement: "{t('farmerWizard.pmkisanHelp', { defaultValue: 'Optionally link PM-KISAN Beneficiary Reference for added seller credibility on the marketplace.' })}" },
  { target: 'PM-KISAN Registration / Beneficiary Reference', replacement: "{t('farmerWizard.pmkisanRefLabel', { defaultValue: 'PM-KISAN Registration / Beneficiary Reference' })}" },
  { target: 'View Summary', replacement: "{t('farmerWizard.viewSummary', { defaultValue: 'View Summary' })}" },
  { target: 'Organization Registration Protocol', replacement: "{t('farmerWizard.orgRegProtocol', { defaultValue: 'Organization Registration Protocol' })}" },
  { target: 'Verify official FPO / FPC / Cooperative entity registration details.', replacement: "{t('farmerWizard.orgRegHelp', { defaultValue: 'Verify official FPO / FPC / Cooperative entity registration details.' })}" },
  { target: 'LEGAL NAME', replacement: "{t('farmerWizard.legalNameLabel', { defaultValue: 'LEGAL NAME' })}" },
  { target: 'REGISTRATION NO.', replacement: "{t('farmerWizard.regNoLabel', { defaultValue: 'REGISTRATION NO.' })}" },
  { target: 'FPO / FPC (Producer Company)', replacement: "{t('farmerWizard.fpoOpt', { defaultValue: 'FPO / FPC (Producer Company)' })}" },
  { target: 'Agricultural Cooperative Society', replacement: "{t('farmerWizard.coopSocietyOpt', { defaultValue: 'Agricultural Cooperative Society' })}" },
  { target: 'Farmer SHG / Partnership', replacement: "{t('farmerWizard.shgOpt', { defaultValue: 'Farmer SHG / Partnership' })}" },
  { target: 'Organization PAN Protocol', replacement: "{t('farmerWizard.orgPanProtocol', { defaultValue: 'Organization PAN Protocol' })}" },
  { target: 'Enter Permanent Account Number issued in the legal name of the organization.', replacement: "{t('farmerWizard.orgPanHelp', { defaultValue: 'Enter Permanent Account Number issued in the legal name of the organization.' })}" },
  { target: 'ORG PAN', replacement: "{t('farmerWizard.orgPanLabel', { defaultValue: 'ORG PAN' })}" },
  { target: 'GSTIN Registration Protocol', replacement: "{t('farmerWizard.gstinProtocol', { defaultValue: 'GSTIN Registration Protocol' })}" },
  { target: 'Provide 15-character GSTIN registration if registered, or mark GSTIN Not Applicable.', replacement: "{t('farmerWizard.gstinHelp', { defaultValue: 'Provide 15-character GSTIN registration if registered, or mark GSTIN Not Applicable.' })}" },
  { target: 'Verify GSTIN', replacement: "{t('farmerWizard.verifyGstin', { defaultValue: 'Verify GSTIN' })}" },
  { target: 'Authorized Official Protocol', replacement: "{t('farmerWizard.officialProtocol', { defaultValue: 'Authorized Official Protocol' })}" },
  { target: 'Verify identity and mobile authorization of the official representing the organization.', replacement: "{t('farmerWizard.officialHelp', { defaultValue: 'Verify identity and mobile authorization of the official representing the organization.' })}" },
  { target: 'Send Representative OTP', replacement: "{t('farmerWizard.sendRepOtp', { defaultValue: 'Send Representative OTP' })}" },
  { target: 'Verify Representative', replacement: "{t('farmerWizard.verifyRep', { defaultValue: 'Verify Representative' })}" },
  { target: 'Organization Settlement Account Protocol', replacement: "{t('farmerWizard.orgBankProtocol', { defaultValue: 'Organization Settlement Account Protocol' })}" },
  { target: 'Link primary settlement bank account of the FPO / FPC for marketplace direct credits.', replacement: "{t('farmerWizard.orgBankHelp', { defaultValue: 'Link primary settlement bank account of the FPO / FPC for marketplace direct credits.' })}" },
  { target: 'Organization Document Dossier', replacement: "{t('farmerWizard.orgDossierProtocol', { defaultValue: 'Organization Document Dossier' })}" },
  { target: 'Upload mandatory registration, tax, bank proof, and authorization files.', replacement: "{t('farmerWizard.orgDossierHelp', { defaultValue: 'Upload mandatory registration, tax, bank proof, and authorization files.' })}" },
  { target: 'Back to Review', replacement: "{t('farmerWizard.backToReview', { defaultValue: 'Back to Review' })}" },
  { target: 'Return to Dashboard', replacement: "{t('farmerWizard.returnToDashboard', { defaultValue: 'Return to Dashboard' })}" },
];

fixFile('c:/Volume D/projects/temp/agri/frontend/src/pages/farmer/VerificationWizard.jsx', farmerReplacements);

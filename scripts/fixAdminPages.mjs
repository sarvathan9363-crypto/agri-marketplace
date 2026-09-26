import fs from 'fs';
import path from 'path';

const SRC = path.resolve('c:/Volume D/projects/temp/agri/frontend/src');

function fixFile(relPath, replacements) {
  const file = path.join(SRC, relPath);
  if (!fs.existsSync(file)) {
    console.log(`File not found: ${file}`);
    return;
  }
  let content = fs.readFileSync(file, 'utf8');
  let count = 0;
  for (const [target, replacement] of Object.entries(replacements)) {
    if (content.includes(target)) {
      content = content.replace(target, replacement);
      count++;
    }
  }
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${relPath} (${count} replacements)`);
}

// 1. admin/Disputes.jsx
fixFile('pages/admin/Disputes.jsx', {
  "header: 'Complainant'": "header: t('adminDisputes.colComplainant', { defaultValue: 'COMPLAINANT' })",
  "header: 'Dispute Reason'": "header: t('adminDisputes.colReason', { defaultValue: 'DISPUTE REASON' })",
  "header: 'Status'": "header: t('adminDisputes.colStatus', { defaultValue: 'STATUS' })",
  "header: 'Actions'": "header: t('adminDisputes.colActions', { defaultValue: 'ACTIONS' })",
  "emptyTitle=\"No open disputes\"": "emptyTitle={t('adminDisputes.noDisputes', { defaultValue: 'No open disputes' })}",
  "emptyDescription=\"Platform trade operations are running smoothly with 0 open claims.\"": "emptyDescription={t('adminDisputes.noDisputesDesc', { defaultValue: 'Platform trade operations are running smoothly with 0 open claims.' })}",
  "placeholder=\"Admin response details...\"": "placeholder={t('adminDisputes.placeholderResponse', { defaultValue: 'Admin response details...' })}",
});

// 2. admin/Farmers.jsx
fixFile('pages/admin/Farmers.jsx', {
  "header: 'Farmer / FPO Name'": "header: t('adminFarmers.colFarmerName', { defaultValue: 'FARMER / FPO NAME' })",
  "header: 'Verification'": "header: t('adminFarmers.colVerification', { defaultValue: 'VERIFICATION' })",
  "header: 'Audit Provenance'": "header: t('adminFarmers.colAuditProvenance', { defaultValue: 'AUDIT PROVENANCE' })",
  "Farmers & FPOs Approval": "{t('adminFarmers.approvalHeadline', { defaultValue: 'Farmers & FPOs Approval' })}",
  "emptyTitle=\"No verification applications found\"": "emptyTitle={t('adminFarmers.noVerificationApps', { defaultValue: 'No verification applications found' })}",
  "placeholder=\"Provide reason for verification rejection...\"": "placeholder={t('adminFarmers.placeholderRejection', { defaultValue: 'Provide reason for verification rejection...' })}",
});

// 3. admin/Payments.jsx
fixFile('pages/admin/Payments.jsx', {
  "header: 'Payment Tx Reference'": "header: t('adminPayments.colTxRef', { defaultValue: 'PAYMENT TX REFERENCE' })",
  "header: 'Amount'": "header: t('adminPayments.colAmount', { defaultValue: 'AMOUNT' })",
  "header: 'Status'": "header: t('adminPayments.colStatus', { defaultValue: 'STATUS' })",
  "header: 'Date'": "header: t('adminPayments.colDate', { defaultValue: 'DATE' })",
  "emptyTitle=\"No payment records found\"": "emptyTitle={t('adminPayments.noPaymentRecords', { defaultValue: 'No payment records found' })}",
  "emptyDescription=\"Transactions will be recorded here when buyer orders are processed.\"": "emptyDescription={t('adminPayments.noPaymentRecordsDesc', { defaultValue: 'Transactions will be recorded here when buyer orders are processed.' })}",
});

// 4. admin/Products.jsx
fixFile('pages/admin/Products.jsx', {
  "header: 'Crop Listing'": "header: t('adminProducts.colCropListing', { defaultValue: 'CROP LISTING' })",
  "header: 'Farmer / FPO'": "header: t('adminProducts.colFarmerFpo', { defaultValue: 'FARMER / FPO' })",
  "header: 'Listing Status'": "header: t('adminProducts.colListingStatus', { defaultValue: 'LISTING STATUS' })",
});

// 5. admin/Settlements.jsx
fixFile('pages/admin/Settlements.jsx', {
  "header: 'Farmer / Producer'": "header: t('adminSettlements.colFarmerProducer', { defaultValue: 'FARMER / PRODUCER' })",
  "header: 'AgriBazaar Verification'": "header: t('adminSettlements.colVerification', { defaultValue: 'AGRIBAZAAR VERIFICATION' })",
  "header: 'Razorpay Seller Status'": "header: t('adminSettlements.colRazorpayStatus', { defaultValue: 'RAZORPAY SELLER STATUS' })",
  "header: 'Settlement Account'": "header: t('adminSettlements.colSettlementAccount', { defaultValue: 'SETTLEMENT ACCOUNT' })",
  "header: 'Total Settled'": "header: t('adminSettlements.colTotalSettled', { defaultValue: 'TOTAL SETTLED' })",
  "header: 'Pending Settlement'": "header: t('adminSettlements.colPendingSettlement', { defaultValue: 'PENDING SETTLEMENT' })",
  "header: 'Audit Provenance'": "header: t('adminSettlements.colAuditProvenance', { defaultValue: 'AUDIT PROVENANCE' })",
  "emptyTitle=\"No seller settlement records\"": "emptyTitle={t('adminSettlements.noSettlementRecords', { defaultValue: 'No seller settlement records' })}",
  "emptyDescription=\"Farmer settlement statuses will appear here.\"": "emptyDescription={t('adminSettlements.noSettlementDesc', { defaultValue: 'Farmer settlement statuses will appear here.' })}",
  "? '✓ VERIFIED FARMER' : 'PENDING VERIFICATION'": "? t('status.verified', { defaultValue: 'VERIFIED' }) : t('status.pendingVerification', { defaultValue: 'PENDING VERIFICATION' })",
});

// 6. admin/Users.jsx
fixFile('pages/admin/Users.jsx', {
  "header: 'User Name'": "header: t('adminUsers.colUserName', { defaultValue: 'USER NAME' })",
  "header: 'Email Address'": "header: t('adminUsers.colEmail', { defaultValue: 'EMAIL ADDRESS' })",
  "header: 'On-Chain Account Hash'": "header: t('adminUsers.colAccountHash', { defaultValue: 'ON-CHAIN ACCOUNT HASH' })",
  "header: 'Account Role'": "header: t('adminUsers.colAccountRole', { defaultValue: 'ACCOUNT ROLE' })",
  "? 'Active' : 'Suspended'": "? t('status.active', { defaultValue: 'Active' }) : t('status.suspended', { defaultValue: 'Suspended' })",
  "? 'Suspend Account' : 'Activate Account'": "? t('adminUsers.suspendAccount', { defaultValue: 'Suspend Account' }) : t('adminUsers.activateAccount', { defaultValue: 'Activate Account' })",
});

console.log('Finished updating admin pages.');

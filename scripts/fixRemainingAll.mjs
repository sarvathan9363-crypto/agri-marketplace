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

// 1. buyer/Dashboard.jsx
fixFile('pages/buyer/Dashboard.jsx', {
  "label=\"Total Orders\"": "label={t('buyerDashboard.totalOrders', { defaultValue: 'Total Orders' })}",
  "label=\"Active Orders\"": "label={t('buyerDashboard.activeOrders', { defaultValue: 'Active Orders' })}",
  "label=\"Completed\"": "label={t('buyerDashboard.completed', { defaultValue: 'Completed' })}",
  "label=\"Total Spent\"": "label={t('buyerDashboard.totalSpent', { defaultValue: 'Total Spent' })}",
  "'Buyer Account Hash copied!'": "t('buyerDashboard.accountHashCopied', { defaultValue: 'Buyer Account Hash copied!' })",
  "'Failed to load dashboard.'": "t('buyerDashboard.failedToLoad', { defaultValue: 'Failed to load dashboard.' })",
  "View All Orders →": "{t('buyerDashboard.viewAllOrders', { defaultValue: 'View All Orders →' })}",
  "? 'Continue Verification' : 'Start Verification'": "? t('buyerDashboard.continueVerification', { defaultValue: 'Continue Verification' }) : t('buyerDashboard.startVerification', { defaultValue: 'Start Verification' })",
});

// 2. buyer/Orders.jsx
fixFile('pages/buyer/Orders.jsx', {
  "header: 'Produce Item'": "header: t('buyerOrders.colProduceItem', { defaultValue: 'PRODUCE ITEM' })",
  "header: 'Farmer / Producer'": "header: t('buyerOrders.colFarmerProducer', { defaultValue: 'FARMER / PRODUCER' })",
  "header: 'Quantity'": "header: t('buyerOrders.colQuantity', { defaultValue: 'QUANTITY' })",
  "header: 'Total Price'": "header: t('buyerOrders.colTotalPrice', { defaultValue: 'TOTAL PRICE' })",
  "header: 'Order Status'": "header: t('buyerOrders.colOrderStatus', { defaultValue: 'ORDER STATUS' })",
  "header: 'Blockchain Audit'": "header: t('buyerOrders.colBlockchainAudit', { defaultValue: 'BLOCKCHAIN AUDIT' })",
  "header: 'Action'": "header: t('buyerOrders.colAction', { defaultValue: 'ACTION' })",
  "emptyTitle=\"No orders found\"": "emptyTitle={t('buyerOrders.noOrdersFound', { defaultValue: 'No orders found' })}",
  "emptyDescription=\"Your placed produce orders will appear here.\"": "emptyDescription={t('buyerOrders.noOrdersDesc', { defaultValue: 'Your placed produce orders will appear here.' })}",
  "'Failed to load orders.'": "t('buyerOrders.failedToLoadOrders', { defaultValue: 'Failed to load orders.' })",
});

// 3. buyer/Checkout.jsx
fixFile('pages/buyer/Checkout.jsx', {
  "label=\"Full Delivery Address *\"": "label={t('checkout.fullDeliveryAddress', { defaultValue: 'Full Delivery Address *' })}",
  "placeholder=\"Street address, building, village...\"": "placeholder={t('checkout.placeholderAddress', { defaultValue: 'Street address, building, village...' })}",
  "label=\"City / District\"": "label={t('checkout.cityDistrict', { defaultValue: 'City / District' })}",
  "placeholder=\"e.g. Pune\"": "placeholder={t('checkout.placeholderCity', { defaultValue: 'e.g. Pune' })}",
  "label=\"State\"": "label={t('checkout.stateLabel', { defaultValue: 'State' })}",
  "placeholder=\"e.g. Maharashtra\"": "placeholder={t('checkout.placeholderState', { defaultValue: 'e.g. Maharashtra' })}",
  "label=\"Pincode\"": "label={t('checkout.pincodeLabel', { defaultValue: 'Pincode' })}",
  "placeholder=\"e.g. 411001\"": "placeholder={t('checkout.placeholderPincode', { defaultValue: 'e.g. 411001' })}",
  "'1. Shipping'": "t('checkout.stepShipping', { defaultValue: '1. Shipping' })",
  "'2. Payment'": "t('checkout.stepPayment', { defaultValue: '2. Payment' })",
  "'Address required.'": "t('checkout.addressRequired', { defaultValue: 'Address required.' })",
});

// 4. buyer/Profile.jsx
fixFile('pages/buyer/Profile.jsx', {
  "'Buyer profile updated!'": "t('buyerProfile.profileUpdatedToast', { defaultValue: 'Buyer profile updated!' })",
  "'Account Hash copied!'": "t('buyerProfile.accountHashCopiedToast', { defaultValue: 'Account Hash copied!' })",
});

// 5. buyer/Verification.jsx
fixFile('pages/buyer/Verification.jsx', {
  "• Official Verification Portal": "{t('buyerVerification.officialPortal', { defaultValue: '• Official Verification Portal' })}",
  "? 'Continue Verification' : 'Start Verification'": "? t('buyerVerification.continueVerification', { defaultValue: 'Continue Verification' }) : t('buyerVerification.startVerification', { defaultValue: 'Start Verification' })",
  "'○ PENDING'": "t('status.pending', { defaultValue: 'PENDING' })",
  "'Failed to load verification status.'": "t('buyerVerification.failedToLoad', { defaultValue: 'Failed to load verification status.' })",
});

// 6. farmer/MyProducts.jsx
fixFile('pages/farmer/MyProducts.jsx', {
  "header: 'Produce Details'": "header: t('farmerProducts.colProduceDetails', { defaultValue: 'PRODUCE DETAILS' })",
  "header: 'Category'": "header: t('farmerProducts.colCategory', { defaultValue: 'CATEGORY' })",
  "header: 'Price / Unit'": "header: t('farmerProducts.colPriceUnit', { defaultValue: 'PRICE / UNIT' })",
  "header: 'Stock Quantity'": "header: t('farmerProducts.colStockQuantity', { defaultValue: 'STOCK QUANTITY' })",
  "header: 'Status'": "header: t('farmerProducts.colStatus', { defaultValue: 'STATUS' })",
  "header: 'Actions'": "header: t('farmerProducts.colActions', { defaultValue: 'ACTIONS' })",
  "emptyTitle=\"No products listed yet\"": "emptyTitle={t('farmerProducts.noProductsListed', { defaultValue: 'No products listed yet' })}",
  "emptyDescription=\"Start selling by creating your first verified produce listing.\"": "emptyDescription={t('farmerProducts.noProductsDesc', { defaultValue: 'Start selling by creating your first verified produce listing.' })}",
  "'+ Add Product'": "t('farmerProducts.addProductBtn', { defaultValue: '+ Add Product' })",
});

// 7. farmer/Sales.jsx
fixFile('pages/farmer/Sales.jsx', {
  "label=\"Total Revenue\"": "label={t('farmerSales.totalRevenue', { defaultValue: 'Total Revenue' })}",
  "label=\"Avg Order Value\"": "label={t('farmerSales.avgOrderValue', { defaultValue: 'Avg Order Value' })}",
  "label=\"Fulfilled Orders\"": "label={t('farmerSales.fulfilledOrders', { defaultValue: 'Fulfilled Orders' })}",
  "label=\"Active Customers\"": "label={t('farmerSales.activeCustomers', { defaultValue: 'Active Customers' })}",
});

// 8. admin/Dashboard.jsx
fixFile('pages/admin/Dashboard.jsx', {
  "header: 'Product Name'": "header: t('adminDashboard.colProductName', { defaultValue: 'PRODUCT NAME' })",
  "header: 'Buyer'": "header: t('adminDashboard.colBuyer', { defaultValue: 'BUYER' })",
  "header: 'Farmer / FPO'": "header: t('adminDashboard.colFarmerFpo', { defaultValue: 'FARMER / FPO' })",
  "header: 'Amount'": "header: t('adminDashboard.colAmount', { defaultValue: 'AMOUNT' })",
  "header: 'Status'": "header: t('adminDashboard.colStatus', { defaultValue: 'STATUS' })",
  "label=\"Total Users\"": "label={t('adminDashboard.totalUsers', { defaultValue: 'Total Users' })}",
  "label=\"Farmers / FPOs\"": "label={t('adminDashboard.farmersFpos', { defaultValue: 'Farmers / FPOs' })}",
  "label=\"Pending Verifications\"": "label={t('adminDashboard.pendingVerifications', { defaultValue: 'Pending Verifications' })}",
  "label=\"Active Products\"": "label={t('adminDashboard.activeProducts', { defaultValue: 'Active Products' })}",
  "label=\"Total Orders\"": "label={t('adminDashboard.totalOrders', { defaultValue: 'Total Orders' })}",
  "label=\"Completed Orders\"": "label={t('adminDashboard.completedOrders', { defaultValue: 'Completed Orders' })}",
  "label=\"Total Revenue\"": "label={t('adminDashboard.totalRevenue', { defaultValue: 'Total Revenue' })}",
  "label=\"Total Buyers\"": "label={t('adminDashboard.totalBuyers', { defaultValue: 'Total Buyers' })}",
  "title=\"Monthly Order Volume\"": "title={t('adminDashboard.monthlyOrderVolumeTitle', { defaultValue: 'Monthly Order Volume' })}",
  "subtitle=\"Number of fulfilled orders by month.\"": "subtitle={t('adminDashboard.monthlyOrderVolumeDesc', { defaultValue: 'Number of fulfilled orders by month.' })}",
  "title=\"Product Category Distribution\"": "title={t('adminDashboard.categoryDistributionTitle', { defaultValue: 'Product Category Distribution' })}",
  "subtitle=\"Active crop listings across categories.\"": "subtitle={t('adminDashboard.categoryDistributionDesc', { defaultValue: 'Active crop listings across categories.' })}",
  "emptyTitle=\"No platform orders\"": "emptyTitle={t('adminDashboard.noPlatformOrders', { defaultValue: 'No platform orders' })}",
});

// 9. admin/Orders.jsx
fixFile('pages/admin/Orders.jsx', {
  "header: 'Order Reference'": "header: t('adminOrders.colOrderRef', { defaultValue: 'ORDER REFERENCE' })",
  "header: 'Produce Item'": "header: t('adminOrders.colProduceItem', { defaultValue: 'PRODUCE ITEM' })",
  "header: 'Buyer'": "header: t('adminOrders.colBuyer', { defaultValue: 'BUYER' })",
  "header: 'Farmer / FPO'": "header: t('adminOrders.colFarmerFpo', { defaultValue: 'FARMER / FPO' })",
  "header: 'Total Value'": "header: t('adminOrders.colTotalValue', { defaultValue: 'TOTAL VALUE' })",
  "header: 'Payment Status'": "header: t('adminOrders.colPaymentStatus', { defaultValue: 'PAYMENT STATUS' })",
  "header: 'Order Status'": "header: t('adminOrders.colOrderStatus', { defaultValue: 'ORDER STATUS' })",
  "emptyTitle=\"No orders found\"": "emptyTitle={t('adminOrders.noOrdersFound', { defaultValue: 'No orders found' })}",
});

// 10. admin/Products.jsx
fixFile('pages/admin/Products.jsx', {
  "header: 'Produce Title'": "header: t('adminProducts.colProduceTitle', { defaultValue: 'PRODUCE TITLE' })",
  "header: 'Farmer'": "header: t('adminProducts.colFarmer', { defaultValue: 'FARMER' })",
  "header: 'Category'": "header: t('adminProducts.colCategory', { defaultValue: 'CATEGORY' })",
  "header: 'Price / Unit'": "header: t('adminProducts.colPriceUnit', { defaultValue: 'PRICE / UNIT' })",
  "header: 'Status'": "header: t('adminProducts.colStatus', { defaultValue: 'STATUS' })",
  "header: 'Actions'": "header: t('adminProducts.colActions', { defaultValue: 'ACTIONS' })",
  "emptyTitle=\"No products found\"": "emptyTitle={t('adminProducts.noProductsFound', { defaultValue: 'No products found' })}",
});

// 11. admin/Farmers.jsx
fixFile('pages/admin/Farmers.jsx', {
  "header: 'Farmer / FPO'": "header: t('adminFarmers.colFarmerFpo', { defaultValue: 'FARMER / FPO' })",
  "header: 'Contact Info'": "header: t('adminFarmers.colContactInfo', { defaultValue: 'CONTACT INFO' })",
  "header: 'Location'": "header: t('adminFarmers.colLocation', { defaultValue: 'LOCATION' })",
  "header: 'Seller Type'": "header: t('adminFarmers.colSellerType', { defaultValue: 'SELLER TYPE' })",
  "header: 'KYC Status'": "header: t('adminFarmers.colKycStatus', { defaultValue: 'KYC STATUS' })",
  "header: 'Actions'": "header: t('adminFarmers.colActions', { defaultValue: 'ACTIONS' })",
  "emptyTitle=\"No farmer registrations\"": "emptyTitle={t('adminFarmers.noFarmersFound', { defaultValue: 'No farmer registrations' })}",
});

// 12. admin/Users.jsx
fixFile('pages/admin/Users.jsx', {
  "header: 'User Identity'": "header: t('adminUsers.colUserIdentity', { defaultValue: 'USER IDENTITY' })",
  "header: 'Contact'": "header: t('adminUsers.colContact', { defaultValue: 'CONTACT' })",
  "header: 'Role'": "header: t('adminUsers.colRole', { defaultValue: 'ROLE' })",
  "header: 'Account Status'": "header: t('adminUsers.colAccountStatus', { defaultValue: 'ACCOUNT STATUS' })",
  "header: 'Joined'": "header: t('adminUsers.colJoined', { defaultValue: 'JOINED' })",
  "header: 'Actions'": "header: t('adminUsers.colActions', { defaultValue: 'ACTIONS' })",
  "emptyTitle=\"No users found\"": "emptyTitle={t('adminUsers.noUsersFound', { defaultValue: 'No users found' })}",
});

console.log('Finished updating remaining files.');

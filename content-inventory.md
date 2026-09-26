# AgriBazaar — Complete Content Inventory

> Generated: 2026-09-26T09:49:06.859Z
> Analysis-only — no code was modified.

## Summary

| Metric | Count |
|---|---|
| Total files scanned | 77 |
| Total content items | 1590 |
| Static content | 1485 |
| Dynamic content | 105 |
| Currently i18n-controlled | 1308 |
| Hardcoded (not i18n) | 187 |
| Requiring translation | 1493 |
| Duplicates excluded | 5 |

## Global

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0145 | components/ui/Button.jsx | 50 | ternary | w-5 h-5 | ❌ |
| CONTENT-0146 | components/ui/Button.jsx | 50 | ternary | w-4 h-4 | ❌ |
| CONTENT-0147 | components/ui/Components.jsx | 89 | i18n-key | [i18n key: ui.loadingContent] | ✅ |
| CONTENT-0148 | components/ui/Components.jsx | 103 | i18n-key | [i18n key: ui.noItems] | ✅ |
| CONTENT-0149 | components/ui/Components.jsx | 117 | i18n-key | [i18n key: ui.error] | ✅ |
| CONTENT-0150 | components/ui/Components.jsx | 121 | i18n-key | [i18n key: ui.tryAgain] | ✅ |
| CONTENT-0151 | components/ui/DataTable.jsx | 18 | i18n-key | [i18n key: ui.noRecords] | ✅ |
| CONTENT-0152 | components/ui/DataTable.jsx | 18 | i18n-key | [i18n key: ui.noItemsDescription] | ✅ |
| CONTENT-0153 | context/ThemeContext.jsx | 9 | i18n-key | [i18n key: common.light] | ✅ |
| CONTENT-0154 | context/ThemeContext.jsx | 15 | i18n-key | [i18n key: common.dark] | ✅ |
| CONTENT-0155 | context/ThemeContext.jsx | 15 | i18n-key | [i18n key: common.light] | ✅ |
| CONTENT-0156 | layouts/AdminLayout.jsx | 12 | i18n-key | [i18n key: navigation.dashboard] | ✅ |
| CONTENT-0157 | layouts/AdminLayout.jsx | 12 | i18n-key | Users | ✅ |
| CONTENT-0158 | layouts/AdminLayout.jsx | 13 | i18n-key | Farmers / FPOs | ✅ |
| CONTENT-0159 | layouts/AdminLayout.jsx | 13 | i18n-key | Settlements | ✅ |
| CONTENT-0160 | layouts/AdminLayout.jsx | 14 | i18n-key | [i18n key: navigation.products] | ✅ |
| CONTENT-0161 | layouts/AdminLayout.jsx | 14 | i18n-key | [i18n key: navigation.orders] | ✅ |
| CONTENT-0162 | layouts/AdminLayout.jsx | 15 | i18n-key | Payments | ✅ |
| CONTENT-0163 | layouts/AdminLayout.jsx | 16 | i18n-key | Blockchain Audit | ✅ |
| CONTENT-0164 | layouts/AdminLayout.jsx | 17 | i18n-key | Disputes | ✅ |
| CONTENT-0165 | layouts/AdminLayout.jsx | 18 | i18n-key | Analytics | ✅ |
| CONTENT-0166 | layouts/AdminLayout.jsx | 18 | i18n-key | [i18n key: navigation.settings] | ✅ |
| CONTENT-0167 | layouts/AdminLayout.jsx | 21 | i18n-key | [i18n key: portals.admin] | ✅ |
| CONTENT-0168 | layouts/BuyerLayout.jsx | 12 | i18n-key | [i18n key: navigation.dashboard] | ✅ |
| CONTENT-0169 | layouts/BuyerLayout.jsx | 12 | i18n-key | [i18n key: navigation.verification] | ✅ |
| CONTENT-0170 | layouts/BuyerLayout.jsx | 13 | i18n-key | [i18n key: navigation.orders] | ✅ |
| CONTENT-0171 | layouts/BuyerLayout.jsx | 13 | i18n-key | [i18n key: navigation.cart] | ✅ |
| CONTENT-0172 | layouts/BuyerLayout.jsx | 14 | i18n-key | [i18n key: navigation.profile] | ✅ |
| CONTENT-0173 | layouts/BuyerLayout.jsx | 14 | i18n-key | [i18n key: navigation.settings] | ✅ |
| CONTENT-0174 | layouts/BuyerLayout.jsx | 17 | i18n-key | [i18n key: portals.buyer] | ✅ |
| CONTENT-0175 | layouts/DashboardLayout.jsx | 19 | prop:label | Open navigation menu | ❌ |
| CONTENT-0176 | layouts/FarmerLayout.jsx | 12 | i18n-key | [i18n key: navigation.dashboard] | ✅ |
| CONTENT-0177 | layouts/FarmerLayout.jsx | 12 | i18n-key | [i18n key: navigation.products] | ✅ |
| CONTENT-0178 | layouts/FarmerLayout.jsx | 13 | i18n-key | Add Product | ✅ |
| CONTENT-0179 | layouts/FarmerLayout.jsx | 13 | i18n-key | [i18n key: navigation.orders] | ✅ |
| CONTENT-0180 | layouts/FarmerLayout.jsx | 14 | i18n-key | [i18n key: navigation.sales] | ✅ |
| CONTENT-0181 | layouts/FarmerLayout.jsx | 14 | i18n-key | [i18n key: navigation.profile] | ✅ |
| CONTENT-0182 | layouts/FarmerLayout.jsx | 15 | i18n-key | [i18n key: navigation.verification] | ✅ |
| CONTENT-0183 | layouts/FarmerLayout.jsx | 15 | i18n-key | [i18n key: navigation.settings] | ✅ |
| CONTENT-0184 | layouts/FarmerLayout.jsx | 18 | i18n-key | [i18n key: portals.farmer] | ✅ |
| CONTENT-1516 | services/adminService.js | 5 | i18n-key | [i18n key: /admin/dashboard] | ✅ |
| CONTENT-1517 | services/adminService.js | 9 | i18n-key | [i18n key: /admin/users] | ✅ |
| CONTENT-1518 | services/adminService.js | 17 | i18n-key | [i18n key: /admin/farmers] | ✅ |
| CONTENT-1519 | services/adminService.js | 25 | i18n-key | [i18n key: /admin/products] | ✅ |
| CONTENT-1520 | services/adminService.js | 33 | i18n-key | [i18n key: /admin/orders] | ✅ |
| CONTENT-1521 | services/adminService.js | 37 | i18n-key | [i18n key: /admin/payments] | ✅ |
| CONTENT-1522 | services/adminService.js | 41 | i18n-key | [i18n key: /admin/analytics] | ✅ |
| CONTENT-1523 | services/adminService.js | 45 | i18n-key | [i18n key: /admin/disputes] | ✅ |
| CONTENT-1524 | services/adminService.js | 53 | i18n-key | [i18n key: /admin/farmers/settlements] | ✅ |
| CONTENT-1525 | services/adminService.js | 57 | i18n-key | [i18n key: /admin/blockchain/events] | ✅ |
| CONTENT-1526 | services/aiService.js | 11 | object-label | AI demand forecasting coming soon. | ❌ |
| CONTENT-1527 | services/aiService.js | 15 | object-label | AI route optimization coming soon. | ❌ |
| CONTENT-1533 | services/buyerService.js | 5 | i18n-key | [i18n key: /buyers/profile] | ✅ |
| CONTENT-1534 | services/buyerService.js | 9 | i18n-key | [i18n key: /buyers/profile] | ✅ |
| CONTENT-1535 | services/buyerService.js | 13 | i18n-key | [i18n key: /buyers/dashboard] | ✅ |
| CONTENT-1536 | services/buyerService.js | 18 | i18n-key | [i18n key: /buyers/verification] | ✅ |
| CONTENT-1537 | services/buyerService.js | 22 | i18n-key | [i18n key: /buyers/verify/mobile-otp] | ✅ |
| CONTENT-1538 | services/buyerService.js | 26 | i18n-key | [i18n key: /buyers/verify/mobile-confirm] | ✅ |
| CONTENT-1539 | services/buyerService.js | 30 | i18n-key | [i18n key: /buyers/verify/identity] | ✅ |
| CONTENT-1540 | services/buyerService.js | 34 | i18n-key | [i18n key: /buyers/verify/address] | ✅ |
| CONTENT-1541 | services/buyerService.js | 38 | i18n-key | [i18n key: /buyers/verify/business] | ✅ |
| CONTENT-1542 | services/buyerService.js | 42 | i18n-key | [i18n key: /buyers/verify/pan] | ✅ |
| CONTENT-1543 | services/buyerService.js | 46 | i18n-key | [i18n key: /buyers/verify/gstin] | ✅ |
| CONTENT-1544 | services/buyerService.js | 50 | i18n-key | [i18n key: /buyers/verify/representative-otp] | ✅ |
| CONTENT-1545 | services/buyerService.js | 54 | i18n-key | [i18n key: /buyers/verify/representative] | ✅ |
| CONTENT-1546 | services/buyerService.js | 58 | i18n-key | [i18n key: /buyers/verify/bank] | ✅ |
| CONTENT-1547 | services/buyerService.js | 62 | i18n-key | [i18n key: /buyers/verify/udyam] | ✅ |
| CONTENT-1548 | services/buyerService.js | 66 | i18n-key | [i18n key: /buyers/verify/fssai] | ✅ |
| CONTENT-1549 | services/buyerService.js | 70 | i18n-key | [i18n key: /buyers/verify/documents] | ✅ |
| CONTENT-1550 | services/buyerService.js | 74 | i18n-key | [i18n key: /buyers/verify/skip-step] | ✅ |
| CONTENT-1551 | services/buyerService.js | 78 | i18n-key | [i18n key: /buyers/verify/complete] | ✅ |
| CONTENT-1554 | services/farmerService.js | 5 | i18n-key | [i18n key: /farmers/profile] | ✅ |
| CONTENT-1555 | services/farmerService.js | 9 | i18n-key | [i18n key: /farmers/profile] | ✅ |
| CONTENT-1556 | services/farmerService.js | 13 | i18n-key | [i18n key: /farmers/products] | ✅ |
| CONTENT-1557 | services/farmerService.js | 17 | i18n-key | [i18n key: /farmers/dashboard] | ✅ |
| CONTENT-1558 | services/farmerService.js | 21 | i18n-key | [i18n key: /farmers/sales] | ✅ |
| CONTENT-1559 | services/farmerService.js | 25 | i18n-key | [i18n key: /farmers/verification] | ✅ |
| CONTENT-1560 | services/farmerService.js | 29 | i18n-key | [i18n key: /farmers/verify/aadhaar-otp] | ✅ |
| CONTENT-1561 | services/farmerService.js | 33 | i18n-key | [i18n key: /farmers/verify/aadhaar-confirm] | ✅ |
| CONTENT-1562 | services/farmerService.js | 37 | i18n-key | [i18n key: /farmers/verify/farmer-id] | ✅ |
| CONTENT-1563 | services/farmerService.js | 41 | i18n-key | [i18n key: /farmers/verify/land-record] | ✅ |
| CONTENT-1564 | services/farmerService.js | 45 | i18n-key | [i18n key: /farmers/verify/bank-account] | ✅ |
| CONTENT-1565 | services/farmerService.js | 49 | i18n-key | [i18n key: /farmers/verify/pan] | ✅ |
| CONTENT-1566 | services/farmerService.js | 53 | i18n-key | [i18n key: /farmers/verify/pm-kisan] | ✅ |
| CONTENT-1567 | services/farmerService.js | 57 | i18n-key | [i18n key: /farmers/verify/skip-step] | ✅ |
| CONTENT-1568 | services/farmerService.js | 62 | i18n-key | [i18n key: /farmers/verify/fpo-org-identity] | ✅ |
| CONTENT-1569 | services/farmerService.js | 66 | i18n-key | [i18n key: /farmers/verify/fpo-org-pan] | ✅ |
| CONTENT-1570 | services/farmerService.js | 70 | i18n-key | [i18n key: /farmers/verify/fpo-gstin] | ✅ |
| CONTENT-1571 | services/farmerService.js | 74 | i18n-key | [i18n key: /farmers/verify/fpo-rep-otp] | ✅ |
| CONTENT-1572 | services/farmerService.js | 78 | i18n-key | [i18n key: /farmers/verify/fpo-rep-confirm] | ✅ |
| CONTENT-1573 | services/farmerService.js | 82 | i18n-key | [i18n key: /farmers/verify/fpo-org-bank] | ✅ |
| CONTENT-1574 | services/farmerService.js | 86 | i18n-key | [i18n key: /farmers/verify/fpo-org-docs] | ✅ |
| CONTENT-1575 | services/farmerService.js | 91 | i18n-key | [i18n key: /farmers/payment-account/status] | ✅ |
| CONTENT-1576 | services/farmerService.js | 95 | i18n-key | [i18n key: /farmers/payment-account/onboarding] | ✅ |
| CONTENT-1577 | services/farmerService.js | 99 | i18n-key | [i18n key: /farmers/payment-account/refresh] | ✅ |
| CONTENT-1578 | services/farmerService.js | 103 | i18n-key | [i18n key: /farmers/payment-account/continue] | ✅ |
| CONTENT-1579 | services/fileService.js | 17 | i18n-key | [i18n key: /files/upload] | ✅ |
| CONTENT-1580 | services/fileService.js | 30 | i18n-key | [i18n key: /files] | ✅ |
| CONTENT-1581 | services/notificationService.js | 5 | i18n-key | [i18n key: /notifications] | ✅ |
| CONTENT-1582 | services/notificationService.js | 13 | i18n-key | [i18n key: /notifications/read-all] | ✅ |
| CONTENT-1588 | services/productService.js | 8 | i18n-key | [i18n key: /products] | ✅ |
| CONTENT-1589 | services/productService.js | 18 | i18n-key | [i18n key: /products] | ✅ |

## Navbar

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0038 | components/common/Navbar.jsx | 70 | i18n-key | [i18n key: navigation.home] | ✅ |
| CONTENT-0039 | components/common/Navbar.jsx | 71 | i18n-key | [i18n key: navigation.marketplace] | ✅ |
| CONTENT-0040 | components/common/Navbar.jsx | 72 | i18n-key | [i18n key: navigation.about] | ✅ |
| CONTENT-0041 | components/common/Navbar.jsx | 81 | i18n-key | [i18n key: header.new] | ✅ |
| CONTENT-0042 | components/common/Navbar.jsx | 82 | i18n-key | [i18n key: header.tagline] | ✅ |
| CONTENT-0043 | components/common/Navbar.jsx | 85 | i18n-key | [i18n key: navigation.support] | ✅ |
| CONTENT-0044 | components/common/Navbar.jsx | 87 | i18n-key | [i18n key: navigation.helpCenter] | ✅ |
| CONTENT-0045 | components/common/Navbar.jsx | 99 | prop:alt | AgriBazaar Logo | ❌ |
| CONTENT-0046 | components/common/Navbar.jsx | 113 | ternary | text-[#00C853] border-[#00E676] | ❌ |
| CONTENT-0047 | components/common/Navbar.jsx | 113 | ternary | text-gray-600 border-transparent hover:text-[#082B36] | ❌ |
| CONTENT-0048 | components/common/Navbar.jsx | 125 | i18n-key | [i18n key: navigation.searchMarketplace] | ✅ |
| CONTENT-0049 | components/common/Navbar.jsx | 158 | i18n-key | [i18n key: navigation.notifications] | ✅ |
| CONTENT-0050 | components/common/Navbar.jsx | 161 | i18n-key | [i18n key: header.markAllRead] | ✅ |
| CONTENT-0051 | components/common/Navbar.jsx | 168 | dynamic | {{n.title}} | ❌ |
| CONTENT-0052 | components/common/Navbar.jsx | 169 | dynamic | {{n.message}} | ❌ |
| CONTENT-0053 | components/common/Navbar.jsx | 172 | i18n-key | [i18n key: header.noNotifications] | ✅ |
| CONTENT-0054 | components/common/Navbar.jsx | 185 | i18n-key | [i18n key:  ] | ✅ |
| CONTENT-0055 | components/common/Navbar.jsx | 203 | i18n-key | [i18n key: navigation.dashboard] | ✅ |
| CONTENT-0056 | components/common/Navbar.jsx | 206 | i18n-key | [i18n key: navigation.logout] | ✅ |
| CONTENT-0057 | components/common/Navbar.jsx | 217 | i18n-key | [i18n key: navigation.signIn] | ✅ |
| CONTENT-0058 | components/common/Navbar.jsx | 220 | i18n-key | [i18n key: navigation.getStarted] | ✅ |
| CONTENT-0059 | components/common/Navbar.jsx | 248 | i18n-key | [i18n key: navigation.signIn] | ✅ |
| CONTENT-0060 | components/common/Navbar.jsx | 251 | i18n-key | [i18n key: navigation.getStarted] | ✅ |
| CONTENT-0095 | components/common/Sidebar.jsx | 24 | i18n-key | [i18n key: navigation.dashboard] | ✅ |
| CONTENT-0096 | components/common/Sidebar.jsx | 63 | i18n-key | [i18n key: navigation.logout] | ✅ |
| CONTENT-0097 | components/common/Sidebar.jsx | 86 | prop:alt | AgriBazaar Logo | ❌ |
| CONTENT-0098 | components/common/Sidebar.jsx | 120 | i18n-key | [i18n key: navigation.logout] | ✅ |

## Home

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-1285 | pages/Landing.jsx | 24 | i18n-key | [i18n key: home.farmerSteps] | ✅ |
| CONTENT-1286 | pages/Landing.jsx | 25 | i18n-key | [i18n key: home.buyerSteps] | ✅ |
| CONTENT-1287 | pages/Landing.jsx | 28 | i18n-key | [i18n key: home.platformLabels.0] | ✅ |
| CONTENT-1288 | pages/Landing.jsx | 29 | i18n-key | [i18n key: home.platformLabels.1] | ✅ |
| CONTENT-1289 | pages/Landing.jsx | 30 | i18n-key | [i18n key: home.platformLabels.2] | ✅ |
| CONTENT-1290 | pages/Landing.jsx | 31 | i18n-key | [i18n key: home.platformLabels.3] | ✅ |
| CONTENT-1291 | pages/Landing.jsx | 40 | object-label | Ramesh Patil | ❌ |
| CONTENT-1292 | pages/Landing.jsx | 48 | object-label | Amit Shah | ❌ |
| CONTENT-1293 | pages/Landing.jsx | 56 | object-label | Priya Desai | ❌ |
| CONTENT-1294 | pages/Landing.jsx | 65 | i18n-key | [i18n key: home.heroLabels.0] | ✅ |
| CONTENT-1295 | pages/Landing.jsx | 70 | i18n-key | [i18n key: home.heroLabels.1] | ✅ |
| CONTENT-1296 | pages/Landing.jsx | 75 | i18n-key | [i18n key: home.heroLabels.2] | ✅ |
| CONTENT-1297 | pages/Landing.jsx | 131 | i18n-key | [i18n key: landing.heroEyebrow] | ✅ |
| CONTENT-1298 | pages/Landing.jsx | 146 | i18n-key | [i18n key: landing.heroTitle] | ✅ |
| CONTENT-1299 | pages/Landing.jsx | 148 | i18n-key | [i18n key: landing.heroHighlight] | ✅ |
| CONTENT-1300 | pages/Landing.jsx | 165 | i18n-key | [i18n key: landing.heroDescription] | ✅ |
| CONTENT-1301 | pages/Landing.jsx | 198 | i18n-key | [i18n key: landing.exploreMarketplace] | ✅ |
| CONTENT-1302 | pages/Landing.jsx | 223 | i18n-key | [i18n key: landing.joinFarmer] | ✅ |
| CONTENT-1303 | pages/Landing.jsx | 336 | i18n-key | [i18n key: landing.heroImageAlt] | ✅ |
| CONTENT-1304 | pages/Landing.jsx | 366 | i18n-key | [i18n key: landing.verifiedFresh] | ✅ |
| CONTENT-1305 | pages/Landing.jsx | 394 | i18n-key | [i18n key: landing.directSourcing] | ✅ |
| CONTENT-1306 | pages/Landing.jsx | 395 | i18n-key | [i18n key: landing.zeroCommission] | ✅ |
| CONTENT-1307 | pages/Landing.jsx | 436 | i18n-key | [i18n key: landing.farmToMarket] | ✅ |
| CONTENT-1308 | pages/Landing.jsx | 440 | i18n-key | [i18n key: landing.fasterFairer] | ✅ |
| CONTENT-1309 | pages/Landing.jsx | 560 | i18n-key | [i18n key: home.workflow] | ✅ |
| CONTENT-1310 | pages/Landing.jsx | 574 | i18n-key | [i18n key: home.workflowTitle] | ✅ |
| CONTENT-1311 | pages/Landing.jsx | 586 | i18n-key | [i18n key: home.workflowDescription] | ✅ |
| CONTENT-1312 | pages/Landing.jsx | 625 | i18n-key | [i18n key: home.farmers] | ✅ |
| CONTENT-1313 | pages/Landing.jsx | 704 | i18n-key | [i18n key: home.buyers] | ✅ |
| CONTENT-1314 | pages/Landing.jsx | 780 | i18n-key | [i18n key: home.glance] | ✅ |
| CONTENT-1315 | pages/Landing.jsx | 792 | i18n-key | [i18n key: home.glanceDescription] | ✅ |
| CONTENT-1316 | pages/Landing.jsx | 897 | i18n-key | [i18n key: home.testimonials] | ✅ |
| CONTENT-1317 | pages/Landing.jsx | 909 | i18n-key | [i18n key: home.testimonialsDescription] | ✅ |
| CONTENT-1318 | pages/Landing.jsx | 924 | dynamic | {{testimonial.name}} | ❌ |
| CONTENT-1319 | pages/Landing.jsx | 980 | dynamic | {{testimonial.name}} | ❌ |
| CONTENT-1320 | pages/Landing.jsx | 994 | dynamic | {{testimonial.name}} | ❌ |
| CONTENT-1321 | pages/Landing.jsx | 998 | dynamic | {{testimonial.role}} | ❌ |
| CONTENT-1322 | pages/Landing.jsx | 1074 | i18n-key | [i18n key: home.finalTitle] | ✅ |
| CONTENT-1323 | pages/Landing.jsx | 1086 | i18n-key | [i18n key: home.finalDescription] | ✅ |
| CONTENT-1324 | pages/Landing.jsx | 1117 | i18n-key | [i18n key: home.createAccount] | ✅ |
| CONTENT-1325 | pages/Landing.jsx | 1138 | i18n-key | [i18n key: home.browse] | ✅ |

## Marketplace

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-1350 | pages/Marketplace.jsx | 21 | i18n-key | [i18n key: home.marketplace.newest] | ✅ |
| CONTENT-1351 | pages/Marketplace.jsx | 21 | i18n-key | [i18n key: home.marketplace.lowPrice] | ✅ |
| CONTENT-1352 | pages/Marketplace.jsx | 22 | i18n-key | [i18n key: home.marketplace.highPrice] | ✅ |
| CONTENT-1353 | pages/Marketplace.jsx | 22 | i18n-key | [i18n key: home.marketplace.popular] | ✅ |
| CONTENT-1354 | pages/Marketplace.jsx | 28 | i18n-key | [i18n key: search] | ✅ |
| CONTENT-1355 | pages/Marketplace.jsx | 31 | toast:error | [i18n key: productDetails.loginFirst] | ✅ |
| CONTENT-1356 | pages/Marketplace.jsx | 32 | toast:error | [i18n key: productDetails.buyersOnly] | ✅ |
| CONTENT-1357 | pages/Marketplace.jsx | 35 | toast:success | [i18n key: productDetails.addedToCart] | ✅ |
| CONTENT-1358 | pages/Marketplace.jsx | 37 | i18n-key | [i18n key: productDetails.addToCartFailed] | ✅ |
| CONTENT-1359 | pages/Marketplace.jsx | 41 | i18n-key | [i18n key: category] | ✅ |
| CONTENT-1360 | pages/Marketplace.jsx | 42 | i18n-key | [i18n key: sort] | ✅ |
| CONTENT-1361 | pages/Marketplace.jsx | 43 | i18n-key | [i18n key: page] | ✅ |
| CONTENT-1362 | pages/Marketplace.jsx | 59 | toast:error | [i18n key: messages.loadFailed] | ✅ |
| CONTENT-1363 | pages/Marketplace.jsx | 68 | i18n-key | [i18n key: search] | ✅ |
| CONTENT-1364 | pages/Marketplace.jsx | 70 | i18n-key | [i18n key: page] | ✅ |
| CONTENT-1365 | pages/Marketplace.jsx | 79 | i18n-key | [i18n key: page] | ✅ |
| CONTENT-1366 | pages/Marketplace.jsx | 88 | i18n-key | [i18n key: home.marketplace.exchange] | ✅ |
| CONTENT-1367 | pages/Marketplace.jsx | 89 | i18n-key | [i18n key: marketplace.title] | ✅ |
| CONTENT-1368 | pages/Marketplace.jsx | 90 | i18n-key | [i18n key: home.marketplace.description] | ✅ |
| CONTENT-1369 | pages/Marketplace.jsx | 101 | i18n-key | [i18n key: marketplace.searchPlaceholder] | ✅ |
| CONTENT-1370 | pages/Marketplace.jsx | 108 | i18n-key | [i18n key: common.search] | ✅ |
| CONTENT-1371 | pages/Marketplace.jsx | 127 | i18n-key | [i18n key: common.all] | ✅ |
| CONTENT-1372 | pages/Marketplace.jsx | 136 | i18n-key | [i18n key: home.marketplace.showing] | ✅ |
| CONTENT-1373 | pages/Marketplace.jsx | 139 | i18n-key | [i18n key: marketplace.sort] | ✅ |
| CONTENT-1374 | pages/Marketplace.jsx | 152 | i18n-key | [i18n key: common.loading] | ✅ |
| CONTENT-1375 | pages/Marketplace.jsx | 182 | i18n-key | [i18n key: marketplace.noProducts] | ✅ |
| CONTENT-1376 | pages/Marketplace.jsx | 183 | i18n-key | [i18n key: common.noResults] | ✅ |
| CONTENT-1377 | pages/Marketplace.jsx | 186 | i18n-key | [i18n key: marketplace.filters] | ✅ |

## Products

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0061 | components/common/ProductCard.jsx | 21 | dynamic | {{product.productName}} | ❌ |
| CONTENT-0062 | components/common/ProductCard.jsx | 27 | dynamic | {{product.category}} | ✅ |
| CONTENT-0063 | components/common/ProductCard.jsx | 33 | i18n-key | Verified | ✅ |
| CONTENT-0064 | components/common/ProductCard.jsx | 43 | dynamic | {{product.productName}} | ❌ |
| CONTENT-0065 | components/common/ProductCard.jsx | 47 | dynamic | {{product.farmerName}} | ❌ |
| CONTENT-0066 | components/common/ProductCard.jsx | 52 | dynamic | {{product.location}} | ❌ |
| CONTENT-0067 | components/common/ProductCard.jsx | 59 | dynamic | {{product.unit}} | ✅ |
| CONTENT-0068 | components/common/ProductCard.jsx | 60 | i18n-key | [i18n key: home.marketplace.available] | ✅ |
| CONTENT-0069 | components/common/ProductCard.jsx | 66 | i18n-key | [i18n key: marketplace.addToCart] | ✅ |
| CONTENT-0070 | components/common/ProductCard.jsx | 67 | i18n-key | [i18n key: marketplace.addToCart] | ✅ |

## Product Details

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-1378 | pages/ProductDetails.jsx | 43 | toast:error | [i18n key: errors.PRODUCT_NOT_FOUND] | ✅ |
| CONTENT-1379 | pages/ProductDetails.jsx | 51 | toast:error | [i18n key: productDetails.loginFirst] | ✅ |
| CONTENT-1380 | pages/ProductDetails.jsx | 52 | toast:error | [i18n key: productDetails.buyersOnly] | ✅ |
| CONTENT-1381 | pages/ProductDetails.jsx | 56 | toast:success | [i18n key: productDetails.addedToCart] | ✅ |
| CONTENT-1382 | pages/ProductDetails.jsx | 58 | i18n-key | [i18n key: productDetails.addToCartFailed] | ✅ |
| CONTENT-1383 | pages/ProductDetails.jsx | 75 | i18n-key | [i18n key: marketplace.title] | ✅ |
| CONTENT-1384 | pages/ProductDetails.jsx | 78 | dynamic | {{product.productName}} | ❌ |
| CONTENT-1385 | pages/ProductDetails.jsx | 87 | dynamic | {{product.productName}} | ❌ |
| CONTENT-1386 | pages/ProductDetails.jsx | 98 | dynamic | {{product.category}} | ✅ |
| CONTENT-1387 | pages/ProductDetails.jsx | 100 | dynamic | {{product.status}} | ❌ |
| CONTENT-1388 | pages/ProductDetails.jsx | 103 | dynamic | {{product.productName}} | ❌ |
| CONTENT-1389 | pages/ProductDetails.jsx | 106 | dynamic | {{product.farmerName}} | ❌ |
| CONTENT-1390 | pages/ProductDetails.jsx | 109 | i18n-key | [i18n key: productDetails.verifiedProducer] | ✅ |
| CONTENT-1391 | pages/ProductDetails.jsx | 115 | dynamic | {{product.location}} | ❌ |
| CONTENT-1392 | pages/ProductDetails.jsx | 125 | dynamic | {{product.unit}} | ❌ |
| CONTENT-1393 | pages/ProductDetails.jsx | 127 | dynamic | {{product.unit}} | ❌ |
| CONTENT-1394 | pages/ProductDetails.jsx | 132 | i18n-key | [i18n key: productDetails.specifications] | ✅ |
| CONTENT-1395 | pages/ProductDetails.jsx | 133 | dynamic | {{product.description}} | ❌ |
| CONTENT-1396 | pages/ProductDetails.jsx | 154 | dynamic | {{product.unit}} | ❌ |
| CONTENT-1397 | pages/ProductDetails.jsx | 164 | i18n-key | [i18n key: marketplace.addToCart] | ✅ |
| CONTENT-1398 | pages/ProductDetails.jsx | 167 | i18n-key | [i18n key: marketplace.buyNow] | ✅ |
| CONTENT-1399 | pages/ProductDetails.jsx | 180 | i18n-key | [i18n key: marketplace.producerName] | ✅ |
| CONTENT-1400 | pages/ProductDetails.jsx | 180 | dynamic | {{farmer.fullName}} | ✅ |
| CONTENT-1401 | pages/ProductDetails.jsx | 181 | i18n-key | [i18n key: marketplace.farmFpoName] | ✅ |
| CONTENT-1402 | pages/ProductDetails.jsx | 181 | dynamic | {{farmer.farmName}} | ✅ |
| CONTENT-1403 | pages/ProductDetails.jsx | 182 | i18n-key | [i18n key: marketplace.type] | ✅ |
| CONTENT-1404 | pages/ProductDetails.jsx | 182 | dynamic | {{farmer.farmerType}} | ✅ |
| CONTENT-1405 | pages/ProductDetails.jsx | 183 | i18n-key | [i18n key: marketplace.location] | ✅ |
| CONTENT-1406 | pages/ProductDetails.jsx | 183 | dynamic | {{farmer.location}} | ✅ |
| CONTENT-1407 | pages/ProductDetails.jsx | 193 | i18n-key | [i18n key: productDetails.related] | ✅ |

## Cart

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0660 | pages/buyer/Cart.jsx | 30 | i18n-key | [i18n key: cart.updateFailed] | ✅ |
| CONTENT-0661 | pages/buyer/Cart.jsx | 37 | toast:success | [i18n key: cart.removed] | ✅ |
| CONTENT-0662 | pages/buyer/Cart.jsx | 39 | i18n-key | [i18n key: cart.removeFailed] | ✅ |
| CONTENT-0663 | pages/buyer/Cart.jsx | 52 | i18n-key | [i18n key: cart.empty] | ✅ |
| CONTENT-0664 | pages/buyer/Cart.jsx | 53 | i18n-key | [i18n key: cart.emptyDescription] | ✅ |
| CONTENT-0665 | pages/buyer/Cart.jsx | 56 | i18n-key | [i18n key: cart.browse] | ✅ |
| CONTENT-0666 | pages/buyer/Cart.jsx | 68 | i18n-key | [i18n key: cart.eyebrow] | ✅ |
| CONTENT-0667 | pages/buyer/Cart.jsx | 69 | i18n-key | [i18n key: cart.title] | ✅ |
| CONTENT-0668 | pages/buyer/Cart.jsx | 70 | i18n-key | [i18n key: cart.description] | ✅ |
| CONTENT-0669 | pages/buyer/Cart.jsx | 80 | dynamic | {{item.productName}} | ❌ |
| CONTENT-0670 | pages/buyer/Cart.jsx | 81 | dynamic | {{item.farmerName}} | ❌ |
| CONTENT-0671 | pages/buyer/Cart.jsx | 82 | dynamic | {{item.unit}} | ❌ |
| CONTENT-0672 | pages/buyer/Cart.jsx | 101 | i18n-key | [i18n key: checkout.orderSummary] | ✅ |
| CONTENT-0673 | pages/buyer/Cart.jsx | 103 | i18n-key | [i18n key: cart.itemsSubtotal] | ✅ |
| CONTENT-0674 | pages/buyer/Cart.jsx | 104 | i18n-key | [i18n key: cart.shipping] | ✅ |
| CONTENT-0675 | pages/buyer/Cart.jsx | 104 | i18n-key | [i18n key: cart.freeDelivery] | ✅ |
| CONTENT-0676 | pages/buyer/Cart.jsx | 105 | i18n-key | [i18n key: cart.totalAmount] | ✅ |
| CONTENT-0677 | pages/buyer/Cart.jsx | 109 | i18n-key | [i18n key: cart.proceed] | ✅ |
| CONTENT-1552 | services/cartService.js | 5 | i18n-key | [i18n key: /cart] | ✅ |
| CONTENT-1553 | services/cartService.js | 9 | i18n-key | [i18n key: /cart] | ✅ |

## Checkout

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0101 | components/farmer/PaymentSettlementCard.jsx | 23 | toast:error | [i18n key: paymentSettlementCard.failedToLoadStatus] | ✅ |
| CONTENT-0102 | components/farmer/PaymentSettlementCard.jsx | 40 | ternary | ℹ️ | ❌ |
| CONTENT-0103 | components/farmer/PaymentSettlementCard.jsx | 40 | ternary | ⚠️ | ❌ |
| CONTENT-0104 | components/farmer/PaymentSettlementCard.jsx | 45 | toast:success | [i18n key: paymentSettlementCard.statusUpdated] | ✅ |
| CONTENT-0105 | components/farmer/PaymentSettlementCard.jsx | 47 | toast:info | [i18n key: paymentSettlementCard.contactSupportToast] | ✅ |
| CONTENT-0106 | components/farmer/PaymentSettlementCard.jsx | 54 | i18n-key | Action failed. | ✅ |
| CONTENT-0107 | components/farmer/PaymentSettlementCard.jsx | 71 | i18n-key | Never | ✅ |
| CONTENT-0108 | components/farmer/PaymentSettlementCard.jsx | 77 | i18n-key | Payment account not connected | ✅ |
| CONTENT-0109 | components/farmer/PaymentSettlementCard.jsx | 78 | i18n-key | Payment & Settlement Setup | ✅ |
| CONTENT-0110 | components/farmer/PaymentSettlementCard.jsx | 79 | i18n-key | Connect your payment settlement account to receive direct payouts for marketplac | ✅ |
| CONTENT-0111 | components/farmer/PaymentSettlementCard.jsx | 80 | i18n-key | Connect Payment Account | ✅ |
| CONTENT-0112 | components/farmer/PaymentSettlementCard.jsx | 86 | i18n-key | Payment account setup in progress | ✅ |
| CONTENT-0113 | components/farmer/PaymentSettlementCard.jsx | 87 | i18n-key | Settlement Verification Underway | ✅ |
| CONTENT-0114 | components/farmer/PaymentSettlementCard.jsx | 88 | i18n-key | Razorpay is reviewing your submitted seller account details and banking informat | ✅ |
| CONTENT-0115 | components/farmer/PaymentSettlementCard.jsx | 89 | i18n-key | Continue Setup | ✅ |
| CONTENT-0116 | components/farmer/PaymentSettlementCard.jsx | 95 | i18n-key | Razorpay verification pending | ✅ |
| CONTENT-0117 | components/farmer/PaymentSettlementCard.jsx | 96 | i18n-key | Razorpay Verification In Progress | ✅ |
| CONTENT-0118 | components/farmer/PaymentSettlementCard.jsx | 97 | i18n-key | Account information has been submitted. Verification is pending Razorpay complia | ✅ |
| CONTENT-0119 | components/farmer/PaymentSettlementCard.jsx | 98 | i18n-key | Refresh Status | ✅ |
| CONTENT-0120 | components/farmer/PaymentSettlementCard.jsx | 104 | i18n-key | ✓ Payment account connected | ✅ |
| CONTENT-0121 | components/farmer/PaymentSettlementCard.jsx | 105 | i18n-key | Settlement Account Active | ✅ |
| CONTENT-0122 | components/farmer/PaymentSettlementCard.jsx | 106 | i18n-key | Your Razorpay linked account is active. Marketplace sales payouts will settle au | ✅ |
| CONTENT-0123 | components/farmer/PaymentSettlementCard.jsx | 107 | i18n-key | Payment Account Connected | ✅ |
| CONTENT-0124 | components/farmer/PaymentSettlementCard.jsx | 113 | i18n-key | Razorpay verification/review required | ✅ |
| CONTENT-0125 | components/farmer/PaymentSettlementCard.jsx | 114 | i18n-key | Verification Review Required | ✅ |
| CONTENT-0126 | components/farmer/PaymentSettlementCard.jsx | 115 | i18n-key | Additional documents or review required by Razorpay. | ✅ |
| CONTENT-0127 | components/farmer/PaymentSettlementCard.jsx | 116 | i18n-key | Resolve Verification | ✅ |
| CONTENT-0128 | components/farmer/PaymentSettlementCard.jsx | 122 | i18n-key | Payment settlement temporarily unavailable | ✅ |
| CONTENT-0129 | components/farmer/PaymentSettlementCard.jsx | 123 | i18n-key | Settlement Suspended | ✅ |
| CONTENT-0130 | components/farmer/PaymentSettlementCard.jsx | 124 | i18n-key | Payment settlements are temporarily unavailable for this account. Please contact | ✅ |
| CONTENT-0131 | components/farmer/PaymentSettlementCard.jsx | 125 | i18n-key | Contact Support | ✅ |
| CONTENT-0132 | components/farmer/PaymentSettlementCard.jsx | 140 | i18n-key | Government Settlement Portal | ✅ |
| CONTENT-0133 | components/farmer/PaymentSettlementCard.jsx | 149 | i18n-key | Payment & Settlement | ✅ |
| CONTENT-0134 | components/farmer/PaymentSettlementCard.jsx | 153 | dynamic | {{cfg.description}} | ❌ |
| CONTENT-0135 | components/farmer/PaymentSettlementCard.jsx | 158 | i18n-key | Marketplace settlement setup is pending Razorpay activation. Normal checkout pay | ✅ |
| CONTENT-0136 | components/farmer/PaymentSettlementCard.jsx | 165 | i18n-key | [i18n key: paymentSettlementCard.bank] | ✅ |
| CONTENT-0137 | components/farmer/PaymentSettlementCard.jsx | 166 | i18n-key | [i18n key: paymentSettlementCard.account] | ✅ |
| CONTENT-0138 | components/farmer/PaymentSettlementCard.jsx | 167 | i18n-key | [i18n key: paymentSettlementCard.ifsc] | ✅ |
| CONTENT-0139 | components/farmer/PaymentSettlementCard.jsx | 169 | i18n-key | [i18n key: paymentSettlementCard.linkedAccount] | ✅ |
| CONTENT-0140 | components/farmer/PaymentSettlementCard.jsx | 175 | i18n-key | [i18n key: paymentSettlementCard.settlement] | ✅ |
| CONTENT-0141 | components/farmer/PaymentSettlementCard.jsx | 175 | i18n-key | Enabled | ✅ |
| CONTENT-0142 | components/farmer/PaymentSettlementCard.jsx | 175 | i18n-key | Pending | ✅ |
| CONTENT-0143 | components/farmer/PaymentSettlementCard.jsx | 177 | i18n-key | [i18n key: paymentSettlementCard.lastSynced] | ✅ |
| CONTENT-0144 | components/farmer/PaymentSettlementCard.jsx | 198 | i18n-key | Refresh Status | ✅ |
| CONTENT-0678 | pages/buyer/Checkout.jsx | 33 | i18n-key | [i18n key: script] | ✅ |
| CONTENT-0679 | pages/buyer/Checkout.jsx | 68 | object-label | AgriBazaar | ❌ |
| CONTENT-0680 | pages/buyer/Checkout.jsx | 69 | object-label | Order ${checkout.orderId} | ❌ |
| CONTENT-0681 | pages/buyer/Checkout.jsx | 133 | ternary | CAPTURED | ❌ |
| CONTENT-0682 | pages/buyer/Checkout.jsx | 133 | ternary | PENDING | ❌ |
| CONTENT-0683 | pages/buyer/Checkout.jsx | 164 | toast:error | [i18n key: checkout.enterAddress] | ✅ |
| CONTENT-0684 | pages/buyer/Checkout.jsx | 174 | toast:success | [i18n key: checkout.paymentVerified] | ✅ |
| CONTENT-0685 | pages/buyer/Checkout.jsx | 197 | i18n-key | [i18n key: checkout.paymentVerifiedLabel] | ✅ |
| CONTENT-0686 | pages/buyer/Checkout.jsx | 198 | i18n-key | [i18n key: checkout.paymentSuccess] | ✅ |
| CONTENT-0687 | pages/buyer/Checkout.jsx | 199 | i18n-key | [i18n key: checkout.paymentVerifiedDescription] | ✅ |
| CONTENT-0688 | pages/buyer/Checkout.jsx | 202 | i18n-key | [i18n key: checkout.viewOrders] | ✅ |
| CONTENT-0689 | pages/buyer/Checkout.jsx | 205 | i18n-key | [i18n key: checkout.continueShopping] | ✅ |
| CONTENT-0690 | pages/buyer/Checkout.jsx | 217 | i18n-key | [i18n key: checkout.secureSettlement] | ✅ |
| CONTENT-0691 | pages/buyer/Checkout.jsx | 218 | i18n-key | [i18n key: checkout.title] | ✅ |
| CONTENT-0692 | pages/buyer/Checkout.jsx | 219 | i18n-key | [i18n key: checkout.addressReviewHint] | ✅ |
| CONTENT-0693 | pages/buyer/Checkout.jsx | 226 | ternary | bg-[#00ed64] text-[#001e2b] | ❌ |
| CONTENT-0694 | pages/buyer/Checkout.jsx | 226 | ternary | bg-gray-100 text-gray-400 | ❌ |
| CONTENT-0695 | pages/buyer/Checkout.jsx | 227 | i18n-key | 1. Shipping | ✅ |
| CONTENT-0696 | pages/buyer/Checkout.jsx | 227 | i18n-key | 2. Payment | ✅ |
| CONTENT-0697 | pages/buyer/Checkout.jsx | 227 | ternary | text-[#001e2b] | ✅ |
| CONTENT-0698 | pages/buyer/Checkout.jsx | 227 | ternary | text-gray-400 | ✅ |
| CONTENT-0699 | pages/buyer/Checkout.jsx | 240 | i18n-key | [i18n key: checkout.deliveryAddress] | ✅ |
| CONTENT-0700 | pages/buyer/Checkout.jsx | 241 | i18n-key | [i18n key: checkout.addressHint] | ✅ |
| CONTENT-0701 | pages/buyer/Checkout.jsx | 247 | i18n-key | Full Delivery Address * | ✅ |
| CONTENT-0702 | pages/buyer/Checkout.jsx | 250 | i18n-key | Street address, building, village... | ✅ |
| CONTENT-0703 | pages/buyer/Checkout.jsx | 257 | i18n-key | City / District | ✅ |
| CONTENT-0704 | pages/buyer/Checkout.jsx | 258 | i18n-key | e.g. Pune | ✅ |
| CONTENT-0705 | pages/buyer/Checkout.jsx | 263 | i18n-key | State | ✅ |
| CONTENT-0706 | pages/buyer/Checkout.jsx | 264 | i18n-key | e.g. Maharashtra | ✅ |
| CONTENT-0707 | pages/buyer/Checkout.jsx | 269 | i18n-key | Pincode | ✅ |
| CONTENT-0708 | pages/buyer/Checkout.jsx | 270 | i18n-key | e.g. 411001 | ✅ |
| CONTENT-0709 | pages/buyer/Checkout.jsx | 281 | toast:error | [i18n key: checkout.addressRequired] | ✅ |
| CONTENT-0710 | pages/buyer/Checkout.jsx | 291 | i18n-key | [i18n key: checkout.itemsSummary] | ✅ |
| CONTENT-0711 | pages/buyer/Checkout.jsx | 296 | dynamic | {{item.productName}} | ❌ |
| CONTENT-0712 | pages/buyer/Checkout.jsx | 297 | dynamic | {{item.farmerName}} | ❌ |
| CONTENT-0713 | pages/buyer/Checkout.jsx | 297 | dynamic | {{item.unit}} | ❌ |
| CONTENT-0714 | pages/buyer/Checkout.jsx | 305 | i18n-key | [i18n key: checkout.subtotal] | ✅ |
| CONTENT-0715 | pages/buyer/Checkout.jsx | 306 | i18n-key | [i18n key: checkout.delivery] | ✅ |
| CONTENT-0716 | pages/buyer/Checkout.jsx | 306 | i18n-key | [i18n key: checkout.free] | ✅ |
| CONTENT-0717 | pages/buyer/Checkout.jsx | 307 | i18n-key | [i18n key: checkout.totalOrder] | ✅ |
| CONTENT-0718 | pages/buyer/Checkout.jsx | 317 | i18n-key | [i18n key: checkout.securePayment] | ✅ |
| CONTENT-0719 | pages/buyer/Checkout.jsx | 318 | i18n-key | [i18n key: checkout.razorpayTestMode] | ✅ |
| CONTENT-0720 | pages/buyer/Checkout.jsx | 326 | i18n-key | [i18n key: checkout.paymentFailed] | ✅ |
| CONTENT-1586 | services/paymentService.js | 5 | i18n-key | [i18n key: /payments/create-order] | ✅ |
| CONTENT-1587 | services/paymentService.js | 9 | i18n-key | [i18n key: /payments/verify] | ✅ |

## Orders

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0375 | pages/admin/Orders.jsx | 28 | i18n-key | ORDER REFERENCE | ✅ |
| CONTENT-0376 | pages/admin/Orders.jsx | 33 | i18n-key | PRODUCE ITEM | ✅ |
| CONTENT-0377 | pages/admin/Orders.jsx | 35 | dynamic | {{o.productName}} | ❌ |
| CONTENT-0378 | pages/admin/Orders.jsx | 37 | i18n-key | BUYER | ✅ |
| CONTENT-0379 | pages/admin/Orders.jsx | 38 | i18n-key | FARMER / FPO | ✅ |
| CONTENT-0380 | pages/admin/Orders.jsx | 39 | i18n-key | TOTAL VALUE | ✅ |
| CONTENT-0381 | pages/admin/Orders.jsx | 40 | i18n-key | PAYMENT STATUS | ✅ |
| CONTENT-0382 | pages/admin/Orders.jsx | 41 | i18n-key | ORDER STATUS | ✅ |
| CONTENT-0383 | pages/admin/Orders.jsx | 47 | i18n-key | [i18n key: common.platformFulfillment] | ✅ |
| CONTENT-0384 | pages/admin/Orders.jsx | 48 | i18n-key | [i18n key: common.allPlatformOrders] | ✅ |
| CONTENT-0385 | pages/admin/Orders.jsx | 49 | i18n-key | [i18n key: common.fullOversightOfOrdersFulfillmentStatuses] | ✅ |
| CONTENT-0386 | pages/admin/Orders.jsx | 58 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0387 | pages/admin/Orders.jsx | 58 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0388 | pages/admin/Orders.jsx | 61 | i18n-key | All Orders | ✅ |
| CONTENT-0389 | pages/admin/Orders.jsx | 70 | i18n-key | No orders found | ✅ |
| CONTENT-0746 | pages/buyer/Orders.jsx | 28 | toast:error | [i18n key: buyerOrders.failedToLoadOrders] | ✅ |
| CONTENT-0747 | pages/buyer/Orders.jsx | 34 | i18n-key | [i18n key: script] | ✅ |
| CONTENT-0748 | pages/buyer/Orders.jsx | 52 | toast:success | Payment verified successfully! | ❌ |
| CONTENT-0749 | pages/buyer/Orders.jsx | 59 | object-label | AgriBazaar | ❌ |
| CONTENT-0750 | pages/buyer/Orders.jsx | 59 | object-label | Order ${checkout.orderId} | ❌ |
| CONTENT-0751 | pages/buyer/Orders.jsx | 68 | toast:success | Payment verified successfully! | ❌ |
| CONTENT-0752 | pages/buyer/Orders.jsx | 72 | toast:error | Payment was cancelled. | ❌ |
| CONTENT-0753 | pages/buyer/Orders.jsx | 88 | i18n-key | PRODUCE ITEM | ✅ |
| CONTENT-0754 | pages/buyer/Orders.jsx | 94 | dynamic | {{o.productName}} | ❌ |
| CONTENT-0755 | pages/buyer/Orders.jsx | 101 | i18n-key | FARMER / PRODUCER | ✅ |
| CONTENT-0756 | pages/buyer/Orders.jsx | 103 | dynamic | {{o.farmerName}} | ❌ |
| CONTENT-0757 | pages/buyer/Orders.jsx | 106 | i18n-key | QUANTITY | ✅ |
| CONTENT-0758 | pages/buyer/Orders.jsx | 108 | dynamic | {{o.unit}} | ❌ |
| CONTENT-0759 | pages/buyer/Orders.jsx | 110 | i18n-key | TOTAL PRICE | ✅ |
| CONTENT-0760 | pages/buyer/Orders.jsx | 111 | i18n-key | ORDER STATUS | ✅ |
| CONTENT-0761 | pages/buyer/Orders.jsx | 113 | i18n-key | BLOCKCHAIN AUDIT | ✅ |
| CONTENT-0762 | pages/buyer/Orders.jsx | 118 | i18n-key | ACTION | ✅ |
| CONTENT-0763 | pages/buyer/Orders.jsx | 134 | i18n-key | [i18n key: buyerOrders.viewCrop] | ✅ |
| CONTENT-0764 | pages/buyer/Orders.jsx | 145 | i18n-key | [i18n key: buyerOrders.orderTracking] | ✅ |
| CONTENT-0765 | pages/buyer/Orders.jsx | 146 | i18n-key | [i18n key: buyerOrders.myOrders] | ✅ |
| CONTENT-0766 | pages/buyer/Orders.jsx | 147 | i18n-key | [i18n key: buyerOrders.viewShipmentProgressAndPurchaseHistory] | ✅ |
| CONTENT-0767 | pages/buyer/Orders.jsx | 150 | i18n-key | [i18n key: buyerOrders.browseProduce] | ✅ |
| CONTENT-0768 | pages/buyer/Orders.jsx | 161 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0769 | pages/buyer/Orders.jsx | 161 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0770 | pages/buyer/Orders.jsx | 173 | i18n-key | No orders found | ✅ |
| CONTENT-0771 | pages/buyer/Orders.jsx | 174 | i18n-key | Your placed produce orders will appear here. | ✅ |
| CONTENT-0920 | pages/farmer/Orders.jsx | 27 | toast:error | [i18n key: farmerOrders.failedToLoadOrders] | ✅ |
| CONTENT-0921 | pages/farmer/Orders.jsx | 36 | toast:success | [i18n key: farmerOrders.statusUpdatedToast] | ✅ |
| CONTENT-0922 | pages/farmer/Orders.jsx | 39 | i18n-key | Failed to update order status. | ✅ |
| CONTENT-0923 | pages/farmer/Orders.jsx | 45 | i18n-key | PRODUCE ITEMS | ✅ |
| CONTENT-0924 | pages/farmer/Orders.jsx | 51 | dynamic | {{o.productName}} | ❌ |
| CONTENT-0925 | pages/farmer/Orders.jsx | 58 | i18n-key | BUYER INFO | ✅ |
| CONTENT-0926 | pages/farmer/Orders.jsx | 63 | i18n-key | Standard Delivery | ✅ |
| CONTENT-0927 | pages/farmer/Orders.jsx | 68 | i18n-key | QUANTITY | ✅ |
| CONTENT-0928 | pages/farmer/Orders.jsx | 72 | i18n-key | TOTAL VALUE | ✅ |
| CONTENT-0929 | pages/farmer/Orders.jsx | 74 | i18n-key | ORDER STATUS | ✅ |
| CONTENT-0930 | pages/farmer/Orders.jsx | 83 | i18n-key | AUDIT PROVENANCE | ✅ |
| CONTENT-0931 | pages/farmer/Orders.jsx | 88 | i18n-key | ACTIONS | ✅ |
| CONTENT-0932 | pages/farmer/Orders.jsx | 96 | i18n-key | Confirm | ✅ |
| CONTENT-0933 | pages/farmer/Orders.jsx | 99 | i18n-key | Cancel | ✅ |
| CONTENT-0934 | pages/farmer/Orders.jsx | 105 | i18n-key | Dispatch | ✅ |
| CONTENT-0935 | pages/farmer/Orders.jsx | 110 | i18n-key | Mark Delivered | ✅ |
| CONTENT-0936 | pages/farmer/Orders.jsx | 121 | i18n-key | [i18n key: farmerOrders.orderManagement] | ✅ |
| CONTENT-0937 | pages/farmer/Orders.jsx | 122 | i18n-key | [i18n key: farmerOrders.incomingProduceOrders] | ✅ |
| CONTENT-0938 | pages/farmer/Orders.jsx | 123 | i18n-key | [i18n key: farmerOrders.fulfillPurchaseOrdersReceivedFromRetail] | ✅ |
| CONTENT-0939 | pages/farmer/Orders.jsx | 133 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0940 | pages/farmer/Orders.jsx | 133 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0941 | pages/farmer/Orders.jsx | 136 | i18n-key | All Orders | ✅ |
| CONTENT-0942 | pages/farmer/Orders.jsx | 145 | i18n-key | No orders in this status | ✅ |
| CONTENT-0943 | pages/farmer/Orders.jsx | 146 | i18n-key | When buyers place orders for your produce, they will show up here. | ✅ |
| CONTENT-1583 | services/orderService.js | 5 | i18n-key | [i18n key: /orders] | ✅ |
| CONTENT-1584 | services/orderService.js | 17 | i18n-key | [i18n key: /buyers/orders] | ✅ |
| CONTENT-1585 | services/orderService.js | 21 | i18n-key | [i18n key: /farmers/orders] | ✅ |

## Farmer

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0801 | pages/farmer/AddProduct.jsx | 57 | toast:error | [i18n key: farmerAddProduct.nameRequired] | ✅ |
| CONTENT-0802 | pages/farmer/AddProduct.jsx | 58 | toast:error | [i18n key: farmerAddProduct.categoryRequired] | ✅ |
| CONTENT-0803 | pages/farmer/AddProduct.jsx | 59 | toast:error | [i18n key: farmerAddProduct.quantityGreaterThanZero] | ✅ |
| CONTENT-0804 | pages/farmer/AddProduct.jsx | 60 | toast:error | [i18n key: farmerAddProduct.priceGreaterThanZero] | ✅ |
| CONTENT-0805 | pages/farmer/AddProduct.jsx | 61 | toast:error | [i18n key: farmerAddProduct.locationRequired] | ✅ |
| CONTENT-0806 | pages/farmer/AddProduct.jsx | 77 | i18n-key | Product saved as draft. | ✅ |
| CONTENT-0807 | pages/farmer/AddProduct.jsx | 77 | i18n-key | Product published successfully! | ✅ |
| CONTENT-0808 | pages/farmer/AddProduct.jsx | 80 | i18n-key | Failed to create product. | ✅ |
| CONTENT-0809 | pages/farmer/AddProduct.jsx | 90 | i18n-key | [i18n key: farmerAddProduct.cropPreview] | ✅ |
| CONTENT-0810 | pages/farmer/AddProduct.jsx | 92 | i18n-key | Back to Edit | ✅ |
| CONTENT-0811 | pages/farmer/AddProduct.jsx | 97 | i18n-key | Product Title | ✅ |
| CONTENT-0812 | pages/farmer/AddProduct.jsx | 99 | i18n-key | No description provided. | ✅ |
| CONTENT-0813 | pages/farmer/AddProduct.jsx | 102 | i18n-key | [i18n key: farmerAddProduct.price] | ✅ |
| CONTENT-0814 | pages/farmer/AddProduct.jsx | 103 | i18n-key | [i18n key: farmerAddProduct.stock] | ✅ |
| CONTENT-0815 | pages/farmer/AddProduct.jsx | 104 | i18n-key | [i18n key: farmerAddProduct.location] | ✅ |
| CONTENT-0816 | pages/farmer/AddProduct.jsx | 105 | i18n-key | [i18n key: farmerAddProduct.harvest] | ✅ |
| CONTENT-0817 | pages/farmer/AddProduct.jsx | 109 | i18n-key | [i18n key: DRAFT] | ✅ |
| CONTENT-0818 | pages/farmer/AddProduct.jsx | 110 | i18n-key | Save Draft | ✅ |
| CONTENT-0819 | pages/farmer/AddProduct.jsx | 112 | i18n-key | [i18n key: ACTIVE] | ✅ |
| CONTENT-0820 | pages/farmer/AddProduct.jsx | 113 | i18n-key | Publish Listing | ✅ |
| CONTENT-0821 | pages/farmer/AddProduct.jsx | 124 | i18n-key | [i18n key: farmerAddProduct.newCropListing] | ✅ |
| CONTENT-0822 | pages/farmer/AddProduct.jsx | 125 | i18n-key | [i18n key: farmerAddProduct.addNewProduct] | ✅ |
| CONTENT-0823 | pages/farmer/AddProduct.jsx | 126 | i18n-key | [i18n key: farmerAddProduct.createAVerifiedProduceListingTo] | ✅ |
| CONTENT-0824 | pages/farmer/AddProduct.jsx | 132 | i18n-key | PRODUCT / CROP NAME * | ✅ |
| CONTENT-0825 | pages/farmer/AddProduct.jsx | 134 | i18n-key | e.g. Organic Basmati Rice | ✅ |
| CONTENT-0826 | pages/farmer/AddProduct.jsx | 135 | dynamic | {{form.productName}} | ❌ |
| CONTENT-0827 | pages/farmer/AddProduct.jsx | 141 | i18n-key | CROP CATEGORY * | ✅ |
| CONTENT-0828 | pages/farmer/AddProduct.jsx | 144 | dynamic | {{form.category}} | ❌ |
| CONTENT-0829 | pages/farmer/AddProduct.jsx | 149 | i18n-key | MEASUREMENT UNIT * | ✅ |
| CONTENT-0830 | pages/farmer/AddProduct.jsx | 152 | dynamic | {{form.unit}} | ❌ |
| CONTENT-0831 | pages/farmer/AddProduct.jsx | 158 | i18n-key | PRODUCE DESCRIPTION | ✅ |
| CONTENT-0832 | pages/farmer/AddProduct.jsx | 160 | i18n-key | Describe farming techniques, variety, or special packaging... | ✅ |
| CONTENT-0833 | pages/farmer/AddProduct.jsx | 161 | dynamic | {{form.description}} | ❌ |
| CONTENT-0834 | pages/farmer/AddProduct.jsx | 168 | i18n-key | AVAILABLE QUANTITY * | ✅ |
| CONTENT-0835 | pages/farmer/AddProduct.jsx | 171 | i18n-key | e.g. 500 | ✅ |
| CONTENT-0836 | pages/farmer/AddProduct.jsx | 178 | i18n-key | [i18n key: farmerAddProduct.pricePerUnitLabel] | ✅ |
| CONTENT-0837 | pages/farmer/AddProduct.jsx | 178 | dynamic | {{form.unit}} | ✅ |
| CONTENT-0838 | pages/farmer/AddProduct.jsx | 181 | i18n-key | e.g. 85 | ✅ |
| CONTENT-0839 | pages/farmer/AddProduct.jsx | 188 | i18n-key | FARM LOCATION (CITY, STATE) * | ✅ |
| CONTENT-0840 | pages/farmer/AddProduct.jsx | 190 | i18n-key | e.g. Nashik, Maharashtra | ✅ |
| CONTENT-0841 | pages/farmer/AddProduct.jsx | 191 | dynamic | {{form.location}} | ❌ |
| CONTENT-0842 | pages/farmer/AddProduct.jsx | 198 | i18n-key | HARVEST DATE | ✅ |
| CONTENT-0843 | pages/farmer/AddProduct.jsx | 205 | i18n-key | AVAILABLE FROM | ✅ |
| CONTENT-0844 | pages/farmer/AddProduct.jsx | 218 | i18n-key | Upload Crop Product Image * | ✅ |
| CONTENT-0845 | pages/farmer/AddProduct.jsx | 219 | i18n-key | High quality JPG, PNG, or WEBP image of agricultural produce (PDF not allowed) | ✅ |
| CONTENT-0846 | pages/farmer/AddProduct.jsx | 230 | i18n-key | [i18n key: DRAFT] | ✅ |
| CONTENT-0847 | pages/farmer/AddProduct.jsx | 231 | i18n-key | Save Draft | ✅ |
| CONTENT-0848 | pages/farmer/AddProduct.jsx | 234 | i18n-key | Preview Listing | ✅ |
| CONTENT-0849 | pages/farmer/AddProduct.jsx | 236 | i18n-key | [i18n key: ACTIVE] | ✅ |
| CONTENT-0850 | pages/farmer/AddProduct.jsx | 237 | i18n-key | Publishing... | ✅ |
| CONTENT-0851 | pages/farmer/AddProduct.jsx | 237 | i18n-key | Publish Listing | ✅ |
| CONTENT-0852 | pages/farmer/Dashboard.jsx | 32 | toast:error | [i18n key: farmerDashboard.failedToLoadDashboardData] | ✅ |
| CONTENT-0853 | pages/farmer/Dashboard.jsx | 48 | ternary | /fpo/verification/onboarding | ❌ |
| CONTENT-0854 | pages/farmer/Dashboard.jsx | 48 | ternary | /farmer/verification/wizard | ❌ |
| CONTENT-0855 | pages/farmer/Dashboard.jsx | 49 | i18n-key | ✓ VERIFIED FPO | ✅ |
| CONTENT-0856 | pages/farmer/Dashboard.jsx | 49 | i18n-key | ✓ VERIFIED FARMER | ✅ |
| CONTENT-0857 | pages/farmer/Dashboard.jsx | 57 | i18n-key | FPO / FPC Seller Dashboard | ✅ |
| CONTENT-0858 | pages/farmer/Dashboard.jsx | 57 | i18n-key | Seller Dashboard | ✅ |
| CONTENT-0859 | pages/farmer/Dashboard.jsx | 60 | i18n-key | FPO Overview | ✅ |
| CONTENT-0860 | pages/farmer/Dashboard.jsx | 60 | i18n-key | Farmer Overview | ✅ |
| CONTENT-0861 | pages/farmer/Dashboard.jsx | 62 | i18n-key | [i18n key: farmerDashboard.manageYourAgriculturalProductsIncomingOrders] | ✅ |
| CONTENT-0862 | pages/farmer/Dashboard.jsx | 65 | i18n-key | Add New Listing | ✅ |
| CONTENT-0863 | pages/farmer/Dashboard.jsx | 73 | i18n-key | SELLER CRYPTOGRAPHIC ACCOUNT HASH (ON-CHAIN IDENTITY) | ✅ |
| CONTENT-0864 | pages/farmer/Dashboard.jsx | 80 | toast:success | [i18n key: farmerDashboard.accountHashCopied] | ✅ |
| CONTENT-0865 | pages/farmer/Dashboard.jsx | 83 | i18n-key | Copy Hash | ✅ |
| CONTENT-0866 | pages/farmer/Dashboard.jsx | 93 | ternary | text-[#00C853] | ❌ |
| CONTENT-0867 | pages/farmer/Dashboard.jsx | 93 | ternary | text-amber-600 | ❌ |
| CONTENT-0868 | pages/farmer/Dashboard.jsx | 95 | i18n-key | Complete Your Verification | ✅ |
| CONTENT-0869 | pages/farmer/Dashboard.jsx | 99 | i18n-key | Active Badge | ✅ |
| CONTENT-0870 | pages/farmer/Dashboard.jsx | 105 | i18n-key | [i18n key: farmerDashboard.checksCompletedCount] | ✅ |
| CONTENT-0871 | pages/farmer/Dashboard.jsx | 112 | i18n-key | All Required Verification Active | ✅ |
| CONTENT-0872 | pages/farmer/Dashboard.jsx | 116 | i18n-key | Verification Incomplete | ✅ |
| CONTENT-0873 | pages/farmer/Dashboard.jsx | 128 | i18n-key | Update Verification | ✅ |
| CONTENT-0874 | pages/farmer/Dashboard.jsx | 128 | i18n-key | Continue Verification | ✅ |
| CONTENT-0875 | pages/farmer/Dashboard.jsx | 139 | i18n-key | Total Products | ✅ |
| CONTENT-0876 | pages/farmer/Dashboard.jsx | 140 | i18n-key | Active Listings | ✅ |
| CONTENT-0877 | pages/farmer/Dashboard.jsx | 141 | i18n-key | Pending Orders | ✅ |
| CONTENT-0878 | pages/farmer/Dashboard.jsx | 142 | i18n-key | Total Sales | ✅ |
| CONTENT-0879 | pages/farmer/Dashboard.jsx | 150 | i18n-key | [i18n key: farmerDashboard.recentOrders] | ✅ |
| CONTENT-0880 | pages/farmer/Dashboard.jsx | 151 | i18n-key | View All → | ✅ |
| CONTENT-0881 | pages/farmer/Dashboard.jsx | 158 | dynamic | {{order.productName}} | ❌ |
| CONTENT-0882 | pages/farmer/Dashboard.jsx | 159 | dynamic | {{order.unit}} | ❌ |
| CONTENT-0883 | pages/farmer/Dashboard.jsx | 169 | i18n-key | [i18n key: farmerDashboard.noOrdersReceivedYet] | ✅ |
| CONTENT-0884 | pages/farmer/Dashboard.jsx | 176 | i18n-key | [i18n key: farmerDashboard.activeListings] | ✅ |
| CONTENT-0885 | pages/farmer/Dashboard.jsx | 177 | i18n-key | View All → | ✅ |
| CONTENT-0886 | pages/farmer/Dashboard.jsx | 185 | dynamic | {{product.productName}} | ❌ |
| CONTENT-0887 | pages/farmer/Dashboard.jsx | 186 | dynamic | {{product.unit}} | ❌ |
| CONTENT-0888 | pages/farmer/Dashboard.jsx | 188 | dynamic | {{product.status}} | ❌ |
| CONTENT-0889 | pages/farmer/Dashboard.jsx | 194 | i18n-key | [i18n key: farmerDashboard.noActiveListings] | ✅ |
| CONTENT-0890 | pages/farmer/Dashboard.jsx | 195 | i18n-key | + Add Product | ✅ |
| CONTENT-0891 | pages/farmer/MyProducts.jsx | 31 | toast:error | [i18n key: farmerProducts.failedToLoadProducts] | ✅ |
| CONTENT-0892 | pages/farmer/MyProducts.jsx | 38 | i18n-key | Are you sure you want to delete this product listing? | ✅ |
| CONTENT-0893 | pages/farmer/MyProducts.jsx | 41 | toast:success | [i18n key: farmerProducts.productDeleted] | ✅ |
| CONTENT-0894 | pages/farmer/MyProducts.jsx | 43 | toast:error | [i18n key: farmerProducts.failedToDelete] | ✅ |
| CONTENT-0895 | pages/farmer/MyProducts.jsx | 47 | ternary | INACTIVE | ❌ |
| CONTENT-0896 | pages/farmer/MyProducts.jsx | 47 | ternary | ACTIVE | ❌ |
| CONTENT-0897 | pages/farmer/MyProducts.jsx | 50 | i18n-key | Product activated. | ✅ |
| CONTENT-0898 | pages/farmer/MyProducts.jsx | 50 | i18n-key | Product paused. | ✅ |
| CONTENT-0899 | pages/farmer/MyProducts.jsx | 52 | toast:error | [i18n key: farmerProducts.failedToUpdate] | ✅ |
| CONTENT-0900 | pages/farmer/MyProducts.jsx | 59 | i18n-key | PRODUCT | ✅ |
| CONTENT-0901 | pages/farmer/MyProducts.jsx | 64 | dynamic | {{p.productName}} | ❌ |
| CONTENT-0902 | pages/farmer/MyProducts.jsx | 68 | i18n-key | CATEGORY | ✅ |
| CONTENT-0903 | pages/farmer/MyProducts.jsx | 70 | i18n-key | AVAILABLE STOCK | ✅ |
| CONTENT-0904 | pages/farmer/MyProducts.jsx | 72 | dynamic | {{p.unit}} | ❌ |
| CONTENT-0905 | pages/farmer/MyProducts.jsx | 74 | i18n-key | PRICE / UNIT | ✅ |
| CONTENT-0906 | pages/farmer/MyProducts.jsx | 75 | i18n-key | STATUS | ✅ |
| CONTENT-0907 | pages/farmer/MyProducts.jsx | 77 | i18n-key | ACTIONS | ✅ |
| CONTENT-0908 | pages/farmer/MyProducts.jsx | 86 | i18n-key | Pause | ✅ |
| CONTENT-0909 | pages/farmer/MyProducts.jsx | 86 | i18n-key | Activate | ✅ |
| CONTENT-0910 | pages/farmer/MyProducts.jsx | 100 | i18n-key | [i18n key: farmerProducts.cropInventory] | ✅ |
| CONTENT-0911 | pages/farmer/MyProducts.jsx | 101 | i18n-key | [i18n key: farmerProducts.myProducts] | ✅ |
| CONTENT-0912 | pages/farmer/MyProducts.jsx | 102 | i18n-key | [i18n key: farmerProducts.manageListingsDesc] | ✅ |
| CONTENT-0913 | pages/farmer/MyProducts.jsx | 106 | i18n-key | Add New Product | ✅ |
| CONTENT-0914 | pages/farmer/MyProducts.jsx | 116 | i18n-key | Search crop listings... | ✅ |
| CONTENT-0915 | pages/farmer/MyProducts.jsx | 129 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0916 | pages/farmer/MyProducts.jsx | 129 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0917 | pages/farmer/MyProducts.jsx | 132 | i18n-key | All Status | ✅ |
| CONTENT-0918 | pages/farmer/MyProducts.jsx | 142 | i18n-key | No products listed yet | ✅ |
| CONTENT-0919 | pages/farmer/MyProducts.jsx | 143 | i18n-key | Start selling by creating your first verified produce listing. | ✅ |
| CONTENT-0965 | pages/farmer/Sales.jsx | 18 | i18n-key | [i18n key: farmerSales.salesAnalyticsComingSoon] | ✅ |
| CONTENT-0966 | pages/farmer/Sales.jsx | 23 | i18n-key | [i18n key: farmerSales.financialInsights] | ✅ |
| CONTENT-0967 | pages/farmer/Sales.jsx | 24 | i18n-key | [i18n key: farmerSales.salesAnalytics] | ✅ |
| CONTENT-0968 | pages/farmer/Sales.jsx | 25 | i18n-key | [i18n key: farmerSales.trackYourMonthlyRevenueGrowthAverage] | ✅ |
| CONTENT-0969 | pages/farmer/Sales.jsx | 29 | i18n-key | Total Revenue | ✅ |
| CONTENT-0970 | pages/farmer/Sales.jsx | 30 | i18n-key | Total Orders | ✅ |
| CONTENT-0971 | pages/farmer/Sales.jsx | 31 | i18n-key | Avg Order Value | ✅ |
| CONTENT-0972 | pages/farmer/Sales.jsx | 32 | i18n-key | Products Sold | ✅ |
| CONTENT-0973 | pages/farmer/Sales.jsx | 36 | i18n-key | Monthly Revenue Growth | ✅ |
| CONTENT-0974 | pages/farmer/Sales.jsx | 36 | i18n-key | Breakdown of direct produce sales revenue by month. | ✅ |
| CONTENT-0975 | pages/farmer/Sales.jsx | 43 | i18n-key | Revenue (₹) | ✅ |

## Buyer

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0721 | pages/buyer/Dashboard.jsx | 36 | toast:error | [i18n key: buyerDashboard.failedToLoad] | ✅ |
| CONTENT-0722 | pages/buyer/Dashboard.jsx | 54 | i18n-key | [i18n key: buyerDashboard.buyerPortal] | ✅ |
| CONTENT-0723 | pages/buyer/Dashboard.jsx | 55 | i18n-key | [i18n key: buyerDashboard.buyerDashboard] | ✅ |
| CONTENT-0724 | pages/buyer/Dashboard.jsx | 56 | i18n-key | [i18n key: buyerDashboard.trackYourOrdersSpendingAndFresh] | ✅ |
| CONTENT-0725 | pages/buyer/Dashboard.jsx | 70 | toast:success | [i18n key: buyerDashboard.accountHashCopied] | ✅ |
| CONTENT-0726 | pages/buyer/Dashboard.jsx | 79 | i18n-key | Total Orders | ✅ |
| CONTENT-0727 | pages/buyer/Dashboard.jsx | 80 | i18n-key | Active Orders | ✅ |
| CONTENT-0728 | pages/buyer/Dashboard.jsx | 81 | i18n-key | Completed | ✅ |
| CONTENT-0729 | pages/buyer/Dashboard.jsx | 82 | i18n-key | Total Spent | ✅ |
| CONTENT-0730 | pages/buyer/Dashboard.jsx | 89 | ternary | bg-emerald-100 text-emerald-700 | ❌ |
| CONTENT-0731 | pages/buyer/Dashboard.jsx | 89 | ternary | bg-amber-100 text-amber-700 | ❌ |
| CONTENT-0732 | pages/buyer/Dashboard.jsx | 94 | i18n-key | [i18n key: buyerDashboard.buyerVerificationStatus] | ✅ |
| CONTENT-0733 | pages/buyer/Dashboard.jsx | 95 | ternary | bg-emerald-100 text-emerald-800 border-emerald-300 | ❌ |
| CONTENT-0734 | pages/buyer/Dashboard.jsx | 95 | ternary | bg-amber-100 text-amber-800 border-amber-300 | ❌ |
| CONTENT-0735 | pages/buyer/Dashboard.jsx | 121 | i18n-key | [i18n key: buyerDashboard.viewVerificationDetails] | ✅ |
| CONTENT-0736 | pages/buyer/Dashboard.jsx | 129 | i18n-key | Continue Verification | ✅ |
| CONTENT-0737 | pages/buyer/Dashboard.jsx | 129 | i18n-key | Start Verification | ✅ |
| CONTENT-0738 | pages/buyer/Dashboard.jsx | 140 | i18n-key | [i18n key: buyerDashboard.recentOrders] | ✅ |
| CONTENT-0739 | pages/buyer/Dashboard.jsx | 141 | i18n-key | View All Orders → | ✅ |
| CONTENT-0740 | pages/buyer/Dashboard.jsx | 148 | dynamic | {{order.productName}} | ❌ |
| CONTENT-0741 | pages/buyer/Dashboard.jsx | 149 | dynamic | {{order.farmerName}} | ❌ |
| CONTENT-0742 | pages/buyer/Dashboard.jsx | 149 | dynamic | {{order.unit}} | ❌ |
| CONTENT-0743 | pages/buyer/Dashboard.jsx | 160 | i18n-key | [i18n key: buyerDashboard.noOrdersPlacedYet] | ✅ |
| CONTENT-0744 | pages/buyer/Dashboard.jsx | 161 | i18n-key | [i18n key: buyerDashboard.browseMarketplace] | ✅ |
| CONTENT-0745 | pages/buyer/Dashboard.jsx | 169 | i18n-key | [i18n key: buyerDashboard.recommendedProduce] | ✅ |

## Verification

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0786 | pages/buyer/Verification.jsx | 65 | toast:error | [i18n key: buyerVerification.failedToLoad] | ✅ |
| CONTENT-0787 | pages/buyer/Verification.jsx | 85 | i18n-key | [i18n key: buyerVerification.loadingBuyerVerificationStatus] | ✅ |
| CONTENT-0788 | pages/buyer/Verification.jsx | 99 | i18n-key | • Official Verification Portal | ✅ |
| CONTENT-0789 | pages/buyer/Verification.jsx | 113 | i18n-key | [i18n key: buyerVerification.status] | ✅ |
| CONTENT-0790 | pages/buyer/Verification.jsx | 122 | i18n-key | Continue Verification | ✅ |
| CONTENT-0791 | pages/buyer/Verification.jsx | 122 | i18n-key | Start Verification | ✅ |
| CONTENT-0792 | pages/buyer/Verification.jsx | 132 | i18n-key | [i18n key: buyerVerification.overallStatus] | ✅ |
| CONTENT-0793 | pages/buyer/Verification.jsx | 136 | ternary | bg-emerald-500 animate-pulse | ❌ |
| CONTENT-0794 | pages/buyer/Verification.jsx | 136 | ternary | bg-amber-500 | ❌ |
| CONTENT-0795 | pages/buyer/Verification.jsx | 147 | i18n-key | [i18n key: buyerVerification.progress] | ✅ |
| CONTENT-0796 | pages/buyer/Verification.jsx | 197 | dynamic | {{st.name}} | ❌ |
| CONTENT-0797 | pages/buyer/Verification.jsx | 211 | i18n-key | PENDING | ✅ |
| CONTENT-0798 | pages/buyer/Verification.jsx | 239 | i18n-key | [i18n key: buyerVerification.viewVerificationDetails] | ✅ |
| CONTENT-0799 | pages/buyer/Verification.jsx | 259 | ternary | Continue Verification | ❌ |
| CONTENT-0800 | pages/buyer/Verification.jsx | 259 | ternary | Start Verification | ❌ |
| CONTENT-0976 | pages/farmer/Verification.jsx | 63 | toast:error | [i18n key: farmerVerification.failedToLoadStatus] | ✅ |
| CONTENT-0977 | pages/farmer/Verification.jsx | 108 | i18n-key | Loading verification dashboard... | ✅ |
| CONTENT-0978 | pages/farmer/Verification.jsx | 114 | i18n-key | Verify Aadhaar Identity | ✅ |
| CONTENT-0979 | pages/farmer/Verification.jsx | 114 | i18n-key | Official 12-digit Aadhaar card identity check | ✅ |
| CONTENT-0980 | pages/farmer/Verification.jsx | 114 | i18n-key | Verified Name | ✅ |
| CONTENT-0981 | pages/farmer/Verification.jsx | 115 | i18n-key | Verify Farmer Registry ID | ✅ |
| CONTENT-0982 | pages/farmer/Verification.jsx | 115 | i18n-key | State or Central Agristack / Farmer ID validation | ✅ |
| CONTENT-0983 | pages/farmer/Verification.jsx | 115 | i18n-key | Farmer ID | ✅ |
| CONTENT-0984 | pages/farmer/Verification.jsx | 116 | i18n-key | Verify Land Record / Patta | ✅ |
| CONTENT-0985 | pages/farmer/Verification.jsx | 116 | i18n-key | Agricultural land ownership or lease agreement check | ✅ |
| CONTENT-0986 | pages/farmer/Verification.jsx | 116 | i18n-key | Patta | ✅ |
| CONTENT-0987 | pages/farmer/Verification.jsx | 117 | i18n-key | Verify Bank Account (Penny Drop) | ✅ |
| CONTENT-0988 | pages/farmer/Verification.jsx | 117 | i18n-key | Bank account validation for payout settlements | ✅ |
| CONTENT-0989 | pages/farmer/Verification.jsx | 117 | i18n-key | Bank | ✅ |
| CONTENT-0990 | pages/farmer/Verification.jsx | 118 | i18n-key | Verify Individual PAN | ✅ |
| CONTENT-0991 | pages/farmer/Verification.jsx | 118 | i18n-key | Tax identification number validation | ✅ |
| CONTENT-0992 | pages/farmer/Verification.jsx | 119 | i18n-key | Verify PM-KISAN Beneficiary ID | ✅ |
| CONTENT-0993 | pages/farmer/Verification.jsx | 119 | i18n-key | Government farmer scheme beneficiary validation | ✅ |
| CONTENT-0994 | pages/farmer/Verification.jsx | 123 | i18n-key | Verify FPO / FPC Registration | ✅ |
| CONTENT-0995 | pages/farmer/Verification.jsx | 123 | i18n-key | Incorporation certificate & CIN verification | ✅ |
| CONTENT-0996 | pages/farmer/Verification.jsx | 124 | i18n-key | Verify Organization PAN | ✅ |
| CONTENT-0997 | pages/farmer/Verification.jsx | 124 | i18n-key | PAN issued in legal organization name | ✅ |
| CONTENT-0998 | pages/farmer/Verification.jsx | 125 | i18n-key | Verify Business Tax (GSTIN) | ✅ |
| CONTENT-0999 | pages/farmer/Verification.jsx | 125 | i18n-key | GSTIN registration (optional/conditional) | ✅ |
| CONTENT-1000 | pages/farmer/Verification.jsx | 125 | i18n-key | GSTIN Not Applicable | ✅ |
| CONTENT-1001 | pages/farmer/Verification.jsx | 126 | i18n-key | Verify Authorized Representative | ✅ |
| CONTENT-1002 | pages/farmer/Verification.jsx | 126 | i18n-key | Managing officer identity & designation | ✅ |
| CONTENT-1003 | pages/farmer/Verification.jsx | 127 | i18n-key | Verify Organization Bank Account | ✅ |
| CONTENT-1004 | pages/farmer/Verification.jsx | 127 | i18n-key | Entity-owned bank account for settlements | ✅ |
| CONTENT-1005 | pages/farmer/Verification.jsx | 128 | i18n-key | Organization Documents | ✅ |
| CONTENT-1006 | pages/farmer/Verification.jsx | 128 | i18n-key | Upload reg certificate, PAN doc, bank proof & auth letter | ✅ |
| CONTENT-1007 | pages/farmer/Verification.jsx | 128 | i18n-key | All Required Documents Verified | ✅ |
| CONTENT-1008 | pages/farmer/Verification.jsx | 132 | ternary | /fpo/verification/onboarding | ❌ |
| CONTENT-1009 | pages/farmer/Verification.jsx | 132 | ternary | /farmer/verification/wizard | ❌ |
| CONTENT-1010 | pages/farmer/Verification.jsx | 133 | i18n-key | ✓ VERIFIED FPO | ✅ |
| CONTENT-1011 | pages/farmer/Verification.jsx | 133 | i18n-key | ✓ VERIFIED FARMER | ✅ |
| CONTENT-1012 | pages/farmer/Verification.jsx | 141 | i18n-key | FPO / FPC VERIFICATION DASHBOARD | ✅ |
| CONTENT-1013 | pages/farmer/Verification.jsx | 141 | i18n-key | FARMER VERIFICATION DASHBOARD | ✅ |
| CONTENT-1014 | pages/farmer/Verification.jsx | 144 | i18n-key | Verification Status & Credentials | ✅ |
| CONTENT-1015 | pages/farmer/Verification.jsx | 147 | i18n-key | Central dashboard to view your organization credentials, progress, and official  | ✅ |
| CONTENT-1016 | pages/farmer/Verification.jsx | 147 | i18n-key | Central dashboard to view your agricultural credentials, progress, and official  | ✅ |
| CONTENT-1017 | pages/farmer/Verification.jsx | 156 | i18n-key | All 5 required checks active | ✅ |
| CONTENT-1018 | pages/farmer/Verification.jsx | 166 | i18n-key | Start Verification | ✅ |
| CONTENT-1019 | pages/farmer/Verification.jsx | 166 | i18n-key | Continue Verification | ✅ |
| CONTENT-1020 | pages/farmer/Verification.jsx | 175 | i18n-key | Overall Progress | ✅ |
| CONTENT-1021 | pages/farmer/Verification.jsx | 177 | i18n-key | [i18n key: farmerVerification.checksCompletedSummary] | ✅ |
| CONTENT-1022 | pages/farmer/Verification.jsx | 197 | i18n-key | [i18n key: farmerVerification.verifiedStat] | ✅ |
| CONTENT-1023 | pages/farmer/Verification.jsx | 198 | i18n-key | [i18n key: farmerVerification.skippedStat] | ✅ |
| CONTENT-1024 | pages/farmer/Verification.jsx | 199 | i18n-key | [i18n key: farmerVerification.pendingStat] | ✅ |
| CONTENT-1025 | pages/farmer/Verification.jsx | 206 | i18n-key | [i18n key: farmerVerification.verificationIncompleteNotice] | ✅ |
| CONTENT-1026 | pages/farmer/Verification.jsx | 213 | i18n-key | Continue Verification | ✅ |
| CONTENT-1027 | pages/farmer/Verification.jsx | 229 | i18n-key | Congratulations! All required identity and organization credentials are fully ve | ✅ |
| CONTENT-1028 | pages/farmer/Verification.jsx | 236 | i18n-key | Review / Update Credentials | ✅ |
| CONTENT-1029 | pages/farmer/Verification.jsx | 243 | i18n-key | Verification Checks Breakdown | ✅ |
| CONTENT-1030 | pages/farmer/Verification.jsx | 270 | ternary | bg-amber-100 text-amber-700 | ❌ |
| CONTENT-1031 | pages/farmer/Verification.jsx | 270 | ternary | bg-gray-100 text-gray-500 | ❌ |
| CONTENT-1032 | pages/farmer/Verification.jsx | 276 | dynamic | {{item.title}} | ❌ |
| CONTENT-1033 | pages/farmer/Verification.jsx | 279 | i18n-key | Required Check | ✅ |
| CONTENT-1034 | pages/farmer/Verification.jsx | 279 | i18n-key | Optional Check | ✅ |
| CONTENT-1035 | pages/farmer/Verification.jsx | 286 | i18n-key | ✓ Verified | ✅ |
| CONTENT-1036 | pages/farmer/Verification.jsx | 290 | i18n-key | N/A | ✅ |
| CONTENT-1037 | pages/farmer/Verification.jsx | 294 | i18n-key | ○ Skipped | ✅ |
| CONTENT-1038 | pages/farmer/Verification.jsx | 298 | i18n-key | ○ Pending | ✅ |
| CONTENT-1039 | pages/farmer/Verification.jsx | 303 | dynamic | {{item.description}} | ❌ |
| CONTENT-1040 | pages/farmer/Verification.jsx | 314 | i18n-key | Status: Active | ✅ |
| CONTENT-1041 | pages/farmer/Verification.jsx | 314 | i18n-key | Status: Not Applicable | ✅ |
| CONTENT-1042 | pages/farmer/Verification.jsx | 314 | i18n-key | Status: Skipped | ✅ |
| CONTENT-1043 | pages/farmer/Verification.jsx | 314 | i18n-key | Status: Not Started | ✅ |
| CONTENT-1044 | pages/farmer/Verification.jsx | 321 | i18n-key | View / Edit | ✅ |
| CONTENT-1045 | pages/farmer/Verification.jsx | 321 | i18n-key | Complete in Wizard | ✅ |
| CONTENT-1046 | pages/farmer/VerificationWizard.jsx | 59 | ternary | fpo | ❌ |
| CONTENT-1047 | pages/farmer/VerificationWizard.jsx | 59 | ternary | farmer | ❌ |
| CONTENT-1048 | pages/farmer/VerificationWizard.jsx | 153 | toast:error | [i18n key: farmerVerificationWizard.failedToLoadVerificationStatus] | ✅ |
| CONTENT-1049 | pages/farmer/VerificationWizard.jsx | 184 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterAValid12digitAadhaar] | ✅ |
| CONTENT-1050 | pages/farmer/VerificationWizard.jsx | 190 | toast:success | [i18n key: farmerVerificationWizard.otpSentToYourAadhaarMobile] | ✅ |
| CONTENT-1051 | pages/farmer/VerificationWizard.jsx | 199 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnter6digitOtp] | ✅ |
| CONTENT-1052 | pages/farmer/VerificationWizard.jsx | 205 | toast:success | [i18n key: farmerVerificationWizard.verified_identityVerifiedViaUidaiSandbox] | ✅ |
| CONTENT-1053 | pages/farmer/VerificationWizard.jsx | 215 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterFarmerIdAndDistrict] | ✅ |
| CONTENT-1054 | pages/farmer/VerificationWizard.jsx | 221 | toast:success | [i18n key: farmerVerificationWizard.verified_farmerRegistryVerified] | ✅ |
| CONTENT-1055 | pages/farmer/VerificationWizard.jsx | 231 | toast:error | [i18n key: farmerVerificationWizard.pleaseFillAllRequiredLandRecord] | ✅ |
| CONTENT-1056 | pages/farmer/VerificationWizard.jsx | 237 | toast:success | [i18n key: farmerVerificationWizard.verified_landRecordVerified] | ✅ |
| CONTENT-1057 | pages/farmer/VerificationWizard.jsx | 247 | toast:error | [i18n key: farmerVerificationWizard.pleaseFillAccountHolderAccountNumber] | ✅ |
| CONTENT-1058 | pages/farmer/VerificationWizard.jsx | 250 | toast:error | [i18n key: farmerVerificationWizard.accountNumbersDoNotMatch] | ✅ |
| CONTENT-1059 | pages/farmer/VerificationWizard.jsx | 256 | toast:success | [i18n key: farmerVerificationWizard.verified_bankAccountVerified] | ✅ |
| CONTENT-1060 | pages/farmer/VerificationWizard.jsx | 267 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterAValid10characterPan] | ✅ |
| CONTENT-1061 | pages/farmer/VerificationWizard.jsx | 273 | toast:success | [i18n key: farmerVerificationWizard.verified_panVerifiedSuccessfully] | ✅ |
| CONTENT-1062 | pages/farmer/VerificationWizard.jsx | 289 | i18n-key | [i18n key: farmerVerificationWizard.pmkisanSkipped] | ✅ |
| CONTENT-1063 | pages/farmer/VerificationWizard.jsx | 289 | i18n-key | [i18n key: farmerVerificationWizard.verified_pmkisanVerified] | ✅ |
| CONTENT-1064 | pages/farmer/VerificationWizard.jsx | 302 | toast:error | [i18n key: farmerVerificationWizard.pleaseFillRequiredOrganizationDetails] | ✅ |
| CONTENT-1065 | pages/farmer/VerificationWizard.jsx | 308 | toast:success | [i18n key: farmerVerificationWizard.verified_organizationIdentityVerified] | ✅ |
| CONTENT-1066 | pages/farmer/VerificationWizard.jsx | 319 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterAValid10characterOrganization] | ✅ |
| CONTENT-1067 | pages/farmer/VerificationWizard.jsx | 325 | toast:success | [i18n key: farmerVerificationWizard.verified_organizationPanVerified] | ✅ |
| CONTENT-1068 | pages/farmer/VerificationWizard.jsx | 341 | i18n-key | [i18n key: farmerVerificationWizard.gstinMarkedAsNotApplicable] | ✅ |
| CONTENT-1069 | pages/farmer/VerificationWizard.jsx | 341 | i18n-key | [i18n key: farmerVerificationWizard.verified_gstinVerified] | ✅ |
| CONTENT-1070 | pages/farmer/VerificationWizard.jsx | 352 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterAValid10digitMobile] | ✅ |
| CONTENT-1071 | pages/farmer/VerificationWizard.jsx | 358 | toast:success | [i18n key: farmerVerificationWizard.otpSentToRepresentativeMobile] | ✅ |
| CONTENT-1072 | pages/farmer/VerificationWizard.jsx | 367 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnterRepresentativeNameAndDesignation] | ✅ |
| CONTENT-1073 | pages/farmer/VerificationWizard.jsx | 370 | toast:error | [i18n key: farmerVerificationWizard.pleaseEnter6digitOtp] | ✅ |
| CONTENT-1074 | pages/farmer/VerificationWizard.jsx | 376 | toast:success | [i18n key: farmerVerificationWizard.verified_authorizedRepresentativeVerified] | ✅ |
| CONTENT-1075 | pages/farmer/VerificationWizard.jsx | 386 | toast:error | [i18n key: farmerVerificationWizard.pleaseFillAccountHolderAccountNumber] | ✅ |
| CONTENT-1076 | pages/farmer/VerificationWizard.jsx | 389 | toast:error | [i18n key: farmerVerificationWizard.accountNumbersDoNotMatch] | ✅ |
| CONTENT-1077 | pages/farmer/VerificationWizard.jsx | 395 | toast:success | [i18n key: farmerVerificationWizard.verified_organizationBankAccountVerified] | ✅ |
| CONTENT-1078 | pages/farmer/VerificationWizard.jsx | 405 | toast:error | [i18n key: farmerVerificationWizard.pleaseUploadAtLeastRegistrationCertificate] | ✅ |
| CONTENT-1079 | pages/farmer/VerificationWizard.jsx | 411 | toast:success | [i18n key: farmerVerificationWizard.verified_organizationDocumentsVerified] | ✅ |
| CONTENT-1080 | pages/farmer/VerificationWizard.jsx | 424 | i18n-key | [i18n key: Step skipped. Status saved as skipped.] | ✅ |
| CONTENT-1081 | pages/farmer/VerificationWizard.jsx | 427 | toast:error | [i18n key: farmerVerificationWizard.failedToSkipStep] | ✅ |
| CONTENT-1082 | pages/farmer/VerificationWizard.jsx | 434 | toast:success | [i18n key: farmerVerificationWizard.progressSavedReturningToDashboard] | ✅ |
| CONTENT-1083 | pages/farmer/VerificationWizard.jsx | 443 | i18n-key | [i18n key: farmerVerificationWizard.loadingConfigportaltitle] | ✅ |
| CONTENT-1084 | pages/farmer/VerificationWizard.jsx | 456 | object-label | Verification Summary | ❌ |
| CONTENT-1085 | pages/farmer/VerificationWizard.jsx | 459 | object-label | Review your overall verification status and finalized badge audit. | ❌ |
| CONTENT-1086 | pages/farmer/VerificationWizard.jsx | 467 | ternary | VERIFIED | ❌ |
| CONTENT-1087 | pages/farmer/VerificationWizard.jsx | 467 | ternary | PENDING | ❌ |
| CONTENT-1088 | pages/farmer/VerificationWizard.jsx | 503 | i18n-key | [i18n key: farmerVerificationWizard.officialIdentityComplianceGateway] | ✅ |
| CONTENT-1089 | pages/farmer/VerificationWizard.jsx | 515 | ternary | FPO / FPC | ❌ |
| CONTENT-1090 | pages/farmer/VerificationWizard.jsx | 515 | ternary | FARMER | ❌ |
| CONTENT-1091 | pages/farmer/VerificationWizard.jsx | 534 | i18n-key | [i18n key: farmerVerificationWizard.saveExitToDashboard] | ✅ |
| CONTENT-1092 | pages/farmer/VerificationWizard.jsx | 605 | ternary | text-slate-900 | ❌ |
| CONTENT-1093 | pages/farmer/VerificationWizard.jsx | 605 | ternary | text-slate-700 | ❌ |
| CONTENT-1094 | pages/farmer/VerificationWizard.jsx | 606 | dynamic | {{st.name}} | ❌ |
| CONTENT-1095 | pages/farmer/VerificationWizard.jsx | 609 | ternary | (Required) | ❌ |
| CONTENT-1096 | pages/farmer/VerificationWizard.jsx | 609 | ternary | (Optional) | ❌ |
| CONTENT-1097 | pages/farmer/VerificationWizard.jsx | 628 | i18n-key | [i18n key: farmerVerificationWizard.mandatoryVerification] | ✅ |
| CONTENT-1098 | pages/farmer/VerificationWizard.jsx | 628 | i18n-key | [i18n key: farmerVerificationWizard.optionalVerification] | ✅ |
| CONTENT-1099 | pages/farmer/VerificationWizard.jsx | 649 | i18n-key | [i18n key: farmerVerificationWizard.aadhaarAuthenticationProtocol] | ✅ |
| CONTENT-1100 | pages/farmer/VerificationWizard.jsx | 650 | i18n-key | [i18n key: farmerVerificationWizard.enterYour12digitAadhaarNumberTo] | ✅ |
| CONTENT-1101 | pages/farmer/VerificationWizard.jsx | 666 | jsx-text | 🔒 Aadhaar details are encrypted and masked under UIDAI regulations. | ❌ |
| CONTENT-1102 | pages/farmer/VerificationWizard.jsx | 678 | i18n-key | [i18n key: farmerVerificationWizard.enter12digitAadhaarNumber] | ✅ |
| CONTENT-1103 | pages/farmer/VerificationWizard.jsx | 692 | i18n-key | [i18n key: farmerVerificationWizard.sendAadhaarOtp] | ✅ |
| CONTENT-1104 | pages/farmer/VerificationWizard.jsx | 701 | i18n-key | [i18n key: farmerVerificationWizard.enter6digitOtp_req] | ✅ |
| CONTENT-1105 | pages/farmer/VerificationWizard.jsx | 705 | i18n-key | [i18n key: farmerVerificationWizard.text_mnk1z] | ✅ |
| CONTENT-1106 | pages/farmer/VerificationWizard.jsx | 725 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1107 | pages/farmer/VerificationWizard.jsx | 741 | i18n-key | [i18n key: farmerVerificationWizard.saveExit] | ✅ |
| CONTENT-1108 | pages/farmer/VerificationWizard.jsx | 751 | i18n-key | [i18n key: farmerVerificationWizard.skipStep] | ✅ |
| CONTENT-1109 | pages/farmer/VerificationWizard.jsx | 759 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1110 | pages/farmer/VerificationWizard.jsx | 772 | i18n-key | [i18n key: farmerVerificationWizard.farmerDatabaseProtocol] | ✅ |
| CONTENT-1111 | pages/farmer/VerificationWizard.jsx | 773 | i18n-key | [i18n key: farmerVerificationWizard.enterYourOfficialFarmerAgristackId] | ✅ |
| CONTENT-1112 | pages/farmer/VerificationWizard.jsx | 787 | i18n-key | [i18n key: farmerVerificationWizard.farmerId] | ✅ |
| CONTENT-1113 | pages/farmer/VerificationWizard.jsx | 788 | i18n-key | [i18n key: farmerVerificationWizard.location] | ✅ |
| CONTENT-1114 | pages/farmer/VerificationWizard.jsx | 794 | i18n-key | [i18n key: farmerVerificationWizard.farmerIdAgristackId_req] | ✅ |
| CONTENT-1115 | pages/farmer/VerificationWizard.jsx | 798 | i18n-key | [i18n key: farmerVerificationWizard.egMhfarm20248849] | ✅ |
| CONTENT-1116 | pages/farmer/VerificationWizard.jsx | 806 | i18n-key | [i18n key: farmerVerificationWizard.state_req] | ✅ |
| CONTENT-1117 | pages/farmer/VerificationWizard.jsx | 808 | dynamic | {{farmerRegForm.state}} | ❌ |
| CONTENT-1118 | pages/farmer/VerificationWizard.jsx | 816 | i18n-key | [i18n key: farmerVerificationWizard.district_req] | ✅ |
| CONTENT-1119 | pages/farmer/VerificationWizard.jsx | 820 | i18n-key | [i18n key: farmerVerificationWizard.egNashik] | ✅ |
| CONTENT-1120 | pages/farmer/VerificationWizard.jsx | 821 | dynamic | {{farmerRegForm.district}} | ❌ |
| CONTENT-1121 | pages/farmer/VerificationWizard.jsx | 833 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1122 | pages/farmer/VerificationWizard.jsx | 846 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1123 | pages/farmer/VerificationWizard.jsx | 856 | i18n-key | [i18n key: farmerVerificationWizard.skipStep] | ✅ |
| CONTENT-1124 | pages/farmer/VerificationWizard.jsx | 864 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1125 | pages/farmer/VerificationWizard.jsx | 877 | i18n-key | [i18n key: farmerVerificationWizard.landHoldingProtocol] | ✅ |
| CONTENT-1126 | pages/farmer/VerificationWizard.jsx | 878 | i18n-key | [i18n key: farmerVerificationWizard.enterStateDistrictTalukVillagePatta] | ✅ |
| CONTENT-1127 | pages/farmer/VerificationWizard.jsx | 892 | i18n-key | [i18n key: farmerVerificationWizard.patta712No] | ✅ |
| CONTENT-1128 | pages/farmer/VerificationWizard.jsx | 893 | i18n-key | [i18n key: farmerVerificationWizard.surveyNo] | ✅ |
| CONTENT-1129 | pages/farmer/VerificationWizard.jsx | 894 | i18n-key | [i18n key: farmerVerificationWizard.extent] | ✅ |
| CONTENT-1130 | pages/farmer/VerificationWizard.jsx | 901 | i18n-key | [i18n key: farmerVerificationWizard.state_req] | ✅ |
| CONTENT-1131 | pages/farmer/VerificationWizard.jsx | 903 | dynamic | {{landForm.state}} | ❌ |
| CONTENT-1132 | pages/farmer/VerificationWizard.jsx | 911 | i18n-key | [i18n key: farmerVerificationWizard.district_req] | ✅ |
| CONTENT-1133 | pages/farmer/VerificationWizard.jsx | 915 | i18n-key | [i18n key: farmerVerificationWizard.egNashik] | ✅ |
| CONTENT-1134 | pages/farmer/VerificationWizard.jsx | 916 | dynamic | {{landForm.district}} | ❌ |
| CONTENT-1135 | pages/farmer/VerificationWizard.jsx | 922 | i18n-key | [i18n key: farmerVerificationWizard.taluk_req] | ✅ |
| CONTENT-1136 | pages/farmer/VerificationWizard.jsx | 926 | i18n-key | [i18n key: farmerVerificationWizard.egNiphad] | ✅ |
| CONTENT-1137 | pages/farmer/VerificationWizard.jsx | 936 | i18n-key | [i18n key: farmerVerificationWizard.village_req] | ✅ |
| CONTENT-1138 | pages/farmer/VerificationWizard.jsx | 940 | i18n-key | [i18n key: farmerVerificationWizard.egLasalgaon] | ✅ |
| CONTENT-1139 | pages/farmer/VerificationWizard.jsx | 947 | i18n-key | [i18n key: farmerVerificationWizard.pattaKhataNo_req] | ✅ |
| CONTENT-1140 | pages/farmer/VerificationWizard.jsx | 951 | i18n-key | [i18n key: farmerVerificationWizard.eg4829] | ✅ |
| CONTENT-1141 | pages/farmer/VerificationWizard.jsx | 958 | i18n-key | [i18n key: farmerVerificationWizard.surveyNo_req] | ✅ |
| CONTENT-1142 | pages/farmer/VerificationWizard.jsx | 962 | i18n-key | [i18n key: farmerVerificationWizard.eg142b] | ✅ |
| CONTENT-1143 | pages/farmer/VerificationWizard.jsx | 972 | i18n-key | [i18n key: farmerVerificationWizard.landExtentAcres_req] | ✅ |
| CONTENT-1144 | pages/farmer/VerificationWizard.jsx | 976 | i18n-key | [i18n key: farmerVerificationWizard.eg35Acres] | ✅ |
| CONTENT-1145 | pages/farmer/VerificationWizard.jsx | 983 | i18n-key | [i18n key: farmerVerificationWizard.landType] | ✅ |
| CONTENT-1146 | pages/farmer/VerificationWizard.jsx | 989 | i18n-key | [i18n key: farmerVerificationWizard.irrigatedWet] | ✅ |
| CONTENT-1147 | pages/farmer/VerificationWizard.jsx | 990 | i18n-key | [i18n key: farmerVerificationWizard.dryRainfed] | ✅ |
| CONTENT-1148 | pages/farmer/VerificationWizard.jsx | 991 | i18n-key | [i18n key: farmerVerificationWizard.horticulture] | ✅ |
| CONTENT-1149 | pages/farmer/VerificationWizard.jsx | 1015 | i18n-key | [i18n key: farmerVerificationWizard.uploadPattaLandRecordDocument_req] | ✅ |
| CONTENT-1150 | pages/farmer/VerificationWizard.jsx | 1016 | i18n-key | [i18n key: farmerVerificationWizard.uploadPdfJpgOrPngCopy] | ✅ |
| CONTENT-1151 | pages/farmer/VerificationWizard.jsx | 1026 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1152 | pages/farmer/VerificationWizard.jsx | 1039 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1153 | pages/farmer/VerificationWizard.jsx | 1049 | i18n-key | [i18n key: farmerVerificationWizard.skipStep] | ✅ |
| CONTENT-1154 | pages/farmer/VerificationWizard.jsx | 1057 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1155 | pages/farmer/VerificationWizard.jsx | 1070 | i18n-key | [i18n key: farmerVerificationWizard.bankSettlementProtocol] | ✅ |
| CONTENT-1156 | pages/farmer/VerificationWizard.jsx | 1071 | i18n-key | [i18n key: farmerVerificationWizard.linkYourActiveBankAccountFor] | ✅ |
| CONTENT-1157 | pages/farmer/VerificationWizard.jsx | 1085 | i18n-key | [i18n key: farmerVerificationWizard.accountHolder] | ✅ |
| CONTENT-1158 | pages/farmer/VerificationWizard.jsx | 1086 | i18n-key | [i18n key: farmerVerificationWizard.bankName] | ✅ |
| CONTENT-1159 | pages/farmer/VerificationWizard.jsx | 1087 | i18n-key | [i18n key: farmerVerificationWizard.accountNo] | ✅ |
| CONTENT-1160 | pages/farmer/VerificationWizard.jsx | 1093 | i18n-key | [i18n key: farmerVerificationWizard.accountHolderName_req] | ✅ |
| CONTENT-1161 | pages/farmer/VerificationWizard.jsx | 1097 | i18n-key | [i18n key: farmerVerificationWizard.asPerBankPassbook] | ✅ |
| CONTENT-1162 | pages/farmer/VerificationWizard.jsx | 1105 | i18n-key | [i18n key: farmerVerificationWizard.bankName_req] | ✅ |
| CONTENT-1163 | pages/farmer/VerificationWizard.jsx | 1115 | i18n-key | [i18n key: farmerVerificationWizard.branchName] | ✅ |
| CONTENT-1164 | pages/farmer/VerificationWizard.jsx | 1118 | i18n-key | [i18n key: farmerVerificationWizard.egMainBranch] | ✅ |
| CONTENT-1165 | pages/farmer/VerificationWizard.jsx | 1127 | i18n-key | [i18n key: farmerVerificationWizard.accountNumber_req] | ✅ |
| CONTENT-1166 | pages/farmer/VerificationWizard.jsx | 1131 | i18n-key | [i18n key: farmerVerificationWizard.enterAccountNumber] | ✅ |
| CONTENT-1167 | pages/farmer/VerificationWizard.jsx | 1138 | i18n-key | [i18n key: farmerVerificationWizard.confirmAccountNumber_req] | ✅ |
| CONTENT-1168 | pages/farmer/VerificationWizard.jsx | 1142 | i18n-key | [i18n key: farmerVerificationWizard.reenterAccountNumber] | ✅ |
| CONTENT-1169 | pages/farmer/VerificationWizard.jsx | 1150 | i18n-key | [i18n key: farmerVerificationWizard.ifscCode_req] | ✅ |
| CONTENT-1170 | pages/farmer/VerificationWizard.jsx | 1155 | i18n-key | [i18n key: farmerVerificationWizard.egSbin0001234] | ✅ |
| CONTENT-1171 | pages/farmer/VerificationWizard.jsx | 1168 | i18n-key | [i18n key: farmerVerificationWizard.uploadBankPassbookCancelledCheque_req] | ✅ |
| CONTENT-1172 | pages/farmer/VerificationWizard.jsx | 1169 | i18n-key | [i18n key: farmerVerificationWizard.uploadFrontPageOfPassbookOr] | ✅ |
| CONTENT-1173 | pages/farmer/VerificationWizard.jsx | 1179 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1174 | pages/farmer/VerificationWizard.jsx | 1192 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1175 | pages/farmer/VerificationWizard.jsx | 1202 | i18n-key | [i18n key: farmerVerificationWizard.skipStep] | ✅ |
| CONTENT-1176 | pages/farmer/VerificationWizard.jsx | 1210 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1177 | pages/farmer/VerificationWizard.jsx | 1223 | i18n-key | [i18n key: farmerVerificationWizard.panVerificationProtocol] | ✅ |
| CONTENT-1178 | pages/farmer/VerificationWizard.jsx | 1224 | i18n-key | [i18n key: farmerVerificationWizard.enterYour10characterPermanentAccountNumber] | ✅ |
| CONTENT-1179 | pages/farmer/VerificationWizard.jsx | 1238 | i18n-key | [i18n key: farmerVerificationWizard.panNumber] | ✅ |
| CONTENT-1180 | pages/farmer/VerificationWizard.jsx | 1239 | jsx-text | Confirmed Match ✓ | ✅ |
| CONTENT-1181 | pages/farmer/VerificationWizard.jsx | 1239 | i18n-key | [i18n key: farmerVerificationWizard.matchStatus] | ✅ |
| CONTENT-1182 | pages/farmer/VerificationWizard.jsx | 1245 | i18n-key | [i18n key: farmerVerificationWizard.panNumber_req] | ✅ |
| CONTENT-1183 | pages/farmer/VerificationWizard.jsx | 1250 | i18n-key | [i18n key: farmerVerificationWizard.egAbcde1234f] | ✅ |
| CONTENT-1184 | pages/farmer/VerificationWizard.jsx | 1257 | i18n-key | [i18n key: farmerVerificationWizard.nameAsPerPanOptional] | ✅ |
| CONTENT-1185 | pages/farmer/VerificationWizard.jsx | 1260 | i18n-key | [i18n key: farmerVerificationWizard.fullNameAsPrintedOnPan] | ✅ |
| CONTENT-1186 | pages/farmer/VerificationWizard.jsx | 1273 | i18n-key | [i18n key: farmerVerificationWizard.uploadPanCardCopy_req] | ✅ |
| CONTENT-1187 | pages/farmer/VerificationWizard.jsx | 1274 | i18n-key | [i18n key: farmerVerificationWizard.clearFrontScanOrPhotoOf] | ✅ |
| CONTENT-1188 | pages/farmer/VerificationWizard.jsx | 1284 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1189 | pages/farmer/VerificationWizard.jsx | 1297 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1190 | pages/farmer/VerificationWizard.jsx | 1307 | i18n-key | [i18n key: farmerVerificationWizard.skipStep] | ✅ |
| CONTENT-1191 | pages/farmer/VerificationWizard.jsx | 1315 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1192 | pages/farmer/VerificationWizard.jsx | 1328 | i18n-key | [i18n key: farmerVerificationWizard.pmkisanSchemeProtocol] | ✅ |
| CONTENT-1193 | pages/farmer/VerificationWizard.jsx | 1329 | i18n-key | [i18n key: farmerVerificationWizard.optionallyLinkPmkisanBeneficiaryReferenceFor | ✅ |
| CONTENT-1194 | pages/farmer/VerificationWizard.jsx | 1341 | i18n-key | [i18n key: farmerVerificationWizard.pmkisanRegistrationBeneficiaryReference] | ✅ |
| CONTENT-1195 | pages/farmer/VerificationWizard.jsx | 1344 | i18n-key | [i18n key: farmerVerificationWizard.egPmk987654321] | ✅ |
| CONTENT-1196 | pages/farmer/VerificationWizard.jsx | 1366 | i18n-key | [i18n key: farmerVerificationWizard.verifyPmkisanContinue] | ✅ |
| CONTENT-1197 | pages/farmer/VerificationWizard.jsx | 1380 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1198 | pages/farmer/VerificationWizard.jsx | 1387 | i18n-key | [i18n key: farmerVerificationWizard.viewSummary] | ✅ |
| CONTENT-1199 | pages/farmer/VerificationWizard.jsx | 1405 | i18n-key | [i18n key: farmerVerificationWizard.organizationRegistrationProtocol] | ✅ |
| CONTENT-1200 | pages/farmer/VerificationWizard.jsx | 1406 | i18n-key | [i18n key: farmerVerificationWizard.verifyOfficialFpoFpcCooperativeEntity] | ✅ |
| CONTENT-1201 | pages/farmer/VerificationWizard.jsx | 1420 | i18n-key | [i18n key: farmerVerificationWizard.legalName] | ✅ |
| CONTENT-1202 | pages/farmer/VerificationWizard.jsx | 1421 | i18n-key | [i18n key: farmerVerificationWizard.registrationNo] | ✅ |
| CONTENT-1203 | pages/farmer/VerificationWizard.jsx | 1428 | i18n-key | [i18n key: farmerVerificationWizard.organizationLegalName_req] | ✅ |
| CONTENT-1204 | pages/farmer/VerificationWizard.jsx | 1432 | i18n-key | [i18n key: farmerVerificationWizard.egSahyadriFarmersProducerCoLtd] | ✅ |
| CONTENT-1205 | pages/farmer/VerificationWizard.jsx | 1439 | i18n-key | [i18n key: farmerVerificationWizard.organizationType_req] | ✅ |
| CONTENT-1206 | pages/farmer/VerificationWizard.jsx | 1445 | i18n-key | [i18n key: farmerVerificationWizard.fpoFpcProducerCompany] | ✅ |
| CONTENT-1207 | pages/farmer/VerificationWizard.jsx | 1446 | i18n-key | [i18n key: farmerVerificationWizard.agriculturalCooperativeSociety] | ✅ |
| CONTENT-1208 | pages/farmer/VerificationWizard.jsx | 1447 | i18n-key | [i18n key: farmerVerificationWizard.farmerShgPartnership] | ✅ |
| CONTENT-1209 | pages/farmer/VerificationWizard.jsx | 1454 | i18n-key | [i18n key: farmerVerificationWizard.registrationCinNumber_req] | ✅ |
| CONTENT-1210 | pages/farmer/VerificationWizard.jsx | 1458 | i18n-key | [i18n key: farmerVerificationWizard.egU01111mh2020ptc123456] | ✅ |
| CONTENT-1211 | pages/farmer/VerificationWizard.jsx | 1465 | i18n-key | [i18n key: farmerVerificationWizard.state_req] | ✅ |
| CONTENT-1212 | pages/farmer/VerificationWizard.jsx | 1467 | dynamic | {{orgForm.state}} | ❌ |
| CONTENT-1213 | pages/farmer/VerificationWizard.jsx | 1478 | i18n-key | [i18n key: farmerVerificationWizard.district_req] | ✅ |
| CONTENT-1214 | pages/farmer/VerificationWizard.jsx | 1482 | i18n-key | [i18n key: farmerVerificationWizard.egNashik] | ✅ |
| CONTENT-1215 | pages/farmer/VerificationWizard.jsx | 1483 | dynamic | {{orgForm.district}} | ❌ |
| CONTENT-1216 | pages/farmer/VerificationWizard.jsx | 1489 | i18n-key | [i18n key: farmerVerificationWizard.pincode_req] | ✅ |
| CONTENT-1217 | pages/farmer/VerificationWizard.jsx | 1493 | i18n-key | [i18n key: farmerVerificationWizard.eg422001] | ✅ |
| CONTENT-1218 | pages/farmer/VerificationWizard.jsx | 1502 | i18n-key | [i18n key: farmerVerificationWizard.registeredOfficeAddress_req] | ✅ |
| CONTENT-1219 | pages/farmer/VerificationWizard.jsx | 1506 | i18n-key | [i18n key: farmerVerificationWizard.fullAddressOfOrganizationOffice] | ✅ |
| CONTENT-1220 | pages/farmer/VerificationWizard.jsx | 1507 | dynamic | {{orgForm.address}} | ❌ |
| CONTENT-1221 | pages/farmer/VerificationWizard.jsx | 1519 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1222 | pages/farmer/VerificationWizard.jsx | 1532 | i18n-key | [i18n key: farmerVerificationWizard.saveExit] | ✅ |
| CONTENT-1223 | pages/farmer/VerificationWizard.jsx | 1541 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1224 | pages/farmer/VerificationWizard.jsx | 1553 | i18n-key | [i18n key: farmerVerificationWizard.organizationPanProtocol] | ✅ |
| CONTENT-1225 | pages/farmer/VerificationWizard.jsx | 1554 | i18n-key | [i18n key: farmerVerificationWizard.enterPermanentAccountNumberIssuedIn] | ✅ |
| CONTENT-1226 | pages/farmer/VerificationWizard.jsx | 1568 | i18n-key | [i18n key: farmerVerificationWizard.orgPan] | ✅ |
| CONTENT-1227 | pages/farmer/VerificationWizard.jsx | 1569 | i18n-key | [i18n key: farmerVerificationWizard.legalName] | ✅ |
| CONTENT-1228 | pages/farmer/VerificationWizard.jsx | 1575 | i18n-key | [i18n key: farmerVerificationWizard.organizationPan_req] | ✅ |
| CONTENT-1229 | pages/farmer/VerificationWizard.jsx | 1580 | i18n-key | [i18n key: farmerVerificationWizard.egAaacf1234g] | ✅ |
| CONTENT-1230 | pages/farmer/VerificationWizard.jsx | 1592 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1231 | pages/farmer/VerificationWizard.jsx | 1605 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1232 | pages/farmer/VerificationWizard.jsx | 1614 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1233 | pages/farmer/VerificationWizard.jsx | 1626 | i18n-key | [i18n key: farmerVerificationWizard.gstinRegistrationProtocol] | ✅ |
| CONTENT-1234 | pages/farmer/VerificationWizard.jsx | 1627 | i18n-key | [i18n key: farmerVerificationWizard.provide15characterGstinRegistrationIfRegiste | ✅ |
| CONTENT-1235 | pages/farmer/VerificationWizard.jsx | 1637 | i18n-key | [i18n key: farmerVerificationWizard.notApplicable] | ✅ |
| CONTENT-1236 | pages/farmer/VerificationWizard.jsx | 1644 | jsx-text | 15-Digit GSTIN Number | ❌ |
| CONTENT-1237 | pages/farmer/VerificationWizard.jsx | 1648 | i18n-key | [i18n key: farmerVerificationWizard.eg27aaacf1234g1z5] | ✅ |
| CONTENT-1238 | pages/farmer/VerificationWizard.jsx | 1670 | i18n-key | [i18n key: farmerVerificationWizard.verifyGstin] | ✅ |
| CONTENT-1239 | pages/farmer/VerificationWizard.jsx | 1684 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1240 | pages/farmer/VerificationWizard.jsx | 1691 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1241 | pages/farmer/VerificationWizard.jsx | 1702 | i18n-key | [i18n key: farmerVerificationWizard.authorizedOfficialProtocol] | ✅ |
| CONTENT-1242 | pages/farmer/VerificationWizard.jsx | 1703 | i18n-key | [i18n key: farmerVerificationWizard.verifyIdentityAndMobileAuthorizationOf] | ✅ |
| CONTENT-1243 | pages/farmer/VerificationWizard.jsx | 1721 | i18n-key | [i18n key: farmerVerificationWizard.representativeName_req] | ✅ |
| CONTENT-1244 | pages/farmer/VerificationWizard.jsx | 1725 | i18n-key | [i18n key: farmerVerificationWizard.egRameshKumar] | ✅ |
| CONTENT-1245 | pages/farmer/VerificationWizard.jsx | 1732 | i18n-key | [i18n key: farmerVerificationWizard.designation_req] | ✅ |
| CONTENT-1246 | pages/farmer/VerificationWizard.jsx | 1736 | i18n-key | [i18n key: farmerVerificationWizard.egCeoManagingDirector] | ✅ |
| CONTENT-1247 | pages/farmer/VerificationWizard.jsx | 1745 | i18n-key | [i18n key: farmerVerificationWizard.representativeMobileNumber_req] | ✅ |
| CONTENT-1248 | pages/farmer/VerificationWizard.jsx | 1750 | i18n-key | [i18n key: farmerVerificationWizard.enter10digitMobileNumber] | ✅ |
| CONTENT-1249 | pages/farmer/VerificationWizard.jsx | 1764 | i18n-key | [i18n key: farmerVerificationWizard.sendRepresentativeOtp] | ✅ |
| CONTENT-1250 | pages/farmer/VerificationWizard.jsx | 1770 | i18n-key | [i18n key: farmerVerificationWizard.enter6digitOtp_req] | ✅ |
| CONTENT-1251 | pages/farmer/VerificationWizard.jsx | 1774 | i18n-key | [i18n key: farmerVerificationWizard.text_mnk1z] | ✅ |
| CONTENT-1252 | pages/farmer/VerificationWizard.jsx | 1786 | i18n-key | [i18n key: farmerVerificationWizard.verifyRepresentative] | ✅ |
| CONTENT-1253 | pages/farmer/VerificationWizard.jsx | 1801 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1254 | pages/farmer/VerificationWizard.jsx | 1810 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1255 | pages/farmer/VerificationWizard.jsx | 1822 | i18n-key | [i18n key: farmerVerificationWizard.organizationSettlementAccountProtocol] | ✅ |
| CONTENT-1256 | pages/farmer/VerificationWizard.jsx | 1823 | i18n-key | [i18n key: farmerVerificationWizard.linkPrimarySettlementBankAccountOf] | ✅ |
| CONTENT-1257 | pages/farmer/VerificationWizard.jsx | 1840 | i18n-key | [i18n key: farmerVerificationWizard.accountHolderName_req] | ✅ |
| CONTENT-1258 | pages/farmer/VerificationWizard.jsx | 1844 | i18n-key | [i18n key: farmerVerificationWizard.exactLegalNameAsPerBank] | ✅ |
| CONTENT-1259 | pages/farmer/VerificationWizard.jsx | 1852 | i18n-key | [i18n key: farmerVerificationWizard.bankName_req] | ✅ |
| CONTENT-1260 | pages/farmer/VerificationWizard.jsx | 1862 | i18n-key | [i18n key: farmerVerificationWizard.branchName] | ✅ |
| CONTENT-1261 | pages/farmer/VerificationWizard.jsx | 1865 | i18n-key | [i18n key: farmerVerificationWizard.egCommercialBranch] | ✅ |
| CONTENT-1262 | pages/farmer/VerificationWizard.jsx | 1874 | i18n-key | [i18n key: farmerVerificationWizard.accountNumber_req] | ✅ |
| CONTENT-1263 | pages/farmer/VerificationWizard.jsx | 1878 | i18n-key | [i18n key: farmerVerificationWizard.enterBankAccountNumber] | ✅ |
| CONTENT-1264 | pages/farmer/VerificationWizard.jsx | 1885 | i18n-key | [i18n key: farmerVerificationWizard.confirmAccountNumber_req] | ✅ |
| CONTENT-1265 | pages/farmer/VerificationWizard.jsx | 1889 | i18n-key | [i18n key: farmerVerificationWizard.reenterAccountNumber] | ✅ |
| CONTENT-1266 | pages/farmer/VerificationWizard.jsx | 1897 | i18n-key | [i18n key: farmerVerificationWizard.ifscCode_req] | ✅ |
| CONTENT-1267 | pages/farmer/VerificationWizard.jsx | 1902 | i18n-key | [i18n key: farmerVerificationWizard.egSbin0001234] | ✅ |
| CONTENT-1268 | pages/farmer/VerificationWizard.jsx | 1915 | i18n-key | [i18n key: farmerVerificationWizard.verifyContinue] | ✅ |
| CONTENT-1269 | pages/farmer/VerificationWizard.jsx | 1928 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1270 | pages/farmer/VerificationWizard.jsx | 1937 | i18n-key | [i18n key: farmerVerificationWizard.nextStep] | ✅ |
| CONTENT-1271 | pages/farmer/VerificationWizard.jsx | 1949 | i18n-key | [i18n key: farmerVerificationWizard.organizationDocumentDossier] | ✅ |
| CONTENT-1272 | pages/farmer/VerificationWizard.jsx | 1950 | i18n-key | [i18n key: farmerVerificationWizard.uploadMandatoryRegistrationTaxBankProof] | ✅ |
| CONTENT-1273 | pages/farmer/VerificationWizard.jsx | 1971 | i18n-key | [i18n key: farmerVerificationWizard.1OrganizationRegistrationCertificate_req] | ✅ |
| CONTENT-1274 | pages/farmer/VerificationWizard.jsx | 1980 | i18n-key | [i18n key: farmerVerificationWizard.2OrganizationPanCardCopy_req] | ✅ |
| CONTENT-1275 | pages/farmer/VerificationWizard.jsx | 1989 | i18n-key | [i18n key: farmerVerificationWizard.3BankPassbookCancelledCheque_req] | ✅ |
| CONTENT-1276 | pages/farmer/VerificationWizard.jsx | 1998 | i18n-key | [i18n key: farmerVerificationWizard.4AuthorizationLetterBoardResolution] | ✅ |
| CONTENT-1277 | pages/farmer/VerificationWizard.jsx | 2007 | i18n-key | [i18n key: farmerVerificationWizard.5GstCertificateIfApplicable] | ✅ |
| CONTENT-1278 | pages/farmer/VerificationWizard.jsx | 2017 | i18n-key | [i18n key: farmerVerificationWizard.submitDocumentsProceed] | ✅ |
| CONTENT-1279 | pages/farmer/VerificationWizard.jsx | 2030 | i18n-key | [i18n key: farmerVerificationWizard.back] | ✅ |
| CONTENT-1280 | pages/farmer/VerificationWizard.jsx | 2037 | i18n-key | [i18n key: farmerVerificationWizard.viewSummary] | ✅ |
| CONTENT-1281 | pages/farmer/VerificationWizard.jsx | 2094 | dynamic | {{st.name}} | ❌ |
| CONTENT-1282 | pages/farmer/VerificationWizard.jsx | 2122 | i18n-key | [i18n key: farmerVerificationWizard.backToReview] | ✅ |
| CONTENT-1283 | pages/farmer/VerificationWizard.jsx | 2131 | i18n-key | [i18n key: farmerVerificationWizard.returnToDashboard] | ✅ |
| CONTENT-1284 | pages/farmer/VerificationWizard.jsx | 2141 | i18n-key | [i18n key: farmerVerificationWizard.yourInformationIsSecurelyProcessedSensitive] | ✅ |

## Admin

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0001 | components/common/BlockchainAuditBadge.jsx | 44 | i18n-key | [i18n key: blockchain.checking] | ✅ |
| CONTENT-0002 | components/common/BlockchainAuditBadge.jsx | 62 | i18n-key | [i18n key: blockchain.verifiedOn] | ✅ |
| CONTENT-0003 | components/common/BlockchainAuditBadge.jsx | 62 | i18n-key | [i18n key: blockchain.testnet] | ✅ |
| CONTENT-0004 | components/common/BlockchainAuditBadge.jsx | 65 | i18n-key | [i18n key: blockchain.audit] | ✅ |
| CONTENT-0005 | components/common/BlockchainAuditBadge.jsx | 80 | i18n-key | [i18n key: blockchain.confirmed] | ✅ |
| CONTENT-0006 | components/common/BlockchainAuditBadge.jsx | 84 | i18n-key | [i18n key: blockchain.network] | ✅ |
| CONTENT-0007 | components/common/BlockchainAuditBadge.jsx | 84 | i18n-key | [i18n key: blockchain.testnet] | ✅ |
| CONTENT-0008 | components/common/BlockchainAuditBadge.jsx | 95 | i18n-key | [i18n key: blockchain.transaction] | ✅ |
| CONTENT-0196 | pages/admin/Analytics.jsx | 20 | i18n-key | [i18n key: admin.noAnalyticsDataRecordedYet] | ✅ |
| CONTENT-0197 | pages/admin/Analytics.jsx | 25 | i18n-key | [i18n key: admin.platformIntelligence] | ✅ |
| CONTENT-0198 | pages/admin/Analytics.jsx | 26 | i18n-key | [i18n key: admin.platformAnalytics] | ✅ |
| CONTENT-0199 | pages/admin/Analytics.jsx | 27 | i18n-key | [i18n key: admin.deepDiveIntoTradeRevenuesSeller] | ✅ |
| CONTENT-0200 | pages/admin/Analytics.jsx | 31 | i18n-key | Monthly Revenue Trend | ✅ |
| CONTENT-0201 | pages/admin/Analytics.jsx | 31 | i18n-key | Gross merchandise volume by month. | ✅ |
| CONTENT-0202 | pages/admin/Analytics.jsx | 43 | i18n-key | Order Status Breakdown | ✅ |
| CONTENT-0203 | pages/admin/Analytics.jsx | 43 | i18n-key | Ratio of pending, active, and completed orders. | ✅ |
| CONTENT-0204 | pages/admin/Analytics.jsx | 54 | i18n-key | Farmer & FPO Registrations | ✅ |
| CONTENT-0205 | pages/admin/Analytics.jsx | 54 | i18n-key | Registration velocity over time. | ✅ |
| CONTENT-0206 | pages/admin/Analytics.jsx | 66 | i18n-key | Category Listing Volume | ✅ |
| CONTENT-0207 | pages/admin/Analytics.jsx | 66 | i18n-key | Number of active listings per produce category. | ✅ |
| CONTENT-0208 | pages/admin/BlockchainAudit.jsx | 36 | toast:success | Fetched ${res.paymentEvents?.length \|\| 0} payment and ${res.settlementEvents?. | ❌ |
| CONTENT-0209 | pages/admin/BlockchainAudit.jsx | 38 | toast:error | Failed to query smart contract audit events. | ❌ |
| CONTENT-0210 | pages/admin/BlockchainAudit.jsx | 70 | toast:error | Please enter a valid Account Hash. | ❌ |
| CONTENT-0211 | pages/admin/BlockchainAudit.jsx | 88 | toast:success | Copied to clipboard! | ❌ |
| CONTENT-0212 | pages/admin/BlockchainAudit.jsx | 97 | i18n-key | Direct Smart Contract RPC Query | ✅ |
| CONTENT-0213 | pages/admin/BlockchainAudit.jsx | 100 | i18n-key | Blockchain Audit Trail | ✅ |
| CONTENT-0214 | pages/admin/BlockchainAudit.jsx | 103 | i18n-key | Immutable, append-only payment & settlement audit records fetched directly from  | ✅ |
| CONTENT-0215 | pages/admin/BlockchainAudit.jsx | 113 | i18n-key | Fetching On-Chain Data... | ✅ |
| CONTENT-0216 | pages/admin/BlockchainAudit.jsx | 113 | i18n-key | Fetch On-Chain Data | ✅ |
| CONTENT-0217 | pages/admin/BlockchainAudit.jsx | 120 | i18n-key | [i18n key: blockchain.blockchainNetwork] | ✅ |
| CONTENT-0218 | pages/admin/BlockchainAudit.jsx | 128 | i18n-key | [i18n key: blockchain.smartContractAddress] | ✅ |
| CONTENT-0219 | pages/admin/BlockchainAudit.jsx | 131 | ternary | ${data.contractAddress.slice(0, 8)}...${data.contractAddress.slice(-6)} | ❌ |
| CONTENT-0220 | pages/admin/BlockchainAudit.jsx | 131 | ternary | N/A | ❌ |
| CONTENT-0221 | pages/admin/BlockchainAudit.jsx | 138 | prop:title | Open in Kava Explorer | ❌ |
| CONTENT-0222 | pages/admin/BlockchainAudit.jsx | 146 | i18n-key | [i18n key: blockchain.onchainPaymentAudits] | ✅ |
| CONTENT-0223 | pages/admin/BlockchainAudit.jsx | 154 | i18n-key | [i18n key: blockchain.onchainSettlementAudits] | ✅ |
| CONTENT-0224 | pages/admin/BlockchainAudit.jsx | 167 | i18n-key | VERIFY EVENT ID HASH ON-CHAIN | ✅ |
| CONTENT-0225 | pages/admin/BlockchainAudit.jsx | 169 | i18n-key | [i18n key: blockchain.smartContractEventVerifier] | ✅ |
| CONTENT-0226 | pages/admin/BlockchainAudit.jsx | 173 | i18n-key | Paste Event ID Hash (e.g. 0xd8273e6f...) | ✅ |
| CONTENT-0227 | pages/admin/BlockchainAudit.jsx | 183 | i18n-key | Verify | ✅ |
| CONTENT-0228 | pages/admin/BlockchainAudit.jsx | 189 | ternary | bg-emerald-950/60 border-emerald-500/50 text-emerald-200 | ❌ |
| CONTENT-0229 | pages/admin/BlockchainAudit.jsx | 189 | ternary | bg-red-950/60 border-red-500/50 text-red-200 | ❌ |
| CONTENT-0230 | pages/admin/BlockchainAudit.jsx | 198 | ternary | CONFIRMED | ❌ |
| CONTENT-0231 | pages/admin/BlockchainAudit.jsx | 198 | ternary | UNRECORDED | ❌ |
| CONTENT-0232 | pages/admin/BlockchainAudit.jsx | 207 | i18n-key | [i18n key: blockchain.itemsPurchased] | ✅ |
| CONTENT-0233 | pages/admin/BlockchainAudit.jsx | 212 | i18n-key | [i18n key: blockchain.totalAmount] | ✅ |
| CONTENT-0234 | pages/admin/BlockchainAudit.jsx | 220 | i18n-key | [i18n key: blockchain.paymentIdHash] | ✅ |
| CONTENT-0235 | pages/admin/BlockchainAudit.jsx | 228 | prop:title | Copy Hash | ❌ |
| CONTENT-0236 | pages/admin/BlockchainAudit.jsx | 237 | i18n-key | [i18n key: blockchain.orderIdHash] | ✅ |
| CONTENT-0237 | pages/admin/BlockchainAudit.jsx | 245 | prop:title | Copy Hash | ❌ |
| CONTENT-0238 | pages/admin/BlockchainAudit.jsx | 255 | jsx-text | 👤 Buyer Cryptographic Account Hash: | ❌ |
| CONTENT-0239 | pages/admin/BlockchainAudit.jsx | 263 | prop:title | Copy Buyer Hash | ❌ |
| CONTENT-0240 | pages/admin/BlockchainAudit.jsx | 280 | jsx-text | 🌾 Per-Seller Items & Payout Splits: | ❌ |
| CONTENT-0241 | pages/admin/BlockchainAudit.jsx | 292 | prop:title | Copy Seller Hash | ❌ |
| CONTENT-0242 | pages/admin/BlockchainAudit.jsx | 328 | prop:title | Copy Seller Hash | ❌ |
| CONTENT-0243 | pages/admin/BlockchainAudit.jsx | 343 | i18n-key | [i18n key: blockchain.noSellerSplitHashesRecordedFor] | ✅ |
| CONTENT-0244 | pages/admin/BlockchainAudit.jsx | 348 | i18n-key | [i18n key: blockchain.amountInPaise] | ✅ |
| CONTENT-0245 | pages/admin/BlockchainAudit.jsx | 349 | i18n-key | [i18n key: blockchain.recordedAt] | ✅ |
| CONTENT-0246 | pages/admin/BlockchainAudit.jsx | 364 | i18n-key | Buyer & Seller Hash Lookup | ✅ |
| CONTENT-0247 | pages/admin/BlockchainAudit.jsx | 366 | i18n-key | [i18n key: blockchain.lookupUserIdentityByAccountHash] | ✅ |
| CONTENT-0248 | pages/admin/BlockchainAudit.jsx | 368 | i18n-key | Paste any Buyer Hash or Seller Hash (0x...) to reveal their full profile, contac | ✅ |
| CONTENT-0249 | pages/admin/BlockchainAudit.jsx | 373 | i18n-key | Paste Buyer Hash or Seller Hash (0x...) | ✅ |
| CONTENT-0250 | pages/admin/BlockchainAudit.jsx | 382 | i18n-key | Lookup Identity | ✅ |
| CONTENT-0251 | pages/admin/BlockchainAudit.jsx | 401 | i18n-key | Payment Audits On-Chain | ✅ |
| CONTENT-0252 | pages/admin/BlockchainAudit.jsx | 416 | i18n-key | Settlement Audits On-Chain | ✅ |
| CONTENT-0253 | pages/admin/BlockchainAudit.jsx | 428 | i18n-key | [i18n key: blockchain.queryingKavaEvmTestnetSmartContract] | ✅ |
| CONTENT-0254 | pages/admin/BlockchainAudit.jsx | 434 | i18n-key | [i18n key: blockchain.noPaymentEventsRecordedOnchainYet] | ✅ |
| CONTENT-0255 | pages/admin/BlockchainAudit.jsx | 435 | i18n-key | [i18n key: blockchain.newPaymentsProcessedThroughRazorpayWill] | ✅ |
| CONTENT-0256 | pages/admin/BlockchainAudit.jsx | 441 | i18n-key | [i18n key: blockchain.eventIdHash] | ✅ |
| CONTENT-0257 | pages/admin/BlockchainAudit.jsx | 442 | i18n-key | [i18n key: blockchain.itemsPurchased] | ✅ |
| CONTENT-0258 | pages/admin/BlockchainAudit.jsx | 443 | i18n-key | Buyer Hash & Identity | ✅ |
| CONTENT-0259 | pages/admin/BlockchainAudit.jsx | 444 | i18n-key | [i18n key: blockchain.sellerSplitHashes] | ✅ |
| CONTENT-0260 | pages/admin/BlockchainAudit.jsx | 445 | i18n-key | Amount (₹) | ✅ |
| CONTENT-0261 | pages/admin/BlockchainAudit.jsx | 446 | i18n-key | [i18n key: blockchain.onchainStatus] | ✅ |
| CONTENT-0262 | pages/admin/BlockchainAudit.jsx | 447 | i18n-key | [i18n key: blockchain.recordedAt] | ✅ |
| CONTENT-0263 | pages/admin/BlockchainAudit.jsx | 455 | ternary | ${evt.eventIdHash.slice(0, 10)}... | ❌ |
| CONTENT-0264 | pages/admin/BlockchainAudit.jsx | 455 | ternary | N/A | ❌ |
| CONTENT-0265 | pages/admin/BlockchainAudit.jsx | 459 | prop:title | Copy full hash | ❌ |
| CONTENT-0266 | pages/admin/BlockchainAudit.jsx | 476 | prop:title | Click to lookup Buyer identity | ❌ |
| CONTENT-0267 | pages/admin/BlockchainAudit.jsx | 479 | ternary | ${evt.buyerIdHash.slice(0, 8)}... | ❌ |
| CONTENT-0268 | pages/admin/BlockchainAudit.jsx | 479 | ternary | Lookup Buyer | ❌ |
| CONTENT-0269 | pages/admin/BlockchainAudit.jsx | 490 | prop:title | Click to lookup Seller identity | ❌ |
| CONTENT-0270 | pages/admin/BlockchainAudit.jsx | 493 | ternary | ${sHash.slice(0, 8)}... | ❌ |
| CONTENT-0271 | pages/admin/BlockchainAudit.jsx | 493 | ternary | Lookup Seller | ❌ |
| CONTENT-0272 | pages/admin/BlockchainAudit.jsx | 529 | i18n-key | [i18n key: blockchain.noSettlementEventsRecordedOnchainYet] | ✅ |
| CONTENT-0273 | pages/admin/BlockchainAudit.jsx | 530 | i18n-key | [i18n key: blockchain.farmerMarketplaceSettlementsWillAppearHere] | ✅ |
| CONTENT-0274 | pages/admin/BlockchainAudit.jsx | 536 | i18n-key | [i18n key: blockchain.eventIdHash] | ✅ |
| CONTENT-0275 | pages/admin/BlockchainAudit.jsx | 537 | i18n-key | [i18n key: blockchain.settlementHash] | ✅ |
| CONTENT-0276 | pages/admin/BlockchainAudit.jsx | 538 | i18n-key | [i18n key: blockchain.sellerIdentity] | ✅ |
| CONTENT-0277 | pages/admin/BlockchainAudit.jsx | 539 | i18n-key | [i18n key: blockchain.sellerPayoutAmount] | ✅ |
| CONTENT-0278 | pages/admin/BlockchainAudit.jsx | 540 | i18n-key | [i18n key: blockchain.status] | ✅ |
| CONTENT-0279 | pages/admin/BlockchainAudit.jsx | 541 | i18n-key | [i18n key: blockchain.recordedAt] | ✅ |
| CONTENT-0280 | pages/admin/BlockchainAudit.jsx | 549 | ternary | ${evt.eventIdHash.slice(0, 10)}... | ❌ |
| CONTENT-0281 | pages/admin/BlockchainAudit.jsx | 549 | ternary | N/A | ❌ |
| CONTENT-0282 | pages/admin/BlockchainAudit.jsx | 553 | prop:title | Copy full hash | ❌ |
| CONTENT-0283 | pages/admin/BlockchainAudit.jsx | 561 | ternary | ${evt.settlementIdHash.slice(0, 10)}... | ❌ |
| CONTENT-0284 | pages/admin/BlockchainAudit.jsx | 561 | ternary | N/A | ❌ |
| CONTENT-0285 | pages/admin/BlockchainAudit.jsx | 568 | prop:title | Click to lookup Seller identity | ❌ |
| CONTENT-0286 | pages/admin/BlockchainAudit.jsx | 571 | ternary | ${evt.sellerIdHash.slice(0, 8)}... | ❌ |
| CONTENT-0287 | pages/admin/BlockchainAudit.jsx | 571 | ternary | Lookup Seller | ❌ |
| CONTENT-0288 | pages/admin/BlockchainAudit.jsx | 608 | i18n-key | [i18n key: blockchain.accountIdentityLookup] | ✅ |
| CONTENT-0289 | pages/admin/BlockchainAudit.jsx | 609 | i18n-key | [i18n key: blockchain.verifiedDatabaseRecordMatchingOnchainCryptographic] | ✅ |
| CONTENT-0290 | pages/admin/BlockchainAudit.jsx | 623 | i18n-key | [i18n key: blockchain.searchingRegisteredUsersAndFarmers] | ✅ |
| CONTENT-0291 | pages/admin/BlockchainAudit.jsx | 628 | i18n-key | [i18n key: blockchain.onchainHash] | ✅ |
| CONTENT-0292 | pages/admin/BlockchainAudit.jsx | 633 | i18n-key | [i18n key: blockchain.accountType] | ✅ |
| CONTENT-0293 | pages/admin/BlockchainAudit.jsx | 642 | i18n-key | [i18n key: blockchain.fullName] | ✅ |
| CONTENT-0294 | pages/admin/BlockchainAudit.jsx | 646 | i18n-key | [i18n key: blockchain.farmBusiness] | ✅ |
| CONTENT-0295 | pages/admin/BlockchainAudit.jsx | 650 | i18n-key | [i18n key: blockchain.email] | ✅ |
| CONTENT-0296 | pages/admin/BlockchainAudit.jsx | 654 | i18n-key | [i18n key: blockchain.mobile] | ✅ |
| CONTENT-0297 | pages/admin/BlockchainAudit.jsx | 658 | i18n-key | [i18n key: blockchain.verificationStatus] | ✅ |
| CONTENT-0298 | pages/admin/BlockchainAudit.jsx | 665 | i18n-key | [i18n key: blockchain.fullName] | ✅ |
| CONTENT-0299 | pages/admin/BlockchainAudit.jsx | 669 | i18n-key | [i18n key: blockchain.email] | ✅ |
| CONTENT-0300 | pages/admin/BlockchainAudit.jsx | 673 | i18n-key | [i18n key: blockchain.mobile] | ✅ |
| CONTENT-0301 | pages/admin/BlockchainAudit.jsx | 678 | i18n-key | [i18n key: blockchain.buyerType] | ✅ |
| CONTENT-0302 | pages/admin/BlockchainAudit.jsx | 689 | i18n-key | [i18n key: blockchain.noAccountFound] | ✅ |
| CONTENT-0303 | pages/admin/Dashboard.jsx | 18 | toast:error | Failed to load dashboard. | ❌ |
| CONTENT-0304 | pages/admin/Dashboard.jsx | 25 | i18n-key | PRODUCT NAME | ✅ |
| CONTENT-0305 | pages/admin/Dashboard.jsx | 25 | dynamic | {{o.productName}} | ✅ |
| CONTENT-0306 | pages/admin/Dashboard.jsx | 26 | i18n-key | BUYER | ✅ |
| CONTENT-0307 | pages/admin/Dashboard.jsx | 27 | i18n-key | FARMER / FPO | ✅ |
| CONTENT-0308 | pages/admin/Dashboard.jsx | 28 | i18n-key | AMOUNT | ✅ |
| CONTENT-0309 | pages/admin/Dashboard.jsx | 29 | i18n-key | STATUS | ✅ |
| CONTENT-0310 | pages/admin/Dashboard.jsx | 35 | i18n-key | [i18n key: common.executiveControls] | ✅ |
| CONTENT-0311 | pages/admin/Dashboard.jsx | 36 | i18n-key | [i18n key: common.adminDashboard] | ✅ |
| CONTENT-0312 | pages/admin/Dashboard.jsx | 37 | i18n-key | [i18n key: common.agribazaarPlatformMetricsFarmerVerificationPipeline] | ✅ |
| CONTENT-0313 | pages/admin/Dashboard.jsx | 41 | i18n-key | Total Users | ✅ |
| CONTENT-0314 | pages/admin/Dashboard.jsx | 42 | i18n-key | Farmers / FPOs | ✅ |
| CONTENT-0315 | pages/admin/Dashboard.jsx | 43 | i18n-key | Pending Verifications | ✅ |
| CONTENT-0316 | pages/admin/Dashboard.jsx | 44 | i18n-key | Active Products | ✅ |
| CONTENT-0317 | pages/admin/Dashboard.jsx | 45 | i18n-key | Total Orders | ✅ |
| CONTENT-0318 | pages/admin/Dashboard.jsx | 46 | i18n-key | Completed Orders | ✅ |
| CONTENT-0319 | pages/admin/Dashboard.jsx | 47 | i18n-key | Total Revenue | ✅ |
| CONTENT-0320 | pages/admin/Dashboard.jsx | 48 | i18n-key | Total Buyers | ✅ |
| CONTENT-0321 | pages/admin/Dashboard.jsx | 52 | i18n-key | Monthly Order Volume | ✅ |
| CONTENT-0322 | pages/admin/Dashboard.jsx | 52 | i18n-key | Number of fulfilled orders by month. | ✅ |
| CONTENT-0323 | pages/admin/Dashboard.jsx | 63 | i18n-key | [i18n key: common.noOrderVolumeDataYet] | ✅ |
| CONTENT-0324 | pages/admin/Dashboard.jsx | 66 | i18n-key | Product Category Distribution | ✅ |
| CONTENT-0325 | pages/admin/Dashboard.jsx | 66 | i18n-key | Active crop listings across categories. | ✅ |
| CONTENT-0326 | pages/admin/Dashboard.jsx | 76 | i18n-key | [i18n key: common.noCategoryDistributionDataYet] | ✅ |
| CONTENT-0327 | pages/admin/Dashboard.jsx | 81 | i18n-key | [i18n key: common.recentPlatformOrders] | ✅ |
| CONTENT-0328 | pages/admin/Dashboard.jsx | 85 | i18n-key | No platform orders | ✅ |
| CONTENT-0329 | pages/admin/Disputes.jsx | 28 | toast:success | Dispute status updated to ${status.toLowerCase()}. | ❌ |
| CONTENT-0330 | pages/admin/Disputes.jsx | 32 | toast:error | Failed to update dispute. | ❌ |
| CONTENT-0331 | pages/admin/Disputes.jsx | 37 | i18n-key | COMPLAINANT | ✅ |
| CONTENT-0332 | pages/admin/Disputes.jsx | 41 | i18n-key | DISPUTE REASON | ✅ |
| CONTENT-0333 | pages/admin/Disputes.jsx | 42 | i18n-key | STATUS | ✅ |
| CONTENT-0334 | pages/admin/Disputes.jsx | 44 | i18n-key | ACTIONS | ✅ |
| CONTENT-0335 | pages/admin/Disputes.jsx | 52 | i18n-key | Review | ✅ |
| CONTENT-0336 | pages/admin/Disputes.jsx | 55 | i18n-key | Resolve | ✅ |
| CONTENT-0337 | pages/admin/Disputes.jsx | 61 | i18n-key | Resolve Issue | ✅ |
| CONTENT-0338 | pages/admin/Disputes.jsx | 72 | i18n-key | [i18n key: common.conflictOversight] | ✅ |
| CONTENT-0339 | pages/admin/Disputes.jsx | 73 | i18n-key | [i18n key: common.disputeResolution] | ✅ |
| CONTENT-0340 | pages/admin/Disputes.jsx | 74 | i18n-key | [i18n key: common.arbitrateBuyerAndFarmerClaimsQuality] | ✅ |
| CONTENT-0341 | pages/admin/Disputes.jsx | 81 | i18n-key | No open disputes | ✅ |
| CONTENT-0342 | pages/admin/Disputes.jsx | 82 | i18n-key | Platform trade operations are running smoothly with 0 open claims. | ✅ |
| CONTENT-0343 | pages/admin/Disputes.jsx | 89 | i18n-key | [i18n key: common.resolveDispute] | ✅ |
| CONTENT-0344 | pages/admin/Disputes.jsx | 93 | i18n-key | Admin response details... | ✅ |
| CONTENT-0345 | pages/admin/Disputes.jsx | 99 | i18n-key | Cancel | ✅ |
| CONTENT-0346 | pages/admin/Disputes.jsx | 102 | i18n-key | Reject Claim | ✅ |
| CONTENT-0347 | pages/admin/Disputes.jsx | 105 | i18n-key | Resolve Claim | ✅ |
| CONTENT-0348 | pages/admin/Farmers.jsx | 35 | toast:success | Farmer verification ${status.toLowerCase()}. | ❌ |
| CONTENT-0349 | pages/admin/Farmers.jsx | 39 | toast:error | Failed to update verification. | ❌ |
| CONTENT-0350 | pages/admin/Farmers.jsx | 46 | i18n-key | FARMER / FPO NAME | ✅ |
| CONTENT-0351 | pages/admin/Farmers.jsx | 50 | dynamic | {{f.fullName}} | ❌ |
| CONTENT-0352 | pages/admin/Farmers.jsx | 51 | dynamic | {{f.farmName}} | ❌ |
| CONTENT-0353 | pages/admin/Farmers.jsx | 55 | i18n-key | SELLER TYPE | ✅ |
| CONTENT-0354 | pages/admin/Farmers.jsx | 57 | i18n-key | CONTACT INFO | ✅ |
| CONTENT-0355 | pages/admin/Farmers.jsx | 61 | dynamic | {{f.email}} | ❌ |
| CONTENT-0356 | pages/admin/Farmers.jsx | 66 | i18n-key | LOCATION | ✅ |
| CONTENT-0357 | pages/admin/Farmers.jsx | 67 | i18n-key | VERIFICATION | ✅ |
| CONTENT-0358 | pages/admin/Farmers.jsx | 69 | i18n-key | AUDIT PROVENANCE | ✅ |
| CONTENT-0359 | pages/admin/Farmers.jsx | 74 | i18n-key | ACTIONS | ✅ |
| CONTENT-0360 | pages/admin/Farmers.jsx | 82 | i18n-key | Verify | ✅ |
| CONTENT-0361 | pages/admin/Farmers.jsx | 85 | i18n-key | Reject | ✅ |
| CONTENT-0362 | pages/admin/Farmers.jsx | 91 | i18n-key | Approve Verification | ✅ |
| CONTENT-0363 | pages/admin/Farmers.jsx | 102 | i18n-key | [i18n key: common.kycVerificationPipeline] | ✅ |
| CONTENT-0364 | pages/admin/Farmers.jsx | 103 | i18n-key | Farmers & FPOs Approval | ✅ |
| CONTENT-0365 | pages/admin/Farmers.jsx | 104 | i18n-key | [i18n key: common.reviewFarmRegistrationsVerifyIdentityAnd] | ✅ |
| CONTENT-0366 | pages/admin/Farmers.jsx | 113 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0367 | pages/admin/Farmers.jsx | 113 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0368 | pages/admin/Farmers.jsx | 116 | i18n-key | All Applications | ✅ |
| CONTENT-0369 | pages/admin/Farmers.jsx | 125 | i18n-key | No verification applications found | ✅ |
| CONTENT-0370 | pages/admin/Farmers.jsx | 132 | i18n-key | [i18n key: adminFarmers.rejectFarmerModalTitle] | ✅ |
| CONTENT-0371 | pages/admin/Farmers.jsx | 132 | dynamic | {{verifyModal.fullName}} | ✅ |
| CONTENT-0372 | pages/admin/Farmers.jsx | 135 | i18n-key | Provide reason for verification rejection... | ✅ |
| CONTENT-0373 | pages/admin/Farmers.jsx | 141 | i18n-key | Cancel | ✅ |
| CONTENT-0374 | pages/admin/Farmers.jsx | 144 | i18n-key | Reject Farmer | ✅ |
| CONTENT-0390 | pages/admin/Payments.jsx | 19 | i18n-key | PAYMENT TX REFERENCE | ✅ |
| CONTENT-0391 | pages/admin/Payments.jsx | 24 | i18n-key | AMOUNT | ✅ |
| CONTENT-0392 | pages/admin/Payments.jsx | 32 | i18n-key | STATUS | ✅ |
| CONTENT-0393 | pages/admin/Payments.jsx | 34 | i18n-key | DATE | ✅ |
| CONTENT-0394 | pages/admin/Payments.jsx | 44 | i18n-key | [i18n key: common.financialAudit] | ✅ |
| CONTENT-0395 | pages/admin/Payments.jsx | 45 | i18n-key | [i18n key: common.paymentAuditLogs] | ✅ |
| CONTENT-0396 | pages/admin/Payments.jsx | 46 | i18n-key | [i18n key: common.auditPlatformTransactionSettlementsAndGateway] | ✅ |
| CONTENT-0397 | pages/admin/Payments.jsx | 54 | i18n-key | View On-Chain Blockchain Audit | ✅ |
| CONTENT-0398 | pages/admin/Payments.jsx | 62 | i18n-key | No payment records found | ✅ |
| CONTENT-0399 | pages/admin/Payments.jsx | 63 | i18n-key | Transactions will be recorded here when buyer orders are processed. | ✅ |
| CONTENT-0400 | pages/admin/Products.jsx | 31 | toast:success | Product listing status updated. | ❌ |
| CONTENT-0401 | pages/admin/Products.jsx | 33 | toast:error | Failed to update product status. | ❌ |
| CONTENT-0402 | pages/admin/Products.jsx | 38 | i18n-key | CROP LISTING | ✅ |
| CONTENT-0403 | pages/admin/Products.jsx | 43 | dynamic | {{p.productName}} | ❌ |
| CONTENT-0404 | pages/admin/Products.jsx | 47 | i18n-key | FARMER / FPO | ✅ |
| CONTENT-0405 | pages/admin/Products.jsx | 48 | i18n-key | CATEGORY | ✅ |
| CONTENT-0406 | pages/admin/Products.jsx | 50 | i18n-key | PRICE / UNIT | ✅ |
| CONTENT-0407 | pages/admin/Products.jsx | 52 | dynamic | {{p.unit}} | ❌ |
| CONTENT-0408 | pages/admin/Products.jsx | 54 | i18n-key | LISTING STATUS | ✅ |
| CONTENT-0409 | pages/admin/Products.jsx | 56 | i18n-key | ACTIONS | ✅ |
| CONTENT-0410 | pages/admin/Products.jsx | 63 | i18n-key | Disable Listing | ✅ |
| CONTENT-0411 | pages/admin/Products.jsx | 67 | i18n-key | Enable Listing | ✅ |
| CONTENT-0412 | pages/admin/Products.jsx | 78 | i18n-key | [i18n key: common.catalogModeration] | ✅ |
| CONTENT-0413 | pages/admin/Products.jsx | 79 | i18n-key | [i18n key: common.productModeration] | ✅ |
| CONTENT-0414 | pages/admin/Products.jsx | 80 | i18n-key | [i18n key: common.reviewActiveDraftAndPausedCrop] | ✅ |
| CONTENT-0415 | pages/admin/Products.jsx | 89 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0416 | pages/admin/Products.jsx | 89 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0417 | pages/admin/Products.jsx | 92 | i18n-key | All Listings | ✅ |
| CONTENT-0418 | pages/admin/Products.jsx | 101 | i18n-key | No produce listings found | ✅ |
| CONTENT-0419 | pages/admin/Settlements.jsx | 32 | toast:error | Failed to load farmer settlements. | ❌ |
| CONTENT-0420 | pages/admin/Settlements.jsx | 49 | i18n-key | FARMER / PRODUCER | ✅ |
| CONTENT-0421 | pages/admin/Settlements.jsx | 53 | dynamic | {{f.fullName}} | ❌ |
| CONTENT-0422 | pages/admin/Settlements.jsx | 54 | dynamic | {{f.farmName}} | ❌ |
| CONTENT-0423 | pages/admin/Settlements.jsx | 59 | i18n-key | AGRIBAZAAR VERIFICATION | ✅ |
| CONTENT-0424 | pages/admin/Settlements.jsx | 63 | ternary | bg-emerald-50 text-emerald-700 border-emerald-200 | ❌ |
| CONTENT-0425 | pages/admin/Settlements.jsx | 63 | ternary | bg-amber-50 text-amber-700 border-amber-200 | ❌ |
| CONTENT-0426 | pages/admin/Settlements.jsx | 65 | i18n-key | VERIFIED | ✅ |
| CONTENT-0427 | pages/admin/Settlements.jsx | 65 | i18n-key | PENDING VERIFICATION | ✅ |
| CONTENT-0428 | pages/admin/Settlements.jsx | 70 | i18n-key | RAZORPAY SELLER STATUS | ✅ |
| CONTENT-0429 | pages/admin/Settlements.jsx | 79 | i18n-key | SETTLEMENT ACCOUNT | ✅ |
| CONTENT-0430 | pages/admin/Settlements.jsx | 83 | i18n-key | [i18n key: admin.account] | ✅ |
| CONTENT-0431 | pages/admin/Settlements.jsx | 84 | i18n-key | [i18n key: admin.ifsc] | ✅ |
| CONTENT-0432 | pages/admin/Settlements.jsx | 92 | i18n-key | TOTAL SETTLED | ✅ |
| CONTENT-0433 | pages/admin/Settlements.jsx | 97 | i18n-key | PENDING SETTLEMENT | ✅ |
| CONTENT-0434 | pages/admin/Settlements.jsx | 102 | i18n-key | AUDIT PROVENANCE | ✅ |
| CONTENT-0435 | pages/admin/Settlements.jsx | 113 | i18n-key | Marketplace Financial Control | ✅ |
| CONTENT-0436 | pages/admin/Settlements.jsx | 116 | i18n-key | Payment & Settlement Overview | ✅ |
| CONTENT-0437 | pages/admin/Settlements.jsx | 119 | i18n-key | Track Razorpay seller account onboarding, Route activation, and marketplace spli | ✅ |
| CONTENT-0438 | pages/admin/Settlements.jsx | 127 | i18n-key | Refresh Settlements | ✅ |
| CONTENT-0439 | pages/admin/Settlements.jsx | 135 | i18n-key | Razorpay Route Capability is Pending Activation (Test Mode) | ✅ |
| CONTENT-0440 | pages/admin/Settlements.jsx | 137 | i18n-key | Environment flag RAZORPAY_ROUTE_ENABLED=false is active. Normal buyer checkout p | ✅ |
| CONTENT-0441 | pages/admin/Settlements.jsx | 150 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0442 | pages/admin/Settlements.jsx | 150 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0443 | pages/admin/Settlements.jsx | 153 | i18n-key | All Farmers | ✅ |
| CONTENT-0444 | pages/admin/Settlements.jsx | 162 | i18n-key | No seller settlement records | ✅ |
| CONTENT-0445 | pages/admin/Settlements.jsx | 163 | i18n-key | Farmer settlement statuses will appear here. | ✅ |
| CONTENT-0446 | pages/admin/Users.jsx | 31 | toast:success | User status updated. | ❌ |
| CONTENT-0447 | pages/admin/Users.jsx | 33 | toast:error | Failed to update status. | ❌ |
| CONTENT-0448 | pages/admin/Users.jsx | 38 | i18n-key | USER NAME | ✅ |
| CONTENT-0449 | pages/admin/Users.jsx | 40 | dynamic | {{u.fullName}} | ❌ |
| CONTENT-0450 | pages/admin/Users.jsx | 42 | i18n-key | EMAIL ADDRESS | ✅ |
| CONTENT-0451 | pages/admin/Users.jsx | 44 | i18n-key | ON-CHAIN ACCOUNT HASH | ✅ |
| CONTENT-0452 | pages/admin/Users.jsx | 48 | ternary | ${u.accountHash.slice(0, 10)}...${u.accountHash.slice(-6)} | ❌ |
| CONTENT-0453 | pages/admin/Users.jsx | 48 | ternary | N/A | ❌ |
| CONTENT-0454 | pages/admin/Users.jsx | 53 | toast:success | Account Hash copied! | ❌ |
| CONTENT-0455 | pages/admin/Users.jsx | 56 | prop:title | Copy full hash | ❌ |
| CONTENT-0456 | pages/admin/Users.jsx | 63 | i18n-key | ACCOUNT ROLE | ✅ |
| CONTENT-0457 | pages/admin/Users.jsx | 65 | i18n-key | ACCOUNT STATUS | ✅ |
| CONTENT-0458 | pages/admin/Users.jsx | 68 | ternary | text-[#00684a] | ❌ |
| CONTENT-0459 | pages/admin/Users.jsx | 68 | ternary | text-red-600 | ❌ |
| CONTENT-0460 | pages/admin/Users.jsx | 69 | i18n-key | Active | ✅ |
| CONTENT-0461 | pages/admin/Users.jsx | 69 | i18n-key | Suspended | ✅ |
| CONTENT-0462 | pages/admin/Users.jsx | 74 | i18n-key | ACTIONS | ✅ |
| CONTENT-0463 | pages/admin/Users.jsx | 80 | ternary | danger | ❌ |
| CONTENT-0464 | pages/admin/Users.jsx | 80 | ternary | primary | ❌ |
| CONTENT-0465 | pages/admin/Users.jsx | 84 | i18n-key | Suspend Account | ✅ |
| CONTENT-0466 | pages/admin/Users.jsx | 84 | i18n-key | Activate Account | ✅ |
| CONTENT-0467 | pages/admin/Users.jsx | 94 | i18n-key | [i18n key: admin.userDirectory] | ✅ |
| CONTENT-0468 | pages/admin/Users.jsx | 95 | i18n-key | [i18n key: admin.platformUserManagement] | ✅ |
| CONTENT-0469 | pages/admin/Users.jsx | 96 | i18n-key | [i18n key: admin.viewUserRolesAccessStatusesAnd] | ✅ |
| CONTENT-0470 | pages/admin/Users.jsx | 105 | ternary | bg-[#001e2b] text-[#00ed64] | ❌ |
| CONTENT-0471 | pages/admin/Users.jsx | 105 | ternary | bg-gray-100 text-gray-600 hover:bg-gray-200 | ❌ |
| CONTENT-0472 | pages/admin/Users.jsx | 108 | i18n-key | All Roles | ✅ |
| CONTENT-0473 | pages/admin/Users.jsx | 117 | i18n-key | No registered users found | ✅ |

## Authentication

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-1326 | pages/Login.jsx | 20 | toast:error | [i18n key: auth.requiredFields] | ✅ |
| CONTENT-1327 | pages/Login.jsx | 26 | toast:success | [i18n key: auth.loginSuccess] | ✅ |
| CONTENT-1328 | pages/Login.jsx | 31 | i18n-key | Login failed. Please try again. | ✅ |
| CONTENT-1329 | pages/Login.jsx | 45 | i18n-key | [i18n key: auth.agri] | ✅ |
| CONTENT-1330 | pages/Login.jsx | 45 | i18n-key | [i18n key: auth.bazaar] | ✅ |
| CONTENT-1331 | pages/Login.jsx | 47 | i18n-key | [i18n key: auth.welcomeBack] | ✅ |
| CONTENT-1332 | pages/Login.jsx | 48 | i18n-key | [i18n key: navigation.signIn] | ✅ |
| CONTENT-1333 | pages/Login.jsx | 54 | i18n-key | [i18n key: auth.email] | ✅ |
| CONTENT-1334 | pages/Login.jsx | 60 | i18n-key | you@example.com | ✅ |
| CONTENT-1335 | pages/Login.jsx | 61 | dynamic | {{form.email}} | ❌ |
| CONTENT-1336 | pages/Login.jsx | 69 | i18n-key | [i18n key: auth.password] | ✅ |
| CONTENT-1337 | pages/Login.jsx | 73 | ternary | text | ❌ |
| CONTENT-1338 | pages/Login.jsx | 73 | ternary | password | ❌ |
| CONTENT-1339 | pages/Login.jsx | 75 | i18n-key | Enter your password | ✅ |
| CONTENT-1340 | pages/Login.jsx | 95 | i18n-key | [i18n key: auth.forgotPassword] | ✅ |
| CONTENT-1341 | pages/Login.jsx | 103 | i18n-key | [i18n key: common.loading] | ✅ |
| CONTENT-1342 | pages/Login.jsx | 103 | i18n-key | [i18n key: navigation.signIn] | ✅ |
| CONTENT-1343 | pages/Login.jsx | 110 | i18n-key | [i18n key: auth.createAccount] | ✅ |
| CONTENT-1344 | pages/Login.jsx | 116 | i18n-key | [i18n key: auth.demoCredentials] | ✅ |
| CONTENT-1345 | pages/Login.jsx | 118 | jsx-text | admin@agribazaar.com | ❌ |
| CONTENT-1346 | pages/Login.jsx | 118 | jsx-text | / admin123 | ❌ |
| CONTENT-1347 | pages/Login.jsx | 119 | jsx-text | farmer@agribazaar.com | ❌ |
| CONTENT-1348 | pages/Login.jsx | 119 | jsx-text | / farmer123 | ❌ |
| CONTENT-1349 | pages/Login.jsx | 120 | jsx-text | buyer@agribazaar.com | ❌ |
| CONTENT-1408 | pages/Register.jsx | 31 | toast:error | Please fill all required fields. | ❌ |
| CONTENT-1409 | pages/Register.jsx | 34 | toast:error | Passwords do not match. | ❌ |
| CONTENT-1410 | pages/Register.jsx | 37 | toast:error | Password must be at least 6 characters. | ❌ |
| CONTENT-1411 | pages/Register.jsx | 42 | toast:success | Farmer account created successfully! | ❌ |
| CONTENT-1412 | pages/Register.jsx | 55 | toast:error | Please fill all required fields. | ❌ |
| CONTENT-1413 | pages/Register.jsx | 58 | toast:error | Passwords do not match. | ❌ |
| CONTENT-1414 | pages/Register.jsx | 61 | toast:error | Password must be at least 6 characters. | ❌ |
| CONTENT-1415 | pages/Register.jsx | 66 | toast:success | Account Created Successfully! | ❌ |
| CONTENT-1416 | pages/Register.jsx | 78 | ternary | /fpo/verification/onboarding | ❌ |
| CONTENT-1417 | pages/Register.jsx | 78 | ternary | /farmer/verification/wizard | ❌ |
| CONTENT-1418 | pages/Register.jsx | 79 | ternary | ✓ VERIFIED FPO | ❌ |
| CONTENT-1419 | pages/Register.jsx | 79 | ternary | ✓ VERIFIED FARMER | ❌ |
| CONTENT-1420 | pages/Register.jsx | 80 | ternary | Complete Your FPO Verification | ❌ |
| CONTENT-1421 | pages/Register.jsx | 80 | ternary | Complete Your Farmer Verification | ❌ |
| CONTENT-1422 | pages/Register.jsx | 132 | ternary | ✓ VERIFIED BUSINESS BUYER | ❌ |
| CONTENT-1423 | pages/Register.jsx | 132 | ternary | ✓ VERIFIED BUYER | ❌ |
| CONTENT-1424 | pages/Register.jsx | 191 | i18n-key | [i18n key: register.agri] | ✅ |
| CONTENT-1425 | pages/Register.jsx | 191 | i18n-key | [i18n key: register.bazaar] | ✅ |
| CONTENT-1426 | pages/Register.jsx | 193 | i18n-key | [i18n key: register.joinAgribazaar] | ✅ |
| CONTENT-1427 | pages/Register.jsx | 194 | i18n-key | [i18n key: register.selectYourAccountTypeToGet] | ✅ |
| CONTENT-1428 | pages/Register.jsx | 202 | i18n-key | [i18n key: register.farmerFpo] | ✅ |
| CONTENT-1429 | pages/Register.jsx | 203 | i18n-key | [i18n key: register.sellYourProduceDirectlyToBuyers] | ✅ |
| CONTENT-1430 | pages/Register.jsx | 204 | i18n-key | Register as Farmer → | ✅ |
| CONTENT-1431 | pages/Register.jsx | 211 | i18n-key | [i18n key: register.buyer] | ✅ |
| CONTENT-1432 | pages/Register.jsx | 212 | i18n-key | [i18n key: register.sourceFreshAgriculturalProduceDirectlyFrom] | ✅ |
| CONTENT-1433 | pages/Register.jsx | 213 | i18n-key | Register as Buyer → | ✅ |
| CONTENT-1434 | pages/Register.jsx | 218 | i18n-key | [i18n key: register.signIn] | ✅ |
| CONTENT-1435 | pages/Register.jsx | 231 | i18n-key | [i18n key: register.farmerRegistration] | ✅ |
| CONTENT-1436 | pages/Register.jsx | 232 | i18n-key | [i18n key: register.createYourSellerProfileToList] | ✅ |
| CONTENT-1437 | pages/Register.jsx | 238 | i18n-key | Full Name * | ✅ |
| CONTENT-1438 | pages/Register.jsx | 244 | i18n-key | Enter full name | ✅ |
| CONTENT-1439 | pages/Register.jsx | 245 | dynamic | {{farmerForm.fullName}} | ❌ |
| CONTENT-1440 | pages/Register.jsx | 254 | i18n-key | Email Address * | ✅ |
| CONTENT-1441 | pages/Register.jsx | 260 | prop:placeholder | farmer@example.com | ❌ |
| CONTENT-1442 | pages/Register.jsx | 261 | dynamic | {{farmerForm.email}} | ❌ |
| CONTENT-1443 | pages/Register.jsx | 269 | i18n-key | Mobile Number * | ✅ |
| CONTENT-1444 | pages/Register.jsx | 286 | i18n-key | Password * | ✅ |
| CONTENT-1445 | pages/Register.jsx | 290 | ternary | text | ❌ |
| CONTENT-1446 | pages/Register.jsx | 290 | ternary | password | ❌ |
| CONTENT-1447 | pages/Register.jsx | 292 | i18n-key | At least 6 chars | ✅ |
| CONTENT-1448 | pages/Register.jsx | 304 | i18n-key | Confirm Password * | ✅ |
| CONTENT-1449 | pages/Register.jsx | 308 | ternary | text | ❌ |
| CONTENT-1450 | pages/Register.jsx | 308 | ternary | password | ❌ |
| CONTENT-1451 | pages/Register.jsx | 310 | i18n-key | Re-enter password | ✅ |
| CONTENT-1452 | pages/Register.jsx | 321 | i18n-key | Farm / Organization Name * | ✅ |
| CONTENT-1453 | pages/Register.jsx | 327 | i18n-key | e.g. Krishna Organic Farm | ✅ |
| CONTENT-1454 | pages/Register.jsx | 328 | dynamic | {{farmerForm.farmName}} | ❌ |
| CONTENT-1455 | pages/Register.jsx | 336 | i18n-key | Seller Type * | ✅ |
| CONTENT-1456 | pages/Register.jsx | 338 | dynamic | {{farmerForm.farmerType}} | ❌ |
| CONTENT-1457 | pages/Register.jsx | 342 | i18n-key | [i18n key: register.individualFarmer] | ✅ |
| CONTENT-1458 | pages/Register.jsx | 343 | i18n-key | [i18n key: register.farmerProducerOrganizationFpo] | ✅ |
| CONTENT-1459 | pages/Register.jsx | 349 | i18n-key | Location (City/District, State) * | ✅ |
| CONTENT-1460 | pages/Register.jsx | 355 | i18n-key | e.g. Nashik, Maharashtra | ✅ |
| CONTENT-1461 | pages/Register.jsx | 356 | dynamic | {{farmerForm.location}} | ❌ |
| CONTENT-1462 | pages/Register.jsx | 364 | i18n-key | [i18n key: register.fullFarmAddress] | ✅ |
| CONTENT-1463 | pages/Register.jsx | 367 | i18n-key | Street, Village, Pincode | ✅ |
| CONTENT-1464 | pages/Register.jsx | 368 | dynamic | {{farmerForm.address}} | ❌ |
| CONTENT-1465 | pages/Register.jsx | 379 | i18n-key | Creating Account... | ✅ |
| CONTENT-1466 | pages/Register.jsx | 379 | i18n-key | Register as Farmer | ✅ |
| CONTENT-1467 | pages/Register.jsx | 400 | i18n-key | [i18n key: register.buyerRegistration] | ✅ |
| CONTENT-1468 | pages/Register.jsx | 401 | i18n-key | [i18n key: register.createYourAccountToPurchaseProduce] | ✅ |
| CONTENT-1469 | pages/Register.jsx | 407 | jsx-text | Full Name * | ❌ |
| CONTENT-1470 | pages/Register.jsx | 413 | prop:placeholder | Enter full name | ❌ |
| CONTENT-1471 | pages/Register.jsx | 414 | dynamic | {{buyerForm.fullName}} | ❌ |
| CONTENT-1472 | pages/Register.jsx | 423 | i18n-key | Email Address * | ✅ |
| CONTENT-1473 | pages/Register.jsx | 429 | prop:placeholder | buyer@example.com | ❌ |
| CONTENT-1474 | pages/Register.jsx | 430 | dynamic | {{buyerForm.email}} | ❌ |
| CONTENT-1475 | pages/Register.jsx | 438 | i18n-key | Mobile Number * | ✅ |
| CONTENT-1476 | pages/Register.jsx | 455 | i18n-key | Password * | ✅ |
| CONTENT-1477 | pages/Register.jsx | 461 | prop:placeholder | At least 6 chars | ❌ |
| CONTENT-1478 | pages/Register.jsx | 470 | i18n-key | Confirm Password * | ✅ |
| CONTENT-1479 | pages/Register.jsx | 476 | prop:placeholder | Re-enter password | ❌ |
| CONTENT-1480 | pages/Register.jsx | 486 | i18n-key | Buyer Type * | ✅ |
| CONTENT-1481 | pages/Register.jsx | 492 | i18n-key | [i18n key: register.individualConsumer] | ✅ |
| CONTENT-1482 | pages/Register.jsx | 493 | i18n-key | [i18n key: register.businessRetailer] | ✅ |
| CONTENT-1483 | pages/Register.jsx | 494 | i18n-key | [i18n key: register.wholesaleBulkBuyer] | ✅ |
| CONTENT-1484 | pages/Register.jsx | 499 | i18n-key | [i18n key: register.deliveryAddress] | ✅ |
| CONTENT-1485 | pages/Register.jsx | 504 | prop:placeholder | Street address | ❌ |
| CONTENT-1486 | pages/Register.jsx | 505 | dynamic | {{buyerForm.address}} | ❌ |
| CONTENT-1487 | pages/Register.jsx | 514 | prop:placeholder | City | ❌ |
| CONTENT-1488 | pages/Register.jsx | 515 | dynamic | {{buyerForm.city}} | ❌ |
| CONTENT-1489 | pages/Register.jsx | 520 | prop:placeholder | State | ❌ |
| CONTENT-1490 | pages/Register.jsx | 521 | dynamic | {{buyerForm.state}} | ❌ |
| CONTENT-1491 | pages/Register.jsx | 526 | prop:placeholder | Pincode | ❌ |
| CONTENT-1492 | pages/Register.jsx | 538 | i18n-key | Creating Account... | ✅ |
| CONTENT-1493 | pages/Register.jsx | 538 | i18n-key | Register as Buyer | ✅ |
| CONTENT-1528 | services/authService.js | 5 | i18n-key | [i18n key: /auth/login] | ✅ |
| CONTENT-1529 | services/authService.js | 10 | i18n-key | [i18n key: /auth/register/farmer] | ✅ |
| CONTENT-1530 | services/authService.js | 15 | i18n-key | [i18n key: /auth/register/buyer] | ✅ |
| CONTENT-1531 | services/authService.js | 20 | i18n-key | [i18n key: /auth/me] | ✅ |
| CONTENT-1532 | services/authService.js | 25 | i18n-key | [i18n key: /auth/forgot-password] | ✅ |

## Profile

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0772 | pages/buyer/Profile.jsx | 27 | toast:success | [i18n key: buyerProfile.profileUpdatedToast] | ✅ |
| CONTENT-0773 | pages/buyer/Profile.jsx | 28 | toast:error | Failed to update. | ❌ |
| CONTENT-0774 | pages/buyer/Profile.jsx | 37 | i18n-key | [i18n key: buyerProfile.buyerAccount] | ✅ |
| CONTENT-0775 | pages/buyer/Profile.jsx | 38 | i18n-key | [i18n key: buyerProfile.buyerProfile] | ✅ |
| CONTENT-0776 | pages/buyer/Profile.jsx | 39 | i18n-key | [i18n key: buyerProfile.manageYourPersonalDetailsAndDefault] | ✅ |
| CONTENT-0777 | pages/buyer/Profile.jsx | 66 | toast:success | [i18n key: buyerProfile.accountHashCopiedToast] | ✅ |
| CONTENT-0778 | pages/buyer/Profile.jsx | 77 | i18n-key | [i18n key: buyerProfile.fullName] | ✅ |
| CONTENT-0779 | pages/buyer/Profile.jsx | 87 | i18n-key | [i18n key: buyerProfile.emailAddress] | ✅ |
| CONTENT-0780 | pages/buyer/Profile.jsx | 91 | i18n-key | [i18n key: buyerProfile.mobileNumber] | ✅ |
| CONTENT-0781 | pages/buyer/Profile.jsx | 97 | i18n-key | [i18n key: buyerProfile.deliveryAddress] | ✅ |
| CONTENT-0782 | pages/buyer/Profile.jsx | 107 | i18n-key | [i18n key: buyerProfile.city] | ✅ |
| CONTENT-0783 | pages/buyer/Profile.jsx | 111 | i18n-key | [i18n key: buyerProfile.state] | ✅ |
| CONTENT-0784 | pages/buyer/Profile.jsx | 115 | i18n-key | [i18n key: buyerProfile.pincode] | ✅ |
| CONTENT-0785 | pages/buyer/Profile.jsx | 121 | i18n-key | [i18n key: buyerProfile.buyerAccountType] | ✅ |
| CONTENT-0944 | pages/farmer/Profile.jsx | 35 | toast:success | [i18n key: farmerProfile.updatedSuccessToast] | ✅ |
| CONTENT-0945 | pages/farmer/Profile.jsx | 37 | toast:error | [i18n key: farmerProfile.updatedFailedToast] | ✅ |
| CONTENT-0946 | pages/farmer/Profile.jsx | 47 | i18n-key | [i18n key: farmerProfile.sellerIdentity] | ✅ |
| CONTENT-0947 | pages/farmer/Profile.jsx | 48 | i18n-key | [i18n key: farmerProfile.farmerProfile] | ✅ |
| CONTENT-0948 | pages/farmer/Profile.jsx | 49 | i18n-key | [i18n key: farmerProfile.manageYourAgriculturalCredentialsFarmLocation] | ✅ |
| CONTENT-0949 | pages/farmer/Profile.jsx | 53 | i18n-key | Edit Profile | ✅ |
| CONTENT-0950 | pages/farmer/Profile.jsx | 58 | i18n-key | Cancel | ✅ |
| CONTENT-0951 | pages/farmer/Profile.jsx | 61 | i18n-key | Save Changes | ✅ |
| CONTENT-0952 | pages/farmer/Profile.jsx | 71 | i18n-key | On-Chain Cryptographic Account Hash | ✅ |
| CONTENT-0953 | pages/farmer/Profile.jsx | 76 | toast:success | [i18n key: farmerProfile.accountHashCopiedToast] | ✅ |
| CONTENT-0954 | pages/farmer/Profile.jsx | 79 | i18n-key | Copy Hash | ✅ |
| CONTENT-0955 | pages/farmer/Profile.jsx | 93 | i18n-key | Profile Avatar Photo | ✅ |
| CONTENT-0956 | pages/farmer/Profile.jsx | 94 | i18n-key | Upload avatar photo (JPG, PNG, WEBP) | ✅ |
| CONTENT-0957 | pages/farmer/Profile.jsx | 102 | i18n-key | [i18n key: farmerProfile.fullName] | ✅ |
| CONTENT-0958 | pages/farmer/Profile.jsx | 111 | i18n-key | [i18n key: farmerProfile.farmFpoName] | ✅ |
| CONTENT-0959 | pages/farmer/Profile.jsx | 121 | i18n-key | [i18n key: farmerProfile.emailAddress] | ✅ |
| CONTENT-0960 | pages/farmer/Profile.jsx | 125 | i18n-key | [i18n key: farmerProfile.mobileNumber] | ✅ |
| CONTENT-0961 | pages/farmer/Profile.jsx | 131 | i18n-key | [i18n key: farmerProfile.location] | ✅ |
| CONTENT-0962 | pages/farmer/Profile.jsx | 140 | i18n-key | [i18n key: farmerProfile.address] | ✅ |
| CONTENT-0963 | pages/farmer/Profile.jsx | 150 | i18n-key | [i18n key: farmerProfile.sellerType] | ✅ |
| CONTENT-0964 | pages/farmer/Profile.jsx | 154 | i18n-key | [i18n key: farmerProfile.verificationStatus] | ✅ |

## Settings

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-1494 | pages/Settings.jsx | 15 | toast:success | [i18n key: settings.saved] | ✅ |
| CONTENT-1495 | pages/Settings.jsx | 21 | i18n-key | [i18n key: settings.preferences] | ✅ |
| CONTENT-1496 | pages/Settings.jsx | 22 | i18n-key | [i18n key: settings.title] | ✅ |
| CONTENT-1497 | pages/Settings.jsx | 23 | i18n-key | [i18n key: settings.description] | ✅ |
| CONTENT-1498 | pages/Settings.jsx | 35 | i18n-key | [i18n key: settings.notificationPreferences] | ✅ |
| CONTENT-1499 | pages/Settings.jsx | 36 | i18n-key | [i18n key: settings.notificationDescription] | ✅ |
| CONTENT-1500 | pages/Settings.jsx | 43 | i18n-key | [i18n key: settings.emailOrders] | ✅ |
| CONTENT-1501 | pages/Settings.jsx | 44 | i18n-key | [i18n key: settings.emailOrdersDescription] | ✅ |
| CONTENT-1502 | pages/Settings.jsx | 56 | i18n-key | [i18n key: settings.sms] | ✅ |
| CONTENT-1503 | pages/Settings.jsx | 57 | i18n-key | [i18n key: settings.smsDescription] | ✅ |
| CONTENT-1504 | pages/Settings.jsx | 69 | i18n-key | [i18n key: settings.priceAlerts] | ✅ |
| CONTENT-1505 | pages/Settings.jsx | 70 | i18n-key | [i18n key: settings.priceAlertsDescription] | ✅ |
| CONTENT-1506 | pages/Settings.jsx | 89 | i18n-key | [i18n key: settings.security] | ✅ |
| CONTENT-1507 | pages/Settings.jsx | 90 | i18n-key | [i18n key: settings.securityDescription] | ✅ |
| CONTENT-1508 | pages/Settings.jsx | 97 | i18n-key | [i18n key: settings.twoFactor] | ✅ |
| CONTENT-1509 | pages/Settings.jsx | 98 | i18n-key | [i18n key: settings.twoFactorDescription] | ✅ |
| CONTENT-1510 | pages/Settings.jsx | 114 | i18n-key | [i18n key: settings.save] | ✅ |
| CONTENT-1511 | pages/Settings.jsx | 121 | i18n-key | [i18n key: settings.platform] | ✅ |
| CONTENT-1512 | pages/Settings.jsx | 122 | i18n-key | [i18n key: settings.help] | ✅ |
| CONTENT-1513 | pages/Settings.jsx | 124 | i18n-key | [i18n key: settings.helpDescription] | ✅ |
| CONTENT-1514 | pages/Settings.jsx | 128 | i18n-key | [i18n key: settings.systemVersionV104production] | ✅ |
| CONTENT-1515 | pages/Settings.jsx | 129 | i18n-key | [i18n key: settings.architecture] | ✅ |

## Forms

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0071 | components/common/SecureFileUpload.jsx | 44 | ternary | .jpg,.jpeg,.png,.webp | ❌ |
| CONTENT-0072 | components/common/SecureFileUpload.jsx | 44 | ternary | .pdf,.jpg,.jpeg,.png,.webp | ❌ |
| CONTENT-0073 | components/common/SecureFileUpload.jsx | 49 | i18n-key | [i18n key: upload.imageHint] | ✅ |
| CONTENT-0074 | components/common/SecureFileUpload.jsx | 50 | i18n-key | [i18n key: upload.documentHint] | ✅ |
| CONTENT-0075 | components/common/SecureFileUpload.jsx | 65 | i18n-key | [i18n key: upload.uploadedDocument] | ✅ |
| CONTENT-0076 | components/common/SecureFileUpload.jsx | 91 | i18n-key | [i18n key: upload.fileTooLarge] | ✅ |
| CONTENT-0077 | components/common/SecureFileUpload.jsx | 99 | i18n-key | [i18n key: ,] | ✅ |
| CONTENT-0078 | components/common/SecureFileUpload.jsx | 101 | i18n-key | [i18n key: .] | ✅ |
| CONTENT-0079 | components/common/SecureFileUpload.jsx | 104 | i18n-key | [i18n key: upload.unsupportedType] | ✅ |
| CONTENT-0080 | components/common/SecureFileUpload.jsx | 113 | i18n-key | [i18n key: upload.pdfNotAllowed] | ✅ |
| CONTENT-0081 | components/common/SecureFileUpload.jsx | 150 | toast:success | [i18n key: messages.fileUploaded] | ✅ |
| CONTENT-0082 | components/common/SecureFileUpload.jsx | 191 | toast:success | [i18n key: messages.fileRemoved] | ✅ |
| CONTENT-0083 | components/common/SecureFileUpload.jsx | 195 | toast:error | [i18n key: messages.deleteFailed] | ✅ |
| CONTENT-0084 | components/common/SecureFileUpload.jsx | 210 | i18n-key | [i18n key: upload.document] | ✅ |
| CONTENT-0085 | components/common/SecureFileUpload.jsx | 213 | i18n-key | [i18n key: upload.cloudinaryProtected] | ✅ |
| CONTENT-0086 | components/common/SecureFileUpload.jsx | 229 | i18n-key | [i18n key: upload.uploadedAsset] | ✅ |
| CONTENT-0087 | components/common/SecureFileUpload.jsx | 233 | i18n-key | [i18n key: upload.uploaded] | ✅ |
| CONTENT-0088 | components/common/SecureFileUpload.jsx | 259 | i18n-key | [i18n key: common.view] | ✅ |
| CONTENT-0089 | components/common/SecureFileUpload.jsx | 268 | i18n-key | [i18n key: upload.replace] | ✅ |
| CONTENT-0090 | components/common/SecureFileUpload.jsx | 274 | i18n-key | [i18n key: upload.removeFile] | ✅ |
| CONTENT-0091 | components/common/SecureFileUpload.jsx | 299 | i18n-key | [i18n key: upload.uploading] | ✅ |
| CONTENT-0092 | components/common/SecureFileUpload.jsx | 308 | i18n-key | [i18n key: upload.progress] | ✅ |
| CONTENT-0093 | components/common/SecureFileUpload.jsx | 318 | i18n-key | [i18n key: upload.chooseFile] | ✅ |
| CONTENT-0094 | components/common/SecureFileUpload.jsx | 320 | i18n-key | [i18n key: upload.orDragDrop] | ✅ |

## Other

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0030 | components/common/LanguageSelector.jsx | 6 | object-label | English | ✅ |
| CONTENT-0031 | components/common/LanguageSelector.jsx | 7 | object-label | தமிழ் | ✅ |
| CONTENT-0032 | components/common/LanguageSelector.jsx | 8 | object-label | हिन्दी | ✅ |
| CONTENT-0033 | components/common/LanguageSelector.jsx | 9 | object-label | తెలుగు | ✅ |
| CONTENT-0034 | components/common/LanguageSelector.jsx | 10 | object-label | ಕನ್ನಡ | ✅ |
| CONTENT-0035 | components/common/LanguageSelector.jsx | 11 | object-label | മലയാളം | ❌ |
| CONTENT-0036 | components/common/LanguageSelector.jsx | 23 | i18n-key | [i18n key: navigation.language] | ✅ |
| CONTENT-0037 | components/common/LanguageSelector.jsx | 24 | i18n-key | [i18n key: navigation.language] | ✅ |
| CONTENT-0099 | components/common/ThemeToggle.jsx | 9 | prop:label | Toggle color theme | ✅ |
| CONTENT-0100 | components/common/ThemeToggle.jsx | 9 | i18n-key | [i18n key: common.toggleColorTheme] | ✅ |
| CONTENT-0185 | pages/About.jsx | 11 | i18n-key | [i18n key: about.ourPurpose] | ✅ |
| CONTENT-0186 | pages/About.jsx | 12 | i18n-key | [i18n key: about.aboutAgribazaar] | ✅ |
| CONTENT-0187 | pages/About.jsx | 20 | i18n-key | [i18n key: about.corePillar] | ✅ |
| CONTENT-0188 | pages/About.jsx | 21 | i18n-key | [i18n key: about.ourMission] | ✅ |
| CONTENT-0189 | pages/About.jsx | 28 | i18n-key | [i18n key: about.futureready] | ✅ |
| CONTENT-0190 | pages/About.jsx | 29 | i18n-key | [i18n key: about.ourVision] | ✅ |
| CONTENT-0191 | pages/About.jsx | 38 | object-label | Farm Fresh | ❌ |
| CONTENT-0192 | pages/About.jsx | 39 | object-label | Community | ❌ |
| CONTENT-0193 | pages/About.jsx | 40 | object-label | Trust | ❌ |
| CONTENT-0194 | pages/About.jsx | 41 | object-label | Pan-India | ❌ |
| CONTENT-0195 | pages/About.jsx | 47 | dynamic | {{item.title}} | ❌ |
| CONTENT-0474 | pages/buyer/BuyerVerificationWizard.jsx | 202 | toast:error | [i18n key: buyerVerificationWizard.couldNotLoadVerificationStatus] | ✅ |
| CONTENT-0475 | pages/buyer/BuyerVerificationWizard.jsx | 213 | i18n-key | [i18n key: buyerVerificationWizard.verified] | ✅ |
| CONTENT-0476 | pages/buyer/BuyerVerificationWizard.jsx | 213 | i18n-key | [i18n key: buyerVerificationWizard.pending] | ✅ |
| CONTENT-0477 | pages/buyer/BuyerVerificationWizard.jsx | 216 | i18n-key | [i18n key: buyerVerificationWizard.verified] | ✅ |
| CONTENT-0478 | pages/buyer/BuyerVerificationWizard.jsx | 220 | i18n-key | [i18n key: buyerVerificationWizard.pending] | ✅ |
| CONTENT-0479 | pages/buyer/BuyerVerificationWizard.jsx | 227 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterAValid10digitMobile] | ✅ |
| CONTENT-0480 | pages/buyer/BuyerVerificationWizard.jsx | 235 | toast:success | [i18n key: buyerVerificationWizard.otpSentToYourMobileNumber] | ✅ |
| CONTENT-0481 | pages/buyer/BuyerVerificationWizard.jsx | 244 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnter6digitOtpCode] | ✅ |
| CONTENT-0482 | pages/buyer/BuyerVerificationWizard.jsx | 252 | toast:success | [i18n key: buyerVerificationWizard.mobileNumberVerifiedSuccessfully] | ✅ |
| CONTENT-0483 | pages/buyer/BuyerVerificationWizard.jsx | 265 | toast:error | [i18n key: buyerVerificationWizard.consentIsRequiredToProceedWith] | ✅ |
| CONTENT-0484 | pages/buyer/BuyerVerificationWizard.jsx | 273 | toast:success | [i18n key: buyerVerificationWizard.otpSentToYourAadhaarlinkedMobile] | ✅ |
| CONTENT-0485 | pages/buyer/BuyerVerificationWizard.jsx | 277 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnter6digitOtp] | ✅ |
| CONTENT-0486 | pages/buyer/BuyerVerificationWizard.jsx | 289 | toast:success | [i18n key: buyerVerificationWizard.identityVerifiedViaAuthorizedGateway] | ✅ |
| CONTENT-0487 | pages/buyer/BuyerVerificationWizard.jsx | 302 | toast:error | [i18n key: buyerVerificationWizard.pleaseFillAllRequiredAddressFields] | ✅ |
| CONTENT-0488 | pages/buyer/BuyerVerificationWizard.jsx | 310 | toast:success | [i18n key: buyerVerificationWizard.addressDetailsVerified] | ✅ |
| CONTENT-0489 | pages/buyer/BuyerVerificationWizard.jsx | 322 | toast:error | [i18n key: buyerVerificationWizard.pleaseFillAllRequiredBusinessIdentity] | ✅ |
| CONTENT-0490 | pages/buyer/BuyerVerificationWizard.jsx | 330 | toast:success | [i18n key: buyerVerificationWizard.businessIdentityVerified] | ✅ |
| CONTENT-0491 | pages/buyer/BuyerVerificationWizard.jsx | 343 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterAValid10characterPan] | ✅ |
| CONTENT-0492 | pages/buyer/BuyerVerificationWizard.jsx | 351 | toast:success | [i18n key: buyerVerificationWizard.businessPanVerifiedSuccessfully] | ✅ |
| CONTENT-0493 | pages/buyer/BuyerVerificationWizard.jsx | 368 | toast:success | [i18n key: buyerVerificationWizard.gstinMarkedAsNotApplicable] | ✅ |
| CONTENT-0494 | pages/buyer/BuyerVerificationWizard.jsx | 372 | toast:error | [i18n key: buyerVerificationWizard.failedToUpdateGstinStatus] | ✅ |
| CONTENT-0495 | pages/buyer/BuyerVerificationWizard.jsx | 380 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterAValid15characterGstin] | ✅ |
| CONTENT-0496 | pages/buyer/BuyerVerificationWizard.jsx | 388 | toast:success | [i18n key: buyerVerificationWizard.gstinVerifiedSuccessfully] | ✅ |
| CONTENT-0497 | pages/buyer/BuyerVerificationWizard.jsx | 400 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterRegistrationNumberIdentifier] | ✅ |
| CONTENT-0498 | pages/buyer/BuyerVerificationWizard.jsx | 409 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterRepresentativeNameAndDesignation] | ✅ |
| CONTENT-0499 | pages/buyer/BuyerVerificationWizard.jsx | 414 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterValidMobileNumber] | ✅ |
| CONTENT-0500 | pages/buyer/BuyerVerificationWizard.jsx | 422 | toast:success | [i18n key: buyerVerificationWizard.otpSentToRepresentativeMobile] | ✅ |
| CONTENT-0501 | pages/buyer/BuyerVerificationWizard.jsx | 425 | toast:error | [i18n key: buyerVerificationWizard.failedToSendOtp] | ✅ |
| CONTENT-0502 | pages/buyer/BuyerVerificationWizard.jsx | 431 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnter6digitOtp] | ✅ |
| CONTENT-0503 | pages/buyer/BuyerVerificationWizard.jsx | 445 | toast:success | [i18n key: buyerVerificationWizard.authorizedRepresentativeVerified] | ✅ |
| CONTENT-0504 | pages/buyer/BuyerVerificationWizard.jsx | 458 | toast:error | [i18n key: buyerVerificationWizard.pleaseFillAllRequiredBankAccount] | ✅ |
| CONTENT-0505 | pages/buyer/BuyerVerificationWizard.jsx | 462 | toast:error | [i18n key: buyerVerificationWizard.accountNumbersDoNotMatch] | ✅ |
| CONTENT-0506 | pages/buyer/BuyerVerificationWizard.jsx | 470 | toast:success | [i18n key: buyerVerificationWizard.bankAccountVerifiedSuccessfully] | ✅ |
| CONTENT-0507 | pages/buyer/BuyerVerificationWizard.jsx | 487 | toast:success | [i18n key: buyerVerificationWizard.udyamRegistrationMarkedAsNotApplicable] | ✅ |
| CONTENT-0508 | pages/buyer/BuyerVerificationWizard.jsx | 491 | toast:error | [i18n key: buyerVerificationWizard.failedToUpdateUdyamStatus] | ✅ |
| CONTENT-0509 | pages/buyer/BuyerVerificationWizard.jsx | 499 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterValidUdyamRegistrationNumber] | ✅ |
| CONTENT-0510 | pages/buyer/BuyerVerificationWizard.jsx | 507 | toast:success | [i18n key: buyerVerificationWizard.udyamRegistrationVerified] | ✅ |
| CONTENT-0511 | pages/buyer/BuyerVerificationWizard.jsx | 524 | toast:success | [i18n key: buyerVerificationWizard.fssaiLicenseMarkedAsNotApplicable] | ✅ |
| CONTENT-0512 | pages/buyer/BuyerVerificationWizard.jsx | 528 | toast:error | [i18n key: buyerVerificationWizard.failedToUpdateLicenseStatus] | ✅ |
| CONTENT-0513 | pages/buyer/BuyerVerificationWizard.jsx | 536 | toast:error | [i18n key: buyerVerificationWizard.pleaseEnterValidFssaiLicenseRegistration] | ✅ |
| CONTENT-0514 | pages/buyer/BuyerVerificationWizard.jsx | 544 | toast:success | [i18n key: buyerVerificationWizard.fssaiLicenseVerified] | ✅ |
| CONTENT-0515 | pages/buyer/BuyerVerificationWizard.jsx | 560 | toast:success | [i18n key: buyerVerificationWizard.documentsRecordedAndVerified] | ✅ |
| CONTENT-0516 | pages/buyer/BuyerVerificationWizard.jsx | 573 | toast:error | [i18n key: buyerVerificationWizard.thisStepIsRequiredAndCannot] | ✅ |
| CONTENT-0517 | pages/buyer/BuyerVerificationWizard.jsx | 581 | toast:success | Step  | ❌ |
| CONTENT-0518 | pages/buyer/BuyerVerificationWizard.jsx | 581 | dynamic | {{activeStepObj.name}} | ❌ |
| CONTENT-0519 | pages/buyer/BuyerVerificationWizard.jsx | 585 | toast:error | [i18n key: buyerVerificationWizard.failedToSkipStep] | ✅ |
| CONTENT-0520 | pages/buyer/BuyerVerificationWizard.jsx | 600 | toast:success | [i18n key: buyerVerificationWizard.verificationDetailsSaved] | ✅ |
| CONTENT-0521 | pages/buyer/BuyerVerificationWizard.jsx | 605 | toast:error | [i18n key: buyerVerificationWizard.couldNotCompleteVerification] | ✅ |
| CONTENT-0522 | pages/buyer/BuyerVerificationWizard.jsx | 624 | i18n-key | [i18n key: buyerVerificationWizard.loadingOfficialVerificationPortal] | ✅ |
| CONTENT-0523 | pages/buyer/BuyerVerificationWizard.jsx | 650 | i18n-key | [i18n key: buyerVerificationWizard.officialIdentityComplianceGateway] | ✅ |
| CONTENT-0524 | pages/buyer/BuyerVerificationWizard.jsx | 681 | i18n-key | [i18n key: buyerVerificationWizard.saveExitToDashboard] | ✅ |
| CONTENT-0525 | pages/buyer/BuyerVerificationWizard.jsx | 753 | i18n-key | [i18n key: buyerVerificationWizard.textslate900] | ✅ |
| CONTENT-0526 | pages/buyer/BuyerVerificationWizard.jsx | 753 | i18n-key | [i18n key: buyerVerificationWizard.textslate700] | ✅ |
| CONTENT-0527 | pages/buyer/BuyerVerificationWizard.jsx | 754 | dynamic | {{st.name}} | ❌ |
| CONTENT-0528 | pages/buyer/BuyerVerificationWizard.jsx | 757 | i18n-key | [i18n key: buyerVerificationWizard.required] | ✅ |
| CONTENT-0529 | pages/buyer/BuyerVerificationWizard.jsx | 757 | i18n-key | [i18n key: buyerVerificationWizard.optional] | ✅ |
| CONTENT-0530 | pages/buyer/BuyerVerificationWizard.jsx | 775 | i18n-key | [i18n key: buyerVerificationWizard.stepCurrentstepOfStepslength] | ✅ |
| CONTENT-0531 | pages/buyer/BuyerVerificationWizard.jsx | 777 | i18n-key | [i18n key: buyerVerificationWizard.mandatoryVerification] | ✅ |
| CONTENT-0532 | pages/buyer/BuyerVerificationWizard.jsx | 777 | i18n-key | [i18n key: buyerVerificationWizard.optionalCheck] | ✅ |
| CONTENT-0533 | pages/buyer/BuyerVerificationWizard.jsx | 781 | dynamic | {{activeStepObj.name}} | ❌ |
| CONTENT-0534 | pages/buyer/BuyerVerificationWizard.jsx | 784 | dynamic | {{activeStepObj.description}} | ❌ |
| CONTENT-0535 | pages/buyer/BuyerVerificationWizard.jsx | 794 | i18n-key | [i18n key: buyerVerificationWizard.mobileAuthenticationProtocol] | ✅ |
| CONTENT-0536 | pages/buyer/BuyerVerificationWizard.jsx | 795 | i18n-key | [i18n key: buyerVerificationWizard.enterYour10digitMobileNumberTo] | ✅ |
| CONTENT-0537 | pages/buyer/BuyerVerificationWizard.jsx | 808 | i18n-key | [i18n key: buyerVerificationWizard.enter10digitMobileNumber] | ✅ |
| CONTENT-0538 | pages/buyer/BuyerVerificationWizard.jsx | 823 | i18n-key | [i18n key: buyerVerificationWizard.enter6digitOtp] | ✅ |
| CONTENT-0539 | pages/buyer/BuyerVerificationWizard.jsx | 826 | i18n-key | [i18n key: buyerVerificationWizard.otpSentTo91xxxxxmobileformmobilenumberslice4] | ✅ |
| CONTENT-0540 | pages/buyer/BuyerVerificationWizard.jsx | 837 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0541 | pages/buyer/BuyerVerificationWizard.jsx | 846 | i18n-key | [i18n key: buyerVerificationWizard.verifyOtpContinue] | ✅ |
| CONTENT-0542 | pages/buyer/BuyerVerificationWizard.jsx | 846 | i18n-key | [i18n key: buyerVerificationWizard.getMobileOtp] | ✅ |
| CONTENT-0543 | pages/buyer/BuyerVerificationWizard.jsx | 857 | i18n-key | [i18n key: buyerVerificationWizard.authorizedIdentityVerification] | ✅ |
| CONTENT-0544 | pages/buyer/BuyerVerificationWizard.jsx | 858 | i18n-key | [i18n key: buyerVerificationWizard.identityIsValidatedSecurelyViaAuthorized] | ✅ |
| CONTENT-0545 | pages/buyer/BuyerVerificationWizard.jsx | 870 | i18n-key | [i18n key: buyerVerificationWizard.aadhaarbasedAuthorizedVerification] | ✅ |
| CONTENT-0546 | pages/buyer/BuyerVerificationWizard.jsx | 871 | i18n-key | [i18n key: buyerVerificationWizard.panbasedIdentityVerification] | ✅ |
| CONTENT-0547 | pages/buyer/BuyerVerificationWizard.jsx | 872 | i18n-key | [i18n key: buyerVerificationWizard.voterIdNationalPortalVerification] | ✅ |
| CONTENT-0548 | pages/buyer/BuyerVerificationWizard.jsx | 900 | i18n-key | [i18n key: buyerVerificationWizard.enter6digitOtp] | ✅ |
| CONTENT-0549 | pages/buyer/BuyerVerificationWizard.jsx | 912 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0550 | pages/buyer/BuyerVerificationWizard.jsx | 921 | i18n-key | [i18n key: buyerVerificationWizard.verifyIdentityContinue] | ✅ |
| CONTENT-0551 | pages/buyer/BuyerVerificationWizard.jsx | 921 | i18n-key | [i18n key: buyerVerificationWizard.sendIdentityOtp] | ✅ |
| CONTENT-0552 | pages/buyer/BuyerVerificationWizard.jsx | 938 | dynamic | {{addressForm.address}} | ❌ |
| CONTENT-0553 | pages/buyer/BuyerVerificationWizard.jsx | 940 | i18n-key | [i18n key: buyerVerificationWizard.flatHouseNoBuildingStreetArea] | ✅ |
| CONTENT-0554 | pages/buyer/BuyerVerificationWizard.jsx | 950 | dynamic | {{addressForm.state}} | ❌ |
| CONTENT-0555 | pages/buyer/BuyerVerificationWizard.jsx | 966 | dynamic | {{addressForm.district}} | ❌ |
| CONTENT-0556 | pages/buyer/BuyerVerificationWizard.jsx | 968 | i18n-key | [i18n key: buyerVerificationWizard.districtName] | ✅ |
| CONTENT-0557 | pages/buyer/BuyerVerificationWizard.jsx | 979 | dynamic | {{addressForm.city}} | ❌ |
| CONTENT-0558 | pages/buyer/BuyerVerificationWizard.jsx | 981 | i18n-key | [i18n key: buyerVerificationWizard.cityOrTown] | ✅ |
| CONTENT-0559 | pages/buyer/BuyerVerificationWizard.jsx | 995 | i18n-key | [i18n key: buyerVerificationWizard.6digitPinCode] | ✅ |
| CONTENT-0560 | pages/buyer/BuyerVerificationWizard.jsx | 1007 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0561 | pages/buyer/BuyerVerificationWizard.jsx | 1016 | i18n-key | [i18n key: buyerVerificationWizard.verifyAddressContinue] | ✅ |
| CONTENT-0562 | pages/buyer/BuyerVerificationWizard.jsx | 1035 | i18n-key | [i18n key: buyerVerificationWizard.asRegisteredInMcaGstPan] | ✅ |
| CONTENT-0563 | pages/buyer/BuyerVerificationWizard.jsx | 1048 | i18n-key | [i18n key: buyerVerificationWizard.brandOrTradeNameOptional] | ✅ |
| CONTENT-0564 | pages/buyer/BuyerVerificationWizard.jsx | 1062 | i18n-key | [i18n key: buyerVerificationWizard.retailerAgribusinessDealer] | ✅ |
| CONTENT-0565 | pages/buyer/BuyerVerificationWizard.jsx | 1063 | i18n-key | [i18n key: buyerVerificationWizard.wholesalerTrader] | ✅ |
| CONTENT-0566 | pages/buyer/BuyerVerificationWizard.jsx | 1064 | i18n-key | [i18n key: buyerVerificationWizard.foodProcessorMill] | ✅ |
| CONTENT-0567 | pages/buyer/BuyerVerificationWizard.jsx | 1065 | i18n-key | [i18n key: buyerVerificationWizard.exporterInstitutionalBuyer] | ✅ |
| CONTENT-0568 | pages/buyer/BuyerVerificationWizard.jsx | 1066 | i18n-key | [i18n key: buyerVerificationWizard.proprietorshipFirm] | ✅ |
| CONTENT-0569 | pages/buyer/BuyerVerificationWizard.jsx | 1067 | i18n-key | [i18n key: buyerVerificationWizard.partnershipFirm] | ✅ |
| CONTENT-0570 | pages/buyer/BuyerVerificationWizard.jsx | 1068 | i18n-key | [i18n key: buyerVerificationWizard.privateLimitedCompany] | ✅ |
| CONTENT-0571 | pages/buyer/BuyerVerificationWizard.jsx | 1077 | dynamic | {{businessForm.state}} | ❌ |
| CONTENT-0572 | pages/buyer/BuyerVerificationWizard.jsx | 1093 | dynamic | {{businessForm.address}} | ❌ |
| CONTENT-0573 | pages/buyer/BuyerVerificationWizard.jsx | 1095 | i18n-key | [i18n key: buyerVerificationWizard.registeredOfficeTradePremisesAddress] | ✅ |
| CONTENT-0574 | pages/buyer/BuyerVerificationWizard.jsx | 1106 | dynamic | {{businessForm.district}} | ❌ |
| CONTENT-0575 | pages/buyer/BuyerVerificationWizard.jsx | 1108 | i18n-key | [i18n key: buyerVerificationWizard.district] | ✅ |
| CONTENT-0576 | pages/buyer/BuyerVerificationWizard.jsx | 1119 | dynamic | {{businessForm.city}} | ❌ |
| CONTENT-0577 | pages/buyer/BuyerVerificationWizard.jsx | 1121 | i18n-key | [i18n key: buyerVerificationWizard.cityOrTown] | ✅ |
| CONTENT-0578 | pages/buyer/BuyerVerificationWizard.jsx | 1135 | i18n-key | [i18n key: buyerVerificationWizard.6digitPincode] | ✅ |
| CONTENT-0579 | pages/buyer/BuyerVerificationWizard.jsx | 1147 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0580 | pages/buyer/BuyerVerificationWizard.jsx | 1156 | i18n-key | [i18n key: buyerVerificationWizard.verifyBusinessIdentity] | ✅ |
| CONTENT-0581 | pages/buyer/BuyerVerificationWizard.jsx | 1167 | i18n-key | [i18n key: buyerVerificationWizard.incomeTaxDepartmentPanVerification] | ✅ |
| CONTENT-0582 | pages/buyer/BuyerVerificationWizard.jsx | 1168 | i18n-key | [i18n key: buyerVerificationWizard.enterThe10characterPermanentAccountNumber] | ✅ |
| CONTENT-0583 | pages/buyer/BuyerVerificationWizard.jsx | 1181 | i18n-key | [i18n key: buyerVerificationWizard.egAbcde1234f] | ✅ |
| CONTENT-0584 | pages/buyer/BuyerVerificationWizard.jsx | 1194 | i18n-key | [i18n key: buyerVerificationWizard.legalEntityName] | ✅ |
| CONTENT-0585 | pages/buyer/BuyerVerificationWizard.jsx | 1206 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0586 | pages/buyer/BuyerVerificationWizard.jsx | 1215 | i18n-key | [i18n key: buyerVerificationWizard.verifyBusinessPan] | ✅ |
| CONTENT-0587 | pages/buyer/BuyerVerificationWizard.jsx | 1226 | i18n-key | [i18n key: buyerVerificationWizard.goodsAndServicesTaxIdentificationGstin] | ✅ |
| CONTENT-0588 | pages/buyer/BuyerVerificationWizard.jsx | 1227 | i18n-key | [i18n key: buyerVerificationWizard.gstinVerificationIsConditionalSmallTraders] | ✅ |
| CONTENT-0589 | pages/buyer/BuyerVerificationWizard.jsx | 1239 | i18n-key | [i18n key: buyerVerificationWizard.eg27aaaaa0000a1z5] | ✅ |
| CONTENT-0590 | pages/buyer/BuyerVerificationWizard.jsx | 1250 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0591 | pages/buyer/BuyerVerificationWizard.jsx | 1259 | i18n-key | [i18n key: buyerVerificationWizard.gstinNotApplicable] | ✅ |
| CONTENT-0592 | pages/buyer/BuyerVerificationWizard.jsx | 1268 | i18n-key | [i18n key: buyerVerificationWizard.verifyGstinContinue] | ✅ |
| CONTENT-0593 | pages/buyer/BuyerVerificationWizard.jsx | 1289 | i18n-key | [i18n key: buyerVerificationWizard.privatePublicLimitedCompanyCin] | ✅ |
| CONTENT-0594 | pages/buyer/BuyerVerificationWizard.jsx | 1290 | i18n-key | [i18n key: buyerVerificationWizard.limitedLiabilityPartnershipLlpin] | ✅ |
| CONTENT-0595 | pages/buyer/BuyerVerificationWizard.jsx | 1291 | i18n-key | [i18n key: buyerVerificationWizard.registeredPartnershipFirm] | ✅ |
| CONTENT-0596 | pages/buyer/BuyerVerificationWizard.jsx | 1292 | i18n-key | [i18n key: buyerVerificationWizard.registeredSoleProprietorship] | ✅ |
| CONTENT-0597 | pages/buyer/BuyerVerificationWizard.jsx | 1293 | i18n-key | [i18n key: buyerVerificationWizard.cooperativeSocietyFarmerFederation] | ✅ |
| CONTENT-0598 | pages/buyer/BuyerVerificationWizard.jsx | 1305 | i18n-key | [i18n key: buyerVerificationWizard.egU01100mh2020ptc123456] | ✅ |
| CONTENT-0599 | pages/buyer/BuyerVerificationWizard.jsx | 1317 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0600 | pages/buyer/BuyerVerificationWizard.jsx | 1324 | i18n-key | [i18n key: buyerVerificationWizard.verifyRegistration] | ✅ |
| CONTENT-0601 | pages/buyer/BuyerVerificationWizard.jsx | 1343 | i18n-key | [i18n key: buyerVerificationWizard.fullName] | ✅ |
| CONTENT-0602 | pages/buyer/BuyerVerificationWizard.jsx | 1357 | i18n-key | [i18n key: buyerVerificationWizard.ownerProprietor] | ✅ |
| CONTENT-0603 | pages/buyer/BuyerVerificationWizard.jsx | 1358 | i18n-key | [i18n key: buyerVerificationWizard.partner] | ✅ |
| CONTENT-0604 | pages/buyer/BuyerVerificationWizard.jsx | 1359 | i18n-key | [i18n key: buyerVerificationWizard.director] | ✅ |
| CONTENT-0605 | pages/buyer/BuyerVerificationWizard.jsx | 1360 | i18n-key | [i18n key: buyerVerificationWizard.ceoManagingDirector] | ✅ |
| CONTENT-0606 | pages/buyer/BuyerVerificationWizard.jsx | 1361 | i18n-key | [i18n key: buyerVerificationWizard.managerProcurementOfficer] | ✅ |
| CONTENT-0607 | pages/buyer/BuyerVerificationWizard.jsx | 1362 | i18n-key | [i18n key: buyerVerificationWizard.authorizedSignatory] | ✅ |
| CONTENT-0608 | pages/buyer/BuyerVerificationWizard.jsx | 1376 | i18n-key | [i18n key: buyerVerificationWizard.10digitMobile] | ✅ |
| CONTENT-0609 | pages/buyer/BuyerVerificationWizard.jsx | 1391 | i18n-key | [i18n key: buyerVerificationWizard.6digitOtp] | ✅ |
| CONTENT-0610 | pages/buyer/BuyerVerificationWizard.jsx | 1406 | i18n-key | [i18n key: buyerVerificationWizard.iConfirmIPossessOfficialBoard] | ✅ |
| CONTENT-0611 | pages/buyer/BuyerVerificationWizard.jsx | 1416 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0612 | pages/buyer/BuyerVerificationWizard.jsx | 1425 | i18n-key | [i18n key: buyerVerificationWizard.verifyRepresentativeOtp] | ✅ |
| CONTENT-0613 | pages/buyer/BuyerVerificationWizard.jsx | 1425 | i18n-key | [i18n key: buyerVerificationWizard.sendRepresentativeOtp] | ✅ |
| CONTENT-0614 | pages/buyer/BuyerVerificationWizard.jsx | 1444 | i18n-key | [i18n key: buyerVerificationWizard.nameAsPerBankPassbook] | ✅ |
| CONTENT-0615 | pages/buyer/BuyerVerificationWizard.jsx | 1472 | i18n-key | [i18n key: buyerVerificationWizard.branchName] | ✅ |
| CONTENT-0616 | pages/buyer/BuyerVerificationWizard.jsx | 1486 | i18n-key | [i18n key: buyerVerificationWizard.egSbin0001234] | ✅ |
| CONTENT-0617 | pages/buyer/BuyerVerificationWizard.jsx | 1499 | i18n-key | [i18n key: buyerVerificationWizard.accountNumber] | ✅ |
| CONTENT-0618 | pages/buyer/BuyerVerificationWizard.jsx | 1512 | i18n-key | [i18n key: buyerVerificationWizard.reenterAccountNumber] | ✅ |
| CONTENT-0619 | pages/buyer/BuyerVerificationWizard.jsx | 1524 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0620 | pages/buyer/BuyerVerificationWizard.jsx | 1533 | i18n-key | [i18n key: buyerVerificationWizard.verifyBankAccount] | ✅ |
| CONTENT-0621 | pages/buyer/BuyerVerificationWizard.jsx | 1544 | i18n-key | [i18n key: buyerVerificationWizard.udyamMsmeRegistration] | ✅ |
| CONTENT-0622 | pages/buyer/BuyerVerificationWizard.jsx | 1545 | i18n-key | [i18n key: buyerVerificationWizard.conditionalCheckEnterYourUdyamRegistration] | ✅ |
| CONTENT-0623 | pages/buyer/BuyerVerificationWizard.jsx | 1556 | i18n-key | [i18n key: buyerVerificationWizard.egUdyammh000000000] | ✅ |
| CONTENT-0624 | pages/buyer/BuyerVerificationWizard.jsx | 1567 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0625 | pages/buyer/BuyerVerificationWizard.jsx | 1576 | i18n-key | [i18n key: buyerVerificationWizard.udyamNotApplicable] | ✅ |
| CONTENT-0626 | pages/buyer/BuyerVerificationWizard.jsx | 1585 | i18n-key | [i18n key: buyerVerificationWizard.verifyUdyamContinue] | ✅ |
| CONTENT-0627 | pages/buyer/BuyerVerificationWizard.jsx | 1597 | i18n-key | [i18n key: buyerVerificationWizard.fssaiCommodityTradeLicense] | ✅ |
| CONTENT-0628 | pages/buyer/BuyerVerificationWizard.jsx | 1598 | i18n-key | [i18n key: buyerVerificationWizard.showThisOnlyWhereBuyerActivity] | ✅ |
| CONTENT-0629 | pages/buyer/BuyerVerificationWizard.jsx | 1611 | i18n-key | [i18n key: buyerVerificationWizard.fssaiRegistrationLicense] | ✅ |
| CONTENT-0630 | pages/buyer/BuyerVerificationWizard.jsx | 1612 | i18n-key | [i18n key: buyerVerificationWizard.apmcMandiTradeLicense] | ✅ |
| CONTENT-0631 | pages/buyer/BuyerVerificationWizard.jsx | 1613 | i18n-key | [i18n key: buyerVerificationWizard.agriculturalCommodityTradeLicense] | ✅ |
| CONTENT-0632 | pages/buyer/BuyerVerificationWizard.jsx | 1625 | i18n-key | [i18n key: buyerVerificationWizard.eg10020021000123] | ✅ |
| CONTENT-0633 | pages/buyer/BuyerVerificationWizard.jsx | 1637 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0634 | pages/buyer/BuyerVerificationWizard.jsx | 1646 | i18n-key | [i18n key: buyerVerificationWizard.licenseNotApplicable] | ✅ |
| CONTENT-0635 | pages/buyer/BuyerVerificationWizard.jsx | 1655 | i18n-key | [i18n key: buyerVerificationWizard.verifyLicenseContinue] | ✅ |
| CONTENT-0636 | pages/buyer/BuyerVerificationWizard.jsx | 1667 | i18n-key | [i18n key: buyerVerificationWizard.documentUploadComplianceAudit] | ✅ |
| CONTENT-0637 | pages/buyer/BuyerVerificationWizard.jsx | 1668 | i18n-key | [i18n key: buyerVerificationWizard.uploadClearScanOrPdfCopies] | ✅ |
| CONTENT-0638 | pages/buyer/BuyerVerificationWizard.jsx | 1673 | object-label | Business Registration / Incorporation Certificate | ❌ |
| CONTENT-0639 | pages/buyer/BuyerVerificationWizard.jsx | 1674 | object-label | Business PAN Document | ❌ |
| CONTENT-0640 | pages/buyer/BuyerVerificationWizard.jsx | 1675 | object-label | Bank Account Proof / Cancelled Cheque | ❌ |
| CONTENT-0641 | pages/buyer/BuyerVerificationWizard.jsx | 1676 | object-label | Board / Owner Authorization Document | ❌ |
| CONTENT-0642 | pages/buyer/BuyerVerificationWizard.jsx | 1677 | object-label | GST Certificate (if applicable) | ❌ |
| CONTENT-0643 | pages/buyer/BuyerVerificationWizard.jsx | 1678 | object-label | Udyam Registration Certificate (if applicable) | ❌ |
| CONTENT-0644 | pages/buyer/BuyerVerificationWizard.jsx | 1679 | object-label | FSSAI / Mandi License Document (if applicable) | ❌ |
| CONTENT-0645 | pages/buyer/BuyerVerificationWizard.jsx | 1687 | dynamic | {{doc.title}} | ❌ |
| CONTENT-0646 | pages/buyer/BuyerVerificationWizard.jsx | 1688 | i18n-key | [i18n key: buyerVerificationWizard.requiredDocument] | ✅ |
| CONTENT-0647 | pages/buyer/BuyerVerificationWizard.jsx | 1688 | i18n-key | [i18n key: buyerVerificationWizard.conditionalDocument] | ✅ |
| CONTENT-0648 | pages/buyer/BuyerVerificationWizard.jsx | 1694 | i18n-key | [i18n key: buyerVerificationWizard.verified_uploaded] | ✅ |
| CONTENT-0649 | pages/buyer/BuyerVerificationWizard.jsx | 1694 | i18n-key | [i18n key: buyerVerificationWizard.uploadDocument] | ✅ |
| CONTENT-0650 | pages/buyer/BuyerVerificationWizard.jsx | 1703 | i18n-key | [i18n key: .] | ✅ |
| CONTENT-0651 | pages/buyer/BuyerVerificationWizard.jsx | 1705 | toast:error | Invalid document file format (${ext}). Allowed formats: PDF, JPG, PNG, WEBP. | ❌ |
| CONTENT-0652 | pages/buyer/BuyerVerificationWizard.jsx | 1709 | toast:success | Uploaded ${doc.title} | ❌ |
| CONTENT-0653 | pages/buyer/BuyerVerificationWizard.jsx | 1709 | dynamic | {{doc.title}} | ❌ |
| CONTENT-0654 | pages/buyer/BuyerVerificationWizard.jsx | 1724 | i18n-key | [i18n key: buyerVerificationWizard.back] | ✅ |
| CONTENT-0655 | pages/buyer/BuyerVerificationWizard.jsx | 1733 | i18n-key | [i18n key: buyerVerificationWizard.submitDocumentsProceed] | ✅ |
| CONTENT-0656 | pages/buyer/BuyerVerificationWizard.jsx | 1772 | dynamic | {{st.name}} | ❌ |
| CONTENT-0657 | pages/buyer/BuyerVerificationWizard.jsx | 1797 | i18n-key | [i18n key: buyerVerificationWizard.backToReview] | ✅ |
| CONTENT-0658 | pages/buyer/BuyerVerificationWizard.jsx | 1807 | i18n-key | [i18n key: buyerVerificationWizard.finalizeBuyerVerification] | ✅ |
| CONTENT-0659 | pages/buyer/BuyerVerificationWizard.jsx | 1817 | i18n-key | [i18n key: buyerVerificationWizard.yourInformationIsSecurelyProcessedSensitive] | ✅ |
| CONTENT-1590 | utils/enumTranslations.js | 8 | i18n-key | Unknown | ✅ |

## Footer

| ID | File | Line | Type | Original Text | i18n? |
|---|---|---|---|---|---|
| CONTENT-0009 | components/common/Footer.jsx | 18 | prop:alt | AgriBazaar Logo | ❌ |
| CONTENT-0010 | components/common/Footer.jsx | 26 | jsx-text | support@agribazaar.com | ❌ |
| CONTENT-0011 | components/common/Footer.jsx | 28 | jsx-text | Nashik & Mumbai, India | ❌ |
| CONTENT-0012 | components/common/Footer.jsx | 34 | i18n-key | [i18n key: footer.marketplace] | ✅ |
| CONTENT-0013 | components/common/Footer.jsx | 36 | i18n-key | [i18n key: footer.browseCrops] | ✅ |
| CONTENT-0014 | components/common/Footer.jsx | 37 | i18n-key | [i18n key: footer.freshFruits] | ✅ |
| CONTENT-0015 | components/common/Footer.jsx | 38 | i18n-key | [i18n key: footer.organicVegetables] | ✅ |
| CONTENT-0016 | components/common/Footer.jsx | 39 | i18n-key | [i18n key: footer.grainsRice] | ✅ |
| CONTENT-0017 | components/common/Footer.jsx | 40 | i18n-key | [i18n key: footer.pureSpices] | ✅ |
| CONTENT-0018 | components/common/Footer.jsx | 46 | i18n-key | [i18n key: footer.portals] | ✅ |
| CONTENT-0019 | components/common/Footer.jsx | 48 | i18n-key | [i18n key: footer.farmerPortal] | ✅ |
| CONTENT-0020 | components/common/Footer.jsx | 49 | i18n-key | [i18n key: footer.buyerPortal] | ✅ |
| CONTENT-0021 | components/common/Footer.jsx | 50 | i18n-key | [i18n key: footer.platformSignIn] | ✅ |
| CONTENT-0022 | components/common/Footer.jsx | 51 | i18n-key | [i18n key: navigation.about] | ✅ |
| CONTENT-0023 | components/common/Footer.jsx | 57 | i18n-key | [i18n key: footer.support] | ✅ |
| CONTENT-0024 | components/common/Footer.jsx | 59 | i18n-key | [i18n key: navigation.helpCenter] | ✅ |
| CONTENT-0025 | components/common/Footer.jsx | 60 | i18n-key | [i18n key: footer.verificationProcess] | ✅ |
| CONTENT-0026 | components/common/Footer.jsx | 61 | i18n-key | [i18n key: footer.terms] | ✅ |
| CONTENT-0027 | components/common/Footer.jsx | 62 | i18n-key | [i18n key: footer.contact] | ✅ |
| CONTENT-0028 | components/common/Footer.jsx | 68 | jsx-text | © 2026 AgriBazaar. All rights reserved. | ❌ |
| CONTENT-0029 | components/common/Footer.jsx | 71 | i18n-key | [i18n key: footer.engine] | ✅ |


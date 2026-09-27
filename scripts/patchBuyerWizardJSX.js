import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');

const targetPath = path.join(rootDir, 'frontend', 'src', 'pages', 'buyer', 'BuyerVerificationWizard.jsx');
let content = fs.readFileSync(targetPath, 'utf8');

// 1. Fix sidebar text colors & badge whitespace
content = content.replace(
  `<p className={\`font-semibold \${isCurrent ? 'text-emerald-950 dark:text-emerald-100 font-bold' : 'text-slate-700 dark:text-slate-300'}\`}>`,
  `<p className={\`font-semibold \${isCurrent ? 'text-emerald-950 font-extrabold' : 'text-slate-700'}\`}>`
);

content = content.replace(
  `<p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">`,
  `<p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">`
);

content = content.replace(
  `<span className={\`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 \${badgeBg}\`}>`,
  `<span className={\`text-[10px] font-bold px-2 py-0.5 rounded border shrink-0 whitespace-nowrap \${badgeBg}\`}>`
);

// 2. Fix form content container dark mode text contrast
content = content.replace(
  `className="lg:col-span-8 bg-white dark:bg-[#0e2230] border border-slate-300 dark:border-[#1e3a4e] rounded-md p-6 shadow-sm"`,
  `className="lg:col-span-8 bg-white border border-slate-300 rounded-md p-6 shadow-sm"`
);

content = content.replace(
  `className="border-b border-slate-200 dark:border-[#1e3a4e] pb-4 mb-6"`,
  `className="border-b border-slate-200 pb-4 mb-6"`
);

content = content.replace(
  `className="flex items-center space-x-2 text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wider mb-1"`,
  `className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1"`
);

content = content.replace(
  `className="text-xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2"`,
  `className="text-xl font-bold text-slate-900 flex items-center gap-2"`
);

content = content.replace(
  `<activeStepObj.icon className="w-6 h-6 text-emerald-700 dark:text-[#00E676]" />`,
  `<activeStepObj.icon className="w-6 h-6 text-emerald-700" />`
);

content = content.replace(
  `className="text-xs text-slate-600 dark:text-slate-400 mt-1"`,
  `className="text-xs text-slate-600 mt-1"`
);

// Clean up dark mode backgrounds on info callout boxes
content = content.replaceAll(`bg-emerald-50 dark:bg-[#002b36] border border-emerald-200 dark:border-emerald-800`, `bg-emerald-50 border border-emerald-200`);
content = content.replaceAll(`font-bold text-[#002b36] dark:text-[#00E676]`, `font-bold text-[#002b36]`);
content = content.replaceAll(`text-emerald-900 dark:text-gray-200`, `text-emerald-900`);

// 3. Localize Business Step Labels & Button
content = content.replace(
  `Legal Business Name <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.legalBusinessNameLabel', { defaultValue: 'Legal Business Name *' })}`
);

content = content.replace(
  `Trade / Business Name`,
  `{t('buyerVerificationWizard.tradeBusinessNameLabel', { defaultValue: 'Trade / Business Name' })}`
);

content = content.replace(
  `Business Type <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.businessTypeLabel', { defaultValue: 'Business Type *' })}`
);

content = content.replace(
  `Registered State <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.registeredStateLabel', { defaultValue: 'Registered State *' })}`
);

content = content.replace(
  `Business Address <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.businessAddressLabel', { defaultValue: 'Business Address *' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyBusinessIdentity')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyBusinessIdentity', { defaultValue: 'Verify Business Identity & Continue' })}</span>`
);

// 4. Localize Business PAN Step Labels & Button
content = content.replace(
  `Business / Entity PAN <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.businessPanLabel', { defaultValue: 'Business / Entity PAN *' })}`
);

content = content.replace(
  `Legal Name as per PAN`,
  `{t('buyerVerificationWizard.legalNameAsPerPanLabel', { defaultValue: 'Legal Name as per PAN' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyBusinessPan')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyBusinessPan', { defaultValue: 'Verify Business PAN & Continue' })}</span>`
);

// 5. Localize GSTIN Step Labels & Buttons
content = content.replace(
  `15-Digit GSTIN Number`,
  `{t('buyerVerificationWizard.gstinNumberLabel', { defaultValue: '15-Digit GSTIN Number' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyGstinContinue')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyGstinContinue', { defaultValue: 'Verify GSTIN & Continue' })}</span>`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.gstinNotApplicable')}</span>`,
  `<span>{t('buyerVerificationWizard.gstinNotApplicable', { defaultValue: 'GSTIN Not Applicable' })}</span>`
);

// 6. Localize Business Reg Step Labels & Button
content = content.replace(
  `Organization Structure Type`,
  `{t('buyerVerificationWizard.orgStructureTypeLabel', { defaultValue: 'Organization Structure Type' })}`
);

content = content.replace(
  `Registration Number / Identifier <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.registrationNumberLabel', { defaultValue: 'Registration Number / Identifier *' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyRegistration')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyRegistration', { defaultValue: 'Verify Registration & Continue' })}</span>`
);

// 7. Localize Representative Step Labels & Buttons
content = content.replace(
  `Representative Full Name <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.repFullNameLabel', { defaultValue: 'Representative Full Name *' })}`
);

content = content.replace(
  `Designation <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.designationLabel', { defaultValue: 'Designation *' })}`
);

content = content.replace(
  `Representative OTP <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.repOtpLabel', { defaultValue: 'Representative OTP *' })}`
);

content = content.replace(
  `<span>{repForm.otpSent ? t('buyerVerificationWizard.verifyRepresentativeOtp') : t('buyerVerificationWizard.sendRepresentativeOtp')}</span>`,
  `<span>{repForm.otpSent ? t('buyerVerificationWizard.verifyRepresentativeOtp', { defaultValue: 'Verify Representative & Continue' }) : t('buyerVerificationWizard.sendRepresentativeOtp', { defaultValue: 'Send Representative OTP' })}</span>`
);

// 8. Localize Bank Step Labels & Button
content = content.replace(
  `Account Holder Name <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.accountHolderNameLabel', { defaultValue: 'Account Holder Name *' })}`
);

content = content.replace(
  `Bank Name <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.bankNameLabel', { defaultValue: 'Bank Name *' })}`
);

content = content.replace(
  `Branch Name`,
  `{t('buyerVerificationWizard.branchNameLabel', { defaultValue: 'Branch Name' })}`
);

content = content.replace(
  `IFSC Code <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.ifscCodeLabel', { defaultValue: 'IFSC Code *' })}`
);

content = content.replace(
  `Account Number <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.accountNumberLabel', { defaultValue: 'Account Number *' })}`
);

content = content.replace(
  `Confirm Account Number <span className="text-red-600">*</span>`,
  `{t('buyerVerificationWizard.confirmAccountNumberLabel', { defaultValue: 'Confirm Account Number *' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyBankAccount')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyBankAccount', { defaultValue: 'Verify Bank Account & Continue' })}</span>`
);

// 9. Localize Udyam Step Labels & Buttons
content = content.replace(
  `Udyam Registration Number`,
  `{t('buyerVerificationWizard.udyamNumberLabel', { defaultValue: 'Udyam Registration Number' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.udyamNotApplicable')}</span>`,
  `<span>{t('buyerVerificationWizard.udyamNotApplicable', { defaultValue: 'Udyam Not Applicable' })}</span>`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyUdyamContinue')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyUdyamContinue', { defaultValue: 'Verify Udyam & Continue' })}</span>`
);

// 10. Localize License / FSSAI Step Labels & Buttons
content = content.replace(
  `License Type`,
  `{t('buyerVerificationWizard.licenseTypeLabel', { defaultValue: 'License Type' })}`
);

content = content.replace(
  `License / Registration Number`,
  `{t('buyerVerificationWizard.licenseNumberLabel', { defaultValue: 'License / Registration Number' })}`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.licenseNotApplicable')}</span>`,
  `<span>{t('buyerVerificationWizard.licenseNotApplicable', { defaultValue: 'License Not Applicable' })}</span>`
);

content = content.replace(
  `<span>{t('buyerVerificationWizard.verifyLicenseContinue')}</span>`,
  `<span>{t('buyerVerificationWizard.verifyLicenseContinue', { defaultValue: 'Verify License & Continue' })}</span>`
);

fs.writeFileSync(targetPath, content, 'utf8');
console.log('Successfully patched BuyerVerificationWizard.jsx UI and i18n');

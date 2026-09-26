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

// Register.jsx
fixFile('pages/Register.jsx', {
  "Register as Farmer →": "{t('auth.registerAsFarmerBtn', { defaultValue: 'Register as Farmer →' })}",
  "Register as Buyer →": "{t('auth.registerAsBuyerBtn', { defaultValue: 'Register as Buyer →' })}",
  "Full Name *": "{t('auth.fullNameLabel', { defaultValue: 'Full Name *' })}",
  "Email Address *": "{t('auth.emailAddressLabel', { defaultValue: 'Email Address *' })}",
  "Mobile Number *": "{t('auth.mobileNumberLabel', { defaultValue: 'Mobile Number *' })}",
  "Password *": "{t('auth.passwordLabel', { defaultValue: 'Password *' })}",
  "Confirm Password *": "{t('auth.confirmPasswordLabel', { defaultValue: 'Confirm Password *' })}",
  "Farm / Organization Name *": "{t('auth.farmOrgNameLabel', { defaultValue: 'Farm / Organization Name *' })}",
  "Seller Type *": "{t('auth.sellerTypeLabel', { defaultValue: 'Seller Type *' })}",
  "Buyer Type *": "{t('auth.buyerTypeLabel', { defaultValue: 'Buyer Type *' })}",
  "Location (City/District, State) *": "{t('auth.locationLabel', { defaultValue: 'Location (City/District, State) *' })}",
  "? 'Creating Account...' : 'Register as Farmer'": "? t('auth.creatingAccount', { defaultValue: 'Creating Account...' }) : t('auth.registerAsFarmer', { defaultValue: 'Register as Farmer' })",
  "? 'Creating Account...' : 'Register as Buyer'": "? t('auth.creatingAccount', { defaultValue: 'Creating Account...' }) : t('auth.registerAsBuyer', { defaultValue: 'Register as Buyer' })",
  "placeholder=\"Enter full name\"": "placeholder={t('auth.placeholderFullName', { defaultValue: 'Enter full name' })}",
  "placeholder=\"At least 6 chars\"": "placeholder={t('auth.placeholderMinChars', { defaultValue: 'At least 6 chars' })}",
  "placeholder=\"Re-enter password\"": "placeholder={t('auth.placeholderReEnterPassword', { defaultValue: 'Re-enter password' })}",
  "placeholder=\"e.g. Krishna Organic Farm\"": "placeholder={t('auth.placeholderFarmName', { defaultValue: 'e.g. Krishna Organic Farm' })}",
  "placeholder=\"e.g. Nashik, Maharashtra\"": "placeholder={t('auth.placeholderLocation', { defaultValue: 'e.g. Nashik, Maharashtra' })}",
  "placeholder=\"Street, Village, Pincode\"": "placeholder={t('auth.placeholderAddress', { defaultValue: 'Street, Village, Pincode' })}",
});

// Login.jsx
fixFile('pages/Login.jsx', {
  "placeholder=\"you@example.com\"": "placeholder={t('auth.placeholderEmail', { defaultValue: 'you@example.com' })}",
  "placeholder=\"Enter your password\"": "placeholder={t('auth.placeholderPassword', { defaultValue: 'Enter your password' })}",
});

console.log('Finished updating Register & Login.');

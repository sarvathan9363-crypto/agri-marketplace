import fs from 'fs';

let content = fs.readFileSync('frontend/src/config/buyerVerificationConfig.js', 'utf8');

// Replace static string properties with t() calls
content = content.replace(/portalTitle: '[^']+'/g, (m) => {
  if (m.includes('INDIVIDUAL')) return `portalTitle: t('buyerVerificationConfig.INDIVIDUAL.portalTitle')`;
  return m;
});

// Use a structured map for the 3 sections: INDIVIDUAL, BUSINESS, BULK_BUYER
const sections = ['INDIVIDUAL', 'BUSINESS', 'BULK_BUYER'];

for (const sec of sections) {
  content = content.replace(new RegExp(`portalTitle: ['"]([^'"]+)['"]`), `portalTitle: t('buyerVerificationConfig.${sec}.portalTitle')`);
  content = content.replace(new RegExp(`pageTitle: ['"]([^'"]+)['"]`), `pageTitle: t('buyerVerificationConfig.${sec}.pageTitle')`);
  content = content.replace(new RegExp(`badgeText: ['"]([^'"]+)['"]`), `badgeText: t('buyerVerificationConfig.${sec}.badgeText')`);
  content = content.replace(new RegExp(`incompleteBadgeText: ['"]([^'"]+)['"]`), `incompleteBadgeText: t('buyerVerificationConfig.${sec}.incompleteBadgeText')`);
}

fs.writeFileSync('frontend/src/config/buyerVerificationConfig.js', content, 'utf8');
console.log('Updated buyerVerificationConfig.js');

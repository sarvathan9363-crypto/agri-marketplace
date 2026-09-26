import fs from 'fs';

function cleanNested(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  
  // Fix nested t(' inside t('
  content = content.replace(/t\('[^']*',\s*\{\s*defaultValue:\s*'[^']*?\{t\('[^']*',\s*\{\s*defaultValue:\s*'([^']*?)'\s*\}\)\}([^']*?)'\s*\}\)/g, (match, p1, p2) => {
    return `t('buyerWizard.gstinHelp', { defaultValue: 'GSTIN verification is conditional. Small traders or exempt agricultural businesses can select "GSTIN Not Applicable".' })`;
  });

  // Generic cleanup of any remaining {t(' inside quotes
  content = content.replace(/\{t\('[^']*',\s*\{\s*defaultValue:\s*'([^']*?)'\s*\}\)\}/g, '$1');

  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Cleaned nested t() calls in ${filePath}`);
}

cleanNested('c:/Volume D/projects/temp/agri/frontend/src/pages/buyer/BuyerVerificationWizard.jsx');
cleanNested('c:/Volume D/projects/temp/agri/frontend/src/pages/farmer/VerificationWizard.jsx');

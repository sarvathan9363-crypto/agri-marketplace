import fs from 'fs';

const code = `import i18n from '../i18n';
import {
  Lock,
  Building2,
  Landmark,
  CreditCard,
  FileCheck2,
  Award,
  Building,
  FileText,
  UserCheck,
  FolderCheck,
} from 'lucide-react';

export const getVerificationConfigs = (t = (k) => i18n.t(k)) => {
  return {
    farmer: {
      accountType: 'farmer',
      portalTitle: t('verificationConfigs.farmer.portalTitle'),
      pageTitle: t('verificationConfigs.farmer.pageTitle'),
      badgeText: t('verificationConfigs.farmer.badgeText'),
      incompleteBadgeText: t('verificationConfigs.farmer.incompleteBadgeText'),
      totalRequired: 5,
      steps: [
        {
          id: 1,
          key: 'aadhaar',
          shortLabel: t('verificationConfigs.farmer.steps.aadhaar.shortLabel'),
          name: t('verificationConfigs.farmer.steps.aadhaar.name'),
          req: true,
          icon: Lock,
          description: t('verificationConfigs.farmer.steps.aadhaar.description'),
        },
        {
          id: 2,
          key: 'farmerRegistry',
          shortLabel: t('verificationConfigs.farmer.steps.farmerRegistry.shortLabel'),
          name: t('verificationConfigs.farmer.steps.farmerRegistry.name'),
          req: true,
          icon: Building2,
          description: t('verificationConfigs.farmer.steps.farmerRegistry.description'),
        },
        {
          id: 3,
          key: 'landRecord',
          shortLabel: t('verificationConfigs.farmer.steps.landRecord.shortLabel'),
          name: t('verificationConfigs.farmer.steps.landRecord.name'),
          req: true,
          icon: Landmark,
          description: t('verificationConfigs.farmer.steps.landRecord.description'),
        },
        {
          id: 4,
          key: 'bankAccount',
          shortLabel: t('verificationConfigs.farmer.steps.bankAccount.shortLabel'),
          name: t('verificationConfigs.farmer.steps.bankAccount.name'),
          req: true,
          icon: CreditCard,
          description: t('verificationConfigs.farmer.steps.bankAccount.description'),
        },
        {
          id: 5,
          key: 'pan',
          shortLabel: t('verificationConfigs.farmer.steps.pan.shortLabel'),
          name: t('verificationConfigs.farmer.steps.pan.name'),
          req: true,
          icon: FileCheck2,
          description: t('verificationConfigs.farmer.steps.pan.description'),
        },
        {
          id: 6,
          key: 'pmKisan',
          shortLabel: t('verificationConfigs.farmer.steps.pmKisan.shortLabel'),
          name: t('verificationConfigs.farmer.steps.pmKisan.name'),
          req: false,
          icon: Award,
          description: t('verificationConfigs.farmer.steps.pmKisan.description'),
        },
      ],
    },
    fpo: {
      accountType: 'fpo',
      portalTitle: t('verificationConfigs.fpo.portalTitle'),
      pageTitle: t('verificationConfigs.fpo.pageTitle'),
      badgeText: t('verificationConfigs.fpo.badgeText'),
      incompleteBadgeText: t('verificationConfigs.fpo.incompleteBadgeText'),
      totalRequired: 5,
      steps: [
        {
          id: 1,
          key: 'orgIdentity',
          shortLabel: t('verificationConfigs.fpo.steps.orgIdentity.shortLabel'),
          name: t('verificationConfigs.fpo.steps.orgIdentity.name'),
          req: true,
          icon: Building,
          description: t('verificationConfigs.fpo.steps.orgIdentity.description'),
        },
        {
          id: 2,
          key: 'orgPan',
          shortLabel: t('verificationConfigs.fpo.steps.orgPan.shortLabel'),
          name: t('verificationConfigs.fpo.steps.orgPan.name'),
          req: true,
          icon: FileCheck2,
          description: t('verificationConfigs.fpo.steps.orgPan.description'),
        },
        {
          id: 3,
          key: 'gstin',
          shortLabel: t('verificationConfigs.fpo.steps.gstin.shortLabel'),
          name: t('verificationConfigs.fpo.steps.gstin.name'),
          req: false,
          icon: FileText,
          description: t('verificationConfigs.fpo.steps.gstin.description'),
        },
        {
          id: 4,
          key: 'representative',
          shortLabel: t('verificationConfigs.fpo.steps.representative.shortLabel'),
          name: t('verificationConfigs.fpo.steps.representative.name'),
          req: true,
          icon: UserCheck,
          description: t('verificationConfigs.fpo.steps.representative.description'),
        },
        {
          id: 5,
          key: 'orgBank',
          shortLabel: t('verificationConfigs.fpo.steps.orgBank.shortLabel'),
          name: t('verificationConfigs.fpo.steps.orgBank.name'),
          req: true,
          icon: CreditCard,
          description: t('verificationConfigs.fpo.steps.orgBank.description'),
        },
        {
          id: 6,
          key: 'orgDocuments',
          shortLabel: t('verificationConfigs.fpo.steps.orgDocuments.shortLabel'),
          name: t('verificationConfigs.fpo.steps.orgDocuments.name'),
          req: true,
          icon: FolderCheck,
          description: t('verificationConfigs.fpo.steps.orgDocuments.description'),
        },
      ],
    },
  };
};

export const verificationConfigs = getVerificationConfigs();
`;

fs.writeFileSync('frontend/src/config/verificationConfigs.js', code, 'utf8');
console.log('Successfully generated verificationConfigs.js');

import { useState } from 'react';
import { LayoutDashboard, Truck, ShieldCheck, User, Settings, PackageSearch } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function TransporterLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isTransporter, loading } = useAuth();

  const transporterLinks = [
    { to: '/transporter/dashboard', label: t('navigation.dashboard', { defaultValue: 'Dashboard' }), icon: LayoutDashboard, end: true },
    { to: '/transporter/verification', label: t('navigation.verification', { defaultValue: 'Verification' }), icon: ShieldCheck },
    { to: '/transporter/profile', label: t('navigation.profile', { defaultValue: 'Profile' }), icon: User },
    { to: '/transporter/settings', label: t('navigation.settings', { defaultValue: 'Settings' }), icon: Settings },
  ];

  return (
    <DashboardLayout
      loading={loading}
      isAuthorized={isTransporter}
      links={transporterLinks}
      portalLabel={t('portals.transporter', { defaultValue: 'Transporter Portal' })}
      sidebarOpen={sidebarOpen}
      setSidebarOpen={setSidebarOpen}
    />
  );
}

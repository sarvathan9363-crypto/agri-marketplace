import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, ShoppingCart, User, Settings, ShieldCheck } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function BuyerLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isBuyer, loading } = useAuth();
  const buyerLinks = [
    { to: '/buyer/dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard, end: true }, { to: '/buyer/verification', label: t('navigation.verification'), icon: ShieldCheck },
    { to: '/buyer/orders', label: t('navigation.orders'), icon: ShoppingBag }, { to: '/buyer/cart', label: t('navigation.cart'), icon: ShoppingCart },
    { to: '/buyer/profile', label: t('navigation.profile'), icon: User }, { to: '/buyer/settings', label: t('navigation.settings'), icon: Settings },
  ];

  return <DashboardLayout loading={loading} isAuthorized={isBuyer} links={buyerLinks} portalLabel={t('portals.buyer')} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

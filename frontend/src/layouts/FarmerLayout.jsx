import { useState } from 'react';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, TrendingUp, User, Shield, Settings } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function FarmerLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isFarmer, loading } = useAuth();
  const farmerLinks = [
    { to: '/farmer/dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard, end: true }, { to: '/farmer/products', label: t('navigation.products'), icon: Package },
    { to: '/farmer/products/add', label: t('common.add', { defaultValue: 'Add Product' }), icon: PlusCircle }, { to: '/farmer/orders', label: t('navigation.orders'), icon: ShoppingBag },
    { to: '/farmer/sales', label: t('navigation.sales'), icon: TrendingUp }, { to: '/farmer/profile', label: t('navigation.profile'), icon: User },
    { to: '/farmer/verification', label: t('navigation.verification'), icon: Shield }, { to: '/farmer/settings', label: t('navigation.settings'), icon: Settings },
  ];

  return <DashboardLayout loading={loading} isAuthorized={isFarmer} links={farmerLinks} portalLabel={t('portals.farmer')} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

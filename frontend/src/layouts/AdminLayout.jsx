import { useState } from 'react';
import { LayoutDashboard, Users, Tractor, Package, ShoppingBag, CreditCard, ShieldCheck, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';

export default function AdminLayout() {
  const { t } = useTranslation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, loading } = useAuth();
  const adminLinks = [
    { to: '/admin/dashboard', label: t('navigation.dashboard'), icon: LayoutDashboard, end: true }, { to: '/admin/users', label: t('admin.users', { defaultValue: 'Users' }), icon: Users },
    { to: '/admin/farmers', label: t('admin.farmers', { defaultValue: 'Farmers / FPOs' }), icon: Tractor }, { to: '/admin/settlements', label: t('admin.settlements', { defaultValue: 'Settlements' }), icon: CreditCard },
    { to: '/admin/products', label: t('navigation.products'), icon: Package }, { to: '/admin/orders', label: t('navigation.orders'), icon: ShoppingBag },
    { to: '/admin/payments', label: t('admin.payments', { defaultValue: 'Payments' }), icon: CreditCard },
    { to: '/admin/blockchain', label: t('admin.blockchain', { defaultValue: 'Blockchain Audit' }), icon: ShieldCheck },
    { to: '/admin/disputes', label: t('admin.disputes', { defaultValue: 'Disputes' }), icon: AlertTriangle },
    { to: '/admin/analytics', label: t('admin.analytics', { defaultValue: 'Analytics' }), icon: BarChart3 }, { to: '/admin/settings', label: t('navigation.settings'), icon: Settings },
  ];

  return <DashboardLayout loading={loading} isAuthorized={isAdmin} links={adminLinks} portalLabel={t('portals.admin')} sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

import { useState } from 'react';
import { LayoutDashboard, Users, Tractor, Package, ShoppingBag, CreditCard, AlertTriangle, BarChart3, Settings } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const adminLinks = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/users', label: 'Users', icon: Users },
  { to: '/admin/farmers', label: 'Farmers / FPOs', icon: Tractor },
  { to: '/admin/settlements', label: 'Settlements', icon: CreditCard },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/admin/payments', label: 'Payments', icon: CreditCard },
  { to: '/admin/disputes', label: 'Disputes', icon: AlertTriangle },
  { to: '/admin/analytics', label: 'Analytics', icon: BarChart3 },
  { to: '/admin/settings', label: 'Settings', icon: Settings },
];

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isAdmin, loading } = useAuth();

  return <DashboardLayout loading={loading} isAuthorized={isAdmin} links={adminLinks} portalLabel="Admin Portal" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

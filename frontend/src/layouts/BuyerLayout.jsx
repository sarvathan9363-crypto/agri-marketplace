import { useState } from 'react';
import { LayoutDashboard, ShoppingBag, ShoppingCart, User, Settings, ShieldCheck } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const buyerLinks = [
  { to: '/buyer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/buyer/verification', label: 'Verification', icon: ShieldCheck },
  { to: '/buyer/orders', label: 'My Orders', icon: ShoppingBag },
  { to: '/buyer/cart', label: 'Cart', icon: ShoppingCart },
  { to: '/buyer/profile', label: 'Profile', icon: User },
  { to: '/buyer/settings', label: 'Settings', icon: Settings },
];

export default function BuyerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isBuyer, loading } = useAuth();

  return <DashboardLayout loading={loading} isAuthorized={isBuyer} links={buyerLinks} portalLabel="Buyer Portal" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

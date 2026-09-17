import { useState } from 'react';
import { LayoutDashboard, Package, PlusCircle, ShoppingBag, TrendingUp, User, Shield, Settings } from 'lucide-react';
import DashboardLayout from './DashboardLayout';
import { useAuth } from '../context/AuthContext';

const farmerLinks = [
  { to: '/farmer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/farmer/products', label: 'My Products', icon: Package },
  { to: '/farmer/products/add', label: 'Add Product', icon: PlusCircle },
  { to: '/farmer/orders', label: 'Orders', icon: ShoppingBag },
  { to: '/farmer/sales', label: 'Sales', icon: TrendingUp },
  { to: '/farmer/profile', label: 'Profile', icon: User },
  { to: '/farmer/verification', label: 'Verification', icon: Shield },
  { to: '/farmer/settings', label: 'Settings', icon: Settings },
];

export default function FarmerLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { isFarmer, loading } = useAuth();

  return <DashboardLayout loading={loading} isAuthorized={isFarmer} links={farmerLinks} portalLabel="Farmer Portal" sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />;
}

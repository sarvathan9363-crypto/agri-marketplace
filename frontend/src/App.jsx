import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Layouts
import PublicLayout from './layouts/PublicLayout';
import FarmerLayout from './layouts/FarmerLayout';
import BuyerLayout from './layouts/BuyerLayout';
import AdminLayout from './layouts/AdminLayout';

// Public Pages
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import ProductDetails from './pages/ProductDetails';
import About from './pages/About';
import Login from './pages/Login';
import Register from './pages/Register';

// Farmer Pages
import FarmerDashboard from './pages/farmer/Dashboard';
import MyProducts from './pages/farmer/MyProducts';
import AddProduct from './pages/farmer/AddProduct';
import FarmerOrders from './pages/farmer/Orders';
import FarmerSales from './pages/farmer/Sales';
import FarmerProfile from './pages/farmer/Profile';
import FarmerVerification from './pages/farmer/Verification';
import VerificationWizard from './pages/farmer/VerificationWizard';

// Buyer Pages
import BuyerDashboard from './pages/buyer/Dashboard';
import BuyerOrders from './pages/buyer/Orders';
import Cart from './pages/buyer/Cart';
import Checkout from './pages/buyer/Checkout';
import BuyerProfile from './pages/buyer/Profile';
import BuyerVerification from './pages/buyer/Verification';
import BuyerVerificationWizard from './pages/buyer/BuyerVerificationWizard';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminUsers from './pages/admin/Users';
import AdminFarmers from './pages/admin/Farmers';
import AdminProducts from './pages/admin/Products';
import AdminOrders from './pages/admin/Orders';
import AdminPayments from './pages/admin/Payments';
import AdminDisputes from './pages/admin/Disputes';
import AdminAnalytics from './pages/admin/Analytics';

// Common
import Settings from './pages/Settings';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <Router>
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
        <Routes>
          {/* Public Routes */}
          <Route element={<PublicLayout />}>
            <Route path="/" element={<Landing />} />
            <Route path="/marketplace" element={<Marketplace />} />
            <Route path="/marketplace/:id" element={<ProductDetails />} />
            <Route path="/about" element={<About />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
          </Route>

          {/* Farmer Protected Routes */}
          <Route path="/farmer" element={<FarmerLayout />}>
            <Route index element={<Navigate to="/farmer/dashboard" replace />} />
            <Route path="dashboard" element={<FarmerDashboard />} />
            <Route path="products" element={<MyProducts />} />
            <Route path="products/add" element={<AddProduct />} />
            <Route path="orders" element={<FarmerOrders />} />
            <Route path="sales" element={<FarmerSales />} />
            <Route path="profile" element={<FarmerProfile />} />
            <Route path="verification" element={<FarmerVerification />} />
            <Route path="verification/wizard" element={<VerificationWizard />} />
            <Route path="verification/onboarding" element={<VerificationWizard />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* FPO Protected Onboarding Routes */}
          <Route path="/fpo" element={<FarmerLayout />}>
            <Route path="verification/onboarding" element={<VerificationWizard accountType="fpo" />} />
            <Route path="verification/wizard" element={<VerificationWizard accountType="fpo" />} />
          </Route>

          {/* Buyer Protected Routes */}
          <Route path="/buyer" element={<BuyerLayout />}>
            <Route index element={<Navigate to="/buyer/dashboard" replace />} />
            <Route path="dashboard" element={<BuyerDashboard />} />
            <Route path="verification" element={<BuyerVerification />} />
            <Route path="verification/wizard" element={<BuyerVerificationWizard />} />
            <Route path="verification/onboarding" element={<BuyerVerificationWizard />} />
            <Route path="orders" element={<BuyerOrders />} />
            <Route path="cart" element={<Cart />} />
            <Route path="checkout" element={<Checkout />} />
            <Route path="profile" element={<BuyerProfile />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Admin Protected Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<Navigate to="/admin/dashboard" replace />} />
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="farmers" element={<AdminFarmers />} />
            <Route path="products" element={<AdminProducts />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="payments" element={<AdminPayments />} />
            <Route path="disputes" element={<AdminDisputes />} />
            <Route path="analytics" element={<AdminAnalytics />} />
            <Route path="settings" element={<Settings />} />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
      </CartProvider>
    </AuthProvider>
  );
}

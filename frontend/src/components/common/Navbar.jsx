import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, Bell, User, LogOut, ChevronDown, Search } from 'lucide-react';
import agriLogo from '../../assets/image copy.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import notificationService from '../../services/notificationService';
import PageContainer from '../ui/PageContainer';

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const { user, isAuthenticated, isFarmer, isBuyer, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);
  const notifRef = useRef(null);

  useEffect(() => {
    if (isAuthenticated) fetchNotifications();
  }, [isAuthenticated]);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target)) setNotifOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const fetchNotifications = async () => {
    try {
      const data = await notificationService.getNotifications({ limit: 5 });
      setNotifications(data.notifications || []);
      setUnreadCount(data.unreadCount || 0);
    } catch {}
  };

  const markAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setUnreadCount(0);
      setNotifications(n => n.map(x => ({ ...x, read: true })));
    } catch {}
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (isFarmer) return '/farmer/dashboard';
    if (isBuyer) return '/buyer/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/';
  };

  const navLinks = [
    { label: 'Home', to: '/' },
    { label: 'Marketplace', to: '/marketplace' },
    { label: 'About', to: '/about' },
  ];

  return (
    <header className="relative z-50 w-full flex flex-col border-b border-[#E2E8E5]">
      {/* 1. Top dark announcement bar */}
      <div className="bg-[#002B36] text-white text-xs font-semibold py-2 px-4 border-b border-emerald-950">
        <PageContainer className="flex items-center justify-between">
          <div className="flex items-center gap-2 mx-auto sm:mx-0">
            <span className="bg-[#00E676] text-[#002B36] px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-wider">NEW</span>
            <span className="text-gray-200">Direct Farm-to-Buyer Marketplace — 0% Commission Platform</span>
          </div>
          <div className="hidden sm:flex items-center gap-4 text-xs text-gray-300">
            <Link to="/about" className="hover:text-[#00E676] transition-colors">Support</Link>
            <span>|</span>
            <Link to="/about" className="hover:text-[#00E676] transition-colors">Help Center</Link>
          </div>
        </PageContainer>
      </div>

      {/* 2. Main light navbar matching reference image */}
      <div className="bg-[#F7F9F3] text-[#082B36] py-3.5 shadow-sm">
        <PageContainer className="flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src={agriLogo}
              alt="AgriBazaar Logo"
              className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            />
          </Link>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map(link => {
              const active = location.pathname === link.to;
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`text-sm font-bold transition-colors py-1 border-b-2 font-display ${
                    active ? 'text-[#00C853] border-[#00E676]' : 'text-gray-600 border-transparent hover:text-[#082B36]'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
          </div>

          {/* Right Action Items */}
          <div className="flex items-center gap-3 sm:gap-5">
            <Link to="/marketplace" className="p-2 text-gray-600 hover:text-[#082B36] transition-colors" title="Search Marketplace">
              <Search className="w-5 h-5" />
            </Link>

            {isAuthenticated ? (
              <>
                {isBuyer && (
                  <Link to="/buyer/cart" className="relative p-2 text-gray-700 hover:text-[#00C853] rounded-lg transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    {cartCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00E676] text-[#002B36] text-xs rounded-full flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </Link>
                )}

                <div ref={notifRef} className="relative">
                  <button onClick={() => setNotifOpen(!notifOpen)} className="relative p-2 text-gray-700 hover:text-[#00C853] rounded-lg transition-colors">
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#00C853] text-white text-xs rounded-full flex items-center justify-center font-bold">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <AnimatePresence>
                    {notifOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-80 bg-white border border-[#E2E8E5] rounded-2xl shadow-2xl overflow-hidden text-[#082B36]"
                      >
                        <div className="flex items-center justify-between px-4 py-3 border-b border-[#E2E8E5] bg-[#F7F9F3]">
                          <h3 className="font-bold text-sm font-display">Notifications</h3>
                          {unreadCount > 0 && (
                            <button onClick={markAllRead} className="text-xs text-[#00C853] font-semibold hover:underline">
                              Mark all read
                            </button>
                          )}
                        </div>
                        <div className="max-h-72 overflow-y-auto">
                          {notifications.length > 0 ? notifications.map(n => (
                            <div key={n._id} className={`px-4 py-3 border-b border-[#E2E8E5] ${!n.read ? 'bg-emerald-50' : ''}`}>
                              <p className="text-sm font-semibold">{n.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{n.message}</p>
                            </div>
                          )) : (
                            <div className="px-4 py-8 text-center text-sm text-gray-500">No notifications</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div ref={profileRef} className="relative">
                  <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#E2E8E5] hover:border-[#00E676] transition-colors bg-white">
                    <div className="w-8 h-8 bg-[#00E676] text-[#002B36] rounded-full flex items-center justify-center font-bold text-sm">
                      {user?.fullName?.[0] || 'U'}
                    </div>
                    <span className="hidden sm:block text-sm font-bold text-[#082B36] font-display">{user?.fullName?.split(' ')[0]}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </button>
                  <AnimatePresence>
                    {profileOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                        className="absolute right-0 mt-2 w-56 bg-white border border-[#E2E8E5] rounded-2xl shadow-2xl overflow-hidden text-[#082B36]"
                      >
                        <div className="px-4 py-3 border-b border-[#E2E8E5] bg-[#F7F9F3]">
                          <p className="text-sm font-bold font-display">{user?.fullName}</p>
                          <p className="text-xs text-gray-500">{user?.email}</p>
                          <span className="inline-block mt-1.5 px-2.5 py-0.5 bg-[#00E676] text-[#002B36] text-[11px] font-extrabold rounded-full uppercase tracking-wider">
                            {user?.role}
                          </span>
                        </div>
                        <div className="py-1">
                          <Link to={getDashboardLink()} onClick={() => setProfileOpen(false)} className="flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 hover:bg-emerald-50 hover:text-[#00C853]">
                            <User className="w-4 h-4" /> Dashboard
                          </Link>
                          <button onClick={handleLogout} className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50">
                            <LogOut className="w-4 h-4" /> Logout
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="px-3.5 py-2 text-sm font-bold text-[#082B36] hover:text-[#00C853] transition-colors font-display">
                  Sign In
                </Link>
                <Link to="/register" className="btn-agri-primary text-sm">
                  Get Started →
                </Link>
              </div>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[#082B36] hover:bg-emerald-50 rounded-lg">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </PageContainer>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[#E2E8E5] bg-[#F7F9F3] overflow-hidden"
          >
            <PageContainer className="py-4 space-y-2">
              {navLinks.map(link => (
                <Link key={link.to} to={link.to} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-base font-bold text-gray-700 hover:bg-emerald-100 hover:text-[#00C853]">
                  {link.label}
                </Link>
              ))}
              {!isAuthenticated && (
                <div className="pt-2 flex flex-col gap-2">
                  <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-3 py-2 text-center text-[#082B36] font-bold">
                    Sign In
                  </Link>
                  <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-agri-primary text-center justify-center">
                    Get Started →
                  </Link>
                </div>
              )}
            </PageContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}


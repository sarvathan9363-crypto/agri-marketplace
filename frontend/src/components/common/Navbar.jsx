import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Menu, X, ShoppingCart, User, LogOut, ChevronDown, Heart, Truck, RotateCcw, ShieldCheck, Gem, Headphones } from 'lucide-react';
import agriLogo from '../../assets/image copy.png';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import notificationService from '../../services/notificationService';
import PageContainer from '../ui/PageContainer';
import LanguageSelector from './LanguageSelector';
import ThemeToggle from './ThemeToggle';
import { useTranslation } from 'react-i18next';

export default function Navbar() {
  const { t } = useTranslation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  
  const { user, isAuthenticated, isFarmer, isBuyer, isTransporter, isAdmin, logout } = useAuth();
  const { cartCount } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const profileRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (profileRef.current && !profileRef.current.contains(e.target)) setProfileOpen(false);
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setProfileOpen(false);
  };

  const getDashboardLink = () => {
    if (isFarmer) return '/farmer/dashboard';
    if (isBuyer) return '/buyer/dashboard';
    if (isTransporter) return '/transporter/dashboard';
    if (isAdmin) return '/admin/dashboard';
    return '/';
  };

  return (
    <header className="relative z-50 w-full flex flex-col font-sans border-b border-[var(--border)] transition-colors">
      {/* 1. Top Utility Bar */}
      <div className="bg-[var(--surface-elevated)] text-[var(--text-secondary)] text-[11px] font-semibold py-2 px-4 border-b border-[var(--border)] transition-colors">
        <PageContainer className="flex flex-wrap items-center justify-between gap-3 text-center sm:text-left">
          <div className="flex items-center gap-6 mx-auto sm:mx-0 flex-wrap justify-center">
            <div className="flex items-center gap-1.5">
              <Truck className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t('header.freeShipping', { defaultValue: 'Free Shipping on Orders Above ₹999' })}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <RotateCcw className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t('header.easyReturns', { defaultValue: 'Easy Returns' })}</span>
            </div>
            <div className="hidden md:flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t('header.securePayments', { defaultValue: 'Secure Payments' })}</span>
            </div>
            <div className="hidden lg:flex items-center gap-1.5">
              <Gem className="w-3.5 h-3.5 text-[var(--primary)]" />
              <span>{t('header.premiumQuality', { defaultValue: 'Premium Quality' })}</span>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-2 text-[11px] font-bold text-[var(--primary)]">
            <Headphones className="w-3.5 h-3.5" />
            <span>{t('header.customerSupport', { defaultValue: 'Customer Support' })}</span>
          </div>
        </PageContainer>
      </div>

      {/* 2. Main Navigation Header */}
      <div className="bg-[var(--background)] text-[var(--text-primary)] py-3 transition-colors">
        <PageContainer className="flex items-center justify-between gap-4">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 shrink-0">
            <img
              src={agriLogo}
              alt="AgriBazaar Logo"
              className="h-9 sm:h-11 w-auto object-contain transition-transform hover:scale-105"
            />
          </Link>

          {/* Right Header Controls */}
          <div className="flex items-center gap-3 sm:gap-4 ml-auto">
            <LanguageSelector compact />
            
            <Link to="/marketplace" className="p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors" title={t('navigation.wishlist', { defaultValue: 'Wishlist' })}>
              <Heart className="w-5 h-5" />
            </Link>

            {isBuyer && (
              <Link to="/buyer/cart" className="relative p-2 text-[var(--text-secondary)] hover:text-[var(--primary)] transition-colors">
                <ShoppingCart className="w-5 h-5" />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-[var(--accent)] text-[var(--primary-contrast)] text-[11px] rounded-full flex items-center justify-center font-black shadow-sm">
                    {cartCount}
                  </span>
                )}
              </Link>
            )}

            <ThemeToggle />

            {isAuthenticated ? (
              <div ref={profileRef} className="relative">
                <button onClick={() => setProfileOpen(!profileOpen)} className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-[var(--border)] hover:border-[var(--primary)] transition-colors bg-[var(--surface)]">
                  <div className="w-7 h-7 bg-[var(--primary)] text-[var(--primary-contrast)] rounded-full flex items-center justify-center font-bold text-xs">
                    {user?.fullName?.[0] || 'U'}
                  </div>
                  <span className="hidden sm:block text-xs font-bold text-[var(--text-primary)] font-display">{user?.fullName?.split(' ')[0]}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                </button>
                <AnimatePresence>
                  {profileOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                      className="absolute right-0 mt-2 w-60 bg-[var(--surface)] border border-[var(--border)] rounded-2xl shadow-2xl overflow-hidden text-[var(--text-primary)] z-50"
                    >
                      <div className="px-4 py-3.5 border-b border-[var(--border)] bg-[var(--surface-elevated)]">
                        <p className="text-sm font-black font-display text-[var(--text-primary)] tracking-wide">{user?.fullName}</p>
                        <p className="text-xs text-[var(--text-secondary)] font-sans truncate">{user?.email}</p>
                        <span className="inline-block mt-2 px-2.5 py-0.5 bg-[var(--primary)] text-[var(--primary-contrast)] text-[10px] font-black rounded-full uppercase tracking-wider">
                          {user?.role}
                        </span>
                      </div>
                      <div className="py-2 space-y-1">
                        <Link
                          to={getDashboardLink()}
                          onClick={() => setProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] hover:text-[var(--primary)] transition-colors"
                        >
                          <User className="w-4 h-4 text-[var(--primary)]" /> {t('navigation.dashboard', { defaultValue: 'Dashboard' })}
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm font-bold text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                        >
                          <LogOut className="w-4 h-4 text-red-500" /> {t('navigation.logout', { defaultValue: 'Logout' })}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link to="/login" className="flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-extrabold text-[var(--text-primary)] hover:text-[var(--primary)] transition-colors font-display">
                <User className="w-4 h-4" />
                <span>{t('navigation.account', { defaultValue: 'Account' })}</span>
              </Link>
            )}

            <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 text-[var(--text-primary)] hover:bg-[var(--surface-elevated)] rounded-lg">
              {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </PageContainer>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-[var(--border)] bg-[var(--background)] overflow-hidden"
          >
            <PageContainer className="py-4 space-y-3">
              <Link to="/marketplace" onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                {t('navigation.marketplace', { defaultValue: 'Marketplace' })}
              </Link>
              {isAuthenticated && (
                <Link to={getDashboardLink()} onClick={() => setMobileOpen(false)} className="block px-3 py-2 rounded-lg text-sm font-bold text-[var(--text-primary)] hover:bg-[var(--surface-elevated)]">
                  {t('navigation.dashboard', { defaultValue: 'Dashboard' })}
                </Link>
              )}
            </PageContainer>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

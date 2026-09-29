import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import heroFarmerImage from '../assets/image.png';
import productService from '../services/productService';
import ProductCard from '../components/common/ProductCard';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  CreditCard,
  Leaf,
  Users,
  BarChart3,
  Star,
  ShoppingBag,
} from 'lucide-react';

export default function Landing() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { isAuthenticated, isBuyer } = useAuth();
  const { addToCart } = useCart();
  const [featuredProducts, setFeaturedProducts] = useState([]);

  useEffect(() => {
    let active = true;
    productService.getProducts({ page: 1, limit: 4, sort: 'popular' })
      .then((data) => { if (active) setFeaturedProducts(data.products || []); })
      .catch(() => { if (active) setFeaturedProducts([]); });
    return () => { active = false; };
  }, []);

  const handleAddToCart = async (product) => {
    if (!isAuthenticated) {
      toast.error(t('productDetails.loginFirst', { defaultValue: 'Please login to add items to cart' }));
      navigate('/login');
      return;
    }
    if (!isBuyer) {
      toast.error(t('productDetails.buyersOnly', { defaultValue: 'Only buyers can add items to cart' }));
      return;
    }
    try {
      await addToCart(product._id, 1);
      toast.success(t('productDetails.addedToCart', { defaultValue: 'Added {{name}} to cart', name: product.productName }));
    } catch (error) {
      toast.error(error.response?.data?.message || t('productDetails.addToCartFailed', { defaultValue: 'Failed to add item to cart' }));
    }
  };

  const featureCards = [
    {
      icon: Leaf,
      title: t('landing.verifiedFarmersTitle', { defaultValue: 'Verified Farmers' }),
      desc: t('landing.verifiedFarmersDesc', { defaultValue: 'Buy directly from verified farmers and FPOs with complete transparency.' }),
      illustration: (
        <svg className="h-14 w-14 text-[var(--primary)] opacity-85" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <circle cx="32" cy="32" r="28" className="fill-[var(--surface-elevated)]" strokeWidth="1.5"/>
          <path d="M22 42C22 34 28 26 38 24C38 34 32 42 22 42Z" fill="currentColor" opacity="0.3"/>
          <path d="M22 42C28 42 36 38 42 28C32 28 24 34 22 42Z" fill="currentColor" opacity="0.7"/>
          <path d="M22 42L36 28" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      icon: Truck,
      title: t('landing.fastDeliveryTitle', { defaultValue: 'Fast & Reliable Delivery' }),
      desc: t('landing.fastDeliveryDesc', { defaultValue: 'Fresh produce delivered to your doorstep with real-time tracking.' }),
      illustration: (
        <svg className="h-14 w-14 text-[var(--primary)] opacity-85" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <rect x="8" y="24" width="32" height="20" rx="4" className="fill-[var(--surface-elevated)]" strokeWidth="1.5"/>
          <path d="M40 30L48 30L54 36L54 44L40 44Z" className="fill-[var(--surface-elevated)]" strokeWidth="1.5"/>
          <circle cx="20" cy="46" r="5" fill="currentColor" opacity="0.8"/>
          <circle cx="46" cy="46" r="5" fill="currentColor" opacity="0.8"/>
          <path d="M12 20L28 20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>
      ),
    },
    {
      icon: ShieldCheck,
      title: t('landing.securePaymentsTitle', { defaultValue: 'Safe & Secure Payments' }),
      desc: t('landing.securePaymentsDesc', { defaultValue: '100% secure payments with direct settlement to farmers.' }),
      illustration: (
        <svg className="h-14 w-14 text-[var(--accent)] opacity-85" viewBox="0 0 64 64" fill="none" stroke="currentColor">
          <path d="M32 10L50 18V32C50 44 32 54 32 54C32 54 14 44 14 32V18L32 10Z" className="fill-[var(--surface-elevated)]" strokeWidth="1.5"/>
          <path d="M26 32L30 36L38 26" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      ),
    },
  ];

  const heroMetrics = [
    {
      icon: Users,
      value: '500+',
      label: t('landing.metricFarmers', { defaultValue: 'VERIFIED FARMERS' }),
    },
    {
      icon: BarChart3,
      value: '₹2Cr+',
      label: t('landing.metricVolume', { defaultValue: 'TRADE VOLUME' }),
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: t('landing.metricSettlement', { defaultValue: 'DIRECT SETTLEMENT' }),
    },
  ];

  const farmerSteps = [
    t('home.farmerStep1', { defaultValue: 'Register & Complete Identity Verification' }),
    t('home.farmerStep2', { defaultValue: 'List Produce with Transparent Pricing' }),
    t('home.farmerStep3', { defaultValue: 'Receive Direct Orders & Instant Payouts' }),
  ];

  const buyerSteps = [
    t('home.buyerStep1', { defaultValue: 'Browse Verified Fresh Farm Produce' }),
    t('home.buyerStep2', { defaultValue: 'Place Direct Orders with 0% Markup' }),
    t('home.buyerStep3', { defaultValue: 'Track Doorstep Delivery & Quality' }),
  ];

  const testimonials = [
    {
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote: t('home.testimonial1', { defaultValue: 'AgriBazaar helped me get better prices for my produce and reach buyers directly. Truly a game changer for our regional farm community!' }),
      name: 'Ramesh Patil',
      role: t('home.roleFarmer', { defaultValue: 'Farmer, Maharashtra' }),
    },
    {
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      quote: t('home.testimonial2', { defaultValue: 'Fresh quality produce straight from verified farms, transparent pricing and smooth delivery. Highly recommended for commercial sourcing!' }),
      name: 'Amit Shah',
      role: t('home.roleBuyer', { defaultValue: 'Restaurant Owner, Mumbai' }),
    },
    {
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
      quote: t('home.testimonial3', { defaultValue: 'A reliable platform that supports farmers directly and brings real transparency to the entire agricultural marketplace.' }),
      name: 'Priya Desai',
      role: t('home.roleFpo', { defaultValue: 'FPO Member, Gujarat' }),
    },
  ];

  return (
    <main key={i18n.language} className="landing-page relative w-full overflow-x-hidden bg-[var(--background)] text-[var(--text-primary)] transition-colors duration-200">

      {/* =========================================================
          DECORATIVE BACKGROUND LAYERS (Art Direction System)
      ========================================================= */}
      
      {/* LAYER 2: Atmospheric Soft Radial Lighting */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-0 overflow-hidden">
        <div className="absolute -left-32 -top-20 h-[500px] w-[500px] rounded-full bg-gradient-to-br from-[#FBFAF2] via-[#EFF8EC]/40 to-transparent dark:from-[#05251D]/60 dark:to-transparent blur-3xl opacity-70" />
        <div className="absolute right-0 top-1/4 h-[600px] w-[600px] rounded-full bg-gradient-to-bl from-[#EFF8EC]/60 via-transparent to-transparent dark:from-[rgba(0,230,118,0.04)] dark:to-transparent blur-3xl opacity-80" />
        <div className="absolute left-1/3 bottom-1/3 h-[400px] w-[400px] rounded-full bg-[rgba(0,230,118,0.03)] blur-3xl" />
      </div>

      {/* LAYER 3 & 4: Botanical Leaves (4-7 Key Decorative SVG Elements) */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] overflow-hidden">
        
        {/* LEAF 1: Top-Right behind Farmer Image Card */}
        <svg className="absolute -right-6 top-10 h-72 w-72 text-[#B9E6A8] dark:text-[#126247] opacity-20 dark:opacity-35 rotate-12 transition-all duration-300" viewBox="0 0 200 200" fill="currentColor">
          <path d="M100,10 C140,40 180,90 170,140 C160,190 100,195 70,165 C40,135 20,80 50,40 C70,15 90,5 100,10 Z M100,20 Q120,90 75,160" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
        </svg>

        {/* LEAF 2: Right-Center extending outside viewport */}
        <svg className="absolute -right-12 top-[38%] h-80 w-80 text-[#D6F1C8] dark:text-[#0D513C] opacity-25 dark:opacity-40 -rotate-15 blur-[1px]" viewBox="0 0 200 200" fill="currentColor">
          <path d="M120,5 C170,45 190,110 160,160 C130,200 60,185 30,140 C5,95 25,35 75,15 C95,5 110,0 120,5 Z" />
        </svg>

        {/* LEAF 3: Left-Center behind Hero Text Margin (Ultra Faint: opacity 0.06 for readability) */}
        <svg className="absolute -left-10 top-[22%] h-64 w-64 text-[#A8D998] dark:text-[#1B704F] opacity-10 dark:opacity-15 blur-[2px]" viewBox="0 0 200 200" fill="currentColor">
          <path d="M80,15 C130,35 160,85 145,135 C130,185 70,180 40,145 C10,110 20,55 55,25 C65,15 75,10 80,15 Z" />
        </svg>

        {/* LEAF 4: Bottom-Left entering from page edge */}
        <svg className="absolute -left-12 bottom-[14%] h-72 w-72 text-[#B9E6A8] dark:text-[#126247] opacity-20 dark:opacity-30 rotate-25" viewBox="0 0 200 200" fill="currentColor">
          <path d="M110,10 C155,45 175,100 150,150 C125,195 55,185 30,135 C5,85 30,30 80,15 Z" />
        </svg>

        {/* LEAF 5: Bottom-Right near stats & landscape transition */}
        <svg className="absolute -right-8 bottom-[18%] h-64 w-64 text-[#A8D998] dark:text-[#0D513C] opacity-18 dark:opacity-30 -rotate-10" viewBox="0 0 200 200" fill="currentColor">
          <path d="M90,20 C135,45 165,95 145,145 C125,190 65,180 35,140 C5,100 20,45 65,20 Z" />
        </svg>
      </div>

      {/* =========================================================
          LAYER 6: HERO SECTION (Reference Image Visual Geometry)
      ========================================================= */}
      <section className="landing-hero relative z-10 isolate overflow-hidden pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className="relative mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 items-center gap-10 lg:grid-cols-2 lg:gap-14">
            
            {/* Left Hero Text Column */}
            <div className="relative z-10 max-w-[620px]">
              <p className="mb-4 text-xs sm:text-sm font-black uppercase tracking-[0.25em] text-[var(--accent)]">
                {t('landing.heroEyebrow', { defaultValue: 'FRESHER. FAIRER. TOGETHER.' })}
              </p>

              <h1 className="text-4xl sm:text-5xl lg:text-[3.5rem] font-extrabold leading-[1.08] tracking-tight text-[var(--text-primary)]">
                {t('landing.heroTitle', { defaultValue: 'Connecting farmers to' })}
                <span className="block text-[var(--primary)] font-black mt-1">
                  {t('landing.heroHighlight', { defaultValue: 'better markets.' })}
                </span>
              </h1>

              <p className="mt-6 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
                {t('landing.heroDescription', { defaultValue: 'Empowering Indian agriculture with a direct digital marketplace. Buy and sell fresh produce with verified quality, zero commission markups, and transparent delivery tracking.' })}
              </p>

              <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center">
                <Link
                  to="/marketplace"
                  className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full bg-[var(--primary)] hover:bg-[var(--primary-hover)] px-8 text-base font-extrabold text-[var(--primary-contrast)] shadow-md transition-all hover:scale-[1.02] hover:shadow-lg"
                >
                  {t('landing.exploreMarketplace', { defaultValue: 'Explore Marketplace' })}
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/register"
                  className="inline-flex min-h-[52px] items-center justify-center rounded-full border-2 border-[var(--text-primary)] bg-transparent px-8 text-base font-extrabold text-[var(--text-primary)] transition-all hover:bg-[var(--text-primary)]/10"
                >
                  {t('landing.joinFarmer', { defaultValue: 'Join as Farmer / FPO' })}
                </Link>
              </div>
            </div>

            {/* Right Hero Image Card with Background Botanical Integration */}
            <div className="relative mx-auto w-full max-w-[540px]">
              {/* Organic Green Blob & Dotted Background Integration behind Card */}
              <div aria-hidden="true" className="pointer-events-none absolute -inset-4 rounded-[40px] bg-gradient-to-tr from-[rgba(0,230,118,0.12)] via-transparent to-transparent blur-xl" />

              {/* Main Portrait Farmer Image Container */}
              <div className="relative h-[460px] sm:h-[520px] w-full overflow-hidden rounded-[32px] border-4 border-[var(--surface)] bg-[var(--surface)] shadow-2xl z-10">
                <img
                  src={heroFarmerImage}
                  alt={t('landing.heroImageAlt', { defaultValue: 'Indian farmer in a farm field holding fresh produce' })}
                  className="h-full w-full object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />
              </div>

              {/* Top Left Badge Pill: Verified Fresh Produce */}
              <div className="absolute left-3 top-4 z-20 flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3.5 py-1.5 shadow-md backdrop-blur">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[var(--primary)] text-[var(--primary-contrast)]">
                  <Leaf className="h-3.5 w-3.5" />
                </span>
                <span className="text-[11px] font-black uppercase tracking-wider text-[var(--text-primary)]">
                  {t('landing.verifiedFresh', { defaultValue: 'VERIFIED FRESH PRODUCE' })}
                </span>
              </div>

              {/* Bottom Left Badge Pill: 0% Commission Markups */}
              <div className="absolute bottom-[4.75rem] left-3 right-3 z-20 flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-3.5 py-2.5 shadow-lg backdrop-blur sm:bottom-4 sm:right-auto">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--surface-elevated)] text-[var(--primary)]">
                  <ShieldCheck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black text-[var(--text-primary)]">
                    {t('landing.zeroCommission', { defaultValue: '0% Commission' })}
                  </p>
                  <p className="text-[10px] font-bold text-[var(--text-secondary)]">
                    {t('landing.zeroCommissionSub', { defaultValue: 'Markups' })}
                  </p>
                </div>
              </div>

              {/* Bottom Right Badge Pill: Farm to Market Faster & Fairer */}
              <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[#06251E] dark:bg-[#002B22] px-3.5 py-2.5 text-white shadow-xl sm:bottom-4 sm:left-auto">
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--primary)] text-[var(--primary-contrast)]">
                  <Truck className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <p className="text-xs font-black leading-tight text-white">
                    {t('landing.farmToMarket', { defaultValue: 'Farm to Market' })}
                  </p>
                  <p className="text-[10px] font-semibold text-emerald-300">
                    {t('landing.fasterFairer', { defaultValue: 'Faster & Fairer' })}
                  </p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* =========================================================
          STATISTICS OVERLAP STRIP (Overlapping Floating Container)
      ========================================================= */}
      <section className="landing-stats relative z-20 -mt-10 sm:-mt-12 lg:-mt-14 px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-[1280px] rounded-3xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 shadow-xl backdrop-blur-sm">
          <div className="grid grid-cols-1 divide-y divide-[var(--border)] sm:grid-cols-3 sm:divide-y-0 sm:divide-x">
            {heroMetrics.map((metric) => (
              <div key={metric.label} className="flex items-center justify-center gap-4 py-3 sm:py-2 px-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[var(--surface)] text-[var(--primary)] shadow-sm">
                  <metric.icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-black tracking-tight text-[var(--text-primary)]">
                    {metric.value}
                  </p>
                  <p className="text-[10px] font-extrabold uppercase tracking-widest text-[var(--text-secondary)]">
                    {metric.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          3 FEATURE CARDS GRID (Reference Image Visual Geometry)
      ========================================================= */}
      <section className="landing-benefits relative z-10 py-14 sm:py-20">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featureCards.map((card) => (
              <article
                key={card.title}
                className="group relative flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-[var(--primary)] hover:shadow-lg"
              >
                <div>
                  {/* Top Circle Icon Badge */}
                  <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--surface-elevated)] text-[var(--primary)]">
                    <card.icon className="h-6 w-6" />
                  </div>

                  <h3 className="text-xl font-extrabold text-[var(--text-primary)]">
                    {card.title}
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)]">
                    {card.desc}
                  </p>
                </div>

                <div className="mt-8 flex items-center justify-between">
                  {/* Circle Arrow Action Button */}
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] text-[var(--text-primary)] transition-colors group-hover:border-[var(--primary)] group-hover:bg-[var(--primary)] group-hover:text-[var(--primary-contrast)]">
                    <ArrowRight className="h-5 w-5" />
                  </span>

                  {/* Bottom Right Support Illustration Badge */}
                  <div>
                    {card.illustration}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FEATURED MARKETPLACE CROPS (Live DB Data)
      ========================================================= */}
      {featuredProducts.length > 0 && (
        <section className="landing-products relative z-10 border-t border-[var(--border)] py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
            <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <span className="inline-flex rounded-full bg-[var(--surface-elevated)] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[var(--primary)]">
                  {t('home.marketplace.exchange', { defaultValue: 'Direct Farm Exchange' })}
                </span>
                <h2 className="mt-3 text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
                  {t('marketplace.title', { defaultValue: 'Featured Produce' })}
                </h2>
                <p className="mt-2 text-base text-[var(--text-secondary)]">
                  {t('home.marketplace.description', { defaultValue: 'Verified fresh crops direct from Indian farms with 0% middleman markup.' })}
                </p>
              </div>
              <Link
                to="/marketplace"
                className="inline-flex items-center gap-2 font-extrabold text-[var(--primary)] transition hover:gap-3"
              >
                {t('home.browse', { defaultValue: 'Browse All Crops' })} <ArrowRight className="h-4 w-4" />
              </Link>
            </header>

            <div className="grid grid-cols-1 gap-4 min-[460px]:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} compact onAddToCart={handleAddToCart} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          HOW AGRIBAZAAR WORKS
      ========================================================= */}
      <section className="relative z-10 border-t border-[var(--border)] bg-[var(--surface)] py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-[var(--surface-elevated)] px-4 py-1.5 text-xs font-black uppercase tracking-wider text-[var(--primary)]">
              {t('home.workflow', { defaultValue: 'Platform Workflow' })}
            </span>
            <h2 className="mt-4 text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl lg:text-5xl">
              {t('home.workflowTitle', { defaultValue: 'How AgriBazaar Works' })}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-[var(--text-secondary)]">
              {t('home.workflowDescription', { defaultValue: 'Streamlined direct commerce for farmers and commercial buyers across India.' })}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* FARMERS */}
            <article className="rounded-3xl bg-[#06251E] dark:bg-[#041F19] p-8 text-white shadow-xl sm:p-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[#00ED64]/15 border border-[#00ED64]/30 px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[#00ED64]">
                <Leaf className="h-4 w-4" />
                {t('home.farmers', { defaultValue: 'For Farmers & FPOs' })}
              </div>
              <div className="space-y-6">
                {farmerSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#00ED64] text-sm font-black text-[#002B36]">
                      {idx + 1}
                    </span>
                    <p className="pt-1 text-base sm:text-lg font-medium text-gray-200">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* BUYERS */}
            <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-8 text-[var(--text-primary)] shadow-xl sm:p-10">
              <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-[var(--surface-elevated)] px-4 py-2 text-xs font-extrabold uppercase tracking-wider text-[var(--primary)]">
                <ShoppingBag className="h-4 w-4" />
                {t('home.buyers', { defaultValue: 'For Commercial Buyers' })}
              </div>
              <div className="space-y-6">
                {buyerSteps.map((step, idx) => (
                  <div key={idx} className="flex items-start gap-4">
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--primary)] text-sm font-black text-[var(--primary-contrast)]">
                      {idx + 1}
                    </span>
                    <p className="pt-1 text-base sm:text-lg font-medium text-[var(--text-secondary)]">
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="relative z-10 py-16 sm:py-24">
        <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <header className="mx-auto mb-12 max-w-2xl text-center">
            <h2 className="text-3xl font-extrabold text-[var(--text-primary)] sm:text-4xl">
              {t('home.testimonials', { defaultValue: 'Trusted Across Agriculture' })}
            </h2>
            <p className="mt-4 text-base text-[var(--text-secondary)] sm:text-lg">
              {t('home.testimonialsDescription', { defaultValue: 'Hear from verified farmers, FPOs, and commercial buyers using AgriBazaar.' })}
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {testimonials.map((item) => (
              <article
                key={item.name}
                className="flex flex-col justify-between rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-7 shadow-sm transition hover:shadow-md"
              >
                <div>
                  <div className="mb-4 flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 fill-current" />
                    ))}
                  </div>
                  <p className="text-base italic leading-relaxed text-[var(--text-secondary)]">
                    “{item.quote}”
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-3 border-t border-[var(--border)] pt-4">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="h-12 w-12 rounded-full border-2 border-[var(--primary)] object-cover"
                  />
                  <div>
                    <p className="font-extrabold text-[var(--text-primary)]">{item.name}</p>
                    <p className="text-xs text-[var(--text-secondary)]">{item.role}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          LAYER 5: FULL AGRICULTURAL LANDSCAPE AT BOTTOM (Layers 11-17)
      ========================================================= */}
      <div aria-hidden="true" className="pointer-events-none relative z-2 w-full overflow-hidden">
        
        {/* Soft fade gradient mask transitioning into landscape */}
        <div className="h-16 w-full bg-gradient-to-b from-[var(--background)] to-transparent" />

        <div className="relative w-full h-44 sm:h-64">
          
          {/* Distant Hills Layer */}
          <svg className="absolute bottom-0 w-full h-36 sm:h-52 text-[#A4C994] dark:text-[#06271F] opacity-50 dark:opacity-70" viewBox="0 0 1440 220" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,160 Q240,80 480,140 Q720,60 960,130 Q1200,90 1440,150 L1440,220 L0,220 Z"/>
          </svg>

          {/* Curved Field Rows & Middleground Farmland Layer */}
          <svg className="absolute bottom-0 w-full h-28 sm:h-40 text-[#81B271] dark:text-[#083126] opacity-75 dark:opacity-85" viewBox="0 0 1440 180" fill="currentColor" preserveAspectRatio="none">
            <path d="M0,100 C300,140 600,70 900,120 C1200,160 1350,90 1440,110 L1440,180 L0,180 Z"/>
            {/* Field rows diagonal lines */}
            <path d="M100,180 L250,110 M300,180 L420,115 M500,180 L600,125 M800,180 L920,130 M1100,180 L1220,125" stroke="currentColor" strokeWidth="1.5" opacity="0.3"/>
          </svg>

          {/* Rural Village Houses Silhouettes & Foreground Farmland Layer */}
          <svg className="absolute bottom-0 w-full h-20 sm:h-32 text-[#548E44] dark:text-[#0A3A2C] opacity-95" viewBox="0 0 1440 140" fill="currentColor" preserveAspectRatio="none">
            {/* House 1 */}
            <path d="M320,80 L320,65 L335,55 L350,65 L350,80 Z" className="fill-[#FBFAF2] dark:fill-[#124533]"/>
            <path d="M318,65 L335,52 L352,65 Z" className="fill-[#D4A373] dark:fill-[#06271F]"/>
            <circle cx="335" cy="72" r="2" className="fill-transparent dark:fill-[#F3B927]"/>

            {/* House 2 */}
            <path d="M360,82 L360,70 L372,62 L384,70 L384,82 Z" className="fill-[#FBFAF2] dark:fill-[#124533]"/>
            <path d="M358,70 L372,60 L386,70 Z" className="fill-[#CCD5AE] dark:fill-[#06271F]"/>

            {/* House 3 (Right side village) */}
            <path d="M1080,85 L1080,70 L1095,60 L1110,70 L1110,85 Z" className="fill-[#FBFAF2] dark:fill-[#124533]"/>
            <path d="M1078,70 L1095,58 L1112,70 Z" className="fill-[#FAEDCD] dark:fill-[#06271F]"/>
            <circle cx="1095" cy="75" r="2" className="fill-transparent dark:fill-[#F3B927]"/>

            {/* Trees Clusters */}
            <path d="M120,90 Q125,70 135,70 Q145,70 150,90 Z M145,92 Q152,75 160,75 Q168,75 175,92 Z" className="fill-[#2D5A27] dark:fill-[#05251D]"/>
            <path d="M920,88 Q928,68 938,68 Q948,68 956,88 Z" className="fill-[#2D5A27] dark:fill-[#05251D]"/>

            {/* Rolling Foreground Earth */}
            <path d="M0,60 C240,90 520,40 800,75 C1080,110 1300,50 1440,70 L1440,140 L0,140 Z"/>
          </svg>

          {/* Foreground Corner Leaves (Layer 17) */}
          <svg className="absolute bottom-0 -left-6 h-28 w-28 text-[#3B6E2E] dark:text-[#06271F] opacity-60 dark:opacity-80 rotate-45" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,5 C75,25 90,55 75,85 C60,105 20,95 10,70 C0,45 20,15 50,5 Z"/>
          </svg>

          <svg className="absolute bottom-0 -right-6 h-28 w-28 text-[#3B6E2E] dark:text-[#06271F] opacity-60 dark:opacity-80 -rotate-45" viewBox="0 0 100 100" fill="currentColor">
            <path d="M50,5 C75,25 90,55 75,85 C60,105 20,95 10,70 C0,45 20,15 50,5 Z"/>
          </svg>

        </div>
      </div>

    </main>
  );
}

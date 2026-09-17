import { Link } from 'react-router-dom';
import {
  ArrowRight,
  BadgeCheck,
  ShieldCheck,
  Truck,
  CreditCard,
  ShoppingBag,
  Leaf,
  Users,
  Package,
  Star,
  CheckCircle,
  BarChart3,
} from 'lucide-react';

export default function Landing() {
  const trustItems = [
    {
      icon: BadgeCheck,
      label: 'Verified Farmers',
      desc: 'KYC-checked agricultural sellers with direct identity verification.',
    },
    {
      icon: ShieldCheck,
      label: 'Transparent Orders',
      desc: 'End-to-end real-time tracking from field dispatch to delivery.',
    },
    {
      icon: CreditCard,
      label: 'Secure Payments',
      desc: 'Encrypted payment gateway supporting UPI, Net Banking & Cards.',
    },
    {
      icon: Truck,
      label: 'Reliable Delivery',
      desc: 'Dedicated farm transport logistics for fresh produce preservation.',
    },
  ];

  const farmerSteps = [
    'Register your farm or FPO profile with KYC documents',
    'Get verified by platform administration within 24 hours',
    'Create produce listings with custom quantities & pricing',
    'Receive and manage purchase orders directly from buyers',
    'Track instant payouts & scale your direct agricultural sales',
  ];

  const buyerSteps = [
    'Create a buyer account (Individual consumer or Commercial enterprise)',
    'Search & filter verified agricultural produce by crop, region & price',
    'Add items to cart and review transparent cost breakdown',
    'Make secure payment via preferred payment gateway',
    'Track real-time shipment & direct farm delivery status',
  ];

  const platformStats = [
    { icon: Users, value: '500+', label: 'REGISTERED FARMERS' },
    { icon: Package, value: '2,000+', label: 'CROP LISTINGS' },
    { icon: ShoppingBag, value: '10,000+', label: 'SUCCESSFUL ORDERS' },
    { icon: Leaf, value: '8', label: 'CROP CATEGORIES' },
  ];

  const testimonials = [
    {
      avatar:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop',
      quote:
        'AgriBazaar helped me get better prices for my produce and reach buyers directly. Truly a game changer for our regional farm community!',
      name: 'Ramesh Patil',
      role: 'Farmer, Maharashtra',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop',
      quote:
        'Fresh quality produce straight from verified farms, transparent pricing and smooth delivery. Highly recommended for commercial sourcing!',
      name: 'Amit Shah',
      role: 'Restaurant Owner, Mumbai',
    },
    {
      avatar:
        'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&h=150&fit=crop',
      quote:
        'A reliable platform that supports farmers directly and brings real transparency to the entire agricultural marketplace.',
      name: 'Priya Desai',
      role: 'FPO Member, Gujarat',
    },
  ];

  const heroMetrics = [
    {
      icon: Users,
      value: '500+',
      label: 'VERIFIED FARMERS',
    },
    {
      icon: BarChart3,
      value: '₹2Cr+',
      label: 'TRADE VOLUME',
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: 'DIRECT SETTLEMENT',
    },
  ];

  return (
    <main className="w-full overflow-x-hidden bg-[#F7F9F3] text-[#082B36]">

      {/* =========================================================
          HERO SECTION
      ========================================================= */}
      <section className="border-b border-[#E2E8E5] bg-[#F7F9F3]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1480px]
            px-5
            py-10
            sm:px-7
            sm:py-14
            lg:px-10
            lg:py-16
            xl:px-12
            xl:py-18
          "
        >
          <div
            className="
              grid
              grid-cols-1
              items-start
              gap-10
              lg:grid-cols-[minmax(0,1.2fr)_minmax(440px,0.8fr)]
              lg:gap-12
              xl:grid-cols-[minmax(0,1.22fr)_minmax(470px,0.78fr)]
              xl:gap-16
            "
          >

            {/* =====================================================
                LEFT HERO CONTENT
            ===================================================== */}
            <div className="min-w-0 pt-2 lg:pt-8 xl:pt-10">

              {/* Eyebrow */}
              <p
                className="
                  mb-4
                  text-xs
                  font-extrabold
                  uppercase
                  tracking-[0.18em]
                  text-[#00C853]
                  sm:text-sm
                "
              >
                FRESHER. FAIRER. TOGETHER.
              </p>

              {/* Main Heading */}
              <h1
                className="
                  mb-6
                  max-w-[900px]
                  text-[clamp(3rem,5.2vw,5.4rem)]
                  font-black
                  leading-[0.96]
                  tracking-[-0.05em]
                  text-[#082B36]
                "
              >
                CONNECTING FARMERS TO{' '}
                <span className="block text-[#00E676]">
                  BETTER MARKETS.
                </span>
              </h1>

              {/* Description */}
              <p
                className="
                  mb-7
                  max-w-[760px]
                  text-base
                  leading-7
                  text-[#52636A]
                  sm:text-lg
                  sm:leading-8
                  lg:text-xl
                "
              >
                Empowering Indian agriculture with a direct digital marketplace.
                Buy and sell fresh produce with verified quality, zero
                commission markups, and transparent delivery tracking.
              </p>

              {/* Buttons */}
              <div
                className="
                  mb-9
                  flex
                  flex-col
                  gap-3
                  sm:flex-row
                  sm:flex-wrap
                "
              >
                <Link
                  to="/marketplace"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    gap-2
                    rounded-full
                    bg-[#00E676]
                    px-7
                    py-3.5
                    text-base
                    font-bold
                    text-[#002B36]
                    transition
                    hover:bg-[#00C853]
                  "
                >
                  Explore Marketplace
                  <ArrowRight className="h-5 w-5" />
                </Link>

                <Link
                  to="/register"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-[#D9E2DE]
                    bg-white
                    px-7
                    py-3.5
                    text-base
                    font-bold
                    text-[#082B36]
                    transition
                    hover:border-[#00C853]
                    hover:bg-[#FAFFFC]
                  "
                >
                  Join as Farmer / FPO
                </Link>
              </div>

              {/* ===================================================
                  HERO METRICS
              =================================================== */}
              <div
                className="
                  grid
                  grid-cols-1
                  border-t
                  border-[#DCE5E1]
                  pt-6
                  sm:grid-cols-3
                  sm:gap-5
                "
              >
                {heroMetrics.map((metric) => (
                  <div
                    key={metric.label}
                    className="
                      flex
                      items-center
                      gap-3
                      py-2
                      sm:py-0
                    "
                  >
                    <div
                      className="
                        flex
                        h-11
                        w-11
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#E8F5E9]
                        text-[#00C853]
                      "
                    >
                      <metric.icon className="h-5 w-5" />
                    </div>

                    <div className="min-w-0">
                      <p
                        className="
                          text-2xl
                          font-black
                          tracking-tight
                          text-[#082B36]
                          sm:text-3xl
                        "
                      >
                        {metric.value}
                      </p>

                      <p
                        className="
                          mt-0.5
                          text-[10px]
                          font-bold
                          uppercase
                          tracking-[0.1em]
                          text-[#6B7A80]
                          sm:text-xs
                        "
                      >
                        {metric.label}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* =====================================================
                RIGHT HERO IMAGE
            ===================================================== */}
            <div className="relative min-w-0">

              <div
                className="
                  relative
                  mx-auto
                  w-full
                  max-w-[540px]
                  overflow-hidden
                  rounded-[30px]
                  border-4
                  border-white
                  bg-white
                  shadow-[0_22px_55px_rgba(8,43,54,0.16)]
                  lg:ml-auto
                "
              >

                {/* IMPORTANT:
                    Shorter image than previous version.
                    This prevents huge vertical whitespace on left.
                */}
                <div
                  className="
                    h-[500px]
                    w-full
                    sm:h-[540px]
                    lg:h-[570px]
                    xl:h-[590px]
                  "
                >
                  <img
                    src="https://images.unsplash.com/photo-1595273670150-bd0c3c392e46?w=900&h=1100&fit=crop"
                    alt="Indian Farmer in Farm Field"
                    className="h-full w-full object-cover"
                  />
                </div>

                {/* Top Floating Badge */}
                <div
                  className="
                    absolute
                    left-4
                    top-4
                    max-w-[225px]
                    rounded-2xl
                    border
                    border-[#E2E8E5]
                    bg-white/95
                    p-3.5
                    shadow-xl
                    backdrop-blur-md
                    sm:left-5
                    sm:top-5
                    sm:p-4
                  "
                >
                  <div className="mb-3 flex items-center gap-2.5">

                    <div
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#00E676]
                        text-[#002B36]
                      "
                    >
                      <Leaf className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-[#082B36]">
                        Fresh Produce
                      </p>

                      <p className="text-xs text-gray-500">
                        Direct from Farms
                      </p>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs font-semibold text-[#00C853]">

                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      Verified Farmers
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      Quality Assured
                    </div>

                    <div className="flex items-center gap-1.5">
                      <CheckCircle className="h-4 w-4 shrink-0" />
                      Transparent Pricing
                    </div>

                  </div>
                </div>

                {/* Bottom Floating Badge */}
                <div
                  className="
                    absolute
                    bottom-4
                    right-4
                    flex
                    items-center
                    gap-2.5
                    rounded-xl
                    bg-[#002B36]
                    p-3
                    text-white
                    shadow-xl
                    sm:bottom-5
                    sm:right-5
                    sm:p-3.5
                  "
                >
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-lg
                      bg-[#00E676]
                      text-[#002B36]
                    "
                  >
                    <Truck className="h-5 w-5" />
                  </div>

                  <div>
                    <p className="text-sm font-bold">
                      Farm to Market
                    </p>

                    <p className="text-xs text-gray-300">
                      Faster & Fairer
                    </p>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          TRUST FEATURES
      ========================================================= */}
      <section className="bg-white">
        <div
          className="
            mx-auto
            w-full
            max-w-[1480px]
            px-5
            py-8
            sm:px-7
            sm:py-10
            lg:px-10
            lg:py-12
            xl:px-12
          "
        >
          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-5
            "
          >
            {trustItems.map((item) => (
              <article
                key={item.label}
                className="
                  min-w-0
                  rounded-2xl
                  border
                  border-[#E2E8E5]
                  bg-[#FBFCF9]
                  p-6
                  shadow-sm
                  transition
                  hover:border-[#00E676]
                  hover:bg-white
                  hover:shadow-md
                "
              >
                <div
                  className="
                    mb-5
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#E8F5E9]
                    text-[#00C853]
                  "
                >
                  <item.icon className="h-6 w-6" />
                </div>

                <h3 className="text-lg font-extrabold text-[#082B36]">
                  {item.label}
                </h3>

                <p className="mt-2 text-sm leading-6 text-[#63747A]">
                  {item.desc}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          HOW AGRIBAZAAR WORKS
      ========================================================= */}
      <section className="border-y border-[#E2E8E5] bg-[#F7F9F3]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
            px-5
            py-16
            sm:px-7
            sm:py-20
            lg:px-8
            lg:py-24
          "
        >
          <header className="mx-auto mb-12 max-w-3xl text-center">

            <span
              className="
                inline-flex
                rounded-full
                border
                border-[#00E676]/30
                bg-[#00E676]/15
                px-4
                py-1.5
                text-xs
                font-extrabold
                uppercase
                tracking-[0.14em]
                text-[#00C853]
              "
            >
              SIMPLE WORKFLOW
            </span>

            <h2
              className="
                mt-4
                text-3xl
                font-black
                tracking-tight
                text-[#082B36]
                sm:text-4xl
                lg:text-5xl
              "
            >
              How AgriBazaar Works
            </h2>

            <p
              className="
                mt-4
                text-base
                leading-7
                text-[#63747A]
                sm:text-lg
              "
            >
              Direct connection between agricultural producers and bulk or
              retail buyers.
            </p>
          </header>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8">

            {/* FARMERS */}
            <article
              className="
                min-w-0
                rounded-3xl
                bg-[#002B36]
                p-7
                text-white
                shadow-lg
                sm:p-9
                lg:p-10
              "
            >
              <div
                className="
                  mb-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#00E676]/30
                  bg-[#00E676]/15
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#00E676]
                "
              >
                <Leaf className="h-4 w-4" />
                FOR FARMERS & FPOs
              </div>

              <div className="space-y-5">
                {farmerSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-4"
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#00E676]
                        text-sm
                        font-black
                        text-[#002B36]
                      "
                    >
                      {index + 1}
                    </span>

                    <p
                      className="
                        pt-1
                        text-base
                        font-medium
                        leading-7
                        text-gray-200
                        sm:text-lg
                      "
                    >
                      {step}
                    </p>
                  </div>
                ))}
              </div>
            </article>

            {/* BUYERS */}
            <article
              className="
                min-w-0
                rounded-3xl
                border
                border-[#E2E8E5]
                bg-white
                p-7
                text-[#082B36]
                shadow-lg
                sm:p-9
                lg:p-10
              "
            >
              <div
                className="
                  mb-7
                  inline-flex
                  items-center
                  gap-2
                  rounded-full
                  border
                  border-[#00C853]/20
                  bg-[#E8F5E9]
                  px-4
                  py-2
                  text-xs
                  font-bold
                  uppercase
                  tracking-wider
                  text-[#00C853]
                "
              >
                <ShoppingBag className="h-4 w-4" />
                FOR INDIVIDUAL & WHOLESALE BUYERS
              </div>

              <div className="space-y-5">
                {buyerSteps.map((step, index) => (
                  <div
                    key={step}
                    className="flex items-start gap-4"
                  >
                    <span
                      className="
                        flex
                        h-9
                        w-9
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#00C853]
                        text-sm
                        font-black
                        text-white
                      "
                    >
                      {index + 1}
                    </span>

                    <p
                      className="
                        pt-1
                        text-base
                        font-medium
                        leading-7
                        text-gray-800
                        sm:text-lg
                      "
                    >
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
          PLATFORM STATS
      ========================================================= */}
      <section className="bg-[#002B36] text-white">
        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
            px-5
            py-16
            sm:px-7
            sm:py-20
            lg:px-8
            lg:py-24
          "
        >
          <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                sm:text-4xl
                lg:text-5xl
              "
            >
              Platform at a Glance
            </h2>

            <p
              className="
                mt-4
                text-base
                leading-7
                text-gray-300
                sm:text-lg
              "
            >
              Empowering agricultural commerce with cutting-edge digital
              infrastructure
            </p>
          </header>

          <div
            className="
              grid
              grid-cols-1
              gap-4
              sm:grid-cols-2
              lg:grid-cols-4
              lg:gap-5
            "
          >
            {platformStats.map((stat) => (
              <article
                key={stat.label}
                className="
                  rounded-2xl
                  border
                  border-[#0A5260]
                  bg-[#003846]
                  p-7
                  text-center
                  shadow-lg
                  transition
                  hover:border-[#00E676]
                "
              >
                <div
                  className="
                    mx-auto
                    mb-4
                    flex
                    h-12
                    w-12
                    items-center
                    justify-center
                    rounded-2xl
                    bg-[#00E676]/15
                    text-[#00E676]
                  "
                >
                  <stat.icon className="h-6 w-6" />
                </div>

                <p
                  className="
                    text-4xl
                    font-black
                    tracking-tight
                    text-[#00E676]
                    sm:text-5xl
                  "
                >
                  {stat.value}
                </p>

                <p
                  className="
                    mt-2
                    text-xs
                    font-bold
                    uppercase
                    tracking-[0.12em]
                    text-gray-300
                  "
                >
                  {stat.label}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          TESTIMONIALS
      ========================================================= */}
      <section className="bg-white">
        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
            px-5
            py-16
            sm:px-7
            sm:py-20
            lg:px-8
            lg:py-24
          "
        >
          <header className="mx-auto mb-10 max-w-2xl text-center sm:mb-12">

            <h2
              className="
                text-3xl
                font-black
                tracking-tight
                text-[#082B36]
                sm:text-4xl
                lg:text-5xl
              "
            >
              What Our Users Say
            </h2>

            <p
              className="
                mt-4
                text-base
                leading-7
                text-[#63747A]
                sm:text-lg
              "
            >
              Trusted by farmers, commercial buyers and FPOs across India
            </p>
          </header>

          <div
            className="
              grid
              grid-cols-1
              gap-5
              md:grid-cols-3
              lg:gap-6
            "
          >
            {testimonials.map((testimonial) => (
              <article
                key={testimonial.name}
                className="
                  flex
                  min-w-0
                  flex-col
                  justify-between
                  rounded-2xl
                  border
                  border-[#E2E8E5]
                  bg-[#FBFCF9]
                  p-6
                  shadow-sm
                  transition
                  hover:border-[#00E676]
                  hover:shadow-md
                  sm:p-7
                "
              >
                <div>

                  <div className="mb-4 flex gap-1 text-amber-400">
                    {[...Array(5)].map((_, index) => (
                      <Star
                        key={index}
                        className="h-5 w-5 fill-current"
                      />
                    ))}
                  </div>

                  <p
                    className="
                      text-base
                      italic
                      leading-7
                      text-[#52636A]
                      sm:text-lg
                    "
                  >
                    “{testimonial.quote}”
                  </p>

                </div>

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-3
                    border-t
                    border-[#E2E8E5]
                    pt-5
                  "
                >
                  <img
                    src={testimonial.avatar}
                    alt={testimonial.name}
                    className="
                      h-12
                      w-12
                      shrink-0
                      rounded-full
                      border-2
                      border-[#00E676]
                      object-cover
                    "
                  />

                  <div className="min-w-0">
                    <p className="font-bold text-[#082B36]">
                      {testimonial.name}
                    </p>

                    <p className="text-sm text-[#718087]">
                      {testimonial.role}
                    </p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =========================================================
          FINAL CTA
      ========================================================= */}
      <section className="bg-[#F7F9F3]">
        <div
          className="
            mx-auto
            w-full
            max-w-[1280px]
            px-5
            py-12
            sm:px-7
            sm:py-16
            lg:px-8
            lg:py-20
          "
        >
          <div
            className="
              relative
              overflow-hidden
              rounded-3xl
              bg-[#002B36]
              px-6
              py-12
              text-white
              shadow-2xl
              sm:px-10
              sm:py-14
              lg:px-14
              lg:py-16
            "
          >

            <div className="absolute inset-0 opacity-20">
              <img
                src="https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=1200&h=500&fit=crop"
                alt=""
                aria-hidden="true"
                className="h-full w-full object-cover"
              />
            </div>

            <div
              className="
                relative
                z-10
                flex
                flex-col
                gap-8
                lg:flex-row
                lg:items-center
                lg:justify-between
              "
            >
              <div className="max-w-2xl">

                <h2
                  className="
                    text-3xl
                    font-black
                    tracking-tight
                    sm:text-4xl
                    lg:text-5xl
                  "
                >
                  Ready to Trade on AgriBazaar?
                </h2>

                <p
                  className="
                    mt-4
                    text-base
                    leading-7
                    text-gray-300
                    sm:text-lg
                  "
                >
                  Join thousands of verified farmers, FPOs, and buyers
                  transforming direct agricultural commerce across India today.
                </p>

              </div>

              <div
                className="
                  flex
                  shrink-0
                  flex-col
                  gap-3
                  sm:flex-row
                "
              >
                <Link
                  to="/register"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    rounded-full
                    bg-[#00E676]
                    px-7
                    py-3.5
                    font-bold
                    text-[#002B36]
                    transition
                    hover:bg-[#00C853]
                  "
                >
                  Create Free Account
                </Link>

                <Link
                  to="/marketplace"
                  className="
                    inline-flex
                    min-h-12
                    items-center
                    justify-center
                    rounded-full
                    border
                    border-white/40
                    px-7
                    py-3.5
                    font-bold
                    text-white
                    transition
                    hover:bg-white/10
                  "
                >
                  Browse Marketplace
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import heroFarmerImage from '../assets/image.png';
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
  const { t } = useTranslation();
  const trustItems = [BadgeCheck, ShieldCheck, CreditCard, Truck].map((icon, index) => ({
    icon, label: t(`home.trust.${index}`), desc: t(`home.trustDescription.${index}`),
  }));
  const farmerSteps = t('home.farmerSteps', { returnObjects: true });
  const buyerSteps = t('home.buyerSteps', { returnObjects: true });

  const platformStats = [
    { icon: Users, value: '500+', label: t('home.platformLabels.0') },
    { icon: Package, value: '2,000+', label: t('home.platformLabels.1') },
    { icon: ShoppingBag, value: '10,000+', label: t('home.platformLabels.2') },
    { icon: Leaf, value: '8', label: t('home.platformLabels.3') },
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
      label: t('home.heroLabels.0'),
    },
    {
      icon: BarChart3,
      value: '₹2Cr+',
      label: t('home.heroLabels.1'),
    },
    {
      icon: ShieldCheck,
      value: '100%',
      label: t('home.heroLabels.2'),
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
                {t('landing.heroEyebrow')}
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
                {t('landing.heroTitle')}{' '}
                <span className="block text-[#00E676]">
                  {t('landing.heroHighlight')}
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
                {t('landing.heroDescription')}
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
                  {t('landing.exploreMarketplace')}
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
                  {t('landing.joinFarmer')}
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
                    src={heroFarmerImage}
                    alt={t('landing.heroImageAlt')}
                    className="h-full w-full object-cover object-[center_25%]"
                  />
                </div>

                {/* Top Compact Pill Badge (Positioned in sky area away from face) */}
                <div
                  className="
                    absolute
                    left-4
                    top-4
                    flex
                    items-center
                    gap-2
                    rounded-full
                    border
                    border-white/80
                    bg-white/95
                    px-4
                    py-2
                    shadow-lg
                    backdrop-blur-md
                    sm:left-5
                    sm:top-5
                  "
                >
                  <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#00E676] text-[#002B36]">
                    <Leaf className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-black uppercase tracking-wider text-[#082B36]">
                    {t('landing.verifiedFresh')}
                  </span>
                </div>

                {/* Bottom Left Feature Card */}
                <div
                  className="
                    absolute
                    bottom-4
                    left-4
                    hidden
                    items-center
                    gap-2.5
                    rounded-2xl
                    border
                    border-[#E2E8E5]
                    bg-white/95
                    p-3
                    shadow-xl
                    backdrop-blur-md
                    sm:flex
                    sm:p-3.5
                  "
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#E8F5E9] text-[#00C853]">
                    <CheckCircle className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-xs font-extrabold text-[#082B36]">{t('landing.directSourcing')}</p>
                    <p className="text-[11px] font-bold text-[#00C853]">{t('landing.zeroCommission')}</p>
                  </div>
                </div>

                {/* Bottom Right Floating Badge */}
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
                      {t('landing.farmToMarket')}
                    </p>

                    <p className="text-xs text-gray-300">
                      {t('landing.fasterFairer')}
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
              {t('home.workflow')}
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
              {t('home.workflowTitle')}
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
              {t('home.workflowDescription')}
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
                {t('home.farmers')}
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
                {t('home.buyers')}
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
              {t('home.glance')}
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
              {t('home.glanceDescription')}
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
              {t('home.testimonials')}
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
              {t('home.testimonialsDescription')}
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
                  {t('home.finalTitle')}
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
                  {t('home.finalDescription')}
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
                  {t('home.createAccount')}
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
                  {t('home.browse')}
                </Link>
              </div>

            </div>
          </div>
        </div>
      </section>

    </main>
  );
}

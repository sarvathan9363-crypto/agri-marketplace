import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import agriLogo from '../../assets/image copy.png';
import PageContainer from '../ui/PageContainer';
import { useTranslation } from 'react-i18next';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="bg-[#002B36] text-gray-300 border-t border-emerald-950 py-16">
      <PageContainer>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-2.5 mb-4 group">
              <img
                src={agriLogo}
                alt="AgriBazaar Logo"
                className="h-10 w-auto object-contain bg-white/95 rounded-lg p-1 transition-transform group-hover:scale-105"
              />
            </Link>
            <p className="text-sm text-gray-400 leading-relaxed font-sans max-w-sm mb-6">
              {t('footer.brandDescription', { defaultValue: 'Connecting farmers to better markets. Buy fresh agricultural produce directly from trusted farmers and FPOs with full transparency.' })}
            </p>
            <div className="space-y-2.5 text-xs text-gray-300">
              <div className="flex items-center gap-2.5"><Mail className="w-4 h-4 text-[#00E676]" /> support@agribazaar.com</div>
              <div className="flex items-center gap-2.5"><Phone className="w-4 h-4 text-[#00E676]" /> +91 98765 43210</div>
              <div className="flex items-center gap-2.5"><MapPin className="w-4 h-4 text-[#00E676]" /> {t('footer.location', { defaultValue: 'Nashik & Mumbai, India' })}</div>
            </div>
          </div>

          {/* Marketplace */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">{t('footer.marketplace')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/marketplace" className="hover:text-[#00E676] transition-colors">{t('footer.browseCrops')}</Link></li>
              <li><Link to="/marketplace?category=FRUITS" className="hover:text-[#00E676] transition-colors">{t('footer.freshFruits')}</Link></li>
              <li><Link to="/marketplace?category=VEGETABLES" className="hover:text-[#00E676] transition-colors">{t('footer.organicVegetables')}</Link></li>
              <li><Link to="/marketplace?category=GRAINS" className="hover:text-[#00E676] transition-colors">{t('footer.grainsRice')}</Link></li>
              <li><Link to="/marketplace?category=SPICES" className="hover:text-[#00E676] transition-colors">{t('footer.pureSpices')}</Link></li>
            </ul>
          </div>

          {/* Portals */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">{t('footer.portals')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/register" className="hover:text-[#00E676] transition-colors">{t('footer.farmerPortal')}</Link></li>
              <li><Link to="/register" className="hover:text-[#00E676] transition-colors">{t('footer.buyerPortal')}</Link></li>
              <li><Link to="/login" className="hover:text-[#00E676] transition-colors">{t('footer.platformSignIn')}</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">{t('navigation.about')} AgriBazaar</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-extrabold text-sm uppercase tracking-wider mb-4 font-display">{t('footer.support')}</h4>
            <ul className="space-y-2.5 text-xs font-medium">
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">{t('navigation.helpCenter')}</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">{t('footer.verificationProcess')}</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">{t('footer.terms')}</Link></li>
              <li><Link to="/about" className="hover:text-[#00E676] transition-colors">{t('footer.contact')}</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-emerald-950 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-400">© 2026 AgriBazaar. {t('footer.allRightsReserved', { defaultValue: 'All rights reserved.' })}</p>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00E676]" />
            <span className="text-xs text-gray-300 font-bold font-display">{t('footer.engine')}</span>
          </div>
        </div>
      </PageContainer>
    </footer>
  );
}

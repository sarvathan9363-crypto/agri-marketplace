import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, MapPin, BadgeCheck } from 'lucide-react';
import BlockchainAuditBadge from './BlockchainAuditBadge';
import { useTranslation } from 'react-i18next';
import { translateCategory, translateStatus } from '../../utils/enumTranslations';

export default function ProductCard({ product, onAddToCart, compact = false }) {
  const { t, i18n } = useTranslation();
  const imgSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`agri-card agri-card--interactive overflow-hidden bg-[var(--surface)] border-[var(--border)] group flex flex-col justify-between ${compact ? 'rounded-[16px]' : 'rounded-[var(--radius-lg)]'}`}
    >
      <div>
        <Link to={`/marketplace/${product._id}`}>
          <div className={`relative overflow-hidden bg-[var(--surface-elevated)] ${compact ? 'h-36 sm:h-40' : 'h-48'}`}>
            <img
              src={imgSrc}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'; }}
            />
            {!compact && <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-[#002B36]/85 backdrop-blur-md text-[11px] font-extrabold text-[#00E676] rounded-full uppercase tracking-wider font-display">
                {translateCategory(t, product.category)}
              </span>
            </div>}
            {product.farmerVerificationStatus === 'VERIFIED' && (
              <div className={`${compact ? 'top-2 right-2' : 'top-3 right-3'} absolute`}>
                <span className={`flex items-center gap-1 bg-[#00C853] text-white font-bold rounded-full font-display ${compact ? 'px-2 py-1 text-[10px]' : 'px-2.5 py-1 text-[11px]'}`}>
                  <BadgeCheck className="w-3.5 h-3.5 text-[#00E676]" /> {translateStatus(t, 'VERIFIED')}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className={compact ? 'p-4 pb-3' : 'p-5'}>
          <Link to={`/marketplace/${product._id}`}>
            <h3 className={`${compact ? 'text-base' : 'text-lg'} font-extrabold text-[var(--text-primary)] group-hover:text-[var(--primary)] transition-colors line-clamp-1 font-display`}>
              {product.productName}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-1">
            <p className="truncate text-xs font-semibold text-[var(--text-secondary)] font-sans">{product.farmerName}</p>
            {!compact && <BlockchainAuditBadge entityType="LISTING" entityId={product._id} compact={true} />}
          </div>
          {!compact && <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium"><MapPin className="w-3.5 h-3.5 text-[#00C853]" />{product.location}</div>}
        </div>
      </div>

      <div className={`${compact ? 'px-4 pb-4 pt-2' : 'px-5 pb-5 pt-3'} border-t border-[var(--border)] flex items-end justify-between`}>
        <div>
          <p className={`${compact ? 'text-lg' : 'text-xl'} font-black text-[var(--text-primary)] font-display`}>{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.pricePerUnit)}<span className="text-xs text-[var(--text-secondary)] font-normal font-sans">/{product.unit}</span></p>
          {!compact && <p className="text-xs text-[var(--text-secondary)] font-medium">{t('home.marketplace.available', { count: product.quantity, unit: product.unit })}</p>}
        </div>
        {onAddToCart && (
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            className={`${compact ? 'w-9 h-9' : 'w-10 h-10'} bg-[var(--primary)] hover:bg-[var(--primary-hover)] text-[var(--primary-contrast)] rounded-[var(--radius-sm)] flex items-center justify-center shadow-[var(--shadow-sm)] hover:scale-105 transition-all`}
            title={t('marketplace.addToCart')}
            aria-label={t('marketplace.addToCart')}
          >
            <ShoppingCart className={compact ? 'w-4 h-4' : 'w-5 h-5'} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

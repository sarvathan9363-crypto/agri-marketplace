import { Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { ShoppingCart, MapPin, BadgeCheck } from 'lucide-react';
import BlockchainAuditBadge from './BlockchainAuditBadge';
import { useTranslation } from 'react-i18next';
import { translateCategory, translateStatus } from '../../utils/enumTranslations';

export default function ProductCard({ product, onAddToCart }) {
  const { t, i18n } = useTranslation();
  const imgSrc = product.images?.[0] || 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl border border-[#E2E8E5] overflow-hidden shadow-sm hover:shadow-xl hover:border-[#00E676] transition-all duration-300 group flex flex-col justify-between"
    >
      <div>
        <Link to={`/marketplace/${product._id}`}>
          <div className="relative h-48 overflow-hidden bg-gray-100">
            <img
              src={imgSrc}
              alt={product.productName}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560493676-04071c5f467b?w=400'; }}
            />
            <div className="absolute top-3 left-3">
              <span className="px-2.5 py-1 bg-[#002B36]/85 backdrop-blur-md text-[11px] font-extrabold text-[#00E676] rounded-full uppercase tracking-wider font-display">
                {translateCategory(t, product.category)}
              </span>
            </div>
            {product.farmerVerificationStatus === 'VERIFIED' && (
              <div className="absolute top-3 right-3">
                <span className="flex items-center gap-1 px-2.5 py-1 bg-[#00C853] text-white text-[11px] font-bold rounded-full font-display">
                  <BadgeCheck className="w-3.5 h-3.5 text-[#00E676]" /> {translateStatus(t, 'VERIFIED')}
                </span>
              </div>
            )}
          </div>
        </Link>

        <div className="p-5">
          <Link to={`/marketplace/${product._id}`}>
            <h3 className="font-extrabold text-[#082B36] text-lg group-hover:text-[#00C853] transition-colors line-clamp-1 font-display">
              {product.productName}
            </h3>
          </Link>
          <div className="flex items-center justify-between mt-1">
            <p className="text-xs font-semibold text-gray-500 font-sans">{product.farmerName}</p>
            <BlockchainAuditBadge entityType="LISTING" entityId={product._id} compact={true} />
          </div>
          <div className="flex items-center gap-1.5 text-xs text-gray-400 mt-1 font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#00C853]" />
            {product.location}
          </div>
        </div>
      </div>

      <div className="px-5 pb-5 pt-3 border-t border-[#E2E8E5] flex items-end justify-between">
        <div>
          <p className="text-xl font-black text-[#082B36] font-display">{new Intl.NumberFormat(i18n.language, { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(product.pricePerUnit)}<span className="text-xs text-gray-500 font-normal font-sans">/{product.unit}</span></p>
          <p className="text-xs text-gray-500 font-medium">{t('home.marketplace.available', { count: product.quantity, unit: product.unit })}</p>
        </div>
        {onAddToCart && (
          <button
            onClick={(e) => { e.preventDefault(); onAddToCart(product); }}
            className="w-10 h-10 bg-[#00E676] hover:bg-[#00C853] text-[#002B36] rounded-full flex items-center justify-center shadow-md hover:scale-105 transition-all"
            title={t('marketplace.addToCart')}
            aria-label={t('marketplace.addToCart')}
          >
            <ShoppingCart className="w-5 h-5" />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export function Card({ children, className = '', title, subtitle, action }) {
  return (
    <div className={`bg-white rounded-2xl border border-[#E2E8E5] p-6 lg:p-8 shadow-sm ${className}`}>
      {(title || subtitle || action) && (
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-[#E2E8E5]">
          <div>
            {title && <h2 className="text-xl font-extrabold text-[#082B36] font-display">{title}</h2>}
            {subtitle && <p className="text-xs text-gray-500 mt-1 font-sans">{subtitle}</p>}
          </div>
          {action && <div>{action}</div>}
        </div>
      )}
      {children}
    </div>
  );
}

export function StatsCard({ icon: Icon, label, value, trend, color = 'primary' }) {
  const iconColors = {
    primary: 'bg-[#00E676] text-[#002B36]',
    emerald: 'bg-[#00C853] text-white',
    amber: 'bg-amber-100 text-amber-800',
    blue: 'bg-blue-100 text-blue-800',
    rose: 'bg-rose-100 text-rose-800',
    purple: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E2E8E5] p-6 shadow-sm hover:shadow-md hover:border-[#00E676] transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider font-display">{label}</p>
          <p className="text-3xl font-black text-[#082B36] mt-2 font-display">{value}</p>
          {trend && <p className="text-xs font-bold text-[#00C853] mt-2 font-display">{trend}</p>}
        </div>
        {Icon && (
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold shrink-0 ${iconColors[color] || iconColors.primary}`}>
            <Icon className="w-6 h-6" />
          </div>
        )}
      </div>
    </div>
  );
}

export function StatusBadge({ status }) {
  const { t } = useTranslation();
  const styles = {
    ACTIVE: 'bg-[#00E676]/20 text-[#00C853] border-[#00E676]',
    VERIFIED: 'bg-[#00C853] text-white border-[#00C853]',
    DELIVERED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    SUCCESSFUL: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    CAPTURED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    AUTHORIZED: 'bg-blue-100 text-blue-800 border-blue-300',
    RESOLVED: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    PENDING: 'bg-amber-100 text-amber-900 border-amber-300',
    PENDING_VERIFICATION: 'bg-amber-100 text-amber-900 border-amber-300',
    CREATED: 'bg-blue-100 text-blue-800 border-blue-300',
    OPEN: 'bg-blue-100 text-blue-800 border-blue-300',
    CONFIRMED: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    UNDER_REVIEW: 'bg-indigo-100 text-indigo-800 border-indigo-300',
    DISPATCHED: 'bg-purple-100 text-purple-800 border-purple-300',
    CANCELLED: 'bg-red-100 text-red-800 border-red-300',
    REJECTED: 'bg-red-100 text-red-800 border-red-300',
    FAILED: 'bg-red-100 text-red-800 border-red-300',
    INACTIVE: 'bg-gray-100 text-gray-700 border-gray-300',
    DRAFT: 'bg-gray-100 text-gray-700 border-gray-300',
    OUT_OF_STOCK: 'bg-orange-100 text-orange-800 border-orange-300',
    REFUNDED: 'bg-purple-100 text-purple-800 border-purple-300',
  };

  const statusKeys = { ACTIVE: 'active', VERIFIED: 'verified', DELIVERED: 'delivered', SUCCESSFUL: 'successful', CAPTURED: 'captured', AUTHORIZED: 'authorized', RESOLVED: 'resolved', PENDING: 'pending', PENDING_VERIFICATION: 'pendingVerification', CREATED: 'created', OPEN: 'open', CONFIRMED: 'confirmed', UNDER_REVIEW: 'underReview', DISPATCHED: 'dispatched', CANCELLED: 'cancelled', REJECTED: 'rejected', FAILED: 'failed', INACTIVE: 'inactive', DRAFT: 'draft', OUT_OF_STOCK: 'outOfStock', REFUNDED: 'refunded' };
  const rawKey = statusKeys[status];
  const label = rawKey ? t(`status.${rawKey}`, { defaultValue: status }) : (status || t('ui.unknown'));

  return (
    <span className={`inline-flex items-center px-3 py-1 text-[11px] font-black uppercase tracking-wider rounded-full border ${styles[status] || 'bg-gray-100 text-gray-700 border-gray-300'} font-display`}>
      {label}
    </span>
  );
}

export function LoadingState({ message = 'Loading content...' }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="w-12 h-12 border-4 border-gray-200 border-t-[#00E676] rounded-full animate-spin" />
      <p className="mt-4 text-sm font-bold text-[#082B36] font-display">{message === 'Loading content...' ? t('ui.loadingContent') : message}</p>
    </div>
  );
}

export function EmptyState({ icon: Icon, title = 'No items found', description, action }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 px-4 text-center bg-white rounded-2xl border border-[#E2E8E5]">
      {Icon && (
        <div className="w-16 h-16 bg-[#E8F5E9] text-[#00C853] rounded-2xl flex items-center justify-center mb-4">
          <Icon className="w-8 h-8" />
        </div>
      )}
      <h3 className="text-xl font-extrabold text-[#082B36] font-display">{title === 'No items found' ? t('ui.noItems') : title}</h3>
      {description && <p className="text-sm text-gray-500 mt-2 max-w-md font-sans">{description}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}

export function ErrorState({ message = 'Something went wrong.', onRetry }) {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-2xl border border-red-200 p-8">
      <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-4 text-2xl font-bold">
        ⚠️
      </div>
      <h3 className="text-xl font-extrabold text-[#082B36] font-display">{t('ui.error')}</h3>
      <p className="text-sm text-gray-500 mt-2 font-sans">{message}</p>
      {onRetry && (
        <button onClick={onRetry} className="mt-6 btn-agri-primary text-sm px-6 py-2.5">
          {t('ui.tryAgain')}
        </button>
      )}
    </div>
  );
}

import { useTranslation } from 'react-i18next';

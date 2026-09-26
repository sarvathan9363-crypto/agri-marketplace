/**
 * AgriBazaar Centralized Enum Translation Utilities
 * Safely maps any raw enum/status string (e.g. "PENDING_PAYMENT", "FARMER", "VEGETABLES", "KG")
 * to its localized string using i18next t().
 */

export function translateStatus(t, status) {
  if (!status) return t('ui.unknown', { defaultValue: 'Unknown' });
  const normalized = String(status).toUpperCase();

  const map = {
    ACTIVE: 'status.active',
    VERIFIED: 'status.verified',
    DELIVERED: 'status.delivered',
    SUCCESSFUL: 'status.successful',
    CAPTURED: 'status.captured',
    AUTHORIZED: 'status.authorized',
    RESOLVED: 'status.resolved',
    PENDING: 'status.pending',
    PENDING_PAYMENT: 'status.pendingPayment',
    PENDING_VERIFICATION: 'status.pendingVerification',
    CREATED: 'status.created',
    OPEN: 'status.open',
    CONFIRMED: 'status.confirmed',
    UNDER_REVIEW: 'status.underReview',
    DISPATCHED: 'status.dispatched',
    CANCELLED: 'status.cancelled',
    REJECTED: 'status.rejected',
    FAILED: 'status.failed',
    INACTIVE: 'status.inactive',
    DRAFT: 'status.draft',
    OUT_OF_STOCK: 'status.outOfStock',
    REFUNDED: 'status.refunded',
    PAID: 'status.paid',
    PROCESSING: 'status.processing',
    SHIPPED: 'status.shipped',
    COMPLETED: 'status.completed',
    ONBOARDING: 'status.onboarding',
    SUSPENDED: 'status.suspended',
    NOT_STARTED: 'status.notStarted',
    IN_PROGRESS: 'status.inProgress',
    APPROVED: 'status.approved',
  };

  const key = map[normalized];
  if (key) {
    const res = t(key);
    if (res && res !== key) return res;
  }
  const formatted = normalized.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  return formatted;
}

export function translateRole(t, role) {
  if (!role) return '';
  const normalized = String(role).toUpperCase();

  const map = {
    FARMER: 'roles.farmer',
    FPO: 'roles.fpo',
    INDIVIDUAL: 'roles.individual',
    BUSINESS: 'roles.business',
    BULK_BUYER: 'roles.bulkBuyer',
    RETAIL_BUYER: 'roles.retailBuyer',
    WHOLESALER: 'roles.wholesaler',
    BUYER: 'roles.buyer',
    SELLER: 'roles.seller',
    ADMIN: 'roles.admin',
  };

  const key = map[normalized];
  if (key) return t(key);
  return role;
}

export function translateCategory(t, category) {
  if (!category) return '';
  const normalized = String(category).toUpperCase();

  const map = {
    FRUITS: 'categories.fruits',
    VEGETABLES: 'categories.vegetables',
    GRAINS: 'categories.grains',
    PULSES: 'categories.pulses',
    SPICES: 'categories.spices',
    MILLETS: 'categories.millets',
    DAIRY: 'categories.dairy',
    OTHER: 'categories.other',
  };

  const key = map[normalized];
  if (key) return t(key);
  return category;
}

export function translateUnit(t, unit) {
  if (!unit) return '';
  const normalized = String(unit).toUpperCase();

  const map = {
    KG: 'units.kg',
    QUINTAL: 'units.quintal',
    TON: 'units.ton',
    LITRE: 'units.litre',
    PIECE: 'units.piece',
  };

  const key = map[normalized];
  if (key) return t(key);
  return unit;
}

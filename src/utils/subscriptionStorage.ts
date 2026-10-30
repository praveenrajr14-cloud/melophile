/**
 * Melophile Music Academy — Live Pro Subscription & Membership Storage Engine
 * Primary Connected Instructor: Praveen Raj R (praveenrajr14@gmail.com)
 */

export interface ProMembership {
  id: string; // e.g. "MELO-PRO-2026-89421"
  invoiceNo: string; // e.g. "INV-MELO-2026-3419"
  status: 'active' | 'cancelled';
  plan: 'annual' | 'monthly';
  planTitle: string;
  amount: number;
  currency: 'INR';
  subscriberName: string;
  subscriberEmail: string;
  subscriberPhone: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'BANK_TRANSFER';
  utrOrTransactionId: string;
  paymentDate: string; // ISO
  expiryDate: string; // ISO
  autoRenew: boolean;
  features: string[];
}

export const STORAGE_PRO_KEY = 'melophile_pro_membership_v1';
export const OFFICIAL_UPI_ID = 'praveenrajr14@oksbi';
export const OFFICIAL_PAYEE_NAME = 'Melophile Music Academy';
export const INSTRUCTOR_NAME = 'PRAVEEN RAJ';
export const OFFICIAL_BANK_NAME = 'State Bank of India (SBI)';

/**
 * Check if the user currently has an active Melophile Pro membership
 */
export function getActiveMembership(): ProMembership | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_PRO_KEY);
    if (!raw) return null;
    const membership: ProMembership = JSON.parse(raw);
    if (!membership || !membership.expiryDate) return null;

    // Check expiry
    const expiry = new Date(membership.expiryDate).getTime();
    const now = Date.now();
    if (now > expiry) {
      return null;
    }

    return membership;
  } catch {
    return null;
  }
}

/**
 * Save active membership to localStorage and dispatch update event
 */
export function saveActiveMembership(membership: ProMembership): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_PRO_KEY, JSON.stringify(membership));
    window.dispatchEvent(new CustomEvent('melophile-membership-updated', { detail: membership }));
  } catch (err) {
    console.error('Failed to save membership:', err);
  }
}

/**
 * Cancel auto-renewal while keeping active status until expiry
 */
export function cancelActiveMembership(): ProMembership | null {
  const current = getActiveMembership();
  if (!current) return null;
  const updated: ProMembership = {
    ...current,
    status: 'cancelled',
    autoRenew: false,
  };
  saveActiveMembership(updated);
  return updated;
}

/**
 * Clear membership (for testing or full reset)
 */
export function clearActiveMembership(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(STORAGE_PRO_KEY);
  window.dispatchEvent(new CustomEvent('melophile-membership-updated', { detail: null }));
}

/**
 * Generate authentic unique Membership ID
 */
export function generateMembershipId(): string {
  const random = Math.floor(10000 + Math.random() * 90000);
  const year = new Date().getFullYear();
  return `MELO-PRO-${year}-${random}`;
}

/**
 * Generate authentic Invoice Number
 */
export function generateInvoiceNumber(): string {
  const random = Math.floor(1000 + Math.random() * 9000);
  const year = new Date().getFullYear();
  return `INV-MELO-${year}-${random}`;
}

/**
 * Generate dynamic UPI payment URL
 */
export function generateUpiUrl(amount: number, planName: string, refId: string): string {
  const note = encodeURIComponent(`Melophile Pro - ${planName} (${refId})`);
  const payee = encodeURIComponent(OFFICIAL_PAYEE_NAME);
  return `upi://pay?pa=${OFFICIAL_UPI_ID}&pn=${payee}&am=${amount}&cu=INR&tn=${note}`;
}

/**
 * Format currency in Indian Rupees
 */
export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

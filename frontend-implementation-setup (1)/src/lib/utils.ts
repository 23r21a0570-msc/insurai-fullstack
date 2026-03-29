import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

// ─── cn ───────────────────────────────────────────────────────────────────────
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// ─── Currency ─────────────────────────────────────────────────────────────────
export const formatCurrency = (amount: number, compact = false): string => {
  if (compact) {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000)     return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

// ─── Numbers ──────────────────────────────────────────────────────────────────
export const formatNumber = (n: number): string => new Intl.NumberFormat('en-US').format(n);
export const formatPercent = (v: number, d = 0): string => `${v.toFixed(d)}%`;
export const formatPercentage = (v: number, d = 1): string => `${v >= 0 ? '+' : ''}${v.toFixed(d)}%`;

// ─── Dates ────────────────────────────────────────────────────────────────────
export const formatDate = (date: string | Date, pattern = 'MMM d, yyyy'): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? format(d, pattern) : 'Invalid date';
  } catch { return 'Invalid date'; }
};
export const formatDateTime   = (date: string | Date) => formatDate(date, 'MMM d, yyyy h:mm a');
export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : 'Invalid date';
  } catch { return 'Invalid date'; }
};

// ─── File size ────────────────────────────────────────────────────────────────
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024, sizes = ['B', 'KB', 'MB', 'GB'], i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

// ─── Strings ──────────────────────────────────────────────────────────────────
export const truncate    = (s: string, n: number) => s.length <= n ? s : `${s.slice(0, n)}...`;
export const capitalize  = (s: string) => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
export const getInitials = (name: string) => name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
export const formatClaimType = (t: string) => t.split('_').map(capitalize).join(' ');
export const formatStatus    = (s: string) => s.split('_').map(capitalize).join(' ');

// ─── Risk / Status colours ────────────────────────────────────────────────────
export const getRiskColor = (level: string): string =>
  ({ critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#10B981' } as Record<string,string>)[level] ?? '#6B7280';

export const getRiskBgColor = (level: string): string =>
  ({ critical: 'rgba(239,68,68,0.1)', high: 'rgba(245,158,11,0.1)', medium: 'rgba(59,130,246,0.1)', low: 'rgba(16,185,129,0.1)' } as Record<string,string>)[level] ?? 'rgba(107,114,128,0.1)';

export const getStatusColor = (status: string): string =>
  ({ approved: '#10B981', rejected: '#EF4444', under_review: '#3B82F6', pending_info: '#F59E0B', escalated: '#8B5CF6', submitted: '#6B7280' } as Record<string,string>)[status] ?? '#6B7280';

// ─── Validators ───────────────────────────────────────────────────────────────
export const validateEmail    = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
export const validatePassword = (p: string) => p.length >= 8;
export const validatePhone    = (p: string) => /^\+?[\d\s()-]{7,}$/.test(p);

// ─── Constants ────────────────────────────────────────────────────────────────
export const TOKEN_KEY = 'insurai_token';
export const USER_KEY  = 'insurai_user';

export const CLAIM_STATUS_OPTIONS = [
  { value: 'submitted',    label: 'Submitted',    color: '#6B7280' },
  { value: 'under_review', label: 'Under Review', color: '#3B82F6' },
  { value: 'pending_info', label: 'Pending Info', color: '#F59E0B' },
  { value: 'approved',     label: 'Approved',     color: '#10B981' },
  { value: 'rejected',     label: 'Rejected',     color: '#EF4444' },
  { value: 'escalated',    label: 'Escalated',    color: '#8B5CF6' },
] as const;

export const CLAIM_TYPE_OPTIONS = [
  { value: 'auto_collision',   label: 'Auto – Collision'    },
  { value: 'auto_theft',       label: 'Auto – Theft'        },
  { value: 'property_damage',  label: 'Property Damage'     },
  { value: 'medical',          label: 'Medical'             },
  { value: 'liability',        label: 'Liability'           },
  { value: 'natural_disaster', label: 'Natural Disaster'    },
] as const;

export const RISK_LEVEL_OPTIONS = [
  { value: 'low',      label: 'Low',      color: '#10B981' },
  { value: 'medium',   label: 'Medium',   color: '#3B82F6' },
  { value: 'high',     label: 'High',     color: '#F59E0B' },
  { value: 'critical', label: 'Critical', color: '#EF4444' },
] as const;

// ─── Helpers ──────────────────────────────────────────────────────────────────
export const exportToCSV = (data: Record<string, unknown>[], filename: string) => {
  if (!data.length) return;
  const headers = Object.keys(data[0]).join(',');
  const rows    = data.map(row => Object.values(row).map(v => `"${String(v).replace(/"/g, '""')}"`).join(','));
  const csv     = [headers, ...rows].join('\n');
  const blob    = new Blob([csv], { type: 'text/csv' });
  const url     = URL.createObjectURL(blob);
  const a       = document.createElement('a');
  a.href = url; a.download = `${filename}.csv`; a.click();
  URL.revokeObjectURL(url);
};

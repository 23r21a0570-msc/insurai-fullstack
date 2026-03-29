import { format, formatDistanceToNow, parseISO, isValid } from 'date-fns';

export const formatCurrency = (amount: number, compact = false): string => {
  if (compact) {
    if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
    if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
};

export const formatNumber = (num: number): string => new Intl.NumberFormat('en-US').format(num);

export const formatPercentage = (value: number, showSign = false): string => {
  const sign = showSign && value > 0 ? '+' : '';
  return `${sign}${value.toFixed(1)}%`;
};

export const formatPercent = (value: number): string => `${value.toFixed(0)}%`;

export const formatDate = (date: string | Date, pattern = 'MMM d, yyyy'): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Invalid date';
    return format(d, pattern);
  } catch { return 'Invalid date'; }
};

export const formatDateTime = (date: string | Date): string => formatDate(date, 'MMM d, yyyy h:mm a');

export const formatRelativeTime = (date: string | Date): string => {
  try {
    const d = typeof date === 'string' ? parseISO(date) : date;
    if (!isValid(d)) return 'Invalid date';
    return formatDistanceToNow(d, { addSuffix: true });
  } catch { return 'Invalid date'; }
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
};

export const truncate = (str: string, length: number): string =>
  str.length <= length ? str : `${str.slice(0, length)}...`;

export const capitalize = (str: string): string =>
  str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

export const formatClaimType = (type: string): string =>
  type.split('_').map(capitalize).join(' ');

export const formatStatus = (status: string): string =>
  status.split('_').map(capitalize).join(' ');

export const getRiskColor = (level: string): string => {
  const colors: Record<string, string> = { critical: '#EF4444', high: '#F59E0B', medium: '#3B82F6', low: '#10B981' };
  return colors[level] || '#6B7280';
};

export const getRiskBgColor = (level: string): string => {
  const colors: Record<string, string> = { critical: 'rgba(239,68,68,0.1)', high: 'rgba(245,158,11,0.1)', medium: 'rgba(59,130,246,0.1)', low: 'rgba(16,185,129,0.1)' };
  return colors[level] || 'rgba(107,114,128,0.1)';
};

export const getStatusColor = (status: string): string => {
  const colors: Record<string, string> = { approved: '#10B981', rejected: '#EF4444', under_review: '#3B82F6', pending_info: '#F59E0B', escalated: '#8B5CF6', submitted: '#6B7280' };
  return colors[status] || '#6B7280';
};

export const getStatusBgColor = (status: string): string => {
  const colors: Record<string, string> = { approved: 'rgba(16,185,129,0.1)', rejected: 'rgba(239,68,68,0.1)', under_review: 'rgba(59,130,246,0.1)', pending_info: 'rgba(245,158,11,0.1)', escalated: 'rgba(139,92,246,0.1)', submitted: 'rgba(107,114,128,0.1)' };
  return colors[status] || 'rgba(107,114,128,0.1)';
};

export const getInitials = (name: string): string =>
  name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

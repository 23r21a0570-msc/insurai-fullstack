export const APP_NAME = 'INSURAI';
export const TOKEN_KEY = 'insurai_token';
export const USER_KEY = 'insurai_user';
export const DEFAULT_PAGE_SIZE = 10;

export const CLAIM_STATUS_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  submitted: { label: 'Submitted', color: '#6B7280', bg: 'rgba(107,114,128,0.12)' },
  under_review: { label: 'Under Review', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  pending_info: { label: 'Pending Info', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  approved: { label: 'Approved', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  rejected: { label: 'Rejected', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  escalated: { label: 'Escalated', color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
};

export const RISK_LEVEL_CONFIG: Record<string, { label: string; color: string; bg: string }> = {
  low: { label: 'Low', color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  medium: { label: 'Medium', color: '#3B82F6', bg: 'rgba(59,130,246,0.12)' },
  high: { label: 'High', color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  critical: { label: 'Critical', color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
};

export const CHART_COLORS = {
  primary: '#10B981',
  secondary: '#3B82F6',
  tertiary: '#8B5CF6',
  quaternary: '#F59E0B',
  danger: '#EF4444',
  muted: '#374151',
};

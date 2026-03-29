// ═══════════════════════════════════════════════════════════════
// INSURAI - Type Definitions
// ═══════════════════════════════════════════════════════════════

export type UserRole = 'admin' | 'manager' | 'analyst' | 'agent' | 'customer';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  isActive: boolean;
  createdAt: string;
  lastLogin?: string;
}

export type ClaimStatus =
  | 'submitted'
  | 'under_review'
  | 'pending_info'
  | 'approved'
  | 'rejected'
  | 'escalated';

export type ClaimType =
  | 'auto_collision'
  | 'auto_theft'
  | 'property_damage'
  | 'medical'
  | 'liability'
  | 'natural_disaster';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Claimant {
  name: string;
  email: string;
  phone: string;
}

export interface ClaimDocument {
  id: string;
  name: string;
  type: string;
  size: number;
  uploadedAt: string;
}

export interface ClaimTimelineEvent {
  id: string;
  type: 'status_change' | 'note_added' | 'document_uploaded' | 'assigned' | 'ai_analysis';
  title: string;
  description: string;
  timestamp: string;
  userName?: string;
}

export interface RiskFactor {
  id: string;
  name: string;
  description: string;
  impact: 'low' | 'medium' | 'high';
  score: number;
  category: 'behavioral' | 'financial' | 'historical' | 'document' | 'pattern';
}

export interface AIAnalysis {
  riskScore: number;
  fraudProbability: number;
  confidence: number;
  riskLevel: RiskLevel;
  recommendation: 'approve' | 'review' | 'investigate' | 'reject';
  factors: RiskFactor[];
  modelVersion: string;
  analyzedAt: string;
  processingTimeMs: number;
}

export interface Claim {
  id: string;
  claimNumber: string;
  policyNumber: string;
  claimant: Claimant;
  type: ClaimType;
  description: string;
  amount: number;
  status: ClaimStatus;
  riskScore: number;
  riskLevel: RiskLevel;
  fraudProbability: number;
  submittedAt: string;
  updatedAt: string;
  assignedToName?: string;
  documents: ClaimDocument[];
  timeline: ClaimTimelineEvent[];
  aiAnalysis?: AIAnalysis;
}

export type PolicyType = 'auto' | 'home' | 'health' | 'life' | 'business';
export type PolicyStatus = 'active' | 'expired' | 'cancelled' | 'pending';

export interface Policy {
  id: string;
  policyNumber: string;
  type: PolicyType;
  holderName: string;
  holderEmail: string;
  coverageAmount: number;
  premium: number;
  deductible: number;
  startDate: string;
  endDate: string;
  status: PolicyStatus;
  claimsCount: number;
  totalClaimsAmount: number;
}

export interface DashboardStats {
  totalClaims: number;
  claimsChange: number;
  pendingReview: number;
  pendingChange: number;
  approvalRate: number;
  approvalChange: number;
  avgProcessingTime: number;
  processingChange: number;
  fraudDetected: number;
  fraudChange: number;
  totalPayout: number;
  payoutChange: number;
}

export interface ClaimsTrendData {
  date: string;
  submitted: number;
  approved: number;
  rejected: number;
  flagged: number;
}

export interface RiskDistribution {
  level: RiskLevel;
  count: number;
  percentage: number;
  color: string;
}

export interface FraudAlert {
  id: string;
  claimId: string;
  claimNumber: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  type: string;
  description: string;
  indicators: string[];
  detectedAt: string;
  status: 'active' | 'investigating' | 'resolved' | 'dismissed';
}

export interface RecentActivity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  iconColor: string;
}

export interface AuditLogEntry {
  id: string;
  action: string;
  entityType: string;
  entityId: string;
  userId: string;
  userName: string;
  userRole: UserRole;
  description: string;
  timestamp: string;
}

export interface ClaimNote {
  id: string;
  claimId: string;
  authorId: string;
  authorName: string;
  authorRole: UserRole;
  content: string;
  createdAt: string;
}

export interface AppNotification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  link?: string;
  createdAt: string;
}

export interface PolicyRule {
  id: string;
  name: string;
  description: string;
  threshold: number;
  action: 'flag' | 'reject' | 'escalate' | 'approve';
  isActive: boolean;
  claimType?: string;
  createdAt: string;
}

import { useState } from 'react';
import {
  CheckCircle2, AlertCircle, Clock, XCircle,
  Shield, FileText, CreditCard, Users, Brain,
  Lock, Plug, BarChart2, ShieldCheck, Globe,
  Smartphone, Wifi, Zap, ArrowRight, TrendingUp,
  Star, Award, ChevronDown, ChevronUp,
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Link } from 'react-router-dom';
import { cn } from '@/utils/cn';

type FeatureStatus = 'complete' | 'partial' | 'planned';

interface Feature {
  name: string;
  status: FeatureStatus;
  link?: string;
}

interface Category {
  id: string;
  label: string;
  icon: typeof Shield;
  color: string;
  description: string;
  features: Feature[];
}

const categories: Category[] = [
  {
    id: 'A',
    label: 'Account & Onboarding',
    icon: Users,
    color: '#10B981',
    description: 'Identity verification, MFA, social login, KYC, progressive onboarding',
    features: [
      { name: 'Email/Password Login', status: 'complete', link: '/login' },
      { name: 'Customer + Admin Registration', status: 'complete', link: '/register' },
      { name: 'Forgot / Reset Password', status: 'complete', link: '/forgot-password' },
      { name: 'Multi-Factor Authentication (MFA)', status: 'complete', link: '/customer/profile' },
      { name: 'Social Login (Google / Apple / Facebook)', status: 'complete', link: '/login' },
      { name: 'KYC / ID Document Verification', status: 'complete', link: '/customer/profile' },
      { name: 'Progressive Onboarding Wizard', status: 'complete', link: '/dashboard' },
      { name: 'Cookie Consent Banner', status: 'complete' },
      { name: 'Active Sessions & Remote Logout', status: 'complete', link: '/customer/profile' },
      { name: 'Privacy Settings & GDPR Tools', status: 'complete', link: '/customer/profile' },
      { name: 'Account Deletion (Right to be Forgotten)', status: 'complete', link: '/customer/profile' },
      { name: 'Liveness Detection / Facial Recognition', status: 'planned' },
      { name: 'Biometric Authentication', status: 'planned' },
    ],
  },
  {
    id: 'B',
    label: 'Policy Features',
    icon: ShieldCheck,
    color: '#3B82F6',
    description: 'Quote calculator, policy comparison, coverage builder, add-ons, digital cards',
    features: [
      { name: 'View All Policies', status: 'complete', link: '/customer/policies' },
      { name: 'Policy Comparison Tool (3 plans)', status: 'complete', link: '/customer/quote' },
      { name: 'Instant Quote Calculator (4-step)', status: 'complete', link: '/customer/quote' },
      { name: 'Coverage Calculator (needs assessment)', status: 'complete', link: '/customer/calculator' },
      { name: 'Add-ons Marketplace', status: 'complete', link: '/customer/policy-management' },
      { name: 'Bundle Builder (multi-policy discounts)', status: 'complete', link: '/customer/policy-management' },
      { name: 'Digital Policy Card + QR Code', status: 'complete', link: '/customer/policy-management' },
      { name: 'Beneficiary Manager', status: 'complete', link: '/customer/policy-management' },
      { name: 'ROI Calculator', status: 'complete', link: '/customer/policy-management' },
      { name: 'Mid-Term Policy Changes', status: 'complete', link: '/customer/policy-management' },
      { name: 'Policy Renewal (auto-renew, one-click)', status: 'complete', link: '/customer/renewal' },
      { name: 'Digital Signature (DocuSign)', status: 'complete', link: '/customer/claims' },
      { name: 'Policy Version History', status: 'complete', link: '/policies' },
      { name: 'Transfer Ownership', status: 'partial' },
      { name: 'Competitor Comparison', status: 'complete', link: '/policies' },
    ],
  },
  {
    id: 'C',
    label: 'Claims Features',
    icon: FileText,
    color: '#F59E0B',
    description: 'Claim filing, tracking, AI assessment, document handling, adjuster tools',
    features: [
      { name: 'File New Claim (multi-step wizard)', status: 'complete', link: '/claims/new' },
      { name: 'Real-Time Claim Tracker (visual timeline)', status: 'complete', link: '/customer/claims' },
      { name: 'Document Upload (drag-and-drop)', status: 'complete', link: '/customer/claims' },
      { name: 'Voice-to-Text Claim Description', status: 'complete', link: '/customer/claims' },
      { name: 'AI Damage Assessment (photo → estimate)', status: 'complete', link: '/customer/claims' },
      { name: 'Digital Signature on Forms', status: 'complete', link: '/customer/claims' },
      { name: 'Chat with Adjuster', status: 'complete', link: '/customer/claims' },
      { name: 'Inspection Scheduler', status: 'complete', link: '/customer/claims' },
      { name: 'Repair Shop Tracker', status: 'complete', link: '/customer/claims' },
      { name: 'Claim Closure Survey', status: 'complete', link: '/customer/claims' },
      { name: 'Appeal Process (if denied)', status: 'complete', link: '/customer/claims' },
      { name: 'Claim Analytics Dashboard', status: 'complete', link: '/claims/analytics' },
      { name: 'OCR Auto-fill from Documents', status: 'partial' },
      { name: 'Video Claim Submission', status: 'planned' },
      { name: 'Live Video Assessment', status: 'planned' },
      { name: 'Police Report Auto-Import', status: 'planned' },
    ],
  },
  {
    id: 'D',
    label: 'Payment Features',
    icon: CreditCard,
    color: '#8B5CF6',
    description: 'Multi-method payments, BNPL, crypto, payment plans, tax documents',
    features: [
      { name: 'Credit/Debit Card Payments', status: 'complete', link: '/customer/payments' },
      { name: 'Bank Transfer (ACH)', status: 'complete', link: '/customer/payments' },
      { name: 'Apple Pay / Google Pay / PayPal / Venmo', status: 'complete', link: '/customer/payments' },
      { name: 'Cryptocurrency (BTC, ETH, USDC)', status: 'complete', link: '/customer/payments' },
      { name: 'Buy Now Pay Later (Klarna, Affirm)', status: 'complete', link: '/customer/payments' },
      { name: 'One-Click Payment (saved cards)', status: 'complete', link: '/customer/payments' },
      { name: 'Auto-Pay Enrollment', status: 'complete', link: '/customer/payments' },
      { name: 'Payment Plan Generator', status: 'complete', link: '/customer/payments' },
      { name: 'Late Fee Calculator & Grace Period', status: 'complete', link: '/customer/payments' },
      { name: 'Tax Documents (1099 forms)', status: 'complete', link: '/customer/payments' },
      { name: 'Failed Payment Retry Logic', status: 'complete', link: '/customer/payments' },
      { name: 'Payment Extension Requests', status: 'complete', link: '/customer/payments' },
      { name: 'Payday Alignment Scheduling', status: 'complete', link: '/customer/payments' },
      { name: 'Real Stripe/PayPal Integration', status: 'planned' },
    ],
  },
  {
    id: 'E',
    label: 'Communication & Support',
    icon: Globe,
    color: '#EC4899',
    description: 'Live chat, support tickets, FAQ, tutorials, push notifications, multi-channel',
    features: [
      { name: 'AI Chatbot (24/7 floating widget)', status: 'complete', link: '/customer/dashboard' },
      { name: 'Live Chat with Human Agents', status: 'complete', link: '/customer/support' },
      { name: 'Support Ticket System', status: 'complete', link: '/customer/support' },
      { name: 'FAQ & Knowledge Base', status: 'complete', link: '/customer/support' },
      { name: 'Video Tutorials Library', status: 'complete', link: '/customer/support' },
      { name: 'Callback Scheduler', status: 'complete', link: '/customer/support' },
      { name: 'Push Notification Registration', status: 'complete', link: '/customer/support' },
      { name: 'Notification Preferences (multi-channel)', status: 'complete', link: '/customer/support' },
      { name: 'In-App Notification Center', status: 'complete', link: '/notifications' },
      { name: 'Community Forum', status: 'complete', link: '/customer/support' },
      { name: 'Email/SMS Notifications (mock)', status: 'complete' },
      { name: 'WhatsApp Notifications', status: 'partial' },
      { name: 'Real Twilio SMS Integration', status: 'planned' },
      { name: 'Video Call Support', status: 'planned' },
    ],
  },
  {
    id: 'F',
    label: 'Engagement & Retention',
    icon: Star,
    color: '#F97316',
    description: 'Loyalty rewards, leaderboards, challenges, streaks, education hub, social',
    features: [
      { name: 'Loyalty & Rewards System (Points / Tiers)', status: 'complete', link: '/customer/rewards' },
      { name: 'Achievement Badges', status: 'complete', link: '/customer/rewards' },
      { name: 'Leaderboards', status: 'complete', link: '/customer/rewards' },
      { name: 'Challenges (earn rewards)', status: 'complete', link: '/customer/rewards' },
      { name: 'Streaks Tracker', status: 'complete', link: '/customer/rewards' },
      { name: 'Daily Tasks', status: 'complete', link: '/customer/dashboard' },
      { name: 'Referral Program', status: 'complete', link: '/customer/referral' },
      { name: 'AI-Powered Recommendations', status: 'complete', link: '/customer/dashboard' },
      { name: 'Education Hub (blog, tutorials, webinars)', status: 'complete', link: '/customer/learn' },
      { name: 'Social Features & Testimonials', status: 'complete', link: '/customer/social' },
      { name: 'Emergency SOS Button', status: 'complete', link: '/customer/dashboard' },
      { name: 'Gamification Challenges', status: 'complete', link: '/customer/rewards' },
      { name: 'Telematics Safe Driving Rewards', status: 'partial' },
    ],
  },
  {
    id: 'G',
    label: 'Claims Management (Admin)',
    icon: Shield,
    color: '#EF4444',
    description: 'SLA tracking, adjuster workload, fraud detection, bulk actions, templates',
    features: [
      { name: 'Claims Queue & Management', status: 'complete', link: '/claims' },
      { name: 'Approve / Reject / Assign Claims', status: 'complete', link: '/claims' },
      { name: 'SLA Tracker', status: 'complete', link: '/claims/hub' },
      { name: 'Adjuster Workload Balancer', status: 'complete', link: '/claims/hub' },
      { name: 'Claim Templates', status: 'complete', link: '/claims/hub' },
      { name: 'Internal Messaging (adjuster ↔ underwriter)', status: 'complete', link: '/claims/hub' },
      { name: 'Duplicate Claim Detector', status: 'complete', link: '/fraud' },
      { name: 'Fraud Network Graph Analysis', status: 'complete', link: '/fraud' },
      { name: 'Geolocation Fraud Analysis', status: 'complete', link: '/fraud' },
      { name: 'AI Damage Estimation (Admin)', status: 'complete', link: '/claims/hub' },
      { name: 'Claim Analytics Dashboard', status: 'complete', link: '/claims/analytics' },
      { name: 'Bulk Claim Actions', status: 'complete', link: '/claims' },
      { name: 'Mobile Adjuster App', status: 'planned' },
      { name: 'Photo Annotation Tools', status: 'planned' },
    ],
  },
  {
    id: 'H',
    label: 'Policy Management (Admin)',
    icon: ShieldCheck,
    color: '#06B6D4',
    description: 'Coverage builder, pricing engine, underwriting, bulk import, A/B testing',
    features: [
      { name: 'View & Search Policies', status: 'complete', link: '/policies' },
      { name: 'Bulk Policy Import (CSV)', status: 'complete', link: '/policies' },
      { name: 'Coverage Builder (modular)', status: 'complete', link: '/policies' },
      { name: 'Pricing Engine Configuration', status: 'complete', link: '/policies' },
      { name: 'Underwriting Rules Engine', status: 'complete', link: '/policies' },
      { name: 'Product Catalog Management', status: 'complete', link: '/policies' },
      { name: 'Competitor Benchmarking', status: 'complete', link: '/policies' },
      { name: 'Policy Version History', status: 'complete', link: '/policies' },
      { name: 'Policy Expiration Management', status: 'complete', link: '/policies' },
      { name: 'Reinsurance Management', status: 'partial' },
      { name: 'Regulatory Filing Automation', status: 'planned' },
      { name: 'NAIC Compliance Reporting', status: 'planned' },
    ],
  },
  {
    id: 'I',
    label: 'Customer Management (Admin)',
    icon: Users,
    color: '#A78BFA',
    description: '360 view, segmentation, campaigns, ticketing, case management',
    features: [
      { name: 'Customer List & Search', status: 'complete', link: '/users' },
      { name: 'Customer 360 View', status: 'complete', link: '/customers/360/cust_1' },
      { name: 'Customer Segmentation', status: 'complete', link: '/customers/segments' },
      { name: 'Campaign Manager (email/SMS/drip)', status: 'complete', link: '/customers/segments' },
      { name: 'A/B Testing for Campaigns', status: 'complete', link: '/customers/segments' },
      { name: 'Ticketing System', status: 'complete', link: '/customers/segments' },
      { name: 'CLV & Lapse Risk Prediction', status: 'complete', link: '/customers/360/cust_1' },
      { name: 'Household View', status: 'complete', link: '/customers/360/cust_1' },
      { name: 'Upsell / Cross-sell Opportunities', status: 'complete', link: '/customers/360/cust_1' },
      { name: 'Real CRM Integration (Salesforce)', status: 'planned' },
    ],
  },
  {
    id: 'J',
    label: 'Analytics & Reporting',
    icon: BarChart2,
    color: '#34D399',
    description: 'KPIs, predictive analytics, custom report builder, advanced dashboards',
    features: [
      { name: 'Admin Dashboard (KPIs, charts)', status: 'complete', link: '/dashboard' },
      { name: 'Claims Analytics', status: 'complete', link: '/claims/analytics' },
      { name: 'Fraud Trend Analytics', status: 'complete', link: '/fraud' },
      { name: 'Advanced Analytics (loss ratio, CLV, CAC)', status: 'complete', link: '/analytics/advanced' },
      { name: 'Churn & Lapse Prediction', status: 'complete', link: '/analytics/advanced' },
      { name: 'Dynamic Pricing Optimization', status: 'complete', link: '/analytics/advanced' },
      { name: 'Custom Report Builder', status: 'complete', link: '/analytics/advanced' },
      { name: 'Export to CSV / PDF', status: 'complete', link: '/analytics/advanced' },
      { name: 'Retention Rate Analytics', status: 'complete', link: '/analytics/advanced' },
      { name: 'Real-time Data Streaming', status: 'planned' },
      { name: 'Tableau / Power BI Integration', status: 'planned' },
      { name: 'Data Warehouse Integration', status: 'planned' },
    ],
  },
  {
    id: 'K',
    label: 'Security & Compliance',
    icon: Lock,
    color: '#F43F5E',
    description: 'Encryption, GDPR, HIPAA, PCI-DSS, SOC2, SSO, MFA, IP whitelisting',
    features: [
      { name: 'Security Center (9 tabs)', status: 'complete', link: '/security' },
      { name: 'AES-256 Encryption Settings', status: 'complete', link: '/security' },
      { name: 'PCI Tokenization', status: 'complete', link: '/security' },
      { name: 'MFA Enforcement & Adoption', status: 'complete', link: '/security' },
      { name: 'SSO / OAuth Configuration', status: 'complete', link: '/security' },
      { name: 'IP Allowlist / Blocklist', status: 'complete', link: '/security' },
      { name: 'Password Policy Manager', status: 'complete', link: '/security' },
      { name: 'Vulnerability Scanner', status: 'complete', link: '/security' },
      { name: 'GDPR / CCPA / HIPAA Compliance Dashboard', status: 'complete', link: '/security' },
      { name: 'Data Retention Policy Manager', status: 'complete', link: '/data-retention' },
      { name: 'Consent Manager', status: 'complete', link: '/consent' },
      { name: 'Security Audit Log', status: 'complete', link: '/audit' },
      { name: 'Real Penetration Testing', status: 'planned' },
      { name: 'SOC 2 Type II Certification', status: 'planned' },
    ],
  },
  {
    id: 'L',
    label: 'Integrations & APIs',
    icon: Plug,
    color: '#FBBF24',
    description: 'CRM, payments, SMS, email, DocuSign, credit bureaus, telematics, developer portal',
    features: [
      { name: 'Integrations Hub (20+ connectors)', status: 'complete', link: '/integrations' },
      { name: 'Developer Portal & API Docs', status: 'complete', link: '/integrations' },
      { name: 'ACORD Forms & EDI Support', status: 'complete', link: '/integrations' },
      { name: 'Service Status Monitor', status: 'complete', link: '/integrations' },
      { name: 'API Keys Management', status: 'complete', link: '/api-keys' },
      { name: 'Webhooks Configuration', status: 'complete', link: '/api-keys' },
      { name: 'Rate Limiting Dashboard', status: 'complete', link: '/api-keys' },
      { name: 'Salesforce / HubSpot CRM', status: 'partial' },
      { name: 'Stripe / PayPal Real Integration', status: 'planned' },
      { name: 'Twilio SMS Real Integration', status: 'planned' },
      { name: 'DocuSign Real Integration', status: 'planned' },
    ],
  },
  {
    id: 'M',
    label: 'Advanced Tech (AI/ML/IoT)',
    icon: Brain,
    color: '#818CF8',
    description: 'ML models, fraud AI, blockchain, IoT telematics, AR/VR, voice, PWA',
    features: [
      { name: 'AI Intelligence Hub (ML models dashboard)', status: 'complete', link: '/ai-hub' },
      { name: 'Claims Auto-Adjudication', status: 'complete', link: '/ai-hub' },
      { name: 'Fraud Detection ML Models', status: 'complete', link: '/fraud' },
      { name: 'Document Classification AI', status: 'complete', link: '/ai-hub' },
      { name: 'Churn Prediction Model', status: 'complete', link: '/ai-hub' },
      { name: 'Sentiment Analysis', status: 'complete', link: '/ai-hub' },
      { name: 'Dynamic Pricing AI', status: 'complete', link: '/ai-hub' },
      { name: 'Blockchain Smart Contracts', status: 'complete', link: '/blockchain' },
      { name: 'IoT / Telematics Dashboard', status: 'complete', link: '/customer/iot' },
      { name: 'Voice Interface (Ctrl+Space)', status: 'complete', link: '/customer/dashboard' },
      { name: 'AR Damage Assessment (camera)', status: 'complete', link: '/customer/claims' },
      { name: 'Progressive Web App (PWA)', status: 'complete' },
      { name: 'Offline Mode (Service Worker)', status: 'complete' },
      { name: 'Real ML Model Training', status: 'planned' },
      { name: 'Real Blockchain Deployment', status: 'planned' },
    ],
  },
];

const statusConfig = {
  complete: { label: 'Complete', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', icon: CheckCircle2 },
  partial:  { label: 'Partial',  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20',   icon: Clock },
  planned:  { label: 'Planned',  color: 'text-gray-500 bg-gray-500/10 border-gray-500/20',       icon: XCircle },
};

export const PlatformOverview = () => {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [filter, setFilter] = useState<FeatureStatus | 'all'>('all');

  const allFeatures = categories.flatMap((c) => c.features);
  const totalComplete = allFeatures.filter((f) => f.status === 'complete').length;
  const totalPartial  = allFeatures.filter((f) => f.status === 'partial').length;
  const totalPlanned  = allFeatures.filter((f) => f.status === 'planned').length;
  const totalFeatures = allFeatures.length;
  const completionPct = Math.round(((totalComplete + totalPartial * 0.5) / totalFeatures) * 100);

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Award className="text-[#10B981]" size={24} />
            Platform Overview
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Complete feature map across all 13 categories (A–M)
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <div className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold">
            {completionPct}% Complete
          </div>
        </div>
      </div>

      {/* Global Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Features', value: totalFeatures, color: '#6B7280', icon: BarChart2 },
          { label: 'Implemented', value: totalComplete, color: '#10B981', icon: CheckCircle2 },
          { label: 'Partial', value: totalPartial, color: '#F59E0B', icon: Clock },
          { label: 'Planned', value: totalPlanned, color: '#6B7280', icon: AlertCircle },
        ].map((s) => (
          <GlassPanel key={s.label} className="flex items-center gap-4">
            <div
              className="p-2.5 rounded-xl shrink-0"
              style={{ backgroundColor: `${s.color}18` }}
            >
              <s.icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <p className="text-2xl font-bold text-white tabular-nums">{s.value}</p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest">{s.label}</p>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Overall Progress Bar */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-200">Overall Completion</h2>
          <span className="text-sm font-bold text-[#10B981] tabular-nums">{completionPct}%</span>
        </div>
        <div className="h-3 rounded-full bg-white/[0.05] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#10B981] to-[#34D399] transition-all duration-1000"
            style={{ width: `${completionPct}%` }}
          />
        </div>
        <div className="flex items-center gap-4 mt-3 text-[10px] text-gray-500">
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500" />{totalComplete} Complete</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500" />{totalPartial} Partial</span>
          <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-gray-600" />{totalPlanned} Planned</span>
        </div>
      </GlassPanel>

      {/* Filter Tabs */}
      <div className="flex gap-2 flex-wrap">
        {(['all', 'complete', 'partial', 'planned'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider border transition-all',
              filter === f
                ? 'bg-[#10B981]/15 border-[#10B981]/40 text-[#10B981]'
                : 'bg-white/[0.03] border-white/[0.08] text-gray-500 hover:border-white/20'
            )}
          >
            {f === 'all' ? 'All Features' : f}
          </button>
        ))}
      </div>

      {/* Category Cards */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const catComplete = cat.features.filter((f) => f.status === 'complete').length;
          const catTotal    = cat.features.length;
          const catPct      = Math.round((catComplete / catTotal) * 100);
          const isOpen      = expanded === cat.id;

          const visibleFeatures = filter === 'all'
            ? cat.features
            : cat.features.filter((f) => f.status === filter);

          if (filter !== 'all' && visibleFeatures.length === 0) return null;

          return (
            <GlassPanel key={cat.id} className="overflow-hidden">
              {/* Category Header */}
              <button
                className="w-full flex items-center justify-between gap-4 text-left"
                onClick={() => setExpanded(isOpen ? null : cat.id)}
                aria-expanded={isOpen}
              >
                <div className="flex items-center gap-4 flex-1 min-w-0">
                  <div
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl"
                    style={{ backgroundColor: `${cat.color}18` }}
                  >
                    <cat.icon size={18} style={{ color: cat.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded"
                        style={{ color: cat.color, backgroundColor: `${cat.color}18` }}
                      >
                        {cat.id}
                      </span>
                      <span className="text-sm font-bold text-gray-200">{cat.label}</span>
                    </div>
                    <p className="text-[11px] text-gray-600 mt-0.5 truncate">{cat.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 shrink-0">
                  {/* Mini progress */}
                  <div className="hidden sm:flex flex-col items-end gap-1">
                    <span className="text-xs font-bold tabular-nums" style={{ color: cat.color }}>
                      {catPct}%
                    </span>
                    <div className="w-24 h-1.5 rounded-full bg-white/[0.05]">
                      <div
                        className="h-full rounded-full transition-all"
                        style={{ width: `${catPct}%`, backgroundColor: cat.color }}
                      />
                    </div>
                    <span className="text-[10px] text-gray-600">{catComplete}/{catTotal} done</span>
                  </div>
                  {isOpen ? (
                    <ChevronUp size={16} className="text-gray-500" />
                  ) : (
                    <ChevronDown size={16} className="text-gray-500" />
                  )}
                </div>
              </button>

              {/* Features List */}
              {isOpen && (
                <div className="mt-6 border-t border-white/[0.06] pt-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {(filter === 'all' ? cat.features : visibleFeatures).map((feature) => {
                      const sc = statusConfig[feature.status];
                      const Icon = sc.icon;
                      return (
                        <div
                          key={feature.name}
                          className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-all"
                        >
                          <div className="flex items-center gap-2 flex-1 min-w-0">
                            <Icon size={13} className={sc.color.split(' ')[0]} />
                            <span className="text-xs text-gray-300 truncate">{feature.name}</span>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <span className={cn('text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border', sc.color)}>
                              {sc.label}
                            </span>
                            {feature.link && feature.status !== 'planned' && (
                              <Link
                                to={feature.link}
                                className="flex items-center gap-0.5 text-[10px] text-[#10B981] hover:underline"
                                onClick={(e) => e.stopPropagation()}
                              >
                                View <ArrowRight size={9} />
                              </Link>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </GlassPanel>
          );
        })}
      </div>

      {/* Technology Stack */}
      <GlassPanel>
        <h2 className="text-sm font-bold text-gray-200 mb-6">Technology Stack</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { category: 'Frontend', items: ['React 19', 'TypeScript', 'Tailwind CSS', 'Vite', 'Recharts', 'Framer Motion'], icon: Smartphone, color: '#3B82F6' },
            { category: 'State & Routing', items: ['Context API', 'React Hook Form', 'Zod Validation', 'React Router v6', 'Zustand (ready)', 'LocalStorage'], icon: Zap, color: '#F59E0B' },
            { category: 'AI & Analytics', items: ['ML Model Mocks', 'Fraud Scoring', 'Risk Analysis', 'Churn Prediction', 'NLP Chatbot', 'Sentiment Analysis'], icon: Brain, color: '#8B5CF6' },
            { category: 'Infrastructure', items: ['PWA + Service Worker', 'Offline Mode', 'Code Splitting', 'Lazy Loading', 'Error Boundaries', 'ARIA Accessibility'], icon: Wifi, color: '#10B981' },
          ].map((tech) => (
            <div key={tech.category} className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                <tech.icon size={14} style={{ color: tech.color }} />
                <span className="text-[10px] font-bold uppercase tracking-widest" style={{ color: tech.color }}>
                  {tech.category}
                </span>
              </div>
              <div className="space-y-1.5">
                {tech.items.map((item) => (
                  <div key={item} className="flex items-center gap-1.5">
                    <div className="w-1 h-1 rounded-full" style={{ backgroundColor: tech.color }} />
                    <span className="text-xs text-gray-400">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Quick Navigation */}
      <GlassPanel>
        <h2 className="text-sm font-bold text-gray-200 mb-4">Quick Navigation</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {[
            { label: 'Admin Dashboard', href: '/dashboard', icon: BarChart2, color: '#10B981' },
            { label: 'Claims Hub', href: '/claims/hub', icon: FileText, color: '#3B82F6' },
            { label: 'Fraud Detection', href: '/fraud', icon: Shield, color: '#EF4444' },
            { label: 'AI Hub', href: '/ai-hub', icon: Brain, color: '#8B5CF6' },
            { label: 'Policy Admin', href: '/policies', icon: ShieldCheck, color: '#06B6D4' },
            { label: 'Advanced Analytics', href: '/analytics/advanced', icon: TrendingUp, color: '#34D399' },
            { label: 'Security Center', href: '/security', icon: Lock, color: '#F43F5E' },
            { label: 'Integrations', href: '/integrations', icon: Plug, color: '#FBBF24' },
            { label: 'Customer Portal', href: '/customer/dashboard', icon: Users, color: '#A78BFA' },
            { label: 'Customer 360', href: '/customers/360/cust_1', icon: Globe, color: '#EC4899' },
            { label: 'Blockchain', href: '/blockchain', icon: Zap, color: '#F97316' },
            { label: 'Consent Manager', href: '/consent', icon: Lock, color: '#6B7280' },
          ].map((nav) => (
            <Link
              key={nav.label}
              to={nav.href}
              className="flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/15 hover:bg-white/[0.04] transition-all group"
            >
              <div className="p-1.5 rounded-lg shrink-0" style={{ backgroundColor: `${nav.color}18` }}>
                <nav.icon size={13} style={{ color: nav.color }} />
              </div>
              <span className="text-xs text-gray-400 group-hover:text-gray-200 transition-colors">{nav.label}</span>
              <ArrowRight size={11} className="text-gray-700 group-hover:text-gray-500 ml-auto transition-colors" />
            </Link>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
};

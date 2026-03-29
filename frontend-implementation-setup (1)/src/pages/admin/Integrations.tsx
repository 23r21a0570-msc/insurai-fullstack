import { useState } from 'react';
import {
  Plug, CheckCircle2, XCircle, AlertTriangle, RefreshCw,
  ExternalLink, Settings, Plus, Search, Filter,
  Database, Mail, MessageSquare, FileSignature,
  Video, CreditCard, Car, Heart, Globe,
  Copy, Eye, EyeOff,
  Activity, Clock, Shield, Star, Download
} from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

// ─── Types ────────────────────────────────────────────────────────
type IntegrationStatus = 'connected' | 'disconnected' | 'error' | 'pending';
type IntegrationCategory =
  | 'CRM' | 'Payments' | 'Email' | 'SMS' | 'Document'
  | 'Video' | 'Credit' | 'Telematics' | 'Healthcare' | 'All';

interface Integration {
  id: string;
  name: string;
  description: string;
  category: Exclude<IntegrationCategory, 'All'>;
  status: IntegrationStatus;
  icon: string;
  color: string;
  popular?: boolean;
  lastSync?: string;
  requestsToday?: number;
  docs?: string;
  features: string[];
  configFields?: { key: string; label: string; type: string; placeholder: string }[];
  tier: 'free' | 'pro' | 'enterprise';
}

interface DevPortalEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  path: string;
  description: string;
  auth: boolean;
  rateLimit: string;
  params?: string[];
}

// ─── Mock Data ────────────────────────────────────────────────────
const INTEGRATIONS: Integration[] = [
  // CRM
  {
    id: 'salesforce', name: 'Salesforce', category: 'CRM', status: 'connected',
    icon: '☁️', color: '#00A1E0',
    description: 'Sync customer data, policies, and claims with Salesforce CRM.',
    popular: true, lastSync: '2 min ago', requestsToday: 1284,
    features: ['Bi-directional sync', 'Custom field mapping', 'Workflow triggers', 'Lead scoring'],
    configFields: [
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: '3MVG9...' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••' },
      { key: 'instance_url', label: 'Instance URL', type: 'text', placeholder: 'https://yourcompany.salesforce.com' },
    ],
    tier: 'pro',
  },
  {
    id: 'hubspot', name: 'HubSpot', category: 'CRM', status: 'disconnected',
    icon: '🟠', color: '#FF7A59',
    description: 'Connect INSURAI with HubSpot for marketing automation and CRM.',
    features: ['Contact sync', 'Deal pipeline', 'Email sequences', 'Analytics'],
    configFields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'pat-na1-...' },
    ],
    tier: 'free',
  },
  {
    id: 'zendesk', name: 'Zendesk', category: 'CRM', status: 'connected',
    icon: '🎫', color: '#03363D',
    description: 'Create and sync support tickets from claims directly in Zendesk.',
    lastSync: '15 min ago', requestsToday: 342,
    features: ['Ticket creation', 'Status sync', 'Agent assignment', 'SLA tracking'],
    tier: 'pro',
  },
  // Payments
  {
    id: 'stripe', name: 'Stripe', category: 'Payments', status: 'connected',
    icon: '💳', color: '#635BFF',
    description: 'Accept premium payments, process refunds, and manage subscriptions via Stripe.',
    popular: true, lastSync: '5 min ago', requestsToday: 891,
    features: ['Card payments', 'ACH transfers', 'Subscriptions', 'Refunds', 'Fraud protection'],
    configFields: [
      { key: 'publishable_key', label: 'Publishable Key', type: 'text', placeholder: 'pk_live_...' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: 'sk_live_...' },
      { key: 'webhook_secret', label: 'Webhook Secret', type: 'password', placeholder: 'whsec_...' },
    ],
    tier: 'free',
  },
  {
    id: 'paypal', name: 'PayPal', category: 'Payments', status: 'pending',
    icon: '🅿️', color: '#003087',
    description: 'Enable PayPal and Venmo as payment options for customers.',
    features: ['PayPal checkout', 'Venmo support', 'Dispute management', 'Instant transfers'],
    configFields: [
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'AaBb...' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••' },
    ],
    tier: 'free',
  },
  {
    id: 'plaid', name: 'Plaid', category: 'Payments', status: 'disconnected',
    icon: '🏦', color: '#00D67F',
    description: 'Bank account verification and ACH payments via Plaid.',
    features: ['Bank verification', 'ACH payments', 'Balance checks', 'Identity verification'],
    tier: 'pro',
  },
  // Email
  {
    id: 'sendgrid', name: 'SendGrid', category: 'Email', status: 'connected',
    icon: '✉️', color: '#1A82E2',
    description: 'Transactional and marketing email delivery via SendGrid.',
    popular: true, lastSync: '1 min ago', requestsToday: 2341,
    features: ['Transactional emails', 'Templates', 'Analytics', 'Bounce management', 'Unsubscribe handling'],
    configFields: [
      { key: 'api_key', label: 'API Key', type: 'password', placeholder: 'SG.xxxxxx' },
      { key: 'from_email', label: 'From Email', type: 'text', placeholder: 'noreply@insurai.com' },
    ],
    tier: 'free',
  },
  {
    id: 'mailchimp', name: 'Mailchimp', category: 'Email', status: 'disconnected',
    icon: '🐵', color: '#FFE01B',
    description: 'Marketing email campaigns and audience segmentation with Mailchimp.',
    features: ['Campaign builder', 'Audience segments', 'A/B testing', 'Automation flows'],
    tier: 'free',
  },
  // SMS
  {
    id: 'twilio', name: 'Twilio', category: 'SMS', status: 'connected',
    icon: '📱', color: '#F22F46',
    description: 'Send SMS alerts for claim updates, OTP, and payment reminders.',
    popular: true, lastSync: '30 sec ago', requestsToday: 1102,
    features: ['SMS alerts', 'OTP verification', 'WhatsApp', 'Voice calls', 'Programmable messaging'],
    configFields: [
      { key: 'account_sid', label: 'Account SID', type: 'text', placeholder: 'AC...' },
      { key: 'auth_token', label: 'Auth Token', type: 'password', placeholder: '••••••••' },
      { key: 'from_number', label: 'From Number', type: 'text', placeholder: '+15551234567' },
    ],
    tier: 'free',
  },
  {
    id: 'whatsapp', name: 'WhatsApp Business', category: 'SMS', status: 'error',
    icon: '💬', color: '#25D366',
    description: 'Send WhatsApp notifications and support via WhatsApp Business API.',
    features: ['Message templates', 'Media messages', 'Read receipts', 'Automated replies'],
    tier: 'enterprise',
  },
  // Document Signing
  {
    id: 'docusign', name: 'DocuSign', category: 'Document', status: 'connected',
    icon: '✍️', color: '#FFB300',
    description: 'E-signature for policy contracts, claims forms, and legal documents.',
    popular: true, lastSync: '1 hr ago', requestsToday: 128,
    features: ['E-signature', 'Audit trail', 'Template library', 'Bulk send', 'Mobile signing'],
    configFields: [
      { key: 'integration_key', label: 'Integration Key', type: 'text', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'account_id', label: 'Account ID', type: 'text', placeholder: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx' },
      { key: 'secret_key', label: 'Secret Key', type: 'password', placeholder: '••••••••' },
    ],
    tier: 'pro',
  },
  {
    id: 'hellosign', name: 'HelloSign', category: 'Document', status: 'disconnected',
    icon: '📝', color: '#00BEE0',
    description: 'Lightweight e-signature solution for smaller document volumes.',
    features: ['E-signature', 'Templates', 'API integration', 'Signer reminders'],
    tier: 'free',
  },
  // Video
  {
    id: 'zoom', name: 'Zoom', category: 'Video', status: 'connected',
    icon: '📹', color: '#2D8CFF',
    description: 'Schedule video assessments and adjuster calls directly in INSURAI.',
    lastSync: '3 hr ago', requestsToday: 45,
    features: ['Video calls', 'Screen sharing', 'Recording', 'Calendar sync', 'Waiting room'],
    configFields: [
      { key: 'account_id', label: 'Account ID', type: 'text', placeholder: 'xxx' },
      { key: 'client_id', label: 'Client ID', type: 'text', placeholder: 'xxx' },
      { key: 'client_secret', label: 'Client Secret', type: 'password', placeholder: '••••••••' },
    ],
    tier: 'pro',
  },
  {
    id: 'teams', name: 'Microsoft Teams', category: 'Video', status: 'disconnected',
    icon: '💼', color: '#6264A7',
    description: 'Enterprise video calls and collaboration via Microsoft Teams.',
    features: ['Video calls', 'Teams notifications', 'Calendar integration', 'SSO'],
    tier: 'enterprise',
  },
  // Credit Bureaus
  {
    id: 'experian', name: 'Experian', category: 'Credit', status: 'connected',
    icon: '📊', color: '#CC0000',
    description: 'Credit score checks for underwriting and fraud detection via Experian.',
    lastSync: '24 hr ago', requestsToday: 284,
    features: ['Credit scores', 'Identity verification', 'Fraud alerts', 'Income verification'],
    tier: 'enterprise',
  },
  {
    id: 'equifax', name: 'Equifax', category: 'Credit', status: 'disconnected',
    icon: '📈', color: '#E31837',
    description: 'Alternative credit bureau integration for risk scoring.',
    features: ['Credit reports', 'Identity verification', 'Fraud detection', 'Employment verification'],
    tier: 'enterprise',
  },
  {
    id: 'mvr', name: 'DMV / MVR Records', category: 'Credit', status: 'connected',
    icon: '🚗', color: '#6B7280',
    description: 'Motor Vehicle Records for auto insurance underwriting.',
    lastSync: '6 hr ago', requestsToday: 156,
    features: ['Driving history', 'License status', 'Violations', 'Accidents'],
    tier: 'enterprise',
  },
  // Telematics
  {
    id: 'iotinsurance', name: 'IoT Insurance', category: 'Telematics', status: 'disconnected',
    icon: '📡', color: '#8B5CF6',
    description: 'Usage-based insurance via telematics and IoT device data.',
    features: ['Trip data', 'Driving score', 'Mileage tracking', 'Behavior analysis'],
    tier: 'enterprise',
  },
  {
    id: 'smartcar', name: 'Smartcar', category: 'Telematics', status: 'connected',
    icon: '🚙', color: '#00C2FF',
    description: 'Connected vehicle data for usage-based auto insurance.',
    lastSync: '10 min ago', requestsToday: 892,
    features: ['Odometer reads', 'Location', 'Fuel level', 'Battery status (EV)'],
    tier: 'pro',
  },
  // Healthcare
  {
    id: 'epic', name: 'Epic EHR', category: 'Healthcare', status: 'disconnected',
    icon: '🏥', color: '#D62828',
    description: 'HIPAA-compliant health data exchange via Epic EHR system.',
    features: ['Medical records', 'HL7/FHIR', 'Patient data', 'Clinical notes'],
    tier: 'enterprise',
  },
  {
    id: 'cerner', name: 'Cerner', category: 'Healthcare', status: 'disconnected',
    icon: '💊', color: '#E87722',
    description: 'Health data integration for medical claims processing.',
    features: ['Medical records', 'Lab results', 'Prescription data', 'Insurance eligibility'],
    tier: 'enterprise',
  },
];

const API_ENDPOINTS: DevPortalEndpoint[] = [
  { method: 'GET', path: '/api/v1/claims', description: 'List all claims with optional filters', auth: true, rateLimit: '1000/hr', params: ['status', 'from', 'to', 'limit', 'offset'] },
  { method: 'POST', path: '/api/v1/claims', description: 'Submit a new insurance claim', auth: true, rateLimit: '100/hr', params: ['policy_id', 'type', 'amount', 'description'] },
  { method: 'GET', path: '/api/v1/claims/:id', description: 'Get a single claim by ID', auth: true, rateLimit: '1000/hr', params: ['id'] },
  { method: 'PUT', path: '/api/v1/claims/:id/status', description: 'Update claim status', auth: true, rateLimit: '500/hr', params: ['status', 'reason'] },
  { method: 'GET', path: '/api/v1/policies', description: 'List all policies for an account', auth: true, rateLimit: '1000/hr', params: ['status', 'type'] },
  { method: 'POST', path: '/api/v1/policies', description: 'Create a new insurance policy', auth: true, rateLimit: '100/hr', params: ['type', 'coverage', 'premium', 'holder_id'] },
  { method: 'GET', path: '/api/v1/customers', description: 'List all customers', auth: true, rateLimit: '500/hr', params: ['search', 'role', 'status'] },
  { method: 'GET', path: '/api/v1/customers/:id', description: 'Get customer 360 view', auth: true, rateLimit: '1000/hr', params: ['id'] },
  { method: 'POST', path: '/api/v1/payments', description: 'Process a payment', auth: true, rateLimit: '200/hr', params: ['amount', 'currency', 'method', 'policy_id'] },
  { method: 'GET', path: '/api/v1/analytics/fraud', description: 'Get fraud detection scores', auth: true, rateLimit: '200/hr', params: ['claim_id', 'threshold'] },
  { method: 'GET', path: '/api/v1/analytics/dashboard', description: 'Dashboard KPIs and metrics', auth: true, rateLimit: '300/hr', params: ['period', 'from', 'to'] },
  { method: 'POST', path: '/api/v1/webhooks', description: 'Register a webhook endpoint', auth: true, rateLimit: '50/hr', params: ['url', 'events', 'secret'] },
  { method: 'DELETE', path: '/api/v1/webhooks/:id', description: 'Remove a webhook endpoint', auth: true, rateLimit: '50/hr' },
  { method: 'GET', path: '/api/v1/documents/:id', description: 'Retrieve a document by ID', auth: true, rateLimit: '500/hr' },
  { method: 'POST', path: '/api/v1/documents/upload', description: 'Upload claim document (multipart)', auth: true, rateLimit: '100/hr', params: ['claim_id', 'type', 'file'] },
];

const CATEGORIES: IntegrationCategory[] = ['All', 'CRM', 'Payments', 'Email', 'SMS', 'Document', 'Video', 'Credit', 'Telematics', 'Healthcare'];

const STATUS_CONFIG: Record<IntegrationStatus, { color: string; label: string; icon: typeof CheckCircle2 }> = {
  connected: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Connected', icon: CheckCircle2 },
  disconnected: { color: 'text-gray-400 bg-gray-500/10 border-gray-500/20', label: 'Not Connected', icon: XCircle },
  error: { color: 'text-red-400 bg-red-500/10 border-red-500/20', label: 'Error', icon: AlertTriangle },
  pending: { color: 'text-amber-400 bg-amber-500/10 border-amber-500/20', label: 'Pending', icon: Clock },
};

const TIER_CONFIG: Record<string, { color: string; label: string }> = {
  free: { color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', label: 'Free' },
  pro: { color: 'text-blue-400 bg-blue-500/10 border-blue-500/20', label: 'Pro' },
  enterprise: { color: 'text-purple-400 bg-purple-500/10 border-purple-500/20', label: 'Enterprise' },
};

const METHOD_COLOR: Record<string, string> = {
  GET: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  POST: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  PUT: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  PATCH: 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  DELETE: 'text-red-400 bg-red-500/10 border-red-500/20',
};

const MAIN_TABS = ['Integrations', 'Developer Portal', 'ACORD / EDI', 'Status'] as const;
type MainTab = typeof MAIN_TABS[number];

// ─── Integration Card ─────────────────────────────────────────────
function IntegrationCard({ integration }: { integration: Integration }) {
  const { success, error: toastError } = useToast();
  const [expanded, setExpanded] = useState(false);
  const [status, setStatus] = useState(integration.status);
  const [connecting, setConnecting] = useState(false);
  const [configValues, setConfigValues] = useState<Record<string, string>>({});
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});

  const cfg = STATUS_CONFIG[status];
  const tierCfg = TIER_CONFIG[integration.tier];
  const StatusIcon = cfg.icon;

  const handleToggle = async () => {
    if (status === 'connected') {
      setStatus('disconnected');
      success('Disconnected', `${integration.name} has been disconnected.`);
    } else {
      setConnecting(true);
      await new Promise(r => setTimeout(r, 1500));
      setConnecting(false);
      // Simulate 80% success rate
      if (Math.random() > 0.2) {
        setStatus('connected');
        success('Connected!', `${integration.name} connected successfully.`);
      } else {
        setStatus('error');
        toastError('Connection failed', 'Check your credentials and try again.');
      }
    }
  };

  const handleSync = async () => {
    success('Syncing…', `Syncing ${integration.name} data now.`);
  };

  return (
    <GlassPanel hoverable className={cn('transition-all', status === 'error' && 'border-red-500/20')}>
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="text-2xl w-10 h-10 flex items-center justify-center rounded-xl shrink-0"
          style={{ backgroundColor: `${integration.color}20` }}>
          {integration.icon}
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-semibold text-white">{integration.name}</span>
            {integration.popular && (
              <span className="flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded bg-amber-500/10 border border-amber-500/20 text-amber-400 font-bold">
                <Star size={9} /> Popular
              </span>
            )}
            <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-bold capitalize', tierCfg.color)}>
              {tierCfg.label}
            </span>
            <span className={cn('flex items-center gap-1 text-[10px] px-1.5 py-0.5 rounded border font-bold', cfg.color)}>
              <StatusIcon size={10} /> {cfg.label}
            </span>
          </div>
          <p className="text-xs text-gray-400 mb-2">{integration.description}</p>
          {status === 'connected' && integration.lastSync && (
            <div className="flex items-center gap-3 text-[10px] text-gray-600">
              <span><Clock size={10} className="inline mr-1" />Last sync: {integration.lastSync}</span>
              {integration.requestsToday !== undefined && (
                <span><Activity size={10} className="inline mr-1" />{integration.requestsToday.toLocaleString()} req today</span>
              )}
            </div>
          )}
          {status === 'error' && (
            <div className="mt-1 flex items-center gap-2 text-xs text-red-400 bg-red-500/5 border border-red-500/15 rounded px-2 py-1.5">
              <AlertTriangle size={12} /> Connection error — verify credentials
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 shrink-0">
          {status === 'connected' && (
            <button onClick={handleSync} className="p-1.5 rounded-lg text-gray-500 hover:text-emerald-400 hover:bg-white/5 transition-colors" title="Sync now">
              <RefreshCw size={14} />
            </button>
          )}
          <button onClick={() => setExpanded(!expanded)} className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/5 transition-colors" title="Configure">
            <Settings size={14} />
          </button>
          <Button
            size="sm"
            variant={status === 'connected' ? 'secondary' : 'primary'}
            isLoading={connecting}
            onClick={handleToggle}
          >
            {status === 'connected' ? 'Disconnect' : 'Connect'}
          </Button>
        </div>
      </div>

      {/* Expanded Config */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-white/[0.06] space-y-4">
          {/* Features */}
          <div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Features</p>
            <div className="flex flex-wrap gap-1.5">
              {integration.features.map(f => (
                <span key={f} className="text-[10px] px-2 py-0.5 rounded bg-white/[0.04] border border-white/[0.06] text-gray-400">
                  <CheckCircle2 size={9} className="inline mr-1 text-emerald-500" />{f}
                </span>
              ))}
            </div>
          </div>

          {/* Config fields */}
          {integration.configFields && integration.configFields.length > 0 && (
            <div>
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-3">Configuration</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {integration.configFields.map(field => (
                  <div key={field.key} className="space-y-1.5">
                    <label className="text-xs font-medium text-gray-400">{field.label}</label>
                    <div className="relative">
                      <input
                        type={field.type === 'password' && !showSecrets[field.key] ? 'password' : 'text'}
                        placeholder={field.placeholder}
                        value={configValues[field.key] || ''}
                        onChange={e => setConfigValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        className="w-full h-9 rounded-lg border border-white/10 bg-white/5 px-3 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30"
                      />
                      {field.type === 'password' && (
                        <button
                          onClick={() => setShowSecrets(prev => ({ ...prev, [field.key]: !prev[field.key] }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-400"
                        >
                          {showSecrets[field.key] ? <EyeOff size={13} /> : <Eye size={13} />}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" onClick={() => success('Settings saved', `${integration.name} configuration updated.`)}>
                  Save Settings
                </Button>
                <Button size="sm" variant="secondary" onClick={() => success('Test successful', `${integration.name} connection tested.`)}>
                  Test Connection
                </Button>
              </div>
            </div>
          )}

          {integration.docs && (
            <a href={integration.docs} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs text-emerald-400 hover:underline">
              <ExternalLink size={12} /> View Documentation
            </a>
          )}
        </div>
      )}
    </GlassPanel>
  );
}

// ─── Developer Portal ─────────────────────────────────────────────
function DeveloperPortal() {
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [selectedEndpoint, setSelectedEndpoint] = useState<DevPortalEndpoint | null>(null);

  const filtered = API_ENDPOINTS.filter(ep =>
    ep.path.toLowerCase().includes(search.toLowerCase()) ||
    ep.description.toLowerCase().includes(search.toLowerCase()) ||
    ep.method.toLowerCase().includes(search.toLowerCase())
  );

  const baseUrl = 'https://api.insurai.com';

  return (
    <div className="space-y-6">
      {/* Header cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Total Endpoints', value: API_ENDPOINTS.length, color: '#10B981' },
          { label: 'API Version', value: 'v1.4.2', color: '#3B82F6' },
          { label: 'Uptime (30d)', value: '99.97%', color: '#8B5CF6' },
          { label: 'Avg Latency', value: '48ms', color: '#F59E0B' },
        ].map(kpi => (
          <GlassPanel key={kpi.label}>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider mb-1">{kpi.label}</p>
            <p className="text-xl font-bold" style={{ color: kpi.color }}>{kpi.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Base URL */}
      <GlassPanel>
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wider">Base URL</p>
          <button onClick={() => success('Copied', 'Base URL copied to clipboard.')}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-400 transition-colors">
            <Copy size={12} /> Copy
          </button>
        </div>
        <code className="text-sm font-mono text-emerald-400 bg-black/30 px-3 py-2 rounded-lg block">
          {baseUrl}
        </code>
        <div className="mt-3 grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
          {[
            { label: 'Authentication', value: 'Bearer Token (JWT)' },
            { label: 'Rate Limiting', value: 'Per key, per endpoint' },
            { label: 'Format', value: 'JSON (application/json)' },
          ].map(item => (
            <div key={item.label} className="flex flex-col gap-0.5 p-2 rounded-lg bg-white/[0.02] border border-white/[0.05]">
              <span className="text-gray-600 font-medium">{item.label}</span>
              <span className="text-gray-300">{item.value}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Endpoint List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* List */}
        <div className="space-y-3">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search endpoints…"
              className="w-full pl-9 pr-4 h-9 rounded-lg border border-white/10 bg-white/5 text-xs text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
            />
          </div>
          <div className="space-y-1.5">
            {filtered.map((ep, i) => (
              <button
                key={i}
                onClick={() => setSelectedEndpoint(ep)}
                className={cn(
                  'w-full flex items-center gap-3 p-3 rounded-xl border text-left transition-all',
                  selectedEndpoint?.path === ep.path
                    ? 'border-emerald-500/30 bg-emerald-500/5'
                    : 'border-white/[0.05] bg-white/[0.02] hover:border-white/10 hover:bg-white/[0.04]'
                )}
              >
                <span className={cn('text-[10px] font-mono font-bold px-2 py-0.5 rounded border shrink-0', METHOD_COLOR[ep.method])}>
                  {ep.method}
                </span>
                <code className="text-xs font-mono text-gray-300 truncate">{ep.path}</code>
                {ep.auth && <Shield size={11} className="text-gray-600 shrink-0 ml-auto" aria-label="Requires auth" />}
              </button>
            ))}
          </div>
        </div>

        {/* Detail */}
        {selectedEndpoint ? (
          <GlassPanel className="border-emerald-500/10">
            <div className="flex items-center gap-3 mb-4">
              <span className={cn('text-xs font-mono font-bold px-2 py-1 rounded border', METHOD_COLOR[selectedEndpoint.method])}>
                {selectedEndpoint.method}
              </span>
              <code className="text-sm font-mono text-gray-200 flex-1 break-all">{selectedEndpoint.path}</code>
            </div>
            <p className="text-sm text-gray-400 mb-4">{selectedEndpoint.description}</p>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-gray-500">Authentication</span>
                <span className={selectedEndpoint.auth ? 'text-amber-400 font-medium' : 'text-gray-400'}>
                  {selectedEndpoint.auth ? '🔒 Required' : '🔓 Public'}
                </span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                <span className="text-gray-500">Rate Limit</span>
                <span className="text-gray-300 font-mono">{selectedEndpoint.rateLimit}</span>
              </div>

              {selectedEndpoint.params && (
                <div>
                  <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-2">Parameters</p>
                  <div className="space-y-1.5">
                    {selectedEndpoint.params.map(p => (
                      <div key={p} className="flex items-center gap-2 p-2 rounded-lg bg-white/[0.03] border border-white/[0.05]">
                        <code className="text-emerald-400 font-mono">{p}</code>
                        <span className="text-gray-600">string</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Sample request */}
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-2">Sample Request</p>
                <div className="bg-black/40 rounded-xl border border-white/[0.06] p-3 font-mono text-xs overflow-x-auto">
                  <div className="text-gray-500">curl -X {selectedEndpoint.method} \</div>
                  <div className="text-gray-400 ml-2">{baseUrl}{selectedEndpoint.path} \</div>
                  <div className="text-gray-500 ml-2">-H <span className="text-amber-300">"Authorization: Bearer YOUR_API_KEY"</span> \</div>
                  <div className="text-gray-500 ml-2">-H <span className="text-amber-300">"Content-Type: application/json"</span></div>
                </div>
                <button
                  onClick={() => success('Copied', 'Sample request copied.')}
                  className="mt-2 flex items-center gap-1.5 text-xs text-gray-500 hover:text-emerald-400 transition-colors"
                >
                  <Copy size={11} /> Copy cURL
                </button>
              </div>

              {/* Sample response */}
              <div>
                <p className="text-gray-500 font-bold uppercase tracking-wider text-[10px] mb-2">Sample Response</p>
                <div className="bg-black/40 rounded-xl border border-white/[0.06] p-3 font-mono text-xs overflow-x-auto">
                  <div className="text-emerald-400">{'{'}</div>
                  <div className="ml-3 text-gray-400">"success": <span className="text-blue-400">true</span>,</div>
                  <div className="ml-3 text-gray-400">"data": <span className="text-amber-300">{'[...]'}</span>,</div>
                  <div className="ml-3 text-gray-400">"meta": {'{'}</div>
                  <div className="ml-6 text-gray-500">"total": <span className="text-blue-400">127</span>,</div>
                  <div className="ml-6 text-gray-500">"page": <span className="text-blue-400">1</span>,</div>
                  <div className="ml-6 text-gray-500">"limit": <span className="text-blue-400">25</span></div>
                  <div className="ml-3 text-gray-400">{'}'}</div>
                  <div className="text-emerald-400">{'}'}</div>
                </div>
              </div>
            </div>
          </GlassPanel>
        ) : (
          <GlassPanel className="flex flex-col items-center justify-center min-h-[300px] text-center">
            <Globe size={32} className="text-gray-700 mb-3" />
            <p className="text-sm text-gray-500">Select an endpoint to view documentation</p>
          </GlassPanel>
        )}
      </div>

      {/* SDK Download */}
      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-4">SDK & Client Libraries</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { name: 'JavaScript / TypeScript', icon: '🟨', pkg: 'npm install @insurai/sdk' },
            { name: 'Python', icon: '🐍', pkg: 'pip install insurai-sdk' },
            { name: 'Ruby', icon: '💎', pkg: 'gem install insurai' },
            { name: 'Go', icon: '🔵', pkg: 'go get github.com/insurai/go-sdk' },
          ].map(sdk => (
            <div key={sdk.name} className="p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/10 transition-colors">
              <div className="text-xl mb-2">{sdk.icon}</div>
              <p className="text-xs font-medium text-gray-300 mb-1">{sdk.name}</p>
              <code className="text-[10px] text-gray-500 font-mono block mb-2 truncate">{sdk.pkg}</code>
              <button onClick={() => success('Download started', `${sdk.name} SDK downloading.`)}
                className="flex items-center gap-1 text-[10px] text-emerald-400 hover:underline">
                <Download size={10} /> Download
              </button>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── ACORD / EDI Panel ────────────────────────────────────────────
function ACORDEDIPanel() {
  const { success } = useToast();
  return (
    <div className="space-y-6">
      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-1">ACORD Forms & Standards</h3>
        <p className="text-xs text-gray-500 mb-4">Industry-standard insurance forms and XML data exchange via ACORD.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            { form: 'ACORD 125', title: 'Commercial Insurance Application', status: 'supported', category: 'Commercial' },
            { form: 'ACORD 126', title: 'Commercial General Liability', status: 'supported', category: 'Liability' },
            { form: 'ACORD 140', title: 'Property Section', status: 'supported', category: 'Property' },
            { form: 'ACORD 25', title: 'Certificate of Insurance', status: 'supported', category: 'General' },
            { form: 'ACORD 101', title: 'Additional Remarks', status: 'beta', category: 'General' },
            { form: 'ACORD 130', title: 'Workers Compensation Application', status: 'planned', category: 'Workers Comp' },
          ].map(form => (
            <div key={form.form} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div>
                <div className="flex items-center gap-2 mb-0.5">
                  <span className="text-xs font-mono font-bold text-gray-200">{form.form}</span>
                  <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-bold',
                    form.status === 'supported' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                    form.status === 'beta' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                    'text-gray-400 bg-gray-500/10 border-gray-500/20')}>
                    {form.status}
                  </span>
                </div>
                <p className="text-xs text-gray-500">{form.title}</p>
              </div>
              <span className="text-[10px] text-gray-600">{form.category}</span>
            </div>
          ))}
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-1">EDI Transactions</h3>
        <p className="text-xs text-gray-500 mb-4">Electronic Data Interchange for insurance data exchange with partners.</p>
        <div className="space-y-3">
          {[
            { code: 'EDI 834', name: 'Benefit Enrollment and Maintenance', status: 'active' },
            { code: 'EDI 835', name: 'Healthcare Claim Payment/Advice', status: 'active' },
            { code: 'EDI 837', name: 'Healthcare Claim (Professional)', status: 'active' },
            { code: 'EDI 270/271', name: 'Eligibility Benefit Inquiry/Response', status: 'beta' },
            { code: 'EDI 276/277', name: 'Claim Status Request/Response', status: 'active' },
            { code: 'EDI 820', name: 'Premium Payment', status: 'planned' },
          ].map(edi => (
            <div key={edi.code} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <div className="flex items-center gap-3">
                <code className="text-xs font-mono font-bold text-blue-400">{edi.code}</code>
                <p className="text-xs text-gray-300">{edi.name}</p>
              </div>
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-bold',
                  edi.status === 'active' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                  edi.status === 'beta' ? 'text-amber-400 bg-amber-500/10 border-amber-500/20' :
                  'text-gray-400 bg-gray-500/10 border-gray-500/20')}>
                  {edi.status}
                </span>
                <button onClick={() => success('Docs opened', `${edi.code} documentation.`)}
                  className="text-gray-600 hover:text-emerald-400 transition-colors">
                  <ExternalLink size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-white/[0.06]">
          <h4 className="text-xs font-bold text-gray-400 mb-3">Trading Partner Setup</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <Input label="Partner ISA ID" placeholder="00 + 10 chars" />
            <Input label="Partner GS ID" placeholder="Application sender ID" />
          </div>
          <div className="flex gap-2 mt-3">
            <Button size="sm" onClick={() => success('Partner added', 'EDI trading partner configured.')}>
              Add Partner
            </Button>
            <Button size="sm" variant="secondary" onClick={() => success('Test sent', 'EDI test transaction sent.')}>
              Send Test 997
            </Button>
          </div>
        </div>
      </GlassPanel>

      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-4">HL7 / FHIR (Healthcare)</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { standard: 'FHIR R4', status: 'Supported', desc: 'Patient, Coverage, Claim resources' },
            { standard: 'HL7 v2.x', status: 'Supported', desc: 'ADT, ORU, DFT message types' },
            { standard: 'FHIR R5', status: 'Beta', desc: 'Next-gen healthcare API standard' },
          ].map(h => (
            <div key={h.standard} className="p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
              <p className="text-sm font-bold text-gray-200 mb-0.5">{h.standard}</p>
              <p className="text-xs text-gray-500 mb-2">{h.desc}</p>
              <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-bold',
                h.status === 'Supported' ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' :
                'text-amber-400 bg-amber-500/10 border-amber-500/20')}>
                {h.status}
              </span>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── Status Page ──────────────────────────────────────────────────
function StatusPage() {
  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%', latency: '42ms' },
    { name: 'Claims Service', status: 'operational', uptime: '99.95%', latency: '88ms' },
    { name: 'Policy Engine', status: 'operational', uptime: '100%', latency: '31ms' },
    { name: 'Payment Processing', status: 'degraded', uptime: '98.12%', latency: '340ms' },
    { name: 'AI Fraud Detection', status: 'operational', uptime: '99.89%', latency: '125ms' },
    { name: 'Document Storage', status: 'operational', uptime: '99.99%', latency: '55ms' },
    { name: 'Notification Service', status: 'operational', uptime: '99.94%', latency: '67ms' },
    { name: 'Authentication', status: 'operational', uptime: '100%', latency: '18ms' },
    { name: 'WebSocket (Real-time)', status: 'outage', uptime: '97.43%', latency: 'N/A' },
  ];

  const statusConfig: Record<string, { color: string; label: string; dot: string }> = {
    operational: { color: 'text-emerald-400', label: 'Operational', dot: 'bg-emerald-400' },
    degraded: { color: 'text-amber-400', label: 'Degraded', dot: 'bg-amber-400' },
    outage: { color: 'text-red-400', label: 'Outage', dot: 'bg-red-400' },
  };

  const hasDegraded = services.some(s => s.status === 'degraded');
  const hasOutage = services.some(s => s.status === 'outage');

  return (
    <div className="space-y-6">
      {/* Overall status banner */}
      <div className={cn('p-4 rounded-xl border flex items-center gap-4',
        hasOutage ? 'border-red-500/30 bg-red-500/5' :
        hasDegraded ? 'border-amber-500/30 bg-amber-500/5' :
        'border-emerald-500/30 bg-emerald-500/5')}>
        <div className={cn('w-3 h-3 rounded-full animate-pulse',
          hasOutage ? 'bg-red-500' : hasDegraded ? 'bg-amber-500' : 'bg-emerald-500')} />
        <div>
          <p className="font-semibold text-white">
            {hasOutage ? '⚠️ Service Disruption' : hasDegraded ? '⚡ Degraded Performance' : '✅ All Systems Operational'}
          </p>
          <p className="text-xs text-gray-400">
            {hasOutage ? 'Some services are experiencing issues. Our team is actively investigating.' :
             hasDegraded ? 'Some services have slower response times than usual.' :
             'All services are running normally.'}
          </p>
        </div>
      </div>

      {/* Services table */}
      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-4">Service Status</h3>
        <div className="space-y-2">
          {services.map(svc => {
            const cfg = statusConfig[svc.status];
            return (
              <div key={svc.name} className="flex items-center justify-between p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
                <div className="flex items-center gap-3">
                  <span className={cn('w-2 h-2 rounded-full', cfg.dot)} />
                  <span className="text-sm text-gray-200">{svc.name}</span>
                </div>
                <div className="flex items-center gap-6 text-xs">
                  <span className="text-gray-500 font-mono">{svc.latency}</span>
                  <span className="text-gray-500 font-mono">{svc.uptime}</span>
                  <span className={cn('font-medium', cfg.color)}>{cfg.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      </GlassPanel>

      {/* Uptime history (last 90 days) */}
      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-4">90-Day Uptime</h3>
        <div className="space-y-3">
          {services.slice(0, 5).map(svc => (
            <div key={svc.name}>
              <div className="flex items-center justify-between mb-1 text-xs">
                <span className="text-gray-400">{svc.name}</span>
                <span className="text-gray-300 font-mono">{svc.uptime}</span>
              </div>
              <div className="flex gap-0.5 h-5">
                {Array.from({ length: 90 }, (_, i) => {
                  const isRecent = i > 87;
                  const hasProblem = svc.status !== 'operational' && isRecent;
                  return (
                    <div key={i} className={cn('flex-1 rounded-sm',
                      hasProblem ? (svc.status === 'outage' ? 'bg-red-500' : 'bg-amber-500') :
                      'bg-emerald-500/60')} />
                  );
                })}
              </div>
              <div className="flex justify-between text-[10px] text-gray-600 mt-0.5">
                <span>90 days ago</span>
                <span>Today</span>
              </div>
            </div>
          ))}
        </div>
      </GlassPanel>

      {/* Incident history */}
      <GlassPanel>
        <h3 className="text-sm font-bold text-gray-200 mb-4">Recent Incidents</h3>
        <div className="space-y-3">
          {[
            { date: 'Jan 25, 2025', title: 'WebSocket Service Outage', status: 'ongoing', desc: 'Real-time notification service is down. Team investigating.' },
            { date: 'Jan 20, 2025', title: 'Payment Processing Latency', status: 'resolved', desc: 'Elevated latency on payment service. Resolved in 45 minutes.' },
            { date: 'Jan 10, 2025', title: 'Scheduled Maintenance', status: 'resolved', desc: 'Database migration completed. All services restored.' },
          ].map((inc, i) => (
            <div key={i} className={cn('p-3 rounded-xl border', inc.status === 'ongoing' ? 'border-red-500/20 bg-red-500/5' : 'border-white/[0.05] bg-white/[0.02]')}>
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-[10px] px-1.5 py-0.5 rounded border font-bold',
                  inc.status === 'ongoing' ? 'text-red-400 bg-red-500/10 border-red-500/20' : 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20')}>
                  {inc.status}
                </span>
                <span className="text-xs font-medium text-gray-200">{inc.title}</span>
                <span className="text-xs text-gray-600 ml-auto">{inc.date}</span>
              </div>
              <p className="text-xs text-gray-500">{inc.desc}</p>
            </div>
          ))}
        </div>
      </GlassPanel>
    </div>
  );
}

// ─── Main Component ────────────────────────────────────────────────
export const Integrations = () => {
  const [mainTab, setMainTab] = useState<MainTab>('Integrations');
  const [category, setCategory] = useState<IntegrationCategory>('All');
  const [search, setSearch] = useState('');

  const filtered = INTEGRATIONS.filter(int => {
    const matchesCategory = category === 'All' || int.category === category;
    const matchesSearch = !search ||
      int.name.toLowerCase().includes(search.toLowerCase()) ||
      int.description.toLowerCase().includes(search.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const connected = INTEGRATIONS.filter(i => i.status === 'connected').length;
  const errors = INTEGRATIONS.filter(i => i.status === 'error').length;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Plug className="text-emerald-400" size={22} /> Integrations & APIs
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Connect INSURAI with third-party services, manage APIs, and view system status.
          </p>
        </div>
        <Button onClick={() => {}}>
          <Plus size={14} className="mr-1.5" /> Request Integration
        </Button>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Connected', value: connected, icon: CheckCircle2, color: '#10B981' },
          { label: 'Available', value: INTEGRATIONS.length, icon: Plug, color: '#3B82F6' },
          { label: 'Errors', value: errors, icon: AlertTriangle, color: errors > 0 ? '#EF4444' : '#10B981' },
          { label: 'API Uptime', value: '99.97%', icon: Activity, color: '#8B5CF6' },
        ].map(kpi => (
          <GlassPanel key={kpi.label}>
            <div className="flex items-center gap-2 mb-2">
              <div className="p-1.5 rounded-lg" style={{ backgroundColor: `${kpi.color}20` }}>
                <kpi.icon size={14} style={{ color: kpi.color }} />
              </div>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">{kpi.label}</p>
            </div>
            <p className="text-xl font-bold text-white">{kpi.value}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Main Tabs */}
      <div className="flex gap-1 border-b border-white/[0.06] overflow-x-auto hide-scrollbar">
        {MAIN_TABS.map(t => (
          <button key={t} onClick={() => setMainTab(t)}
            className={cn('px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors',
              mainTab === t ? 'border-emerald-500 text-emerald-400' : 'border-transparent text-gray-500 hover:text-gray-300')}>
            {t}
          </button>
        ))}
      </div>

      {/* Integrations Tab */}
      {mainTab === 'Integrations' && (
        <div className="space-y-4">
          {/* Search + Category Filter */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search integrations…"
                className="w-full pl-9 pr-4 h-10 rounded-lg border border-white/10 bg-white/5 text-sm text-gray-300 placeholder-gray-600 focus:outline-none focus:border-emerald-500/50"
              />
            </div>
            <div className="flex gap-1.5 flex-wrap">
              {CATEGORIES.map(cat => (
                <button key={cat} onClick={() => setCategory(cat)}
                  className={cn('px-3 py-2 rounded-lg text-xs font-medium transition-colors border',
                    category === cat
                      ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                      : 'border-white/[0.06] text-gray-500 hover:text-gray-300 hover:border-white/10')}>
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Category Groups */}
          {category === 'All' ? (
            CATEGORIES.filter(c => c !== 'All').map(cat => {
              const items = filtered.filter(i => i.category === cat);
              if (items.length === 0) return null;
              const catIcons: Record<string, typeof Plug> = {
                CRM: Database, Payments: CreditCard, Email: Mail, SMS: MessageSquare,
                Document: FileSignature, Video: Video, Credit: Shield, Telematics: Car,
                Healthcare: Heart,
              };
              const Icon = catIcons[cat] || Plug;
              return (
                <div key={cat} className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className="text-gray-500" />
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-widest">{cat}</h3>
                    <div className="flex-1 h-px bg-white/[0.04]" />
                  </div>
                  {items.map(int => <IntegrationCard key={int.id} integration={int} />)}
                </div>
              );
            })
          ) : (
            <div className="space-y-3">
              {filtered.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-center">
                  <Filter size={32} className="text-gray-700 mb-3" />
                  <p className="text-gray-500 text-sm">No integrations found for "{search}"</p>
                </div>
              ) : (
                filtered.map(int => <IntegrationCard key={int.id} integration={int} />)
              )}
            </div>
          )}
        </div>
      )}

      {mainTab === 'Developer Portal' && <DeveloperPortal />}
      {mainTab === 'ACORD / EDI' && <ACORDEDIPanel />}
      {mainTab === 'Status' && <StatusPage />}
    </div>
  );
};

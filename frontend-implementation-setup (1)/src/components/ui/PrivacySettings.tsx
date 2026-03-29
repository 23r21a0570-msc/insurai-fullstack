import { useState } from 'react';
import { Shield, Download, Trash2, Eye, EyeOff, AlertTriangle, CheckCircle2, FileText, Share2 } from 'lucide-react';
import { Button } from './Button';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';
import { useAuth } from '@/context/AuthContext';
import { useNavigate } from 'react-router-dom';

interface ToggleRowProps {
  title: string;
  desc: string;
  value: boolean;
  onChange: (v: boolean) => void;
  icon?: React.ReactNode;
}

const ToggleRow = ({ title, desc, value, onChange, icon }: ToggleRowProps) => (
  <div className="flex items-start justify-between gap-4 py-4 border-b border-white/[0.04] last:border-0">
    <div className="flex items-start gap-3">
      {icon && <div className="mt-0.5 text-gray-400">{icon}</div>}
      <div>
        <p className="text-sm font-semibold text-gray-200">{title}</p>
        <p className="text-xs text-gray-500 mt-0.5 leading-relaxed max-w-xs">{desc}</p>
      </div>
    </div>
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={title}
      onClick={() => onChange(!value)}
      className={cn(
        'mt-0.5 relative h-5 w-9 rounded-full shrink-0 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#10B981]/50',
        value ? 'bg-[#10B981]' : 'bg-white/10'
      )}
    >
      <span className={cn(
        'absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform duration-200',
        value && 'translate-x-4'
      )} />
    </button>
  </div>
);

export const PrivacySettings = () => {
  const { success, warning } = useToast();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const [settings, setSettings] = useState({
    analyticsTracking:     true,
    marketingEmails:       false,
    thirdPartySharing:     false,
    profileVisibility:     true,
    behaviorTracking:      false,
    locationTracking:      false,
    personalizedAds:       false,
    dataImprovement:       true,
  });

  const [isExporting, setExporting]     = useState(false);
  const [isDeleting, setDeleting]       = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteText, setDeleteText]     = useState('');

  const set = (key: keyof typeof settings, v: boolean) => {
    setSettings(p => ({ ...p, [key]: v }));
    success('Preference saved', 'Your privacy setting has been updated.');
  };

  const handleExport = async () => {
    setExporting(true);
    await new Promise(r => setTimeout(r, 2000));
    // Simulate file download
    const data = {
      exportedAt: new Date().toISOString(),
      profile: { name: 'Maruthi Admin', email: 'admin@insurai.com' },
      policies: ['POL-001', 'POL-002'],
      claims: ['CLM-2024-1001', 'CLM-2024-1002'],
      privacySettings: settings,
      note: 'This is a mock data export for demo purposes.',
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `insurai-data-export-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
    setExporting(false);
    success('Export complete', 'Your data has been downloaded as a JSON file.');
  };

  const handleDeleteAccount = async () => {
    if (deleteText !== 'DELETE') return;
    setDeleting(true);
    await new Promise(r => setTimeout(r, 1500));
    setDeleting(false);
    warning('Account scheduled for deletion', 'Your account will be permanently deleted within 30 days.');
    logout();
    navigate('/login');
  };

  return (
    <div className="space-y-6">
      {/* Data Sharing */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-1">
          <Share2 size={16} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-gray-200">Data Sharing & Tracking</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">Control how your data is used and shared.</p>
        <div>
          <ToggleRow
            title="Analytics Tracking"
            desc="Help us improve by sharing anonymous usage data."
            value={settings.analyticsTracking}
            onChange={v => set('analyticsTracking', v)}
            icon={<Eye size={15} />}
          />
          <ToggleRow
            title="Behaviour Tracking"
            desc="Track your interactions to personalise your experience."
            value={settings.behaviorTracking}
            onChange={v => set('behaviorTracking', v)}
            icon={<Eye size={15} />}
          />
          <ToggleRow
            title="Third-party Data Sharing"
            desc="Share anonymised data with our trusted insurance partners."
            value={settings.thirdPartySharing}
            onChange={v => set('thirdPartySharing', v)}
            icon={<Share2 size={15} />}
          />
          <ToggleRow
            title="Marketing Emails"
            desc="Receive updates about new products and special offers."
            value={settings.marketingEmails}
            onChange={v => set('marketingEmails', v)}
            icon={<FileText size={15} />}
          />
          <ToggleRow
            title="Personalised Ads"
            desc="See relevant insurance ads based on your profile."
            value={settings.personalizedAds}
            onChange={v => set('personalizedAds', v)}
            icon={<EyeOff size={15} />}
          />
          <ToggleRow
            title="Product Improvement"
            desc="Allow us to use your data to improve AI models and features."
            value={settings.dataImprovement}
            onChange={v => set('dataImprovement', v)}
            icon={<Shield size={15} />}
          />
        </div>
      </div>

      {/* Profile visibility */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5">
        <div className="flex items-center gap-2 mb-1">
          <Eye size={16} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-gray-200">Visibility</h3>
        </div>
        <p className="text-xs text-gray-500 mb-4">Control who can see your profile information.</p>
        <ToggleRow
          title="Profile Visibility"
          desc="Make your profile visible to claims adjusters and support agents."
          value={settings.profileVisibility}
          onChange={v => set('profileVisibility', v)}
          icon={<Eye size={15} />}
        />
        <ToggleRow
          title="Location Tracking"
          desc="Allow location data for geo-verification of claims."
          value={settings.locationTracking}
          onChange={v => set('locationTracking', v)}
          icon={<Shield size={15} />}
        />
      </div>

      {/* Data Rights (GDPR) */}
      <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-5 space-y-4">
        <div className="flex items-center gap-2 mb-1">
          <Shield size={16} className="text-[#10B981]" />
          <h3 className="text-sm font-bold text-gray-200">Your Data Rights (GDPR / CCPA)</h3>
        </div>
        <p className="text-xs text-gray-500">
          You have the right to access, export, or delete your personal data at any time under GDPR and CCPA.
        </p>

        {/* Export */}
        <div className="flex items-start justify-between gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.06]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10">
              <Download size={16} className="text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-200">Export My Data</p>
              <p className="text-xs text-gray-500 mt-0.5">Download a copy of all your personal data (JSON format).</p>
            </div>
          </div>
          <Button variant="secondary" size="sm" isLoading={isExporting} onClick={handleExport} className="shrink-0">
            <Download size={13} className="mr-1.5" /> Export
          </Button>
        </div>

        {/* Compliance badges */}
        <div className="flex flex-wrap gap-2">
          {['GDPR Compliant', 'CCPA Compliant', 'HIPAA Ready', 'SOC 2 Type II'].map(b => (
            <span key={b} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full border border-[#10B981]/20 bg-[#10B981]/[0.04] text-[10px] font-bold text-[#10B981] uppercase tracking-wider">
              <CheckCircle2 size={9} /> {b}
            </span>
          ))}
        </div>
      </div>

      {/* Danger zone — Delete account */}
      <div className="rounded-xl border border-red-500/20 bg-red-500/[0.03] p-5 space-y-4">
        <div className="flex items-center gap-2">
          <AlertTriangle size={16} className="text-red-400" />
          <h3 className="text-sm font-bold text-red-400">Danger Zone</h3>
        </div>

        {!showDeleteConfirm ? (
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-semibold text-gray-200">Delete Account</p>
              <p className="text-xs text-gray-500 mt-0.5 max-w-xs">
                Permanently delete your account and all associated data. This action cannot be undone.
              </p>
            </div>
            <Button
              variant="danger"
              size="sm"
              className="shrink-0"
              onClick={() => setShowDeleteConfirm(true)}
            >
              <Trash2 size={13} className="mr-1.5" /> Delete
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-red-300 font-medium">
              ⚠ This will permanently delete your account, all policies, claims, and payment history after a 30-day grace period.
            </p>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Type <code className="text-red-400 font-mono bg-red-500/10 px-1.5 py-0.5 rounded">DELETE</code> to confirm
              </label>
              <input
                type="text"
                value={deleteText}
                onChange={e => setDeleteText(e.target.value)}
                placeholder="DELETE"
                className="w-full h-10 rounded-lg border border-red-500/30 bg-red-500/[0.05] px-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50"
                aria-label="Type DELETE to confirm account deletion"
              />
            </div>
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" onClick={() => { setShowDeleteConfirm(false); setDeleteText(''); }}>
                Cancel
              </Button>
              <Button
                variant="danger"
                size="sm"
                className="flex-1"
                disabled={deleteText !== 'DELETE'}
                isLoading={isDeleting}
                onClick={handleDeleteAccount}
              >
                <Trash2 size={13} className="mr-1.5" /> Permanently Delete
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

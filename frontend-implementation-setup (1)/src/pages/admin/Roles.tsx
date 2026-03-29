import { useState } from 'react';
import { UserCog, Check, X, Info } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Tooltip } from '@/components/ui/Tooltip';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

type Role = 'admin' | 'manager' | 'analyst' | 'agent';

interface Permission {
  id: string;
  label: string;
  description: string;
  category: string;
}

type RoleMatrix = Record<Role, Record<string, boolean>>;

const PERMISSIONS: Permission[] = [
  // Claims
  { id: 'claims.view', label: 'View Claims', description: 'View all claims and their details', category: 'Claims' },
  { id: 'claims.create', label: 'Create Claims', description: 'Submit new insurance claims', category: 'Claims' },
  { id: 'claims.approve', label: 'Approve / Reject', description: 'Approve or reject claim decisions', category: 'Claims' },
  { id: 'claims.assign', label: 'Assign Claims', description: 'Assign claims to team members', category: 'Claims' },
  { id: 'claims.export', label: 'Export Claims', description: 'Export claims data to CSV', category: 'Claims' },
  // Fraud
  { id: 'fraud.view', label: 'View Alerts', description: 'See AI fraud detection alerts', category: 'Fraud' },
  { id: 'fraud.dismiss', label: 'Dismiss Alerts', description: 'Dismiss or resolve fraud alerts', category: 'Fraud' },
  { id: 'fraud.override', label: 'Override AI', description: 'Submit AI decision overrides', category: 'Fraud' },
  // Policies
  { id: 'policies.view', label: 'View Policies', description: 'View insurance policy records', category: 'Policies' },
  { id: 'policies.edit', label: 'Edit Policies', description: 'Modify policy details and thresholds', category: 'Policies' },
  // Admin
  { id: 'users.view', label: 'View Team', description: 'View team members list', category: 'Admin' },
  { id: 'users.manage', label: 'Manage Users', description: 'Add, edit, or deactivate users', category: 'Admin' },
  { id: 'roles.manage', label: 'Manage Roles', description: 'Edit role permissions', category: 'Admin' },
  { id: 'rules.manage', label: 'Manage Rules', description: 'Configure AI threshold rules', category: 'Admin' },
  { id: 'audit.view', label: 'View Audit Log', description: 'Access full audit history', category: 'Admin' },
];

const DEFAULT_MATRIX: RoleMatrix = {
  admin: Object.fromEntries(PERMISSIONS.map((p) => [p.id, true])),
  manager: Object.fromEntries(PERMISSIONS.map((p) => [p.id, !['roles.manage', 'rules.manage', 'users.manage'].includes(p.id)])),
  analyst: Object.fromEntries(PERMISSIONS.map((p) => [p.id, ['claims.view', 'fraud.view', 'fraud.override', 'policies.view', 'users.view'].includes(p.id)])),
  agent: Object.fromEntries(PERMISSIONS.map((p) => [p.id, ['claims.view', 'claims.create', 'fraud.view'].includes(p.id)])),
};

const ROLES: { role: Role; label: string; color: string }[] = [
  { role: 'admin', label: 'Admin', color: 'text-purple-400' },
  { role: 'manager', label: 'Manager', color: 'text-blue-400' },
  { role: 'analyst', label: 'Analyst', color: 'text-amber-400' },
  { role: 'agent', label: 'Agent', color: 'text-gray-400' },
];

const CATEGORIES = [...new Set(PERMISSIONS.map((p) => p.category))];

export const Roles = () => {
  const { success } = useToast();
  const [matrix, setMatrix] = useState<RoleMatrix>(DEFAULT_MATRIX);
  const [hasChanges, setHasChanges] = useState(false);

  const toggle = (role: Role, permId: string) => {
    if (role === 'admin') return; // admin always has all
    setMatrix((prev) => ({
      ...prev,
      [role]: { ...prev[role], [permId]: !prev[role][permId] },
    }));
    setHasChanges(true);
  };

  const handleSave = () => {
    success('Permissions saved', 'Role permissions have been updated.');
    setHasChanges(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <UserCog size={20} className="text-[#10B981]" />
            <h1 className="text-2xl font-bold text-white">Roles & Permissions</h1>
          </div>
          <p className="text-sm text-gray-500">
            Control what each role can access and perform across the platform.
          </p>
        </div>
        {hasChanges && (
          <Button leftIcon={<Check size={14} />} onClick={handleSave}>
            Save Changes
          </Button>
        )}
      </div>

      {/* Role overview cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {ROLES.map(({ role, label, color }) => {
          const count = Object.values(matrix[role]).filter(Boolean).length;
          return (
            <GlassPanel key={role}>
              <p className={cn('text-xs font-bold uppercase tracking-wider mb-1', color)}>
                {label}
              </p>
              <p className="text-2xl font-bold text-white">{count}</p>
              <p className="text-[11px] text-gray-600 mt-0.5">of {PERMISSIONS.length} permissions</p>
            </GlassPanel>
          );
        })}
      </div>

      {/* Permission matrix */}
      <GlassPanel className="overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="w-full" role="grid" aria-label="Role permissions matrix">
            <thead>
              <tr className="border-b border-white/[0.06] bg-white/[0.02]">
                <th className="px-5 py-3 text-left text-[10px] font-bold uppercase tracking-widest text-gray-600 w-64">
                  Permission
                </th>
                {ROLES.map(({ role, label, color }) => (
                  <th
                    key={role}
                    className="px-4 py-3 text-center text-[10px] font-bold uppercase tracking-widest"
                  >
                    <span className={color}>{label}</span>
                    {role === 'admin' && (
                      <span className="ml-1 text-[9px] text-gray-700">(full)</span>
                    )}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {CATEGORIES.map((category) => (
                <>
                  <tr key={`cat-${category}`} className="bg-white/[0.01]">
                    <td
                      colSpan={5}
                      className="px-5 py-2 text-[10px] font-bold uppercase tracking-widest text-gray-600 border-b border-white/[0.04]"
                    >
                      {category}
                    </td>
                  </tr>
                  {PERMISSIONS.filter((p) => p.category === category).map((perm) => (
                    <tr
                      key={perm.id}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-300">{perm.label}</p>
                          <Tooltip content={perm.description} side="right">
                            <Info
                              size={12}
                              className="text-gray-700 hover:text-gray-400 cursor-help transition-colors"
                            />
                          </Tooltip>
                        </div>
                      </td>
                      {ROLES.map(({ role }) => {
                        const enabled = matrix[role][perm.id];
                        const isAdmin = role === 'admin';
                        return (
                          <td key={role} className="px-4 py-3 text-center">
                            <button
                              onClick={() => toggle(role, perm.id)}
                              disabled={isAdmin}
                              aria-label={`${enabled ? 'Revoke' : 'Grant'} ${perm.label} for ${role}`}
                              aria-pressed={enabled}
                              className={cn(
                                'mx-auto flex h-6 w-6 items-center justify-center rounded-full border transition-all',
                                enabled
                                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                                  : 'bg-white/[0.03] border-white/[0.08] text-gray-700',
                                !isAdmin && 'hover:scale-110 cursor-pointer',
                                isAdmin && 'cursor-not-allowed opacity-80'
                              )}
                            >
                              {enabled ? <Check size={11} /> : <X size={11} />}
                            </button>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </GlassPanel>

      <p className="text-xs text-gray-700 text-center">
        Admin role always has full access and cannot be restricted.
      </p>
    </div>
  );
};

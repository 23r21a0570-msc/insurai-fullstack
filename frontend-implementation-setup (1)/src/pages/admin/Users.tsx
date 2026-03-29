import { useState } from 'react';
import { UserPlus, Search, MoreVertical, CheckCircle2, XCircle } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { mockUsers } from '@/data/mockData';
import { formatDate } from '@/utils/formatters';
import { useToast } from '@/context/ToastContext';
import type { User, UserRole } from '@/types';

const ROLE_OPTIONS = [
  { label: 'Admin', value: 'admin' },
  { label: 'Manager', value: 'manager' },
  { label: 'Analyst', value: 'analyst' },
  { label: 'Agent', value: 'agent' },
];

const roleBadgeStyle: Record<UserRole, string> = {
  admin: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  manager: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  analyst: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  agent: 'bg-gray-500/10 text-gray-400 border-gray-500/20',
  customer: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
};

const getInitials = (name: string) =>
  name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);

export const Users = () => {
  const { success } = useToast();
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', role: 'agent' as UserRole, department: '' });

  const filtered = mockUsers.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    success('User added', `${form.name} has been added to the team.`);
    setIsModalOpen(false);
    setForm({ name: '', email: '', role: 'agent', department: '' });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Team</h1>
          <p className="text-sm text-gray-500 mt-1">Manage team members and their roles.</p>
        </div>
        <Button size="sm" leftIcon={<UserPlus size={14} />} onClick={() => setIsModalOpen(true)}>
          Add Member
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, or role..."
          className="h-10 w-full rounded-lg border border-white/[0.07] bg-white/[0.04] pl-9 pr-4 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
        />
      </div>

      {/* User Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filtered.map((user: User) => (
          <GlassPanel key={user.id} hoverable>
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#10B981]/15 text-[#10B981] text-sm font-bold">
                  {getInitials(user.name)}
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-200">{user.name}</p>
                  <p className="text-xs text-gray-500">{user.email}</p>
                </div>
              </div>
              <button className="text-gray-600 hover:text-gray-300 transition-colors mt-0.5">
                <MoreVertical size={16} />
              </button>
            </div>

            <div className="mt-4 flex items-center justify-between">
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${roleBadgeStyle[user.role]}`}>
                {user.role}
              </span>
              <div className="flex items-center gap-1.5">
                {user.isActive ? (
                  <CheckCircle2 size={13} className="text-emerald-500" />
                ) : (
                  <XCircle size={13} className="text-gray-600" />
                )}
                <span className={`text-xs ${user.isActive ? 'text-emerald-500' : 'text-gray-600'}`}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
            </div>

            <div className="mt-3 pt-3 border-t border-white/[0.06] flex items-center justify-between">
              <span className="text-[10px] text-gray-600">
                {user.department ?? '—'}
              </span>
              <span className="text-[10px] text-gray-600">
                Joined {formatDate(user.createdAt)}
              </span>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Add User Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Add Team Member">
        <form onSubmit={handleAddUser} className="space-y-4">
          <Input
            label="Full Name"
            placeholder="Jane Smith"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
          <Input
            label="Email"
            type="email"
            placeholder="jane@company.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
          <Select
            label="Role"
            options={ROLE_OPTIONS}
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value as UserRole })}
          />
          <Input
            label="Department"
            placeholder="Claims Processing"
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
          />
          <div className="flex justify-end gap-3 pt-2">
            <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add Member</Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

import { useState } from 'react';
import { FileText, Plus, Copy, Edit, Trash2, CheckCircle, Star, Search } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { cn } from '@/utils/cn';
import { useToast } from '@/context/ToastContext';

interface ClaimTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  fields: { key: string; label: string; value: string }[];
  usageCount: number;
  isFavorite: boolean;
  lastUsed: string;
  tags: string[];
}

const TEMPLATES: ClaimTemplate[] = [
  {
    id: 't1',
    name: 'Auto Collision — Standard',
    category: 'Auto',
    description: 'Standard template for minor to moderate vehicle collision claims with clear liability',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'auto_collision' },
      { key: 'description', label: 'Description', value: 'Vehicle involved in collision. Driver reported no injuries. Police report filed at the scene. Damage to [describe area] requires immediate assessment.' },
      { key: 'priority', label: 'Processing Priority', value: 'Standard' },
      { key: 'docs_required', label: 'Required Documents', value: 'Police report, Photos of damage, Repair estimate, Witness statements' },
    ],
    usageCount: 124,
    isFavorite: true,
    lastUsed: '2 hours ago',
    tags: ['auto', 'collision', 'standard'],
  },
  {
    id: 't2',
    name: 'Auto Theft — Complete',
    category: 'Auto',
    description: 'Comprehensive template for vehicle theft claims including police report verification',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'auto_theft' },
      { key: 'description', label: 'Description', value: 'Vehicle reported stolen. Police report filed. Last known location: [location]. Vehicle make/model/year: [details].' },
      { key: 'priority', label: 'Processing Priority', value: 'High' },
      { key: 'docs_required', label: 'Required Documents', value: 'Police report, Vehicle registration, Spare key documentation, Security footage if available' },
    ],
    usageCount: 67,
    isFavorite: true,
    lastUsed: '1 day ago',
    tags: ['auto', 'theft', 'high-priority'],
  },
  {
    id: 't3',
    name: 'Property Water Damage',
    category: 'Property',
    description: 'For claims involving water damage from burst pipes, flooding, or plumbing failures',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'property_damage' },
      { key: 'description', label: 'Description', value: 'Property damage resulting from water intrusion. Source: [burst pipe/flood/appliance failure]. Affected areas: [rooms]. Estimated damage: [assessment].' },
      { key: 'priority', label: 'Processing Priority', value: 'Urgent' },
      { key: 'docs_required', label: 'Required Documents', value: 'Plumber report, Photos of damage, Contractor estimate, Inventory of damaged items' },
    ],
    usageCount: 89,
    isFavorite: false,
    lastUsed: '3 days ago',
    tags: ['property', 'water', 'urgent'],
  },
  {
    id: 't4',
    name: 'Medical — Outpatient',
    category: 'Medical',
    description: 'Standard medical claim template for outpatient procedures and treatments',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'medical' },
      { key: 'description', label: 'Description', value: 'Outpatient medical treatment claim. Provider: [hospital/clinic name]. Date of service: [date]. Diagnosis code: [ICD-10]. Treatment: [procedure].' },
      { key: 'priority', label: 'Processing Priority', value: 'Standard' },
      { key: 'docs_required', label: 'Required Documents', value: 'EOB from provider, Medical bills, Physician notes, Prescription receipts' },
    ],
    usageCount: 201,
    isFavorite: true,
    lastUsed: '5 hours ago',
    tags: ['medical', 'outpatient', 'standard'],
  },
  {
    id: 't5',
    name: 'Natural Disaster — Fast Track',
    category: 'Disaster',
    description: 'Expedited processing template for claims in declared disaster areas',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'natural_disaster' },
      { key: 'description', label: 'Description', value: 'Property damage resulting from [disaster type] in declared disaster area [FEMA DR-XXXX]. Immediate temporary living expenses required.' },
      { key: 'priority', label: 'Processing Priority', value: 'Emergency' },
      { key: 'docs_required', label: 'Required Documents', value: 'FEMA registration, Property assessment, Contractor emergency estimate, Displacement receipts' },
    ],
    usageCount: 34,
    isFavorite: false,
    lastUsed: '2 weeks ago',
    tags: ['disaster', 'emergency', 'fast-track'],
  },
  {
    id: 't6',
    name: 'Liability — Third Party',
    category: 'Liability',
    description: 'For claims where a third party is claiming damages against our policyholder',
    fields: [
      { key: 'type', label: 'Claim Type', value: 'liability' },
      { key: 'description', label: 'Description', value: 'Third-party liability claim filed against policy holder [name]. Claimant: [third party name]. Alleged incident: [description]. Liability determination pending.' },
      { key: 'priority', label: 'Processing Priority', value: 'High — Legal Review Required' },
      { key: 'docs_required', label: 'Required Documents', value: 'Incident report, Third party contact info, Legal correspondence, Photos/evidence' },
    ],
    usageCount: 45,
    isFavorite: false,
    lastUsed: '1 week ago',
    tags: ['liability', 'legal', 'third-party'],
  },
];

const CATEGORIES = ['All', 'Auto', 'Property', 'Medical', 'Disaster', 'Liability'];

const categoryColors: Record<string, string> = {
  Auto: '#3B82F6',
  Property: '#8B5CF6',
  Medical: '#10B981',
  Disaster: '#EF4444',
  Liability: '#F59E0B',
};

export const ClaimTemplates = () => {
  const { success } = useToast();
  const [templates, setTemplates] = useState(TEMPLATES);
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [preview, setPreview] = useState<ClaimTemplate | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [newName, setNewName] = useState('');
  const [newDesc, setNewDesc] = useState('');
  const [newCategory, setNewCategory] = useState('Auto');

  const filtered = templates.filter((t) => {
    const matchSearch = !search || t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.tags.some((tag) => tag.includes(search.toLowerCase()));
    const matchCat = category === 'All' || t.category === category;
    return matchSearch && matchCat;
  });

  const favorites = filtered.filter((t) => t.isFavorite);
  const rest = filtered.filter((t) => !t.isFavorite);

  const toggleFavorite = (id: string) => {
    setTemplates((prev) => prev.map((t) => t.id === id ? { ...t, isFavorite: !t.isFavorite } : t));
  };

  const handleApply = (template: ClaimTemplate) => {
    setTemplates((prev) => prev.map((t) => t.id === template.id ? { ...t, usageCount: t.usageCount + 1, lastUsed: 'just now' } : t));
    success('Template Applied', `"${template.name}" loaded into claim form`);
    setPreview(null);
  };

  const handleCreate = () => {
    if (!newName.trim()) return;
    const newTemplate: ClaimTemplate = {
      id: `t_${Date.now()}`,
      name: newName,
      category: newCategory,
      description: newDesc,
      fields: [
        { key: 'type', label: 'Claim Type', value: newCategory.toLowerCase() },
        { key: 'description', label: 'Description', value: 'Custom template — fill in details' },
      ],
      usageCount: 0,
      isFavorite: false,
      lastUsed: 'Never',
      tags: [newCategory.toLowerCase(), 'custom'],
    };
    setTemplates((prev) => [newTemplate, ...prev]);
    setShowCreate(false);
    setNewName('');
    setNewDesc('');
    success('Template Created', `"${newName}" added to your templates`);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="text-base font-bold text-gray-200 flex items-center gap-2">
            <FileText size={18} className="text-[#10B981]" /> Claim Templates
          </h3>
          <p className="text-xs text-gray-500 mt-0.5">{templates.length} templates · Reduces filing time by 65%</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowCreate(true)}>
          Create Template
        </Button>
      </div>

      {/* Search + Category filter */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search templates or tags..."
            className="w-full h-9 rounded-lg border border-white/[0.07] bg-white/[0.04] pl-8 pr-4 text-xs text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-all"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={cn(
                'px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border transition-all',
                category === cat
                  ? 'bg-[#10B981]/15 border-[#10B981]/30 text-[#10B981]'
                  : 'border-white/[0.07] text-gray-500 hover:text-gray-300'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Favorites */}
      {favorites.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">Favorites</p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {favorites.map((t) => <TemplateCard key={t.id} template={t} onPreview={setPreview} onFavorite={toggleFavorite} />)}
          </div>
        </div>
      )}

      {/* All templates */}
      {rest.length > 0 && (
        <div>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3">
            {favorites.length > 0 ? 'More Templates' : 'All Templates'}
          </p>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
            {rest.map((t) => <TemplateCard key={t.id} template={t} onPreview={setPreview} onFavorite={toggleFavorite} />)}
          </div>
        </div>
      )}

      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 rounded-xl border border-dashed border-white/[0.08]">
          <FileText size={32} className="text-gray-700 mb-3" />
          <p className="text-sm text-gray-500">No templates match your search</p>
        </div>
      )}

      {/* Preview modal */}
      <Modal isOpen={!!preview} onClose={() => setPreview(null)} title={preview?.name ?? ''}>
        {preview && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${categoryColors[preview.category] ?? '#6B7280'}20`, color: categoryColors[preview.category] ?? '#6B7280' }}>
                {preview.category}
              </span>
              {preview.tags.map((tag) => (
                <span key={tag} className="text-[9px] px-2 py-0.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-gray-500">#{tag}</span>
              ))}
            </div>
            <p className="text-sm text-gray-400">{preview.description}</p>
            <div className="space-y-3">
              <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Pre-filled Fields</p>
              {preview.fields.map((field) => (
                <div key={field.key} className="rounded-lg bg-white/[0.02] border border-white/[0.05] p-3">
                  <p className="text-[10px] font-bold text-gray-500 uppercase mb-1">{field.label}</p>
                  <p className="text-xs text-gray-300">{field.value}</p>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
              <p className="text-[10px] text-gray-600">Used {preview.usageCount} times · {preview.lastUsed}</p>
              <div className="flex gap-2">
                <Button variant="secondary" size="sm" leftIcon={<Copy size={13} />} onClick={() => { success('Copied', 'Template fields copied'); setPreview(null); }}>
                  Duplicate
                </Button>
                <Button size="sm" leftIcon={<CheckCircle size={13} />} onClick={() => handleApply(preview)}>
                  Apply Template
                </Button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Create modal */}
      <Modal isOpen={showCreate} onClose={() => setShowCreate(false)} title="Create New Template">
        <div className="space-y-4">
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Template Name</label>
            <input
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="e.g., Auto Collision — Fast Track"
              className="w-full h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40"
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Category</label>
            <select
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              className="w-full h-9 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 text-sm text-gray-300 focus:outline-none focus:border-[#10B981]/40 appearance-none"
            >
              {CATEGORIES.filter((c) => c !== 'All').map((c) => <option key={c} value={c} className="bg-[#0F1629]">{c}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] font-bold text-gray-500 uppercase tracking-widest block mb-1.5">Description</label>
            <textarea
              value={newDesc}
              onChange={(e) => setNewDesc(e.target.value)}
              placeholder="Describe when to use this template..."
              rows={3}
              className="w-full rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none"
            />
          </div>
          <div className="flex justify-end gap-3 pt-2 border-t border-white/[0.06]">
            <Button variant="secondary" onClick={() => setShowCreate(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={!newName.trim()}>Create Template</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function TemplateCard({ template, onPreview, onFavorite }: { template: ClaimTemplate; onPreview: (t: ClaimTemplate) => void; onFavorite: (id: string) => void }) {
  const { success } = useToast();
  const catColor = categoryColors[template.category] ?? '#6B7280';

  return (
    <GlassPanel hoverable className="group cursor-pointer" >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="p-2 rounded-lg shrink-0" style={{ backgroundColor: `${catColor}15` }}>
            <FileText size={14} style={{ color: catColor }} />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-200 truncate">{template.name}</p>
            <p className="text-[9px]" style={{ color: catColor }}>{template.category}</p>
          </div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); onFavorite(template.id); }}
          className={cn('p-1 rounded shrink-0', template.isFavorite ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400')}
        >
          <Star size={14} fill={template.isFavorite ? 'currentColor' : 'none'} />
        </button>
      </div>

      <p className="text-[10px] text-gray-500 leading-relaxed mb-3 line-clamp-2">{template.description}</p>

      <div className="flex flex-wrap gap-1 mb-3">
        {template.tags.slice(0, 3).map((tag) => (
          <span key={tag} className="text-[9px] px-1.5 py-0.5 rounded bg-white/[0.04] border border-white/[0.05] text-gray-600">#{tag}</span>
        ))}
      </div>

      <div className="flex items-center justify-between pt-3 border-t border-white/[0.06]">
        <p className="text-[9px] text-gray-700">Used {template.usageCount}x · {template.lastUsed}</p>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); success('Copied', 'Template duplicated'); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
            title="Duplicate"
          >
            <Copy size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-gray-300 hover:bg-white/[0.08] transition-colors"
            title="Edit"
          >
            <Edit size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); success('Removed', 'Template deleted'); }}
            className="p-1.5 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-colors"
            title="Delete"
          >
            <Trash2 size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onPreview(template); }}
            className="px-2 py-1 rounded-lg text-[9px] font-bold bg-[#10B981]/15 text-[#10B981] hover:bg-[#10B981]/25 transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </GlassPanel>
  );
}

import { useState } from 'react';
import { Package, Plus, Edit, TrendingUp, BarChart3, Star, Archive, Eye } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { Input } from '@/components/ui/Input';
import { useToast } from '@/context/ToastContext';
import { cn } from '@/utils/cn';

interface Product {
  id: string;
  name: string;
  type: string;
  status: 'active' | 'draft' | 'archived';
  basePremium: number;
  policyCount: number;
  revenue: number;
  avgRiskScore: number;
  claimRate: number;
  launched: string;
  description: string;
  isPopular: boolean;
}

const PRODUCTS: Product[] = [
  { id: '1', name: 'AutoGuard Basic',     type: 'Auto',     status: 'active',   basePremium: 1200, policyCount: 4521, revenue: 5425200,  avgRiskScore: 42, claimRate: 8.2,  launched: '2022-01-01', description: 'Essential auto coverage at an affordable price.',      isPopular: true  },
  { id: '2', name: 'AutoGuard Premium',   type: 'Auto',     status: 'active',   basePremium: 2400, policyCount: 2108, revenue: 5059200,  avgRiskScore: 35, claimRate: 6.1,  launched: '2022-01-01', description: 'Comprehensive auto protection with full coverage.',       isPopular: false },
  { id: '3', name: 'HomeShield Standard', type: 'Home',     status: 'active',   basePremium: 1800, policyCount: 3245, revenue: 5841000,  avgRiskScore: 38, claimRate: 5.4,  launched: '2021-06-01', description: 'Complete home and contents protection.',                  isPopular: false },
  { id: '4', name: 'HealthPlus Basic',    type: 'Health',   status: 'active',   basePremium: 3600, policyCount: 1876, revenue: 6753600,  avgRiskScore: 51, claimRate: 14.2, launched: '2022-03-01', description: 'Affordable health coverage with essential benefits.',      isPopular: true  },
  { id: '5', name: 'LifeSecure Term',     type: 'Life',     status: 'draft',    basePremium: 900,  policyCount: 0,    revenue: 0,        avgRiskScore: 0,  claimRate: 0,    launched: '—',          description: 'Term life insurance with flexible coverage amounts.',     isPopular: false },
  { id: '6', name: 'BusinessPro',         type: 'Business', status: 'archived', basePremium: 6000, policyCount: 234,  revenue: 1404000,  avgRiskScore: 58, claimRate: 11.3, launched: '2020-01-01', description: 'Comprehensive business liability and property coverage.',  isPopular: false },
];

const statusStyle: Record<string, string> = {
  active:   'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  draft:    'text-amber-400 bg-amber-500/10 border-amber-500/20',
  archived: 'text-gray-500 bg-gray-500/10 border-gray-500/20',
};

const typeColors: Record<string, string> = {
  Auto: 'text-blue-400', Home: 'text-purple-400', Health: 'text-emerald-400', Life: 'text-amber-400', Business: 'text-red-400',
};

export const ProductCatalog = () => {
  const { success } = useToast();
  const [products, setProducts] = useState<Product[]>(PRODUCTS);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [filterStatus, setFilterStatus] = useState<'all' | Product['status']>('all');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [newProduct, setNewProduct] = useState({ name: '', type: 'Auto', description: '', basePremium: '' });

  const filtered = filterStatus === 'all' ? products : products.filter(p => p.status === filterStatus);

  const addProduct = (e: React.FormEvent) => {
    e.preventDefault();
    const p: Product = {
      id: `p_${Date.now()}`, name: newProduct.name, type: newProduct.type,
      status: 'draft', basePremium: Number(newProduct.basePremium), policyCount: 0,
      revenue: 0, avgRiskScore: 0, claimRate: 0, launched: '—',
      description: newProduct.description, isPopular: false,
    };
    setProducts(prev => [...prev, p]);
    setShowAdd(false);
    setNewProduct({ name: '', type: 'Auto', description: '', basePremium: '' });
    success('Product created', `"${p.name}" added as a draft.`);
  };

  const archiveProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'archived' } : p));
    success('Product archived', 'Product moved to archive.');
  };

  const launchProduct = (id: string) => {
    setProducts(prev => prev.map(p => p.id === id ? { ...p, status: 'active', launched: new Date().toLocaleDateString() } : p));
    success('Product launched!', 'Product is now live and available to customers.');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-white">Product Catalog</h2>
          <p className="text-sm text-gray-500 mt-0.5">Manage insurance products, their pricing, and lifecycle.</p>
        </div>
        <Button size="sm" leftIcon={<Plus size={14} />} onClick={() => setShowAdd(true)}>New Product</Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Active Products',  value: products.filter(p => p.status === 'active').length,      color: 'text-emerald-400' },
          { label: 'Total Policies',   value: products.reduce((s, p) => s + p.policyCount, 0).toLocaleString(), color: 'text-white' },
          { label: 'Annual Revenue',   value: `$${(products.reduce((s, p) => s + p.revenue, 0) / 1000000).toFixed(1)}M`, color: 'text-white' },
          { label: 'Draft Products',   value: products.filter(p => p.status === 'draft').length,       color: 'text-amber-400' },
        ].map(s => (
          <GlassPanel key={s.label} className="text-center py-4">
            <p className={cn('text-2xl font-bold', s.color)}>{s.value}</p>
            <p className="text-xs text-gray-500 mt-1">{s.label}</p>
          </GlassPanel>
        ))}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="flex gap-1 rounded-xl bg-white/[0.03] border border-white/[0.06] p-1">
          {(['all', 'active', 'draft', 'archived'] as const).map(s => (
            <button key={s} onClick={() => setFilterStatus(s)}
              className={cn('px-3 py-1.5 rounded-lg text-xs font-semibold capitalize transition-all', filterStatus === s ? 'bg-white/[0.08] text-gray-100' : 'text-gray-500 hover:text-gray-300')}>
              {s}
            </button>
          ))}
        </div>
        <div className="ml-auto flex gap-1 rounded-lg bg-white/[0.03] border border-white/[0.06] p-1">
          <button onClick={() => setView('grid')} className={cn('p-1.5 rounded transition-all', view === 'grid' ? 'bg-white/[0.08]' : 'text-gray-600 hover:text-gray-300')}><Package size={14} /></button>
          <button onClick={() => setView('list')} className={cn('p-1.5 rounded transition-all', view === 'list' ? 'bg-white/[0.08]' : 'text-gray-600 hover:text-gray-300')}><BarChart3 size={14} /></button>
        </div>
      </div>

      {/* Products */}
      <div className={view === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4' : 'space-y-3'}>
        {filtered.map(p => (
          <GlassPanel key={p.id} hoverable className={cn(p.status === 'archived' && 'opacity-60')}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className={cn('text-xs font-bold uppercase tracking-wider', typeColors[p.type])}>{p.type}</span>
                  {p.isPopular && <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-400"><Star size={10} />Popular</span>}
                </div>
                <h3 className="text-sm font-bold text-gray-200 mt-0.5">{p.name}</h3>
              </div>
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase border', statusStyle[p.status])}>{p.status}</span>
            </div>
            <p className="text-xs text-gray-500 mb-4">{p.description}</p>
            {p.status !== 'draft' && (
              <div className="grid grid-cols-3 gap-2 mb-4 py-3 border-y border-white/[0.05]">
                <div className="text-center"><p className="text-sm font-bold text-white">{p.policyCount.toLocaleString()}</p><p className="text-[10px] text-gray-600">Policies</p></div>
                <div className="text-center"><p className="text-sm font-bold text-white">{p.claimRate}%</p><p className="text-[10px] text-gray-600">Claim Rate</p></div>
                <div className="text-center"><p className="text-sm font-bold text-[#10B981]">${(p.basePremium / 12).toFixed(0)}/mo</p><p className="text-[10px] text-gray-600">Base</p></div>
              </div>
            )}
            <div className="flex gap-2">
              <Button variant="secondary" size="sm" className="flex-1" leftIcon={<Eye size={12} />} onClick={() => setSelectedProduct(p)}>Details</Button>
              {p.status === 'draft' && <Button size="sm" className="flex-1" leftIcon={<TrendingUp size={12} />} onClick={() => launchProduct(p.id)}>Launch</Button>}
              {p.status === 'active' && <Button variant="secondary" size="sm" leftIcon={<Edit size={12} />} onClick={() => success('Edit mode', 'Product editor opened.')}>Edit</Button>}
              {p.status === 'active' && <Button variant="danger" size="sm" leftIcon={<Archive size={12} />} onClick={() => archiveProduct(p.id)}>Archive</Button>}
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Add Product Modal */}
      <Modal isOpen={showAdd} onClose={() => setShowAdd(false)} title="New Product" size="md">
        <form onSubmit={addProduct} className="space-y-4">
          <Input label="Product Name" placeholder="e.g. AutoGuard Elite" value={newProduct.name} onChange={e => setNewProduct({ ...newProduct, name: e.target.value })} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Policy Type</label>
            <div className="grid grid-cols-5 gap-2">
              {['Auto', 'Home', 'Health', 'Life', 'Business'].map(t => (
                <button key={t} type="button" onClick={() => setNewProduct({ ...newProduct, type: t })}
                  className={cn('py-2 rounded-lg text-xs font-semibold border transition-all', newProduct.type === t ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]' : 'border-white/[0.06] text-gray-500 hover:text-gray-300')}>
                  {t}
                </button>
              ))}
            </div>
          </div>
          <Input label="Base Premium ($/yr)" type="number" placeholder="1200" value={newProduct.basePremium} onChange={e => setNewProduct({ ...newProduct, basePremium: e.target.value })} required />
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Description</label>
            <textarea rows={2} value={newProduct.description} onChange={e => setNewProduct({ ...newProduct, description: e.target.value })}
              placeholder="Brief product description..."
              className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-[#10B981]/40 resize-none" />
          </div>
          <div className="flex justify-end gap-3">
            <Button type="button" variant="secondary" onClick={() => setShowAdd(false)}>Cancel</Button>
            <Button type="submit">Create Draft</Button>
          </div>
        </form>
      </Modal>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <Modal isOpen={!!selectedProduct} onClose={() => setSelectedProduct(null)} title={selectedProduct.name} size="lg">
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Policy Type', value: selectedProduct.type },
                { label: 'Status', value: selectedProduct.status },
                { label: 'Base Premium', value: `$${selectedProduct.basePremium.toLocaleString()}/yr` },
                { label: 'Launched', value: selectedProduct.launched },
                { label: 'Active Policies', value: selectedProduct.policyCount.toLocaleString() },
                { label: 'Annual Revenue', value: `$${(selectedProduct.revenue / 1000000).toFixed(2)}M` },
                { label: 'Claim Rate', value: `${selectedProduct.claimRate}%` },
                { label: 'Avg Risk Score', value: selectedProduct.avgRiskScore || '—' },
              ].map(item => (
                <div key={item.label} className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.05]">
                  <p className="text-[10px] text-gray-600 uppercase tracking-wider">{item.label}</p>
                  <p className="text-sm font-bold text-gray-200 mt-1">{item.value}</p>
                </div>
              ))}
            </div>
            <div className="flex gap-3">
              <Button className="flex-1" onClick={() => { success('Saved', 'Changes saved.'); setSelectedProduct(null); }}>Save Changes</Button>
              <Button variant="secondary" onClick={() => setSelectedProduct(null)}>Close</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

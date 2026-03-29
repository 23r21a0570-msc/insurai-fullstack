import { useState } from 'react';
import { Link2, Cpu, CheckCircle, Clock, Copy, ExternalLink, Zap, Shield, DollarSign, RefreshCw } from 'lucide-react';
import { cn } from '@/utils/cn';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { useToast } from '@/context/ToastContext';

const TABS = ['Smart Contracts', 'Transactions', 'Tokens & Wallets', 'Audit Trail'];

const smartContracts = [
  {
    id: 'sc_001', name: 'Auto-Claim Settlement',
    address: '0x742d35Cc6634C0532925a3b8D4C9E9a1234AbCd',
    network: 'Ethereum', status: 'active', version: 'v2.1.0',
    description: 'Automatically executes payment when all conditions are met and claim is approved',
    conditions: ['AI fraud score < 30', 'Claim amount ≤ $25,000', 'Policy is active', 'Adjuster approved'],
    executions: 1247, successRate: 99.8, savedTime: '4.2 hrs avg',
  },
  {
    id: 'sc_002', name: 'Policy Renewal Automation',
    address: '0x8B3a21Ff9845C12d4e7B90a5678CdEf01234567',
    network: 'Ethereum', status: 'active', version: 'v1.5.2',
    description: 'Automatically renews policies 30 days before expiry and processes payment',
    conditions: ['Policy expiry ≤ 30 days', 'Auto-renew enabled', 'Payment method valid', 'No outstanding claims'],
    executions: 3891, successRate: 99.1, savedTime: '2.1 hrs avg',
  },
  {
    id: 'sc_003', name: 'Fraud Freeze Protocol',
    address: '0x1C4f87Aa2356D89e7f3c0b1234EfGh56789012',
    network: 'Ethereum', status: 'active', version: 'v3.0.0',
    description: 'Automatically freezes claim and notifies investigation team when fraud score > 80',
    conditions: ['Fraud score > 80', 'Duplicate claim detected', 'Geolocation mismatch'],
    executions: 234, successRate: 100, savedTime: '12.5 hrs avg',
  },
  {
    id: 'sc_004', name: 'Reinsurance Treaty',
    address: '0x5D9c44Bb7812E56a9f1d2345AbCd67890EfGh12',
    network: 'Hyperledger', status: 'paused', version: 'v1.0.1',
    description: 'Manages reinsurance cession and recovery with partner reinsurers automatically',
    conditions: ['Claim > $100,000', 'Catastrophe event triggered', 'Treaty threshold reached'],
    executions: 18, successRate: 100, savedTime: '48 hrs avg',
  },
];

const recentTxs = [
  { hash: '0x1a2b3c...4d5e6f', type: 'Claim Payment', amount: '$4,250', status: 'confirmed', time: '2m ago', gas: '0.003 ETH', block: 18942301 },
  { hash: '0x7g8h9i...0j1k2l', type: 'Policy Renewal', amount: '$185/mo', status: 'confirmed', time: '8m ago', gas: '0.002 ETH', block: 18942289 },
  { hash: '0x3m4n5o...6p7q8r', type: 'Fraud Freeze', amount: '$32,000', status: 'pending', time: '12m ago', gas: '0.004 ETH', block: 18942275 },
  { hash: '0x9s0t1u...2v3w4x', type: 'Claim Payment', amount: '$8,100', status: 'confirmed', time: '25m ago', gas: '0.003 ETH', block: 18942240 },
  { hash: '0x5y6z7a...8b9c0d', type: 'Reinsurance', amount: '$125,000', status: 'failed', time: '1h ago', gas: '0.005 ETH', block: 18942180 },
  { hash: '0x1e2f3g...4h5i6j', type: 'Policy Renewal', amount: '$320/mo', status: 'confirmed', time: '1.5h ago', gas: '0.002 ETH', block: 18942100 },
];

const wallets = [
  { name: 'Operations Wallet', address: '0xAb12...Cd34', balance: '124.5 ETH', usd: '$312,450', type: 'Hot Wallet', txCount: 8942 },
  { name: 'Claims Reserve', address: '0xEf56...Gh78', balance: '2,450 ETH', usd: '$6,145,000', type: 'Multi-sig', txCount: 1247 },
  { name: 'Reinsurance Escrow', address: '0xIj90...Kl12', balance: '890 ETH', usd: '$2,232,500', type: 'Cold Wallet', txCount: 18 },
  { name: 'Gas Reserve', address: '0xMn34...Op56', balance: '45.2 ETH', usd: '$113,475', type: 'Hot Wallet', txCount: 28450 },
];

export const Blockchain = () => {
  const [activeTab, setActiveTab] = useState('Smart Contracts');
  const [expandedContract, setExpandedContract] = useState<string | null>('sc_001');
  const { success } = useToast();

  const copyAddress = (addr: string) => {
    navigator.clipboard.writeText(addr);
    success('Copied', 'Address copied to clipboard');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Link2 className="text-violet-400" size={28} /> Blockchain & Smart Contracts
          </h1>
          <p className="text-sm text-gray-500 mt-1">Immutable records, automated execution, and decentralized trust</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-violet-400 bg-violet-400/10 px-3 py-1.5 rounded-full border border-violet-400/20">
            Ethereum Mainnet
          </span>
          <span className="flex items-center gap-1.5 text-xs text-[#10B981] bg-[#10B981]/10 px-3 py-1.5 rounded-full border border-[#10B981]/20">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" /> Node Synced
          </span>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Smart Contracts', value: '4', icon: Cpu, color: 'violet' },
          { label: 'Total Executions', value: '5,390', icon: Zap, color: 'amber' },
          { label: 'Auto-Settled Claims', value: '$2.8M', icon: DollarSign, color: 'emerald' },
          { label: 'Avg Settlement Time', value: '< 30s', icon: Clock, color: 'blue' },
        ].map(s => (
          <GlassPanel key={s.label}>
            <div className="flex items-center gap-3">
              <div className={cn('p-2.5 rounded-xl', {
                'bg-violet-500/10 text-violet-400': s.color === 'violet',
                'bg-amber-500/10 text-amber-400': s.color === 'amber',
                'bg-[#10B981]/10 text-[#10B981]': s.color === 'emerald',
                'bg-blue-500/10 text-blue-400': s.color === 'blue',
              })}>
                <s.icon size={20} />
              </div>
              <div>
                <p className="text-2xl font-bold">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            </div>
          </GlassPanel>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 border-b border-white/10 pb-0">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              'px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-all border-b-2 -mb-px',
              activeTab === tab ? 'border-violet-400 text-violet-400' : 'border-transparent text-gray-500 hover:text-gray-300'
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Smart Contracts Tab */}
      {activeTab === 'Smart Contracts' && (
        <div className="space-y-4">
          {smartContracts.map(contract => (
            <GlassPanel key={contract.id} className={cn(contract.status === 'paused' && 'opacity-70')}>
              <div
                className="flex items-start justify-between cursor-pointer"
                onClick={() => setExpandedContract(expandedContract === contract.id ? null : contract.id)}
              >
                <div className="flex items-start gap-4">
                  <div className={cn('p-2.5 rounded-xl mt-0.5', contract.status === 'active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-500')}>
                    <Cpu size={20} />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold">{contract.name}</h3>
                      <span className={cn('text-[10px] px-2 py-0.5 rounded font-bold uppercase', contract.status === 'active' ? 'bg-[#10B981]/10 text-[#10B981]' : 'bg-gray-500/10 text-gray-400')}>
                        {contract.status}
                      </span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-violet-500/10 text-violet-400 font-mono">{contract.version}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-blue-500/10 text-blue-400">{contract.network}</span>
                    </div>
                    <p className="text-xs text-gray-500">{contract.description}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <code className="text-[10px] text-gray-600 font-mono">{contract.address.slice(0, 20)}...</code>
                      <button onClick={(e) => { e.stopPropagation(); copyAddress(contract.address); }} className="text-gray-600 hover:text-white transition-colors">
                        <Copy size={12} />
                      </button>
                      <button onClick={(e) => e.stopPropagation()} className="text-gray-600 hover:text-blue-400 transition-colors">
                        <ExternalLink size={12} />
                      </button>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-right">
                  <div>
                    <p className="text-lg font-bold">{contract.executions.toLocaleString()}</p>
                    <p className="text-xs text-gray-500">Executions</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-[#10B981]">{contract.successRate}%</p>
                    <p className="text-xs text-gray-500">Success</p>
                  </div>
                </div>
              </div>

              {expandedContract === contract.id && (
                <div className="mt-4 pt-4 border-t border-white/5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Execution Conditions</p>
                      <div className="space-y-2">
                        {contract.conditions.map((cond, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <CheckCircle size={14} className="text-[#10B981] shrink-0" />
                            <span className="text-gray-300 font-mono text-xs">{cond}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Contract Code (Solidity Preview)</p>
                      <div className="bg-[#0A0F1A] rounded-xl p-4 font-mono text-xs text-gray-400 border border-white/5 overflow-x-auto">
                        <pre>{`function executeClaim(
  uint256 claimId,
  uint256 amount
) external onlyOracle {
  require(
    fraudScore[claimId] < 30,
    "Fraud risk too high"
  );
  require(amount <= 25000 ether);
  _transferFunds(
    claims[claimId].holder,
    amount
  );
  emit ClaimSettled(claimId, amount);
}`}</pre>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 mt-4">
                    <button className="text-xs px-4 py-2 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
                      View on Etherscan
                    </button>
                    <button className="text-xs px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors text-gray-300">
                      <RefreshCw size={12} className="inline mr-1" /> Upgrade Contract
                    </button>
                    {contract.status === 'active' ? (
                      <button className="text-xs px-4 py-2 rounded-lg bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 transition-colors">
                        Pause Contract
                      </button>
                    ) : (
                      <button className="text-xs px-4 py-2 rounded-lg bg-[#10B981]/10 text-[#10B981] hover:bg-[#10B981]/20 transition-colors">
                        Resume Contract
                      </button>
                    )}
                  </div>
                </div>
              )}
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Transactions Tab */}
      {activeTab === 'Transactions' && (
        <GlassPanel>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Recent On-Chain Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/5">
                  {['Tx Hash', 'Type', 'Amount', 'Status', 'Gas', 'Block', 'Time'].map(h => (
                    <th key={h} className="text-left py-3 px-3 text-[10px] font-bold text-gray-600 uppercase tracking-wider whitespace-nowrap">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {recentTxs.map((tx, i) => (
                  <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2">
                        <code className="text-xs text-violet-400 font-mono">{tx.hash}</code>
                        <button onClick={() => copyAddress(tx.hash)} className="text-gray-600 hover:text-white">
                          <Copy size={12} />
                        </button>
                      </div>
                    </td>
                    <td className="py-3 px-3 text-gray-300 text-xs">{tx.type}</td>
                    <td className="py-3 px-3 font-mono text-xs font-bold">{tx.amount}</td>
                    <td className="py-3 px-3">
                      <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold uppercase', {
                        'bg-[#10B981]/10 text-[#10B981]': tx.status === 'confirmed',
                        'bg-amber-500/10 text-amber-400': tx.status === 'pending',
                        'bg-red-500/10 text-red-400': tx.status === 'failed',
                      })}>
                        {tx.status}
                      </span>
                    </td>
                    <td className="py-3 px-3 text-xs text-gray-500 font-mono">{tx.gas}</td>
                    <td className="py-3 px-3 text-xs text-gray-500 font-mono">#{tx.block}</td>
                    <td className="py-3 px-3 text-xs text-gray-500">{tx.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </GlassPanel>
      )}

      {/* Wallets Tab */}
      {activeTab === 'Tokens & Wallets' && (
        <div className="space-y-4">
          {wallets.map(wallet => (
            <GlassPanel key={wallet.name}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 rounded-xl bg-violet-500/10 text-violet-400">
                    <Shield size={24} />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-bold">{wallet.name}</h3>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-400">{wallet.type}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <code className="text-xs text-gray-500 font-mono">{wallet.address}</code>
                      <button onClick={() => copyAddress(wallet.address)} className="text-gray-600 hover:text-white">
                        <Copy size={11} />
                      </button>
                    </div>
                    <p className="text-xs text-gray-600 mt-1">{wallet.txCount.toLocaleString()} transactions</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold font-mono">{wallet.balance}</p>
                  <p className="text-sm text-gray-500">{wallet.usd}</p>
                  <button className="mt-2 text-xs px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors">
                    View Transactions
                  </button>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* Audit Trail Tab */}
      {activeTab === 'Audit Trail' && (
        <GlassPanel>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">Immutable Blockchain Audit Trail</h3>
          <div className="space-y-3">
            {[
              { action: 'Contract Deployed', detail: 'Auto-Claim Settlement v2.1.0 deployed', actor: 'Maruthi (Admin)', time: '2024-01-15 09:23:41', blockHash: '0x1a2b...3c4d', immutable: true },
              { action: 'Claim Settled', detail: 'CLM-2024-1042 · $4,250 transferred to 0xAb...12', actor: 'Smart Contract', time: '2024-01-15 10:45:22', blockHash: '0x5e6f...7g8h', immutable: true },
              { action: 'Policy Renewed', detail: 'POL-8421 · Auto-renewal executed · $185/mo', actor: 'Smart Contract', time: '2024-01-15 11:02:15', blockHash: '0x9i0j...1k2l', immutable: true },
              { action: 'Fraud Freeze', detail: 'CLM-2024-1038 frozen · Score: 94/100', actor: 'Smart Contract', time: '2024-01-15 11:30:44', blockHash: '0x3m4n...5o6p', immutable: true },
              { action: 'Contract Paused', detail: 'Reinsurance Treaty paused for maintenance', actor: 'Maruthi (Admin)', time: '2024-01-15 13:15:00', blockHash: '0x7q8r...9s0t', immutable: true },
            ].map((entry, i) => (
              <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/5">
                <div className="flex flex-col items-center">
                  <div className="w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center">
                    <CheckCircle size={14} className="text-violet-400" />
                  </div>
                  {i < 4 && <div className="w-0.5 h-8 bg-white/5 mt-1" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="text-sm font-bold">{entry.action}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{entry.detail}</p>
                      <p className="text-xs text-gray-600 mt-1">By: {entry.actor}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 font-mono">{entry.time}</p>
                      <div className="flex items-center gap-1 justify-end mt-1">
                        <code className="text-[10px] text-violet-400 font-mono">{entry.blockHash}</code>
                        {entry.immutable && (
                          <span className="text-[10px] text-[#10B981] bg-[#10B981]/10 px-1.5 py-0.5 rounded">Immutable</span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </GlassPanel>
      )}
    </div>
  );
};

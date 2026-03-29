import { useState } from 'react';
import { BookOpen, Play, Users, Download, Search, Clock, Star, ChevronRight, Mic, BarChart2 } from 'lucide-react';
import { GlassPanel } from '@/components/ui/GlassPanel';
import { Button } from '@/components/ui/Button';
import { cn } from '@/utils/cn';

type ContentTab = 'articles' | 'videos' | 'webinars' | 'calculators' | 'glossary';

// ─── Data ──────────────────────────────────────────────────────────────────────
const ARTICLES = [
  { id: 'a1', title: 'How Your Deductible Affects Your Premium', category: 'Basics', read: '4 min', rating: 4.8, popular: true },
  { id: 'a2', title: 'Understanding Coverage Limits', category: 'Basics', read: '6 min', rating: 4.6, popular: false },
  { id: 'a3', title: 'What to Do After a Car Accident', category: 'Claims', read: '5 min', rating: 4.9, popular: true },
  { id: 'a4', title: 'Home Insurance vs Renters Insurance', category: 'Policies', read: '7 min', rating: 4.5, popular: false },
  { id: 'a5', title: 'How Bundling Saves You Money', category: 'Savings', read: '3 min', rating: 4.7, popular: true },
  { id: 'a6', title: 'Life Events That Should Trigger a Policy Review', category: 'Tips', read: '5 min', rating: 4.4, popular: false },
  { id: 'a7', title: 'How Fraud Affects Your Premiums', category: 'Industry', read: '8 min', rating: 4.3, popular: false },
  { id: 'a8', title: 'The Claim Filing Checklist Every Policyholder Needs', category: 'Claims', read: '4 min', rating: 4.9, popular: true },
];

const VIDEOS = [
  { id: 'v1', title: 'Filing Your First Claim — Step by Step', duration: '6:24', views: '12.4K', thumbnail: '🎬' },
  { id: 'v2', title: 'How to Read Your Policy Document',        duration: '8:10', views: '9.2K',  thumbnail: '📄' },
  { id: 'v3', title: 'Setting Up Auto-Pay & Never Missing a Payment', duration: '3:45', views: '7.8K', thumbnail: '💳' },
  { id: 'v4', title: 'What Is Comprehensive Coverage?',         duration: '5:32', views: '11.1K', thumbnail: '🚗' },
  { id: 'v5', title: 'Understanding Your Explanation of Benefits', duration: '7:05', views: '6.3K', thumbnail: '📋' },
  { id: 'v6', title: 'Comparing Plans on the Policy Comparison Tool', duration: '4:20', views: '5.9K', thumbnail: '⚖️' },
];

const WEBINARS = [
  { id: 'w1', title: 'Live Q&A: Understanding Your Auto Policy', date: 'Jan 28, 2026', time: '6:00 PM ET', host: 'Sarah M.', spots: 47, status: 'upcoming' },
  { id: 'w2', title: 'Home Insurance 101 — Everything You Need to Know', date: 'Feb 4, 2026', time: '7:00 PM ET', host: 'James K.', spots: 82, status: 'upcoming' },
  { id: 'w3', title: 'How to Lower Your Premium Without Losing Coverage', date: 'Jan 14, 2026', time: '6:00 PM ET', host: 'Emily T.', spots: 0, status: 'recorded' },
];

const GLOSSARY = [
  { term: 'Deductible', def: 'The amount you pay out-of-pocket before your insurance covers the rest of a claim.' },
  { term: 'Premium', def: 'The regular payment (monthly or annual) you make to keep your insurance policy active.' },
  { term: 'Coverage Limit', def: 'The maximum amount your insurer will pay for a covered loss.' },
  { term: 'Exclusion', def: 'Specific conditions or circumstances not covered by your policy.' },
  { term: 'Rider / Endorsement', def: 'An optional add-on that modifies or extends your base policy coverage.' },
  { term: 'Actuary', def: 'A professional who calculates insurance risk and premium rates using statistical data.' },
  { term: 'Subrogation', def: 'The right of the insurer to pursue a third party that caused an insurance loss.' },
  { term: 'Loss Ratio', def: 'The ratio of claims paid out by an insurer to premiums collected.' },
  { term: 'Underwriting', def: 'The process insurers use to evaluate risk and determine policy terms and premiums.' },
  { term: 'Claims Adjuster', def: 'A professional who investigates and settles insurance claims on behalf of the insurer.' },
];

const ARTICLE_CATEGORIES = ['All', 'Basics', 'Claims', 'Policies', 'Savings', 'Tips', 'Industry'];

// ─── Component ────────────────────────────────────────────────────────────────
export const Learn = () => {
  const [tab, setTab] = useState<ContentTab>('articles');
  const [search, setSearch] = useState('');
  const [articleCat, setArticleCat] = useState('All');

  const TABS: { id: ContentTab; label: string; icon: typeof BookOpen }[] = [
    { id: 'articles',    label: 'Articles',     icon: BookOpen },
    { id: 'videos',      label: 'Videos',       icon: Play },
    { id: 'webinars',    label: 'Webinars',      icon: Users },
    { id: 'calculators', label: 'Calculators',  icon: BarChart2 },
    { id: 'glossary',    label: 'Glossary',     icon: BookOpen },
  ];

  const filteredArticles = ARTICLES.filter((a) =>
    (articleCat === 'All' || a.category === articleCat) &&
    a.title.toLowerCase().includes(search.toLowerCase())
  );

  const filteredGlossary = GLOSSARY.filter((g) =>
    g.term.toLowerCase().includes(search.toLowerCase()) ||
    g.def.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <BookOpen className="text-[#10B981]" size={24} /> Education Hub
        </h1>
        <p className="text-sm text-gray-500 mt-1">Learn everything about insurance — articles, videos, webinars, and more.</p>
      </div>

      {/* Featured Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#10B981]/20 via-teal-500/10 to-transparent border border-[#10B981]/20 p-6">
        <div className="absolute right-0 top-0 h-full w-48 bg-gradient-to-l from-[#10B981]/5 to-transparent pointer-events-none" />
        <p className="text-[10px] font-bold text-[#10B981] uppercase tracking-widest mb-2">Featured</p>
        <h2 className="text-lg font-bold text-white mb-2">The Complete First-Time Claimant Guide</h2>
        <p className="text-sm text-gray-400 mb-4 max-w-md">Everything you need to know before, during, and after filing your first claim. Step-by-step, plain language.</p>
        <Button size="sm" className="gap-2">
          <BookOpen size={14} /> Read Now (12 min)
        </Button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={16} />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search articles, videos, terms…"
          className="w-full h-10 pl-9 pr-4 bg-white/[0.04] border border-white/[0.08] rounded-lg text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-[#10B981]/50 focus:border-[#10B981]/40"
        />
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.03] rounded-xl border border-white/[0.06] flex-wrap">
        {TABS.map((t) => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={cn(
                'flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all flex-1 justify-center',
                tab === t.id
                  ? 'bg-[#10B981] text-white shadow-lg shadow-[#10B981]/20'
                  : 'text-gray-500 hover:text-gray-200 hover:bg-white/5'
              )}
            >
              <Icon size={13} /> {t.label}
            </button>
          );
        })}
      </div>

      {/* ── Articles ── */}
      {tab === 'articles' && (
        <div className="space-y-4">
          {/* Category filter */}
          <div className="flex gap-2 flex-wrap">
            {ARTICLE_CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setArticleCat(cat)}
                className={cn(
                  'px-3 py-1 rounded-full text-xs font-semibold border transition-all',
                  articleCat === cat
                    ? 'bg-[#10B981]/10 border-[#10B981]/30 text-[#10B981]'
                    : 'bg-white/[0.03] border-white/[0.06] text-gray-500 hover:text-white'
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredArticles.map((a) => (
              <GlassPanel key={a.id} hoverable className="group cursor-pointer">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-[#10B981]/10 text-[#10B981] border border-[#10B981]/20">
                        {a.category}
                      </span>
                      {a.popular && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                          Popular
                        </span>
                      )}
                    </div>
                    <h3 className="text-sm font-semibold text-gray-200 group-hover:text-white transition-colors leading-snug">
                      {a.title}
                    </h3>
                  </div>
                  <ChevronRight size={16} className="text-gray-600 group-hover:text-[#10B981] transition-colors mt-1 shrink-0" />
                </div>
                <div className="flex items-center gap-4 mt-3 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1"><Clock size={11} /> {a.read}</span>
                  <span className="flex items-center gap-1"><Star size={11} className="text-yellow-500" /> {a.rating}</span>
                  <button className="flex items-center gap-1 text-gray-600 hover:text-[#10B981] transition-colors ml-auto">
                    <Download size={11} /> Save
                  </button>
                </div>
              </GlassPanel>
            ))}
          </div>
          {filteredArticles.length === 0 && (
            <p className="text-center text-sm text-gray-600 py-8">No articles match your search.</p>
          )}
        </div>
      )}

      {/* ── Videos ── */}
      {tab === 'videos' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {VIDEOS.map((v) => (
            <GlassPanel key={v.id} hoverable className="cursor-pointer group space-y-3">
              {/* Thumbnail */}
              <div className="h-32 rounded-xl bg-white/[0.04] border border-white/[0.06] flex items-center justify-center text-4xl group-hover:bg-white/[0.07] transition-colors relative">
                {v.thumbnail}
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-[#10B981] rounded-full p-3 shadow-lg">
                    <Play size={18} className="text-white" fill="white" />
                  </div>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-gray-200 leading-snug">{v.title}</h3>
                <div className="flex items-center gap-3 mt-2 text-[11px] text-gray-600">
                  <span className="flex items-center gap-1"><Clock size={11} /> {v.duration}</span>
                  <span className="flex items-center gap-1"><Play size={11} /> {v.views} views</span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── Webinars ── */}
      {tab === 'webinars' && (
        <div className="space-y-4">
          {WEBINARS.map((w) => (
            <GlassPanel key={w.id} className={cn('flex flex-col sm:flex-row sm:items-center justify-between gap-4', w.status === 'recorded' && 'opacity-60')}>
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  {w.status === 'upcoming' ? <Users size={20} className="text-blue-400" /> : <Mic size={20} className="text-gray-400" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{w.title}</h3>
                  <p className="text-xs text-gray-500 mt-1">{w.date} · {w.time} · Hosted by {w.host}</p>
                  {w.status === 'upcoming' && (
                    <p className="text-xs text-[#10B981] mt-1">{w.spots} spots remaining</p>
                  )}
                </div>
              </div>
              <div className="shrink-0">
                {w.status === 'upcoming' ? (
                  <Button size="sm" className="text-xs">Register Free</Button>
                ) : (
                  <Button size="sm" variant="secondary" className="text-xs gap-1">
                    <Play size={12} /> Watch Recording
                  </Button>
                )}
              </div>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── Calculators ── */}
      {tab === 'calculators' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { emoji: '🏠', title: 'Home Replacement Cost', desc: 'Estimate how much coverage you need for your home.', link: '/customer/calculator' },
            { emoji: '🚗', title: 'Auto Coverage Needs', desc: 'Find the right auto coverage based on your driving profile.', link: '/customer/calculator' },
            { emoji: '💰', title: 'Savings Calculator', desc: 'See how much you can save by bundling or switching plans.', link: '/customer/policy-management' },
            { emoji: '📊', title: 'Policy ROI Calculator', desc: 'Calculate your return on investment for your insurance spend.', link: '/customer/policy-management' },
          ].map((calc, i) => (
            <GlassPanel key={i} hoverable className="cursor-pointer group">
              <div className="text-4xl mb-4">{calc.emoji}</div>
              <h3 className="text-sm font-bold text-white group-hover:text-[#10B981] transition-colors">{calc.title}</h3>
              <p className="text-xs text-gray-500 mt-1">{calc.desc}</p>
              <Button variant="ghost" size="sm" className="mt-4 text-[#10B981] px-0 gap-1 text-xs">
                Open Calculator <ChevronRight size={12} />
              </Button>
            </GlassPanel>
          ))}
        </div>
      )}

      {/* ── Glossary ── */}
      {tab === 'glossary' && (
        <div className="space-y-3">
          {filteredGlossary.map((g) => (
            <GlassPanel key={g.term}>
              <div className="flex items-start gap-4">
                <div className="shrink-0 h-8 w-8 rounded-lg bg-[#10B981]/10 border border-[#10B981]/20 flex items-center justify-center text-xs font-bold text-[#10B981]">
                  {g.term[0]}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white">{g.term}</h3>
                  <p className="text-xs text-gray-400 mt-1 leading-relaxed">{g.def}</p>
                </div>
              </div>
            </GlassPanel>
          ))}
          {filteredGlossary.length === 0 && (
            <p className="text-center text-sm text-gray-600 py-8">No glossary terms match your search.</p>
          )}
        </div>
      )}
    </div>
  );
};

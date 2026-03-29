import { useState } from 'react';
import {
  BookOpen, Search, ChevronDown, ChevronUp, ThumbsUp, ThumbsDown,
  Clock, Eye, ArrowRight, PlayCircle, FileText, HelpCircle
} from 'lucide-react';
import { cn } from '@/utils/cn';

type Category = 'all' | 'claims' | 'policies' | 'payments' | 'account' | 'fraud';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: Category;
  helpful: number;
  views: number;
  tags: string[];
}

interface Article {
  id: string;
  title: string;
  summary: string;
  category: Category;
  readTime: number;
  views: number;
  type: 'article' | 'video' | 'guide';
}

const FAQS: FAQItem[] = [
  {
    id: '1',
    question: 'How long does it take to process a claim?',
    answer: 'Most claims are processed within 3–5 business days after all required documents are submitted. Complex claims or those requiring investigation may take 10–15 business days. You can track your claim status in real-time through the Claims section of your dashboard.',
    category: 'claims',
    helpful: 142,
    views: 1840,
    tags: ['processing time', 'claim status'],
  },
  {
    id: '2',
    question: 'What documents do I need to file a claim?',
    answer: 'Required documents vary by claim type:\n\n• Auto Collision: Police report, photos of damage, repair estimate, rental car receipts\n• Property Damage: Photos of damage, repair/replacement receipts, incident report\n• Medical: Medical bills, doctor\'s notes, prescription receipts, health records\n• Theft: Police report, proof of ownership, list of stolen items\n\nYou can upload all documents directly through the Claims portal.',
    category: 'claims',
    helpful: 98,
    views: 1204,
    tags: ['documents', 'requirements'],
  },
  {
    id: '3',
    question: 'Can I change my coverage mid-policy?',
    answer: 'Yes! You can request mid-term policy changes through the Policy Management section. Common changes include:\n\n• Increasing or decreasing coverage amounts\n• Adding or removing drivers\n• Updating your address\n• Adding endorsements or riders\n\nMost changes take effect within 24 hours and may result in a prorated premium adjustment.',
    category: 'policies',
    helpful: 67,
    views: 890,
    tags: ['coverage', 'mid-term changes'],
  },
  {
    id: '4',
    question: 'How do I set up automatic payments?',
    answer: 'Setting up auto-pay is easy:\n\n1. Go to Payments → Payment Methods\n2. Add a payment method (credit card or bank account)\n3. Toggle "Enable Auto-Pay" to ON\n4. Select your preferred payment date\n\nYou\'ll receive a reminder 3 days before each automatic charge. You can cancel auto-pay at any time.',
    category: 'payments',
    helpful: 113,
    views: 1560,
    tags: ['auto-pay', 'payment setup'],
  },
  {
    id: '5',
    question: 'What happens if I miss a payment?',
    answer: 'If you miss a payment:\n\n• Grace Period (Days 1–5): No late fees. Policy remains active.\n• Late Period (Days 6–30): A late fee of 1.5% of the premium amount is applied.\n• After 30 days: Policy may be suspended. Contact us immediately to make a payment arrangement.\n\nWe recommend enabling payment reminders or auto-pay to avoid missed payments.',
    category: 'payments',
    helpful: 89,
    views: 1120,
    tags: ['late payment', 'grace period'],
  },
  {
    id: '6',
    question: 'How does the AI fraud detection work?',
    answer: 'Our AI system analyzes each claim using multiple factors:\n\n• Historical claim patterns for similar incidents\n• Document authenticity verification\n• Geographic and timing consistency\n• Financial anomaly detection\n• Cross-reference with known fraud databases\n\nThe system assigns a risk score and flags claims that require additional review. This helps prevent insurance fraud, which keeps premiums lower for all customers.',
    category: 'fraud',
    helpful: 45,
    views: 670,
    tags: ['AI', 'fraud detection', 'risk score'],
  },
  {
    id: '7',
    question: 'How do I reset my password?',
    answer: 'To reset your password:\n\n1. Click "Forgot Password" on the login page\n2. Enter your registered email address\n3. Check your email for a reset link (valid for 24 hours)\n4. Click the link and create a new password\n\nFor security, your new password must be at least 8 characters and include uppercase, lowercase, numbers, and symbols.',
    category: 'account',
    helpful: 78,
    views: 945,
    tags: ['password', 'account access'],
  },
  {
    id: '8',
    question: 'Can I add family members to my policy?',
    answer: 'Yes, you can add family members as beneficiaries or co-insured individuals depending on your policy type:\n\n• Auto Insurance: Add additional drivers through Policy Management\n• Health Insurance: Add dependents (spouse, children) during enrollment or life events\n• Life Insurance: Update beneficiaries at any time through Beneficiary Management\n\nSome additions may affect your premium.',
    category: 'policies',
    helpful: 56,
    views: 780,
    tags: ['family', 'beneficiary', 'dependents'],
  },
];

const ARTICLES: Article[] = [
  { id: '1', title: 'Complete Guide to Filing Your First Claim', summary: 'Step-by-step walkthrough of the entire claims process from submission to payout.', category: 'claims', readTime: 8, views: 4200, type: 'guide' },
  { id: '2', title: 'Understanding Your Policy Coverage', summary: 'What\'s covered, what\'s not, and how to maximize your protection.', category: 'policies', readTime: 6, views: 3100, type: 'article' },
  { id: '3', title: 'How to Choose the Right Deductible', summary: 'Balancing out-of-pocket costs with monthly premiums to find the best value.', category: 'policies', readTime: 5, views: 2800, type: 'article' },
  { id: '4', title: 'Video: Filing a Claim in 5 Minutes', summary: 'Watch our quick tutorial showing exactly how to file a claim step-by-step.', category: 'claims', readTime: 5, views: 6500, type: 'video' },
  { id: '5', title: 'Payment Plans Explained', summary: 'Everything you need to know about installment options and payment flexibility.', category: 'payments', readTime: 4, views: 1900, type: 'article' },
  { id: '6', title: 'Protecting Yourself from Insurance Fraud', summary: 'How to recognize and avoid common insurance scams targeting policyholders.', category: 'fraud', readTime: 7, views: 1400, type: 'guide' },
];

const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: 'all', label: 'All Topics', icon: '📚' },
  { value: 'claims', label: 'Claims', icon: '📋' },
  { value: 'policies', label: 'Policies', icon: '📄' },
  { value: 'payments', label: 'Payments', icon: '💳' },
  { value: 'account', label: 'Account', icon: '👤' },
  { value: 'fraud', label: 'Fraud & Security', icon: '🛡️' },
];

export const FAQKnowledgeBase = () => {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState<Category>('all');
  const [openFAQ, setOpenFAQ] = useState<string | null>(null);
  const [helpfulVotes, setHelpfulVotes] = useState<Record<string, 'up' | 'down'>>({});
  const [activeTab, setActiveTab] = useState<'faq' | 'articles'>('faq');

  const filteredFAQs = FAQS.filter((f) => {
    const matchCat = category === 'all' || f.category === category;
    const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const filteredArticles = ARTICLES.filter((a) => {
    const matchCat = category === 'all' || a.category === category;
    const matchSearch = !search || a.title.toLowerCase().includes(search.toLowerCase()) || a.summary.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const voteHelpful = (id: string, vote: 'up' | 'down') => {
    setHelpfulVotes((prev) => ({ ...prev, [id]: vote }));
  };

  return (
    <div className="space-y-5">
      {/* Header */}
      <div>
        <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
          <BookOpen size={16} className="text-[#10B981]" /> Help Center
        </h2>
        <p className="text-xs text-gray-500 mt-0.5">Find answers to common questions and learn about our services.</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search FAQs and articles..."
          className="w-full h-11 bg-white/[0.04] border border-white/[0.08] rounded-xl pl-11 pr-4 text-sm text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              category === c.value
                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-gray-200'
            )}
          >
            <span>{c.icon}</span> {c.label}
          </button>
        ))}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 p-1 bg-white/[0.02] rounded-xl border border-white/[0.06]">
        {[
          { id: 'faq' as const, label: `FAQs (${filteredFAQs.length})`, icon: HelpCircle },
          { id: 'articles' as const, label: `Articles (${filteredArticles.length})`, icon: FileText },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-xs font-semibold transition-all',
                activeTab === tab.id ? 'bg-[#10B981]/15 text-[#10B981]' : 'text-gray-500 hover:text-gray-300'
              )}
            >
              <Icon size={13} /> {tab.label}
            </button>
          );
        })}
      </div>

      {/* FAQ Accordion */}
      {activeTab === 'faq' && (
        <div className="space-y-2">
          {filteredFAQs.length === 0 && (
            <div className="flex flex-col items-center justify-center py-10 text-gray-600">
              <HelpCircle size={32} className="mb-3" />
              <p className="text-sm">No FAQs match your search</p>
            </div>
          )}
          {filteredFAQs.map((faq) => (
            <div key={faq.id} className="rounded-xl border border-white/[0.06] bg-white/[0.02] overflow-hidden">
              <button
                onClick={() => setOpenFAQ(openFAQ === faq.id ? null : faq.id)}
                className="w-full flex items-start gap-3 p-4 text-left hover:bg-white/[0.03] transition-colors"
              >
                <div className="flex-1">
                  <p className="text-xs font-semibold text-gray-200">{faq.question}</p>
                  <div className="flex items-center gap-3 mt-1">
                    <span className="flex items-center gap-1 text-[9px] text-gray-600">
                      <Eye size={9} /> {faq.views.toLocaleString()}
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-gray-600">
                      <ThumbsUp size={9} /> {faq.helpful}
                    </span>
                    <div className="flex gap-1">
                      {faq.tags.slice(0, 2).map((tag) => (
                        <span key={tag} className="px-1.5 py-0.5 rounded bg-white/5 text-[9px] text-gray-500">{tag}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {openFAQ === faq.id ? <ChevronUp size={16} className="text-[#10B981] shrink-0 mt-0.5" /> : <ChevronDown size={16} className="text-gray-500 shrink-0 mt-0.5" />}
              </button>

              {openFAQ === faq.id && (
                <div className="px-4 pb-4 border-t border-white/[0.06]">
                  <div className="pt-3 text-xs text-gray-400 leading-relaxed whitespace-pre-line">
                    {faq.answer}
                  </div>
                  <div className="flex items-center gap-3 mt-4 pt-3 border-t border-white/[0.06]">
                    <p className="text-[10px] text-gray-600">Was this helpful?</p>
                    <button
                      onClick={() => voteHelpful(faq.id, 'up')}
                      className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-colors', helpfulVotes[faq.id] === 'up' ? 'bg-[#10B981]/20 text-[#10B981]' : 'bg-white/5 text-gray-500 hover:text-[#10B981]')}
                    >
                      <ThumbsUp size={10} /> Yes
                    </button>
                    <button
                      onClick={() => voteHelpful(faq.id, 'down')}
                      className={cn('flex items-center gap-1 px-2 py-1 rounded-lg text-[10px] transition-colors', helpfulVotes[faq.id] === 'down' ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-gray-500 hover:text-red-400')}
                    >
                      <ThumbsDown size={10} /> No
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Articles */}
      {activeTab === 'articles' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filteredArticles.length === 0 && (
            <div className="col-span-2 flex flex-col items-center justify-center py-10 text-gray-600">
              <FileText size={32} className="mb-3" />
              <p className="text-sm">No articles match your search</p>
            </div>
          )}
          {filteredArticles.map((article) => (
            <button key={article.id} className="text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#10B981]/20 transition-all group">
              <div className="flex items-start gap-3">
                <div className={cn(
                  'w-9 h-9 rounded-lg flex items-center justify-center shrink-0',
                  article.type === 'video' ? 'bg-red-500/10 text-red-400' : article.type === 'guide' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                )}>
                  {article.type === 'video' ? <PlayCircle size={18} /> : <FileText size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors leading-snug">{article.title}</p>
                  <p className="text-[10px] text-gray-500 mt-1 line-clamp-2">{article.summary}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="flex items-center gap-1 text-[9px] text-gray-600">
                      <Clock size={9} /> {article.readTime} min read
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-gray-600">
                      <Eye size={9} /> {article.views.toLocaleString()}
                    </span>
                    <span className={cn(
                      'px-1.5 py-0.5 rounded text-[9px] font-bold uppercase',
                      article.type === 'video' ? 'bg-red-500/10 text-red-400' : article.type === 'guide' ? 'bg-amber-500/10 text-amber-400' : 'bg-blue-500/10 text-blue-400'
                    )}>
                      {article.type}
                    </span>
                  </div>
                </div>
                <ArrowRight size={14} className="text-gray-600 group-hover:text-[#10B981] transition-colors shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

import { useState } from 'react';
import {
  PlayCircle, Search, Clock, Eye, ThumbsUp, Bookmark, Share2,
  ChevronRight, CheckCircle2, Star
} from 'lucide-react';
import { cn } from '@/utils/cn';

type VideoCategory = 'all' | 'getting-started' | 'claims' | 'policies' | 'payments' | 'advanced';
type VideoLevel = 'beginner' | 'intermediate' | 'advanced';

interface VideoTutorial {
  id: string;
  title: string;
  description: string;
  duration: string;
  category: VideoCategory;
  level: VideoLevel;
  views: number;
  likes: number;
  thumbnail: string;
  completed?: boolean;
  new?: boolean;
  featured?: boolean;
}

const VIDEOS: VideoTutorial[] = [
  { id: '1', title: 'Welcome to INSURAI — Platform Overview', description: 'A complete tour of the INSURAI dashboard, all key features, and how to navigate the platform.', duration: '4:32', category: 'getting-started', level: 'beginner', views: 12400, likes: 843, thumbnail: '🏠', completed: true, featured: true },
  { id: '2', title: 'How to File Your First Claim in 5 Minutes', description: 'Step-by-step walkthrough of the claim filing process with document upload.', duration: '5:15', category: 'claims', level: 'beginner', views: 9800, likes: 712, thumbnail: '📋', completed: true },
  { id: '3', title: 'Understanding Your Policy Coverage', description: 'What\'s covered, exclusions, deductibles, and how to read your policy documents.', duration: '7:44', category: 'policies', level: 'beginner', views: 7200, likes: 534, thumbnail: '📄' },
  { id: '4', title: 'Setting Up Auto-Pay & Managing Payments', description: 'Configure automatic payments, add payment methods, and review billing history.', duration: '3:58', category: 'payments', level: 'beginner', views: 6100, likes: 445, thumbnail: '💳' },
  { id: '5', title: 'Tracking Your Claim Status in Real-Time', description: 'Using the claim tracker, timeline view, and understanding each status stage.', duration: '6:22', category: 'claims', level: 'intermediate', views: 5400, likes: 389, thumbnail: '📍', new: true },
  { id: '6', title: 'How to Upload & Manage Claim Documents', description: 'Best practices for document uploads — formats, quality, and OCR auto-fill.', duration: '4:51', category: 'claims', level: 'intermediate', views: 4900, likes: 312, thumbnail: '📎' },
  { id: '7', title: 'Compare Policies Side by Side', description: 'Using the Policy Comparison tool to find the best coverage for your needs.', duration: '5:03', category: 'policies', level: 'intermediate', views: 3800, likes: 278, thumbnail: '⚖️' },
  { id: '8', title: 'Customizing Your Coverage with Add-ons', description: 'Explore the add-ons marketplace and build your ideal coverage package.', duration: '6:15', category: 'policies', level: 'intermediate', views: 3200, likes: 234, thumbnail: '🧩', new: true },
  { id: '9', title: 'AI Risk Score Explained — What Does It Mean?', description: 'Understanding the AI fraud detection system and how risk scores affect your claims.', duration: '8:41', category: 'advanced', level: 'advanced', views: 2900, likes: 198, thumbnail: '🤖' },
  { id: '10', title: 'Maximizing Your Loyalty Rewards', description: 'Earning points, tier upgrades, redemption strategies, and referral bonuses.', duration: '4:28', category: 'getting-started', level: 'beginner', views: 5100, likes: 367, thumbnail: '🏆' },
];

const CATEGORIES: { value: VideoCategory; label: string; count: number }[] = [
  { value: 'all', label: 'All Videos', count: VIDEOS.length },
  { value: 'getting-started', label: 'Getting Started', count: VIDEOS.filter((v) => v.category === 'getting-started').length },
  { value: 'claims', label: 'Claims', count: VIDEOS.filter((v) => v.category === 'claims').length },
  { value: 'policies', label: 'Policies', count: VIDEOS.filter((v) => v.category === 'policies').length },
  { value: 'payments', label: 'Payments', count: VIDEOS.filter((v) => v.category === 'payments').length },
  { value: 'advanced', label: 'Advanced', count: VIDEOS.filter((v) => v.category === 'advanced').length },
];

const LEVEL_CONFIG: Record<VideoLevel, { label: string; color: string; bg: string }> = {
  beginner: { label: 'Beginner', color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
  intermediate: { label: 'Intermediate', color: 'text-amber-400', bg: 'bg-amber-500/10' },
  advanced: { label: 'Advanced', color: 'text-red-400', bg: 'bg-red-500/10' },
};

export const VideoTutorials = () => {
  const [category, setCategory] = useState<VideoCategory>('all');
  const [search, setSearch] = useState('');
  const [selectedVideo, setSelectedVideo] = useState<VideoTutorial | null>(null);
  const [bookmarked, setBookmarked] = useState<Set<string>>(new Set());
  const [completed, setCompleted] = useState<Set<string>>(new Set(['1', '2']));

  const filtered = VIDEOS.filter((v) => {
    const matchCat = category === 'all' || v.category === category;
    const matchSearch = !search || v.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const featured = VIDEOS.find((v) => v.featured);
  const progress = Math.round((completed.size / VIDEOS.length) * 100);

  if (selectedVideo) {
    const lc = LEVEL_CONFIG[selectedVideo.level];
    return (
      <div className="space-y-4">
        <button onClick={() => setSelectedVideo(null)} className="flex items-center gap-2 text-xs text-gray-400 hover:text-white transition-colors">
          <ChevronRight size={14} className="rotate-180" /> Back to tutorials
        </button>

        {/* Video Player Mock */}
        <div className="aspect-video rounded-xl bg-gradient-to-br from-[#0F1629] to-[#1A2438] border border-white/[0.08] flex flex-col items-center justify-center gap-4 relative overflow-hidden">
          <div className="text-6xl">{selectedVideo.thumbnail}</div>
          <div className="flex flex-col items-center text-center px-6">
            <p className="text-sm font-bold text-gray-200">{selectedVideo.title}</p>
            <p className="text-xs text-gray-500 mt-1">{selectedVideo.duration}</p>
          </div>
          <button
            onClick={() => setCompleted((prev) => new Set([...prev, selectedVideo.id]))}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#10B981] text-white text-sm font-bold hover:bg-[#059669] transition-colors shadow-lg shadow-[#10B981]/30"
          >
            <PlayCircle size={18} /> Play Video
          </button>
          {completed.has(selectedVideo.id) && (
            <div className="absolute top-3 right-3 flex items-center gap-1 px-2 py-1 rounded-full bg-[#10B981]/20 border border-[#10B981]/30 text-[#10B981] text-[10px] font-bold">
              <CheckCircle2 size={10} /> Completed
            </div>
          )}
        </div>

        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div className="flex-1">
            <div className="flex items-center gap-2 flex-wrap mb-2">
              <span className={cn('px-2 py-0.5 rounded text-[10px] font-bold', lc.bg, lc.color)}>{lc.label}</span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1"><Clock size={9} /> {selectedVideo.duration}</span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1"><Eye size={9} /> {selectedVideo.views.toLocaleString()}</span>
              <span className="text-[10px] text-gray-500 flex items-center gap-1"><ThumbsUp size={9} /> {selectedVideo.likes}</span>
            </div>
            <p className="text-sm text-gray-400 leading-relaxed">{selectedVideo.description}</p>
          </div>
          <div className="flex gap-2 shrink-0">
            <button
              onClick={() => setBookmarked((prev) => { const next = new Set(prev); next.has(selectedVideo.id) ? next.delete(selectedVideo.id) : next.add(selectedVideo.id); return next; })}
              className={cn('p-2 rounded-lg border transition-colors', bookmarked.has(selectedVideo.id) ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-white/5 border-white/10 text-gray-500 hover:text-amber-400')}
            >
              <Bookmark size={14} fill={bookmarked.has(selectedVideo.id) ? 'currentColor' : 'none'} />
            </button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 text-gray-500 hover:text-white transition-colors">
              <Share2 size={14} />
            </button>
          </div>
        </div>

        {/* Related Videos */}
        <div>
          <p className="text-xs font-bold text-gray-400 mb-3">Related Videos</p>
          <div className="space-y-2">
            {VIDEOS.filter((v) => v.id !== selectedVideo.id && v.category === selectedVideo.category).slice(0, 3).map((v) => (
              <button key={v.id} onClick={() => setSelectedVideo(v)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] transition-all text-left group">
                <div className="w-10 h-10 rounded-lg bg-white/[0.04] flex items-center justify-center text-xl shrink-0">{v.thumbnail}</div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-300 group-hover:text-white transition-colors truncate">{v.title}</p>
                  <p className="text-[10px] text-gray-600 mt-0.5">{v.duration} · {v.views.toLocaleString()} views</p>
                </div>
                {completed.has(v.id) && <CheckCircle2 size={13} className="text-[#10B981] shrink-0" />}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* Header with Progress */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-sm font-bold text-gray-200 flex items-center gap-2">
            <PlayCircle size={16} className="text-[#10B981]" /> Video Tutorials
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Learn how to use INSURAI with step-by-step video guides.</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-gray-500">{completed.size}/{VIDEOS.length} completed</p>
          <div className="w-32 h-1.5 bg-white/10 rounded-full mt-1.5 overflow-hidden">
            <div className="h-full bg-[#10B981] rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-[10px] text-[#10B981] mt-0.5 font-bold">{progress}% complete</p>
        </div>
      </div>

      {/* Featured */}
      {featured && (
        <button
          onClick={() => setSelectedVideo(featured)}
          className="w-full text-left p-4 rounded-xl bg-gradient-to-r from-[#10B981]/10 to-blue-500/5 border border-[#10B981]/20 hover:border-[#10B981]/40 transition-all group"
        >
          <div className="flex items-center gap-2 mb-2">
            <Star size={12} className="text-amber-400 fill-amber-400" />
            <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Featured</span>
          </div>
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-xl bg-white/[0.04] flex items-center justify-center text-3xl shrink-0">{featured.thumbnail}</div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-200 group-hover:text-white transition-colors">{featured.title}</p>
              <p className="text-xs text-gray-500 mt-1">{featured.description}</p>
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock size={9} /> {featured.duration}</span>
                <span className="text-[10px] text-gray-600 flex items-center gap-1"><Eye size={9} /> {featured.views.toLocaleString()}</span>
              </div>
            </div>
            <PlayCircle size={32} className="text-[#10B981] shrink-0 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
          </div>
        </button>
      )}

      {/* Search */}
      <div className="relative">
        <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search tutorials..."
          className="w-full h-9 bg-white/[0.04] border border-white/[0.08] rounded-lg pl-9 pr-3 text-xs text-gray-200 placeholder-gray-600 focus:outline-none focus:border-[#10B981]/40 transition-colors"
        />
      </div>

      {/* Categories */}
      <div className="flex gap-2 flex-wrap">
        {CATEGORIES.map((c) => (
          <button
            key={c.value}
            onClick={() => setCategory(c.value)}
            className={cn(
              'flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-[10px] font-semibold transition-colors',
              category === c.value
                ? 'bg-[#10B981]/15 text-[#10B981] border border-[#10B981]/20'
                : 'bg-white/[0.03] border border-white/[0.06] text-gray-400 hover:text-gray-200'
            )}
          >
            {c.label}
            <span className="px-1 py-0.5 rounded bg-white/10 text-[9px]">{c.count}</span>
          </button>
        ))}
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {filtered.map((video) => {
          const lc = LEVEL_CONFIG[video.level];
          const isCompleted = completed.has(video.id);
          return (
            <button
              key={video.id}
              onClick={() => setSelectedVideo(video)}
              className="text-left p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:bg-white/[0.04] hover:border-[#10B981]/20 transition-all group"
            >
              <div className="flex items-start gap-3">
                <div className="relative w-12 h-12 rounded-xl bg-white/[0.04] flex items-center justify-center text-2xl shrink-0">
                  {video.thumbnail}
                  {isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#10B981] flex items-center justify-center">
                      <CheckCircle2 size={9} className="text-white" />
                    </div>
                  )}
                  {video.new && !isCompleted && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center text-[7px] font-bold text-white">NEW</div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-200 group-hover:text-white transition-colors leading-snug">{video.title}</p>
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span className={cn('px-1.5 py-0.5 rounded text-[9px] font-bold', lc.bg, lc.color)}>{lc.label}</span>
                    <span className="text-[9px] text-gray-600 flex items-center gap-0.5"><Clock size={8} /> {video.duration}</span>
                    <span className="text-[9px] text-gray-600 flex items-center gap-0.5"><Eye size={8} /> {video.views.toLocaleString()}</span>
                  </div>
                </div>
                <PlayCircle size={18} className="text-gray-600 group-hover:text-[#10B981] transition-colors shrink-0 mt-1" />
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};

import { useEffect, useState } from 'react';
import {
  Loader2, AlertCircle, CheckCircle2, XCircle, Clock,
  MapPin, IndianRupee, ChevronDown, ChevronUp, CalendarDays,
  Activity, Tag, HelpCircle, RefreshCw,
} from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../utils';
import { apiFetch } from '../lib/api';

// ── Types ────────────────────────────────────────────────────────────────────

interface ActivityPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  createdAt?: string;
  offersCount: number;
  questions?: string[];
  author: {
    id: string;
    name: string;
    avatar: string;
    email?: string;
  };
}

interface ActivityOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  updatedAt: string;
  offeredBy: {
    id: string;
    name: string;
    avatar: string;
  };
}

interface ActivityItem {
  post: ActivityPost;
  offer: ActivityOffer;
}

// ── Status config ─────────────────────────────────────────────────────────────

const STATUS = {
  accepted: {
    label: 'Accepted',
    icon: CheckCircle2,
    pill: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
    glow: 'shadow-emerald-900/30',
    bar: 'bg-emerald-500',
    banner: 'bg-emerald-950/30 border-emerald-900/40 text-emerald-300',
    bannerMsg: 'Your offer was accepted! The post author wants to work with you.',
  },
  rejected: {
    label: 'Rejected',
    icon: XCircle,
    pill: 'bg-red-950/60 text-red-400 border-red-800/50',
    glow: 'shadow-red-900/20',
    bar: 'bg-red-500',
    banner: 'bg-red-950/30 border-red-900/40 text-red-300',
    bannerMsg: 'Your offer was not selected for this requirement.',
  },
  pending: {
    label: 'Awaiting',
    icon: Clock,
    pill: 'bg-zinc-900 text-zinc-400 border-zinc-700',
    glow: '',
    bar: 'bg-zinc-700',
    banner: 'bg-zinc-900/40 border-zinc-800/40 text-zinc-400',
    bannerMsg: 'Your offer is under review by the post author.',
  },
} as const;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonRow() {
  return (
    <div className="bg-[#0e0e10] border border-[#1e1e22] rounded-2xl p-5 space-y-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#1a1a1e] shrink-0" />
        <div className="space-y-1.5 flex-1">
          <div className="h-3 w-32 bg-[#1a1a1e] rounded-full" />
          <div className="h-2.5 w-20 bg-[#161619] rounded-full" />
        </div>
        <div className="h-5 w-16 bg-[#1a1a1e] rounded-full" />
      </div>
      <div className="h-4 w-3/4 bg-[#1a1a1e] rounded-full" />
      <div className="h-2.5 w-full bg-[#161619] rounded-full" />
      <div className="h-2.5 w-4/5 bg-[#161619] rounded-full" />
    </div>
  );
}

// ── Activity card ─────────────────────────────────────────────────────────────

function ActivityCard({ item }: { item: ActivityItem }) {
  const [expanded, setExpanded] = useState(false);
  const { post, offer } = item;
  const cfg = STATUS[offer.status] ?? STATUS.pending;
  const StatusIcon = cfg.icon;

  return (
    <div
      className={`relative bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden transition-all duration-300 ${cfg.glow ? `shadow-lg ${cfg.glow}` : ''}`}
    >
      {/* Colored top line */}
      <div className={`absolute top-0 inset-x-0 h-0.5 ${cfg.bar}`} />

      <div className="pt-5 px-5 pb-4 space-y-4">

        {/* ── Status banner ── */}
        <div className={`flex items-start gap-2.5 px-3.5 py-2.5 rounded-xl border text-[12px] leading-snug ${cfg.banner}`}>
          <StatusIcon className="w-4 h-4 shrink-0 mt-0.5" />
          <span>{cfg.bannerMsg}</span>
        </div>

        {/* ── Post author + meta ── */}
        <div className="flex items-start gap-3">
          <img
            src={getAvatarUrl(post.author.name, post.author.avatar)}
            alt={post.author.name}
            className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0 mt-0.5"
            onError={(e) => handleAvatarError(e, post.author.name)}
            referrerPolicy="no-referrer"
          />
          <div className="flex-1 min-w-0">
            <p className="text-[12px] font-semibold text-zinc-200">{post.author.name}</p>
            <div className="flex flex-wrap items-center gap-2 mt-0.5">
              <span className="inline-flex items-center gap-0.5 text-[11px] text-zinc-500">
                <MapPin className="w-3 h-3 text-zinc-600" />
                {post.location}
              </span>
              <span className="text-zinc-700">·</span>
              <span className="inline-flex items-center gap-0.5 text-[11px] text-zinc-500">
                <CalendarDays className="w-3 h-3 text-zinc-600" />
                {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
              </span>
            </div>
          </div>

          {/* Status pill */}
          <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${cfg.pill}`}>
            <StatusIcon className="w-3 h-3" />
            {cfg.label}
          </span>
        </div>

        {/* ── Post title ── */}
        <div>
          <h3 className="text-[15px] font-bold text-zinc-100 leading-snug">{post.title}</h3>
          <p className="text-[12px] text-zinc-500 mt-1 leading-relaxed line-clamp-2">{post.description}</p>
        </div>

        {/* ── Tags row ── */}
        <div className="flex flex-wrap gap-1.5">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
            <Tag className="w-2.5 h-2.5" />{post.category}
          </span>
          {post.budget && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
              <IndianRupee className="w-2.5 h-2.5" />{post.budget}
            </span>
          )}
          {post.timeline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
              <Clock className="w-2.5 h-2.5" />{post.timeline}
            </span>
          )}
        </div>

        {/* ── My offer message ── */}
        <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-1">
          <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider mb-1">My Offer</p>
          <p className={`text-[12px] text-zinc-400 leading-relaxed ${!expanded ? 'line-clamp-2' : ''}`}>
            {offer.message}
          </p>
          <p className="text-[10px] text-zinc-700 font-mono mt-1">
            Submitted {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        </div>

        {/* ── Expand toggle ── */}
        {(offer.answers?.length > 0 || post.description.length > 120) && (
          <button
            onClick={() => setExpanded((v) => !v)}
            className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-zinc-500 hover:text-zinc-300 border border-[#1e1e22] rounded-xl hover:bg-[#111113] transition-all duration-200 cursor-pointer"
          >
            {expanded ? (
              <><ChevronUp className="w-3.5 h-3.5" />Show less</>
            ) : (
              <><ChevronDown className="w-3.5 h-3.5" />View answers &amp; details</>
            )}
          </button>
        )}

        {/* ── Expanded: Q&A ── */}
        {expanded && offer.answers && offer.answers.length > 0 && (
          <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-4 space-y-3">
            <div className="flex items-center gap-2 mb-0.5">
              <HelpCircle className="w-3.5 h-3.5 text-[#FF3F3F]" />
              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Question Answers</p>
            </div>
            {offer.answers.map((ans, i) => (
              <div key={i} className="space-y-0.5">
                <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                  <span className="text-[#FF3F3F] font-bold">Q{i + 1}.</span> {ans.question}
                </p>
                <p className="text-[12px] text-zinc-300 pl-3 border-l border-[#FF3F3F]/20 leading-relaxed">
                  {ans.answer || '—'}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Filter tab ────────────────────────────────────────────────────────────────

type FilterKey = 'all' | 'pending' | 'accepted' | 'rejected';

const FILTER_TABS: { key: FilterKey; label: string; icon: typeof Clock }[] = [
  { key: 'all',      label: 'All',      icon: Activity },
  { key: 'pending',  label: 'Awaiting', icon: Clock },
  { key: 'accepted', label: 'Accepted', icon: CheckCircle2 },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
];

// ── Main screen ───────────────────────────────────────────────────────────────

export default function MyActivity() {
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>('all');

  const fetchActivity = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await apiFetch('/api/offers/my-activity', {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load activity');
      const data = await res.json();
      setItems(data.data || []);
    } catch (e: any) {
      setError(e.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchActivity(); }, []);

  const filtered = filter === 'all' ? items : items.filter((i) => i.offer.status === filter);

  // Count per status
  const counts = {
    all:      items.length,
    pending:  items.filter((i) => i.offer.status === 'pending').length,
    accepted: items.filter((i) => i.offer.status === 'accepted').length,
    rejected: items.filter((i) => i.offer.status === 'rejected').length,
  };

  return (
    <div className="space-y-6 max-w-3xl mx-auto">

      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black text-zinc-100 tracking-tight">My Activity</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            All posts you've responded to — track your offer status in real time.
          </p>
        </div>
        <button
          onClick={fetchActivity}
          disabled={loading}
          className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] hover:border-[#2a2a2e] rounded-xl text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {/* ── Stats row ── */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: 'Awaiting',  count: counts.pending,  color: 'text-zinc-300',  bg: 'bg-[#0e0e10]' },
            { label: 'Accepted',  count: counts.accepted, color: 'text-emerald-400', bg: 'bg-emerald-950/20 border-emerald-900/30' },
            { label: 'Rejected',  count: counts.rejected, color: 'text-red-400',    bg: 'bg-red-950/20 border-red-900/30' },
          ].map(({ label, count, color, bg }) => (
            <div key={label} className={`${bg} border border-[#1e1e22] rounded-2xl p-4 text-center`}>
              <p className={`text-[26px] font-black tracking-tight ${color}`}>{count}</p>
              <p className="text-[11px] text-zinc-600 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* ── Filter tabs ── */}
      {!loading && items.length > 0 && (
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
          {FILTER_TABS.map(({ key, label, icon: Icon }) => {
            const active = filter === key;
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={`shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold border transition-all duration-200 cursor-pointer whitespace-nowrap ${
                  active
                    ? 'bg-[#FF3F3F] border-[#FF3F3F] text-white shadow-md shadow-[#FF3F3F]/20'
                    : 'bg-[#0e0e10] border-[#1e1e22] text-zinc-500 hover:border-[#2a2a2e] hover:text-zinc-300'
                }`}
              >
                <Icon className={`w-3 h-3 ${active ? 'text-white' : 'text-zinc-600'}`} />
                {label}
                <span className={`text-[9px] font-bold px-1 rounded-full ${active ? 'bg-white/20 text-white' : 'bg-[#1a1a1e] text-zinc-600'}`}>
                  {counts[key]}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-3">
          <SkeletonRow />
          <SkeletonRow />
          <SkeletonRow />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="text-[14px] font-semibold text-zinc-400">{error}</p>
          <button
            onClick={fetchActivity}
            className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0e0e10] border border-[#1e1e22] flex items-center justify-center">
            <Activity className="w-7 h-7 text-zinc-700" />
          </div>
          <div>
            <p className="text-[16px] font-bold text-zinc-300">No activity yet</p>
            <p className="text-[12px] text-zinc-600 mt-1 max-w-xs">
              Browse the feed and submit an offer on a post to see it tracked here.
            </p>
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
          <p className="text-[14px] font-semibold text-zinc-400">No {filter} offers</p>
          <button onClick={() => setFilter('all')} className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer">
            View all
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((item) => (
            <ActivityCard key={item.offer._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}

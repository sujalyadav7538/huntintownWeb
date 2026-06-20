import { MapPin, Clock, MessageCircle, Zap, Users, IndianRupee, Lock } from 'lucide-react';
import { Post, User } from '../../types';
import { isPostExpired, getPostExpiryLabel, getAvatarUrl, handleAvatarError } from '../../utils';

interface PostCardProps {
  key?: string | number;
  post: Post;
  currentUser: User;
  onSelect: () => void;
  onInitiateChat: (recipient: User) => void;
}

export default function PostCard({
  post,
  currentUser,
  onSelect,
  onInitiateChat,
}: PostCardProps) {
  const isAuthor = post.author.id === currentUser.id;
  const isUrgent = post.title.toLowerCase().includes('urgent') || post.description.toLowerCase().includes('urgent');
  const expired = isPostExpired(post.expiresAt);
  const timeLabel = getPostExpiryLabel(post.expiresAt);

  // Derive a deterministic accent hue from category for left border
  const categoryColors: Record<string, string> = {
    Technology: '#6366f1',
    Design: '#ec4899',
    Marketing: '#f59e0b',
    Writing: '#10b981',
    Education: '#3b82f6',
    Finance: '#14b8a6',
    Health: '#22c55e',
    Legal: '#8b5cf6',
    'Home & Living': '#f97316',
  };
  const accentColor = categoryColors[post.category] || '#FF3F3F';

  return (
    <article
      id={`post-card-${post.id}`}
      onClick={onSelect}
      className="group relative bg-[#0e0e10] rounded-2xl border border-[#1e1e22] hover:border-[#2e2e34] transition-all duration-300 overflow-hidden flex flex-col cursor-pointer"
      style={{ boxShadow: '0 1px 3px rgba(0,0,0,0.4)' }}
    >
      {/* Colored left accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-0.75 rounded-l-2xl transition-all duration-300 group-hover:w-1"
        style={{ backgroundColor: accentColor, opacity: expired ? 0.3 : 0.7 }}
      />

      {/* Top glow on hover */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${accentColor}55, transparent)` }}
      />

      <div className="pl-5 pr-5 pt-4 pb-4 flex flex-col gap-3.5">

        {/* ── Author row ── */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <img
                src={getAvatarUrl(post.author.name, post.author.avatar)}
                alt={post.author.name}
                className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] group-hover:ring-[#2e2e34] transition-all"
                onError={(e) => handleAvatarError(e, post.author.name)}
                referrerPolicy="no-referrer"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-[#0e0e10]" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-[13px] font-semibold text-zinc-100 tracking-tight truncate">{post.author.name}</span>
                {isUrgent && !expired && (
                  <span className="inline-flex items-center gap-0.5 text-[9px] font-black tracking-widest bg-[#FF3F3F]/15 text-[#FF3F3F] border border-[#FF3F3F]/30 px-1.5 py-0.5 rounded-full uppercase">
                    <Zap className="w-2.5 h-2.5" />Urgent
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5 text-[11px] text-zinc-500">
                <span className="flex items-center gap-0.5">
                  <MapPin className="w-3 h-3 text-zinc-600" />
                  {post.location}
                </span>
                <span className="text-zinc-700">·</span>
                <span className="flex items-center gap-0.5">
                  <Clock className="w-3 h-3 text-zinc-600" />
                  {new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                </span>
              </div>
            </div>
          </div>

          {/* Response count pill */}
          <div className="shrink-0 flex items-center gap-1 bg-[#1a1a1e] border border-[#262629] rounded-full px-2.5 py-1 text-[11px] text-zinc-400 font-medium">
            <Users className="w-3 h-3 text-zinc-500" />
            <span>{post.offersCount || 0}</span>
          </div>
        </div>

        {/* ── Title & Description ── */}
        <div className="space-y-1.5">
          <h3 className="text-[15px] font-bold text-zinc-100 group-hover:text-white transition-colors leading-snug tracking-tight line-clamp-2">
            {post.title}
          </h3>
          <p className="text-[12px] text-zinc-500 leading-relaxed line-clamp-2">{post.description}</p>
        </div>

        {/* ── Meta chips ── */}
        <div className="flex flex-wrap gap-1.5">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-bold border uppercase tracking-wide"
            style={{ color: accentColor, borderColor: `${accentColor}30`, backgroundColor: `${accentColor}12` }}
          >
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#232328] rounded-full text-[10px] font-semibold text-zinc-400">
            <IndianRupee className="w-2.5 h-2.5" />
            {post.budget || 'Negotiable'}
          </span>
          {expired ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-zinc-900/60 border border-zinc-800 rounded-full text-[10px] font-bold text-zinc-600 uppercase tracking-wide">
              <Lock className="w-2.5 h-2.5" />Expired
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-950/40 border border-emerald-900/40 rounded-full text-[10px] font-bold text-emerald-400 uppercase tracking-wide">
              <Clock className="w-2.5 h-2.5" />{timeLabel}
            </span>
          )}
        </div>

        {/* ── Action row ── */}
        {!isAuthor && (
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex gap-2 items-center border-t border-[#18181c] pt-3"
          >
            <button
              id={`chat-launcher-${post.id}`}
              onClick={() => onInitiateChat(post.author)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#18181c] hover:bg-[#222226] border border-[#272729] rounded-xl text-[11px] font-semibold text-zinc-400 hover:text-zinc-200 transition-all duration-200 cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              Message
            </button>

            <button
              id={`offer-help-btn-${post.id}`}
              onClick={onSelect}
              disabled={expired}
              className={`ml-auto inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-[11px] font-bold tracking-wide transition-all duration-200 cursor-pointer ${
                expired
                  ? 'bg-zinc-800/50 text-zinc-600 border border-zinc-700/50 cursor-not-allowed'
                  : 'bg-[#FF3F3F] hover:bg-[#e53535] text-white shadow-md shadow-[#FF3F3F]/20 hover:shadow-[#FF3F3F]/35 hover:scale-[1.02] active:scale-[0.98]'
              }`}
            >
              {expired ? (
                <><Lock className="w-3 h-3" />Locked</>
              ) : (
                <>
                  <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Offer Help
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </article>
  );
}

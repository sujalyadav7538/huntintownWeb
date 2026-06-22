import { User } from '../../types';
import {
  MapPin,
  MessageSquare,
  Share2,
  CheckCircle2,
  Star,
  Shield,
  Edit3,
  TrendingUp,
} from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface ProfileHeroProps {
  user: User;
  isOwner: boolean;
  onEdit: () => void;
  onMessage?: () => void;
}

export default function ProfileHero({
  user,
  isOwner,
  onEdit,
  onMessage,
}: ProfileHeroProps) {
  const rating = user.rating ?? 0;
  const trustScore = user.trustScore ?? user.reputation ?? 0;
  const trustLevel =
    trustScore >= 400
      ? { label: 'Elite', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
      : trustScore >= 200
      ? { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' }
      : { label: 'Rising', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({ title: user.name, url: window.location.href });
    } else {
      navigator.clipboard.writeText(window.location.href);
    }
  };

  return (
    <div className="relative rounded-3xl overflow-hidden border border-white/6 bg-[#0C0C0E] shadow-[0_0_80px_rgba(0,0,0,0.7)]">
      {/* ── Ambient glows ── */}
      <div className="absolute -top-20 left-1/4 w-125 h-75 bg-[#FF3F3F]/7 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -top-10 right-1/4 w-100 h-50 bg-violet-500/5 rounded-full blur-[80px] pointer-events-none" />

      {/* ── Cover Banner ── */}
      <div className="h-44 sm:h-56 lg:h-64 relative overflow-hidden">
        <div className="absolute inset-0 bg-[#0C0C0E]" />
        {/* Mesh gradient */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#FF3F3F1A_0%,transparent_55%),radial-gradient(ellipse_at_bottom_right,#7c3aed14_0%,transparent_55%),radial-gradient(ellipse_at_center,#0C0C0E_40%,transparent_100%)]" />
        {/* Diagonal lines */}
        <div
          className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage:
              'repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)',
            backgroundSize: '24px 24px',
          }}
        />
        {/* Horizontal noise texture */}
        <div className="absolute inset-0 opacity-[0.02] bg-linear-to-br from-white via-transparent to-white mix-blend-overlay" />
        {/* Bottom fade into card */}
        <div className="absolute bottom-0 inset-x-0 h-28 bg-linear-to-t from-[#0C0C0E] to-transparent" />
      </div>

      {/* ── Profile Content ── */}
      <div className="px-5 sm:px-8 lg:px-10 pb-8 sm:pb-10 -mt-3 relative z-10">
        {/* Header row: avatar + identity + actions */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          {/* Left: avatar + name block */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
            {/* Avatar */}
            <div className="relative -mt-16 sm:-mt-20 shrink-0">
              <div className="absolute -inset-1.5 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-60 blur-md" />
              <div className="relative p-0.75 rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500">
                <img
                  src={getAvatarUrl(user.name, user.avatar)}
                  alt={user.name}
                  className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover bg-zinc-900 block"
                  onError={(e) => handleAvatarError(e, user.name)}
                  referrerPolicy="no-referrer"
                />
              </div>
              {/* Online indicator */}
              <span className="absolute bottom-2 right-2 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0C0C0E] shadow-[0_0_10px_rgba(52,211,153,0.9)]" />
            </div>

            {/* Name + meta */}
            <div className="text-center sm:text-left pb-1 space-y-1.5">
              <div className="flex items-center justify-center sm:justify-start gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                  {user.name}
                </h1>
                {user.isVerified !== false && (
                  <CheckCircle2 className="w-5 h-5 text-[#FF3F3F] shrink-0" />
                )}
                {/* Trust badge */}
                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider border ${trustLevel.bg} ${trustLevel.border} ${trustLevel.color}`}
                >
                  <Shield className="w-3 h-3" />
                  {trustLevel.label}
                </span>
              </div>

              <p className="text-zinc-400 text-sm font-medium">{user.role}</p>

              <div className="flex items-center justify-center sm:justify-start gap-4 flex-wrap">
                {user.location && (
                  <span className="flex items-center gap-1.5 text-xs text-zinc-500">
                    <MapPin className="w-3.5 h-3.5 text-[#FF3F3F]" />
                    {user.location}
                  </span>
                )}
                {rating > 0 && (
                  <span className="flex items-center gap-1 text-xs text-zinc-400">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="font-semibold text-white">{rating.toFixed(1)}</span>
                    {user.reviewCount ? (
                      <span className="text-zinc-600">({user.reviewCount} reviews)</span>
                    ) : null}
                  </span>
                )}
                {trustScore > 0 && (
                  <span className="flex items-center gap-1 text-xs text-zinc-500">
                    <TrendingUp className="w-3.5 h-3.5 text-violet-400" />
                    <span>{trustScore} rep</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Right: Action buttons */}
          <div className="flex items-center gap-2.5 justify-center sm:justify-end sm:pb-1 flex-wrap">
            {isOwner ? (
              <button
                onClick={onEdit}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF3F3F] to-rose-500
                  hover:from-rose-500 hover:to-[#FF3F3F] text-white font-semibold text-sm
                  transition-all duration-300 shadow-[0_4px_20px_rgba(255,63,63,0.35)]
                  hover:shadow-[0_4px_28px_rgba(255,63,63,0.55)] active:scale-95"
              >
                <Edit3 className="w-4 h-4" />
                Edit Profile
              </button>
            ) : (
              <button
                onClick={onMessage}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF3F3F] to-rose-500
                  hover:from-rose-500 hover:to-[#FF3F3F] text-white font-semibold text-sm
                  transition-all duration-300 shadow-[0_4px_20px_rgba(255,63,63,0.35)]
                  hover:shadow-[0_4px_28px_rgba(255,63,63,0.55)] active:scale-95"
              >
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
            )}
            <button
              onClick={handleShare}
              className="w-10 h-10 rounded-xl bg-white/5 border border-white/8
                hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center
                transition-all active:scale-95"
              title="Share profile"
            >
              <Share2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

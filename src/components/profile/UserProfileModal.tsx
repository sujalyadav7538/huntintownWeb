import { useEffect } from 'react';
import {
  X,
  MapPin,
  Star,
  Zap,
  CheckCircle2,
  Lock,
  CalendarDays,
  Briefcase,
  TrendingUp,
} from 'lucide-react';
import { User } from '../../types';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface UserProfileModalProps {
  user: User;
  currentUserId: string;
  onClose: () => void;
  onMessage: (user: User) => void;
}

export default function UserProfileModal({
  user,
  currentUserId,
  onClose,
  onMessage,
}: UserProfileModalProps) {
  const isOwnProfile = user.id === currentUserId;

  const rating = user.rating ?? 0;
  const reputation = user.reputation ?? user.trustScore ?? 0;

  const trustLevel =
    reputation >= 400
      ? { label: 'Elite', color: 'text-amber-400', bg: 'bg-amber-400/10', border: 'border-amber-400/20' }
      : reputation >= 200
      ? { label: 'Trusted', color: 'text-emerald-400', bg: 'bg-emerald-400/10', border: 'border-emerald-400/20' }
      : { label: 'Rising', color: 'text-violet-400', bg: 'bg-violet-400/10', border: 'border-violet-400/20' };

  const skills = (user.skills ?? []).slice(0, 8);
  const joinedLabel = user.joinedAt
    ? new Date(user.joinedAt).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })
    : null;

  // Close on Escape key
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-60 flex items-end sm:items-center justify-center sm:p-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative bg-[#0c0c0e] border border-[#1e1e22] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-sm overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Decorative banner ── */}
        <div className="h-20 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0c0c0e]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#FF3F3F18_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,#7c3aed14_0%,transparent_60%)]" />
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(45deg,#fff 0,#fff 1px,transparent 0,transparent 50%)',
              backgroundSize: '12px 12px',
            }}
          />
        </div>

        {/* ── Close button ── */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 w-7 h-7 rounded-full bg-black/40 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer z-10"
        >
          <X className="w-3.5 h-3.5 text-zinc-400" />
        </button>

        {/* ── Avatar (overlaps banner) ── */}
        <div className="flex flex-col items-center -mt-12 px-5 pb-5">
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-70 blur-[1px]" />
            <div className="relative p-0.5 rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500">
              <img
                src={getAvatarUrl(user.name, user.avatar)}
                alt={user.name}
                className="w-20 h-20 rounded-full object-cover bg-zinc-900 block"
                onError={(e) => handleAvatarError(e, user.name)}
                referrerPolicy="no-referrer"
              />
            </div>
            {/* Online dot */}
            <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#0c0c0e]" />
          </div>

          {/* Name + role */}
          <div className="mt-3 text-center">
            <div className="flex items-center gap-1.5 justify-center flex-wrap">
              <h2 className="text-base font-bold text-zinc-100">{user.name}</h2>
              {user.isVerified && (
                <CheckCircle2 className="w-3.5 h-3.5 text-[#FF3F3F] shrink-0" />
              )}
            </div>
            {user.role && (
              <p className="text-[12px] text-zinc-500 mt-0.5">{user.role}</p>
            )}
          </div>

          {/* Trust badge */}
          <div className={`mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${trustLevel.bg} ${trustLevel.border} ${trustLevel.color}`}>
            <Zap className="w-2.5 h-2.5" />
            {trustLevel.label}
          </div>

          {/* ── Meta row ── */}
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 text-[11px] text-zinc-500">
            {user.location && (
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-zinc-600" />
                {user.location}
              </span>
            )}
            {joinedLabel && (
              <span className="flex items-center gap-1">
                <CalendarDays className="w-3 h-3 text-zinc-600" />
                Joined {joinedLabel}
              </span>
            )}
          </div>

          {/* ── Stats row ── */}
          <div className="mt-4 w-full grid grid-cols-3 divide-x divide-[#1e1e22] rounded-xl bg-[#0e0e10] border border-[#1e1e22] overflow-hidden">
            {/* Rating */}
            <div className="flex flex-col items-center py-3 px-2 gap-0.5">
              <div className="flex items-center gap-0.5">
                <Star className="w-3 h-3 text-amber-400" />
                <span className="text-[13px] font-bold text-zinc-100">
                  {rating > 0 ? rating.toFixed(1) : '—'}
                </span>
              </div>
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Rating</span>
            </div>

            {/* Completed */}
            <div className="flex flex-col items-center py-3 px-2 gap-0.5">
              <div className="flex items-center gap-0.5">
                <Briefcase className="w-3 h-3 text-violet-400" />
                <span className="text-[13px] font-bold text-zinc-100">
                  {user.completedRequests ?? '—'}
                </span>
              </div>
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Done</span>
            </div>

            {/* Response rate */}
            <div className="flex flex-col items-center py-3 px-2 gap-0.5">
              <div className="flex items-center gap-0.5">
                <TrendingUp className="w-3 h-3 text-emerald-400" />
                <span className="text-[13px] font-bold text-zinc-100">
                  {user.responseRate != null ? `${user.responseRate}%` : '—'}
                </span>
              </div>
              <span className="text-[9px] text-zinc-600 font-semibold uppercase tracking-wide">Response</span>
            </div>
          </div>

          {/* ── Bio ── */}
          {user.bio && (
            <div className="mt-4 w-full bg-[#0e0e10] border border-[#1a1a1e] rounded-xl p-3.5">
              <p className="text-[12px] text-zinc-400 leading-relaxed line-clamp-3">{user.bio}</p>
            </div>
          )}

          {/* ── Skills ── */}
          {skills.length > 0 && (
            <div className="mt-3 w-full">
              <p className="text-[9px] font-bold text-zinc-600 uppercase tracking-wider mb-2">Skills</p>
              <div className="flex flex-wrap gap-1.5">
                {skills.map((s) => (
                  <span
                    key={s}
                    className="px-2.5 py-1 rounded-lg bg-violet-400/10 border border-violet-400/20 text-[10px] text-violet-300 font-medium"
                  >
                    {s}
                  </span>
                ))}
                {(user.skills?.length ?? 0) > 8 && (
                  <span className="px-2.5 py-1 rounded-lg bg-white/4 border border-white/8 text-[10px] text-zinc-500 font-medium">
                    +{(user.skills?.length ?? 0) - 8} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* ── CTA ── */}
          {!isOwnProfile && (
            <div className="mt-5 w-full flex items-center gap-3 px-4 py-3 rounded-xl bg-zinc-900/60 border border-zinc-800/60">
              <Lock className="w-4 h-4 text-zinc-600 shrink-0" />
              <p className="text-[11px] text-zinc-500 leading-snug">
                Chat unlocks once <span className="text-zinc-300 font-semibold">{user.name.split(' ')[0]}</span>'s offer is accepted on one of your posts, or your offer is accepted by them.
              </p>
            </div>
          )}

          {isOwnProfile && (
            <p className="mt-5 text-[11px] text-zinc-600 text-center">This is how others see your profile.</p>
          )}
        </div>
      </div>
    </div>
  );
}

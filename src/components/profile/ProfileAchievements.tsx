import { Award, Zap, CheckCircle2, Users, Star, Shield, Trophy, Lock, Loader2, AlertCircle } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';
import { UserBadgeItem } from '../../types';

const RARITY_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  common:    { color: 'text-zinc-300',    bg: 'bg-zinc-800/50',       border: 'border-zinc-700/50' },
  rare:      { color: 'text-sky-400',     bg: 'bg-sky-400/10',        border: 'border-sky-400/20' },
  epic:      { color: 'text-violet-400',  bg: 'bg-violet-400/10',     border: 'border-violet-400/20' },
  legendary: { color: 'text-amber-400',   bg: 'bg-amber-400/10',      border: 'border-amber-400/20' },
};

const BADGE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  profile_complete: CheckCircle2,
  top_rated:        Star,
  trusted_helper:   Shield,
  popular_helper:   Users,
  elite_member:     Trophy,
};

interface ProfileAchievementsProps {
  badges: UserBadgeItem[];
  loading?: boolean;
  error?: string | null;
}

export default function ProfileAchievements({ badges, loading, error }: ProfileAchievementsProps) {
  if (loading) {
    return (
      <ProfileSectionCard title="Achievements & Badges" icon={Award} iconColor="text-amber-400" accentColor="#f59e0b">
        <div className="flex items-center gap-2 py-4 text-zinc-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading badges…</span>
        </div>
      </ProfileSectionCard>
    );
  }

  if (error) {
    return (
      <ProfileSectionCard title="Achievements & Badges" icon={Award} iconColor="text-amber-400" accentColor="#f59e0b">
        <div className="flex items-center gap-2 text-sm text-red-400 py-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      </ProfileSectionCard>
    );
  }

  if (badges.length === 0) {
    return (
      <ProfileSectionCard title="Achievements & Badges" icon={Award} iconColor="text-amber-400" accentColor="#f59e0b">
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <div className="w-10 h-10 rounded-xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Trophy className="w-5 h-5 text-amber-400/50" />
          </div>
          <p className="text-sm font-semibold text-zinc-400">No badges earned yet</p>
          <p className="text-xs text-zinc-600 max-w-xs">Complete your profile, submit offers, and receive great reviews to unlock badges.</p>
        </div>
      </ProfileSectionCard>
    );
  }

  return (
    <ProfileSectionCard title="Achievements & Badges" icon={Award} iconColor="text-amber-400" accentColor="#f59e0b">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {badges.map((badge) => {
          const style = RARITY_STYLE[badge.rarity] ?? RARITY_STYLE.common;
          const Icon = BADGE_ICON_MAP[badge.icon] ?? Zap;
          const earnedDate = badge.earnedAt
            ? new Date(badge.earnedAt).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
            : null;
          return (
            <div
              key={`${badge.badgeId}-${badge.level}`}
              className={`flex flex-col gap-3 p-4 rounded-xl border ${style.border} ${style.bg} hover:brightness-110 transition-all`}
            >
              <div className={`w-9 h-9 rounded-xl ${style.bg} border ${style.border} flex items-center justify-center`}>
                <Icon className={`w-4 h-4 ${style.color}`} />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <p className={`text-xs font-bold ${style.color}`}>{badge.name}</p>
                  <span className={`text-[9px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded-full border ${style.border} ${style.color} opacity-70`}>{badge.level}</span>
                </div>
                <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{badge.description}</p>
                {earnedDate && <p className="text-[10px] text-zinc-700 mt-1">Earned {earnedDate}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </ProfileSectionCard>
  );
}

import { Zap, CheckCircle2, Star, Shield, Users, Trophy, Loader2 } from "lucide-react";
import { UserBadgeItem } from "../../types";

const RARITY_STYLE: Record<string, { color: string; bg: string; border: string }> = {
  common:    { color: "text-zinc-300",   bg: "bg-zinc-800/50",      border: "border-zinc-700/50" },
  rare:      { color: "text-sky-400",    bg: "bg-sky-400/10",       border: "border-sky-400/20" },
  epic:      { color: "text-violet-400", bg: "bg-violet-400/10",    border: "border-violet-400/20" },
  legendary: { color: "text-amber-400",  bg: "bg-amber-400/10",     border: "border-amber-400/20" },
};

const BADGE_ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
  profile_complete: CheckCircle2,
  top_rated:        Star,
  trusted_helper:   Shield,
  popular_helper:   Users,
  elite_member:     Trophy,
};

interface ProfileBadgesProps {
  badges: UserBadgeItem[];
  loading?: boolean;
  compact?: boolean; // compact=true shows icon row (used in right sidebar)
}

export default function ProfileBadges({ badges, loading, compact = false }: ProfileBadgesProps) {
  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Badges</h3>
        {badges.length > 0 && (
          <button className="text-[10px] font-medium text-[#FF3F3F] hover:underline">View All</button>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 py-2 text-zinc-600">
          <Loader2 className="h-3.5 w-3.5 animate-spin" />
          <span className="text-xs">Loading…</span>
        </div>
      ) : badges.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-center">
          <Trophy className="h-6 w-6 text-zinc-700" />
          <p className="mt-2 text-[11px] text-zinc-600">No badges yet</p>
        </div>
      ) : compact ? (
        // Icon strip — used in sidebar / right column
        <div className="flex flex-wrap gap-3">
          {badges.slice(0, 5).map((badge) => {
            const style = RARITY_STYLE[badge.rarity] ?? RARITY_STYLE.common;
            const Icon = BADGE_ICON_MAP[badge.icon] ?? Zap;
            return (
              <div
                key={`${badge.badgeId}-${badge.level}`}
                title={badge.name}
                className={`flex flex-col items-center gap-1`}
              >
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl border ${style.border} ${style.bg}`}>
                  <Icon className={`h-4 w-4 ${style.color}`} />
                </div>
                <span className={`text-[9px] font-semibold ${style.color} text-center leading-tight max-w-10`}>
                  {badge.name.split(" ").slice(-1)[0]}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        // Full grid — used in badges tab
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
          {badges.map((badge) => {
            const style = RARITY_STYLE[badge.rarity] ?? RARITY_STYLE.common;
            const Icon = BADGE_ICON_MAP[badge.icon] ?? Zap;
            const earnedDate = badge.earnedAt
              ? new Date(badge.earnedAt).toLocaleDateString("en-IN", { month: "short", year: "numeric" })
              : null;
            return (
              <div
                key={`${badge.badgeId}-${badge.level}`}
                className={`flex flex-col gap-2 rounded-xl border p-3 transition hover:brightness-110 ${style.border} ${style.bg}`}
              >
                <div className={`flex h-8 w-8 items-center justify-center rounded-lg border ${style.border} ${style.bg}`}>
                  <Icon className={`h-4 w-4 ${style.color}`} />
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    <p className={`text-xs font-bold ${style.color}`}>{badge.name}</p>
                    <span className={`text-[8px] font-bold uppercase ${style.color} opacity-60`}>{badge.level}</span>
                  </div>
                  <p className="mt-0.5 text-[10px] leading-snug text-zinc-500">{badge.description}</p>
                  {earnedDate && <p className="mt-1 text-[9px] text-zinc-700">Earned {earnedDate}</p>}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

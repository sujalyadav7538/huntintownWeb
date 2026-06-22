import { User } from '../../types';
import {
  Star,
  CheckCircle,
  Clock,
  TrendingUp,
  MessageSquare,
  Users,
  Calendar,
  Percent,
} from 'lucide-react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  accent?: string;
  large?: boolean;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  accent,
  large,
}: StatCardProps) {
  return (
    <div
      className={`relative rounded-2xl bg-white/2.5 border border-white/6 p-4 sm:p-5
        hover:border-white/10 transition-colors duration-300 overflow-hidden ${large ? 'col-span-2 sm:col-span-1' : ''}`}
    >
      {accent && (
        <div
          className="absolute top-0 left-0 w-full h-px opacity-50"
          style={{ background: `linear-gradient(to right, transparent, ${accent}50, transparent)` }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 truncate">
            {label}
          </p>
          <p className={`font-black text-white leading-none ${large ? 'text-4xl' : 'text-2xl'}`}>
            {value}
          </p>
          {sub && <p className="text-xs text-zinc-500 mt-1.5">{sub}</p>}
        </div>
        <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

interface ProfileStatsProps {
  user: User;
}

export default function ProfileStats({ user }: ProfileStatsProps) {
  const rating = user.rating ?? 0;
  const completedRequests = user.completedRequests ?? 0;
  const successRate = user.successRate ?? (completedRequests > 0 ? 94 : 0);
  const responseRate = user.responseRate ?? 98;
  const reputation = user.reputation ?? user.trustScore ?? 0;
  const reviewCount = user.reviewCount ?? 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Rating spotlight */}
      <div className="relative rounded-2xl overflow-hidden border border-[#FF3F3F]/20 bg-linear-to-b from-[#FF3F3F]/8 to-[#FF3F3F]/2 p-5 sm:p-6">
        <div className="absolute -top-8 -right-8 w-28 h-28 bg-[#FF3F3F]/12 rounded-full blur-2xl pointer-events-none" />
        <p className="text-[10px] font-bold text-[#FF3F3F] uppercase tracking-widest mb-2">
          Global Rating
        </p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-5xl font-black text-white leading-none">
            {rating > 0 ? rating.toFixed(1) : '—'}
          </span>
          <span className="text-zinc-500 text-sm mb-1">/ 5.0</span>
        </div>
        <div className="flex items-center gap-1 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < Math.round(rating)
                  ? 'text-amber-400 fill-amber-400'
                  : 'text-zinc-700 fill-zinc-700'
              }`}
            />
          ))}
        </div>
        {reviewCount > 0 && (
          <p className="text-xs text-zinc-500">
            Based on {reviewCount} review{reviewCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>

      {/* Stat grid */}
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Completed"
          value={completedRequests}
          sub="requests"
          icon={CheckCircle}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          accent="#34d399"
        />
        <StatCard
          label="Success Rate"
          value={`${successRate}%`}
          sub="acceptance"
          icon={Percent}
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
          accent="#a78bfa"
        />
        <StatCard
          label="Response"
          value={`${responseRate}%`}
          sub="reply rate"
          icon={MessageSquare}
          iconColor="text-sky-400"
          iconBg="bg-sky-400/10"
          accent="#38bdf8"
        />
        <StatCard
          label="Reputation"
          value={reputation}
          sub="community pts"
          icon={TrendingUp}
          iconColor="text-[#FF3F3F]"
          iconBg="bg-[#FF3F3F]/10"
          accent="#FF3F3F"
        />
      </div>

      {/* Meta info */}
      <div className="rounded-2xl bg-white/2.5 border border-white/6 p-5 space-y-3.5 hover:border-white/10 transition-colors duration-300">
        {user.joinedAt && (
          <div className="flex items-center justify-between text-sm">
            <span className="flex items-center gap-2 text-zinc-500">
              <Calendar className="w-3.5 h-3.5" />
              Member since
            </span>
            <span className="text-zinc-300 font-semibold">{user.joinedAt}</span>
          </div>
        )}
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Users className="w-3.5 h-3.5" />
            Community
          </span>
          <span className="text-zinc-300 font-semibold">
            {(user.communityScore ?? Math.floor((reputation / 5))).toLocaleString()} pts
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            Avg response
          </span>
          <span className="text-zinc-300 font-semibold">~2 hours</span>
        </div>
      </div>
    </div>
  );
}

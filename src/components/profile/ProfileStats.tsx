import {
  Star,
  CheckCircle,
  TrendingUp,
  Percent,
  Zap,
  Calendar,
  Clock,
  Loader2,
  AlertCircle,
  Target,
  BarChart2,
  MessageSquare,
} from "lucide-react";
import { User, UserMetric } from "../../types";
import { getTrustLevel } from "../../hooks/useReputation";

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ComponentType<{ className?: string }>;
  iconColor: string;
  iconBg: string;
  accent?: string;
}

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  iconColor,
  iconBg,
  accent,
}: StatCardProps) {
  return (
    <div className="relative rounded-xl border border-[#1e1e22] bg-[#0e0e11] p-4 overflow-hidden">
      {accent && (
        <div
          className="absolute top-0 left-0 w-full h-px opacity-50"
          style={{
            background: `linear-gradient(to right, transparent, ${accent}50, transparent)`,
          }}
        />
      )}
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-1.5 truncate">
            {label}
          </p>
          <p className="text-2xl font-black text-white leading-none">{value}</p>
          {sub && <p className="text-xs text-zinc-500 mt-1.5">{sub}</p>}
        </div>
        <div
          className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-4 h-4 ${iconColor}`} />
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ title }: { title: string }) {
  return (
    <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-widest pt-1">
      {title}
    </p>
  );
}

interface ProfileStatsProps {
  user: User;
  metric: UserMetric | null;
  loading?: boolean;
  error?: string | null;
}

export default function ProfileStats({
  user,
  metric,
  loading,
  error,
}: ProfileStatsProps) {
  const rating = metric?.reviewMetrics.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics.totalReviews ?? 0;
  const trustScore = metric?.trustScore ?? 0;
  const trustLevel = getTrustLevel(trustScore);

  if (loading) {
    return (
      <div className="flex flex-col gap-4">
        <div className="rounded-xl border border-[#1e1e22] bg-[#0e0e11] p-5 flex items-center justify-center h-32">
          <Loader2 className="w-5 h-5 text-zinc-600 animate-spin" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="h-24 rounded-xl border border-[#1e1e22] bg-[#0e0e11] animate-pulse"
            />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/30 bg-red-950/10 p-5 flex items-center gap-3 text-sm">
        <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
        <p className="text-red-400">{error}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Trust score spotlight */}
      <div className="relative rounded-xl overflow-hidden border border-[#1e1e22] bg-[#0e0e11] p-5">
        <div
          className="absolute top-0 left-0 w-full h-px opacity-60"
          style={{
            background:
              "linear-gradient(to right, transparent, #FF3F3F50, transparent)",
          }}
        />
        <p className="text-[10px] font-bold text-[#FF3F3F] uppercase tracking-widest mb-3">
          Trust Score
        </p>
        <div className="flex items-end gap-3 mb-3">
          <span className="text-5xl font-black text-white leading-none">
            {trustScore.toFixed(0)}
          </span>
          <span className="text-zinc-500 text-sm mb-1">/ 100</span>
        </div>
        <div className="h-2 rounded-full bg-[#1e1e22] mb-3 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-700 ${trustLevel.bar}`}
            style={{ width: `${Math.min(trustScore, 100)}%` }}
          />
        </div>
        <div
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full border text-[10px] font-bold uppercase tracking-wide ${trustLevel.bg} ${trustLevel.border} ${trustLevel.color}`}
        >
          <Zap className="w-2.5 h-2.5" />
          {trustLevel.label}
        </div>
        {rating > 0 && (
          <div className="mt-4 pt-4 border-t border-[#1a1a1e] flex items-center gap-3">
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`w-3.5 h-3.5 ${i < Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-zinc-700 fill-zinc-700"}`}
                />
              ))}
            </div>
            <span className="text-zinc-100 font-bold text-sm">
              {rating.toFixed(1)}
            </span>
            <span className="text-zinc-600 text-xs">
              ({totalReviews} review{totalReviews !== 1 ? "s" : ""})
            </span>
          </div>
        )}
      </div>

      {/* Helper Metrics */}
      <SectionLabel title="As a Helper" />
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Offers Sent"
          value={metric?.helperMetrics.offersSubmitted ?? 0}
          sub="total submitted"
          icon={MessageSquare}
          iconColor="text-sky-400"
          iconBg="bg-sky-400/10"
          accent="#38bdf8"
        />
        <StatCard
          label="Accepted"
          value={metric?.helperMetrics.offersAccepted ?? 0}
          sub="by post owners"
          icon={CheckCircle}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          accent="#34d399"
        />
        <StatCard
          label="Accept Rate"
          value={`${(metric?.helperMetrics.acceptanceScore ?? 0).toFixed(0)}%`}
          sub="offer acceptance"
          icon={Percent}
          iconColor="text-violet-400"
          iconBg="bg-violet-400/10"
          accent="#a78bfa"
        />
        <StatCard
          label="Completion"
          value={`${(metric?.helperMetrics.completionScore ?? 0).toFixed(0)}%`}
          sub="finish rate"
          icon={TrendingUp}
          iconColor="text-pink-400"
          iconBg="bg-pink-400/10"
          accent="#f472b6"
        />
      </div>

      {/* Hunter Metrics */}
      <SectionLabel title="As a Hunter (Post Owner)" />
      <div className="grid grid-cols-2 gap-3">
        <StatCard
          label="Posts Created"
          value={metric?.hunterMetrics.postsCreated ?? 0}
          sub="total posted"
          icon={Target}
          iconColor="text-[#FF3F3F]"
          iconBg="bg-[#FF3F3F]/10"
          accent="#FF3F3F"
        />
        <StatCard
          label="Posts Done"
          value={metric?.hunterMetrics.postsCompleted ?? 0}
          sub="completed"
          icon={CheckCircle}
          iconColor="text-emerald-400"
          iconBg="bg-emerald-400/10"
          accent="#34d399"
        />
        <StatCard
          label="Offers Got"
          value={metric?.hunterMetrics.offersReceived ?? 0}
          sub="received on posts"
          icon={BarChart2}
          iconColor="text-amber-400"
          iconBg="bg-amber-400/10"
          accent="#fbbf24"
        />
        <StatCard
          label="Accept Rate"
          value={`${(metric?.hunterMetrics.acceptanceScore ?? 0).toFixed(0)}%`}
          sub="offers accepted"
          icon={Percent}       
          iconColor="text-teal-400"
          iconBg="bg-teal-400/10"
          accent="#2dd4bf"
        />
      </div>

      {/* Response Metrics */}
      {(metric?.responseMetrics.totalResponseRequests ?? 0) > 0 && (
        <>
          <SectionLabel title="Response" />
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              label="Responded"
              value={metric?.responseMetrics.totalResponses ?? 0}
              sub="total responses"
              icon={MessageSquare}
              iconColor="text-indigo-400"
              iconBg="bg-indigo-400/10"
              accent="#818cf8"
            />
            <StatCard
              label="Response Rate"
              value={`${(metric?.responseMetrics.responseRate ?? 0).toFixed(0)}%`}
              sub="reply rate"
              icon={TrendingUp}
              iconColor="text-cyan-400"
              iconBg="bg-cyan-400/10"
              accent="#22d3ee"
            />
          </div>
        </>
      )}

      {/* Meta info */}
      <div className="rounded-xl border border-[#1e1e22] bg-[#0e0e11] p-5 space-y-3.5">
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
            <Star className="w-3.5 h-3.5" />
            Average Rating
          </span>
          <span className="text-zinc-300 font-semibold">
            {rating > 0 ? `${rating.toFixed(2)} / 5.0` : "No reviews yet"}
          </span>
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="flex items-center gap-2 text-zinc-500">
            <Clock className="w-3.5 h-3.5" />
            Profile completion
          </span>
          <span className="text-zinc-300 font-semibold">
            {(metric?.profileMetrics.completion ?? 0).toFixed(0)}%
          </span>
        </div>
      </div>
    </div>
  );
}

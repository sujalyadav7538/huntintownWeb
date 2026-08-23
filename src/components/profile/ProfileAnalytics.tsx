import {
  Activity,
  BadgeCheck,
  BarChart3,
  CheckCircle2,
  Clock3,
  MessageSquare,
  Shield,
  Star,
  TrendingUp,
} from "lucide-react";
import { UserMetric } from "../../types";

interface ProfileAnalyticsProps {
  metric: UserMetric | null;
}

function pct(value: number) {
  if (!Number.isFinite(value)) return 0;
  return Math.max(0, Math.min(100, Math.round(value)));
}

function StatCard({
  icon: Icon,
  label,
  value,
  hint,
  tone,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  value: string;
  hint?: string;
  tone?: "red" | "blue" | "green" | "amber";
}) {
  const toneClass =
    tone === "green"
      ? "text-emerald-400 bg-emerald-500/15"
      : tone === "blue"
        ? "text-sky-400 bg-sky-500/15"
        : tone === "amber"
          ? "text-amber-400 bg-amber-500/15"
          : "text-[#FF3F3F] bg-[#FF3F3F]/15";

  return (
    <div className="theme-card-subtle rounded-xl border p-3 sm:p-4">
      <div className="mb-2 flex items-center justify-between">
        <span className="theme-text-muted text-[10px] font-semibold uppercase tracking-wider">
          {label}
        </span>
        <span className={`inline-flex h-7 w-7 items-center justify-center rounded-lg ${toneClass}`}>
          <Icon className="h-3.5 w-3.5" />
        </span>
      </div>

      <p className="theme-text-primary text-xl font-black tracking-tight">{value}</p>
      {hint ? <p className="theme-text-muted mt-1 text-[10px]">{hint}</p> : null}
    </div>
  );
}

function ProgressRow({
  label,
  value,
  tone = "#FF3F3F",
}: {
  label: string;
  value: number;
  tone?: string;
}) {
  const safe = pct(value);

  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between">
        <p className="theme-text-secondary text-[11px] font-medium">{label}</p>
        <p className="theme-text-primary text-[11px] font-semibold">{safe}%</p>
      </div>
      <div className="theme-chip-count h-2 overflow-hidden rounded-full border">
        <div
          className="h-full rounded-full transition-all"
          style={{ width: `${safe}%`, backgroundColor: tone }}
        />
      </div>
    </div>
  );
}

export default function ProfileAnalytics({ metric }: ProfileAnalyticsProps) {
  const trust = metric?.trustScore ?? 0;
  const profileCompletion = metric?.profileMetrics?.completion ?? 0;

  const totalReviews = metric?.reviewMetrics?.totalReviews ?? 0;
  const avgRating = metric?.reviewMetrics?.averageRating ?? 0;

  const responsesSubmitted = metric?.helperMetrics?.responsesSubmitted ?? 0;
  const responsesAccepted = metric?.helperMetrics?.responsesAccepted ?? 0;
  const completedResponses = metric?.helperMetrics?.completedResponses ?? 0;

  const postsCreated = metric?.hunterMetrics?.postsCreated ?? 0;
  const postsCompleted = metric?.hunterMetrics?.postsCompleted ?? 0;
  const responsesReceived = metric?.hunterMetrics?.responsesReceived ?? 0;

  const activeDays = metric?.activityMetrics?.activeDays ?? 0;

  const acceptanceRate =
    responsesSubmitted > 0 ? (responsesAccepted / responsesSubmitted) * 100 : 0;
  const completionRate =
    responsesAccepted > 0 ? (completedResponses / responsesAccepted) * 100 : 0;
  const postCompletionRate =
    postsCreated > 0 ? (postsCompleted / postsCreated) * 100 : 0;

  const responseMetrics = (metric as any)?.responseMetrics;
  const avgResponseMins =
    responseMetrics?.averageResponseTime ??
    responseMetrics?.hunter?.averageResponseTime ??
    responseMetrics?.helper?.averageResponseTime ??
    0;

  return (
    <section className="space-y-4">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard
          icon={Shield}
          label="Trust Score"
          value={trust.toFixed(1)}
          hint="Overall account trust"
          tone="red"
        />
        <StatCard
          icon={Star}
          label="Average Rating"
          value={avgRating.toFixed(1)}
          hint={`${totalReviews} review${totalReviews !== 1 ? "s" : ""}`}
          tone="amber"
        />
        <StatCard
          icon={Activity}
          label="Active Days"
          value={String(activeDays)}
          hint="Platform activity"
          tone="blue"
        />
        <StatCard
          icon={Clock3}
          label="Response Time"
          value={avgResponseMins > 0 ? `${Math.round(avgResponseMins)}m` : "—"}
          hint="Avg time to respond"
          tone="green"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="theme-card rounded-xl border p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4 text-[#FF3F3F]" />
            <h3 className="theme-text-primary text-sm font-bold">Performance Rates</h3>
          </div>

          <div className="space-y-4">
            <ProgressRow label="Profile Completion" value={profileCompletion} tone="#3b82f6" />
            <ProgressRow label="Helper Acceptance Rate" value={acceptanceRate} tone="#f59e0b" />
            <ProgressRow label="Helper Completion Rate" value={completionRate} tone="#10b981" />
            <ProgressRow label="Post Completion Rate" value={postCompletionRate} tone="#ef4444" />
          </div>
        </div>

        <div className="theme-card rounded-xl border p-4 sm:p-5">
          <div className="mb-4 flex items-center gap-2">
            <BarChart3 className="h-4 w-4 text-[#FF3F3F]" />
            <h3 className="theme-text-primary text-sm font-bold">Raw Metrics</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <StatCard icon={MessageSquare} label="Responses Sent" value={String(responsesSubmitted)} tone="blue" />
            <StatCard icon={CheckCircle2} label="Responses Accepted" value={String(responsesAccepted)} tone="green" />
            <StatCard icon={BadgeCheck} label="Responses Completed" value={String(completedResponses)} tone="green" />
            <StatCard icon={MessageSquare} label="Responses Received" value={String(responsesReceived)} tone="amber" />
            <StatCard icon={BarChart3} label="Posts Created" value={String(postsCreated)} tone="red" />
            <StatCard icon={CheckCircle2} label="Posts Completed" value={String(postsCompleted)} tone="green" />
          </div>
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from "react";
import { Archive, CheckCheck, CircleCheck, FileText, Inbox, Send } from "lucide-react";
import { apiFetch } from "@/src/shared/lib/api";
import type { UserMetric } from "@/src/shared/types";
import type { DashboardPost, SubmittedResponse } from "./types";

interface DashboardOverviewStatsProps {
  posts: DashboardPost[];
  submitted: SubmittedResponse[];
  revision: number;
}

export default function DashboardOverviewStats({ posts, submitted, revision }: DashboardOverviewStatsProps) {
  const [metric, setMetric] = useState<UserMetric | null>(null);

  useEffect(() => {
    let active = true;
    const loadMetrics = async () => {
      try {
        const response = await apiFetch("/api/profile/metrics");
        const body = await response.json();
        if (!response.ok) throw new Error(body?.message || "Could not load dashboard statistics.");
        if (active) setMetric(body.metric ?? null);
      } catch {
        if (active) setMetric(null);
      }
    };
    void loadMetrics();
    return () => { active = false; };
  }, [revision]);

  const activeCount = posts.filter((post) => ["live", "in_progress"].includes(post.status)).length;
  const receivedCount = posts.reduce((total, post) => total + (post.responsesCount || 0), 0);
  const acceptedCount = (metric?.hunterMetrics?.responsesAccepted ?? 0) + (metric?.helperMetrics?.responsesAccepted ?? 0);
  const completedCount = metric?.hunterMetrics?.postsCompleted ?? posts.filter((post) => post.status === "completed").length;
  const stats = [
    { label: "Requirements created", value: posts.length, icon: FileText, tint: "text-[#FF6B6B] bg-[#FF3F3F]/10" },
    { label: "Active requirements", value: activeCount, icon: Archive, tint: "text-sky-300 bg-sky-400/10" },
    { label: "Offers received", value: receivedCount, icon: Inbox, tint: "text-amber-300 bg-amber-400/10" },
    { label: "Offers submitted", value: submitted.length, icon: Send, tint: "text-cyan-300 bg-cyan-400/10" },
    { label: "Offers accepted", value: acceptedCount, icon: CheckCheck, tint: "text-emerald-300 bg-emerald-400/10" },
    { label: "Requirements completed", value: completedCount, icon: CircleCheck, tint: "text-lime-300 bg-lime-400/10" },
  ];

  return (
    <section aria-label="Dashboard statistics" className="grid grid-cols-2 gap-2 sm:grid-cols-3 xl:grid-cols-6">
      {stats.map(({ label, value, icon: Icon, tint }) => (
        <article key={label} className="theme-card min-w-0 rounded-lg border-l-2 px-3 py-3.5 sm:px-4">
          <div className="flex items-center justify-between gap-2">
            <span className="theme-text-muted truncate text-[10px] font-semibold uppercase tracking-wide">{label}</span>
            <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tint}`}><Icon className="h-3.5 w-3.5" /></span>
          </div>
          <p className="theme-text-primary mt-2 font-display text-2xl font-bold tabular-nums">{value}</p>
        </article>
      ))}
    </section>
  );
}

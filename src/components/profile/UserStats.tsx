import { Star, Shield, CheckCircle2, UserCheck } from "lucide-react";

import OwnerStatsActions from "./OwnerStatsActions";
import { UserMetric } from "../../types";

interface UserStatsProps {
  metric?: UserMetric | null;
  isOwner: boolean;
  myPostsCount: number;

  onMyPosts: () => void;
  onApplications: () => void;
  onSavedPosts: () => void;
  onAnalytics: () => void;
}

const UserStats = ({
  metric,
  isOwner,
  myPostsCount,
  onMyPosts,
  onApplications,
  onSavedPosts,
  onAnalytics,
}: UserStatsProps) => {
  /*
   * =========================================================
   * REVIEW METRICS
   * =========================================================
   */

  const rating = metric?.reviewMetrics?.averageRating ?? 0;

  const totalReviews = metric?.reviewMetrics?.totalReviews ?? 0;

  /*
   * =========================================================
   * HELPER METRICS
   * =========================================================
   */

  const responsesSubmitted = metric?.helperMetrics?.responsesSubmitted ?? 0;

  const responsesAccepted = metric?.helperMetrics?.responsesAccepted ?? 0;

  const completedResponses = metric?.helperMetrics?.completedResponses ?? 0;

  /*
   * Acceptance rate
   */
  const acceptanceRate =
    responsesSubmitted > 0
      ? Math.round((responsesAccepted / responsesSubmitted) * 100)
      : 0;

  /*
   * Completion rate
   */
  const completionRate =
    responsesAccepted > 0
      ? Math.round((completedResponses / responsesAccepted) * 100)
      : 0;

  /*
   * =========================================================
   * HUNTER METRICS
   * =========================================================
   */

  const postsCreated = metric?.hunterMetrics?.postsCreated ?? 0;

  const postsCompleted = metric?.hunterMetrics?.postsCompleted ?? 0;

  const responsesReceived = metric?.hunterMetrics?.responsesReceived ?? 0;

  /*
   * Post completion rate
   */
  const postCompletionRate =
    postsCreated > 0 ? Math.round((postsCompleted / postsCreated) * 100) : 0;

  /*
   * =========================================================
   * PROFILE
   * =========================================================
   */

  const profileCompletion = metric?.profileMetrics?.completion ?? 0;

  /*
   * =========================================================
   * TRUST
   * =========================================================
   */

  const trustScore = metric?.trustScore ?? 0;

  /*
   * =========================================================
   * ACTIVITY
   * =========================================================
   */

  const activeDays = metric?.activityMetrics?.activeDays ?? 0;

  /*
   * =========================================================
   * COMPACT STATS
   * =========================================================
   *
   * These are the four most useful numbers for the profile
   * header.
   */

  const stats = [
    {
      label: "Trust Score",
      value: trustScore > 0 ? trustScore.toFixed(1) : "0",
      icon: Shield,
      iconClass: "text-[#ff5a5a] fill-[#ff3f3f]/20",
    },
    {
      label: "Rating",
      value: rating > 0 ? rating.toFixed(1) : "0.0",
      icon: Star,
      iconClass: "text-amber-400 fill-amber-400",
      desc:
        totalReviews > 0
          ? `${totalReviews} review${totalReviews !== 1 ? "s" : ""}`
          : "0 Reviews",
    },
    {
      label: "Completed",
      value: completedResponses.toString(),
      icon: CheckCircle2,
      iconClass: "text-emerald-400 fill-emerald-400/10",
      desc:
        responsesSubmitted > 0
          ? `${acceptanceRate}% acceptance`
          : "0% acceptance",
    },
    {
      label: "Profile",
      value: `${profileCompletion}%`,
      icon: UserCheck,
      iconClass: "text-blue-400 fill-blue-400/10",
      desc:
        responsesReceived > 0
          ? `${responsesReceived} responses`
          : `${activeDays} active day${activeDays !== 1 ? "s" : ""}`,
    },
  ];

  return (
    <div className="space-y-3">
      {/* =====================================================
          COMPACT STATS
      ====================================================== */}

      <div className="theme-card grid grid-cols-2 overflow-hidden rounded-xl border sm:grid-cols-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;

          return (
            <div
              key={stat.label}
              className={`theme-divider min-w-0 px-3 py-3.5 flex flex-row items-center gap-3 sm:justify-center sm:px-4 ${
                index % 2 !== 0 ? "border-l" : ""
              } ${index > 1 ? "border-t sm:border-t-0" : ""} ${
                index > 0 ? "sm:border-l" : ""
              }`}
            >
              <div className="theme-chip flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border sm:h-9 sm:w-9">
                <Icon className={`h-4 w-4 ${stat.iconClass}`} />
              </div>

              <div className="min-w-0 flex flex-col">
                <span className="theme-text-primary text-[13px] font-bold sm:text-[14px]">
                  {stat.value}
                </span>

                <p className="theme-text-secondary line-clamp-1 text-[9px] font-medium sm:text-[10px]">
                  {stat.label}
                </p>

                {stat?.desc && (
                  <span className="theme-text-muted line-clamp-1 text-[8px] sm:text-[9px]">
                    {stat?.desc}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default UserStats;

import { useState } from "react";
import {
  Award,
  BadgeCheck,
  Briefcase,
  Calendar,
  CheckCircle2,
  Clock3,
  Edit3,
  Globe2,
  Heart,
  Languages,
  MessageCircle,
  ShieldCheck,
  Star,
  TrendingUp,
  UserRound,
  Users,
  Zap,
} from "lucide-react";

import { User, UserMetric } from "../../types";
import { getTrustLevel } from "@/src/data";

interface ProfileContentProps {
  user: User;
  metric?: UserMetric | null;
  isOwner: boolean;

  skills?: string[];
  memberSince?: string;
  responseTime?: string;
  languages?: string[];

  myPostsCount?: number;
  applicationsCount?: number;
  savedPostsCount?: number;
  offersGivenCount?: number;

  onEdit?: () => void;
  onViewAllPosts?: () => void;
  onViewAllReviews?: () => void;
  onViewAllBadges?: () => void;
}

type Tab = "about" | "badges" | "reviews" | "posts" | "offers" | "saved";

const TABS: {
  id: Tab;
  label: string;
}[] = [
  { id: "about", label: "About" },
  { id: "badges", label: "Badges" },
  { id: "reviews", label: "Reviews" },
  { id: "posts", label: "Posts" },
  { id: "offers", label: "Offers Given" },
  { id: "saved", label: "Saved" },
];

export default function ProfileContent({
  user,
  metric,
  isOwner,
  skills = [],
  memberSince = "—",
  responseTime = "Usually within 1 hour",
  languages = ["English", "Hindi"],
  myPostsCount = 0,
  applicationsCount = 0,
  savedPostsCount = 0,
  offersGivenCount = 0,
  onEdit,
  onViewAllPosts,
  onViewAllReviews,
  onViewAllBadges,
}: ProfileContentProps) {
  const [activeTab, setActiveTab] = useState<Tab>("about");

  const rating = metric?.reviewMetrics?.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics?.totalReviews ?? 0;
  const trustScore = metric?.trustScore ?? 0;

  const trustLevel = getTrustLevel(trustScore);

  const completedOffers = metric?.helperMetrics?.completedOffers ?? 0;

  const successRate = metric?.helperMetrics?.acceptanceScore ?? 0;

  return (
    <section className="mt-4 overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#0e0e10]">
      {/* =========================================================
          TABS
      ========================================================= */}
      <div className="overflow-x-auto border-b border-[#1e1e22] scrollbar-hide">
        <div className="flex min-w-max px-2 sm:px-4">
          {TABS.map((tab) => {
            const active = activeTab === tab.id;

            let count: number | null = null;

            if (tab.id === "reviews") count = totalReviews;
            if (tab.id === "posts") count = myPostsCount;
            if (tab.id === "offers") count = offersGivenCount;
            if (tab.id === "saved" && isOwner) count = savedPostsCount;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`relative shrink-0 px-4 py-4 text-[12px] font-semibold transition-colors sm:px-6 sm:text-[13px] ${
                  active ? "text-white" : "text-zinc-600 hover:text-zinc-300"
                }`}
              >
                {tab.label}

                {count !== null && (
                  <span
                    className={`ml-1 ${
                      active ? "text-zinc-400" : "text-zinc-700"
                    }`}
                  >
                    ({count})
                  </span>
                )}

                {active && (
                  <span className="absolute bottom-0 left-3 right-3 h-0.5 rounded-t-full bg-[#FF3F3F]" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* =========================================================
          TAB CONTENT
      ========================================================= */}
      <div className="p-3 sm:p-5">
        {activeTab === "about" && (
          <AboutSection
            user={user}
            isOwner={isOwner}
            skills={skills}
            memberSince={memberSince}
            responseTime={responseTime}
            languages={languages}
            trustLevel={trustLevel}
            onEdit={onEdit}
          />
        )}

        {activeTab === "badges" && (
          <BadgesSection onViewAll={onViewAllBadges} />
        )}

        {activeTab === "reviews" && (
          <ReviewsSection
            rating={rating}
            totalReviews={totalReviews}
            onViewAll={onViewAllReviews}
          />
        )}

        {activeTab === "posts" && (
          <PostsSection
            isOwner={isOwner}
            count={myPostsCount}
            onViewAll={onViewAllPosts}
          />
        )}

        {activeTab === "offers" && <OffersSection count={offersGivenCount} />}

        {activeTab === "saved" && <SavedSection count={savedPostsCount} />}
      </div>
    </section>
  );
}

/* ============================================================
   ABOUT
============================================================ */

interface AboutSectionProps {
  user: User;
  isOwner: boolean;
  skills: string[];
  memberSince: string;
  responseTime: string;
  languages: string[];
  trustLevel: ReturnType<typeof getTrustLevel>;
  onEdit?: () => void;
}

function AboutSection({
  user,
  isOwner,
  skills,
  memberSince,
  responseTime,
  languages,
  trustLevel,
  onEdit,
}: AboutSectionProps) {
  return (
    <div className="grid gap-3 lg:grid-cols-[1.55fr_1fr]">
      {/* About Me */}
      <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold text-white">About Me</h2>

          {isOwner && (
            <button
              type="button"
              onClick={onEdit}
              className="inline-flex items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-3 py-2 text-[10px] font-semibold text-zinc-400 transition hover:bg-white/[0.05] hover:text-white"
            >
              <Edit3 className="h-3 w-3" />
              Edit
            </button>
          )}
        </div>

        <p className="mt-5 text-[12px] leading-6 text-zinc-400 sm:text-[13px] sm:leading-7">
          {user.bio ||
            "This member hasn't added a profile description yet. As they complete more work and interact with the HuntInTown community, their profile will become more detailed."}
        </p>

        {/* Profile information */}
        <div className="mt-6 space-y-4">
          <ProfileInfo
            icon={Calendar}
            label="Member since"
            value={memberSince}
          />

          <ProfileInfo
            icon={Clock3}
            label="Response time"
            value={responseTime}
          />

          <ProfileInfo
            icon={Languages}
            label="Languages"
            value={languages.length ? languages.join(", ") : "—"}
          />

          <ProfileInfo
            icon={ShieldCheck}
            label="Govt. Verified"
            value={user.isGovernmentVerified ? "Verified" : "Not verified"}
            verified={user.isGovernmentVerified}
          />

          {user.address && (
            <ProfileInfo icon={Globe2} label="Location" value={user.address} />
          )}
        </div>
      </div>

      {/* Skills */}
      <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-6">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-[18px] font-bold text-white">Skills</h2>

          {skills.length > 0 && (
            <button
              type="button"
              className="text-[11px] font-semibold text-[#FF3F3F] hover:text-[#ff6565]"
            >
              View all
            </button>
          )}
        </div>

        {skills.length > 0 ? (
          <div className="mt-5 flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-lg border border-white/[0.06] bg-white/[0.035] px-3 py-2 text-[10px] font-medium text-zinc-300 sm:text-[11px]"
              >
                {skill}
              </span>
            ))}
          </div>
        ) : (
          <div className="mt-5 rounded-xl border border-dashed border-white/[0.07] bg-white/[0.015] px-4 py-8 text-center">
            <Briefcase className="mx-auto h-5 w-5 text-zinc-700" />

            <p className="mt-2 text-[11px] text-zinc-600">
              No skills added yet
            </p>

            {isOwner && (
              <button
                type="button"
                onClick={onEdit}
                className="mt-3 text-[10px] font-semibold text-[#FF3F3F]"
              >
                + Add Skill
              </button>
            )}
          </div>
        )}

        {/* Trust card */}
        <div className="mt-7 rounded-xl border border-[#FF3F3F]/10 bg-[#FF3F3F]/[0.025] p-4">
          <div className="flex items-center gap-3">
            <div
              className={`flex h-9 w-9 items-center justify-center rounded-lg ${trustLevel.bg}`}
            >
              <ShieldCheck className={`h-4 w-4 ${trustLevel.color}`} />
            </div>

            <div>
              <p className="text-[11px] font-semibold text-zinc-300">
                Reputation
              </p>

              <p
                className={`mt-0.5 text-[10px] font-medium ${trustLevel.color}`}
              >
                {trustLevel.label}
              </p>
            </div>
          </div>

          <p className="mt-3 text-[10px] leading-5 text-zinc-600">
            Reputation is built from genuine interactions, completed work,
            profile quality and community feedback.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   PROFILE INFO ROW
============================================================ */

interface ProfileInfoProps {
  icon: React.ElementType;
  label: string;
  value: string;
  verified?: boolean;
}

function ProfileInfo({ icon: Icon, label, value, verified }: ProfileInfoProps) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/[0.025]">
        <Icon className="h-3.5 w-3.5 text-zinc-600" />
      </div>

      <span className="text-[10px] text-zinc-600 sm:text-[11px]">{label}</span>

      <div className="ml-auto flex min-w-0 items-center gap-1.5">
        <span className="truncate text-right text-[10px] font-medium text-zinc-300 sm:text-[11px]">
          {value}
        </span>

        {verified && (
          <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
        )}
      </div>
    </div>
  );
}

/* ============================================================
   BADGES
============================================================ */

function BadgesSection({ onViewAll }: { onViewAll?: () => void }) {
  const badges = [
    {
      name: "Verified Hunter",
      icon: ShieldCheck,
      className: "text-blue-400 bg-blue-500/10",
    },
    {
      name: "Top Rated",
      icon: Star,
      className: "text-amber-400 bg-amber-500/10",
    },
    {
      name: "Quick Responder",
      icon: Zap,
      className: "text-emerald-400 bg-emerald-500/10",
    },
    {
      name: "Skilled Pro",
      icon: Award,
      className: "text-violet-400 bg-violet-500/10",
    },
    {
      name: "Trusted",
      icon: CheckCircle2,
      className: "text-orange-400 bg-orange-500/10",
    },
  ];

  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-white">Badges</h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-[#FF3F3F]"
        >
          View All
        </button>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
        {badges.map((badge) => {
          const Icon = badge.icon;

          return (
            <div
              key={badge.name}
              className="flex flex-col items-center justify-center rounded-xl border border-white/[0.05] bg-white/[0.015] px-2 py-5"
            >
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl ${badge.className}`}
              >
                <Icon className="h-5 w-5" />
              </div>

              <p className="mt-3 text-center text-[10px] font-semibold text-zinc-300">
                {badge.name}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ============================================================
   REVIEWS
============================================================ */

function ReviewsSection({
  rating,
  totalReviews,
  onViewAll,
}: {
  rating: number;
  totalReviews: number;
  onViewAll?: () => void;
}) {
  const distribution = [
    { stars: 5, count: Math.round(totalReviews * 0.75) },
    { stars: 4, count: Math.round(totalReviews * 0.2) },
    { stars: 3, count: Math.round(totalReviews * 0.05) },
    { stars: 2, count: 0 },
    { stars: 1, count: 0 },
  ];

  const maxCount = Math.max(...distribution.map((item) => item.count), 1);

  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-white">
          Reviews ({totalReviews})
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-[#FF3F3F]"
        >
          View All
        </button>
      </div>

      <div className="mt-6 grid gap-6 md:grid-cols-[180px_1fr_280px]">
        {/* Rating */}
        <div className="flex flex-col items-center justify-center md:border-r md:border-[#1e1e22]">
          <p className="text-4xl font-black text-white">
            {rating > 0 ? rating.toFixed(1) : "—"}
          </p>

          <div className="mt-2 flex gap-0.5">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star
                key={index}
                className="h-3.5 w-3.5 fill-amber-400 text-amber-400"
              />
            ))}
          </div>

          <p className="mt-2 text-[10px] text-zinc-600">
            {totalReviews} reviews
          </p>
        </div>

        {/* Distribution */}
        <div className="space-y-2.5">
          {distribution.map((item) => {
            const percentage = (item.count / maxCount) * 100;

            return (
              <div key={item.stars} className="flex items-center gap-2">
                <span className="w-8 text-[10px] text-zinc-500">
                  {item.stars} ★
                </span>

                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-zinc-800">
                  <div
                    className="h-full rounded-full bg-amber-400"
                    style={{
                      width: `${percentage}%`,
                    }}
                  />
                </div>

                <span className="w-5 text-right text-[9px] text-zinc-600">
                  {item.count}
                </span>
              </div>
            );
          })}
        </div>

        {/* Featured review */}
        <div className="rounded-xl border border-white/[0.05] bg-white/[0.025] p-4">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800">
              <UserRound className="h-4 w-4 text-zinc-500" />
            </div>

            <div>
              <p className="text-[10px] font-semibold text-zinc-300">
                Recent Review
              </p>

              <div className="mt-0.5 flex gap-0.5">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star
                    key={index}
                    className="h-2.5 w-2.5 fill-amber-400 text-amber-400"
                  />
                ))}
              </div>
            </div>
          </div>

          <p className="mt-3 text-[10px] leading-5 text-zinc-500">
            Excellent work! Very professional and completed the job on time.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   POSTS
============================================================ */

function PostsSection({
  isOwner,
  count,
  onViewAll,
}: {
  isOwner: boolean;
  count: number;
  onViewAll?: () => void;
}) {
  const posts = [
    {
      status: "Urgent",
      title: "Need electrician for home wiring",
      location: "Andheri, Mumbai",
      budget: "₹2,500 - ₹4,000",
      applications: 5,
    },
    {
      status: "Active",
      title: "Fix power backup issue",
      location: "Bandra, Mumbai",
      budget: "₹800 - ₹1,200",
      applications: 3,
    },
    {
      status: "Active",
      title: "Install ceiling fans in 2 rooms",
      location: "Dadar, Mumbai",
      budget: "₹1,000 - ₹1,500",
      applications: 7,
    },
  ];

  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-[18px] font-bold text-white">
          {isOwner ? "My Posts" : "Recent Posts"}
          {count > 0 && <span className="ml-1 text-zinc-600">({count})</span>}
        </h2>

        <button
          type="button"
          onClick={onViewAll}
          className="text-[11px] font-semibold text-[#FF3F3F]"
        >
          View All
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <div
            key={post.title}
            className="rounded-xl border border-white/[0.05] bg-white/[0.015] p-3.5"
          >
            <span
              className={`inline-flex rounded-md px-2 py-1 text-[9px] font-bold ${
                post.status === "Urgent"
                  ? "bg-[#FF3F3F]/10 text-[#ff6565]"
                  : "bg-emerald-500/10 text-emerald-400"
              }`}
            >
              {post.status}
            </span>

            <h3 className="mt-3 line-clamp-2 text-[12px] font-semibold leading-5 text-zinc-200">
              {post.title}
            </h3>

            <p className="mt-2 text-[9px] text-zinc-600">{post.location}</p>

            <p className="mt-3 text-[11px] font-semibold text-zinc-300">
              {post.budget}
            </p>

            <p className="mt-2 text-[9px] text-[#FF3F3F]">
              {post.applications} Applications
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ============================================================
   OFFERS
============================================================ */

function OffersSection({ count }: { count: number }) {
  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
          <Briefcase className="h-5 w-5 text-amber-400" />
        </div>

        <div>
          <h2 className="text-[16px] font-bold text-white">Offers Given</h2>

          <p className="text-[10px] text-zinc-600">{count} offers submitted</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-white/[0.06] p-8 text-center">
        <TrendingUp className="mx-auto h-6 w-6 text-zinc-700" />

        <p className="mt-2 text-[11px] text-zinc-600">
          Offer history will appear here.
        </p>
      </div>
    </div>
  );
}

/* ============================================================
   SAVED
============================================================ */

function SavedSection({ count }: { count: number }) {
  return (
    <div className="rounded-xl border border-[#1e1e22] bg-[#111113] p-6">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-500/10">
          <Heart className="h-5 w-5 text-violet-400" />
        </div>

        <div>
          <h2 className="text-[16px] font-bold text-white">Saved Posts</h2>

          <p className="text-[10px] text-zinc-600">{count} saved posts</p>
        </div>
      </div>

      <div className="mt-5 rounded-xl border border-dashed border-white/[0.06] p-8 text-center">
        <Heart className="mx-auto h-6 w-6 text-zinc-700" />

        <p className="mt-2 text-[11px] text-zinc-600">
          Your saved posts will appear here.
        </p>
      </div>
    </div>
  );
}

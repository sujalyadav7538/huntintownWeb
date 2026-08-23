import {
  MapPin,
  Clock,
  ArrowUpRight,
  Users,
  ChevronRight,
  Briefcase,
} from "lucide-react";
import { Post } from "../../types";
import { useState } from "react";
import PostDetailView from "../explore/PostDetailView";
import { handleHideMobileBottomNav } from "@/src/store/uiSlice";
import { useAppDispatch } from "@/src/store/hooks";
import { useNavigate } from "react-router-dom";

interface ProfileRecentPostsProps {
  posts: Post[];
  total: number;
  onViewAll?: () => void;
  isOwner?: boolean;
  compact?: boolean;
}

const STATUS_STYLE: Record<
  string,
  {
    label: string;
    className: string;
    dot: string;
  }
> = {
  live: {
    label: "Active",
    className: "bg-emerald-400/10 text-emerald-400 border-emerald-400/15",
    dot: "bg-emerald-400",
  },
  in_progress: {
    label: "In Progress",
    className: "bg-blue-400/10 text-blue-400 border-blue-400/15",
    dot: "bg-blue-400",
  },
  completed: {
    label: "Completed",
    className: "bg-zinc-700/30 text-zinc-400 border-zinc-700/30",
    dot: "bg-zinc-500",
  },
  expired: {
    label: "Expired",
    className: "bg-zinc-800/50 text-zinc-600 border-zinc-800",
    dot: "bg-zinc-600",
  },
  cancelled: {
    label: "Cancelled",
    className: "bg-red-400/10 text-red-400 border-red-400/15",
    dot: "bg-red-400",
  },
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();

  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";

  return `${days}d ago`;
}

function getApplicationProgress(count: number) {
  if (count === 0) return 5;
  if (count <= 2) return 25;
  if (count <= 5) return 50;
  if (count <= 10) return 75;
  return 100;
}

export default function ProfileRecentPosts({
  posts,
  total,
  onViewAll,
  isOwner,
  compact = false,
}: ProfileRecentPostsProps) {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClosePost = () => {
    dispatch(handleHideMobileBottomNav(false));
    setSelectedPost(null);
  };

  const handleSelectPost = (post: Post) => {
    dispatch(handleHideMobileBottomNav(true));
    setSelectedPost(post);
  };

  if (selectedPost) {
    return (
      <PostDetailView
        post={selectedPost}
        onBack={handleClosePost}
        onViewProfile={() => {
          navigate(`/profile/${selectedPost.author.id}`);
          setSelectedPost(null);
        }}
      />
    );
  }

  const visiblePosts = compact ? posts.slice(0, 2) : posts.slice(0, 3);

  return (
    <section
      className={`overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#111113] ${
        compact ? "rounded-xl" : ""
      }`}
    >
      {/* Header */}
      <div
        className={`flex items-center justify-between border-b border-[#1e1e22] ${
          compact ? "px-3 py-2.5" : "px-4 py-3.5 sm:px-5"
        }`}
      >
        <div>
          <div className="flex items-center gap-2">
            <Briefcase
              className={compact ? "h-3 w-3 text-[#FF3F3F]" : "h-3.5 w-3.5 text-[#FF3F3F]"}
            />

            <h3
              className={
                compact
                  ? "text-[11px] font-bold text-white"
                  : "text-[12px] font-bold text-white sm:text-[13px]"
              }
            >
              {isOwner ? "My Posts" : "Recent Posts"}
            </h3>

            <span
              className={
                compact
                  ? "rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[8px] font-medium text-zinc-500"
                  : "rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] font-medium text-zinc-500"
              }
            >
              {total}
            </span>
          </div>

          {!compact && (
            <p className="mt-0.5 text-[9px] text-zinc-600">
              {isOwner
                ? "Manage your recent requirements"
                : "Latest requirements posted"}
            </p>
          )}
        </div>

        {total > 0 && (
          <button
            type="button"
            onClick={onViewAll}
            className={`group flex items-center gap-1 font-semibold text-[#FF3F3F] transition hover:text-[#ff6262] ${
              compact ? "text-[9px]" : "text-[10px]"
            }`}
          >
            {compact ? "All" : "View All"}
            <ArrowUpRight
              className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5`}
            />
          </button>
        )}
      </div>

      {/* Empty state */}
      {visiblePosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-[#1e1e22] bg-[#0e0e10]">
            <Briefcase className="h-5 w-5 text-zinc-700" />
          </div>

          <p className="mt-3 text-[11px] font-semibold text-zinc-400">
            No posts yet
          </p>

          <p className="mt-1 max-w-xs text-[9px] leading-4 text-zinc-600">
            {isOwner
              ? "Create your first post and start getting responses."
              : "This user hasn't posted anything yet."}
          </p>
        </div>
      ) : (
        <>
          {/* Desktop / tablet */}
          <div
            className={`hidden sm:grid ${
              compact ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"
            } ${compact ? "gap-2.5 p-3" : "gap-3 p-4"}`}
          >
            {visiblePosts.map((post) => (
              <PostCard
                key={post.id}
                post={post}
                isOwner={isOwner}
                compact={compact}
                onClick={() => !isOwner && handleSelectPost(post)}
              />
            ))}
          </div>

          {/* Mobile horizontal cards */}
          <div
            className={`scrollbar-none flex overflow-x-auto sm:hidden [&::-webkit-scrollbar]:hidden ${
              compact ? "gap-2.5 p-3 pb-3" : "gap-3 p-4 pb-4"
            }`}
          >
            {visiblePosts.map((post) => (
              <div
                key={post.id}
                className={`shrink-0 ${
                  compact ? "w-[78vw] max-w-68" : "w-[82vw] max-w-75"
                }`}
              >
                <PostCard
                  post={post}
                  isOwner={isOwner}
                  compact={compact}
                  onClick={() => !isOwner && handleSelectPost(post)}
                />
              </div>
            ))}
          </div>

          {/* Mobile scroll indicator */}
          {visiblePosts.length > 1 && (
            <div className="flex justify-center gap-1 pb-3 sm:hidden">
              {visiblePosts.map((post, index) => (
                <span
                  key={post.id}
                  className={`h-1 rounded-full transition-all ${
                    index === 0 ? "w-4 bg-[#FF3F3F]" : "w-1 bg-zinc-700"
                  }`}
                />
              ))}
            </div>
          )}
        </>
      )}

      {/* Bottom CTA */}
      {total > 3 && (
        <button
          type="button"
          onClick={onViewAll}
          className={`group flex w-full items-center justify-center gap-1.5 border-t border-[#1e1e22] font-semibold text-zinc-500 transition hover:bg-white/2 hover:text-[#FF3F3F] ${
            compact ? "py-2 text-[9px]" : "py-3 text-[10px]"
          }`}
        >
          View all {total} posts
          <ChevronRight
            className={`${compact ? "h-2.5 w-2.5" : "h-3 w-3"} transition-transform group-hover:translate-x-0.5`}
          />
        </button>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* Post Card                                                                   */
/* -------------------------------------------------------------------------- */

interface PostCardProps {
  post: Post;
  isOwner?: boolean;
  onClick?: () => void;
  compact?: boolean;
}

function PostCard({ post, isOwner, onClick, compact }: PostCardProps) {
  const status = STATUS_STYLE[post.status] ?? STATUS_STYLE.live;

  const applications = post.responsesCount ?? 0;
  const progress = getApplicationProgress(applications);

  return (
    <article
      onClick={onClick}
      className={`
        group relative flex flex-col overflow-hidden rounded-xl
        border border-[#1e1e22] bg-[#0e0e10]
        ${compact ? "min-h-0 p-2.5" : "min-h-51.25 p-3.5"}
        transition-all duration-200
        ${
          !isOwner
            ? "cursor-pointer hover:-translate-y-0.5 hover:border-[#34343a] hover:bg-[#111114] hover:shadow-[0_10px_30px_rgba(0,0,0,0.25)]"
            : ""
        }
      `}
    >
      {/* Top row */}
      <div className="flex items-center justify-between gap-2">
        <span
          className={`
            inline-flex items-center gap-1 rounded-md border
            font-bold uppercase tracking-wide
            ${compact ? "px-1.5 py-0.5 text-[7px]" : "px-1.5 py-1 text-[8px]"}
            ${status.className}
          `}
        >
          <span
            className={`
              rounded-full ${status.dot}
              ${compact ? "h-1 w-1" : "h-1.5 w-1.5"}
            `}
          />
          {status.label}
        </span>

        {!isOwner && (
          <div
            className={`
              flex items-center justify-center rounded-md
              bg-[#171719] text-zinc-600
              transition group-hover:bg-[#1e1e22] group-hover:text-zinc-300
              ${compact ? "h-5 w-5" : "h-6 w-6"}
            `}
          >
            <ArrowUpRight className={compact ? "h-2.5 w-2.5" : "h-3 w-3"} />
          </div>
        )}
      </div>

      {/* Category */}
      {post.category && (
        <p
          className={`
            font-semibold uppercase tracking-wider text-[#FF3F3F]
            ${compact ? "mt-2 text-[7px]" : "mt-3 text-[8px]"}
          `}
        >
          {post.category}
        </p>
      )}

      {/* Title */}
      <h4
        className={`
          line-clamp-2 font-bold text-zinc-100
          ${
            compact
              ? "mt-1 text-[11px] leading-3.5"
              : "mt-1.5 text-[12px] leading-4.5"
          }
        `}
      >
        {post.title}
      </h4>

      {/* Location */}
      <div
        className={`
          flex items-center text-zinc-600
          ${compact ? "mt-2 gap-1 text-[8px]" : "mt-3 gap-1.5 text-[9px]"}
        `}
      >
        <MapPin
          className={`
            shrink-0 text-zinc-700
            ${compact ? "h-2.5 w-2.5" : "h-3 w-3"}
          `}
        />

        <span className="truncate">
          {post.address?.split(",").slice(0, 2).join(",") ||
            "Location not specified"}
        </span>
      </div>

      {/* Budget + time */}
      <div
        className={`
          flex items-center justify-between gap-2
          ${compact ? "mt-1.5" : "mt-2"}
        `}
      >
        {post.budget ? (
          <span
            className={`
              truncate font-semibold text-zinc-300
              ${compact ? "text-[9px]" : "text-[10px]"}
            `}
          >
            {post.budget}
          </span>
        ) : (
          <span
            className={
              compact ? "text-[9px] text-zinc-600" : "text-[10px] text-zinc-600"
            }
          >
            Negotiable
          </span>
        )}

        <span
          className={`
            flex shrink-0 items-center gap-1 text-zinc-600
            ${compact ? "text-[7px]" : "text-[8px]"}
          `}
        >
          <Clock className={compact ? "h-2 w-2" : "h-2.5 w-2.5"} />
          {timeAgo(post.createdAt)}
        </span>
      </div>

      {/* Spacer only for normal card */}
      {!compact && <div className="flex-1" />}

      {/* Applications */}
      <div
        className={`
          border-t border-[#1e1e22]
          ${compact ? "mt-2.5 pt-2" : "mt-4 pt-3"}
        `}
      >
        <div className="flex items-center justify-between">
          <div
            className={`
              flex items-center
              ${compact ? "gap-1" : "gap-1.5"}
            `}
          >
            <div
              className={`
                flex items-center justify-center rounded-md bg-[#FF3F3F]/10
                ${compact ? "h-5 w-5" : "h-6 w-6"}
              `}
            >
              <Users
                className={
                  compact
                    ? "h-2.5 w-2.5 text-[#FF3F3F]"
                    : "h-3 w-3 text-[#FF3F3F]"
                }
              />
            </div>

            <div>
              <p
                className={`
                  font-semibold text-zinc-300
                  ${compact ? "text-[8px]" : "text-[9px]"}
                `}
              >
                {applications}{" "}
                {applications === 1 ? "Application" : "Applications"}
              </p>

              {!compact && (
                <p className="text-[7px] text-zinc-600">
                  {applications === 0
                    ? "Waiting for responses"
                    : "Responses received"}
                </p>
              )}
            </div>
          </div>

          <span
            className={`
              font-medium text-zinc-600
              ${compact ? "text-[7px]" : "text-[8px]"}
            `}
          >
            {progress}%
          </span>
        </div>

        {/* Application activity bar */}
        <div
          className={`
            overflow-hidden rounded-full bg-[#1a1a1d]
            ${compact ? "mt-1.5 h-0.5" : "mt-2 h-1"}
          `}
        >
          <div
            className="h-full rounded-full bg-linear-to-r from-[#FF3F3F] to-[#ff6b5f] transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Hover accent */}
      {!isOwner && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-linear-to-r from-transparent via-[#FF3F3F]/60 to-transparent opacity-0 transition-opacity group-hover:opacity-100" />
      )}
    </article>
  );
}

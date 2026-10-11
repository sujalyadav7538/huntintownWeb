import {
  ArrowUpRight,
  Briefcase,
  Clock3,
  IndianRupee,
  MapPin,
} from "lucide-react";
import { Post } from "@/src/shared/types";
import { useNavigate } from "react-router-dom";

interface ProfileRecentPostsProps {
  posts: Post[];
  total: number;
  isOwner?: boolean;
  compact?: boolean;
  defaultExpanded?: boolean;
  showAll?: boolean;
}

export default function ProfileRecentPosts({
  posts,
  total,
  isOwner = false,
  compact = false,
  defaultExpanded = false,
  showAll = false,
}: ProfileRecentPostsProps) {
  const navigate = useNavigate();

  /* ============================================================
     NAVIGATION
  ============================================================ */

  const getPostId = (post: Post) => {
    return post.id ?? post._id;
  };

  const handlePostSelect = (post: Post) => {
    const postId = getPostId(post);

    if (!postId) return;

    /*
     * OWNER
     * Explore own post/application responses
     *
     * /dashboard/response/:postId
     */
    if (isOwner) {
      const params = new URLSearchParams({ postId });
      navigate(`/dashboard?${params.toString()}`);
      return;
    }

    /*
     * OTHER USER
     *
     * /post/:postId
     */
    navigate(`/post/${encodeURIComponent(postId)}`);
  };

  /* ============================================================
     EMPTY / HIDDEN STATE
  ============================================================ */

  if (defaultExpanded && posts.length === 0) {
    return null;
  }

  /* ============================================================
     POSTS
  ============================================================ */

  const visiblePosts = showAll ? posts : posts.slice(0, compact ? 2 : 3);

  const sectionTitle = isOwner ? "My Posts" : "Recent Posts";

  const sectionDescription = isOwner
    ? "Manage your recent requirements"
    : "Latest requirements posted";

  /* ============================================================
     UI
  ============================================================ */

  return (
    <section
      className={`
        overflow-hidden
        border border-[#1e1e22]
        ${compact ? "rounded-xl" : "rounded-2xl"}
      `}
    >
      {/* ========================================================
          HEADER
      ======================================================== */}

      <div
        className={`
          flex items-center justify-between
          border-b border-[#1e1e22]
          ${compact ? "px-3 py-2.5" : "px-4 py-3.5 sm:px-5"}
        `}
      >
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <Briefcase
              className={`
                shrink-0 text-[#FF3F3F]
                ${compact ? "h-3 w-3" : "h-3.5 w-3.5"}
              `}
            />

            <h3
              className={`
                truncate font-bold text-white
                ${compact ? "text-[11px]" : "text-[12px] sm:text-[13px]"}
              `}
            >
              {sectionTitle}
            </h3>

            <span
              className={`
                shrink-0 rounded-full
                font-medium text-zinc-500
                ${
                  compact
                    ? "px-1.5 py-0.5 text-[8px]"
                    : "px-1.5 py-0.5 text-[9px]"
                }
              `}
            >
              {total}
            </span>
          </div>

          {!compact && (
            <p className="mt-0.5 text-[9px] text-zinc-600">
              {sectionDescription}
            </p>
          )}
        </div>

      </div>

      {/* ========================================================
          EMPTY STATE
      ======================================================== */}

      {visiblePosts.length === 0 ? (
        <div className="flex flex-col items-center justify-center px-5 py-10 text-center">
          <div
            className="
              flex h-12 w-12 items-center justify-center
              rounded-2xl
              border border-[#1e1e22]
            "
          >
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
          {/* ======================================================
              DESKTOP / TABLET
          ====================================================== */}

          <div
            className={`
              hidden sm:grid
              ${compact ? "sm:grid-cols-1" : "sm:grid-cols-2 lg:grid-cols-3"}
              ${compact ? "gap-2.5 p-3" : "gap-3 p-4"}
            `}
          >
            {visiblePosts.map((post) => (
              <ProfilePostCard
                key={getPostId(post)}
                post={post}
                isOwner={isOwner}
                compact={compact}
                onSelect={() => handlePostSelect(post)}
              />
            ))}
          </div>

          {/* ======================================================
              MOBILE
          ====================================================== */}

          <div
            className={`
              flex overflow-x-auto
              scrollbar-none
              sm:hidden
              [&::-webkit-scrollbar]:hidden
              ${compact ? "gap-2.5 p-3" : "gap-3 p-4"}
            `}
          >
            {visiblePosts.map((post) => (
              <div
                key={getPostId(post)}
                className={`
                  shrink-0
                  ${compact ? "w-[78vw] max-w-68" : "w-[82vw] max-w-75"}
                `}
              >
                <ProfilePostCard
                  post={post}
                  isOwner={isOwner}
                  compact={compact}
                  onSelect={() => handlePostSelect(post)}
                />
              </div>
            ))}
          </div>

          {/* ======================================================
              MOBILE SCROLL INDICATOR
          ====================================================== */}

          {visiblePosts.length > 1 && (
            <div className="flex justify-center gap-1 pb-3 sm:hidden">
              {visiblePosts.map((post, index) => (
                <span
                  key={getPostId(post)}
                  className={`
                    h-1 rounded-full transition-all
                    ${index === 0 ? "w-4 bg-[#FF3F3F]" : "w-1 bg-zinc-700"}
                  `}
                />
              ))}
            </div>
          )}
        </>
      )}

    </section>
  );
}

function ProfilePostCard({
  post,
  isOwner,
  compact,
  onSelect,
}: {
  post: Post;
  isOwner: boolean;
  compact: boolean;
  onSelect: () => void;
}) {
  const statusStyles: Record<Post["status"], string> = {
    live: "border-emerald-500/20 bg-emerald-500/10 text-emerald-400",
    in_progress: "border-sky-500/20 bg-sky-500/10 text-sky-400",
    completed: "border-blue-500/20 bg-blue-500/10 text-blue-400",
    expired: "border-zinc-500/20 bg-zinc-500/10 text-zinc-400",
    cancelled: "border-rose-500/20 bg-rose-500/10 text-rose-400",
  };

  const statusLabels: Record<Post["status"], string> = {
    live: "Open",
    in_progress: "In progress",
    completed: "Completed",
    expired: "Expired",
    cancelled: "Cancelled",
  };

  return (
    <article className="theme-card group flex h-full min-w-0 flex-col rounded-xl border p-3.5 transition-colors hover:border-[#FF3F3F]/30 sm:p-4">
      <div className="flex items-center justify-between gap-2">
        <span className="theme-chip max-w-[65%] truncate rounded-md border px-2 py-1 text-[9px] font-semibold">
          {post.category || "Local request"}
        </span>
        <span
          className={`shrink-0 rounded-md border px-2 py-1 text-[9px] font-medium ${
            statusStyles[post.status] ?? statusStyles.live
          }`}
        >
          {statusLabels[post.status] ?? "Open"}
        </span>
      </div>

      <h4 className="theme-text-primary mt-3 line-clamp-2 text-sm font-semibold leading-5">
        {post.title || "Untitled requirement"}
      </h4>

      {post.description && (
        <p className="theme-text-muted mt-1.5 line-clamp-2 text-[11px] leading-5">
          {post.description}
        </p>
      )}

      <div className="theme-text-muted mt-3 flex flex-wrap gap-x-3 gap-y-2 text-[10px]">
        {post.address && (
          <span className="inline-flex min-w-0 items-center gap-1">
            <MapPin className="h-3 w-3 shrink-0 text-[#FF3F3F]" />
            <span className="max-w-40 truncate">{post.address}</span>
          </span>
        )}
        {post.budget && (
          <span className="inline-flex items-center gap-1">
            <IndianRupee className="h-3 w-3 shrink-0 text-emerald-400" />
            {post.budget}
          </span>
        )}
        {post.timeline && (
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3 w-3 shrink-0 text-amber-400" />
            {post.timeline}
          </span>
        )}
      </div>

      <div className="theme-divider mt-auto flex items-center justify-between gap-2 border-t pt-3">
        <span className="theme-text-muted truncate text-[9px]">
          {post.createdAt
            ? new Date(post.createdAt).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })
            : ""}
        </span>
        <button
          type="button"
          onClick={onSelect}
          className="theme-btn-accent inline-flex shrink-0 items-center gap-1.5 rounded-lg px-2.5 py-1.5 text-[10px] font-semibold"
        >
          {isOwner ? (compact ? "Manage" : "Manage post") : "View post"}
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
    </article>
  );
}

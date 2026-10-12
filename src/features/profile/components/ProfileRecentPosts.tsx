import {
  ArrowUpRight,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  Clock3,
  IndianRupee,
  MapPin,
} from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { Post } from "@/src/shared/types";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

interface ProfileRecentPostsProps {
  posts: Post[];
  total: number;
  isOwner?: boolean;
  compact?: boolean;
  defaultExpanded?: boolean;
  showAll?: boolean;
  onLoadMore?: () => void;
  hasMore?: boolean;
  loadingMore?: boolean;
  loadMoreError?: string;
}

export default function ProfileRecentPosts({
  posts,
  total,
  isOwner = false,
  compact = false,
  defaultExpanded = false,
  showAll = false,
  onLoadMore,
  hasMore = false,
  loadingMore = false,
  loadMoreError = "",
}: ProfileRecentPostsProps) {
  const navigate = useNavigate();
  const swiperRef = useRef<SwiperInstance | null>(null);

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
        {visiblePosts.length > 1 && (
          <div className="flex shrink-0 items-center gap-1.5">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Previous posts"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:bg-white/5 hover:text-white"
              aria-label="Next posts"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
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
          <div className={compact ? "p-3" : "p-4"}>
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={compact ? 10 : 12}
              breakpoints={
                compact
                  ? {}
                  : {
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 4 },
                    }
              }
              watchOverflow
              onReachEnd={() => {
                if (
                  showAll &&
                  hasMore &&
                  !loadingMore &&
                  !loadMoreError
                ) {
                  onLoadMore?.();
                }
              }}
            >
              {visiblePosts.map((post) => (
                <SwiperSlide key={getPostId(post)} className="h-auto">
                  <ProfilePostCard
                    post={post}
                    isOwner={isOwner}
                    compact={compact}
                    onSelect={() => handlePostSelect(post)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>
          </div>

          {showAll && hasMore && (
            <div className="px-4 pb-3 text-center">
              {loadingMore && (
                <span className="text-xs text-zinc-500">Loading more posts...</span>
              )}
            </div>
          )}
          {showAll && loadMoreError && (
            <div className="px-4 py-3 text-center">
              <p role="status" className="text-xs text-rose-400">
                {loadMoreError}
              </p>
              <button
                type="button"
                onClick={onLoadMore}
                className="mt-2 text-xs font-semibold text-[#ff6b6b] hover:text-white"
              >
                Retry
              </button>
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
    <article className="theme-card group flex h-52 min-w-0 flex-col overflow-hidden rounded-xl border p-3.5 transition-colors hover:border-[#FF3F3F]/30 sm:p-4">
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

      <div className="theme-text-muted mt-3 flex max-h-10 min-h-8 flex-wrap content-start gap-x-3 gap-y-2 overflow-hidden text-[10px]">
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

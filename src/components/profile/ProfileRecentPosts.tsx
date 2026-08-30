import { ArrowUpRight, Briefcase, ChevronRight } from "lucide-react";
import { Post } from "../../types";
import PostGridCard from "../explore/PostGridCard";
import { useNavigate } from "react-router-dom";

interface ProfileRecentPostsProps {
  posts: Post[];
  total: number;
  onViewAll?: () => void;
  isOwner?: boolean;
  compact?: boolean;
  defaultExpanded?: boolean;

  /**
   * Required when viewing another user's profile.
   * Used for:
   * /explore/:userId
   */
  userId?: string;
}

export default function ProfileRecentPosts({
  posts,
  total,
  isOwner = false,
  compact = false,
  defaultExpanded = false,
  userId,
}: ProfileRecentPostsProps) {
  const navigate = useNavigate();

  /* ============================================================
     NAVIGATION
  ============================================================ */

  const getPostId = (post: Post) => {
    return post.id || (post as any)._id;
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
      navigate(`/dashboard/responses/${postId}`);
      return;
    }

    /*
     * OTHER USER
     *
     * /post/:postId
     */
    navigate(`/post/${postId}`);
  };

  const handleViewAll = () => {
    if (isOwner) {
      navigate("/dashboard/responses");
      return;
    } else {
      navigate(`/explore/${userId}`);
      return;
    }
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

  const visiblePosts = posts.slice(0, compact ? 2 : 3);

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
        bg-[#111113]
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
                bg-[#1e1e22]
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

        {/* ======================================================
            HEADER VIEW ALL
        ====================================================== */}

        {total > 0 && (
          <button
            type="button"
            onClick={handleViewAll}
            className={`
              group flex shrink-0 items-center gap-1
              font-semibold text-[#FF3F3F]
              transition hover:text-[#ff6262]
              ${compact ? "text-[9px]" : "text-[10px]"}
            `}
          >
            {compact ? "All" : "View All"}

            <ArrowUpRight
              className={`
                transition-transform
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
                ${compact ? "h-2.5 w-2.5" : "h-3 w-3"}
              `}
            />
          </button>
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
              bg-[#0e0e10]
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
              <PostGridCard
                key={getPostId(post)}
                post={post}
                onSelect={() => handlePostSelect(post)}
                meta={
                  isOwner ? (
                    <span className="text-[9px] font-medium text-zinc-500">
                      Manage
                    </span>
                  ) : undefined
                }
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
                <PostGridCard
                  post={post}
                  onSelect={() => handlePostSelect(post)}
                  meta={
                    isOwner ? (
                      <span className="text-[9px] font-medium text-zinc-500">
                        Manage
                      </span>
                    ) : undefined
                  }
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

      {/* ========================================================
          BOTTOM CTA
      ======================================================== */}

      {total > 3 && (
        <button
          type="button"
          onClick={handleViewAll}
          className={`
            group flex w-full
            items-center justify-center gap-1.5
            border-t border-[#1e1e22]
            font-semibold text-zinc-500
            transition
            hover:bg-white/[0.02]
            hover:text-[#FF3F3F]
            ${compact ? "py-2 text-[9px]" : "py-3 text-[10px]"}
          `}
        >
          View all {total} posts
          <ChevronRight
            className={`
              transition-transform
              group-hover:translate-x-0.5
              ${compact ? "h-2.5 w-2.5" : "h-3 w-3"}
            `}
          />
        </button>
      )}
    </section>
  );
}

import { useState, useEffect, useRef } from "react";
import { Star, Loader2, MessageSquare } from "lucide-react";
import { UserMetric } from "@/src/shared/types";
import UserAvatar from "@/src/shared/components/UserAvatar";
import { apiFetch } from "@/src/shared/lib/api";
import UserProfileLink from "@/src/shared/components/UserProfileLink";

interface Review {
  id: string;
  hunter: { id?: string; _id?: string; name: string; avatar: string; role?: string };
  rating: number;
  comment?: string;
  createdAt: string;
}

interface ProfileReviewsProps {
  userId: string;
  metric: UserMetric | null;
  metricLoading?: boolean;
  compact?: boolean; // shows only summary + 1 review
  defaultExpanded?: boolean; // defaultExpanded=true hides the component if there are no reviews and not loading
}

const PAGE_SIZE = 10;

export default function ProfileReviews({
  userId,
  metric,
  metricLoading,
  compact = false,
  defaultExpanded = false,
}: ProfileReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [loadMoreError, setLoadMoreError] = useState("");
  const [hasMore, setHasMore] = useState(false);
  const loadMoreRef = useRef<HTMLDivElement | null>(null);
  const loadingMoreRef = useRef(false);
  const loadMoreControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    loadMoreControllerRef.current?.abort();
    loadMoreControllerRef.current = null;
    loadingMoreRef.current = false;
    setLoadingMore(false);
    setLoadMoreError("");
    setReviews([]);
    setHasMore(false);

    const fetchReviews = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await apiFetch(
          `/api/rating/user/${encodeURIComponent(userId)}?skip=0&limit=${PAGE_SIZE}`,
          { signal: controller.signal },
        );
        if (!res.ok) throw new Error("Failed to load reviews");

        const data: {
          reviews?: Array<Omit<Review, "id"> & { _id?: string; id?: string }>;
          total?: number;
          hasMore?: boolean;
        } = await res.json();

        const nextReviews = (data.reviews ?? []).map((review) => ({
          ...review,
          id: String(review._id ?? review.id ?? review.createdAt),
        }));
        setReviews(nextReviews);
        setHasMore(data.hasMore ?? nextReviews.length < (data.total ?? 0));
      } catch {
        if (controller.signal.aborted) return;
        setReviews([]);
        setError("Could not load reviews. Please try again.");
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    };

    void fetchReviews();

    return () => {
      controller.abort();
      loadMoreControllerRef.current?.abort();
      loadMoreControllerRef.current = null;
      loadingMoreRef.current = false;
    };
  }, [userId]);

  const loadMoreReviews = async () => {
    if (loadingMoreRef.current || !hasMore) return;

    loadingMoreRef.current = true;
    setLoadingMore(true);
    setLoadMoreError("");
    const controller = new AbortController();
    loadMoreControllerRef.current = controller;
    try {
      const res = await apiFetch(
        `/api/rating/user/${encodeURIComponent(userId)}?skip=${reviews.length}&limit=${PAGE_SIZE}`,
        { signal: controller.signal },
      );
      const data: {
        reviews?: Array<Omit<Review, "id"> & { _id?: string; id?: string }>;
        total?: number;
        hasMore?: boolean;
      } = await res.json();
      if (!res.ok) throw new Error("Failed to load more reviews");
      if (controller.signal.aborted) return;

      const nextReviews = (data.reviews ?? []).map((review) => ({
        ...review,
        id: String(review._id ?? review.id ?? review.createdAt),
      }));
      setReviews((current) => [...current, ...nextReviews]);
      setHasMore(
        data.hasMore ?? reviews.length + nextReviews.length < (data.total ?? 0),
      );
    } catch {
      if (controller.signal.aborted) return;
      setLoadMoreError("Could not load more reviews.");
    } finally {
      if (loadMoreControllerRef.current === controller) {
        loadMoreControllerRef.current = null;
        loadingMoreRef.current = false;
        setLoadingMore(false);
      }
    }
  };

  useEffect(() => {
    const target = loadMoreRef.current;
    if (!target || compact || !hasMore || loadingMore || loadMoreError) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) void loadMoreReviews();
      },
      { rootMargin: "240px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [compact, hasMore, loadingMore, loadMoreError, reviews.length, userId]);

  const avgRating = metric?.reviewMetrics.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics.totalReviews ?? 0;
  const displayedReviews = compact ? reviews.slice(0, 1) : reviews;

  if (
    defaultExpanded &&
    !metricLoading &&
    totalReviews === 0 &&
    reviews.length === 0 &&
    !loading
  )
    return null;

  return (
    <div className="theme-card rounded-xl border p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-muted text-xs font-bold uppercase tracking-wider">
          Reviews{totalReviews > 0 ? ` (${totalReviews})` : ""}
        </h3>
      </div>

      {/* Rating summary */}
      {(metricLoading || totalReviews > 0) && (
        <div className="theme-divider mb-4 flex items-center gap-4 border-b pb-4">
          <div>
            <p className="theme-text-primary text-3xl font-black">
              {avgRating > 0 ? avgRating.toFixed(1) : "—"}
            </p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star
                  key={i}
                  className={`h-3 w-3 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700"}`}
                />
              ))}
            </div>
            <p className="theme-text-muted mt-1 text-[10px]">
              {totalReviews} review{totalReviews !== 1 ? "s" : ""}
            </p>
          </div>
          {/* Rating bars */}
          {!compact && (
            <div className="flex flex-1 flex-col gap-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct =
                  reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-1.5">
                    <span className="theme-text-muted w-3 text-right text-[9px]">
                      {star}
                    </span>
                    <div className="theme-chip-count h-1 flex-1 overflow-hidden rounded-full border">
                      <div
                        className="h-full rounded-full bg-amber-400"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <span className="theme-text-muted w-4 text-[9px]">
                      {count}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {loading ? (
        <div className="theme-text-muted flex items-center gap-2 py-2">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span className="text-xs">Loading reviews…</span>
        </div>
      ) : error ? (
        <p
          className="theme-text-muted py-4 text-center text-[11px]"
          role="status"
        >
          {error}
        </p>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-center">
          <MessageSquare className="theme-icon-muted h-6 w-6" />
          <p className="theme-text-muted mt-2 text-[11px]">No reviews yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedReviews.map((r) => (
              <div key={r.id} className="flex gap-3">
                <UserProfileLink
                  userId={r.hunter?.id ?? r.hunter?._id}
                  aria-label={`View ${r.hunter?.name ?? "reviewer"}'s profile`}
                  className="shrink-0 rounded-full focus-visible:outline-2 focus-visible:outline-[#FF3F3F]"
                >
                  <UserAvatar
                    name={r.hunter?.name}
                    src={r.hunter?.avatar}
                    className="h-8 w-8 rounded-full ring-2 ring-[#1e1e22]"
                    imageClassName="object-cover"
                  />
                </UserProfileLink>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <UserProfileLink
                      userId={r.hunter?.id ?? r.hunter?._id}
                      className="theme-text-secondary truncate text-[12px] font-semibold hover:text-[#FF3F3F]"
                    >
                      {r.hunter?.name}
                    </UserProfileLink>
                    <span className="theme-text-muted ml-auto text-[10px]">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`}
                      />
                    ))}
                  </div>
                  {r.comment && (
                    <p className="theme-text-muted text-[12px] leading-relaxed">
                      {r.comment}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
          {!compact && hasMore && (
            <div ref={loadMoreRef} className="mt-4 text-center">
              {loadingMore && (
                <span className="text-xs text-zinc-500">Loading more reviews...</span>
              )}
            </div>
          )}
          {!compact && loadMoreError && (
            <button
              type="button"
              onClick={() => void loadMoreReviews()}
              className="theme-card-subtle theme-text-muted mt-4 w-full rounded-xl border py-2 text-[12px] transition hover:text-(--app-text)"
            >
              Retry loading reviews
            </button>
          )}
        </>
      )}
    </div>
  );
}

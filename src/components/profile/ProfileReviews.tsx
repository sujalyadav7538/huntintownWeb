import { useState, useEffect } from 'react';
import { Star, Loader2, MessageSquare } from 'lucide-react';
import { UserMetric } from '../../types';
import { getAvatarUrl, handleAvatarError } from '../../utils';
import { apiFetch } from '../../lib/api';

interface Review {
  _id: string;
  hunter: { name: string; avatar: string; role?: string };
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

export default function ProfileReviews({ userId, metric, metricLoading, compact = false, defaultExpanded = false }: ProfileReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [shown, setShown] = useState(3);

  useEffect(() => {
    if (!userId) return;
    const fetchReviews = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(`/api/rating/user/${userId}`);
        if (!res.ok) throw new Error('Failed to load reviews');
        const data = await res.json();
        setReviews(data.reviews ?? []);
      } catch {
        // fail silently — reviews aren't critical
        setReviews([]);
      } finally {
        setLoading(false);
      }
    };
    fetchReviews();
  }, [userId]);

  const avgRating = metric?.reviewMetrics.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics.totalReviews ?? 0;
  const displayedReviews = compact ? reviews.slice(0, 1) : reviews.slice(0, shown);

  if (defaultExpanded && !metricLoading && totalReviews === 0 && reviews.length === 0 && !loading) return null;

  return (
    <div className="theme-card rounded-xl border p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between">
        <h3 className="theme-text-muted text-xs font-bold uppercase tracking-wider">
          Reviews{totalReviews > 0 ? ` (${totalReviews})` : ""}
        </h3>
        {!compact && totalReviews > 0 && (
          <button className="text-[10px] font-medium text-[#FF3F3F] hover:underline">View All</button>
        )}
      </div>

      {/* Rating summary */}
      {(metricLoading || totalReviews > 0) && (
        <div className="theme-divider mb-4 flex items-center gap-4 border-b pb-4">
          <div>
            <p className="theme-text-primary text-3xl font-black">{avgRating > 0 ? avgRating.toFixed(1) : "—"}</p>
            <div className="mt-1 flex items-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`h-3 w-3 ${i < Math.round(avgRating) ? "fill-amber-400 text-amber-400" : "fill-zinc-700 text-zinc-700"}`} />
              ))}
            </div>
            <p className="theme-text-muted mt-1 text-[10px]">{totalReviews} review{totalReviews !== 1 ? "s" : ""}</p>
          </div>
          {/* Rating bars */}
          {!compact && (
            <div className="flex flex-1 flex-col gap-1">
              {[5, 4, 3, 2, 1].map((star) => {
                const count = reviews.filter((r) => r.rating === star).length;
                const pct = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={star} className="flex items-center gap-1.5">
                    <span className="theme-text-muted w-3 text-right text-[9px]">{star}</span>
                    <div className="theme-chip-count h-1 flex-1 overflow-hidden rounded-full border">
                      <div className="h-full rounded-full bg-amber-400" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="theme-text-muted w-4 text-[9px]">{count}</span>
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
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center py-4 text-center">
          <MessageSquare className="theme-icon-muted h-6 w-6" />
          <p className="theme-text-muted mt-2 text-[11px]">No reviews yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedReviews.map((r) => (
              <div key={r._id} className="flex gap-3">
                <img
                  src={getAvatarUrl(r.hunter?.name, r.hunter?.avatar)}
                  alt={r.hunter?.name}
                  className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-[#1e1e22]"
                  onError={(e) => handleAvatarError(e, r.hunter?.name)}
                  referrerPolicy="no-referrer"
                  
                />
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-center gap-2">
                    <span className="theme-text-secondary text-[12px] font-semibold">{r.hunter?.name}</span>
                    <span className="theme-text-muted ml-auto text-[10px]">
                      {new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  </div>
                  <div className="mb-1 flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className={`h-3 w-3 ${i < r.rating ? "fill-amber-400 text-amber-400" : "text-zinc-700"}`} />
                    ))}
                  </div>
                  {r.comment && <p className="theme-text-muted text-[12px] leading-relaxed">{r.comment}</p>}
                </div>
              </div>
            ))}
          </div>
          {!compact && reviews.length > shown && (
            <button
              onClick={() => setShown((s) => s + 3)}
              className="theme-card-subtle theme-text-muted mt-4 w-full rounded-xl border py-2 text-[12px] transition hover:text-[var(--app-text)]"
            >
              Show more reviews
            </button>
          )}
        </>
      )}
    </div>
  );
}

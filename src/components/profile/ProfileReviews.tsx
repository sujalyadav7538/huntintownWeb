import { useState, useEffect } from 'react';
import { Star, ThumbsUp, Loader2, AlertCircle, MessageSquare } from 'lucide-react';
import ProfileSectionCard from './ProfileSectionCard';
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
}

export default function ProfileReviews({ userId, metric, metricLoading }: ProfileReviewsProps) {
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

  if (!metricLoading && totalReviews === 0 && reviews.length === 0 && !loading) return null;

  return (
    <ProfileSectionCard title="Reviews" icon={Star} iconColor="text-amber-400" accentColor="#f59e0b">
      {/* Summary bar */}
      {(metricLoading || totalReviews > 0) && (
        <div className="flex items-center gap-4 mb-4 pb-4 border-b border-[#1a1a1e]">
          <div className="flex items-end gap-2">
            <span className="text-4xl font-black text-white">{avgRating > 0 ? avgRating.toFixed(1) : '—'}</span>
            <span className="text-zinc-500 text-sm mb-1">/ 5.0</span>
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'text-amber-400 fill-amber-400' : 'text-zinc-700 fill-zinc-700'}`} />
              ))}
            </div>
            <p className="text-xs text-zinc-500">{totalReviews} review{totalReviews !== 1 ? 's' : ''}</p>
          </div>
        </div>
      )}

      {loading ? (
        <div className="flex items-center gap-2 py-4 text-zinc-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-sm">Loading reviews…</span>
        </div>
      ) : reviews.length === 0 ? (
        <div className="flex flex-col items-center py-6 gap-2 text-center">
          <MessageSquare className="w-8 h-8 text-zinc-700" />
          <p className="text-sm text-zinc-500">No reviews yet</p>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {reviews.slice(0, shown).map((r) => (
              <div key={r._id} className="flex gap-3">
                <img
                  src={getAvatarUrl(r.hunter?.name, r.hunter?.avatar)}
                  alt={r.hunter?.name}
                  className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0"
                  onError={(e) => handleAvatarError(e, r.hunter?.name)}
                  referrerPolicy="no-referrer"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-semibold text-zinc-200">{r.hunter?.name}</span>
                    {r.hunter?.role && <span className="text-[10px] text-zinc-600">{r.hunter.role}</span>}
                    <div className="flex items-center gap-0.5 ml-auto">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`w-3 h-3 ${i < r.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-700'}`} />
                      ))}
                    </div>
                  </div>
                  {r.comment && <p className="text-[12px] text-zinc-400 leading-relaxed">{r.comment}</p>}
                  <p className="text-[10px] text-zinc-700 mt-1">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
            ))}
          </div>
          {reviews.length > shown && (
            <button
              onClick={() => setShown((s) => s + 3)}
              className="mt-4 w-full text-[12px] text-zinc-500 hover:text-zinc-300 transition border border-[#1e1e22] rounded-xl py-2 cursor-pointer"
            >
              Show more reviews
            </button>
          )}
        </>
      )}
    </ProfileSectionCard>
  );
}

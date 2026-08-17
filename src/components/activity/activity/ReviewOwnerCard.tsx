import {
  CheckCircle2,
  Loader2,
  Star,
} from "lucide-react";

interface ReviewOwnerCardProps {
  ownerName?: string;
  reviewDone: boolean | null;
  rating: number;
  hoveredRating: number;
  comment: string;
  submitting: boolean;
  error: string;
  onRatingChange: (rating: number) => void;
  onHoverRating: (rating: number) => void;
  onCommentChange: (comment: string) => void;
  onSubmit: () => void;
}

export default function ReviewOwnerCard({
  ownerName,
  reviewDone,
  rating,
  hoveredRating,
  comment,
  submitting,
  error,
  onRatingChange,
  onHoverRating,
  onCommentChange,
  onSubmit,
}: ReviewOwnerCardProps) {
  return (
    <section className="rounded-2xl border border-amber-900/30 bg-[#0c0c0e] p-5">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-amber-500/10">
          <Star className="h-4 w-4 text-amber-400" />
        </div>

        <div className="min-w-0">
          <p className="text-[13px] font-bold text-zinc-100">
            Review {ownerName?.split(" ")[0]}
          </p>

          <p className="text-[10px] text-zinc-600">
            Your experience with the post owner
          </p>
        </div>

        <span className="ml-auto shrink-0 rounded-full border border-emerald-800/50 bg-emerald-950/50 px-2 py-0.5 text-[9px] font-bold uppercase text-emerald-400">
          Completed
        </span>
      </div>

      <div className="mt-4">
        {reviewDone === null ? (
          <div className="flex items-center gap-2 py-3 text-xs text-zinc-600">
            <Loader2 className="h-4 w-4 animate-spin" />
            Checking review status...
          </div>
        ) : reviewDone ? (
          <div className="flex items-center gap-2 rounded-xl border border-emerald-900/30 bg-emerald-950/20 px-3 py-3 text-xs font-semibold text-emerald-400">
            <CheckCircle2 className="h-4 w-4" />
            You already reviewed this post owner
          </div>
        ) : (
          <div className="space-y-4">
            {/* Rating */}
            <div>
              <p className="mb-2 text-[10px] font-medium uppercase tracking-wider text-zinc-600">
                Your rating
              </p>

              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => {
                  const active =
                    star <= (hoveredRating || rating);

                  return (
                    <button
                      key={star}
                      type="button"
                      onClick={() => onRatingChange(star)}
                      onMouseEnter={() => onHoverRating(star)}
                      onMouseLeave={() => onHoverRating(0)}
                      className="cursor-pointer rounded-lg p-1 transition hover:bg-amber-500/10"
                    >
                      <Star
                        className={`h-6 w-6 transition-colors ${
                          active
                            ? "fill-amber-400 text-amber-400"
                            : "text-zinc-700"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Comment */}
            <textarea
              rows={3}
              value={comment}
              onChange={(e) =>
                onCommentChange(e.target.value)
              }
              placeholder="Share your experience..."
              className="w-full resize-none rounded-xl border border-zinc-800 bg-[#131316] px-3 py-2.5 text-xs text-zinc-200 outline-none placeholder:text-zinc-700 focus:border-amber-500/40"
            />

            {error && (
              <p className="rounded-lg border border-red-900/30 bg-red-950/20 px-3 py-2 text-[11px] text-red-400">
                {error}
              </p>
            )}

            <button
              onClick={onSubmit}
              disabled={submitting}
              className="flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl border border-amber-500/30 bg-amber-500/10 py-2.5 text-xs font-bold text-amber-400 transition hover:bg-amber-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Star className="h-4 w-4" />
              )}
              {submitting ? "Submitting..." : "Submit Review"}
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
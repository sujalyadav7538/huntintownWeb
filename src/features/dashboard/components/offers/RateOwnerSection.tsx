import { useEffect, useState } from "react";
import { CheckCircle2, LoaderCircle } from "lucide-react";
import { apiFetch, apiFetchJSON } from "@/src/shared/lib/api";
import StarRatingInput from "../StarRatingInput";

interface ReviewStatus {
  hasReviewedOwner: boolean;
  ownerHasReviewedYou: boolean;
}

export default function RateOwnerSection({
  postId,
  ownerName,
}: {
  postId: string;
  ownerName: string;
}) {
  const [status, setStatus] = useState<ReviewStatus | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    apiFetchJSON<ReviewStatus>(`/api/rating/review-status/${postId}`)
      .then((data) => {
        if (active) setStatus(data);
      })
      .catch(() => {
        if (active) setStatus({ hasReviewedOwner: false, ownerHasReviewedYou: false });
      });
    return () => {
      active = false;
    };
  }, [postId]);

  const submit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setError("");
    try {
      const res = await apiFetch("/api/rating/review-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, rating, comment: comment.trim() }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "Could not submit rating.");
      setStatus((prev) => ({
        ownerHasReviewedYou: prev?.ownerHasReviewedYou ?? false,
        hasReviewedOwner: true,
      }));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Could not submit rating.");
    } finally {
      setSubmitting(false);
    }
  };

  if (!status) {
    return (
      <div className="theme-text-muted flex items-center gap-2 text-xs">
        <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> Checking rating status
      </div>
    );
  }

  return (
    <section className="theme-divider space-y-3 border-t pt-4">
      <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
        Rate the owner
      </h3>

      {status.ownerHasReviewedYou && (
        <p className="text-xs font-medium text-emerald-500">
          {ownerName} has rated you for this requirement.
        </p>
      )}

      {status.hasReviewedOwner ? (
        <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
          <CheckCircle2 className="h-3.5 w-3.5" /> You've rated {ownerName}. Thanks!
        </p>
      ) : (
        <>
          <StarRatingInput value={rating} onChange={setRating} disabled={submitting} />
          <textarea
            rows={2}
            maxLength={500}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            placeholder={`How was working with ${ownerName}? (optional)`}
            aria-label="Comment for the owner"
            className="theme-input w-full resize-none rounded-md border px-3 py-2 text-sm outline-none"
          />
          {error && (
            <p role="alert" className="text-xs text-red-400">
              {error}
            </p>
          )}
          <button
            type="button"
            onClick={() => void submit()}
            disabled={submitting || rating === 0}
            className="inline-flex items-center gap-2 rounded-md bg-[#FF3F3F] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#e53535] disabled:opacity-50"
          >
            {submitting && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
            Submit rating
          </button>
        </>
      )}
    </section>
  );
}

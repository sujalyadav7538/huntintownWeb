import { useState } from "react";
import { X, Star, Loader2, CheckCircle2 } from "lucide-react";
import { apiFetch } from "../lib/api";
import { getAvatarUrl, handleAvatarError } from "../utils";

interface Helper {
  helperId: string; // MongoDB ObjectId hex string
  name: string;
  avatar: string;
}

interface ReviewHelpersModalProps {
  postId: string;
  postTitle: string;
  hunterId: string; // currentUser._id — passed as 'hunter' to rateUser
  helpers: Helper[];
  onClose: () => void;
}

function StarPicker({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(star)}
          onMouseEnter={() => setHovered(star)}
          onMouseLeave={() => setHovered(0)}
          className="cursor-pointer focus:outline-none"
        >
          <Star
            className={`w-6 h-6 transition-colors ${
              star <= (hovered || value)
                ? "text-amber-400 fill-amber-400"
                : "text-zinc-700 hover:text-amber-600"
            }`}
          />
        </button>
      ))}
    </div>
  );
}

export default function ReviewHelpersModal({
  postId,
  postTitle,
  hunterId,
  helpers,
  onClose,
}: ReviewHelpersModalProps) {
  const [ratings, setRatings] = useState<Record<string, number>>({});
  const [comments, setComments] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<Set<string>>(new Set());
  const [errors, setErrors] = useState<Record<string, string>>({});

  const token = localStorage.getItem("access_token");

  const handleSubmit = async (helper: Helper) => {
    const rating = ratings[helper.helperId];
    if (!rating) {
      setErrors((prev) => ({
        ...prev,
        [helper.helperId]: "Please select a star rating",
      }));
      return;
    }

    setSubmitting(helper.helperId);
    setErrors((prev) => ({ ...prev, [helper.helperId]: "" }));

    try {
      const res = await apiFetch("/api/rating", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          postId,
          hunter: hunterId,
          helper: helper.helperId,
          rating,
          comment: comments[helper.helperId]?.trim() || "",
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Failed to submit review");
      }

      setSubmitted((prev) => new Set(prev).add(helper.helperId));
    } catch (err) {
      setErrors((prev) => ({
        ...prev,
        [helper.helperId]:
          err instanceof Error ? err.message : "Failed to submit",
      }));
    } finally {
      setSubmitting(null);
    }
  };

  const allReviewed =
    helpers.length > 0 && helpers.every((h) => submitted.has(h.helperId));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0c0c0e] border border-[#1e1e22] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-lg max-h-[90vh] flex flex-col overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#161619] shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <h2 className="text-[13px] font-bold text-zinc-100">
                Review Your Helpers
              </h2>
            </div>
            <p className="text-[11px] text-zinc-500 mt-0.5 pl-6 truncate max-w-xs">
              {postTitle}
            </p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain divide-y divide-[#161619]">
          {helpers.length === 0 ? (
            <div className="py-14 text-center text-zinc-500 text-[13px]">
              No accepted helpers to review.
            </div>
          ) : (
            helpers.map((helper) => {
              const isDone = submitted.has(helper.helperId);
              const isSubmitting = submitting === helper.helperId;
              const rating = ratings[helper.helperId] ?? 0;

              return (
                <div key={helper.helperId} className="p-5 space-y-4">
                  {/* Helper info */}
                  <div className="flex items-center gap-3">
                    <img
                      src={getAvatarUrl(helper.name, helper.avatar)}
                      alt={helper.name}
                      className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0"
                      onError={(e) => handleAvatarError(e, helper.name)}
                      referrerPolicy="no-referrer"
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-zinc-100">
                        {helper.name}
                      </p>
                      {isDone && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-emerald-400 font-semibold">
                          <CheckCircle2 className="w-3 h-3" />
                          Review submitted
                        </span>
                      )}
                    </div>
                  </div>

                  {isDone ? (
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star
                          key={s}
                          className={`w-5 h-5 ${s <= (ratings[helper.helperId] ?? 0) ? "text-amber-400 fill-amber-400" : "text-zinc-800"}`}
                        />
                      ))}
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <p className="text-[11px] text-zinc-500">Rating</p>
                        <StarPicker
                          value={rating}
                          onChange={(v) =>
                            setRatings((prev) => ({
                              ...prev,
                              [helper.helperId]: v,
                            }))
                          }
                        />
                      </div>

                      <div className="space-y-1">
                        <p className="text-[11px] text-zinc-500">
                          Comment{" "}
                          <span className="text-zinc-700">(optional)</span>
                        </p>
                        <textarea
                          rows={2}
                          placeholder="Share your experience…"
                          value={comments[helper.helperId] ?? ""}
                          onChange={(e) =>
                            setComments((prev) => ({
                              ...prev,
                              [helper.helperId]: e.target.value,
                            }))
                          }
                          className="w-full bg-[#141416] border border-[#1e1e22] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 resize-none"
                        />
                      </div>

                      {errors[helper.helperId] && (
                        <p className="text-[11px] text-red-400">
                          {errors[helper.helperId]}
                        </p>
                      )}

                      <button
                        type="button"
                        onClick={() => handleSubmit(helper)}
                        disabled={isSubmitting}
                        className="flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[12px] font-bold transition disabled:opacity-50 cursor-pointer"
                      >
                        {isSubmitting ? (
                          <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        ) : (
                          <Star className="w-3.5 h-3.5" />
                        )}
                        Submit Review
                      </button>
                    </>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-4 border-t border-[#161619] shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="w-full py-2.5 rounded-xl bg-[#161619] hover:bg-[#1e1e22] border border-[#222226] text-zinc-400 text-[12px] font-medium transition cursor-pointer"
          >
            {allReviewed ? "All reviewed — Done" : "Skip & Close"}
          </button>
        </div>
      </div>
    </div>
  );
}

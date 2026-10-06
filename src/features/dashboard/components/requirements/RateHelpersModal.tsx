import { useEffect, useMemo, useRef, useState } from "react";
import { CheckCircle2, ChevronDown, LoaderCircle, Search, Star } from "lucide-react";
import { apiFetch, apiFetchJSON } from "@/src/shared/lib/api";
import DashboardModal from "../DashboardModal";
import StarRatingInput from "../StarRatingInput";
import { Avatar } from "./RequirementUI";

interface RateableHelper {
  _id: string;
  name: string;
  avatar?: string;
  role?: string;
  rated: boolean;
  rating: number | null;
  comment?: string;
}

interface RateHelpersModalProps {
  postId: string;
  postTitle: string;
  onClose: () => void;
}

export default function RateHelpersModal({
  postId,
  postTitle,
  onClose,
}: RateHelpersModalProps) {
  const [helpers, setHelpers] = useState<RateableHelper[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [query, setQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const [success, setSuccess] = useState("");
  const comboRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    apiFetchJSON<{ helpers: RateableHelper[] }>(
      `/api/rating/post/${postId}/helpers`,
    )
      .then((data) => {
        if (!active) return;
        const list = data.helpers ?? [];
        // Nothing to rate: the prompt is optional, so just dismiss it.
        if (list.length === 0) {
          onClose();
          return;
        }
        setHelpers(list);
        const firstUnrated = list.find((helper) => !helper.rated);
        if (list.length === 1 || firstUnrated) {
          setSelectedId((firstUnrated ?? list[0])._id);
        }
      })
      .catch((error) => {
        if (active)
          setLoadError(
            error instanceof Error ? error.message : "Could not load helpers.",
          );
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [postId, onClose]);

  useEffect(() => {
    if (!dropdownOpen) return;
    const close = (event: PointerEvent) => {
      if (!comboRef.current?.contains(event.target as Node))
        setDropdownOpen(false);
    };
    document.addEventListener("pointerdown", close);
    return () => document.removeEventListener("pointerdown", close);
  }, [dropdownOpen]);

  const filteredHelpers = useMemo(() => {
    const term = query.trim().toLowerCase();
    return term
      ? helpers.filter((helper) => helper.name.toLowerCase().includes(term))
      : helpers;
  }, [helpers, query]);

  const selected = helpers.find((helper) => helper._id === selectedId) ?? null;
  const ratedCount = helpers.filter((helper) => helper.rated).length;
  const allRated = helpers.length > 0 && ratedCount === helpers.length;

  const selectHelper = (helper: RateableHelper) => {
    setSelectedId(helper._id);
    setQuery("");
    setDropdownOpen(false);
    setRating(0);
    setComment("");
    setSubmitError("");
    setSuccess("");
  };

  const submit = async () => {
    if (!selected || rating === 0) {
      setSubmitError("Pick a star rating first.");
      return;
    }
    setSubmitting(true);
    setSubmitError("");
    try {
      const res = await apiFetch("/api/rating", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          postId,
          helper: selected._id,
          rating,
          comment: comment.trim(),
        }),
      });
      const body = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(body?.message || "Could not submit rating.");

      setHelpers((prev) =>
        prev.map((helper) =>
          helper._id === selected._id
            ? { ...helper, rated: true, rating, comment: comment.trim() }
            : helper,
        ),
      );
      setSuccess(`${selected.name} has been rated and notified.`);
      setRating(0);
      setComment("");
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Could not submit rating.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <DashboardModal
      title="Rate your helpers"
      subtitle={postTitle}
      onClose={onClose}
      mobileDrawer
      contentClassName="flex flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <p className="theme-text-muted text-xs leading-5">
            Your requirement is marked as completed. Rating the people who helped
            is optional, but it builds trust in the community.
          </p>

          {loading ? (
            <div className="theme-text-muted flex items-center justify-center gap-2 py-10 text-xs">
              <LoaderCircle className="h-4 w-4 animate-spin" /> Loading helpers
            </div>
          ) : loadError ? (
            <p role="alert" className="text-xs text-red-400">
              {loadError}
            </p>
          ) : (
            <>
              <div ref={comboRef} className="relative">
                <label
                  htmlFor="rate-helper-search"
                  className="theme-text-muted mb-1.5 block text-[10px] font-bold uppercase tracking-wider"
                >
                  Helper ({ratedCount}/{helpers.length} rated)
                </label>

                <button
                  type="button"
                  onClick={() => setDropdownOpen((open) => !open)}
                  aria-haspopup="listbox"
                  aria-expanded={dropdownOpen}
                  className="theme-panel-soft flex w-full items-center gap-3 rounded-md border px-3 py-2.5 text-left"
                >
                  {selected ? (
                    <>
                      <Avatar name={selected.name} src={selected.avatar} />
                      <span className="theme-text-primary min-w-0 flex-1 truncate text-sm font-semibold">
                        {selected.name}
                      </span>
                      {selected.rated && (
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                      )}
                    </>
                  ) : (
                    <span className="theme-text-muted flex-1 text-sm">
                      Select a helper
                    </span>
                  )}
                  <ChevronDown className="theme-icon-muted h-4 w-4 shrink-0" />
                </button>

                {dropdownOpen && (
                  <div className="theme-panel absolute inset-x-0 top-full z-20 mt-1 overflow-hidden rounded-md border shadow-lg">
                    <div className="theme-divider relative border-b p-2">
                      <Search className="theme-icon-muted pointer-events-none absolute left-4 top-1/2 h-3.5 w-3.5 -translate-y-1/2" />
                      <input
                        id="rate-helper-search"
                        autoFocus
                        value={query}
                        onChange={(event) => setQuery(event.target.value)}
                        placeholder="Search helpers by name"
                        className="theme-input w-full rounded-md border py-1.5 pl-8 pr-2 text-xs outline-none"
                      />
                    </div>
                    <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
                      {filteredHelpers.length === 0 ? (
                        <li className="theme-text-muted px-3 py-3 text-center text-xs">
                          No helper matches "{query}"
                        </li>
                      ) : (
                        filteredHelpers.map((helper) => (
                          <li key={helper._id} role="option" aria-selected={helper._id === selectedId}>
                            <button
                              type="button"
                              onClick={() => selectHelper(helper)}
                              className={`theme-hover-soft flex w-full items-center gap-3 px-3 py-2 text-left ${helper._id === selectedId ? "bg-[#FF3F3F]/8" : ""}`}
                            >
                              <Avatar name={helper.name} src={helper.avatar} />
                              <span className="min-w-0 flex-1">
                                <span className="theme-text-primary block truncate text-sm font-medium">
                                  {helper.name}
                                </span>
                                {helper.role && (
                                  <span className="theme-text-muted block truncate text-[11px]">
                                    {helper.role}
                                  </span>
                                )}
                              </span>
                              {helper.rated ? (
                                <span className="inline-flex shrink-0 items-center gap-1 text-[10px] font-semibold text-emerald-500">
                                  <Star className="h-3 w-3 fill-current" />
                                  {helper.rating}
                                </span>
                              ) : (
                                <span className="theme-text-muted shrink-0 text-[10px]">
                                  Not rated
                                </span>
                              )}
                            </button>
                          </li>
                        ))
                      )}
                    </ul>
                  </div>
                )}
              </div>

              {selected &&
                (selected.rated ? (
                  <div className="rounded-md border border-emerald-500/30 bg-emerald-500/10 p-3">
                    <p className="flex items-center gap-1.5 text-xs font-semibold text-emerald-500">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      You rated {selected.name} {selected.rating}/5
                    </p>
                    {selected.comment && (
                      <p className="theme-text-secondary mt-1.5 text-xs">
                        "{selected.comment}"
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div>
                      <p className="theme-text-muted mb-1.5 text-[10px] font-bold uppercase tracking-wider">
                        Rating
                      </p>
                      <StarRatingInput
                        value={rating}
                        onChange={setRating}
                        disabled={submitting}
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="rate-helper-comment"
                        className="theme-text-muted mb-1.5 block text-[10px] font-bold uppercase tracking-wider"
                      >
                        Comment (optional)
                      </label>
                      <textarea
                        id="rate-helper-comment"
                        rows={3}
                        maxLength={500}
                        value={comment}
                        onChange={(event) => setComment(event.target.value)}
                        placeholder={`How was working with ${selected.name}?`}
                        className="theme-input w-full resize-none rounded-md border px-3 py-2 text-sm outline-none"
                      />
                    </div>
                  </div>
                ))}

              {success && (
                <p className="text-xs font-medium text-emerald-500">{success}</p>
              )}
              {submitError && (
                <p role="alert" className="text-xs text-red-400">
                  {submitError}
                </p>
              )}
            </>
          )}
        </div>

        <footer className="theme-divider flex shrink-0 items-center justify-end gap-2 border-t px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="theme-text-muted theme-hover-soft rounded-md px-3 py-2 text-xs font-semibold"
          >
            {allRated || ratedCount > 0 ? "Done" : "Skip for now"}
          </button>
          {selected && !selected.rated && (
            <button
              type="button"
              onClick={() => void submit()}
              disabled={submitting || rating === 0}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF3F3F] px-3 py-2 text-xs font-bold text-white transition hover:bg-[#e53535] disabled:opacity-50"
            >
              {submitting && <LoaderCircle className="h-3.5 w-3.5 animate-spin" />}
              Submit rating
            </button>
          )}
        </footer>
      </div>
    </DashboardModal>
  );
}

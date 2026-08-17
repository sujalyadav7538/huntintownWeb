import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  XCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import ActivityPostSummary from "./ActivityPostSummary";
import { ActivityResponse } from "@/src/types";
import MyOfferCard from "./MyOfferCard";
import ReviewOwnerCard from "./ReviewOwnerCard";
import AcceptedChatButton from "./AcceptedChatButton";
import { apiFetch } from "@/src/lib/api";

const RESPONSE_STATUS_CFG = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    banner: "border-emerald-800/40 bg-emerald-950/30 text-emerald-300",
    iconBg: "rounded-xl p-2 bg-emerald-900/40 text-emerald-400",
    pill: "bg-emerald-950/60 text-emerald-400 border border-emerald-800/50",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    banner: "border-red-900/40 bg-red-950/30 text-red-300",
    iconBg: "rounded-xl p-2 bg-red-900/40 text-red-400",
    pill: "bg-red-950/60 text-red-400 border border-red-800/50",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    banner: "border-zinc-800/60 bg-zinc-900/30 text-zinc-300",
    iconBg: "rounded-xl p-2 bg-zinc-800/60 text-zinc-400",
    pill: "bg-zinc-900 text-zinc-400 border border-zinc-700",
  },
} as const;

export default function ActivityOfferDetail({
  offer,
  onBack,
  onInitiateChat,
}: {
  offer: ActivityResponse;
  onBack: () => void;
  onInitiateChat: () => void;
}) {
  const post = offer.postId;

  const [qaExpanded, setQaExpanded] = useState(false);
  const [reviewDone, setReviewDone] = useState<boolean | null>(null);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");

  const isCompletedAndAccepted =
    offer.status === "accepted" && post?.status === "completed";

  useEffect(() => {
    if (!isCompletedAndAccepted || !post?._id) return;
    apiFetch(`/api/rating/review-status/${post._id}`)
      .then((res) => res.json())
      .then((data) => setReviewDone(data.hasReviewedOwner ?? false))
      .catch(() => setReviewDone(false));
  }, [isCompletedAndAccepted, post?._id]);

  const handleReviewSubmit = async () => {
    if (rating === 0) return;
    setSubmitting(true);
    setReviewError("");
    try {
      const res = await apiFetch("/api/rating/review-owner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId: post._id, rating, comment }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error((data as any).message || "Failed to submit review");
      }
      setReviewDone(true);
    } catch (e: any) {
      setReviewError(e.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-8">
      {/* Back */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[12px] font-medium text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Activity
      </button>

      {/* Status banner */}
      <OfferStatusBanner status={offer.status} />

      {/* Main layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* ═══════════════════════════════════════
          LEFT — Post information
      ═══════════════════════════════════════ */}
        <div className="w-full lg:w-[400px] lg:shrink-0 space-y-4">
          <ActivityPostSummary offer={offer} />

          {/* Post information */}
          <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] p-5">
            <p className="mb-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
              Requirement Details
            </p>

            <div className="grid grid-cols-2 gap-3">
              {post?.budget && (
                <DetailItem label="Budget" value={`₹${post.budget}`} />
              )}

              {post?.timeline && (
                <DetailItem label="Timeline" value={post.timeline} />
              )}

              {post?.address && (
                <DetailItem label="Location" value={post.address} full />
              )}

              {post?.expiresAt && (
                <DetailItem
                  label="Expiry"
                  value={new Date(post.expiresAt).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                />
              )}
            </div>
          </div>

          {/* Questions */}
          {post?.questions?.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] p-5">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-4 w-4 text-[#FF3F3F]" />

                <p className="text-[12px] font-bold text-zinc-200">
                  Screening Questions
                </p>
              </div>

              <div className="space-y-3">
                {post.questions.map((question, index) => (
                  <div key={index} className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-[#FF3F3F]/20 bg-[#FF3F3F]/10 text-[9px] font-bold text-[#FF3F3F]">
                      {index + 1}
                    </span>

                    <p className="text-[11px] leading-relaxed text-zinc-400">
                      {question}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════
          RIGHT — My offer
      ═══════════════════════════════════════ */}
        <div className="w-full min-w-0 space-y-4">
          {/* Offer header */}
          <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] overflow-hidden">
            <div className="flex items-center justify-between border-b border-zinc-800/60 px-5 py-3.5">
              <div>
                <p className="text-[13px] font-bold text-zinc-100">
                  My Response
                </p>

                <p className="mt-0.5 text-[10px] text-zinc-600">
                  Your offer for this requirement
                </p>
              </div>

              <OfferStatusBadge status={offer.status} />
            </div>

            <div className="p-5">
              <MyOfferCard
                offer={offer}
                expanded={qaExpanded}
                onToggle={() => setQaExpanded((v) => !v)}
              />
            </div>
          </div>

          {/* Accepted + active */}
          {offer.status === "accepted" && !isCompletedAndAccepted && (
            <AcceptedChatButton
              authorName={post?.author?.name}
              onInitiateChat={onInitiateChat}
            />
          )}

          {/* Completed → Review */}
          {isCompletedAndAccepted && (
            <ReviewOwnerCard
              ownerName={post?.author?.name}
              reviewDone={reviewDone}
              rating={rating}
              hoveredRating={hoveredRating}
              comment={comment}
              submitting={submitting}
              error={reviewError}
              onRatingChange={setRating}
              onHoverRating={setHoveredRating}
              onCommentChange={setComment}
              onSubmit={handleReviewSubmit}
            />
          )}

          {/* Rejected */}
          {offer.status === "rejected" && (
            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] px-5 py-4">
              <p className="text-xs font-semibold text-zinc-400">
                This offer was not selected
              </p>

              <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
                The post owner selected another response for this requirement.
              </p>
            </div>
          )}

          {/* Pending */}
          {offer.status === "pending" && (
            <div className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] px-5 py-4">
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-zinc-600" />

                <div>
                  <p className="text-xs font-semibold text-zinc-400">
                    Waiting for response
                  </p>

                  <p className="mt-0.5 text-[10px] text-zinc-600">
                    The post owner is reviewing your offer.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function OfferStatusBanner({ status }: { status: ActivityResponse["status"] }) {
  const cfg = RESPONSE_STATUS_CFG[status] ?? RESPONSE_STATUS_CFG.pending;

  const Icon = cfg.icon;

  const content = {
    accepted: {
      title: "Offer Accepted",
      description:
        "The post author selected your offer. You can now start working together.",
    },

    rejected: {
      title: "Offer Not Selected",
      description: "Your offer was not selected for this requirement.",
    },

    pending: {
      title: "Offer Under Review",
      description: "Your offer is currently being reviewed by the post author.",
    },

    completed: {
      title: "Offer Completed",
      description: "This requirement has been completed successfully.",
    },
  };

  const text = content[status as keyof typeof content] ?? content.pending;

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-4 ${cfg.banner}`}
    >
      <div className="flex items-start gap-3">
        <div className={`rounded-xl p-2 ${cfg.iconBg}`}>
          <Icon className="h-5 w-5" />
        </div>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-bold">{text.title}</h2>

            <span
              className={`rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${cfg.pill}`}
            >
              {cfg.label}
            </span>
          </div>

          <p className="mt-1 text-[11px] opacity-70">{text.description}</p>
        </div>
      </div>
    </div>
  );
}

function DetailItem({
  label,
  value,
  full = false,
}: {
  label: string;
  value: string;
  full?: boolean;
}) {
  return (
    <div
      className={`rounded-xl border border-zinc-800/60 bg-[#111114] px-3 py-2.5 ${
        full ? "col-span-2" : ""
      }`}
    >
      <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-700">
        {label}
      </p>

      <p className="mt-1 truncate text-[11px] text-zinc-300">{value}</p>
    </div>
  );
}

function OfferStatusBadge({
  status,
}: {
  status: "pending" | "accepted" | "rejected";
}) {
  const config = {
    pending: {
      label: "Pending",
      className: "bg-zinc-900 text-zinc-400 border-zinc-800",
    },
    accepted: {
      label: "Accepted",
      className: "bg-emerald-950/50 text-emerald-400 border-emerald-800/40",
    },
    rejected: {
      label: "Rejected",
      className: "bg-red-950/40 text-red-400 border-red-800/40",
    },
  };

  const cfg = config[status];

  return (
    <span
      className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide ${cfg.className}`}
    >
      {cfg.label}
    </span>
  );
}

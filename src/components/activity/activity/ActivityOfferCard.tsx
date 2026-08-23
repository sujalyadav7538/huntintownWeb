import { ActivityResponse } from "@/src/types";
import {
  ArrowRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  IndianRupee,
  MapPin,
  MessageSquare,
  Star,
  User,
  XCircle,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import { useNavigate } from "react-router-dom";

interface ActivityOfferCardProps {
  offer: ActivityResponse;
  hasReviewed?: boolean;
  onOpenConversation?: () => void;
  onReview?: () => void;
}

const STATUS_CONFIG = {
  pending: {
    label: "Pending",
    icon: Clock3,
    className: "border-amber-500/15 bg-amber-500/10 text-amber-400",
    message: "Waiting for the owner to review your offer",
  },
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    className: "border-emerald-500/15 bg-emerald-500/10 text-emerald-400",
    message: "Your offer was accepted",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    className: "border-red-500/15 bg-red-500/10 text-red-400",
    message: "The owner selected another response",
  },
  completed: {
    label: "Completed",
    icon: CheckCircle2,
    className: "border-blue-500/15 bg-blue-500/10 text-blue-400",
    message: "This requirement has been completed",
  },
};

export default function ActivityOfferCard({
  offer,
  hasReviewed = false,
  onOpenConversation,
  onReview,
}: ActivityOfferCardProps) {
  const post = offer.postId;
  const owner = post?.author;
  const navigate=useNavigate();
  console.log(owner)
  const cfg =
    STATUS_CONFIG[offer.status as keyof typeof STATUS_CONFIG] ??
    STATUS_CONFIG.pending;

  const StatusIcon = cfg.icon;

  const canChat = offer.status === "accepted" || offer.status === "completed";

  const canReview = offer.status === "completed" && !hasReviewed;

  const appliedDate = offer.createdAt
    ? new Date(offer.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  const completedDate = offer.completedAt
    ? new Date(offer.completedAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

  return (
    <article className="group rounded-2xl border border-white/[0.07] bg-[#101012] p-4 transition hover:border-white/[0.11] sm:p-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          {post?.category && (
            <span className="text-[9px] font-bold uppercase tracking-[0.16em] text-zinc-600">
              {post.category}
            </span>
          )}

          <h3 className="mt-1 text-[14px] font-semibold leading-snug text-zinc-100 sm:text-[15px]">
            {post?.title || "Untitled requirement"}
          </h3>
        </div>

        <span
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[9px] font-semibold ${cfg.className}`}
        >
          <StatusIcon className="h-3 w-3" />
          {cfg.label}
        </span>
      </div>

      {/* Owner */}
      {owner && (
        <button
          type="button"
          className="mt-4 flex items-center gap-2.5 text-left cursor-pointer"
          onClick={()=>navigate(`/profile/${owner.id}`)}
        >
          <img
            src={getAvatarUrl(owner.name, owner.avatar ?? undefined)}
            alt={owner.name}
            className="h-8 w-8 rounded-full border border-white/[0.08] object-cover"
            onError={(e) => handleAvatarError(e, owner.name)}
            referrerPolicy="no-referrer"
          />

          <div className="min-w-0">
            <div className="flex items-center gap-1">
              <span className="truncate text-[11px] font-semibold text-zinc-300">
                {owner.name}
              </span>

              {owner.isGovernmentVerified && (
                <BadgeCheck className="h-3 w-3 shrink-0 text-blue-400" />
              )}
            </div>

            <p className="text-[9px] text-zinc-600">
              {owner.role || "HuntInTown member"}
            </p>
          </div>
        </button>
      )}

      {/* Details */}
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {post?.budget && (
          <div className="rounded-lg border border-white/[0.045] bg-white/[0.018] px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-3 w-3 text-emerald-500" />

              <span className="text-[8px] uppercase tracking-wider text-zinc-700">
                Budget
              </span>
            </div>

            <p className="mt-1 truncate text-[10px] font-semibold text-zinc-300">
              ₹{post.budget}
            </p>
          </div>
        )}

        {post?.timeline && (
          <div className="rounded-lg border border-white/[0.045] bg-white/[0.018] px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <Clock3 className="h-3 w-3 text-amber-400" />

              <span className="text-[8px] uppercase tracking-wider text-zinc-700">
                Timeline
              </span>
            </div>

            <p className="mt-1 truncate text-[10px] font-semibold text-zinc-300">
              {post.timeline}
            </p>
          </div>
        )}

        {post?.address && (
          <div className="rounded-lg border border-white/[0.045] bg-white/[0.018] px-3 py-2.5">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3 w-3 text-[#ff5555]" />

              <span className="text-[8px] uppercase tracking-wider text-zinc-700">
                Location
              </span>
            </div>

            <p className="mt-1 truncate text-[10px] font-semibold text-zinc-300">
              {post.address}
            </p>
          </div>
        )}

        <div className="rounded-lg border border-white/[0.045] bg-white/[0.018] px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="h-3 w-3 text-zinc-600" />

            <span className="text-[8px] uppercase tracking-wider text-zinc-700">
              {completedDate ? "Completed" : "Applied"}
            </span>
          </div>

          <p className="mt-1 truncate text-[10px] font-semibold text-zinc-300">
            {completedDate || appliedDate || "Recently"}
          </p>
        </div>
      </div>

      {/* Status + actions */}
      <div className="mt-4 flex flex-col gap-3 border-t border-white/[0.05] pt-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-[10px] leading-relaxed text-zinc-600">
          {cfg.message}
        </p>

        {(canChat || canReview) && (
          <div className="flex shrink-0 gap-2">
            {canReview && (
              <button
                type="button"
                onClick={onReview}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg border border-amber-500/20 bg-amber-500/8 px-3 text-[9px] font-semibold text-amber-300 transition hover:bg-amber-500/12"
              >
                <Star className="h-3 w-3" />
                Review
              </button>
            )}

            {canChat && (
              <button
                type="button"
                onClick={onOpenConversation}
                className="inline-flex h-8 items-center justify-center gap-1.5 rounded-lg bg-[#FF3F3F] px-3 text-[9px] font-semibold text-white transition hover:bg-[#e93636]"
              >
                <MessageSquare className="h-3 w-3" />
                Conversation
                <ArrowRight className="h-3 w-3" />
              </button>
            )}
          </div>
        )}
      </div>
    </article>
  );
}

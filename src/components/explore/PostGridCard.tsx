import { MapPin, Clock, IndianRupee, ArrowRight } from "lucide-react";

import { getPostExpiryLabel, isPostExpired } from "../../utils";
import { CATEGORY_COLORS } from "../../lib/postConstants";

export interface PostCardData {
  _id?: string;
  id?: string;
  title: string;
  description: string;
  category: string;
  status: string;
  address?: string;
  budget?: string;
  timeline?: string;
  images?: string[];
  expiresAt?: string;
  responsesCount?: number;
  createdAt?: string;
}

interface PostGridCardProps {
  post: PostCardData;

  /** Main card click */
  onSelect: () => void;

  /** Optional content shown between details and footer */
  badge?: React.ReactNode;
  meta?: React.ReactNode;

  /** View button configuration */
  showViewButton?: boolean;
  viewButtonLabel?: string;
  expiredButtonLabel?: string;
  showViewArrow?: boolean;

  /** Footer configuration */
  showFooter?: boolean;
  footerTitle?: string;
  activeFooterText?: string;
  expiredFooterText?: string;
}

export default function PostGridCard({
  post,
  onSelect,
  badge,
  meta,

  showViewButton = true,
  viewButtonLabel = "View",
  expiredButtonLabel = "Expired",
  showViewArrow = true,

  showFooter = true,
  footerTitle = "Requirement",
  activeFooterText = "Open for responses",
  expiredFooterText = "No longer accepting responses",
}: PostGridCardProps) {
  const expired = post?.expiresAt ? isPostExpired(post.expiresAt) : false;

  const timeLabel = post?.expiresAt ? getPostExpiryLabel(post.expiresAt) : null;

  const accent = CATEGORY_COLORS[post?.category?.toLowerCase()] ?? "#FF3F3F";

  return (
    <article
      onClick={onSelect}
      className="
        group relative flex min-w-0 cursor-pointer flex-col
        overflow-hidden rounded-2xl
        theme-post-card border border-white/[0.07]
        p-4
        transition-all duration-200
        hover:border-white/12
        hover:bg-[#141417]
      "
    >
      {/* Accent */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(
            90deg,
            transparent,
            ${accent},
            transparent
          )`,
        }}
      />

      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        {/* Response Count */}
        {post.responsesCount && post.responsesCount > 0 ? (
          <span
            className="
              theme-badge-accent
              inline-flex
              items-center
              gap-1
              rounded-full
              px-2 py-1
              text-[9px]
              font-bold
            "
          >
            <span className="h-1 w-1 rounded-full bg-white" />
            {post.responsesCount}{" "}
            {post.responsesCount === 1 ? "response" : "responses"}
          </span>
        ) : (
          <span />
        )}

        {/* Category */}
        {post?.category && (
          <span
            className="
              shrink-0 rounded-full
              border px-2 py-1
              text-[8px] font-bold uppercase tracking-wider
            "
            style={{
              backgroundColor: `${accent}0d`,
              borderColor: `${accent}22`,
              color: accent,
            }}
          >
            {post.category}
          </span>
        )}
      </header>

      {/* Title */}
      <div className="mt-4">
        <h3
          className="
            line-clamp-1
            text-[14px] font-semibold
            leading-[1.4]
            tracking-[-0.01em]
            text-zinc-100
            transition-colors
            group-hover:text-white
          "
        >
          {post?.title || "Untitled requirement"}
        </h3>
      </div>

      {/* Description */}
      {post?.description && (
        <p className="mt-2 line-clamp-2 text-[10px] leading-relaxed text-zinc-600">
          {post.description}
        </p>
      )}

      {/* Details */}
      <div className="mt-4 flex flex-wrap gap-1.5">
        {post?.address && (
          <span
            className="
              inline-flex min-w-0 max-w-full items-center gap-1.5
              rounded-lg border border-white/5.5
              bg-white/2.5
              px-2 py-1.5
              text-[9px] text-zinc-500
            "
          >
            <MapPin className="h-3 w-3 shrink-0 text-zinc-600" />

            <span className="truncate">{post.address}</span>
          </span>
        )}

        {post?.budget && (
          <span
            className="
              inline-flex items-center gap-1.5
              rounded-lg border border-white/5.5
              bg-white/2.5
              px-2 py-1.5
              text-[9px] text-zinc-500
            "
          >
            <IndianRupee className="h-3 w-3 shrink-0 text-emerald-700" />

            <span className="text-zinc-400">{post.budget}</span>
          </span>
        )}

        {(post?.timeline || (timeLabel && !expired)) && (
          <span
            className="
              inline-flex items-center gap-1.5
              rounded-lg border border-white/5.5
              bg-white/2.5
              px-2 py-1.5
              text-[9px] text-zinc-500
            "
          >
            <Clock className="h-3 w-3 shrink-0 text-amber-600" />

            <span className="truncate">{post?.timeline || timeLabel}</span>
          </span>
        )}
      </div>

      {/* Optional badge / meta */}
      {(badge || meta) && (
        <div className="mt-3 flex items-center justify-between gap-2">
          {badge && <div>{badge}</div>}

          {meta && <div className="ml-auto">{meta}</div>}
        </div>
      )}

      {/* Footer */}
      {showFooter && (
        <div
          className="
            mt-4 flex items-center justify-between gap-3
            border-t border-white/5.5
            pt-3
          "
        >
          <div className="min-w-0">
            <p className="text-[8px] uppercase tracking-[0.14em] text-zinc-700">
              {footerTitle}
            </p>

            <p className="mt-0.5 text-[9px] text-zinc-600">
              {expired ? expiredFooterText : activeFooterText}
            </p>
          </div>

          {/* Configurable View Button */}
          {showViewButton && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onSelect();
              }}
              className="
                theme-btn-accent
                inline-flex h-8 shrink-0
                cursor-pointer
                items-center gap-1.5
                rounded-lg
                px-3
                text-[9px] font-semibold
                transition-all duration-200
                active:scale-[0.98]
                disabled:cursor-not-allowed
              "
              disabled={expired}
            >
              {expired ? expiredButtonLabel : viewButtonLabel}

              {!expired && showViewArrow && <ArrowRight className="h-3 w-3" />}
            </button>
          )}
        </div>
      )}

      {/* Hover accent */}
      <div
        className="
          pointer-events-none absolute inset-x-0 bottom-0
          h-px
          bg-linear-to-r
          from-transparent
          via-[#FF3F3F]/60
          to-transparent
          opacity-0
          transition-opacity
          group-hover:opacity-100
        "
      />
    </article>
  );
}

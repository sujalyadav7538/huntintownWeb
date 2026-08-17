import {
  MapPin,
  Clock,
  Users,
  IndianRupee,
  Zap,
  ArrowRight,
} from "lucide-react";

import {
  getPostExpiryLabel,
  handleAvatarError,
  isPostExpired,
  getAvatarUrl,
} from "../../utils";

import { CATEGORY_COLORS } from "../../lib/postConstants";

export interface PostCardData {
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
  author?: {
    name: string;
    avatar?: string | null;
  };
}

interface PostGridCardProps {
  post: PostCardData;
  onSelect: () => void;
  badge?: React.ReactNode;
  meta?: React.ReactNode;
}
export default function PostGridCard({
  post,
  onSelect,
  badge,
  meta,
}: PostGridCardProps) {
  const expired = post?.expiresAt ? isPostExpired(post.expiresAt) : false;

  const timeLabel = post?.expiresAt ? getPostExpiryLabel(post.expiresAt) : null;

  const accent = CATEGORY_COLORS[post?.category?.toLowerCase()] ?? "#FF3F3F";

  const authorName = post?.author?.name || "HuntInTown User";

  const authorAvatar = post?.author
    ? getAvatarUrl(post.author.name, post.author.avatar ?? undefined)
    : null;

  return (
    <article
      className="
      group relative flex min-w-0 cursor-pointer flex-col
      overflow-hidden rounded-2xl
      border border-white/[0.07]
      bg-[#111114]
      p-4
      transition-all duration-200
      hover:border-white/[0.12]
      hover:bg-[#141417]
    "
    >
      {/* Accent */}
      <div
        className="absolute inset-x-0 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${accent}, transparent)`,
        }}
      />

      {/* Header */}
      <header className="flex items-center justify-between gap-3">
        {/* Author */}
        <div className="flex min-w-0 items-center gap-2.5">
          {authorAvatar ? (
            <img
              src={authorAvatar}
              alt={authorName}
              className="
              h-8 w-8 shrink-0 rounded-full
              border border-white/[0.08]
              object-cover
            "
              onError={(e) => handleAvatarError(e, authorName)}
              referrerPolicy="no-referrer"
            />
          ) : (
            <div
              className="
              flex h-8 w-8 shrink-0 items-center justify-center
              rounded-full border text-[10px] font-bold
            "
              style={{
                backgroundColor: `${accent}12`,
                borderColor: `${accent}25`,
                color: accent,
              }}
            >
              {authorName?.charAt(0)?.toUpperCase() ?? "?"}
            </div>
          )}

          <div className="min-w-0">
            <p className="truncate text-[10px] font-medium text-zinc-500">
              Posted by
            </p>

            <p className="truncate text-[11px] font-semibold text-zinc-300">
              {authorName}
            </p>
          </div>
        </div>

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
            rounded-lg border border-white/[0.055]
            bg-white/[0.025]
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
            rounded-lg border border-white/[0.055]
            bg-white/[0.025]
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
            rounded-lg border border-white/[0.055]
            bg-white/[0.025]
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
      <div
        className="
        mt-4 flex items-center justify-between gap-3
        border-t border-white/[0.055]
        pt-3
      "
      >
        <div className="min-w-0">
          <p className="text-[8px] uppercase tracking-[0.14em] text-zinc-700">
            Requirement
          </p>

          <p className="mt-0.5 text-[9px] text-zinc-600">
            {expired ? "No longer accepting responses" : "Open for responses"}
          </p>
        </div>

        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onSelect();
          }}
          disabled={expired}
          className="
          inline-flex h-8 shrink-0 items-center gap-1.5
          rounded-lg
          bg-[#9a2727]
          px-3
          text-[9px] font-semibold text-white
          transition-all duration-200
          hover:bg-[#e53535]
          active:scale-[0.98]
          disabled:cursor-not-allowed
          disabled:bg-zinc-800
          disabled:text-zinc-600
        "
        >
          {expired ? "Expired" : "View"}
          {!expired && <ArrowRight className="h-3 w-3" />}
        </button>
      </div>
    </article>
  );
}

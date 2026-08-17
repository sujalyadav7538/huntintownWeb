import { BadgeCheck, ChevronLeft, Clock, MapPin, Users, Zap } from "lucide-react";
import { Post, User } from "../../types";
import { getAvatarUrl, handleAvatarError, isPostExpired } from "../../utils";

const STATUS_DOT: Record<string, string> = {
  live: "bg-emerald-500",
  in_progress: "bg-yellow-500",
  completed: "bg-blue-500",
  expired: "bg-zinc-600",
  cancelled: "bg-red-700",
};

interface Props {
  post: Post;
  onBack?: () => void;
  onViewProfile?: (author: User) => void;
}

export default function PostDetailHeader({
  post,
  onBack,
  onViewProfile,
}: Props) {
  const expired = isPostExpired(post.expiresAt);

  const isUrgent =
    post.title.toLowerCase().includes("urgent") ||
    post.description.toLowerCase().includes("urgent");

  const status = post.status?.replace("_", " ") || "live";

  return (
    <section className="overflow-hidden rounded-2xl border border-[#25252b] bg-[#17171b]">
      {/* =====================================================
          BACK / TOP BAR
      ===================================================== */}
      <div className="flex items-center gap-3 border-b border-[#222227] px-4 py-3 sm:px-5">
        <button
          type="button"
          onClick={onBack}
          className="
            inline-flex h-8 w-8 shrink-0 items-center justify-center
            rounded-full
            border border-[#29292f]
            bg-[#111114]
            text-zinc-500
            transition
            hover:border-[#3a3a42]
            hover:bg-[#1b1b20]
            hover:text-zinc-200
          "
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <span className="truncate text-[11px] font-medium text-zinc-500">
          Requirement
        </span>

        <div className="ml-auto flex items-center gap-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full ${
              STATUS_DOT[post.status] ?? STATUS_DOT.live
            }`}
          />

          <span className="text-[10px] capitalize text-zinc-500">
            {status}
          </span>
        </div>
      </div>

      {/* =====================================================
          IMAGE SECTION
          Images are optional. If present, they are shown here.
      ===================================================== */}
      {post.images?.length ? (
        <div className="relative">
          <div className="h-52 w-full overflow-hidden bg-[#101014] sm:h-72">
            <img
              src={post.images[0]}
              alt={post.title}
              className="h-full w-full object-cover"
            />
          </div>

          {/* Bottom gradient */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#17171b] to-transparent" />

          {/* Image count */}
          {post.images.length > 1 && (
            <span
              className="
                absolute bottom-3 right-3
                rounded-full
                border border-white/10
                bg-black/60
                px-2.5 py-1
                text-[9px]
                font-medium
                text-zinc-300
                backdrop-blur-md
              "
            >
              {post.images.length} images
            </span>
          )}
        </div>
      ) : null}

      {/* =====================================================
          CONTENT
      ===================================================== */}
      <div className="space-y-5 p-5 sm:p-6">
        {/* Category / Status */}
        <div className="flex flex-wrap items-center gap-2">
          {post.category && (
            <span
              className="
                rounded-full
                border border-[#ff3f3f]/20
                bg-[#ff3f3f]/10
                px-2.5 py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-[#ff6b6b]
              "
            >
              {post.category}
            </span>
          )}

          {isUrgent && !expired && (
            <span
              className="
                inline-flex items-center gap-1.5
                rounded-full
                bg-[#ff3f3f]/10
                px-2.5 py-1
                text-[9px]
                font-semibold
                uppercase
                tracking-wide
                text-[#ff6b6b]
              "
            >
              <Zap className="h-3 w-3" />
              Urgent
            </span>
          )}

          {expired && (
            <span className="rounded-full bg-white/[0.04] px-2.5 py-1 text-[9px] text-zinc-600">
              Expired
            </span>
          )}
        </div>

        {/* Title */}
        <div>
          <h1
            className="
              text-xl
              font-bold
              leading-[1.3]
              tracking-[-0.02em]
              text-zinc-100
              sm:text-2xl
            "
          >
            {post.title}
          </h1>

          {post.description && (
            <p className="mt-3 max-w-3xl text-[12px] leading-[1.7] text-zinc-500">
              {post.description}
            </p>
          )}
        </div>

        {/* =================================================
            AUTHOR
        ================================================= */}
        <button
          type="button"
          onClick={() => onViewProfile?.(post.author)}
          className="
            group/author
            flex w-full items-center gap-3
            rounded-xl
            border border-[#232329]
            bg-[#111114]
            p-3
            text-left
            transition
            hover:border-[#303038]
            hover:bg-[#141418]
          "
        >
          <img
            src={getAvatarUrl(
              post.author.name,
              post.author.avatar ?? undefined,
            )}
            alt={post.author.name}
            className="
              h-10 w-10 shrink-0
              rounded-full
              border border-[#303036]
              object-cover
            "
            onError={(e) => handleAvatarError(e, post.author.name)}
            referrerPolicy="no-referrer"
          />

          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-[12px] font-semibold text-zinc-200 group-hover/author:text-white">
                {post.author.name}
              </span>

              {post.author.isGovernmentVerified && (
                <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
              )}
            </div>

            <span className="text-[10px] text-zinc-600">
              {post.author.role || "HuntInTown member"}
            </span>
          </div>

          <span className="text-[9px] font-medium text-zinc-600 transition group-hover/author:text-zinc-400">
            View profile
          </span>
        </button>

        {/* =================================================
            QUICK INFORMATION
        ================================================= */}
        <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
          {/* Location */}
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#232329] bg-[#111114] px-3 py-2.5">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-zinc-600" />

            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-wider text-zinc-700">
                Location
              </p>
              <p className="truncate text-[10px] font-medium text-zinc-300">
                {post.address || "Not specified"}
              </p>
            </div>
          </div>

          {/* Responses */}
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#232329] bg-[#111114] px-3 py-2.5">
            <Users className="h-3.5 w-3.5 shrink-0 text-zinc-600" />

            <div>
              <p className="text-[8px] uppercase tracking-wider text-zinc-700">
                Responses
              </p>
              <p className="text-[10px] font-medium text-zinc-300">
                {(post.responsesCount ?? 0)} helpers
              </p>
            </div>
          </div>

          {/* Timeline */}
          <div className="flex min-w-0 items-center gap-2.5 rounded-xl border border-[#232329] bg-[#111114] px-3 py-2.5">
            <Clock className="h-3.5 w-3.5 shrink-0 text-zinc-600" />

            <div className="min-w-0">
              <p className="text-[8px] uppercase tracking-wider text-zinc-700">
                Timeline
              </p>
              <p className="truncate text-[10px] font-medium text-zinc-300">
                {post.timeline || "Flexible"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
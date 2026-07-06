import { MapPin, Clock, Users, IndianRupee, Zap } from "lucide-react";
import { Post } from "../../types";
import { getPostExpiryLabel, handleAvatarError, isPostExpired } from "../../utils";

const CATEGORY_GRADIENTS: Record<string, string> = {
  Technology: "from-indigo-950 to-indigo-900",
  Design: "from-pink-950 to-pink-900",
  Marketing: "from-amber-950 to-amber-900",
  Writing: "from-emerald-950 to-emerald-900",
  Education: "from-blue-950 to-blue-900",
  Finance: "from-teal-950 to-teal-900",
  Health: "from-green-950 to-green-900",
  Legal: "from-violet-950 to-violet-900",
  "Home & Living": "from-orange-950 to-orange-900",
};

const CATEGORY_COLORS: Record<string, string> = {
  Technology: "#6366f1",
  Design: "#ec4899",
  Marketing: "#f59e0b",
  Writing: "#10b981",
  Education: "#3b82f6",
  Finance: "#14b8a6",
  Health: "#22c55e",
  Legal: "#8b5cf6",
  "Home & Living": "#f97316",
};

interface PostGridCardProps {
  post: Post;
  onSelect: () => void;
}

export default function PostGridCard({ post, onSelect }: PostGridCardProps) {
  const expired = isPostExpired(post.expiresAt);
  const timeLabel = getPostExpiryLabel(post.expiresAt);
  const gradient = CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const isUrgent =
    post.title.toLowerCase().includes("urgent") ||
    post.description.toLowerCase().includes("urgent");

  return (
    <article
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0e0e10] cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5"
    >
      {/* Thumbnail */}
      <div className={`relative h-36 bg-linear-to-br ${gradient} overflow-hidden`}>
        {post.images?.length ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className="text-4xl font-black opacity-20 select-none"
              style={{ color: accent }}
            >
              {post.category?.[0] ?? "?"}
            </span>
          </div>
        )}

        {/* Top badges */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md"
            style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}
          >
            {post.category}
          </span>
          {isUrgent && !expired && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF3F3F]/20 text-[#FF3F3F] border border-[#FF3F3F]/40 backdrop-blur-md uppercase tracking-wide">
              <Zap className="w-2.5 h-2.5" />
              Urgent
            </span>
          )}
        </div>

        {/* Offers badge */}
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md text-[10px] text-zinc-300">
          <Users className="w-3 h-3" />
          {post.offersCount}
        </div>

        {expired && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-xs font-semibold text-zinc-400 bg-black/60 px-3 py-1 rounded-full">Expired</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
          {post.title}
        </h3>

        {/* Author row */}
        <div className="flex items-center gap-2 mt-auto">
          <img
            src={post.author?.avatar || ""}
            alt={post.author?.name}
            className="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
            onError={(e) => handleAvatarError(e, post.author?.name || "?")}
            referrerPolicy="no-referrer"
          />
          <span className="truncate text-[11px] text-zinc-400">{post.author?.name}</span>
        </div>

        {/* Meta row */}
        <div className="flex items-center justify-between text-[10px] text-zinc-600 pt-1 border-t border-zinc-800/60">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{post.address}</span>
          </span>
          <span className="flex items-center gap-1 shrink-0 ml-2">
            {post.budget && (
              <>
                <IndianRupee className="w-2.5 h-2.5" />
                {post.budget}
              </>
            )}
          </span>
        </div>

        <div className="flex items-center gap-1 text-[10px] text-zinc-600">
          <Clock className="w-2.5 h-2.5 shrink-0" />
          {timeLabel}
        </div>
      </div>
    </article>
  );
}

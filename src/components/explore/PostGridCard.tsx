import { MapPin, Clock, Users, IndianRupee, Zap } from "lucide-react";
import {
  getPostExpiryLabel,
  handleAvatarError,
  isPostExpired,
  getAvatarUrl,
} from "../../utils";
import { CATEGORY_GRADIENTS, CATEGORY_COLORS } from "../../lib/postConstants";

/** Minimum shape required â€” satisfied by Post, ActivityPost, and ResponsePost */
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
  offersCount?: number;
  createdAt?: string;
  author?: { name: string; avatar?: string | null };
}

interface PostGridCardProps {
  post: PostCardData;
  onSelect: () => void;
  /** Thumbnail bottom-left overlay (e.g. "3 new" pill, offer status) */
  badge?: React.ReactNode;
  /** Extra row below the footer (e.g. offer count, accepted count) */
  meta?: React.ReactNode;
}

export default function PostGridCard({
  post,
  onSelect,
  badge,
  meta,
}: PostGridCardProps) {
  const expired = post.expiresAt ? isPostExpired(post.expiresAt) : false;
  const timeLabel = post.expiresAt ? getPostExpiryLabel(post.expiresAt) : null;
  const gradient =
    CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const isUrgent =
    post.title.toLowerCase().includes("urgent") ||
    post.description.toLowerCase().includes("urgent");

  return (
    <article
      onClick={onSelect}
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0e0e10] cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5"
    >
      {/* â”€â”€ Thumbnail â”€â”€ */}
      <div
        className={`relative h-36 bg-linear-to-br ${gradient} overflow-hidden`}
      >
        {post.images?.length ? (
          <img
            src={post.images[0]}
            alt={post.title}
            className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex h-full items-center justify-center">
            <span
              className="text-5xl font-black opacity-15 select-none"
              style={{ color: accent }}
            >
              {post.category?.[0] ?? "?"}
            </span>
          </div>
        )}

        {/* top-left: category + urgent */}
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span
            className="px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}44`,
            }}
          >
            {post.category}
          </span>
          {isUrgent && !expired && (
            <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF3F3F]/20 text-[#FF3F3F] border border-[#FF3F3F]/40 backdrop-blur-md uppercase">
              <Zap className="w-2.5 h-2.5" />
              Urgent
            </span>
          )}
        </div>

        {/* top-right: offer count */}
        <div className="absolute top-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md text-[10px] text-zinc-300">
          <Users className="w-3 h-3" />
          {post.offersCount ?? 0}
        </div>

        {/* bottom-left: optional badge slot */}
        {badge && <div className="absolute bottom-2 left-2">{badge}</div>}

        {expired && (
          <div className="absolute inset-0 bg-black/55 flex items-center justify-center">
            <span className="text-xs font-semibold text-zinc-400 bg-black/60 px-3 py-1 rounded-full">
              Expired
            </span>
          </div>
        )}
      </div>

      {/* â”€â”€ Body â”€â”€ */}
      <div className="flex flex-1 flex-col p-3 gap-2">
        {/* author row â€” only when author data is provided */}
        {post.author && (
          <div className="flex items-center gap-2">
            <img
              src={getAvatarUrl(
                post.author.name,
                post.author.avatar ?? undefined,
              )}
              alt={post.author.name}
              className="h-6 w-6 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
              onError={(e) => handleAvatarError(e, post.author!.name)}
              referrerPolicy="no-referrer"
            />
            <span className="truncate text-[11px] text-zinc-400">
              {post.author.name}
            </span>
            {post.createdAt && (
              <span className="ml-auto shrink-0 text-[10px] text-zinc-600">
                {new Date(post.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                })}
              </span>
            )}
          </div>
        )}

        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100 group-hover:text-white">
          {post.title}
        </h3>

        <div className="mt-auto flex items-center justify-between gap-2 text-[10px] text-zinc-600 pt-1.5 border-t border-zinc-800/50">
          <span className="flex items-center gap-1 truncate">
            <MapPin className="w-2.5 h-2.5 shrink-0" />
            <span className="truncate">{post.address || "â€”"}</span>
          </span>
          <div className="flex items-center gap-2 shrink-0">
            {post.budget && post.budget !== "Negotiable" && (
              <span className="flex items-center gap-0.5">
                <IndianRupee className="w-2.5 h-2.5" />
                {post.budget}
              </span>
            )}
            {timeLabel && !expired && (
              <span className="flex items-center gap-0.5">
                <Clock className="w-2.5 h-2.5" />
                {timeLabel}
              </span>
            )}
          </div>
        </div>

        {meta && <div>{meta}</div>}
      </div>
    </article>
  );
}

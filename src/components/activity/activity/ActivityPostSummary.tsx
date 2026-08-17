import {
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  POST_STATUS_STYLE,
} from "@/src/lib/postConstants";
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import { MapPin } from "lucide-react";
interface ActivityPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  address?: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  questions?: string[];
  author: { _id?: string; name: string; avatar: string };
}

interface ActivityResponse {
  _id: string;
  postId: ActivityPost;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface ActivityPostSummaryProps {
  offer: ActivityResponse;
}

export default function ActivityPostSummary({
  offer,
}: ActivityPostSummaryProps) {
  const post = offer.postId;

  const accent = CATEGORY_COLORS[post?.category] || "#FF3F3F";

  const gradient =
    CATEGORY_GRADIENTS[post?.category] || "from-zinc-900 to-zinc-800";

  return (
    <section className="overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#0c0c0e]">
      {/* Banner */}
      <div className={`relative h-24 bg-linear-to-br ${gradient}`}>
        <div className="flex h-full items-center justify-center">
          <span
            className="select-none text-6xl font-black opacity-10"
            style={{ color: accent }}
          >
            {post?.category?.[0] ?? "?"}
          </span>
        </div>

        <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-[#0c0c0e] to-transparent" />

        <div className="absolute left-3 top-3 flex flex-wrap gap-1.5">
          <span
            className="rounded-full border px-2.5 py-1 text-[10px] font-semibold backdrop-blur-md"
            style={{
              background: `${accent}22`,
              color: accent,
              borderColor: `${accent}44`,
            }}
          >
            {post?.category}
          </span>

          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase backdrop-blur-md ${
              POST_STATUS_STYLE[post?.status] || POST_STATUS_STYLE.live
            }`}
          >
            {post?.status}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-3 px-5 pb-5">
        {/* Author */}
        <div className="flex items-center gap-2.5">
          <img
            src={getAvatarUrl(post?.author?.name, post?.author?.avatar)}
            alt={post?.author?.name}
            className="h-8 w-8 shrink-0 rounded-full object-cover ring-2 ring-zinc-800"
            onError={(e) => handleAvatarError(e, post?.author?.name)}
            referrerPolicy="no-referrer"
          />

          <div className="min-w-0">
            <p className="truncate text-xs font-semibold text-zinc-200">
              {post?.author?.name}
            </p>

            {post?.address && (
              <p className="flex items-center gap-1 truncate text-[10px] text-zinc-600">
                <MapPin className="h-3 w-3 shrink-0" />
                {post.address}
              </p>
            )}
          </div>
        </div>

        {/* Title */}
        <div>
          <h2 className="text-base font-black leading-snug text-zinc-100">
            {post?.title}
          </h2>

          <p className="mt-1.5 line-clamp-3 text-[12px] leading-relaxed text-zinc-500">
            {post?.description}
          </p>
        </div>

        {/* Meta */}
        <div className="flex flex-wrap gap-2">
          {post?.budget && (
            <span className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[10px] text-zinc-400">
              ₹{post.budget}
            </span>
          )}

          {post?.timeline && (
            <span className="rounded-lg border border-zinc-800 bg-zinc-900/70 px-2.5 py-1 text-[10px] text-zinc-400">
              {post.timeline}
            </span>
          )}
        </div>
      </div>
    </section>
  );
}

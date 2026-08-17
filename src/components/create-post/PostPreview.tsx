
import { getAvatarUrl, handleAvatarError } from "@/src/utils";
import {
  Clock,
  IndianRupee,
  MapPin,
  Users,
  Zap,
} from "lucide-react";


interface PostPreviewProps {
  user?: {
    name?: string;
    avatar?: string;
  } | null;

  description: string;
  category: string;
  address: string;
  budget: string;
  timeline: string;
  expiryDays: number;
  imagePreviews: string[];
}

export default function PostPreview({
  user,
  description,
  category,
  address,
  budget,
  timeline,
  expiryDays,
  imagePreviews,
}: PostPreviewProps) {
  const title =
    description.length > 60
      ? `${description.substring(0, 60)}…`
      : description;

  const isUrgent = description.toLowerCase().includes("urgent");

  return (
    <div className="w-full">
      <div className="mb-4 flex items-center gap-2">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#FF3F3F]" />

        <span className="text-[10px] font-bold uppercase tracking-[0.18em] text-zinc-600">
          Preview
        </span>
      </div>

      <article className="overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#0e0e10]">
        {/* User */}
        <div className="flex items-center justify-between gap-3 p-4">
          <div className="flex min-w-0 items-center gap-2.5">
            <img
              src={getAvatarUrl(
                user?.name || "You",
                user?.avatar,
              )}
              alt={user?.name || "You"}
              className="h-8 w-8 shrink-0 rounded-full object-cover ring-1 ring-zinc-800"
              onError={(e) =>
                handleAvatarError(e, user?.name || "You")
              }
              referrerPolicy="no-referrer"
            />

            <div className="min-w-0">
              <p className="truncate text-[12px] font-semibold text-zinc-200">
                {user?.name || "You"}
              </p>

              <div className="mt-0.5 flex items-center gap-1 text-[9px] text-zinc-600">
                <MapPin className="h-2.5 w-2.5" />

                <span className="truncate">
                  {address || "Location"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-1 rounded-full border border-[#252529] bg-[#151517] px-2 py-1 text-[9px] text-zinc-600">
            <Users className="h-2.5 w-2.5" />
            0
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3 px-4 pb-4">
          <div>
            <h3 className="text-[14px] font-bold leading-snug text-zinc-100">
              {title || (
                <span className="font-normal italic text-zinc-700">
                  Your post title will appear here…
                </span>
              )}
            </h3>

            <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-zinc-500">
              {description || (
                <span className="italic text-zinc-700">
                  Your description will appear here…
                </span>
              )}
            </p>
          </div>

          {/* Images */}
          {imagePreviews.length > 0 && (
            <div
              className={`
                grid gap-1.5
                ${
                  imagePreviews.length === 1
                    ? "grid-cols-1"
                    : "grid-cols-2"
                }
              `}
            >
              {imagePreviews.map((src, index) => (
                <img
                  key={`${src}-${index}`}
                  src={src}
                  alt=""
                  className={`
                    w-full rounded-xl border border-[#1e1e22]
                    object-cover
                    ${
                      imagePreviews.length === 1
                        ? "max-h-48"
                        : "h-24"
                    }
                  `}
                />
              ))}
            </div>
          )}

          {/* Metadata */}
          <div className="flex flex-wrap gap-1.5">
            {category && (
              <span className="rounded-full border border-[#FF3F3F]/20 bg-[#FF3F3F]/5 px-2 py-1 text-[9px] font-semibold text-zinc-300">
                {category}
              </span>
            )}

            <span className="inline-flex items-center gap-1 rounded-full border border-[#252529] bg-[#151517] px-2 py-1 text-[9px] font-semibold text-zinc-500">
              <IndianRupee className="h-2.5 w-2.5" />
              {budget || "Negotiable"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-[#252529] bg-[#151517] px-2 py-1 text-[9px] font-semibold text-zinc-500">
              <Clock className="h-2.5 w-2.5" />
              {timeline || "Flexible"}
            </span>

            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-900/40 bg-emerald-950/30 px-2 py-1 text-[9px] font-semibold text-emerald-500">
              <Clock className="h-2.5 w-2.5" />
              {expiryDays}d
            </span>

            {isUrgent && (
              <span className="inline-flex items-center gap-1 rounded-full border border-[#FF3F3F]/30 bg-[#FF3F3F]/10 px-2 py-1 text-[9px] font-bold uppercase tracking-wide text-[#FF3F3F]">
                <Zap className="h-2.5 w-2.5" />
                Urgent
              </span>
            )}
          </div>
        </div>
      </article>

      <p className="mt-3 text-center text-[9px] text-zinc-700">
        This is how your post will appear to others.
      </p>
    </div>
  );
}
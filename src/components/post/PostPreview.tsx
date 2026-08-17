import {
  Clock3,
  IndianRupee,
  MapPin,
  UserRound,
} from "lucide-react";

interface PostPreviewProps {
  title?: string;
  category?: string;
  description?: string;
  address?: string;
  budget?: string;
  timeline?: string;
  imagePreviews?: string[];
  user?: {
    name?: string;
    avatar?: string;
  };
}

export default function PostPreview({
  title,
  category,
  description,
  address,
  budget,
  timeline,
  imagePreviews = [],
  user,
}: PostPreviewProps) {
  return (
    <article className="overflow-hidden rounded-2xl border border-white/[0.07] bg-[#111114]">
      {/* Image */}
      {imagePreviews.length > 0 ? (
        <div className="relative h-40 overflow-hidden">
          <img
            src={imagePreviews[0]}
            alt=""
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        </div>
      ) : (
        <div className="flex h-24 items-center justify-center bg-gradient-to-br from-white/[0.025] to-transparent">
          <UserRound className="h-5 w-5 text-zinc-800" />
        </div>
      )}

      <div className="p-4">
        <div className="flex items-center justify-between gap-2">
          {category && (
            <span className="rounded-full bg-[#FF3F3F]/10 px-2 py-1 text-[8px] font-bold uppercase tracking-wider text-[#ff6565]">
              {category}
            </span>
          )}

          <span className="text-[8px] font-medium uppercase tracking-wider text-zinc-700">
            Preview
          </span>
        </div>

        <h3 className="mt-3 text-sm font-semibold text-zinc-100">
          {title || "Your post title"}
        </h3>

        <p className="mt-1.5 line-clamp-3 text-[10px] leading-relaxed text-zinc-600">
          {description || "Your description will appear here."}
        </p>

        <div className="mt-4 grid grid-cols-2 gap-2">
          <PreviewDetail
            icon={MapPin}
            label="Location"
            value={address || "Not specified"}
          />

          <PreviewDetail
            icon={IndianRupee}
            label="Budget"
            value={budget || "Negotiable"}
          />

          <PreviewDetail
            icon={Clock3}
            label="Timeline"
            value={timeline || "Not specified"}
          />

          <PreviewDetail
            icon={UserRound}
            label="Posted by"
            value={user?.name || "You"}
          />
        </div>
      </div>
    </article>
  );
}

function PreviewDetail({
  icon: Icon,
  label,
  value,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
}) {
  return (
    <div className="min-w-0 rounded-lg border border-white/[0.045] bg-white/[0.015] px-2.5 py-2">
      <div className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 shrink-0 text-zinc-700" />

        <span className="truncate text-[8px] uppercase tracking-wider text-zinc-700">
          {label}
        </span>
      </div>

      <p className="mt-1 truncate text-[9px] font-medium text-zinc-400">
        {value}
      </p>
    </div>
  );
}
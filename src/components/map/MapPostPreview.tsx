import { ArrowRight, MapPin, X } from "lucide-react";
import { Post } from "../../types";

interface MapPostPreviewProps {
  post: Post;
  onClose: () => void;
  onView: () => void;
}

export default function MapPostPreview({
  post,
  onClose,
  onView,
}: MapPostPreviewProps) {
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-0 z-40 flex justify-center p-2 md:p-3">
      <div className="pointer-events-auto w-full max-w-xs overflow-hidden rounded-xl border border-zinc-800 bg-[#101012]/95 backdrop-blur-xl shadow-xl animate-in slide-in-from-bottom-4 duration-200">

        {/* Header */}
        <div className="flex items-start justify-between px-3 pt-3 pb-1.5">
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-sm font-semibold text-white leading-tight">
              {post.title}
            </h2>
            <p className="mt-0.5 line-clamp-1 text-xs text-zinc-400">
              {post.description}
            </p>
          </div>
          <button
            onClick={onClose}
            className="ml-2 rounded-md p-1 text-zinc-500 transition hover:bg-zinc-800 hover:text-white"
          >
            <X size={14} />
          </button>
        </div>

        {/* Tags + location row */}
        <div className="flex flex-wrap items-center gap-1.5 px-3 py-1.5">
          <span className="rounded-full bg-red-500/15 px-2 py-0.5 text-[11px] font-medium text-red-400">
            {post.category}
          </span>
          {post.budget && (
            <span className="rounded-full bg-zinc-800 px-2 py-0.5 text-[11px] text-zinc-300">
              ₹{post.budget}
            </span>
          )}
          <span className={`rounded-full px-2 py-0.5 text-[11px] ${post.status === "live" ? "bg-emerald-500/15 text-emerald-400" : "bg-yellow-500/15 text-yellow-400"}`}>
            {post.status}
          </span>
        </div>

        <div className="flex items-center gap-1.5 px-3 pb-2 text-[11px] text-zinc-500">
          <MapPin size={11} className="shrink-0" />
          <span className="truncate">{post?.address ?? "Location"}</span>
        </div>

        {/* Footer */}
        <div className="border-t border-zinc-800/60 px-3 py-2">
          <button
            onClick={onView}
            className="flex w-full items-center justify-center gap-1.5 rounded-lg bg-red-600 py-2 text-xs font-semibold text-white transition hover:bg-red-500 active:scale-[0.98]"
          >
            Explore Requirement
            <ArrowRight size={13} />
          </button>
        </div>
      </div>
    </div>
  );
}

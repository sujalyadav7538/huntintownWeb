import {
  AlertCircle,
  CheckCircle2,
  Inbox,
  RefreshCw,
  Trash,
} from "lucide-react";
import type { Post } from "@/src/shared/types";

interface PublishedListingItemProps {
  post: Post;
  onUpdateStatus: (postId: string, status: Post["status"]) => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  onViewOffers: (post: Post) => void;
}

export default function PublishedListingItem({
  post,
  onUpdateStatus,
  onDeleteListing,
  onSelectPost,
  onViewOffers,
}: PublishedListingItemProps) {
  const postId = post.id ?? post._id;
  const statusStyles =
    post.status === "live"
      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400"
      : post.status === "in_progress"
        ? "border-sky-500/30 bg-sky-500/10 text-sky-400"
        : post.status === "completed"
          ? "border-cyan-500/30 bg-cyan-500/10 text-cyan-400"
          : "theme-divider theme-text-muted border bg-(--app-surface-soft)";

  return (
    <article className="theme-card flex min-w-0 flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="theme-chip rounded-md px-2 py-1 text-[10px] font-semibold">
            {post.category}
          </span>
          <span className="theme-text-muted text-[11px]">
            {post.budget || "Negotiable"}
          </span>
          <span
            className={`rounded-sm border px-1.5 py-0.5 text-[9px] font-bold uppercase ${statusStyles}`}
          >
            {post.status.replace("_", " ")}
          </span>
        </div>
        <button
          type="button"
          onClick={() => onSelectPost(postId)}
          className="theme-text-primary mt-2 block max-w-full truncate text-left text-sm font-bold hover:text-[#FF3F3F]"
        >
          {post.title}
        </button>
        <p className="theme-text-secondary mt-1 line-clamp-2 wrap-anywhere text-xs">
          {post.description}
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={() => onViewOffers(post)}
          className="theme-divider theme-text-primary inline-flex items-center gap-1.5 rounded-md border px-2.5 py-2 text-xs font-semibold hover:border-[#FF3F3F]/40"
        >
          <Inbox className="h-3.5 w-3.5" /> Responses ({post.responsesCount})
        </button>
        {post.status === "live" && (
          <button
            type="button"
            onClick={() => onUpdateStatus(postId, "completed")}
            aria-label="Mark completed"
            title="Mark completed"
            className="theme-icon-muted rounded-md p-2 hover:bg-emerald-500/10 hover:text-emerald-500"
          >
            <CheckCircle2 className="h-4 w-4" />
          </button>
        )}
        {post.status === "live" && (
          <button
            type="button"
            onClick={() => onUpdateStatus(postId, "cancelled")}
            aria-label="Cancel requirement"
            title="Cancel requirement"
            className="theme-icon-muted rounded-md p-2 hover:bg-amber-500/10 hover:text-amber-500"
          >
            <AlertCircle className="h-4 w-4" />
          </button>
        )}
        {post.status !== "live" && post.status !== "cancelled" && (
          <button
            type="button"
            onClick={() => onUpdateStatus(postId, "live")}
            aria-label="Reopen requirement"
            title="Reopen requirement"
            className="theme-icon-muted rounded-md p-2 hover:bg-white/5"
          >
            <RefreshCw className="h-4 w-4" />
          </button>
        )}
        <button
          type="button"
          onClick={() => onDeleteListing(postId)}
          aria-label="Delete requirement"
          title="Delete requirement"
          className="theme-icon-muted rounded-md p-2 hover:bg-red-500/10 hover:text-red-500"
        >
          <Trash className="h-4 w-4" />
        </button>
      </div>
    </article>
  );
}

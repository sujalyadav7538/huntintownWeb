import { useEffect, useRef, useState } from "react";
import {
  CheckCircle2,
  MoreHorizontal,
  Search,
  Star,
  Trash2,
  Users,
} from "lucide-react";
import { getCategoryPresentation } from "@/src/shared/lib/postConstants";
import type { DashboardPost, PostStatus } from "../types";
import { StatusBadge } from "./RequirementUI";

interface RequirementCardProps {
  post: DashboardPost;
  onExplore: () => void;
  onUpdateStatus: (status: PostStatus) => Promise<void>;
  onDelete: () => Promise<void>;
  onRate?: () => void;
}

export default function RequirementCard({
  post,
  onExplore,
  onUpdateStatus,
  onDelete,
  onRate,
}: RequirementCardProps) {
  const [pending, setPending] = useState(false);
  const [actionError, setActionError] = useState("");
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);
  const [actionsOpen, setActionsOpen] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDetailsElement>(null);

  useEffect(() => {
    const element = descriptionRef.current;
    if (!element || descriptionExpanded) return;
    const measureOverflow = () =>
      setDescriptionOverflows(element.scrollHeight > element.clientHeight + 1);
    measureOverflow();
    const observer = new ResizeObserver(measureOverflow);
    observer.observe(element);
    return () => observer.disconnect();
  }, [descriptionExpanded, post.description]);

  useEffect(() => {
    if (!actionsOpen) return;
    const closeOnOutsideClick = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) {
        actionsRef.current?.removeAttribute("open");
        setActionsOpen(false);
      }
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        actionsRef.current?.removeAttribute("open");
        setActionsOpen(false);
      }
    };
    document.addEventListener("pointerdown", closeOnOutsideClick);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeOnOutsideClick);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [actionsOpen]);

  const runAction = async (action: () => Promise<void>) => {
    setPending(true);
    setActionError("");
    try {
      await action();
    } catch (cause) {
      setActionError(
        cause instanceof Error
          ? cause.message
          : "Could not update this requirement.",
      );
    } finally {
      setPending(false);
    }
  };

  const { label: categoryLabel, color: categoryAccent } =
    getCategoryPresentation(post.category);

  return (
    <article className="theme-card group relative min-w-0 overflow-hidden rounded-lg border p-4 shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-[#FF3F3F]/40 hover:shadow-md focus-within:border-[#FF3F3F]/40">
      <span
        aria-hidden="true"
        className="absolute inset-x-4 top-0 h-px opacity-60"
        style={{
          background: `linear-gradient(90deg, transparent, ${categoryAccent}, transparent)`,
        }}
      />
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex min-w-0 items-center gap-2">
            <h3 className="theme-text-primary min-w-0 flex-1 truncate whitespace-nowrap text-[14px] font-semibold leading-5">
              {post.title}
            </h3>
            <span className="shrink-0">
              <StatusBadge status={post.status} />
            </span>
          </div>
          <p
            ref={descriptionRef}
            className={`theme-text-secondary mt-2 wrap-anywhere text-[13px] leading-5 ${descriptionExpanded ? "" : "line-clamp-2"}`}
          >
            {post.description}
          </p>
          {(descriptionOverflows || descriptionExpanded) && (
            <button
              type="button"
              onClick={() => setDescriptionExpanded((expanded) => !expanded)}
              aria-expanded={descriptionExpanded}
              className="mt-1 text-[11px] font-semibold text-[#FF6B6B] hover:underline"
            >
              {descriptionExpanded ? "Show less" : "Know more"}
            </button>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onExplore}
            aria-label={`Explore ${post.title}`}
            title="Explore requirement"
            className="theme-divider theme-icon-muted flex h-8 w-8 list-none items-center justify-center rounded-md border transition hover:border-[#FF3F3F]/40 hover:bg-[#FF3F3F]/10 hover:text-[#FF3F3F] [&::-webkit-details-marker]:hidden"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
          <details
            ref={actionsRef}
            className="relative"
            onToggle={(event) => setActionsOpen(event.currentTarget.open)}
          >
            <summary
              aria-label={`Actions for ${post.title}`}
              className="theme-divider theme-icon-muted flex h-8 w-8 list-none items-center justify-center rounded-md border transition hover:bg-white/5 [&::-webkit-details-marker]:hidden"
            >
              <MoreHorizontal className="h-4 w-4" />
            </summary>
            <div className="theme-panel absolute right-0 top-9 z-10 w-40 rounded-md border p-1 shadow-lg">
              <button
                type="button"
                disabled={pending || post.status === "completed"}
                onClick={() => {
                  actionsRef.current?.removeAttribute("open");
                  setActionsOpen(false);
                  void runAction(() => onUpdateStatus("completed"));
                }}
                className="theme-text-primary theme-hover-soft inline-flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium disabled:opacity-50"
              >
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" /> Mark
                completed
              </button>
              {onRate && post.status === "completed" && (
                <button
                  type="button"
                  onClick={() => {
                    actionsRef.current?.removeAttribute("open");
                    setActionsOpen(false);
                    onRate();
                  }}
                  className="theme-text-primary theme-hover-soft inline-flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium"
                >
                  <Star className="h-3.5 w-3.5 text-amber-400" /> Rate helpers
                </button>
              )}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  actionsRef.current?.removeAttribute("open");
                  setActionsOpen(false);
                  if (window.confirm(`Delete “${post.title}”?`))
                    void runAction(onDelete);
                }}
                className="theme-text-primary inline-flex w-full items-center gap-2 rounded px-2.5 py-2 text-left text-xs font-medium hover:bg-red-500/10 hover:text-red-500 disabled:opacity-50"
              >
                <Trash2 className="h-3.5 w-3.5" /> Delete
              </button>
            </div>
          </details>
        </div>
      </div>
      <div className="theme-divider theme-text-muted mt-3 flex flex-wrap items-center gap-x-3 gap-y-2 border-t pt-2.5 text-[11px]">
        <span
          className="shrink-0 rounded-full border px-2 py-1 text-[8px] font-bold uppercase tracking-wider"
          style={{
            backgroundColor: `${categoryAccent}0d`,
            borderColor: `${categoryAccent}22`,
            color: categoryAccent,
          }}
        >
          {categoryLabel}
        </span>
        <span>{post.budget || "Negotiable"}</span>
        <span>{post.timeline || "Flexible"}</span>
        <span className="ml-auto inline-flex items-center gap-1">
          <Users className="h-3.5 w-3.5" />
          {post.responsesCount} {post.responsesCount === 1 ? "offer" : "offers"}
        </span>
      </div>
      {actionError && (
        <p role="alert" className="mt-2 text-[11px] text-red-400">
          {actionError}
        </p>
      )}
    </article>
  );
}

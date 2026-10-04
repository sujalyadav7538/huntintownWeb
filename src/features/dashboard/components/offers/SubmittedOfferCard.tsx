import { useEffect, useRef, useState } from "react";
import { MessageCircle, Search } from "lucide-react";
import { getCategoryPresentation } from "@/src/shared/lib/postConstants";
import type { SubmittedResponse } from "../types";
import { StatusBadge } from "../requirements/RequirementUI";

interface SubmittedOfferCardProps {
  item: SubmittedResponse;
  onExplore: () => void;
  onChat: () => void;
}

export default function SubmittedOfferCard({
  item,
  onExplore,
  onChat,
}: SubmittedOfferCardProps) {
  const post = item.postId;
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);
  const [descriptionOverflows, setDescriptionOverflows] = useState(false);
  const descriptionRef = useRef<HTMLParagraphElement>(null);
  const { label: categoryLabel, color: categoryAccent } =
    getCategoryPresentation(post.category);

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
            <StatusBadge status={post.status} />
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
          {item.status === "accepted" && item.conversationId && (
            <button
              type="button"
              onClick={onChat}
              aria-label={`Chat about ${post.title}`}
              title="Open chat"
              className="theme-divider flex h-8 w-8 items-center justify-center rounded-md border text-[#FF6B6B] hover:bg-[#FF3F3F]/10"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          )}
          <button
            type="button"
            onClick={onExplore}
            aria-label={`Explore ${post.title}`}
            title="Explore requirement"
            className="theme-divider theme-icon-muted flex h-8 w-8 list-none items-center justify-center rounded-md border transition hover:bg-white/5 [&::-webkit-details-marker]:hidden"
          >
            <Search className="h-3.5 w-3.5" />
          </button>
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
        <span>
          Your offer: <StatusBadge status={item.status} />
        </span>
      </div>
    </article>
  );
}

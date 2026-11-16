import { useEffect, useRef, useState } from "react";
import { MessageCircle } from "lucide-react";
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
      <button
        type="button"
        onClick={onExplore}
        aria-label={`View ${post.title}`}
        className="absolute inset-0 cursor-pointer rounded-lg focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[#FF3F3F]"
      />
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
              className="relative z-10 mt-1 text-[11px] font-semibold text-[#FF6B6B] hover:underline"
            >
              {descriptionExpanded ? "Show less" : "Know more"}
            </button>
          )}
        </div>
        <div className="relative z-10 flex shrink-0 items-center gap-1.5">
          {item.conversationId && (
            <button
              type="button"
              onClick={onChat}
              aria-label={`Chat about ${post.title}`}
              title="Open conversation"
              className="flex h-5 w-5 items-center justify-center bg-transparent text-[#FF6B6B] hover:text-[#FF3F3F] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#FF3F3F]"
            >
              <MessageCircle className="h-4 w-4" />
            </button>
          )}
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
        <span>{item.conversationId ? "Chat started" : "Offer submitted"}</span>
      </div>
    </article>
  );
}

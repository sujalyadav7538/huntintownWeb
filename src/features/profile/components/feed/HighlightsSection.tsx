import { useEffect, useRef, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  LoaderCircle,
  Plus,
  Sparkles,
  Trash2,
  X,
} from "lucide-react";
import type { Swiper as SwiperInstance } from "swiper";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import { apiFetch } from "@/src/shared/lib/api";
import { useAppDialog } from "@/src/shared/components/layout/AppDialogProvider";
import type { ShowcaseItem } from "@/src/shared/types";
import QuickFeedComposer from "./QuickFeedComposer";

interface HighlightsSectionProps {
  items?: ShowcaseItem[] | null;
  isOwner: boolean;
  compact?: boolean;
  onCreated: (item: ShowcaseItem) => void;
  onDeleted: (itemId: string) => void;
  onSelect: (item: ShowcaseItem) => void;
}

export default function HighlightsSection({
  items: itemsProp,
  isOwner,
  compact = false,
  onCreated,
  onDeleted,
  onSelect,
}: HighlightsSectionProps) {
  const items = itemsProp ?? [];
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [deleteError, setDeleteError] = useState("");
  const swiperRef = useRef<SwiperInstance | null>(null);
  const { showConfirm } = useAppDialog();

  useEffect(() => {
    if (!isComposerOpen) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsComposerOpen(false);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isComposerOpen]);

  const handleDelete = async (item: ShowcaseItem) => {
    const itemId = item.id ?? item._id;
    if (
      !itemId ||
      !(await showConfirm("Delete this highlight?", {
        title: "Delete highlight",
        confirmLabel: "Delete",
      }))
    ) return;

    setDeletingId(itemId);
    setDeleteError("");

    try {
      const response = await apiFetch(
        `/api/feed/${encodeURIComponent(itemId)}`,
        {
          method: "DELETE",
        },
      );
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload?.message || "Unable to delete this highlight.");
      }

      onDeleted(itemId);
    } catch (error) {
      setDeleteError(
        error instanceof Error
          ? error.message
          : "Unable to delete this highlight.",
      );
    } finally {
      setDeletingId(null);
    }
  };

  if (compact && items.length === 0) return null;

  return (
    <section className="overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#111113]">
      <header className="flex items-center justify-between gap-3 border-b border-[#1e1e22] px-4 py-3.5 sm:px-5">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-[#FF3F3F]" />
            <h2 className="text-sm font-semibold text-zinc-100">Highlights</h2>
          </div>
          <p className="mt-1 text-xs text-zinc-500">
            Quick moments and updates
          </p>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          {items.length > 1 && (
            <>
              <button
                type="button"
                onClick={() => swiperRef.current?.slidePrev()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/5"
                aria-label="Previous highlights"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => swiperRef.current?.slideNext()}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 text-zinc-300 transition hover:bg-white/5"
                aria-label="Next highlights"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </>
          )}
          {isOwner && (
            <button
              type="button"
              onClick={() => setIsComposerOpen(true)}
              className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#FF3F3F] px-3 py-2 text-xs font-semibold text-white transition hover:bg-[#ff4949]"
            >
              <Plus className="h-4 w-4" />
              Create highlight
            </button>
          )}
        </div>
      </header>

      <div className="p-3 sm:p-4">
        {items.length === 0 ? (
          <div className="rounded-lg border border-white/8 bg-white/2 px-4 py-10 text-center">
            <p className="text-sm font-medium text-zinc-400">
              {isOwner ? "No highlights yet" : "No highlights to show"}
            </p>
            {isOwner && (
              <p className="mt-1 text-xs text-zinc-600">
                Share a photo or a short update.
              </p>
            )}
          </div>
        ) : (
          <>
            {deleteError && (
              <p className="mb-3 text-xs text-rose-400" role="alert">
                {deleteError}
              </p>
            )}
            <Swiper
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1}
              spaceBetween={12}
              breakpoints={
                compact
                  ? {}
                  : {
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 4 },
                    }
              }
              watchOverflow
            >
              {items.map((item) => {
                const itemId = item.id ?? item._id;

                return (
                  <SwiperSlide key={itemId}>
                    <article className="group relative flex h-70 flex-col overflow-hidden rounded-lg border border-white/8 bg-[#151518] transition hover:border-white/16">
                      <button
                        type="button"
                        onClick={() => onSelect(item)}
                        className="block h-44 w-full shrink-0 bg-zinc-900 text-left"
                        aria-label="View highlight"
                      >
                        {item.coverImage ? (
                          <img
                            src={item.coverImage}
                            alt={item.title}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center bg-[#19191d] p-6">
                            <Sparkles className="h-6 w-6 text-zinc-600" />
                          </div>
                        )}
                      </button>
                      <div className="flex min-h-0 flex-1 flex-col justify-between px-3 py-2.5">
                        <h3 className="mb-1 truncate text-sm font-semibold text-zinc-100">
                          {item.title}
                        </h3>
                        <ClampedCaption
                          text={item.description || item.title}
                          onKnowMore={() => onSelect(item)}
                        />
                      </div>
                      {isOwner && (
                        <button
                          type="button"
                          onClick={() => void handleDelete(item)}
                          disabled={deletingId === itemId}
                          className="absolute right-2 top-2 z-10 flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-black/70 text-white transition hover:bg-rose-600 disabled:cursor-wait disabled:opacity-70"
                          aria-label="Delete highlight"
                          title="Delete highlight"
                        >
                          {deletingId === itemId ? (
                            <LoaderCircle className="h-4 w-4 animate-spin" />
                          ) : (
                            <Trash2 className="h-4 w-4" />
                          )}
                        </button>
                      )}
                    </article>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </>
        )}
      </div>

      {isComposerOpen && (
        <div
          className="fixed inset-0 z-500 flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setIsComposerOpen(false);
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="highlight-composer-title"
            className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-lg flex-col overflow-hidden rounded-xl border border-white/10 bg-[#111113] p-4 shadow-2xl"
          >
            <div className="mb-3 flex shrink-0 items-center justify-between">
              <h2
                id="highlight-composer-title"
                className="text-sm font-semibold text-zinc-100"
              >
                Create a highlight
              </h2>
              <button
                type="button"
                onClick={() => setIsComposerOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 transition hover:bg-white/6 hover:text-white"
                aria-label="Close create highlight dialog"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain">
              <QuickFeedComposer
                onCreated={(item) => {
                  onCreated(item);
                  setIsComposerOpen(false);
                }}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

interface ClampedCaptionProps {
  text: string;
  onKnowMore: () => void;
}

function ClampedCaption({ text, onKnowMore }: ClampedCaptionProps) {
  const captionRef = useRef<HTMLParagraphElement | null>(null);
  const [isTruncated, setIsTruncated] = useState(false);

  useEffect(() => {
    const element = captionRef.current;
    if (!element) return;

    const updateTruncation = () => {
      setIsTruncated(element.scrollHeight > element.clientHeight + 1);
    };

    updateTruncation();
    const observer = new ResizeObserver(updateTruncation);
    observer.observe(element);
    return () => observer.disconnect();
  }, [text]);

  return (
    <div className="min-h-0">
      <p
        ref={captionRef}
        className="line-clamp-2 whitespace-pre-wrap text-xs leading-5 text-zinc-300"
      >
        {text}
      </p>
      {isTruncated && (
        <button
          type="button"
          onClick={onKnowMore}
          className="mt-1 text-xs font-semibold text-[#ff7777] hover:text-white"
        >
          Know more
        </button>
      )}
    </div>
  );
}

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RefreshCw } from "lucide-react";
import { apiFetch } from "@/src/shared/lib/api";
import useDebounce from "@/src/shared/hooks/useDebounce";
import ExploreSearch from "@/src/features/explore/components/ExploreSearch";
import type { DashboardConversation, SubmittedResponse } from "../types";
import {
  EmptyState,
  ErrorState,
  LoadingState,
} from "../requirements/RequirementUI";
import SubmittedOfferCard from "./SubmittedOfferCard";
import SubmittedOfferModal from "./SubmittedOfferModal";

const PAGE_SIZE = 8;
const RESPONSE_FILTERS = [
  "all",
  "pending",
  "accepted",
  "rejected",
  // "completed",
  // "cancelled",
] as const;

interface SubmittedOffersProps {
  onDataChange: (responses: SubmittedResponse[]) => void;
  onInitiateChat: (postId: string, conversationId?: string) => void;
}

export default function SubmittedOffers({
  onDataChange,
  onInitiateChat,
}: SubmittedOffersProps) {
  const [items, setItems] = useState<SubmittedResponse[]>([]);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [filter, setFilter] =
    useState<(typeof RESPONSE_FILTERS)[number]>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<SubmittedResponse | null>(null);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search.trim(), 400);
  const sentinel = useRef<HTMLDivElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  const loadActivity = useCallback(async () => {
    abortRef.current?.abort();
    const controller = new AbortController();
    abortRef.current = controller;
    setLoading(true);
    setError("");
    try {
      const params = new URLSearchParams();
      if (debouncedSearch) params.set("q", debouncedSearch);
      if (filter !== "all") params.set("status", filter);
      const query = params.toString();
      const [activityResponse, chatsResponse] = await Promise.all([
        apiFetch(`/api/responses/my-activity${query ? `?${query}` : ""}`, {
          signal: controller.signal,
        }),
        apiFetch("/api/chat/my-chats", { signal: controller.signal }),
      ]);
      const body = await activityResponse.json();
      const chatsBody = await chatsResponse.json();
      if (!activityResponse.ok)
        throw new Error(
          body?.message || "Could not load your submitted offers.",
        );
      const chats: DashboardConversation[] = chatsResponse.ok
        ? (chatsBody.data ?? [])
        : [];
      const activity: SubmittedResponse[] = (body.data ?? [])
        .filter((item: SubmittedResponse) => item.postId)
        .map((item: SubmittedResponse) => ({
          ...item,
          conversationId: chats.find((chat) => chat.responseId === item._id)
            ?._id,
        }));
      setItems(activity);
      setVisibleCount(PAGE_SIZE);
      // Overview stats need the unfiltered list
      if (!debouncedSearch && filter === "all") onDataChange(activity);
    } catch (cause) {
      if (controller.signal.aborted) return;
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load your submitted offers.",
      );
    } finally {
      if (abortRef.current === controller) setLoading(false);
    }
  }, [debouncedSearch, filter, onDataChange]);

  useEffect(() => {
    void loadActivity();
    return () => abortRef.current?.abort();
  }, [loadActivity]);

  const uniqueItems = useMemo(() => {
    const byPost = new Map<string, SubmittedResponse>();
    items.forEach((item) => {
      if (item.postId?._id) byPost.set(item.postId._id, item);
    });
    return Array.from(byPost.values());
  }, [items]);

  const filteredItems = uniqueItems;

  // Opened from a "rate the owner back" notification link.
  const [searchParams, setSearchParams] = useSearchParams();
  const ratePostId = searchParams.get("ratePost");
  useEffect(() => {
    if (!ratePostId || loading) return;
    const match = items.find((item) => item.postId?._id === ratePostId);
    if (match) setSelected(match);
    const next = new URLSearchParams(searchParams);
    next.delete("ratePost");
    setSearchParams(next, { replace: true });
  }, [ratePostId, loading, items, searchParams, setSearchParams]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [uniqueItems.length]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || visibleCount >= filteredItems.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, filteredItems.length),
          );
      },
      { rootMargin: "180px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredItems.length, visibleCount]);

  return (
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF3F3F]">
            Your responses
          </p>
          <h2 className="theme-text-primary mt-1 font-display text-lg font-bold">
            My submitted offers
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void loadActivity()}
          disabled={loading}
          aria-label="Refresh submitted offers"
          className="theme-icon-muted theme-hover-soft flex h-8 w-8 items-center justify-center rounded-md transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div className="mb-3">
        <ExploreSearch
          searchTerm={search}
          setSearchTerm={setSearch}
          placeholder="Search your submitted offers..."
        />
      </div>

      <div
        className="theme-divider mb-3 flex gap-1 overflow-x-auto border-b pb-2 scrollbar-hide"
        aria-label="Filter submitted offers"
      >
        {RESPONSE_FILTERS.map((value) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`shrink-0 border-b-2 px-2.5 py-1.5 text-[11px] font-semibold capitalize transition ${filter === value ? "border-[#FF3F3F] theme-text-primary" : "theme-text-muted border-transparent hover:text-[#FF3F3F]"}`}
          >
            {value === "all" ? "All" : value}
          </button>
        ))}
      </div>

      <div className="md:h-[68vh] md:min-h-[420px] md:max-h-[680px] md:overflow-y-auto md:overscroll-contain md:pr-1 md:scrollbar-default">
        {loading && items.length === 0 ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} retry={() => void loadActivity()} />
        ) : filteredItems.length === 0 ? (
          <EmptyState
            text={
              debouncedSearch
                ? `No submitted offers match "${debouncedSearch}".`
                : filter === "all"
                  ? "Your responses to requirements will appear here."
                  : "No submitted offers have this response status."
            }
          />
        ) : (
          <div className="min-w-0 space-y-2">
            {filteredItems.slice(0, visibleCount).map((item) => (
              <SubmittedOfferCard
                key={item.postId._id}
                item={item}
                onExplore={() => setSelected(item)}
                onChat={() =>
                  onInitiateChat(item.postId._id, item.conversationId)
                }
              />
            ))}
            <div ref={sentinel} aria-hidden="true" className="h-1" />
          </div>
        )}
      </div>
      {loading && items.length > 0 && (
        <p className="theme-text-muted py-2 text-center text-xs">
          Refreshing offers…
        </p>
      )}
      {selected && (
        <SubmittedOfferModal
          item={selected}
          onClose={() => setSelected(null)}
          onChat={() => {
            setSelected(null);
            onInitiateChat(selected.postId._id, selected.conversationId);
          }}
        />
      )}
    </section>
  );
}

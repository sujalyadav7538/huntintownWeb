import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { RefreshCw } from "lucide-react";
import { apiFetch } from "@/src/shared/lib/api";
import type { DashboardPost, PostStatus } from "../types";
import ReceivedOffersModal from "./ReceivedOffersModal";
import RequirementCard from "./RequirementCard";
import { EmptyState, ErrorState, LoadingState } from "./RequirementUI";

const PAGE_SIZE = 8;
const FILTERS: { value: "all" | PostStatus; label: string }[] = [
  { value: "all", label: "All" },
  { value: "live", label: "Live" },
  { value: "in_progress", label: "In progress" },
  { value: "completed", label: "Completed" },
  { value: "expired", label: "Expired" },
  { value: "cancelled", label: "Cancelled" },
];

interface PublishedRequirementsProps {
  onDataChange: (posts: DashboardPost[]) => void;
  onInitiateChat: (postId: string, conversationId?: string) => void;
  onChanged: () => void;
  onUpdateStatus: (postId: string, status: PostStatus) => void | Promise<void>;
  onDeleteListing: (postId: string) => void | Promise<void>;
}

export default function PublishedRequirements({
  onDataChange,
  onInitiateChat,
  onChanged,
  onUpdateStatus,
  onDeleteListing,
}: PublishedRequirementsProps) {
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [filter, setFilter] =
    useState<(typeof FILTERS)[number]["value"]>("all");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPost, setSelectedPost] = useState<DashboardPost | null>(null);
  const sentinel = useRef<HTMLDivElement>(null);
  const requestInFlight = useRef(false);

  const loadPosts = useCallback(async () => {
    if (requestInFlight.current) return;
    requestInFlight.current = true;
    setLoading(true);
    setError("");
    try {
      const response = await apiFetch("/api/responses/received");
      const body = await response.json();
      if (!response.ok)
        throw new Error(body?.message || "Could not load your requirements.");
      const data: DashboardPost[] = body.data ?? [];
      setPosts(data);
      setVisibleCount(PAGE_SIZE);
      onDataChange(data);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not load your requirements.",
      );
    } finally {
      setLoading(false);
      requestInFlight.current = false;
    }
  }, [onDataChange]);

  useEffect(() => {
    void loadPosts();
  }, [loadPosts]);

  const filteredPosts = useMemo(
    () =>
      filter === "all" ? posts : posts.filter((post) => post.status === filter),
    [filter, posts],
  );
  const refreshRequirements = useCallback(async () => {
    await loadPosts();
    onChanged();
  }, [loadPosts, onChanged]);

  useEffect(() => {
    setVisibleCount(PAGE_SIZE);
  }, [filter]);

  useEffect(() => {
    const target = sentinel.current;
    if (!target || visibleCount >= filteredPosts.length) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting)
          setVisibleCount((count) =>
            Math.min(count + PAGE_SIZE, filteredPosts.length),
          );
      },
      { rootMargin: "180px" },
    );
    observer.observe(target);
    return () => observer.disconnect();
  }, [filteredPosts.length, visibleCount]);

  return (
    <section className="min-w-0">
      <div className="mb-3 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#FF3F3F]">
            Your listings
          </p>
          <h2 className="theme-text-primary mt-1 font-display text-lg font-bold">
            My published requirements
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void loadPosts()}
          disabled={loading}
          aria-label="Refresh published requirements"
          className="theme-icon-muted theme-hover-soft flex h-8 w-8 items-center justify-center rounded-md transition disabled:opacity-50"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      <div
        className="theme-divider mb-3 flex gap-1 overflow-x-auto border-b pb-2 scrollbar-hide"
        aria-label="Filter requirements"
      >
        {FILTERS.map(({ value, label }) => (
          <button
            key={value}
            type="button"
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
            className={`shrink-0 border-b-2 px-2.5 py-1.5 text-[11px] font-semibold transition ${filter === value ? "border-[#FF3F3F] theme-text-primary" : "theme-text-muted border-transparent hover:text-[#FF3F3F]"}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="md:h-[68vh] md:min-h-[420px] md:max-h-[680px] md:overflow-y-auto md:overscroll-contain md:pr-1 md:scrollbar-default">
        {loading && posts.length === 0 ? (
          <LoadingState />
        ) : error ? (
          <ErrorState message={error} retry={() => void loadPosts()} />
        ) : filteredPosts.length === 0 ? (
          <EmptyState
            text={
              filter === "all"
                ? "You haven’t published a requirement yet."
                : `No ${FILTERS.find((item) => item.value === filter)?.label.toLowerCase()} requirements.`
            }
          />
        ) : (
          <div className="min-w-0 space-y-2">
            {filteredPosts.slice(0, visibleCount).map((post) => (
              <RequirementCard
                key={post._id}
                post={post}
                onExplore={() => setSelectedPost(post)}
                onUpdateStatus={async (status) => {
                  await onUpdateStatus(post._id, status);
                  await refreshRequirements();
                }}
                onDelete={async () => {
                  await onDeleteListing(post._id);
                  await refreshRequirements();
                }}
              />
            ))}
            <div ref={sentinel} aria-hidden="true" className="h-1" />
          </div>
        )}
      </div>

      {loading && posts.length > 0 && (
        <p className="theme-text-muted py-2 text-center text-xs">
          Refreshing requirements…
        </p>
      )}
      {selectedPost && (
        <ReceivedOffersModal
          post={selectedPost}
          onClose={() => setSelectedPost(null)}
          onInitiateChat={onInitiateChat}
          onChanged={refreshRequirements}
        />
      )}
    </section>
  );
}

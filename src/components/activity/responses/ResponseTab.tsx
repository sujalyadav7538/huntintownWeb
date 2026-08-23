import { ComponentType, useEffect, useMemo, useState } from "react";
import { AlertCircle, Inbox, RefreshCw } from "lucide-react";

import { apiFetch } from "../../../lib/api";
import { Response, Post } from "@/src/types";
import ResponsePostDetail from "./ResponsePostDetail";
import PostGridCard from "../../explore/PostGridCard";

interface ResponsesTabProps {
  onInitiateChat: () => void;
  currentUserId: string;
  hideTabs: (value: boolean) => void;
}

interface ResponsePagination {
  page: number;
  limit: number;
  count: number;
  total: number;
  hasMore: boolean;
}

interface ResponsesResponse {
  success: boolean;
  data: {
    post: Post;
    responses: Response[];
    pagination: ResponsePagination;
  };
}

export default function ResponsesTab({
  onInitiateChat,
  currentUserId,
  hideTabs,
}: ResponsesTabProps) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filter, setFilter] = useState("all");

  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedResponses, setSelectedResponses] = useState<Response[]>([]);

  const [responsesLoading, setResponsesLoading] = useState(false);
  const [responsesError, setResponsesError] = useState<string | null>(null);

  const [pagination, setPagination] = useState<ResponsePagination | null>(null);

  /*
   * Fetch only user's posts.
   *
   * This endpoint should NOT fetch responses.
   */
  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/responses/received");

      if (!res.ok) {
        throw new Error("Failed to load posts");
      }

      const data = await res.json();

      setPosts(data.data || []);
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  /*
   * Fetch responses only when a specific post is opened.
   *
   * First request gets only 20 responses.
   */
  const fetchResponses = async (post: Post) => {
    setResponsesLoading(true);
    setResponsesError(null);

    try {
      const res = await apiFetch(
        `/api/posts/${post._id}/responses?page=1&limit=20`,
      );

      if (!res.ok) {
        throw new Error("Failed to load responses");
      }

      const data: ResponsesResponse = await res.json();

      setSelectedResponses(data.data.responses || []);
      setPagination(data.data.pagination || null);

      /*
       * Update the post information returned by backend.
       * This is useful if responsesCount/status changed.
       */
      if (data.data.post) {
        setSelectedPost(data.data.post);
      }
    } catch (error: any) {
      setResponsesError(error.message || "Failed to load responses");
    } finally {
      setResponsesLoading(false);
    }
  };

  /*
   * Open a post and then fetch its responses.
   */
  const handleSelectPost = async (post: Post) => {
    setSelectedPost(post);
    setSelectedResponses([]);
    setPagination(null);
    setResponsesError(null);

    hideTabs(false);

    await fetchResponses(post);
  };

  /*
   * Go back from response detail to post list.
   */
  const handleBack = () => {
    setSelectedPost(null);
    setSelectedResponses([]);
    setPagination(null);
    setResponsesError(null);

    hideTabs(true);
  };

  /*
   * Filter posts locally.
   *
   * We don't need responses to perform this filter.
   */
  const filteredPosts = useMemo(() => {
    if (filter === "all") {
      return posts;
    }

    return posts.filter((post) => post.status === filter);
  }, [posts, filter]);

  /*
   * If a post is selected, show its responses.
   */
  if (selectedPost) {
    return (
      <ResponsePostDetail
        post={selectedPost}
        responses={selectedResponses}
        pagination={pagination}
        loading={responsesLoading}
        error={responsesError}
        onBack={handleBack}
        onInitiateChat={onInitiateChat}
        currentUserId={currentUserId}
      />
    );
  }

  return (
    <div className="theme-page-shell space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <StatusFilters value={filter} onChange={setFilter} />

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          aria-label="Refresh posts"
          className="
            flex h-8 w-8 shrink-0
            items-center justify-center
            rounded-full
            text-zinc-600
            transition
            hover:bg-zinc-900
            hover:text-zinc-300
            disabled:opacity-40
          "
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>

      {/* Loading */}
      {loading ? (
        <ResponseGridSkeleton />
      ) : error ? (
        <div className="flex min-h-80 flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>

          <p className="text-sm font-semibold text-zinc-300">
            Couldn't load posts
          </p>

          <p className="mt-1.5 max-w-xs text-[11px] leading-relaxed text-zinc-600">
            {error}
          </p>

          <button
            onClick={fetchData}
            className="
              mt-4
              rounded-full
              bg-[#FF3F3F]
              px-4 py-2
              text-[10px]
              font-bold
              text-white
              transition
              hover:bg-[#e53535]
            "
          >
            Try again
          </button>
        </div>
      ) : filteredPosts.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filter === "all" ? "No posts yet" : `No ${filter} posts`}
          desc={
            filter === "all"
              ? "Once people respond to your requirements, their responses will appear here."
              : `None of your posts are currently ${filter}.`
          }
        />
      ) : (
        <div
          className="
            grid
            grid-cols-1
            gap-x-3
            gap-y-2
            sm:grid-cols-3
            lg:grid-cols-4
            lg:gap-y-4
          "
        >
          {filteredPosts.map((post) => (
            <PostGridCard
              key={post._id}
              post={post}
              onSelect={() => handleSelectPost(post)}
            
            />
          ))}
        </div>
      )}
    </div>
  );
}

function StatusFilters({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const filters = [
    { id: "all", label: "All" },
    { id: "live", label: "Live" },
    { id: "in_progress", label: "In Progress" },
    { id: "completed", label: "Completed" },
  ];

  return (
    <div className="theme-filter-bar theme-divider flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border p-1">
      {filters.map((item) => {
        const active = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              whitespace-nowrap rounded-lg  px-2.5 py-1.5
              text-[10px] font-semibold transition
              ${
                active
                  ? "theme-chip-active"
                  : "theme-chip"
              }
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function ResponseGridSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
      {[1, 2, 3, 4, 5, 6].map((item) => (
        <div
          key={item}
          className="overflow-hidden rounded-2xl border border-zinc-800/60 bg-[#0e0e10]"
        >
          <div className="h-36 animate-pulse bg-zinc-900" />

          <div className="space-y-3 p-3">
            <div className="h-3 w-20 animate-pulse rounded bg-zinc-800" />
            <div className="h-4 w-3/4 animate-pulse rounded bg-zinc-800" />
            <div className="h-3 w-full animate-pulse rounded bg-zinc-900" />
          </div>
        </div>
      ))}
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  desc,
  action,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  desc: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 py-20 text-center">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-[#1e1e22] bg-[#0e0e10]">
        <Icon className="h-6 w-6 text-zinc-700" />
      </div>

      <div>
        <p className="text-[15px] font-bold text-zinc-300">{title}</p>

        <p className="mt-1 max-w-xs text-[12px] text-zinc-600">{desc}</p>
      </div>

      {action}
    </div>
  );
}

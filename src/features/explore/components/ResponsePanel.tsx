import { Post, User } from "@/src/shared/types";
import { isPostExpired } from "@/src/shared/utils";
import { Filter, MessageSquare, RefreshCw, Users } from "lucide-react";
import ResponseItem from "@/src/features/explore/components/ResponseItem";
import { useEffect, useState } from "react";
import { apiFetchJSON } from "@/src/shared/lib/api";

type ResponseFilter = "trust" | "earliest" | "latest";

interface ResponseData {
  id: string;
  postId: string;
  respondedBy: User;
  message: string;
  answers: {
    question: string;
    answer: string;
  }[];
  status: string;
  acceptedAt?: string;
  completedAt?: string;
  cancelledAt?: string;
  createdAt: string;
  updatedAt: string;
  trustScore?: number;
}

interface ResponsesPanelProps {
  post: Post;
  hasApplied?: boolean;
  onViewProfile?: (author: User) => void;
  onApply?: () => void;
}

export default function ResponsesPanel({
  post,
  hasApplied = false,
  onViewProfile,
  onApply,
}: ResponsesPanelProps) {
  const expired = isPostExpired(post.expiresAt);

  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [filter, setFilter] = useState<ResponseFilter>("trust");
  const [loading, setLoading] = useState(false);
  const [responsesError, setResponsesError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  const postId = post.id ?? post._id;

  useEffect(() => {
    if (!postId) {
      setResponses([]);
      return;
    }

    let cancelled = false;

    const fetchResponses = async () => {
      try {
        setLoading(true);
        setResponsesError("");

        const params = new URLSearchParams({
          sort: filter,
          limit: "50",
        });

        const data = await apiFetchJSON<{ responses?: ResponseData[] }>(
          `/api/responses/post/${postId}?${params.toString()}`,
        );

        if (!cancelled) setResponses(data?.responses ?? []);
      } catch (error) {
        if (!cancelled) {
          setResponsesError(
            error instanceof Error
              ? error.message
              : "Could not load responses. Please try again.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchResponses();

    return () => {
      cancelled = true;
    };
  }, [postId, filter, retryCount]);

  return (
    <aside className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-sm font-semibold text-zinc-200">Responses</h2>

            <span className="text-[10px] font-medium text-zinc-600">
              {responses.length}
            </span>
          </div>

          <Users className="h-3.5 w-3.5 text-zinc-700" />
        </div>

        <p className="mt-1 text-[10px] text-zinc-600">
          People interested in helping
        </p>

        {/* Filter */}
        <div className="mt-4 flex items-center gap-2">
          <Filter className="h-3 w-3 shrink-0 text-zinc-700" />

          <div className="flex min-w-0 gap-1 overflow-x-auto scrollbar-hide">
            <FilterButton
              active={filter === "trust"}
              onClick={() => setFilter("trust")}
            >
              Top Trust
            </FilterButton>

            <FilterButton
              active={filter === "latest"}
              onClick={() => setFilter("latest")}
            >
              Newest
            </FilterButton>

            <FilterButton
              active={filter === "earliest"}
              onClick={() => setFilter("earliest")}
            >
              Oldest
            </FilterButton>
          </div>
        </div>

        <div className="mt-4 h-px bg-white/[0.07]" />
      </div>

      {/* Responses */}
      <div className="min-h-0 flex-1 overflow-y-auto py-3 pr-1 scrollbar-hide">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="animate-pulse border-b border-white/[0.05] pb-3"
              >
                <div className="h-9 w-9 rounded-full bg-white/[0.04]" />

                <div className="mt-2 h-2.5 w-28 rounded bg-white/[0.04]" />

                <div className="mt-2 h-2 w-full rounded bg-white/[0.03]" />
                <div className="mt-1 h-2 w-3/4 rounded bg-white/[0.03]" />
              </div>
            ))}
          </div>
        ) : responsesError ? (
          <div
            role="alert"
            className="flex h-full min-h-[220px] flex-col items-center justify-center px-4 text-center"
          >
            <p className="text-xs font-semibold text-zinc-300">
              Responses couldn&apos;t be loaded
            </p>
            <p className="mt-1 text-[10px] leading-relaxed text-zinc-500">
              {responsesError}
            </p>
            <button
              type="button"
              onClick={() => setRetryCount((count) => count + 1)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-lg border border-white/10 px-3 py-1.5 text-[10px] font-semibold text-zinc-300 transition hover:border-[#FF3F3F]/40 hover:text-white"
            >
              <RefreshCw className="h-3 w-3" />
              Retry
            </button>
          </div>
        ) : responses.length === 0 ? (
          <div className="flex h-full min-h-[220px] items-center justify-center px-4 text-center">
            <div>
              <MessageSquare className="mx-auto h-5 w-5 text-zinc-700" />

              <p className="mt-3 text-xs font-semibold text-zinc-400">
                No responses yet
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-zinc-600">
                Be the first person to offer help.
              </p>
            </div>
          </div>
        ) : (
          <div>
            {responses.map((response) => (
              <ResponseItem
                key={response.id}
                response={response}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="shrink-0 border-t border-white/[0.07] pt-3">
        <button
          type="button"
          onClick={onApply}
          disabled={expired || hasApplied}
          className="h-10 w-full cursor-pointer rounded-full theme-btn-accent text-[11px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {hasApplied
            ? "Applied"
            : expired
              ? "Requirement Expired"
              : "Apply for Requirement"}
        </button>
      </div>
    </aside>
  );
}

interface FilterButtonProps {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function FilterButton({ active, onClick, children }: FilterButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`shrink-0 rounded-md px-2 py-1 text-[9px] font-medium transition ${
        active
          ? "bg-white/[0.07] text-zinc-200"
          : "text-zinc-600 hover:bg-white/[0.03] hover:text-zinc-400"
      }`}
    >
      {children}
    </button>
  );
}

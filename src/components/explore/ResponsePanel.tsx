import { Post, User } from "@/src/types";
import { isPostExpired } from "@/src/utils";
import { Filter, MessageSquare, Users } from "lucide-react";
import ResponseItem from "./ResponseItem";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/src/store/hooks";

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
  onViewProfile?: (author: User) => void;
  onApply?: () => void;
}

export default function ResponsesPanel({
  post,
  onViewProfile,
  onApply,
}: ResponsesPanelProps) {
  const expired = isPostExpired(post.expiresAt);

  const [responses, setResponses] = useState<ResponseData[]>([]);
  const [filter, setFilter] = useState<ResponseFilter>("trust");
  const [loading, setLoading] = useState(false);

  const { token } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (!post.id || !token) {
      setResponses([]);
      return;
    }

    const fetchResponses = async () => {
      try {
        setLoading(true);

        const params = new URLSearchParams({
          sort: filter,
          limit: "50",
        });

        const response = await fetch(
          `/api/responses/post/${post.id}?${params.toString()}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `${token}`,
            },
          },
        );

        if (!response.ok) {
          throw new Error("Failed to fetch responses");
        }

        const data = await response.json();

        setResponses(data?.responses ?? []);
      } catch (error) {
        console.error("Error fetching responses:", error);
        setResponses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [post.id, token, filter]);

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
          disabled={expired}
          className="h-10 w-full cursor-pointer rounded-full theme-btn-accent text-[11px] font-bold transition active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {expired ? "Requirement Expired" : "Apply for Requirement"}
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

import { Post, User } from "@/src/types";
import { isPostExpired } from "@/src/utils";
import { Filter, MessageSquare, Users } from "lucide-react";
import ResponseItem from "./ResponseItem";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/src/store/hooks";

type ResponseFilter = "trust" | "earliest" | "latest";

interface ResponseData {
  _id: string;
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
    if (!post._id || !token) {
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
          `/api/responses/post/${post._id}?${params.toString()}`,
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
  }, [post._id, token, filter]);

  return (
    <aside className="flex h-full min-h-0 flex-col">
      {/* Header */}
      <div className="shrink-0 border-b border-white/[0.07] pb-3">
        <div className="flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-200">
              Responses
            </h2>

            <p className="mt-1 text-[10px] text-zinc-600">
              People interested in helping
            </p>
          </div>

          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/[0.06] px-2.5 py-1 text-[10px] font-semibold text-zinc-500">
            <Users className="h-3 w-3" />
            {responses.length}
          </span>
        </div>

        {/* Filter */}
        <div className="mt-3 flex items-center gap-2">
          <Filter className="h-3 w-3 shrink-0 text-zinc-600" />

          <div className="flex min-w-0 flex-1 gap-1 overflow-x-auto scrollbar-hide ">
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
      </div>

      {/* Scrollable response list */}
      <div className="min-h-0 flex-1 overflow-y-auto py-2.5 pr-1 scrollbar-hide">
        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                className="h-20 animate-pulse rounded-xl border border-white/[0.04] bg-white/[0.02]"
              />
            ))}
          </div>
        ) : responses.length === 0 ? (
          <div className="flex h-full min-h-[250px] items-center justify-center px-6 text-center">
            <div>
              <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.07] bg-white/[0.02]">
                <MessageSquare className="h-4 w-4 text-zinc-700" />
              </div>

              <p className="mt-3 text-xs font-semibold text-zinc-400">
                No responses yet
              </p>

              <p className="mt-1 text-[10px] leading-relaxed text-zinc-700">
                Be the first person to offer help.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-2">
            {responses.map((response) => (
              <ResponseItem
                key={response._id}
                response={response}
                onViewProfile={onViewProfile}
              />
            ))}
          </div>
        )}
      </div>

      {/* Fixed footer */}
      <div className="shrink-0 border-t border-white/[0.07] pt-3">
        <button
          type="button"
          onClick={onApply}
          disabled={expired}
          className="h-11 w-full cursor-pointer rounded-full theme-btn-accent text-xs font-bold  transition  active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-40"
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
      className={`shrink-0 rounded-full border px-2.5 py-1 text-[9px] font-medium cursor-pointer transition ${active ? "border-white/12 bg-white/8 text-zinc-200" : "border-transparent text-zinc-600 hover:bg-white/4 hover:text-zinc-400"}`}
    >
      {children}
    </button>
  );
}

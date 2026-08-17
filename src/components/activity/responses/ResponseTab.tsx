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

type PostWithResponses = Post & { responses: Response[] };

export default function ResponsesTab({
  onInitiateChat,
  currentUserId,
  hideTabs,
}: ResponsesTabProps) {
  const [items, setItems] = useState<PostWithResponses[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<PostWithResponses | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/responses/received");

      if (!res.ok) {
        throw new Error("Failed to load responses");
      }

      const data = await res.json();
      setItems(
        (data.data || []).map(
          ({ post, responses }: { post: Post; responses: Response[] }) => ({
            ...post,
            responses,
          }),
        ),
      );
    } catch (error: any) {
      setError(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredItems = useMemo(() => {
    if (filter === "all") return items;

    return items.filter((item) => item?.status === filter);
  }, [items, filter]);

  if (selected) {
    return (
      <ResponsePostDetail
        post={selected}
        onBack={() => (setSelected(null), hideTabs(true))}
        onInitiateChat={onInitiateChat}
        currentUserId={currentUserId}
      />
    );
  }

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <StatusFilters value={filter} onChange={setFilter} />

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          aria-label="Refresh responses"
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

      {/* Content */}
      {loading ? (
        <ResponseGridSkeleton />
      ) : error ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>

          <p className="text-sm font-semibold text-zinc-300">
            Couldn't load responses
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
      ) : filteredItems.length === 0 ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-zinc-900">
            <Inbox className="h-5 w-5 text-zinc-600" />
          </div>

          <p className="text-sm font-semibold text-zinc-300">
            {filter === "all" ? "No responses yet" : `No ${filter} posts`}
          </p>

          <p className="mt-1.5 max-w-xs text-[11px] leading-relaxed text-zinc-600">
            {filter === "all"
              ? "Once people respond to your requirements, their offers will appear here."
              : `None of your posts are currently ${filter}.`}
          </p>
        </div>
      ) : (
        <div
          className="
          grid
          grid-cols-2
          gap-x-3
          gap-y-6
          sm:grid-cols-3
          lg:grid-cols-4
        "
        >
          {filteredItems.map((item) => {
            const pendingCount = item.responses.filter(
              (offer) => offer.status === "pending",
            ).length;

            const acceptedCount = item.responses.filter(
              (offer) => offer.status === "accepted",
            ).length;

            return (
              <PostGridCard
                key={item._id}
                post={item}
                onSelect={() => {
                  setSelected(item);
                  hideTabs(false);
                }}
                badge={
                  pendingCount > 0 ? (
                    <span
                      className="
                      inline-flex
                      items-center
                      gap-1
                      rounded-full
                      bg-[#FF3F3F]
                      px-2 py-1
                      text-[9px]
                      font-bold
                      text-white
                    "
                    >
                      <span className="h-1 w-1 rounded-full bg-white" />
                      {pendingCount} new
                    </span>
                  ) : undefined
                }
                meta={
                  <div className="flex items-center gap-2 text-[10px]">
                    <span className="text-zinc-500">
                      {item.responses.length}{" "}
                      {item.responses.length === 1 ? "offer" : "offers"}
                    </span>

                    {acceptedCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />

                        <span className="font-medium text-emerald-500">
                          {acceptedCount} accepted
                        </span>
                      </>
                    )}

                    {pendingCount > 0 && (
                      <>
                        <span className="h-1 w-1 rounded-full bg-zinc-700" />

                        <span className="font-medium text-[#FF3F3F]">
                          {pendingCount} awaiting
                        </span>
                      </>
                    )}
                  </div>
                }
              />
            );
          })}
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
    <div className="flex max-w-full items-center gap-1 overflow-x-auto rounded-xl border border-zinc-800/70 bg-[#0c0c0f] p-1">
      {filters.map((item) => {
        const active = value === item.id;

        return (
          <button
            key={item.id}
            type="button"
            onClick={() => onChange(item.id)}
            className={`
              whitespace-nowrap rounded-lg px-2.5 py-1.5
              text-[10px] font-semibold transition
              ${
                active
                  ? "bg-zinc-800 text-white"
                  : "text-zinc-600 hover:text-zinc-300"
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
    <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
      <div className="w-14 h-14 rounded-2xl bg-[#0e0e10] border border-[#1e1e22] flex items-center justify-center">
        <Icon className="w-6 h-6 text-zinc-700" />
      </div>
      <div>
        <p className="text-[15px] font-bold text-zinc-300">{title}</p>
        <p className="text-[12px] text-zinc-600 mt-1 max-w-xs">{desc}</p>
      </div>
      {action}
    </div>
  );
}

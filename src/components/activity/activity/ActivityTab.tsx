import { apiFetch } from "@/src/lib/api";
import { Activity, AlertCircle, RefreshCw } from "lucide-react";
import { ComponentType, useEffect, useState } from "react";
import { ActivityResponse } from "@/src/types";
import ActivityOfferDetail from "./ActivityOfferDetail";
import ActivityOfferCard from "./ActivityOfferCard";

interface ActivityTabProps {
  onInitiateChat: () => void;
  hideTabs: (value: boolean) => void;
}
export default function ActivityTab({
  onInitiateChat,
  hideTabs,
}: ActivityTabProps) {
  const [items, setItems] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [selected, setSelected] = useState<ActivityResponse | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const res = await apiFetch("/api/responses/my-activity");

      if (!res.ok) {
        throw new Error("Failed to load activity");
      }

      const data = await res.json();
      setItems(data?.data || []);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (selected) {
    return (
      <ActivityOfferDetail
        offer={selected}
        onBack={() => {
          (setSelected(null), hideTabs(true));
        }}
        onInitiateChat={onInitiateChat}
      />
    );
  }

  const filteredItems =
    filter === "all" ? items : items.filter((item) => item.status === filter);

  const handleReview = (offer: ActivityResponse) => {
    // open review modal
  };

  return (
    <div className="space-y-5">
      {/* Toolbar */}
      <div className="flex items-center justify-between gap-3">
        <StatusFilters value={filter} onChange={setFilter} />

        <button
          type="button"
          onClick={fetchData}
          disabled={loading}
          aria-label="Refresh activity"
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
        <ActivitySkeleton />
      ) : error ? (
        <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
          <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-red-500/10">
            <AlertCircle className="h-5 w-5 text-red-400" />
          </div>

          <p className="text-sm font-semibold text-zinc-300">
            Couldn't load activity
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
        <EmptyState
          icon={Activity}
          title={filter === "all" ? "No posts yet" : `No ${filter} posts`}
          desc={
            filter === "all"
              ? "Once people respond to your requirements, their responses will appear here."
              : `None of your posts are currently ${filter}.`
          }
        />
      ) : (
        <div className="grid gap-2 grid-cols-1 lg:grid-cols-2">
          {filteredItems.map((item) => (
            <ActivityOfferCard
              key={item._id}
              offer={item}
              hasReviewed={item.hasReviewedOwner}
              onOpenConversation={() => onInitiateChat(item)}
              onReview={() => handleReview(item)}
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
    { id: "pending", label: "Awaiting" },
    { id: "accepted", label: "Accepted" },
    { id: "rejected", label: "Rejected" },
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
              ${active ? "theme-chip-active" : "theme-chip"}
            `}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}

function ActivitySkeleton() {
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

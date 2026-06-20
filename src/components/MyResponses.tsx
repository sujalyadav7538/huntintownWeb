import { useEffect, useState, useCallback } from "react";
import {
  Loader2,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Clock,
  MapPin,
  IndianRupee,
  ChevronDown,
  ChevronUp,
  CalendarDays,
  Inbox,
  Tag,
  HelpCircle,
  RefreshCw,
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ResponsePost {
  _id: string;
  title: string;
  description: string;
  category: string;
  location: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  offersCount: number;
  questions?: string[];
  createdAt: string;
  contactMethods?: { whatsApp?: boolean; phone?: boolean; chat?: boolean };
}

interface OfferApplicant {
  id: string;
  name: string;
  avatar: string | null;
  email?: string;
}

interface Offer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  offeredBy: OfferApplicant;
}

interface ResponseItem {
  post: ResponsePost;
  offers: Offer[];
}

// ── Status cfg ────────────────────────────────────────────────────────────────

const OFFER_STATUS = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    pill: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
    bar: "bg-emerald-500",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    pill: "bg-red-950/60 text-red-400 border-red-800/50",
    bar: "bg-red-500",
  },
  pending: {
    label: "Pending",
    icon: Clock,
    pill: "bg-zinc-900 text-zinc-400 border-zinc-700",
    bar: "bg-zinc-700",
  },
} as const;

// ── Skeleton ──────────────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="bg-[#0e0e10] border border-[#1e1e22] rounded-2xl p-5 space-y-4 animate-pulse">
      <div className="flex items-start justify-between gap-3">
        <div className="space-y-2 flex-1">
          <div className="h-4 w-2/3 bg-[#1a1a1e] rounded-full" />
          <div className="h-2.5 w-1/3 bg-[#161619] rounded-full" />
        </div>
        <div className="h-6 w-16 bg-[#1a1a1e] rounded-full" />
      </div>
      <div className="h-2.5 w-full bg-[#161619] rounded-full" />
      <div className="h-2.5 w-4/5 bg-[#161619] rounded-full" />
      <div className="flex gap-2">
        <div className="h-6 w-20 bg-[#1a1a1e] rounded-full" />
        <div className="h-6 w-16 bg-[#1a1a1e] rounded-full" />
      </div>
    </div>
  );
}

// ── Single offer row ──────────────────────────────────────────────────────────

interface OfferRowProps {
  offer: Offer;
  onStatusChange: (
    offerId: string,
    status: "accepted" | "rejected",
  ) => Promise<void>;
}

function OfferRow({ offer, onStatusChange }: OfferRowProps) {
  const [expanded, setExpanded] = useState(false);
  const [loading, setLoading] = useState<"accepting" | "rejecting" | null>(
    null,
  );
  const cfg = OFFER_STATUS[offer.status] ?? OFFER_STATUS.pending;
  const StatusIcon = cfg.icon;

  const handleAction = async (status: "accepted" | "rejected") => {
    setLoading(status === "accepted" ? "accepting" : "rejecting");
    await onStatusChange(offer._id, status);
    setLoading(null);
  };

  return (
    <div className="bg-[#0a0a0c] border border-[#1e1e22] rounded-xl overflow-hidden">
      {/* Colored left bar */}
      <div className="flex">
        <div className={`w-0.75 shrink-0 ${cfg.bar}`} />
        <div className="flex-1 p-4 space-y-3">
          {/* Header row */}
          <div className="flex items-center gap-3">
            <img
              src={getAvatarUrl(
                offer.offeredBy.name,
                offer.offeredBy.avatar || undefined,
              )}
              alt={offer.offeredBy.name}
              className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0"
              onError={(e) => handleAvatarError(e, offer.offeredBy.name)}
              referrerPolicy="no-referrer"
            />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-zinc-200 truncate">
                {offer.offeredBy.name}
              </p>
              <p className="text-[10px] text-zinc-600 font-mono">
                {new Date(offer.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>
            <span
              className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase tracking-wide ${cfg.pill}`}
            >
              <StatusIcon className="w-3 h-3" />
              {cfg.label}
            </span>
          </div>

          {/* Message */}
          <p
            className={`text-[12px] text-zinc-400 leading-relaxed ${!expanded ? "line-clamp-2" : ""}`}
          >
            {offer.message}
          </p>

          {/* Actions row */}
          <div className="flex items-center gap-2 flex-wrap">
            {/* Accept / Reject — only show for pending */}
            {offer.status === "pending" && (
              <>
                <button
                  onClick={() => handleAction("accepted")}
                  disabled={loading !== null}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400 rounded-lg text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-40"
                >
                  {loading === "accepting" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ThumbsUp className="w-3 h-3" />
                  )}
                  Accept
                </button>
                <button
                  onClick={() => handleAction("rejected")}
                  disabled={loading !== null}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-950/40 hover:bg-red-900/50 border border-red-800/50 text-red-400 rounded-lg text-[11px] font-semibold transition-all cursor-pointer disabled:opacity-40"
                >
                  {loading === "rejecting" ? (
                    <Loader2 className="w-3 h-3 animate-spin" />
                  ) : (
                    <ThumbsDown className="w-3 h-3" />
                  )}
                  Decline
                </button>
              </>
            )}

            {/* Expand toggle */}
            {offer.answers?.length > 0 && (
              <button
                onClick={() => setExpanded((v) => !v)}
                className="ml-auto inline-flex items-center gap-1 text-[11px] text-zinc-600 hover:text-zinc-300 transition-colors cursor-pointer"
              >
                {expanded ? (
                  <>
                    <ChevronUp className="w-3.5 h-3.5" />
                    Less
                  </>
                ) : (
                  <>
                    <ChevronDown className="w-3.5 h-3.5" />
                    Answers
                  </>
                )}
              </button>
            )}
          </div>

          {/* Q&A answers */}
          {expanded && offer.answers?.length > 0 && (
            <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-3 mt-1">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-3.5 h-3.5 text-[#FF3F3F]" />
                <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">
                  Question Answers
                </p>
              </div>
              {offer.answers.map((ans, i) => (
                <div key={i} className="space-y-0.5">
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">
                    <span className="text-[#FF3F3F] font-bold">Q{i + 1}.</span>{" "}
                    {ans.question}
                  </p>
                  <p className="text-[12px] text-zinc-300 pl-3 border-l border-[#FF3F3F]/20 leading-relaxed">
                    {ans.answer || "—"}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Post block with its offers ────────────────────────────────────────────────

interface PostBlockProps {
  item: ResponseItem;
  onStatusChange: (
    offerId: string,
    status: "accepted" | "rejected",
  ) => Promise<void>;
  defaultOpen?: boolean;
}

function PostBlock({
  item,
  onStatusChange,
  defaultOpen = false,
}: PostBlockProps) {
  const { post, offers } = item;
  const [open, setOpen] = useState(false);

  const pendingCount = offers.filter((o) => o.status === "pending").length;
  const acceptedCount = offers.filter((o) => o.status === "accepted").length;
  const rejectedCount = offers.filter((o) => o.status === "rejected").length;

  return (
    <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
      {/* Post header — always visible */}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full text-left px-5 pt-5 pb-4 space-y-3 cursor-pointer group"
      >
        <div className="flex items-start gap-3">
          <div className="flex-1 min-w-0">
            <h3 className="text-[15px] font-bold text-zinc-100 leading-snug group-hover:text-white transition-colors truncate">
              {post.title}
            </h3>
            <p className="text-[12px] text-zinc-500 mt-0.5 line-clamp-1">
              {post.description}
            </p>
          </div>
          {/* Offer count badge */}
          <div
            className={`shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[12px] font-bold border transition-all ${
              offers.length > 0
                ? "bg-[#FF3F3F]/10 border-[#FF3F3F]/30 text-[#FF3F3F]"
                : "bg-[#161619] border-[#222226] text-zinc-600"
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            {offers.length}
          </div>
        </div>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
            <Tag className="w-2.5 h-2.5" />
            {post.category}
          </span>
          <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
            <MapPin className="w-2.5 h-2.5" />
            {post.location}
          </span>
          {post.budget && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
              <IndianRupee className="w-2.5 h-2.5" />
              {post.budget}
            </span>
          )}
          {post.timeline && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
              <Clock className="w-2.5 h-2.5" />
              {post.timeline}
            </span>
          )}
          <span className="ml-auto inline-flex items-center gap-1 text-[11px] text-zinc-600 group-hover:text-zinc-400 transition-colors">
            {open ? (
              <ChevronUp className="w-3.5 h-3.5" />
            ) : (
              <ChevronDown className="w-3.5 h-3.5" />
            )}
            {open ? "Hide" : "View applicants"}
          </span>
        </div>

        {/* Mini status strip */}
        {offers.length > 0 && (
          <div className="flex items-center gap-3 pt-0.5">
            <span className="text-[10px] text-zinc-600">
              {pendingCount} pending
            </span>
            {acceptedCount > 0 && (
              <span className="text-[10px] text-emerald-500">
                {acceptedCount} accepted
              </span>
            )}
            {rejectedCount > 0 && (
              <span className="text-[10px] text-red-500">
                {rejectedCount} declined
              </span>
            )}
          </div>
        )}
      </button>

      {/* Offers list */}
      {open && (
        <div className="px-5 pb-5">
          {offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 gap-2 text-center border border-[#1e1e22] rounded-xl bg-[#0a0a0c]">
              <MessageSquare className="w-6 h-6 text-zinc-700" />
              <p className="text-[12px] text-zinc-600">No applicants yet</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {offers.map((offer) => (
                <OfferRow
                  key={offer._id}
                  offer={offer}
                  onStatusChange={onStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ── Main screen ───────────────────────────────────────────────────────────────

export default function MyResponses() {
  const [items, setItems] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchResponses = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await fetch("/api/offers/responses", {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to load responses");
      const data = await res.json();
      setItems(data.data || []);
    } catch (e: any) {
      setError(e.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchResponses();
  }, [fetchResponses]);

  const handleStatusChange = useCallback(
    async (offerId: string, status: "accepted" | "rejected") => {
      const token = localStorage.getItem("access_token");
      const action = status === "accepted" ? "accept" : "reject";
      try {
        const res = await fetch(`/api/offers/${offerId}/${action}`, {
          method: "PATCH",
          headers: {
            ...(token ? { Authorization: `${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to update status");

        // Optimistically update local state
        setItems((prev) =>
          prev.map((item) => ({
            ...item,
            offers: item.offers.map((o) =>
              o._id === offerId ? { ...o, status } : o,
            ),
          })),
        );
      } catch {
        // Silently fail — the button will re-enable
      }
    },
    [],
  );

  // Aggregate stats
  const totalOffers = items.reduce((n, i) => n + i.offers.length, 0);
  const totalPending = items.reduce(
    (n, i) => n + i.offers.filter((o) => o.status === "pending").length,
    0,
  );
  const totalAccepted = items.reduce(
    (n, i) => n + i.offers.filter((o) => o.status === "accepted").length,
    0,
  );
  const totalRejected = items.reduce(
    (n, i) => n + i.offers.filter((o) => o.status === "rejected").length,
    0,
  );

  const postsWithOffers = items.filter((i) => i.offers.length > 0);
  const emptyPosts = items.filter((i) => i.offers.length === 0);

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      {/* ── Page header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black text-zinc-100 tracking-tight">
            Responses
          </h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">
            See everyone who applied to your posts — review, accept, or decline.
          </p>
        </div>
        <button
          onClick={fetchResponses}
          disabled={loading}
          className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] hover:border-[#2a2a2e] rounded-xl text-zinc-500 hover:text-zinc-300 transition-all cursor-pointer disabled:opacity-40"
          title="Refresh"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* ── Stats row ── */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            {
              label: "Total Posts",
              value: items.length,
              color: "text-zinc-200",
              bg: "bg-[#0e0e10]",
            },
            {
              label: "Total Offers",
              value: totalOffers,
              color: "text-zinc-200",
              bg: "bg-[#0e0e10]",
            },
            {
              label: "Accepted",
              value: totalAccepted,
              color: "text-emerald-400",
              bg: "bg-emerald-950/20 border-emerald-900/30",
            },
            {
              label: "Pending",
              value: totalPending,
              color: "text-amber-400",
              bg: "bg-amber-950/20 border-amber-900/30",
            },
          ].map(({ label, value, color, bg }) => (
            <div
              key={label}
              className={`${bg} border border-[#1e1e22] rounded-2xl p-4 text-center`}
            >
              <p className={`text-[26px] font-black tracking-tight ${color}`}>
                {value}
              </p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">
                {label}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* ── Content ── */}
      {loading ? (
        <div className="space-y-4">
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center">
            <AlertCircle className="w-5 h-5 text-zinc-700" />
          </div>
          <p className="text-[14px] font-semibold text-zinc-400">{error}</p>
          <button
            onClick={fetchResponses}
            className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer"
          >
            Try again
          </button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0e0e10] border border-[#1e1e22] flex items-center justify-center">
            <Inbox className="w-7 h-7 text-zinc-700" />
          </div>
          <div>
            <p className="text-[16px] font-bold text-zinc-300">No posts yet</p>
            <p className="text-[12px] text-zinc-600 mt-1 max-w-xs">
              Create a post to start receiving offers from the community.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Posts that have offers first */}
          {postsWithOffers.length > 0 && (
            <div className="space-y-4">
              {postsWithOffers.map((item) => (
                <PostBlock
                  key={item.post._id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}

          {/* Posts with no offers below */}
          {emptyPosts.length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-700 uppercase tracking-wider font-semibold px-1">
                Posts awaiting applicants ({emptyPosts.length})
              </p>
              {emptyPosts.map((item) => (
                <PostBlock
                  key={item.post._id}
                  item={item}
                  onStatusChange={handleStatusChange}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

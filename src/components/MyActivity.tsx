// MyActivity.tsx â€” unified Responses + Activity hub with shared components

import { useEffect, useState, type ComponentType } from "react";
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
  HelpCircle,
  RefreshCw,
  Users,
  MessageCircle,
  ArrowLeft,
  Trash2,
  Star,
  Inbox,
  Activity,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../utils";
import { apiFetch } from "../lib/api";
import PostGridCard from "./explore/PostGridCard";
import {
  CATEGORY_GRADIENTS,
  CATEGORY_COLORS,
  POST_STATUS_STYLE,
} from "../lib/postConstants";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deletePostThunk, updatePostStatusThunk } from "../store/thunks";
import ReviewHelpersModal from "./ReviewHelpersModal";

// --- Types ---

interface ResponsePost {
  _id: string;
  title: string;
  description: string;
  category: string;
  address?: string;
  location?: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  offersCount: number;
  questions?: string[];
  createdAt: string;
}
interface ResponseOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  offeredBy: {
    id: string;
    name: string;
    email?: string;
    avatar: string | null;
  };
}
interface ResponseItem {
  post: ResponsePost;
  offers: ResponseOffer[];
}

interface ActivityPost {
  _id: string;
  title: string;
  description: string;
  category: string;
  address?: string;
  budget?: string;
  timeline?: string;
  status: string;
  expiresAt: string;
  questions?: string[];
  author: { _id?: string; name: string; avatar: string };
}
interface ActivityOffer {
  _id: string;
  postId: ActivityPost;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  updatedAt: string;
}

interface DetailOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  offeredBy: { id: string; name: string; email: string; avatar: string };
}

const OFFER_STATUS_CFG = {
  accepted: {
    label: "Accepted",
    icon: CheckCircle2,
    pill: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50",
  },
  rejected: {
    label: "Rejected",
    icon: XCircle,
    pill: "bg-red-950/60 text-red-400 border-red-800/50",
  },
  pending: {
    label: "Awaiting",
    icon: Clock,
    pill: "bg-zinc-900 text-zinc-400 border-zinc-700",
  },
} as const;

// --- Shared UI components ---

function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={i}
          className="rounded-xl border border-zinc-800/60 bg-[#0e0e10] overflow-hidden animate-pulse"
        >
          <div className="h-28 bg-zinc-900" />
          <div className="p-3 space-y-2">
            <div className="h-3 w-3/4 rounded-full bg-zinc-800" />
            <div className="h-2.5 w-1/2 rounded-full bg-zinc-800/70" />
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

function FilterPills<T extends string>({
  filters,
  active,
  onChange,
}: {
  filters: { key: T; label: string }[];
  active: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex gap-2 flex-wrap">
      {filters.map(({ key, label }) => (
        <button
          key={key}
          onClick={() => onChange(key)}
          className={`px-3 py-1.5 rounded-full text-[11px] font-bold transition cursor-pointer border ${
            active === key
              ? "bg-[#FF3F3F]/15 border-[#FF3F3F]/40 text-[#FF3F3F]"
              : "bg-[#0e0e10] border-[#1e1e22] text-zinc-500 hover:border-zinc-700 hover:text-zinc-300"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

function MetaChips({
  budget,
  timeline,
  address,
}: {
  budget?: string;
  timeline?: string;
  address?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {budget && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <IndianRupee className="w-2.5 h-2.5" />
          {budget}
        </span>
      )}
      {timeline && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <Clock className="w-2.5 h-2.5" />
          {timeline}
        </span>
      )}
      {address && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <MapPin className="w-2.5 h-2.5" />
          {address}
        </span>
      )}
    </div>
  );
}

function QABlock({
  answers,
}: {
  answers: { question: string; answer: string }[];
}) {
  if (!answers?.length) return null;
  return (
    <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-2.5">
      <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
        Question Answers
      </p>
      {answers.map((ans, i) => (
        <div key={i}>
          <p className="text-[11px] text-zinc-600 font-medium">
            Q: {ans.question}
          </p>
          <p className="text-[12px] text-zinc-300 mt-0.5 pl-2 border-l border-[#FF3F3F]/25 leading-relaxed">
            {ans.answer || "â€”"}
          </p>
        </div>
      ))}
    </div>
  );
}

// Expandable offer row shared by both detail panels
function OfferRow({
  offer,
  idx,
  expanded,
  onToggle,
  actions,
}: {
  offer: {
    _id: string;
    message: string;
    answers: { question: string; answer: string }[];
    status: string;
    createdAt: string;
    offeredBy: { name: string; avatar: string | null };
  };
  idx?: number;
  expanded: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
}) {
  const cfg =
    OFFER_STATUS_CFG[offer.status as keyof typeof OFFER_STATUS_CFG] ??
    OFFER_STATUS_CFG.pending;
  const StatusIcon = cfg.icon;
  const indent = idx !== undefined ? "pl-15" : "pl-12";
  return (
    <div className="p-4 hover:bg-[#0e0e10] transition-colors">
      <div className="flex items-start gap-3">
        {idx !== undefined && (
          <div className="shrink-0 w-6 h-6 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center">
            <span className="text-[9px] font-bold text-zinc-500">
              #{idx + 1}
            </span>
          </div>
        )}
        <img
          src={getAvatarUrl(
            offer.offeredBy.name,
            offer.offeredBy.avatar ?? undefined,
          )}
          alt={offer.offeredBy.name}
          className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0"
          onError={(e) => handleAvatarError(e, offer.offeredBy.name)}
          referrerPolicy="no-referrer"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[13px] font-semibold text-zinc-100">
              {offer.offeredBy.name}
            </span>
            <span
              className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${cfg.pill}`}
            >
              {cfg.label}
            </span>
          </div>
          <p className="text-[10px] text-zinc-600 mt-0.5">
            {new Date(offer.createdAt).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        <button
          onClick={onToggle}
          className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition cursor-pointer"
        >
          {expanded ? (
            <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
          ) : (
            <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />
          )}
        </button>
      </div>
      <p
        className={`mt-2.5 text-[12px] text-zinc-400 leading-relaxed ${indent} ${!expanded ? "line-clamp-2" : ""}`}
      >
        {offer.message}
      </p>
      {expanded && (
        <div className={`${indent} mt-3 space-y-3`}>
          <QABlock answers={offer.answers} />
          {actions}
        </div>
      )}
    </div>
  );
}

// --- RESPONSES TAB ---

type ResponseFilter = "all" | "live" | "in_progress" | "completed" | "expired";
const RESPONSE_FILTERS: { key: ResponseFilter; label: string }[] = [
  { key: "all", label: "All Posts" },
  { key: "live", label: "Live" },
  { key: "in_progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "expired", label: "Expired" },
];

function ResponsePostDetail({
  item,
  onBack,
  onInitiateChat,
  currentUserId,
}: {
  item: ResponseItem;
  onBack: () => void;
  onInitiateChat: () => void;
  currentUserId: string;
}) {
  const dispatch = useAppDispatch();
  const { post } = item;
  const postId = post._id;

  const [offers, setOffers] = useState<DetailOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [completing, setCompleting] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmed, setConfirmed] = useState<
    "complete" | "expire" | "delete" | null
  >(null);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const gradient =
    CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const addr = post.address || post.location || "";

  const fetchOffers = async () => {
    setOffersLoading(true);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch(`/api/offers/post/${postId}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed");
      const data = await res.json();
      setOffers(data.offers || []);
    } catch {
    } finally {
      setOffersLoading(false);
    }
  };
  useEffect(() => {
    fetchOffers();
  }, [postId]);

  const handleOfferAction = async (
    offerId: string,
    action: "accept" | "reject",
  ) => {
    setActionLoading(offerId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch(`/api/offers/${offerId}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `${token}` } : {}),
        },
      });
      if (!res.ok) throw new Error("Action failed");
      const newStatus = action === "accept" ? "accepted" : "rejected";
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? { ...o, status: newStatus } : o)),
      );
    } catch {
    } finally {
      setActionLoading(null);
    }
  };

  const handlePostAction = async (type: "complete" | "expire" | "delete") => {
    if (confirmed !== type) {
      setConfirmed(type);
      return;
    }
    if (type === "complete") {
      setCompleting(true);
      try {
        await dispatch(updatePostStatusThunk(postId, "completed") as any);
        const accepted = offers.filter((o) => o.status === "accepted");
        if (accepted.length > 0) {
          setShowReviewModal(true);
          return;
        }
        onBack();
      } finally {
        setCompleting(false);
        setConfirmed(null);
      }
    } else if (type === "expire") {
      setExpiring(true);
      try {
        await dispatch(updatePostStatusThunk(postId, "expired") as any);
        onBack();
      } finally {
        setExpiring(false);
        setConfirmed(null);
      }
    } else {
      setDeleting(true);
      try {
        await dispatch(deletePostThunk(postId) as any);
        onBack();
      } finally {
        setDeleting(false);
        setConfirmed(null);
      }
    }
  };

  const pending = offers.filter((o) => o.status === "pending");
  const accepted = offers.filter((o) => o.status === "accepted");

  return (
    <div className="space-y-5 pb-6">
      {showReviewModal && (
        <ReviewHelpersModal
          postId={postId}
          postTitle={post.title}
          hunterId={currentUserId}
          helpers={accepted.map((o) => ({
            helperId: o.offeredBy.id,
            name: o.offeredBy.name,
            avatar: o.offeredBy.avatar,
          }))}
          onClose={() => {
            setShowReviewModal(false);
            onBack();
          }}
        />
      )}

      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Responses
      </button>

      <div className="flex flex-col lg:flex-row gap-5 items-start">
        {/* Left: post info + actions */}
        <div className="w-full lg:w-[400px] lg:shrink-0 space-y-4">
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className={`relative h-24 bg-linear-to-br ${gradient}`}>
              <div className="flex h-full items-center justify-center">
                <span
                  className="text-5xl font-black opacity-10 select-none"
                  style={{ color: accent }}
                >
                  {post.category?.[0] ?? "?"}
                </span>
              </div>
              <div className="absolute top-3 left-3 flex gap-2">
                <span
                  className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md"
                  style={{
                    background: `${accent}22`,
                    color: accent,
                    border: `1px solid ${accent}44`,
                  }}
                >
                  {post.category}
                </span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border backdrop-blur-md ${POST_STATUS_STYLE[post.status] || POST_STATUS_STYLE.live}`}
                >
                  {post.status}
                </span>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2">
              <h2 className="text-[18px] font-black text-zinc-100 leading-snug">
                {post.title}
              </h2>
              <p className="text-[12px] text-zinc-500 leading-relaxed">
                {post.description}
              </p>
              <MetaChips
                budget={post.budget}
                timeline={post.timeline}
                address={addr}
              />
            </div>
            <div className="flex border-t border-[#161619]">
              {[
                {
                  label: "Awaiting",
                  count: pending.length,
                  color: "text-zinc-300",
                },
                {
                  label: "Accepted",
                  count: accepted.length,
                  color: "text-emerald-400",
                },
                {
                  label: "Total",
                  count: offers.length,
                  color: "text-zinc-400",
                },
              ].map(({ label, count, color }) => (
                <div
                  key={label}
                  className="flex-1 text-center py-3 border-r border-[#161619] last:border-r-0"
                >
                  <p className={`text-[16px] font-black ${color}`}>{count}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">
                    {label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {post.questions && post.questions.length > 0 && (
            <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#FF3F3F]" />
                <h3 className="text-[13px] font-bold text-zinc-100">
                  Questions for Applicants
                </h3>
              </div>
              <div className="space-y-2">
                {post.questions.map((q, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F] text-[10px] font-bold flex items-center justify-center">
                      {i + 1}
                    </span>
                    <p className="text-[12px] text-zinc-300 leading-relaxed">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageCircle className="w-4 h-4 text-[#FF3F3F]" />
              <h3 className="text-[13px] font-bold text-zinc-100">Messages</h3>
            </div>
            <button
              onClick={onInitiateChat}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[11px] font-bold rounded-xl transition cursor-pointer"
            >
              <MessageCircle className="w-3.5 h-3.5" /> View all
            </button>
          </div>

          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">
              Post Actions
            </p>
            <div className="flex flex-col gap-2">
              {!["completed", "expired", "cancelled"].includes(post.status) && (
                <button
                  onClick={() => handlePostAction("complete")}
                  disabled={completing}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "complete" ? "bg-emerald-900/60 border-2 border-emerald-500 text-emerald-300 animate-pulse" : "bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400"}`}
                >
                  {completing ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4" />
                  )}
                  {confirmed === "complete"
                    ? "Tap again to confirm"
                    : "Mark as Completed"}
                </button>
              )}
              {post.status === "live" && (
                <button
                  onClick={() => handlePostAction("expire")}
                  disabled={expiring}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "expire" ? "bg-amber-900/60 border-2 border-amber-500 text-amber-300 animate-pulse" : "bg-amber-950/30 hover:bg-amber-900/30 border border-amber-800/40 text-amber-400"}`}
                >
                  {expiring ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Clock className="w-4 h-4" />
                  )}
                  {confirmed === "expire"
                    ? "Tap again to confirm"
                    : "Mark as Expired"}
                </button>
              )}
              <button
                onClick={() => handlePostAction("delete")}
                disabled={deleting}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "delete" ? "bg-red-900/60 border-2 border-red-500 text-red-300 animate-pulse" : "bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400"}`}
              >
                {deleting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Trash2 className="w-4 h-4" />
                )}
                {confirmed === "delete"
                  ? "Tap again to confirm"
                  : "Delete Post"}
              </button>
            </div>
            {confirmed && (
              <button
                onClick={() => setConfirmed(null)}
                className="w-full text-[11px] text-zinc-600 hover:text-zinc-400 transition cursor-pointer py-1"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

        {/* Right: offers list */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#161619] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF3F3F]" />
                <h3 className="text-[13px] font-bold text-zinc-100">
                  Offers Received
                </h3>
                {!offersLoading && (
                  <span className="text-[10px] bg-[#161619] border border-[#222226] text-zinc-500 px-2 py-0.5 rounded-full">
                    {offers.length}
                  </span>
                )}
              </div>
              <button
                onClick={fetchOffers}
                disabled={offersLoading}
                className="p-1.5 rounded-lg bg-[#161619] border border-[#222226] text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40"
              >
                <RefreshCw
                  className={`w-3 h-3 ${offersLoading ? "animate-spin" : ""}`}
                />
              </button>
            </div>
            {offersLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-zinc-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-[12px]">Loading offersâ€¦</span>
              </div>
            ) : offers.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center px-6">
                <Users className="w-6 h-6 text-zinc-700" />
                <p className="text-[13px] font-semibold text-zinc-400">
                  No applicants yet
                </p>
                <p className="text-[11px] text-zinc-600 max-w-xs">
                  When people respond to your post, their offers will appear
                  here.
                </p>
              </div>
            ) : (
              <div className="divide-y divide-[#161619]">
                {offers.map((offer, idx) => {
                  const isActioning = actionLoading === offer._id;
                  return (
                    <OfferRow
                      key={offer._id}
                      offer={offer}
                      idx={idx}
                      expanded={expandedId === offer._id}
                      onToggle={() =>
                        setExpandedId(
                          expandedId === offer._id ? null : offer._id,
                        )
                      }
                      actions={
                        offer.status === "pending" ? (
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                handleOfferAction(offer._id, "accept")
                              }
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                            >
                              {isActioning ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <CheckCircle2 className="w-3.5 h-3.5" />
                              )}
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                handleOfferAction(offer._id, "reject")
                              }
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50"
                            >
                              {isActioning ? (
                                <Loader2 className="w-3 h-3 animate-spin" />
                              ) : (
                                <XCircle className="w-3.5 h-3.5" />
                              )}
                              Decline
                            </button>
                          </div>
                        ) : offer.status === "accepted" ? (
                          <button
                            onClick={onInitiateChat}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[11px] font-bold rounded-xl transition cursor-pointer"
                          >
                            <MessageCircle className="w-3.5 h-3.5" /> Chat with{" "}
                            {offer.offeredBy.name.split(" ")[0]}
                          </button>
                        ) : null
                      }
                    />
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ResponsesTab({
  onInitiateChat,
  currentUserId,
}: {
  onInitiateChat: () => void;
  currentUserId: string;
}) {
  const [items, setItems] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ResponseFilter>("all");
  const [selected, setSelected] = useState<ResponseItem | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/api/offers/responses", {
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
  };
  useEffect(() => {
    fetchData();
  }, []);

  if (selected) {
    return (
      <ResponsePostDetail
        item={selected}
        onBack={() => setSelected(null)}
        onInitiateChat={onInitiateChat}
        currentUserId={currentUserId}
      />
    );
  }

  const filtered =
    filter === "all" ? items : items.filter((i) => i.post.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <FilterPills
          filters={RESPONSE_FILTERS}
          active={filter}
          onChange={setFilter}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] rounded-xl text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Failed to load"
          desc={error}
          action={
            <button
              onClick={fetchData}
              className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer"
            >
              Try again
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title={filter === "all" ? "No posts yet" : `No ${filter} posts`}
          desc={
            filter === "all"
              ? "You haven't posted any requirements yet."
              : `None of your posts are currently ${filter}.`
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const pendingCount = item.offers.filter(
              (o) => o.status === "pending",
            ).length;
            const acceptedCount = item.offers.filter(
              (o) => o.status === "accepted",
            ).length;
            return (
              <PostGridCard
                key={item.post._id}
                post={item.post}
                onSelect={() => setSelected(item)}
                badge={
                  pendingCount > 0 ? (
                    <div className="flex items-center gap-1 rounded-full bg-[#FF3F3F]/80 px-2 py-0.5 backdrop-blur-md text-[10px] text-white font-bold">
                      {pendingCount} new
                    </div>
                  ) : undefined
                }
                meta={
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[10px] text-zinc-600">
                      <Users className="w-3 h-3" />
                      {item.offers.length}
                    </span>
                    {acceptedCount > 0 && (
                      <span className="text-[10px] text-emerald-400 font-semibold">
                        {acceptedCount} accepted
                      </span>
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

// --- ACTIVITY TAB ---

type ActivityFilter = "all" | "pending" | "accepted" | "rejected";
const ACTIVITY_FILTERS: { key: ActivityFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "pending", label: "Awaiting" },
  { key: "accepted", label: "Accepted" },
  { key: "rejected", label: "Rejected" },
];

function ActivityOfferDetail({
  offer,
  onBack,
  onInitiateChat,
}: {
  offer: ActivityOffer;
  onBack: () => void;
  onInitiateChat: () => void;
}) {
  const post = offer.postId;
  const [qaExpanded, setQaExpanded] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewHovered, setReviewHovered] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewDone, setReviewDone] = useState<boolean | null>(null);
  const [reviewError, setReviewError] = useState("");

  const isCompletedAndAccepted =
    offer.status === "accepted" && post?.status === "completed";
  const cfg = OFFER_STATUS_CFG[offer.status] ?? OFFER_STATUS_CFG.pending;
  const StatusIcon = cfg.icon;
  const accent = CATEGORY_COLORS[post?.category] || "#FF3F3F";
  const gradient =
    CATEGORY_GRADIENTS[post?.category] || "from-zinc-900 to-zinc-800";

  useEffect(() => {
    if (!isCompletedAndAccepted) return;
    const token = localStorage.getItem("access_token");
    apiFetch(`/api/rating/review-status/${post?._id}`, {
      headers: token ? { Authorization: `${token}` } : {},
    })
      .then((r) => r.json())
      .then((d) => setReviewDone(d.hasReviewedOwner ?? false))
      .catch(() => setReviewDone(false));
  }, [isCompletedAndAccepted]);

  const handleReviewOwner = async () => {
    if (!reviewRating) {
      setReviewError("Please select a star rating");
      return;
    }
    setReviewSubmitting(true);
    setReviewError("");
    const token = localStorage.getItem("access_token");
    try {
      const res = await apiFetch("/api/rating/review-owner", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          postId: post?._id,
          rating: reviewRating,
          comment: reviewComment.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to submit review");
      setReviewDone(true);
    } catch (err) {
      setReviewError(err instanceof Error ? err.message : "Failed");
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="space-y-5 pb-6">
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-200 transition cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Activity
      </button>

      <div
        className={`flex items-start gap-3 px-4 py-3 rounded-2xl border text-[13px] leading-snug ${offer.status === "accepted" ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-300" : offer.status === "rejected" ? "bg-red-950/30 border-red-900/40 text-red-300" : "bg-zinc-900/40 border-zinc-800/40 text-zinc-400"}`}
      >
        <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">
            {offer.status === "accepted"
              ? "Offer Accepted!"
              : offer.status === "rejected"
                ? "Offer Not Selected"
                : "Offer Under Review"}
          </p>
          <p className="text-[11px] mt-0.5 opacity-80">
            {offer.status === "accepted"
              ? "The post author wants to work with you. Start a conversation!"
              : offer.status === "rejected"
                ? "Your offer was not selected for this requirement."
                : "Your offer is being reviewed by the post author."}
          </p>
        </div>
      </div>

      <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
        <div className={`relative h-20 bg-linear-to-br ${gradient}`}>
          <div className="flex h-full items-center justify-center">
            <span
              className="text-5xl font-black opacity-10 select-none"
              style={{ color: accent }}
            >
              {post?.category?.[0] ?? "?"}
            </span>
          </div>
          <div className="absolute top-3 left-3 flex gap-2">
            <span
              className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md"
              style={{
                background: `${accent}22`,
                color: accent,
                border: `1px solid ${accent}44`,
              }}
            >
              {post?.category}
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border backdrop-blur-md ${POST_STATUS_STYLE[post?.status] || POST_STATUS_STYLE.live}`}
            >
              {post?.status}
            </span>
          </div>
        </div>
        <div className="px-5 py-4 space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <img
              src={getAvatarUrl(post?.author?.name, post?.author?.avatar)}
              alt={post?.author?.name}
              className="w-7 h-7 rounded-full object-cover ring-2 ring-[#1e1e22]"
              onError={(e) => handleAvatarError(e, post?.author?.name)}
              referrerPolicy="no-referrer"
            />
            <span className="text-[12px] font-semibold text-zinc-300">
              {post?.author?.name}
            </span>
            {post?.address && (
              <span className="text-[10px] text-zinc-600 flex items-center gap-1 ml-auto">
                <MapPin className="w-3 h-3" />
                {post.address}
              </span>
            )}
          </div>
          <h2 className="text-[16px] font-black text-zinc-100 leading-snug">
            {post?.title}
          </h2>
          <p className="text-[12px] text-zinc-500 leading-relaxed">
            {post?.description}
          </p>
          <MetaChips budget={post?.budget} timeline={post?.timeline} />
        </div>
      </div>

      <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">
          My Offer
        </p>
        <p className="text-[13px] text-zinc-300 leading-relaxed">
          {offer.message}
        </p>
        <p className="text-[10px] text-zinc-700 font-mono">
          Submitted{" "}
          {new Date(offer.createdAt).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
        </p>
        {offer.answers?.length > 0 && (
          <>
            <button
              onClick={() => setQaExpanded((v) => !v)}
              className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition cursor-pointer"
            >
              {qaExpanded ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              {qaExpanded ? "Hide Q&A" : "View Q&A answers"}
            </button>
            {qaExpanded && <QABlock answers={offer.answers} />}
          </>
        )}
      </div>

      {isCompletedAndAccepted ? (
        <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-2">
            <Star className="w-4 h-4 text-amber-400" />
            <p className="text-[13px] font-bold text-zinc-100">
              Review {post?.author?.name?.split(" ")[0]}
            </p>
            <span className="text-[10px] bg-emerald-950/60 text-emerald-400 border border-emerald-800/50 px-2 py-0.5 rounded-full font-bold uppercase">
              Post Completed
            </span>
          </div>
          {reviewDone === null ? (
            <div className="flex items-center gap-2 text-zinc-600 text-[12px]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" /> Checking review
              statusâ€¦
            </div>
          ) : reviewDone ? (
            <div className="flex items-center gap-2 text-emerald-400 text-[13px] font-semibold">
              <CheckCircle2 className="w-4 h-4" /> You reviewed this post owner
            </div>
          ) : (
            <>
              <div className="space-y-1">
                <p className="text-[11px] text-zinc-500">Your rating</p>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setReviewRating(star)}
                      onMouseEnter={() => setReviewHovered(star)}
                      onMouseLeave={() => setReviewHovered(0)}
                      className="cursor-pointer focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 transition-colors ${star <= (reviewHovered || reviewRating) ? "text-amber-400 fill-amber-400" : "text-zinc-700 hover:text-amber-600"}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
              <textarea
                rows={2}
                placeholder="Share your experience with this post ownerâ€¦"
                value={reviewComment}
                onChange={(e) => setReviewComment(e.target.value)}
                className="w-full bg-[#141416] border border-[#1e1e22] rounded-xl px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-amber-500/50 resize-none"
              />
              {reviewError && (
                <p className="text-[11px] text-red-400">{reviewError}</p>
              )}
              <button
                onClick={handleReviewOwner}
                disabled={reviewSubmitting}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 text-[13px] font-bold transition disabled:opacity-50 cursor-pointer"
              >
                {reviewSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Star className="w-4 h-4" />
                )}
                Submit Review
              </button>
            </>
          )}
        </div>
      ) : offer.status === "accepted" ? (
        <button
          onClick={onInitiateChat}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[13px] font-bold transition cursor-pointer"
        >
          <MessageCircle className="w-4 h-4" />
          Start a conversation with {post?.author?.name?.split(" ")[0]}
        </button>
      ) : null}
    </div>
  );
}

function ActivityTab({ onInitiateChat }: { onInitiateChat: () => void }) {
  const [items, setItems] = useState<ActivityOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<ActivityFilter>("all");
  const [selected, setSelected] = useState<ActivityOffer | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/api/offers/my-activity", {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (!res.ok) throw new Error("Failed to load activity");
      const data = await res.json();
      setItems(data.data || []);
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
        onBack={() => setSelected(null)}
        onInitiateChat={onInitiateChat}
      />
    );
  }

  const filtered =
    filter === "all" ? items : items.filter((i) => i.status === filter);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <FilterPills
          filters={ACTIVITY_FILTERS}
          active={filter}
          onChange={setFilter}
        />
        <button
          onClick={fetchData}
          disabled={loading}
          className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] rounded-xl text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40"
        >
          <RefreshCw
            className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`}
          />
        </button>
      </div>
      {loading ? (
        <SkeletonGrid />
      ) : error ? (
        <EmptyState
          icon={AlertCircle}
          title="Failed to load"
          desc={error}
          action={
            <button
              onClick={fetchData}
              className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer"
            >
              Try again
            </button>
          }
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={Activity}
          title={
            filter === "all"
              ? "No activity yet"
              : `No ${filter === "pending" ? "awaiting" : filter} offers`
          }
          desc={
            filter === "all"
              ? "Browse posts and submit an offer to see activity here."
              : ""
          }
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((item) => {
            const post = item.postId;
            const cfg =
              OFFER_STATUS_CFG[item.status] ?? OFFER_STATUS_CFG.pending;
            const StatusIcon = cfg.icon;
            return (
              <PostGridCard
                key={item._id}
                post={post}
                onSelect={() => setSelected(item)}
                badge={
                  <div
                    className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase backdrop-blur-md ${cfg.pill}`}
                  >
                    <StatusIcon className="w-2.5 h-2.5" />
                    {cfg.label}
                  </div>
                }
                meta={
                  <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
                    <img
                      src={getAvatarUrl(
                        post?.author?.name,
                        post?.author?.avatar,
                      )}
                      alt={post?.author?.name}
                      className="w-4 h-4 rounded-full object-cover ring-1 ring-zinc-700 shrink-0"
                      onError={(e) => handleAvatarError(e, post?.author?.name)}
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{post?.author?.name}</span>
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

// --- Root export ---

export default function MyActivity({
  onInitiateChat,
  initialTab = "activity",
}: {
  onInitiateChat: () => void;
  initialTab?: "activity" | "responses";
}) {
  const { currentUser } = useAppSelector((s) => s.auth);
  const [tab, setTab] = useState<"activity" | "responses">(initialTab);
  const currentUserId = (currentUser as any)?._id || currentUser?.id || "";

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-[22px] font-black text-zinc-100 tracking-tight">
          My Hub
        </h1>
        <p className="text-[13px] text-zinc-500 mt-0.5">
          Manage your posts and track your offers.
        </p>
      </div>

      <div className="flex gap-1 bg-[#0a0a0c] border border-[#1e1e22] rounded-2xl p-1 w-fit">
        <button
          onClick={() => setTab("responses")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition cursor-pointer ${
            tab === "responses"
              ? "bg-[#FF3F3F] text-white shadow-md shadow-[#FF3F3F]/30"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Inbox className="w-3.5 h-3.5" /> Responses
        </button>
        <button
          onClick={() => setTab("activity")}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[12px] font-bold transition cursor-pointer ${
            tab === "activity"
              ? "bg-[#FF3F3F] text-white shadow-md shadow-[#FF3F3F]/30"
              : "text-zinc-500 hover:text-zinc-300"
          }`}
        >
          <Activity className="w-3.5 h-3.5" /> Activity
        </button>
      </div>

      {tab === "responses" ? (
        <ResponsesTab
          onInitiateChat={onInitiateChat}
          currentUserId={currentUserId}
        />
      ) : (
        <ActivityTab onInitiateChat={onInitiateChat} />
      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import {
  Loader2, AlertCircle, CheckCircle2, XCircle, Clock, MapPin, IndianRupee,
  ChevronDown, ChevronUp, CalendarDays, Activity, Tag, HelpCircle, RefreshCw,
  MessageCircle, ArrowLeft, Trash2, Users, Zap, FileText, Star,
} from "lucide-react";
import {
  getAvatarUrl, handleAvatarError, getPostExpiryLabel, isPostExpired,
} from "../utils";
import { apiFetch } from "../lib/api";
import { Post } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { deletePostThunk, updatePostStatusThunk } from "../store/thunks";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ActivityPost {
  _id: string; title: string; description: string; category: string;
  address: string; budget?: string; timeline?: string; status: string;
  expiresAt: string; createdAt?: string; offersCount?: number;
  questions?: string[];
  author: { _id?: string; name: string; avatar: string };
}
interface ActivityItem {
  _id: string; postId: ActivityPost; message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string; updatedAt: string; offeredBy: string;
}
interface BackendOffer {
  _id: string; postId: string; message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  offeredBy: { id: string; name: string; email: string; avatar: string };
}

// ── Offer status ──────────────────────────────────────────────────────────────
const OFFER_STATUS = {
  accepted: { label: "Accepted", icon: CheckCircle2, pill: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50", bar: "bg-emerald-500" },
  rejected:  { label: "Rejected", icon: XCircle,      pill: "bg-red-950/60 text-red-400 border-red-800/50",             bar: "bg-red-500"     },
  pending:   { label: "Awaiting", icon: Clock,         pill: "bg-zinc-900 text-zinc-400 border-zinc-700",               bar: "bg-zinc-600"    },
} as const;

// ── Category colours ──────────────────────────────────────────────────────────
const CATEGORY_GRADIENTS: Record<string, string> = {
  Technology: "from-indigo-950 to-indigo-900", Design: "from-pink-950 to-pink-900",
  Marketing: "from-amber-950 to-amber-900",   Writing: "from-emerald-950 to-emerald-900",
  Education: "from-blue-950 to-blue-900",     Finance: "from-teal-950 to-teal-900",
  Health: "from-green-950 to-green-900",      Legal: "from-violet-950 to-violet-900",
  "Home & Living": "from-orange-950 to-orange-900",
};
const CATEGORY_COLORS: Record<string, string> = {
  Technology: "#6366f1", Design: "#ec4899", Marketing: "#f59e0b", Writing: "#10b981",
  Education: "#3b82f6", Finance: "#14b8a6", Health: "#22c55e", Legal: "#8b5cf6",
  "Home & Living": "#f97316",
};
const POST_STATUS_STYLE: Record<string, string> = {
  live: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
  in_progress: "text-blue-400 bg-blue-950/40 border-blue-800/50",
  completed: "text-zinc-500 bg-zinc-900 border-zinc-800",
  expired: "text-amber-400 bg-amber-950/40 border-amber-800/50",
  cancelled: "text-red-400 bg-red-950/30 border-red-800/40",
};

// ── Skeleton ──────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-xl border border-zinc-800/60 bg-[#0e0e10] overflow-hidden animate-pulse">
      <div className="h-32 bg-zinc-900" />
      <div className="p-3 space-y-2">
        <div className="h-3 w-3/4 rounded-full bg-zinc-800" />
        <div className="h-2.5 w-1/2 rounded-full bg-zinc-800/70" />
      </div>
    </div>
  );
}

// ── Offer grid card ───────────────────────────────────────────────────────────
function OfferGridCard({ item, onClick }: { item: ActivityItem; onClick: () => void }) {
  const post = item.postId;
  const cfg = OFFER_STATUS[item.status] ?? OFFER_STATUS.pending;
  const StatusIcon = cfg.icon;
  const gradient = CATEGORY_GRADIENTS[post?.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post?.category] || "#FF3F3F";
  const isUrgent = post?.title?.toLowerCase().includes("urgent") || post?.description?.toLowerCase().includes("urgent");
  return (
    <article onClick={onClick} className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0e0e10] cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5">
      <div className={`relative h-32 bg-linear-to-br ${gradient} overflow-hidden`}>
        <div className="flex h-full items-center justify-center">
          <span className="text-4xl font-black opacity-20 select-none" style={{ color: accent }}>{post?.category?.[0] ?? "?"}</span>
        </div>
        <div className="absolute top-2 left-2 flex gap-1.5">
          <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>{post?.category}</span>
          {isUrgent && <span className="inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF3F3F]/20 text-[#FF3F3F] border border-[#FF3F3F]/40 backdrop-blur-md uppercase"><Zap className="w-2.5 h-2.5" />Urgent</span>}
        </div>
        <div className="absolute top-2 right-2">
          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase backdrop-blur-md ${cfg.pill}`}><StatusIcon className="w-2.5 h-2.5" />{cfg.label}</span>
        </div>
        <div className={`absolute top-0 inset-x-0 h-0.5 ${cfg.bar}`} />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100 group-hover:text-white">{post?.title}</h3>
        <p className="line-clamp-2 text-[11px] text-zinc-500 leading-relaxed">{post?.description}</p>
        <div className="mt-auto pt-1 flex items-center gap-2">
          <img src={getAvatarUrl(post?.author?.name, post?.author?.avatar)} alt={post?.author?.name} className="w-5 h-5 rounded-full object-cover ring-1 ring-zinc-700 shrink-0" onError={(e) => handleAvatarError(e, post?.author?.name)} referrerPolicy="no-referrer" />
          <span className="text-[11px] text-zinc-500 truncate">{post?.author?.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-[10px] text-zinc-600">
          <CalendarDays className="w-3 h-3 shrink-0" />
          {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
        </div>
      </div>
    </article>
  );
}

// ── My post grid card ─────────────────────────────────────────────────────────
function MyPostGridCard({ post, onClick }: { post: Post; onClick: () => void }) {
  const gradient = CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const timeLabel = getPostExpiryLabel(post.expiresAt);
  const expired = isPostExpired(post.expiresAt);
  const statusStyle = POST_STATUS_STYLE[post.status] || POST_STATUS_STYLE.live;
  return (
    <article onClick={onClick} className="group flex flex-col overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0e0e10] cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40 hover:-translate-y-0.5">
      <div className={`relative h-32 bg-linear-to-br ${gradient} overflow-hidden`}>
        {post.images?.length ? (
          <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover opacity-90 group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="flex h-full items-center justify-center"><span className="text-4xl font-black opacity-20 select-none" style={{ color: accent }}>{post.category?.[0] ?? "?"}</span></div>
        )}
        <div className="absolute top-2 left-2"><span className="px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>{post.category}</span></div>
        <div className="absolute top-2 right-2"><span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wide backdrop-blur-md ${statusStyle}`}>{post.status}</span></div>
        <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md text-[10px] text-zinc-300"><Users className="w-3 h-3" />{post.offersCount}</div>
        {expired && <div className="absolute inset-0 bg-black/50 flex items-center justify-center"><span className="text-xs font-semibold text-zinc-400 bg-black/60 px-3 py-1 rounded-full">Expired</span></div>}
      </div>
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100 group-hover:text-white">{post.title}</h3>
        <p className="line-clamp-2 text-[11px] text-zinc-500 leading-relaxed">{post.description}</p>
        <div className="mt-auto pt-1 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 text-[10px] text-zinc-600"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate max-w-20">{post.address}</span></div>
          <span className="text-[10px] text-zinc-600 shrink-0">{timeLabel}</span>
        </div>
      </div>
    </article>
  );
}

// ── Offer detail view (my submitted offer) ────────────────────────────────────
function OfferDetailView({ item, onBack, onInitiateChat }: { item: ActivityItem; onBack: () => void; onInitiateChat: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const post = item.postId;
  const cfg = OFFER_STATUS[item.status] ?? OFFER_STATUS.pending;
  const StatusIcon = cfg.icon;
  return (
    <div className="space-y-5">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />Back to My Activity
      </button>
      <div className={`flex items-start gap-3 px-4 py-3 rounded-2xl border text-[13px] leading-snug ${item.status === "accepted" ? "bg-emerald-950/30 border-emerald-900/40 text-emerald-300" : item.status === "rejected" ? "bg-red-950/30 border-red-900/40 text-red-300" : "bg-zinc-900/40 border-zinc-800/40 text-zinc-400"}`}>
        <StatusIcon className="w-5 h-5 shrink-0 mt-0.5" />
        <div>
          <p className="font-bold">{item.status === "accepted" ? "Offer Accepted!" : item.status === "rejected" ? "Offer Not Selected" : "Offer Under Review"}</p>
          <p className="text-[11px] mt-0.5 opacity-80">{item.status === "accepted" ? "The post author wants to work with you. Start a conversation!" : item.status === "rejected" ? "Your offer was not selected for this requirement." : "Your offer is being reviewed by the post author."}</p>
        </div>
      </div>
      <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#161619]">
          <div className="flex items-start gap-3">
            <img src={getAvatarUrl(post?.author?.name, post?.author?.avatar)} alt={post?.author?.name} className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0" onError={(e) => handleAvatarError(e, post?.author?.name)} referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-zinc-100">{post?.author?.name}</p>
              <span className="text-[11px] text-zinc-500 flex items-center gap-1"><MapPin className="w-3 h-3" />{post?.address}</span>
            </div>
            <span className={`shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-bold uppercase ${cfg.pill}`}><StatusIcon className="w-3 h-3" />{cfg.label}</span>
          </div>
        </div>
        <div className="px-5 py-4 space-y-3">
          <h2 className="text-[17px] font-black text-zinc-100 leading-snug">{post?.title}</h2>
          <p className="text-[12px] text-zinc-500 leading-relaxed">{post?.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {post?.category && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><Tag className="w-2.5 h-2.5" />{post.category}</span>}
            {post?.budget && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><IndianRupee className="w-2.5 h-2.5" />{post.budget}</span>}
            {post?.timeline && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><Clock className="w-2.5 h-2.5" />{post.timeline}</span>}
          </div>
          {post?.questions && post.questions.length > 0 && (
            <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-2 mt-2">
              <p className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider">Questions from poster</p>
              {post.questions.map((q, i) => <p key={i} className="text-[12px] text-zinc-400 pl-2 border-l border-[#FF3F3F]/20">{i + 1}. {q}</p>)}
            </div>
          )}
        </div>
      </div>
      <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
        <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">My Offer</p>
        <p className="text-[13px] text-zinc-300 leading-relaxed">{item.message}</p>
        <p className="text-[10px] text-zinc-700 font-mono">Submitted {new Date(item.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
        {item.answers && item.answers.length > 0 && (
          <>
            <button onClick={() => setExpanded((v) => !v)} className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer">
              {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
              {expanded ? "Hide Q&A" : "View Q&A answers"}
            </button>
            {expanded && (
              <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2"><HelpCircle className="w-3.5 h-3.5 text-[#FF3F3F]" /><p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Question Answers</p></div>
                {item.answers.map((ans, i) => (
                  <div key={i}>
                    <p className="text-[11px] text-zinc-500 font-medium"><span className="text-[#FF3F3F] font-bold">Q{i + 1}.</span> {ans.question}</p>
                    <p className="text-[12px] text-zinc-300 mt-0.5 pl-3 border-l border-[#FF3F3F]/20 leading-relaxed">{ans.answer || "—"}</p>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
      {item.status === "accepted" && (
        <button onClick={onInitiateChat} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[13px] font-bold transition-all duration-200 cursor-pointer">
          <MessageCircle className="w-4 h-4" />Start a conversation with {post?.author?.name?.split(" ")[0]}
        </button>
      )}
    </div>
  );
}

// ── Post owner dashboard (split layout) ───────────────────────────────────────
function PostOwnerDashboard({ post, onBack, onInitiateChat }: { post: Post; onBack: () => void; onInitiateChat: (postId: string) => void }) {
  const dispatch = useAppDispatch();
  const [offers, setOffers] = useState<BackendOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(true);
  const [offersError, setOffersError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [confirmed, setConfirmed] = useState<"delete" | "complete" | "expire" | null>(null);
  const postId = (post as any)._id || post.id;

  const fetchOffers = async () => {
    setOffersLoading(true); setOffersError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch(`/api/offers/post/${postId}`, { headers: token ? { Authorization: `${token}` } : {} });
      if (!res.ok) throw new Error("Failed to load offers");
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e: any) { setOffersError(e.message || "Failed to load offers"); }
    finally { setOffersLoading(false); }
  };
  useEffect(() => { fetchOffers(); }, [postId]);

  const handleOfferAction = async (offerId: string, action: "accept" | "reject") => {
    setActionLoading(offerId);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch(`/api/offers/${offerId}/${action === "accept" ? "accept" : "reject"}`, { method: "PATCH", headers: { "Content-Type": "application/json", ...(token ? { Authorization: `${token}` } : {}) } });
      if (!res.ok) throw new Error("Action failed");
      const newStatus = action === "accept" ? "accepted" : "rejected";
      setOffers((prev) => prev.map((o) => (o._id === offerId ? { ...o, status: newStatus } : o)));
    } catch {} finally { setActionLoading(null); }
  };

  const handleAction = async (type: "complete" | "delete" | "expire") => {
    if (confirmed !== type) { setConfirmed(type); return; }
    if (type === "complete") {
      setCompleting(true);
      try { await dispatch(updatePostStatusThunk(postId, "completed") as any); onBack(); } finally { setCompleting(false); setConfirmed(null); }
    } else if (type === "expire") {
      setExpiring(true);
      try { await dispatch(updatePostStatusThunk(postId, "expired") as any); onBack(); } finally { setExpiring(false); setConfirmed(null); }
    } else {
      setDeleting(true);
      try { await dispatch(deletePostThunk(postId) as any); onBack(); } finally { setDeleting(false); setConfirmed(null); }
    }
  };

  const pending = offers.filter((o) => o.status === "pending");
  const accepted = offers.filter((o) => o.status === "accepted");
  const gradient = CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";

  return (
    <div className="space-y-5 pb-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />Back to My Activity
      </button>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── LEFT: Post details + questions ── */}
        <div className="w-full lg:w-[420px] lg:shrink-0 space-y-4">
          {/* Post hero */}
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className={`relative h-28 bg-linear-to-br ${gradient}`}>
              {post.images?.length ? (
                <img src={post.images[0]} alt={post.title} className="h-full w-full object-cover opacity-60" />
              ) : (
                <div className="flex h-full items-center justify-center"><span className="text-5xl font-black opacity-10 select-none" style={{ color: accent }}>{post.category?.[0] ?? "?"}</span></div>
              )}
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-md" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>{post.category}</span>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase border backdrop-blur-md ${POST_STATUS_STYLE[post.status] || POST_STATUS_STYLE.live}`}>{post.status}</span>
              </div>
            </div>
            <div className="px-5 py-4 space-y-2">
              <h2 className="text-[18px] font-black text-zinc-100 leading-snug">{post.title}</h2>
              <p className="text-[12px] text-zinc-500 leading-relaxed">{post.description}</p>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {post.budget && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><IndianRupee className="w-2.5 h-2.5" />{post.budget}</span>}
                {post.timeline && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><Clock className="w-2.5 h-2.5" />{post.timeline}</span>}
                <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><MapPin className="w-2.5 h-2.5" />{post.address}</span>
              </div>
            </div>
            {/* Offers summary strip */}
            <div className="flex border-t border-[#161619]">
              {[{ label: "Awaiting", count: pending.length, color: "text-zinc-300" }, { label: "Accepted", count: accepted.length, color: "text-emerald-400" }, { label: "Rejected", count: offers.filter((o) => o.status === "rejected").length, color: "text-red-400" }].map(({ label, count, color }) => (
                <div key={label} className="flex-1 text-center py-3 border-r border-[#161619] last:border-r-0">
                  <p className={`text-[16px] font-black ${color}`}>{count}</p>
                  <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Questions */}
          {post.questions && post.questions.length > 0 && (
            <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
              <div className="flex items-center gap-2"><HelpCircle className="w-4 h-4 text-[#FF3F3F]" /><h3 className="text-[13px] font-bold text-zinc-100">Questions for Applicants</h3></div>
              <div className="space-y-2">
                {post.questions.map((q, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="shrink-0 w-5 h-5 rounded-full bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F] text-[10px] font-bold flex items-center justify-center">{i + 1}</span>
                    <p className="text-[12px] text-zinc-300 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Messages */}
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-4 flex items-center justify-between">
            <div className="flex items-center gap-2"><MessageCircle className="w-4 h-4 text-[#FF3F3F]" /><h3 className="text-[13px] font-bold text-zinc-100">Messages</h3></div>
            <button onClick={() => onInitiateChat(postId)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[11px] font-bold rounded-xl transition cursor-pointer"><MessageCircle className="w-3.5 h-3.5" />View all</button>
          </div>

          {/* Post actions */}
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl p-5 space-y-3">
            <p className="text-[11px] font-bold text-zinc-500 uppercase tracking-wider">Post Actions</p>
            <div className="flex flex-col gap-2">
              {post.status !== "completed" && (
                <button onClick={() => handleAction("complete")} disabled={completing}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "complete" ? "bg-emerald-900/60 border-2 border-emerald-500 text-emerald-300 animate-pulse" : "bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400"}`}>
                  {completing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle2 className="w-4 h-4" />}
                  {confirmed === "complete" ? "Tap again to confirm" : "Mark as Completed"}
                </button>
              )}
              {post.status === "live" && (
                <button onClick={() => handleAction("expire")} disabled={expiring}
                  className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "expire" ? "bg-amber-900/60 border-2 border-amber-500 text-amber-300 animate-pulse" : "bg-amber-950/30 hover:bg-amber-900/30 border border-amber-800/40 text-amber-400"}`}>
                  {expiring ? <Loader2 className="w-4 h-4 animate-spin" /> : <Clock className="w-4 h-4" />}
                  {confirmed === "expire" ? "Tap again to confirm" : "Mark as Expired"}
                </button>
              )}
              <button onClick={() => handleAction("delete")} disabled={deleting}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-[12px] font-bold transition cursor-pointer disabled:opacity-50 ${confirmed === "delete" ? "bg-red-900/60 border-2 border-red-500 text-red-300 animate-pulse" : "bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400"}`}>
                {deleting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                {confirmed === "delete" ? "Tap again to confirm" : "Delete Post"}
              </button>
            </div>
            {confirmed && <button onClick={() => setConfirmed(null)} className="w-full text-[11px] text-zinc-600 hover:text-zinc-400 transition cursor-pointer py-1">Cancel</button>}
          </div>
        </div>

        {/* ── RIGHT: Offers list ── */}
        <div className="flex-1 min-w-0">
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#161619] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF3F3F]" />
                <h3 className="text-[13px] font-bold text-zinc-100">Offers Received</h3>
                {!offersLoading && <span className="text-[10px] bg-[#161619] border border-[#222226] text-zinc-500 px-2 py-0.5 rounded-full">{offers.length}</span>}
              </div>
              <button onClick={fetchOffers} disabled={offersLoading} className="p-1.5 rounded-lg bg-[#161619] border border-[#222226] text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40"><RefreshCw className={`w-3 h-3 ${offersLoading ? "animate-spin" : ""}`} /></button>
            </div>
            {offersLoading ? (
              <div className="flex items-center justify-center py-10 gap-2 text-zinc-600"><Loader2 className="w-4 h-4 animate-spin" /><span className="text-[12px]">Loading offers…</span></div>
            ) : offersError ? (
              <div className="flex flex-col items-center py-10 gap-2 text-center px-6"><AlertCircle className="w-5 h-5 text-zinc-700" /><p className="text-[12px] text-zinc-500">{offersError}</p><button onClick={fetchOffers} className="text-[11px] text-[#FF3F3F] hover:underline cursor-pointer">Retry</button></div>
            ) : offers.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center px-6"><FileText className="w-6 h-6 text-zinc-700" /><p className="text-[13px] font-semibold text-zinc-400">No offers yet</p><p className="text-[11px] text-zinc-600 max-w-xs">When people respond to your post, their offers will appear here.</p></div>
            ) : (
              <div className="divide-y divide-[#161619]">
                {offers.map((offer) => {
                  const isExpanded = expandedOfferId === offer._id;
                  const isActioning = actionLoading === offer._id;
                  return (
                    <div key={offer._id} className="p-4 sm:p-5 hover:bg-[#0e0e10] transition-colors">
                      <div className="flex items-start gap-3">
                        <img src={getAvatarUrl(offer.offeredBy.name, offer.offeredBy.avatar)} alt={offer.offeredBy.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0" onError={(e) => handleAvatarError(e, offer.offeredBy.name)} referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-zinc-100">{offer.offeredBy.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${offer.status === "accepted" ? "bg-emerald-950/60 text-emerald-400 border-emerald-800/50" : offer.status === "rejected" ? "bg-red-950/60 text-red-400 border-red-800/50" : "bg-zinc-900 text-zinc-500 border-zinc-700"}`}>{offer.status}</span>
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{new Date(offer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <button onClick={() => setExpandedOfferId(isExpanded ? null : offer._id)} className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition cursor-pointer">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                      </div>
                      <p className={`mt-2.5 text-[12px] text-zinc-400 leading-relaxed pl-12 ${!isExpanded ? "line-clamp-2" : ""}`}>{offer.message}</p>
                      {isExpanded && (
                        <div className="pl-12 mt-3 space-y-3">
                          {offer.answers && offer.answers.length > 0 && (
                            <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-2.5">
                              <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Question Answers</p>
                              {offer.answers.map((ans, i) => (
                                <div key={i}>
                                  <p className="text-[11px] text-zinc-600 font-medium">Q: {ans.question}</p>
                                  <p className="text-[12px] text-zinc-300 mt-0.5 pl-2 border-l border-[#FF3F3F]/25 leading-relaxed">{ans.answer || "—"}</p>
                                </div>
                              ))}
                            </div>
                          )}
                          {offer.status === "pending" && (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleOfferAction(offer._id, "accept")} disabled={!!actionLoading} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}Accept
                              </button>
                              <button onClick={() => handleOfferAction(offer._id, "reject")} disabled={!!actionLoading} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}Reject
                              </button>
                            </div>
                          )}
                          {offer.status !== "pending" && offer.status === "accepted" && (
                            <button onClick={() => onInitiateChat(postId)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[11px] font-bold rounded-xl transition cursor-pointer">
                              <MessageCircle className="w-3.5 h-3.5" />Chat with {offer.offeredBy.name.split(" ")[0]}
                            </button>
                          )}
                        </div>
                      )}
                    </div>
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

// ── Filter type ───────────────────────────────────────────────────────────────
type FilterKey = "all" | "pending" | "accepted" | "rejected" | "mine";

// ── Main component ────────────────────────────────────────────────────────────
export default function MyActivity({ onInitiateChat }: { onInitiateChat: () => void }) {
  const { currentUser } = useAppSelector((s) => s.auth);
  const allPosts = useAppSelector((s) => s.posts);
  const [items, setItems] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [selectedOffer, setSelectedOffer] = useState<ActivityItem | null>(null);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);

  const myPosts = allPosts.filter((p) =>
    currentUser?._id ? p.author._id === currentUser._id : p.author.id === currentUser?.id
  );

  const fetchActivity = async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/api/offers/my-activity", { headers: token ? { Authorization: `${token}` } : {} });
      if (!res.ok) throw new Error("Failed to load activity");
      const data = await res.json();
      setItems(data.data || []);
    } catch (e: any) { setError(e.message || "Something went wrong"); }
    finally { setLoading(false); }
  };
  useEffect(() => { fetchActivity(); }, []);

  const counts = {
    all: items.length, pending: items.filter((i) => i.status === "pending").length,
    accepted: items.filter((i) => i.status === "accepted").length, rejected: items.filter((i) => i.status === "rejected").length,
    mine: myPosts.length,
  };

  if (selectedPost) {
    return (
      <PostOwnerDashboard post={selectedPost} onBack={() => setSelectedPost(null)}
        onInitiateChat={(_pid) => { setSelectedPost(null); onInitiateChat(); }} />
    );
  }
  if (selectedOffer) {
    return <OfferDetailView item={selectedOffer} onBack={() => setSelectedOffer(null)} onInitiateChat={onInitiateChat} />;
  }

  const filteredOffers = filter === "mine" ? [] : filter === "all" ? items : items.filter((i) => i.status === filter);
  const showMyPosts = filter === "mine" || filter === "all";

  const METRIC_TABS = [
    { key: "pending" as FilterKey, label: "Awaiting", icon: Clock, count: counts.pending, bg: "bg-[#0e0e10] border-[#1e1e22]", numColor: "text-zinc-100" },
    { key: "accepted" as FilterKey, label: "Accepted", icon: CheckCircle2, count: counts.accepted, bg: "bg-emerald-950/20 border-emerald-900/30", numColor: "text-emerald-400" },
    { key: "rejected" as FilterKey, label: "Rejected", icon: XCircle, count: counts.rejected, bg: "bg-red-950/20 border-red-900/30", numColor: "text-red-400" },
    { key: "mine" as FilterKey, label: "My Posts", icon: FileText, count: counts.mine, bg: "bg-indigo-950/20 border-indigo-900/30", numColor: "text-indigo-400" },
  ];
  const isEmptyState = !loading && items.length === 0 && myPosts.length === 0;

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black text-zinc-100 tracking-tight">My Activity</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">Track your offers and manage your own posts.</p>
        </div>
        <button onClick={fetchActivity} disabled={loading} className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] hover:border-[#2a2a2e] rounded-xl text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {!loading && !isEmptyState && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {METRIC_TABS.map(({ key, label, icon: Icon, count, bg, numColor }) => {
            const isActive = filter === key;
            return (
              <button key={key} onClick={() => setFilter(isActive ? "all" : key)}
                className={`relative flex flex-col items-center py-4 px-3 rounded-2xl border transition-all duration-200 cursor-pointer ${isActive ? "border-[#FF3F3F]/50 bg-[#FF3F3F]/8 shadow-md shadow-[#FF3F3F]/10 ring-1 ring-[#FF3F3F]/20" : `${bg} hover:border-zinc-700`}`}>
                <Icon className={`w-4 h-4 mb-1.5 ${isActive ? "text-[#FF3F3F]" : "text-zinc-600"}`} />
                <p className={`text-[24px] font-black tracking-tight leading-none ${isActive ? "text-[#FF3F3F]" : numColor}`}>{count}</p>
                <p className={`text-[10px] uppercase tracking-wider mt-1 ${isActive ? "text-[#FF3F3F]/80" : "text-zinc-600"}`}>{label}</p>
                {isActive && <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-[#FF3F3F]" />}
              </button>
            );
          })}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center"><AlertCircle className="w-5 h-5 text-zinc-700" /></div>
          <p className="text-[14px] font-semibold text-zinc-400">{error}</p>
          <button onClick={fetchActivity} className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer">Try again</button>
        </div>
      ) : isEmptyState ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0e0e10] border border-[#1e1e22] flex items-center justify-center"><Activity className="w-7 h-7 text-zinc-700" /></div>
          <div>
            <p className="text-[16px] font-bold text-zinc-300">No activity yet</p>
            <p className="text-[12px] text-zinc-600 mt-1 max-w-xs">Browse the feed and submit an offer, or create your first post to see activity here.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          {showMyPosts && myPosts.length > 0 && (
            <div className="space-y-3">
              {filter === "all" && (
                <div className="flex items-center gap-2"><FileText className="w-4 h-4 text-indigo-400" /><h2 className="text-[13px] font-bold text-zinc-300">My Posts</h2><span className="text-[10px] bg-indigo-950/40 border border-indigo-900/30 text-indigo-400 px-2 py-0.5 rounded-full font-bold">{myPosts.length}</span></div>
              )}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                {myPosts.map((post) => <MyPostGridCard key={post.id} post={post} onClick={() => setSelectedPost(post)} />)}
              </div>
            </div>
          )}
          {filter !== "mine" && (
            <div className="space-y-3">
              {filter === "all" && items.length > 0 && (
                <div className="flex items-center gap-2"><Activity className="w-4 h-4 text-[#FF3F3F]" /><h2 className="text-[13px] font-bold text-zinc-300">My Offers</h2><span className="text-[10px] bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F] px-2 py-0.5 rounded-full font-bold">{items.length}</span></div>
              )}
              {filteredOffers.length === 0 && filter !== "all" ? (
                <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
                  <p className="text-[14px] font-semibold text-zinc-400">No {filter === "pending" ? "awaiting" : filter} offers</p>
                  <button onClick={() => setFilter("all")} className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer">View all</button>
                </div>
              ) : filteredOffers.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
                  {filteredOffers.map((item) => <OfferGridCard key={item._id} item={item} onClick={() => setSelectedOffer(item)} />)}
                </div>
              ) : null}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

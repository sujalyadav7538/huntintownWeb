import { useEffect, useState, useCallback } from "react";
import { apiFetch } from "../lib/api";
import {
  Loader2, AlertCircle, CheckCircle2, XCircle, Clock, MapPin, IndianRupee,
  ChevronDown, ChevronUp, ChevronRight, CalendarDays, Inbox, Tag, HelpCircle, RefreshCw,
  Users, MessageSquare, ThumbsUp, ThumbsDown, MessageCircle, ArrowLeft,
  Trash2, Star, Zap, FileText,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError, getPostExpiryLabel } from "../utils";
import { useAppDispatch } from "../store/hooks";
import { deletePostThunk, updatePostStatusThunk } from "../store/thunks";

// ── Types ─────────────────────────────────────────────────────────────────────
interface ResponsePost {
  _id: string; title: string; description: string; category: string;
  address?: string; location?: string; budget?: string; timeline?: string;
  status: string; expiresAt: string; offersCount: number;
  questions?: string[]; createdAt: string;
  contactMethods?: { whatsApp?: boolean; phone?: boolean; chat?: boolean };
}
interface OfferApplicant { id: string; name: string; avatar: string | null; email?: string; }
interface Offer {
  _id: string; postId: string; message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string; offeredBy: OfferApplicant;
}
interface ResponseItem { post: ResponsePost; offers: Offer[]; }

// ── Status cfg ────────────────────────────────────────────────────────────────
const OFFER_STATUS_CFG = {
  accepted: { label: "Accepted", icon: CheckCircle2, pill: "bg-emerald-950/60 text-emerald-400 border-emerald-800/50", bar: "bg-emerald-500" },
  rejected:  { label: "Rejected", icon: XCircle,      pill: "bg-red-950/60 text-red-400 border-red-800/50",             bar: "bg-red-500" },
  pending:   { label: "Pending",  icon: Clock,         pill: "bg-zinc-900 text-zinc-400 border-zinc-700",               bar: "bg-zinc-700" },
} as const;

const POST_STATUS_STYLE: Record<string, string> = {
  live: "text-emerald-400 bg-emerald-950/40 border-emerald-800/50",
  in_progress: "text-blue-400 bg-blue-950/40 border-blue-800/50",
  completed: "text-zinc-500 bg-zinc-900 border-zinc-800",
  expired: "text-amber-400 bg-amber-950/40 border-amber-800/50",
  cancelled: "text-red-400 bg-red-950/30 border-red-800/40",
};

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

// ── Post summary card (grid / list) ──────────────────────────────────────────
function PostSummaryCard({ item, onClick }: { item: ResponseItem; onClick: () => void }) {
  const { post, offers } = item;
  const gradient = CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const pending = offers.filter((o) => o.status === "pending").length;
  const accepted = offers.filter((o) => o.status === "accepted").length;
  const statusStyle = POST_STATUS_STYLE[post.status] || POST_STATUS_STYLE.live;
  const addr = post.address || post.location || "";

  return (
    <article onClick={onClick} className="group overflow-hidden rounded-xl border border-zinc-800/60 bg-[#0e0e10] cursor-pointer transition-all duration-200 hover:border-zinc-700 hover:shadow-lg hover:shadow-black/40">

      {/* ── Mobile: horizontal list row ── */}
      <div className="flex sm:hidden items-center gap-3 p-3">
        {/* accent icon */}
        <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center" style={{ background: `${accent}18`, border: `1px solid ${accent}30` }}>
          <span className="text-[18px] font-black" style={{ color: accent }}>{post.category?.[0] ?? "?"}</span>
        </div>
        {/* text */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap">
            <h3 className="text-[13px] font-semibold text-zinc-100 truncate group-hover:text-white">{post.title}</h3>
            <span className={`shrink-0 px-1.5 py-0.5 rounded-full text-[9px] font-bold uppercase border ${statusStyle}`}>{post.status}</span>
          </div>
          <p className="text-[11px] text-zinc-500 truncate mt-0.5">{post.description}</p>
          {/* offers row below */}
          <div className="flex items-center gap-2 mt-1.5 flex-wrap">
            <span className="inline-flex items-center gap-1 text-[10px] text-zinc-500">
              <Users className="w-3 h-3" />{offers.length} offer{offers.length !== 1 ? "s" : ""}
            </span>
            {pending > 0 && <span className="text-[10px] font-bold text-[#FF3F3F]">{pending} new</span>}
            {accepted > 0 && <span className="text-[10px] font-semibold text-emerald-400">{accepted} accepted</span>}
            {addr && <span className="inline-flex items-center gap-1 text-[10px] text-zinc-600 truncate max-w-30"><MapPin className="w-2.5 h-2.5 shrink-0" />{addr}</span>}
          </div>
        </div>
        {/* chevron */}
        <ChevronRight className="w-4 h-4 text-zinc-700 shrink-0" />
      </div>

      {/* ── sm+: card layout ── */}
      <div className="hidden sm:flex flex-col">
        <div className={`relative h-32 bg-linear-to-br ${gradient} overflow-hidden`}>
          <div className="flex h-full items-center justify-center"><span className="text-4xl font-black opacity-20 select-none" style={{ color: accent }}>{post.category?.[0] ?? "?"}</span></div>
          <div className="absolute top-2 left-2 flex gap-1.5">
            <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold backdrop-blur-md" style={{ background: `${accent}22`, color: accent, border: `1px solid ${accent}44` }}>{post.category}</span>
          </div>
          <div className="absolute top-2 right-2"><span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase border backdrop-blur-md ${statusStyle}`}>{post.status}</span></div>
          <div className="absolute bottom-2 right-2 flex items-center gap-1 rounded-full bg-black/60 px-2 py-0.5 backdrop-blur-md text-[10px] text-zinc-300"><Users className="w-3 h-3" />{offers.length}</div>
          {pending > 0 && <div className="absolute bottom-2 left-2 flex items-center gap-1 rounded-full bg-[#FF3F3F]/80 px-2 py-0.5 backdrop-blur-md text-[10px] text-white font-bold">{pending} new</div>}
        </div>
        <div className="flex flex-1 flex-col gap-2 p-3">
          <h3 className="line-clamp-2 text-[13px] font-semibold leading-snug text-zinc-100 group-hover:text-white">{post.title}</h3>
          <p className="line-clamp-1 text-[11px] text-zinc-500">{post.description}</p>
          <div className="mt-auto pt-1 flex items-center justify-between gap-2">
            {addr && <div className="flex items-center gap-1.5 text-[10px] text-zinc-600"><MapPin className="w-3 h-3 shrink-0" /><span className="truncate max-w-20">{addr}</span></div>}
            {accepted > 0 && <span className="text-[10px] text-emerald-400 font-semibold shrink-0">{accepted} accepted</span>}
          </div>
        </div>
      </div>

    </article>
  );
}
//   );
// }

// ── Post detail split view ────────────────────────────────────────────────────
function PostDetailView({
  item, onBack, onStatusChange, onInitiateChat,
}: {
  item: ResponseItem;
  onBack: () => void;
  onStatusChange: (offerId: string, status: "accepted" | "rejected") => Promise<void>;
  onInitiateChat: () => void;
}) {
  const dispatch = useAppDispatch();
  const { post, offers } = item;
  const [expandedOfferId, setExpandedOfferId] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [expiring, setExpiring] = useState(false);
  const [confirmed, setConfirmed] = useState<"delete" | "complete" | "expire" | null>(null);

  const postId = post._id;
  const gradient = CATEGORY_GRADIENTS[post.category] || "from-zinc-900 to-zinc-800";
  const accent = CATEGORY_COLORS[post.category] || "#FF3F3F";
  const addr = post.address || post.location || "";
  const pending = offers.filter((o) => o.status === "pending");
  const accepted = offers.filter((o) => o.status === "accepted");
  const top10 = offers.slice(0, 10);

  const handleOfferAction = async (offerId: string, status: "accepted" | "rejected") => {
    setActionLoading(offerId);
    await onStatusChange(offerId, status);
    setActionLoading(null);
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

  return (
    <div className="space-y-5 pb-6">
      <button onClick={onBack} className="inline-flex items-center gap-2 text-[12px] text-zinc-500 hover:text-zinc-200 transition-colors cursor-pointer">
        <ArrowLeft className="w-4 h-4" />Back to Responses
      </button>

      <div className="flex flex-col lg:flex-row gap-5 items-start">

        {/* ── LEFT: Post details + questions + actions ── */}
        <div className="w-full lg:flex-1 lg:min-w-0 space-y-4">
          {/* Post hero */}
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className={`relative h-24 bg-linear-to-br ${gradient}`}>
              <div className="flex h-full items-center justify-center"><span className="text-5xl font-black opacity-10 select-none" style={{ color: accent }}>{post.category?.[0] ?? "?"}</span></div>
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
                {addr && <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400"><MapPin className="w-2.5 h-2.5" />{addr}</span>}
              </div>
            </div>
            <div className="flex border-t border-[#161619]">
              {[{ label: "Awaiting", count: pending.length, color: "text-zinc-300" }, { label: "Accepted", count: accepted.length, color: "text-emerald-400" }, { label: "Total", count: offers.length, color: "text-zinc-400" }].map(({ label, count, color }) => (
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

        {/* ── RIGHT: Top 10 Offers ── */}
        <div className="w-full lg:w-105 lg:shrink-0">
          <div className="bg-[#0c0c0e] border border-[#1e1e22] rounded-2xl overflow-hidden">
            <div className="px-5 py-3.5 border-b border-[#161619] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users className="w-4 h-4 text-[#FF3F3F]" />
                <h3 className="text-[13px] font-bold text-zinc-100">Top Offers</h3>
                <span className="text-[10px] bg-[#161619] border border-[#222226] text-zinc-500 px-2 py-0.5 rounded-full">{Math.min(offers.length, 10)} of {offers.length}</span>
              </div>
              <div className="flex gap-2 text-[10px]">
                <span className="text-zinc-500">{pending.length} pending</span>
                {accepted.length > 0 && <span className="text-emerald-400">{accepted.length} accepted</span>}
              </div>
            </div>

            {offers.length === 0 ? (
              <div className="flex flex-col items-center py-12 gap-3 text-center px-6">
                <MessageSquare className="w-6 h-6 text-zinc-700" />
                <p className="text-[13px] font-semibold text-zinc-400">No applicants yet</p>
                <p className="text-[11px] text-zinc-600 max-w-xs">When people respond to your post, their offers will appear here.</p>
              </div>
            ) : (
              <div className="divide-y divide-[#161619]">
                {top10.map((offer, idx) => {
                  const cfg = OFFER_STATUS_CFG[offer.status] ?? OFFER_STATUS_CFG.pending;
                  const StatusIcon = cfg.icon;
                  const isExpanded = expandedOfferId === offer._id;
                  const isActioning = actionLoading === offer._id;
                  return (
                    <div key={offer._id} className="p-4 hover:bg-[#0e0e10] transition-colors">
                      {/* Rank + avatar row */}
                      <div className="flex items-start gap-3">
                        <div className="shrink-0 w-6 h-6 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center">
                          <span className="text-[9px] font-bold text-zinc-500">#{idx + 1}</span>
                        </div>
                        <img src={getAvatarUrl(offer.offeredBy.name, offer.offeredBy.avatar || undefined)} alt={offer.offeredBy.name} className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0" onError={(e) => handleAvatarError(e, offer.offeredBy.name)} referrerPolicy="no-referrer" />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[13px] font-semibold text-zinc-100">{offer.offeredBy.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase ${cfg.pill}`}>{cfg.label}</span>
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-0.5">{new Date(offer.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</p>
                        </div>
                        <button onClick={() => setExpandedOfferId(isExpanded ? null : offer._id)} className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition cursor-pointer">
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                        </button>
                      </div>

                      <p className={`mt-2.5 text-[12px] text-zinc-400 leading-relaxed pl-15 ${!isExpanded ? "line-clamp-2" : ""}`}>{offer.message}</p>

                      {isExpanded && (
                        <div className="pl-15 mt-3 space-y-3">
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
                              <button onClick={() => handleOfferAction(offer._id, "accepted")} disabled={!!actionLoading} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsUp className="w-3.5 h-3.5" />}Accept
                              </button>
                              <button onClick={() => handleOfferAction(offer._id, "rejected")} disabled={!!actionLoading} className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400 text-[11px] font-bold rounded-xl transition cursor-pointer disabled:opacity-50">
                                {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <ThumbsDown className="w-3.5 h-3.5" />}Decline
                              </button>
                            </div>
                          )}
                          {offer.status === "accepted" && (
                            <button onClick={onInitiateChat} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#FF3F3F]/10 hover:bg-[#FF3F3F]/20 border border-[#FF3F3F]/30 text-[#FF3F3F] text-[11px] font-bold rounded-xl transition cursor-pointer">
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

// ── Main screen ───────────────────────────────────────────────────────────────
export default function MyResponses({ onInitiateChat }: { onInitiateChat: () => void }) {
  const [items, setItems] = useState<ResponseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ResponseItem | null>(null);

  const fetchResponses = useCallback(async () => {
    setLoading(true); setError(null);
    try {
      const token = localStorage.getItem("access_token");
      const res = await apiFetch("/api/offers/responses", { headers: token ? { Authorization: `${token}` } : {} });
      if (!res.ok) throw new Error("Failed to load responses");
      const data = await res.json();
      setItems(data.data || []);
    } catch (e: any) { setError(e.message || "Something went wrong"); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { fetchResponses(); }, [fetchResponses]);

  const handleStatusChange = useCallback(async (offerId: string, status: "accepted" | "rejected") => {
    const token = localStorage.getItem("access_token");
    const action = status === "accepted" ? "accept" : "reject";
    try {
      const res = await apiFetch(`/api/offers/${offerId}/${action}`, { method: "PATCH", headers: token ? { Authorization: `${token}` } : {} });
      if (!res.ok) throw new Error("Failed");
      setItems((prev) => prev.map((item) => ({ ...item, offers: item.offers.map((o) => o._id === offerId ? { ...o, status } : o) })));
      setSelected((prev) => prev ? { ...prev, offers: prev.offers.map((o) => o._id === offerId ? { ...o, status } : o) } : null);
    } catch {}
  }, []);

  const totalOffers = items.reduce((n, i) => n + i.offers.length, 0);
  const totalPending = items.reduce((n, i) => n + i.offers.filter((o) => o.status === "pending").length, 0);
  const totalAccepted = items.reduce((n, i) => n + i.offers.filter((o) => o.status === "accepted").length, 0);

  if (selected) {
    return <PostDetailView item={selected} onBack={() => setSelected(null)} onStatusChange={handleStatusChange} onInitiateChat={onInitiateChat} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-[22px] font-black text-zinc-100 tracking-tight">Responses</h1>
          <p className="text-[13px] text-zinc-500 mt-0.5">See everyone who applied to your posts — review, accept, or decline.</p>
        </div>
        <button onClick={fetchResponses} disabled={loading} className="shrink-0 p-2 bg-[#0e0e10] border border-[#1e1e22] hover:border-[#2a2a2e] rounded-xl text-zinc-500 hover:text-zinc-300 transition cursor-pointer disabled:opacity-40" title="Refresh">
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Stats */}
      {!loading && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { label: "Total Posts", value: items.length, color: "text-zinc-200", bg: "bg-[#0e0e10]" },
            { label: "Total Offers", value: totalOffers, color: "text-zinc-200", bg: "bg-[#0e0e10]" },
            { label: "Accepted", value: totalAccepted, color: "text-emerald-400", bg: "bg-emerald-950/20 border-emerald-900/30" },
            { label: "Pending", value: totalPending, color: "text-amber-400", bg: "bg-amber-950/20 border-amber-900/30" },
          ].map(({ label, value, color, bg }) => (
            <div key={label} className={`${bg} border border-[#1e1e22] rounded-2xl p-4 text-center`}>
              <p className={`text-[26px] font-black tracking-tight ${color}`}>{value}</p>
              <p className="text-[10px] text-zinc-600 uppercase tracking-wider mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      )}

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
        </div>
      ) : error ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-center">
          <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center"><AlertCircle className="w-5 h-5 text-zinc-700" /></div>
          <p className="text-[14px] font-semibold text-zinc-400">{error}</p>
          <button onClick={fetchResponses} className="text-[12px] text-[#FF3F3F] hover:underline cursor-pointer">Try again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-2xl bg-[#0e0e10] border border-[#1e1e22] flex items-center justify-center"><Inbox className="w-7 h-7 text-zinc-700" /></div>
          <div>
            <p className="text-[16px] font-bold text-zinc-300">No posts yet</p>
            <p className="text-[12px] text-zinc-600 mt-1 max-w-xs">Create a post to start receiving offers from the community.</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Posts with offers first */}
          {items.filter((i) => i.offers.length > 0).length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2"><Users className="w-4 h-4 text-[#FF3F3F]" /><h2 className="text-[13px] font-bold text-zinc-300">Posts with Offers</h2><span className="text-[10px] bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 text-[#FF3F3F] px-2 py-0.5 rounded-full font-bold">{items.filter((i) => i.offers.length > 0).length}</span></div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.filter((i) => i.offers.length > 0).map((item) => <PostSummaryCard key={item.post._id} item={item} onClick={() => setSelected(item)} />)}
              </div>
            </div>
          )}
          {/* Posts awaiting */}
          {items.filter((i) => i.offers.length === 0).length > 0 && (
            <div className="space-y-3">
              <p className="text-[10px] text-zinc-700 uppercase tracking-wider font-semibold px-1">Awaiting applicants ({items.filter((i) => i.offers.length === 0).length})</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.filter((i) => i.offers.length === 0).map((item) => <PostSummaryCard key={item.post._id} item={item} onClick={() => setSelected(item)} />)}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

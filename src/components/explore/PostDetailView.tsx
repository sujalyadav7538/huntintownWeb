import { useState, useEffect, FormEvent, useRef } from "react";
import {
  ArrowLeft, MapPin, Clock, IndianRupee, Users, CalendarDays,
  HelpCircle, Send, Loader2, CheckCircle2, LogIn, Phone, MessageCircle,
  Zap, BadgeCheck, Star,
} from "lucide-react";
import { Post, User } from "../../types";
import { apiFetch } from "../../lib/api";
import {
  isPostExpired, getPostExpiryLabel, handleAvatarError,
} from "../../utils";
import { useAppSelector } from "../../store/hooks";

interface BackendOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  offeredBy: { id: string; name: string; avatar: string; email?: string };
}

interface PostDetailViewProps {
  post: Post;
  onBack: () => void;
  onViewProfile?: (author: User) => void;
  onNavigateToLogin?: () => void;
}

const STATUS_DOT: Record<string, string> = {
  live: "bg-emerald-500",
  in_progress: "bg-yellow-500",
  completed: "bg-blue-500",
  expired: "bg-zinc-600",
  cancelled: "bg-red-700",
};

export default function PostDetailView({
  post, onBack, onViewProfile, onNavigateToLogin,
}: PostDetailViewProps) {
  const { isAuthenticated, currentUser, token } = useAppSelector((s) => s.auth);
  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [offers, setOffers] = useState<BackendOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);

  const postId = post._id || post.id;
  const expired = isPostExpired(post.expiresAt);
  const timeLabel = getPostExpiryLabel(post.expiresAt);

  useEffect(() => {
    setAnswers(new Array((post.questions || []).length).fill(""));
    setMessage("");
    setSubmitError(null);
    setSubmitted(false);
  }, [postId]);

  useEffect(() => {
    if (!postId || !isAuthenticated) return;
    setOffersLoading(true);
    const t = localStorage.getItem("access_token") || token || "";
    apiFetch(`/api/offers/post/${postId}`, {
      headers: { Authorization: t },
    })
      .then((r) => r.ok ? r.json() : { offers: [] })
      .then((d) => setOffers(d.offers || []))
      .catch(() => {})
      .finally(() => setOffersLoading(false));
  }, [postId, isAuthenticated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const t = localStorage.getItem("access_token") || token || "";
      const answersPayload = (post.questions || []).map((q, i) => ({
        question: q, answer: answers[i]?.trim() || "",
      }));
      const res = await apiFetch("/api/offers", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: t },
        body: JSON.stringify({ postId, message, answers: answersPayload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.message || "Failed to submit offer");
      }
      setSubmitted(true);
      setMessage("");
      setAnswers(new Array((post.questions || []).length).fill(""));
      // Re-fetch offers
      const r2 = await apiFetch(`/api/offers/post/${postId}`, {
        headers: { Authorization: t },
      });
      if (r2.ok) { const d2 = await r2.json(); setOffers(d2.offers || []); }
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-0 flex flex-col">
      {/* Back bar */}
      <div className="flex items-center gap-3 pb-4">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-800 bg-[#0e0e10] px-3 py-1.5 text-xs font-medium text-zinc-400 transition hover:border-zinc-700 hover:text-white"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back
        </button>
        <span className="text-xs text-zinc-600 truncate">{post.title}</span>
      </div>

      {/* Two-column layout */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        {/* ══ LEFT — Post detail ══ */}
        <div className="w-full lg:flex-1 space-y-5">

          {/* Header card */}
          <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] overflow-hidden">
            {/* Image banner */}
            {post.images?.length ? (
              <div className="relative h-52 sm:h-64 w-full overflow-hidden bg-zinc-900">
                <img
                  src={post.images[0]}
                  alt={post.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-[#0e0e10]/90 via-transparent to-transparent" />
              </div>
            ) : null}

            <div className="p-5 space-y-4">
              {/* Status row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-400">
                  <span className={`w-2 h-2 rounded-full ${STATUS_DOT[post.status] ?? "bg-zinc-600"}`} />
                  {post.status.replace("_", " ")}
                </span>
                <span className="h-3 w-px bg-zinc-800" />
                <span className="rounded-full bg-[#FF3F3F]/10 px-2.5 py-0.5 text-xs font-medium text-[#FF3F3F] border border-[#FF3F3F]/20">
                  {post.category}
                </span>
                {expired && (
                  <span className="rounded-full bg-zinc-800 px-2.5 py-0.5 text-xs text-zinc-500">Expired</span>
                )}
                {(post.title.toLowerCase().includes("urgent") || post.description.toLowerCase().includes("urgent")) && !expired && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[#FF3F3F]/15 px-2.5 py-0.5 text-[10px] font-black text-[#FF3F3F] border border-[#FF3F3F]/30 uppercase tracking-wide">
                    <Zap className="w-3 h-3" /> Urgent
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-xl sm:text-2xl font-bold text-white leading-snug">{post.title}</h1>

              {/* Author */}
              <button
                onClick={() => onViewProfile?.(post.author)}
                className="flex items-center gap-3 group/author"
              >
                <img
                  src={post.author.avatar || ""}
                  alt={post.author.name}
                  className="h-10 w-10 rounded-full object-cover ring-2 ring-zinc-800 group-hover/author:ring-[#FF3F3F]/40 transition-all shrink-0"
                  onError={(e) => handleAvatarError(e, post.author.name)}
                  referrerPolicy="no-referrer"
                />
                <div className="text-left">
                  <div className="flex items-center gap-1.5">
                    <span className="text-sm font-semibold text-zinc-100 group-hover/author:text-[#FF3F3F] transition-colors">
                      {post.author.name}
                    </span>
                    {post.author.isGovernmentVerified && (
                      <BadgeCheck className="w-4 h-4 text-blue-400" />
                    )}
                    {post.author.rating !== undefined && post.author.rating !== null && (
                      <span className="flex items-center gap-0.5 text-[11px] text-amber-400">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {post.author.rating.toFixed(1)}
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-zinc-500">{post.author.role}</span>
                </div>
              </button>
            </div>
          </div>

          {/* Description */}
          <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-2">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Description</h2>
            <p className="text-sm text-zinc-300 leading-relaxed whitespace-pre-wrap">{post.description}</p>
          </div>

          {/* Meta details */}
          <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5">
            <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-4">Details</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <MetaRow icon={<MapPin className="w-4 h-4" />} label="Location" value={post.address ?? "—"} />
              {post.budget && (
                <MetaRow icon={<IndianRupee className="w-4 h-4" />} label="Budget" value={`₹${post.budget}`} />
              )}
              {post.timeline && (
                <MetaRow icon={<Clock className="w-4 h-4" />} label="Timeline" value={post.timeline} />
              )}
              <MetaRow icon={<CalendarDays className="w-4 h-4" />} label="Expiry" value={timeLabel} />
              <MetaRow icon={<Users className="w-4 h-4" />} label="Offers" value={String(post.offersCount)} />
            </div>
          </div>

          {/* Contact methods */}
          {post.contactMethods && Object.values(post.contactMethods).some(Boolean) && (
            <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500 mb-3">Preferred Contact</h2>
              <div className="flex gap-2 flex-wrap">
                {post.contactMethods.whatsApp && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-green-800/40 bg-green-950/30 px-3 py-1 text-xs text-green-400">
                    <MessageCircle className="w-3 h-3" /> WhatsApp
                  </span>
                )}
                {post.contactMethods.phone && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-800/40 bg-blue-950/30 px-3 py-1 text-xs text-blue-400">
                    <Phone className="w-3 h-3" /> Phone
                  </span>
                )}
                {post.contactMethods.chat && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-purple-800/40 bg-purple-950/30 px-3 py-1 text-xs text-purple-400">
                    <MessageCircle className="w-3 h-3" /> In-app Chat
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Custom questions */}
          {post.questions && post.questions.length > 0 && (
            <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                Screening Questions
              </h2>
              <ul className="space-y-2">
                {post.questions.map((q, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-zinc-300">
                    <HelpCircle className="w-4 h-4 text-[#FF3F3F]/60 mt-0.5 shrink-0" />
                    {q}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Extra images */}
          {post.images && post.images.length > 1 && (
            <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-5 space-y-3">
              <h2 className="text-xs font-semibold uppercase tracking-widest text-zinc-500">Images</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {post.images.slice(1).map((src, i) => (
                  <img
                    key={i}
                    src={src}
                    alt={`${post.title} ${i + 2}`}
                    className="h-28 w-full rounded-xl object-cover border border-zinc-800"
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ══ RIGHT — Offers / respond panel ══ */}
        <div ref={panelRef} className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-4 space-y-4">
          {/* Offer count header */}
          <div className="flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-[#0e0e10] px-5 py-3">
            <span className="text-sm font-semibold text-white">Offers & Responses</span>
            <span className="rounded-full bg-[#FF3F3F]/10 px-2.5 py-0.5 text-xs font-bold text-[#FF3F3F]">
              {offersLoading ? "…" : offers.length}
            </span>
          </div>

          {/* Submit form / auth gate */}
          {!expired && (
            <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-4 space-y-3">
              {isAuthenticated ? (
                <form onSubmit={handleSubmit} className="space-y-3">
                  <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">Submit your offer</h3>

                  {/* Answers to screening questions */}
                  {(post.questions || []).map((q, i) => (
                    <div key={i} className="space-y-1">
                      <label className="text-[11px] text-zinc-400">{q}</label>
                      <input
                        type="text"
                        value={answers[i] ?? ""}
                        onChange={(e) => {
                          const next = [...answers];
                          next[i] = e.target.value;
                          setAnswers(next);
                        }}
                        className="w-full rounded-lg border border-zinc-800 bg-[#131316] px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-[#FF3F3F]/50 focus:outline-none"
                        placeholder="Your answer…"
                      />
                    </div>
                  ))}

                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={3}
                    className="w-full resize-none rounded-lg border border-zinc-800 bg-[#131316] px-3 py-2 text-xs text-zinc-100 placeholder-zinc-600 focus:border-[#FF3F3F]/50 focus:outline-none"
                    placeholder="Describe how you can help…"
                    required
                  />

                  {submitError && (
                    <p className="rounded-lg border border-red-800/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">{submitError}</p>
                  )}

                  {submitted && (
                    <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Offer submitted!
                    </p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting || !message.trim()}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3F3F] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e53535] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                    {submitting ? "Submitting…" : "Submit Offer"}
                  </button>
                </form>
              ) : (
                <div className="flex flex-col items-center gap-3 py-2 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 flex items-center justify-center">
                    <LogIn className="w-5 h-5 text-[#FF3F3F]" />
                  </div>
                  <p className="text-sm text-zinc-300 font-medium">Sign in to respond</p>
                  <p className="text-xs text-zinc-500">You need an account to submit offers or view other responses.</p>
                  <button
                    onClick={onNavigateToLogin}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FF3F3F] px-5 py-2 text-sm font-semibold text-white transition hover:bg-[#e53535]"
                  >
                    <LogIn className="w-4 h-4" /> Sign In
                  </button>
                </div>
              )}
            </div>
          )}

          {/* Existing offers list */}
          {isAuthenticated && (
            <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] divide-y divide-zinc-800/60 overflow-hidden">
              {offersLoading ? (
                <div className="space-y-3 p-4">
                  {[1, 2].map((i) => (
                    <div key={i} className="flex gap-2.5 animate-pulse">
                      <div className="h-8 w-8 rounded-full bg-zinc-800 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-2.5 w-24 rounded-full bg-zinc-800" />
                        <div className="h-2 w-full rounded-full bg-zinc-800/70" />
                        <div className="h-2 w-3/4 rounded-full bg-zinc-800/50" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : offers.length === 0 ? (
                <p className="px-4 py-6 text-center text-xs text-zinc-600">No offers yet. Be the first!</p>
              ) : (
                offers.map((offer) => (
                  <OfferCard key={offer._id} offer={offer} />
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5 shrink-0 text-zinc-500">{icon}</span>
      <div>
        <p className="text-[10px] uppercase tracking-widest text-zinc-600">{label}</p>
        <p className="text-sm text-zinc-200">{value}</p>
      </div>
    </div>
  );
}

function OfferCard({ offer }: { offer: BackendOffer }) {
  const STATUS_STYLE: Record<string, string> = {
    pending: "bg-zinc-800/60 text-zinc-400",
    accepted: "bg-emerald-950/60 text-emerald-400",
    rejected: "bg-red-950/60 text-red-400",
  };
  return (
    <div className="flex gap-3 p-3.5">
      <img
        src={offer.offeredBy.avatar || ""}
        alt={offer.offeredBy.name}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-800 shrink-0 mt-0.5"
        onError={(e) => handleAvatarError(e, offer.offeredBy.name)}
        referrerPolicy="no-referrer"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-xs font-semibold text-zinc-200 truncate">{offer.offeredBy.name}</span>
          <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium shrink-0 ${STATUS_STYLE[offer.status] || STATUS_STYLE.pending}`}>
            {offer.status}
          </span>
        </div>
        <p className="text-xs text-zinc-400 leading-relaxed">{offer.message}</p>
        {offer.answers?.filter((a) => a.answer).map((a, i) => (
          <div key={i} className="rounded-md bg-zinc-900/60 px-2 py-1 mt-1">
            <p className="text-[10px] text-zinc-500">{a.question}</p>
            <p className="text-[11px] text-zinc-300">{a.answer}</p>
          </div>
        ))}
        <p className="text-[10px] text-zinc-600">{new Date(offer.createdAt).toLocaleDateString()}</p>
      </div>
    </div>
  );
}

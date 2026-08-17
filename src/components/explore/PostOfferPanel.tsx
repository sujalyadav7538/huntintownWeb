import { useState, useEffect, FormEvent } from "react";
import {
  Send,
  Loader2,
  CheckCircle2,
  LogIn,
} from "lucide-react";
import { Post } from "../../types";
import { apiFetch } from "../../lib/api";
import { isPostExpired } from "../../utils";
import { handleAvatarError } from "../../utils";

interface BackendResponse {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
  respondedBy: { id: string; name: string; avatar: string; email?: string };
}

const STATUS_STYLE: Record<string, string> = {
  pending: "bg-zinc-800/60 text-zinc-400",
  accepted: "bg-emerald-950/60 text-emerald-400",
  rejected: "bg-red-950/60 text-red-400",
};

function OfferCard({ offer }: { offer: BackendResponse }) {
  return (
    <div className="flex gap-3 p-3.5">
      <img
        src={offer.respondedBy.avatar || ""}
        alt={offer.respondedBy.name}
        className="h-8 w-8 rounded-full object-cover ring-1 ring-zinc-800 shrink-0 mt-0.5"
        onError={(e) => handleAvatarError(e, offer.respondedBy.name)}
        referrerPolicy="no-referrer"
      />
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex items-center gap-2 justify-between">
          <span className="text-xs font-semibold text-zinc-200 truncate">
            {offer.respondedBy.name}
          </span>
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
        <p className="text-[10px] text-zinc-600">
          {new Date(offer.createdAt).toLocaleDateString()}
        </p>
      </div>
    </div>
  );
}

interface Props {
  post: Post;
  isAuthenticated: boolean;
  onNavigateToLogin?: () => void;
}

export default function PostOfferPanel({ post, isAuthenticated, onNavigateToLogin }: Props) {
  const postId = post._id || post.id;
  const expired = isPostExpired(post.expiresAt);

  const [answers, setAnswers] = useState<string[]>([]);
  const [message, setMessage] = useState("");
  const [responses, setResponses] = useState<BackendResponse[]>([]);
  const [responsesLoading, setResponsesLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setAnswers(new Array((post.questions || []).length).fill(""));
    setMessage("");
    setSubmitError(null);
    setSubmitted(false);
  }, [postId]);

  useEffect(() => {
    if (!postId || !isAuthenticated) return;
    setResponsesLoading(true);
    apiFetch(`/api/responses/post/${postId}`)
      .then((r) => (r.ok ? r.json() : { responses: [] }))
      .then((d) => setResponses(d.responses || []))
      .catch(() => {})
      .finally(() => setResponsesLoading(false));
  }, [postId, isAuthenticated]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const answersPayload = (post.questions || []).map((q, i) => ({
        question: q,
        answer: answers[i]?.trim() || "",
      }));
      const res = await apiFetch("/api/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ postId, message, answers: answersPayload }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error((err as any).message || "Failed to submit response");
      }
      setSubmitted(true);
      setMessage("");
      setAnswers(new Array((post.questions || []).length).fill(""));
      const r2 = await apiFetch(`/api/responses/post/${postId}`);
      if (r2.ok) setResponses((await r2.json()).responses || []);
    } catch (err: any) {
      setSubmitError(err.message || "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full lg:w-80 xl:w-96 lg:sticky lg:top-4 space-y-4">
      {/* Offer count */}
      <div className="flex items-center justify-between rounded-2xl border border-zinc-800/60 bg-[#0e0e10] px-5 py-3">
        <span className="text-sm font-semibold text-white">Responses</span>
        <span className="rounded-full bg-[#FF3F3F]/10 px-2.5 py-0.5 text-xs font-bold text-[#FF3F3F]">
          {responsesLoading ? "…" : responses.length}
        </span>
      </div>

      {/* Submit form / auth gate */}
      {!expired && (
        <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] p-4 space-y-3">
          {isAuthenticated ? (
            <form onSubmit={handleSubmit} className="space-y-3">
              <h3 className="text-xs font-semibold text-zinc-300 uppercase tracking-widest">
                Submit your response
              </h3>

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
                <p className="rounded-lg border border-red-800/40 bg-red-950/30 px-3 py-2 text-xs text-red-400">
                  {submitError}
                </p>
              )}

              {submitted && (
                <p className="flex items-center gap-1.5 text-xs text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Response submitted!
                </p>
              )}

              <button
                type="submit"
                disabled={submitting || !message.trim()}
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#FF3F3F] py-2.5 text-sm font-semibold text-white transition hover:bg-[#e53535] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
                {submitting ? "Submitting…" : "Submit Response"}
              </button>
            </form>
          ) : (
            <div className="flex flex-col items-center gap-3 py-2 text-center">
              <div className="w-10 h-10 rounded-2xl bg-[#FF3F3F]/10 border border-[#FF3F3F]/20 flex items-center justify-center">
                <LogIn className="w-5 h-5 text-[#FF3F3F]" />
              </div>
              <p className="text-sm text-zinc-300 font-medium">Sign in to respond</p>
              <p className="text-xs text-zinc-500">
                You need an account to submit a response or view other responses.
              </p>
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

      {/* Offers list */}
      {isAuthenticated && (
        <div className="rounded-2xl border border-zinc-800/60 bg-[#0e0e10] divide-y divide-zinc-800/60 overflow-hidden">
          {responsesLoading ? (
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
          ) : responses.length === 0 ? (
            <p className="px-4 py-6 text-center text-xs text-zinc-600">
              No responses yet. Be the first!
            </p>
          ) : (
            responses.map((r) => <OfferCard key={r._id} offer={r} />)
          )}
        </div>
      )}
    </div>
  );
}

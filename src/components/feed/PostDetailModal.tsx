import { useState, useEffect, FormEvent } from 'react';
import { MapPin, Clock, HelpCircle, Send, Loader2, X, IndianRupee, CheckCircle2, AlertCircle, Users, CalendarDays } from 'lucide-react';
import { Post, User } from '../../types';
import { isPostExpired, getPostExpiryLabel, getAvatarUrl, handleAvatarError } from '../../utils';

interface BackendOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: string;
  createdAt: string;
  offeredBy: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

interface PostDetailModalProps {
  focusedPost: Post;
  currentUser: User;
  onClose: () => void;
  onAddComment: (
    postId: string,
    commentContent: string,
    isOffer: boolean,
    offerBudget?: string,
    offerDuration?: string,
    answers?: { question: string; answer: string }[]
  ) => void;
}

const STATUS_STYLES: Record<string, string> = {
  accepted: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50',
  rejected:  'bg-red-950/60 text-red-400 border-red-800/50',
  pending:   'bg-zinc-900 text-zinc-500 border-zinc-800',
};

export default function PostDetailModal({
  focusedPost,
  currentUser,
  onClose,
  onAddComment,
}: PostDetailModalProps) {
  const [newCommentText, setNewCommentText] = useState('');
  const [answers, setAnswers] = useState<string[]>([]);
  const [backendOffers, setBackendOffers] = useState<BackendOffer[]>([]);
  const [offersLoading, setOffersLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const postId = (focusedPost as any)._id || focusedPost.id;
  const expired = isPostExpired(focusedPost.expiresAt);

  useEffect(() => {
    setAnswers(new Array((focusedPost.questions || []).length).fill(''));
  }, [focusedPost?.id, focusedPost?.questions]);

  useEffect(() => {
    if (!postId) return;
    const fetchOffers = async () => {
      setOffersLoading(true);
      try {
        const token = localStorage.getItem('access_token');
        const res = await fetch(`/api/offers/post/${postId}`, {
          headers: token ? { Authorization: `${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setBackendOffers(data.offers || []);
        }
      } catch (err) {
        console.error('Failed to fetch offers', err);
      } finally {
        setOffersLoading(false);
      }
    };
    fetchOffers();
  }, [postId]);

  const handleCommentSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const answersPayload = (focusedPost.questions || []).map((q, idx) => ({
      question: q,
      answer: answers[idx]?.trim() || '',
    }));

    setSubmitting(true);
    setSubmitError(null);

    try {
      const token = localStorage.getItem('access_token');
      console.log('Submitting offer with answers:', token);
      const res = await fetch('/api/offers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `${token}` } : {}),
        },
        body: JSON.stringify({ postId, message: newCommentText, answers: answersPayload }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.message || 'Failed to submit offer');
      }

      onAddComment(focusedPost.id, newCommentText, true, undefined, undefined, answersPayload);

      const refreshRes = await fetch(`/api/offers/post/${postId}`, {
        headers: token ? { Authorization: `${token}` } : {},
      });
      if (refreshRes.ok) {
        const data = await refreshRes.json();
        setBackendOffers(data.offers || []);
      }

      setNewCommentText('');
      setAnswers(new Array((focusedPost.questions || []).length).fill(''));
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 3000);
    } catch (err: any) {
      setSubmitError(err.message || 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    /* Backdrop */
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      {/* Panel */}
      <div
        className="bg-[#0c0c0e] border border-[#1e1e22] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#161619] shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-2 h-2 rounded-full bg-[#FF3F3F] shrink-0" />
            <h2 className="text-[13px] font-bold text-zinc-100 truncate">{focusedPost.title}</h2>
            <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] text-zinc-500 font-medium">
              <Users className="w-2.5 h-2.5" />
              {offersLoading ? '…' : backendOffers.length}
            </span>
          </div>
          <button
            id="close-focus-modal"
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] hover:border-[#2a2a2e] transition-colors cursor-pointer ml-2"
          >
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* ── Scrollable body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          <div className="p-5 space-y-5">

            {/* ── Author + meta ── */}
            <div className="flex items-start gap-3">
              <img
                src={getAvatarUrl(focusedPost.author.name, focusedPost.author.avatar)}
                alt={focusedPost.author.name}
                className="w-10 h-10 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0 mt-0.5"
                onError={(e) => handleAvatarError(e, focusedPost.author.name)}
                referrerPolicy="no-referrer"
              />
              <div className="flex-1 min-w-0">
                <p className="text-[13px] font-semibold text-zinc-100">{focusedPost.author.name}</p>
                {focusedPost.author.role && (
                  <p className="text-[11px] text-zinc-500 mt-0.5">{focusedPost.author.role}</p>
                )}
                <div className="flex flex-wrap items-center gap-2.5 mt-1.5">
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                    <MapPin className="w-3 h-3 text-zinc-600" />{focusedPost.location}
                  </span>
                  <span className="text-zinc-700">·</span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-zinc-500">
                    <CalendarDays className="w-3 h-3 text-zinc-600" />
                    {new Date(focusedPost.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </span>
                  <span className="text-zinc-700">·</span>
                  {expired ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-red-400 uppercase">
                      <AlertCircle className="w-3 h-3" />Expired
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-400 uppercase">
                      <Clock className="w-3 h-3" />{getPostExpiryLabel(focusedPost.expiresAt)}
                    </span>
                  )}
                </div>
              </div>
              {focusedPost.budget && (
                <div className="shrink-0 flex flex-col items-end">
                  <span className="text-[10px] text-zinc-600 uppercase tracking-wider mb-0.5">Budget</span>
                  <span className="inline-flex items-center gap-0.5 text-[13px] font-bold text-zinc-200">
                    <IndianRupee className="w-3 h-3 text-[#FF3F3F]" />
                    {focusedPost.budget}
                  </span>
                </div>
              )}
            </div>

            {/* ── Description ── */}
            <div className="bg-[#0e0e10] border border-[#1a1a1e] rounded-xl p-4">
              <p className="text-[12px] text-zinc-400 leading-relaxed">{focusedPost.description}</p>
            </div>

            {/* ── Custom Questions ── */}
            {focusedPost.questions && focusedPost.questions.length > 0 && (
              <div className="bg-[#0e0e10] border border-[#1a1a1e] rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-2 mb-1">
                  <HelpCircle className="w-3.5 h-3.5 text-[#FF3F3F]" />
                  <span className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">Required Questions</span>
                </div>
                {focusedPost.questions.map((q, i) => (
                  <div key={i} className="flex gap-2.5">
                    <span className="shrink-0 text-[10px] font-black text-[#FF3F3F] font-mono mt-0.5">Q{i + 1}</span>
                    <p className="text-[12px] text-zinc-300 leading-relaxed">{q}</p>
                  </div>
                ))}
              </div>
            )}

            {/* ── Offers list ── */}
            <div className="space-y-2.5">
              <div className="flex items-center justify-between">
                <h3 className="text-[11px] font-bold text-zinc-400 uppercase tracking-wider">
                  Proposals ({offersLoading ? '…' : backendOffers.length})
                </h3>
              </div>

              {offersLoading ? (
                <div className="flex items-center justify-center py-10 gap-2 text-zinc-600">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-[12px]">Loading proposals…</span>
                </div>
              ) : backendOffers.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  <div className="w-10 h-10 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center mb-3">
                    <Users className="w-4 h-4 text-zinc-700" />
                  </div>
                  <p className="text-[12px] text-zinc-500">No proposals yet</p>
                  <p className="text-[11px] text-zinc-700 mt-0.5">Be the first to offer help</p>
                </div>
              ) : (
                <div className="space-y-2.5">
                  {backendOffers.map((offer) => (
                    <div
                      key={offer._id}
                      className="bg-[#0e0e10] border border-[#1a1a1e] rounded-xl p-4 space-y-3"
                    >
                      {/* Offer author */}
                      <div className="flex items-center gap-2.5">
                        <img
                          src={getAvatarUrl(offer.offeredBy.name, offer.offeredBy.avatar)}
                          alt={offer.offeredBy.name}
                          className="w-8 h-8 rounded-full object-cover ring-2 ring-[#1a1a1e] shrink-0"
                          onError={(e) => handleAvatarError(e, offer.offeredBy.name)}
                          referrerPolicy="no-referrer"
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-[12px] font-semibold text-zinc-100">{offer.offeredBy.name}</span>
                            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${STATUS_STYLES[offer.status] || STATUS_STYLES.pending}`}>
                              {offer.status}
                            </span>
                          </div>
                          <p className="text-[10px] text-zinc-600 mt-0.5">
                            {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </p>
                        </div>
                      </div>

                      {/* Message */}
                      <p className="text-[12px] text-zinc-400 leading-relaxed pl-10.5">{offer.message}</p>

                      {/* Answers */}
                      {offer.answers && offer.answers.length > 0 && (
                        <div className="pl-10.5 space-y-2 border-t border-[#161619] pt-3">
                          {offer.answers.map((ans, aIdx) => (
                            <div key={aIdx}>
                              <p className="text-[10px] text-zinc-600 font-medium">Q: {ans.question}</p>
                              <p className="text-[12px] text-zinc-300 mt-0.5 pl-2 border-l border-[#FF3F3F]/25">{ans.answer || '—'}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Footer: submit form or expired state ── */}
        {expired ? (
          <div className="px-5 py-4 border-t border-[#161619] flex items-center gap-3 bg-[#0a0a0c] shrink-0">
            <AlertCircle className="w-4 h-4 text-zinc-600 shrink-0" />
            <p className="text-[12px] text-zinc-600">This post has expired. No more proposals can be submitted.</p>
          </div>
        ) : (
          <form
            onSubmit={handleCommentSubmit}
            className="border-t border-[#161619] p-4 space-y-3 bg-[#0a0a0c] shrink-0"
          >
            {/* Success banner */}
            {submitted && (
              <div className="flex items-center gap-2 px-3 py-2 bg-emerald-950/50 border border-emerald-800/40 rounded-xl text-[12px] text-emerald-400">
                <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                Offer submitted successfully!
              </div>
            )}

            {/* Error banner */}
            {submitError && (
              <div className="flex items-center gap-2 px-3 py-2 bg-red-950/50 border border-red-800/40 rounded-xl text-[12px] text-red-400">
                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                {submitError}
              </div>
            )}

            {/* Question answers */}
            {focusedPost.questions && focusedPost.questions.length > 0 && (
              <div className="space-y-2 bg-[#0e0e10] border border-[#1a1a1e] rounded-xl p-3.5">
                <div className="flex items-center gap-1.5 mb-0.5">
                  <HelpCircle className="w-3 h-3 text-[#FF3F3F]" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Answer Required Questions</span>
                </div>
                {focusedPost.questions.map((q, qIndex) => (
                  <div key={qIndex} className="space-y-1">
                    <label className="block text-[11px] text-zinc-500 font-medium">
                      <span className="text-[#FF3F3F] font-bold">Q{qIndex + 1}.</span> {q}
                    </label>
                    <input
                      id={`responder-answer-input-${qIndex}`}
                      type="text"
                      placeholder="Your answer…"
                      value={answers[qIndex] || ''}
                      onChange={(e) => {
                        const updated = [...answers];
                        updated[qIndex] = e.target.value;
                        setAnswers(updated);
                      }}
                      className="w-full text-[12px] px-3 py-2 bg-[#111113] border border-[#1e1e22] text-zinc-100 rounded-lg placeholder-zinc-700 focus:outline-none focus:border-[#FF3F3F]/50 transition-colors"
                      required
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Message + submit */}
            <div className="flex gap-2.5 items-start">
              <textarea
                id="modal-comment-text-input"
                rows={2}
                placeholder="Describe your offer — skills, timeline, why you're the right fit…"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
                className="flex-1 text-[12px] px-3.5 py-2.5 bg-[#0e0e10] border border-[#1e1e22] text-zinc-100 rounded-xl placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50 transition-colors resize-none"
                required
                disabled={submitting}
              />
              <button
                id="submit-modal-comment-btn"
                type="submit"
                disabled={submitting}
                className="shrink-0 inline-flex items-center gap-1.5 px-4 py-2.5 bg-[#FF3F3F] hover:bg-[#e53535] text-white text-[12px] font-bold rounded-xl transition-all duration-200 shadow-md shadow-[#FF3F3F]/20 hover:shadow-[#FF3F3F]/30 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 cursor-pointer"
              >
                {submitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <><Send className="w-3.5 h-3.5" />Send</>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

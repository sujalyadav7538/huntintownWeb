import { useState, useEffect } from 'react';
import {
  X, Loader2, Users, CheckCircle2, XCircle, Clock,
  MapPin, MessageSquare, AlertCircle, ChevronDown, ChevronUp,
} from 'lucide-react';
import { apiFetch } from '../../lib/api';
import { Post } from '../../types';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface BackendOffer {
  _id: string;
  postId: string;
  message: string;
  answers: { question: string; answer: string }[];
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  offeredBy: {
    id: string;
    name: string;
    email: string;
    avatar: string;
  };
}

interface OffersReceivedModalProps {
  post: Post;
  onClose: () => void;
}

const STATUS_CONFIG = {
  accepted: { label: 'Accepted', class: 'bg-emerald-950/60 text-emerald-400 border-emerald-800/50' },
  rejected: { label: 'Rejected', class: 'bg-red-950/60 text-red-400 border-red-800/50' },
  pending:  { label: 'Pending',  class: 'bg-zinc-900 text-zinc-500 border-zinc-700' },
};

export default function OffersReceivedModal({ post, onClose }: OffersReceivedModalProps) {
  const [offers, setOffers] = useState<BackendOffer[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null); // offerId being actioned
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const postId = (post as any)._id || post.id;

  const fetchOffers = async () => {
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('access_token');
      const res = await apiFetch(`/api/offers/post/${postId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) throw new Error('Failed to load offers');
      const data = await res.json();
      setOffers(data.offers || []);
    } catch (e: any) {
      setError(e.message || 'Failed to load offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOffers(); }, [postId]);

  const handleStatus = async (offerId: string, newStatus: 'accepted' | 'rejected') => {
    setActionLoading(offerId);
    try {
      const token = localStorage.getItem('access_token');
      const res = await apiFetch(`/api/offers/${offerId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error('Action failed');
      setOffers((prev) =>
        prev.map((o) => (o._id === offerId ? { ...o, status: newStatus } : o))
      );
    } catch {
      // silently keep old status on error
    } finally {
      setActionLoading(null);
    }
  };

  const pending  = offers.filter((o) => o.status === 'pending');
  const accepted = offers.filter((o) => o.status === 'accepted');
  const rejected = offers.filter((o) => o.status === 'rejected');

  return (
    <div
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-[#0c0c0e] border border-[#1e1e22] rounded-t-3xl sm:rounded-2xl w-full sm:max-w-2xl max-h-[92vh] flex flex-col overflow-hidden shadow-2xl shadow-black/60"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-start justify-between gap-3 px-5 py-4 border-b border-[#161619] shrink-0">
          <div className="min-w-0">
            <div className="flex items-center gap-2 mb-0.5">
              <div className="w-2 h-2 rounded-full bg-[#FF3F3F] shrink-0" />
              <h2 className="text-[13px] font-bold text-zinc-100 truncate">Offers Received</h2>
              {!loading && (
                <span className="shrink-0 inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] text-zinc-500 font-medium">
                  <Users className="w-2.5 h-2.5" />
                  {offers.length}
                </span>
              )}
            </div>
            <p className="text-[11px] text-zinc-500 truncate pl-4">{post.title}</p>
          </div>
          <button
            onClick={onClose}
            className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition-colors cursor-pointer mt-0.5"
          >
            <X className="w-3.5 h-3.5 text-zinc-500" />
          </button>
        </div>

        {/* ── Summary strip ── */}
        {!loading && offers.length > 0 && (
          <div className="flex gap-0 border-b border-[#161619] shrink-0">
            {[
              { label: 'Pending',  count: pending.length,  color: 'text-zinc-400' },
              { label: 'Accepted', count: accepted.length, color: 'text-emerald-400' },
              { label: 'Rejected', count: rejected.length, color: 'text-red-400' },
            ].map(({ label, count, color }) => (
              <div key={label} className="flex-1 text-center py-2.5 border-r border-[#161619] last:border-r-0">
                <p className={`text-[15px] font-black ${color}`}>{count}</p>
                <p className="text-[10px] text-zinc-600 uppercase tracking-wider">{label}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Body ── */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {loading ? (
            <div className="flex items-center justify-center py-16 gap-2 text-zinc-600">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span className="text-[12px]">Loading offers…</span>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center py-16 gap-2 text-center px-6">
              <AlertCircle className="w-6 h-6 text-zinc-700" />
              <p className="text-[13px] text-zinc-500">{error}</p>
              <button
                onClick={fetchOffers}
                className="mt-1 text-[11px] text-[#FF3F3F] hover:underline cursor-pointer"
              >
                Retry
              </button>
            </div>
          ) : offers.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 gap-3 text-center px-6">
              <div className="w-12 h-12 rounded-2xl bg-[#1a1a1e] border border-[#222226] flex items-center justify-center">
                <MessageSquare className="w-5 h-5 text-zinc-700" />
              </div>
              <p className="text-[13px] font-semibold text-zinc-400">No offers yet</p>
              <p className="text-[11px] text-zinc-600 max-w-xs">
                When people respond to your post, their offers will appear here.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-[#161619]">
              {offers.map((offer) => {
                const expanded = expandedId === offer._id;
                const isActioning = actionLoading === offer._id;
                const statusCfg = STATUS_CONFIG[offer.status] || STATUS_CONFIG.pending;

                return (
                  <div key={offer._id} className="p-4 sm:p-5 hover:bg-[#0e0e10] transition-colors">
                    {/* ── Offer header row ── */}
                    <div className="flex items-start gap-3">
                      <img
                        src={getAvatarUrl(offer.offeredBy.name, offer.offeredBy.avatar)}
                        alt={offer.offeredBy.name}
                        className="w-9 h-9 rounded-full object-cover ring-2 ring-[#1e1e22] shrink-0 mt-0.5"
                        onError={(e) => handleAvatarError(e, offer.offeredBy.name)}
                        referrerPolicy="no-referrer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[13px] font-semibold text-zinc-100">{offer.offeredBy.name}</span>
                          <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${statusCfg.class}`}>
                            {statusCfg.label}
                          </span>
                        </div>
                        <div className="flex items-center gap-3 mt-0.5 text-[11px] text-zinc-600">
                          <span className="flex items-center gap-0.5">
                            <Clock className="w-3 h-3" />
                            {new Date(offer.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                        </div>
                      </div>

                      {/* Expand toggle */}
                      <button
                        onClick={() => setExpandedId(expanded ? null : offer._id)}
                        className="shrink-0 w-7 h-7 rounded-full bg-[#161619] border border-[#222226] flex items-center justify-center hover:bg-[#1e1e22] transition-colors cursor-pointer"
                      >
                        {expanded
                          ? <ChevronUp className="w-3.5 h-3.5 text-zinc-500" />
                          : <ChevronDown className="w-3.5 h-3.5 text-zinc-500" />}
                      </button>
                    </div>

                    {/* ── Message preview (always visible) ── */}
                    <p className={`mt-2.5 text-[12px] text-zinc-400 leading-relaxed pl-12 ${!expanded ? 'line-clamp-2' : ''}`}>
                      {offer.message}
                    </p>

                    {/* ── Expanded: Q&A + actions ── */}
                    {expanded && (
                      <div className="pl-12 mt-3 space-y-3">

                        {/* Q&A answers */}
                        {offer.answers && offer.answers.length > 0 && (
                          <div className="bg-[#111113] border border-[#1e1e22] rounded-xl p-3.5 space-y-2.5">
                            <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Question Answers</p>
                            {offer.answers.map((ans, i) => (
                              <div key={i}>
                                <p className="text-[11px] text-zinc-600 font-medium">Q: {ans.question}</p>
                                <p className="text-[12px] text-zinc-300 mt-0.5 pl-2 border-l border-[#FF3F3F]/25 leading-relaxed">
                                  {ans.answer || '—'}
                                </p>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Accept / Reject actions — only for pending offers */}
                        {offer.status === 'pending' && (
                          <div className="flex items-center gap-2 pt-1">
                            <button
                              onClick={() => handleStatus(offer._id, 'accepted')}
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-950/50 hover:bg-emerald-900/50 border border-emerald-800/50 text-emerald-400 text-[11px] font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                              Accept
                            </button>
                            <button
                              onClick={() => handleStatus(offer._id, 'rejected')}
                              disabled={!!actionLoading}
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-950/30 hover:bg-red-900/30 border border-red-800/40 text-red-400 text-[11px] font-bold rounded-xl transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              {isActioning ? <Loader2 className="w-3 h-3 animate-spin" /> : <XCircle className="w-3.5 h-3.5" />}
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Already actioned state */}
                        {offer.status !== 'pending' && (
                          <p className="text-[11px] text-zinc-600 italic">
                            You {offer.status} this offer.
                          </p>
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
  );
}

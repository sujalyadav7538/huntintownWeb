"use client";

import React, { useEffect, useState } from 'react';
import { Post } from '../../types';
import { apiFetch } from '../../lib/api';
import { CheckCircle2, AlertCircle, RefreshCw, Trash, Inbox, Loader2 } from 'lucide-react';

interface PublishedListingItemProps {
  key?: string | number;
  post: Post;
  onUpdateStatus: (postId: string, status: 'open' | 'fulfilled' | 'cancelled') => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  onViewOffers: (post: Post) => void;
}

export default function PublishedListingItem({
  post,
  onUpdateStatus,
  onDeleteListing,
  onSelectPost,
  onViewOffers,
}: PublishedListingItemProps) {
  const [offerCount, setOfferCount] = useState<number | null>(null);
  const postId = (post as any)._id || post.id;

  useEffect(() => {
    const fetchCount = async () => {
      try {
        const token = localStorage.getItem('access_token');
        const res = await apiFetch(`/api/offers/post/${postId}`, {
          headers: token ? { Authorization: `Bearer ${token}` } : {},
        });
        if (res.ok) {
          const data = await res.json();
          setOfferCount((data.offers || []).length);
        }
      } catch {
        // fail silently — count just won't show
      }
    };
    fetchCount();
  }, [postId]);

  return (
    <div className="p-4 sm:p-5 hover:bg-[#0e0e10] transition-colors font-sans text-left">
      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">

        {/* ── Left: meta + title ── */}
        <div className="space-y-1.5 min-w-0 flex-1">
          <div className="flex items-center gap-1.5 flex-wrap">
            <span className="text-[9px] font-bold text-zinc-500 border border-zinc-800 px-1.5 py-0.5 rounded-full uppercase tracking-wide">
              {post.category}
            </span>
            <span className="text-[9px] text-[#FF3F3F] border border-[#FF3F3F]/30 bg-[#FF3F3F]/8 font-bold px-1.5 py-0.5 rounded-full">
              {post.budget || 'Negotiable'}
            </span>
            <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
              post.status === 'open'
                ? 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50'
                : post.status === 'fulfilled'
                ? 'text-zinc-500 bg-zinc-900 border-zinc-800'
                : 'text-amber-400 bg-amber-950/40 border-amber-800/50'
            }`}>
              {post.status.toUpperCase()}
            </span>
          </div>

          <h4
            onClick={() => onSelectPost(post.id)}
            className="text-[13px] font-semibold text-zinc-100 hover:text-[#FF3F3F] transition-colors cursor-pointer leading-snug"
          >
            {post.title}
          </h4>
          <p className="text-[11px] text-zinc-500 line-clamp-1">{post.description}</p>
        </div>

        {/* ── Right: offer count + actions ── */}
        <div className="flex items-center gap-2 shrink-0 self-start sm:self-center">

          {/* View Offers button — prominent call to action */}
          <button
            onClick={() => onViewOffers(post)}
            className="relative inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#0e0e10] hover:bg-[#161619] border border-[#2a2a2e] hover:border-[#FF3F3F]/40 text-zinc-300 hover:text-zinc-100 text-[11px] font-semibold rounded-xl transition-all duration-200 cursor-pointer"
          >
            <Inbox className="w-3.5 h-3.5 text-zinc-500" />
            <span>Offers</span>
            {offerCount === null ? (
              <Loader2 className="w-2.5 h-2.5 animate-spin text-zinc-600" />
            ) : offerCount > 0 ? (
              <span className="absolute -top-1.5 -right-1.5 min-w-4.5 h-4.5 px-1 bg-[#FF3F3F] text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-sm shadow-[#FF3F3F]/30">
                {offerCount}
              </span>
            ) : null}
          </button>

          {/* Status controls */}
          <div className="flex items-center gap-1">
            {post.status === 'open' && (
              <button
                id={`mark-fulfilled-${post.id}`}
                onClick={() => onUpdateStatus(post.id, 'fulfilled')}
                className="p-1.5 bg-[#161619] hover:bg-emerald-950/40 border border-[#222226] hover:border-emerald-800/50 text-zinc-500 hover:text-emerald-400 rounded-lg transition-all cursor-pointer"
                title="Mark Fulfilled"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
              </button>
            )}
            {post.status !== 'open' && (
              <button
                id={`reopen-${post.id}`}
                onClick={() => onUpdateStatus(post.id, 'open')}
                className="p-1.5 bg-[#161619] hover:bg-[#1e1e22] border border-[#222226] text-zinc-500 hover:text-zinc-300 rounded-lg transition-all cursor-pointer"
                title="Reopen"
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
            )}
            {post.status === 'open' && (
              <button
                id={`cancel-${post.id}`}
                onClick={() => onUpdateStatus(post.id, 'cancelled')}
                className="p-1.5 bg-[#161619] hover:bg-amber-950/30 border border-[#222226] hover:border-amber-800/40 text-zinc-500 hover:text-amber-400 rounded-lg transition-all cursor-pointer"
                title="Cancel"
              >
                <AlertCircle className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              id={`delete-listing-${post.id}`}
              onClick={() => onDeleteListing(post.id)}
              className="p-1.5 bg-[#161619] hover:bg-red-950/30 border border-[#222226] hover:border-red-800/40 text-zinc-500 hover:text-[#FF3F3F] rounded-lg transition-all cursor-pointer"
              title="Delete"
            >
              <Trash className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

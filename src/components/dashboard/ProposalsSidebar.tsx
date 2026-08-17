
import React, { useEffect, useState } from 'react';
import { Post, User } from '../../types';
import { apiFetch } from '../../lib/api';
import { Send, Loader2, CheckCircle2, XCircle, Clock, ChevronRight } from 'lucide-react';

interface MyResponse {
  _id: string;
  postId: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  answers: { question: string; answer: string }[];
  post?: {
    title: string;
    category: string;
  };
}

interface ProposalsSidebarProps {
  postsUserCommentedOn: Post[];
  currentUser: User;
  onSelectPost: (postId: string) => void;
}

const STATUS_CONFIG = {
  accepted: { label: 'Accepted', icon: CheckCircle2, class: 'text-emerald-400 bg-emerald-950/50 border-emerald-800/50' },
  rejected: { label: 'Rejected', icon: XCircle,      class: 'text-red-400 bg-red-950/50 border-red-800/50' },
  pending:  { label: 'Pending',  icon: Clock,         class: 'text-zinc-500 bg-zinc-900 border-zinc-800' },
};

export default function ProposalsSidebar({
  postsUserCommentedOn,
  currentUser,
  onSelectPost,
}: ProposalsSidebarProps) {
  const [myResponses, setMyResponses] = useState<MyResponse[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMyResponses = async () => {
      setLoading(true);
      try {
        const res = await apiFetch('/api/responses/my');
        if (res.ok) {
          const data = await res.json();
          setMyResponses(data.responses || []);
          return;
        }
      } catch {
        // fall through to local fallback
      }

      // Fallback: derive from local Redux state (postsUserCommentedOn)
      const derived: MyResponse[] = postsUserCommentedOn.flatMap((post) =>
        post.comments
          .filter((c) => c.author.id === currentUser.id)
          .map((c) => ({
            _id: c.id,
            postId: post.id,
            message: c.content,
            status: 'pending' as const,
            createdAt: c.createdAt,
            answers: c.answers || [],
            post: { title: post.title, category: post.category },
          }))
      );
      setMyResponses(derived);
      setLoading(false);
    };

    fetchMyResponses();
  }, [postsUserCommentedOn.length]);

  return (
    <div className="bg-[#0e0e10] rounded-xl border border-[#1e1e22] overflow-hidden">
      <div className="px-4 py-3.5 border-b border-[#1a1a1e] flex items-center gap-2">
        <Send className="w-3.5 h-3.5 text-[#FF3F3F]" />
        <h3 className="text-[11px] font-bold text-zinc-300 uppercase tracking-wider">My Submitted Offers</h3>
        {!loading && (
          <span className="ml-auto text-[9px] font-bold bg-[#1a1a1e] border border-[#252529] text-zinc-500 px-1.5 py-0.5 rounded-full">
            {myResponses.length}
          </span>
        )}
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 gap-2 text-zinc-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span className="text-[11px]">Loading…</span>
        </div>
      ) : myResponses.length === 0 ? (
        <div className="p-8 text-center">
          <p className="text-[12px] font-semibold text-zinc-500">No proposals submitted yet.</p>
          <p className="text-[11px] text-zinc-600 mt-1">Browse the feed and offer your help.</p>
        </div>
      ) : (
        <div className="divide-y divide-[#161619]">
          {myResponses.map((r) => {
            const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            const linkedPostId = r.postId;
            const postTitle = r.post?.title
              || postsUserCommentedOn.find((p) => p.id === r.postId || (p as any)._id === r.postId)?.title
              || 'View post';

            return (
              <div key={r._id} className="px-4 py-3.5 hover:bg-[#111113] transition-colors">
                {/* Post title link */}
                <button
                  onClick={() => onSelectPost(linkedPostId)}
                  className="flex items-start justify-between gap-2 w-full text-left group cursor-pointer mb-2"
                >
                  <span className="text-[12px] font-semibold text-zinc-200 group-hover:text-zinc-100 leading-snug line-clamp-2">
                    {postTitle}
                  </span>
                  <ChevronRight className="w-3.5 h-3.5 text-zinc-600 shrink-0 group-hover:text-zinc-400 transition-colors mt-0.5" />
                </button>

                {/* Message preview */}
                <p className="text-[11px] text-zinc-500 line-clamp-2 leading-relaxed mb-2">
                  {r.message}
                </p>

                {/* Status + date */}
                <div className="flex items-center justify-between gap-2">
                  <span className={`inline-flex items-center gap-1 text-[9px] font-bold px-1.5 py-0.5 rounded-full border uppercase tracking-wide ${cfg.class}`}>
                    <StatusIcon className="w-2.5 h-2.5" />
                    {cfg.label}
                  </span>
                  <span className="text-[10px] text-zinc-700 font-mono">
                    {new Date(r.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

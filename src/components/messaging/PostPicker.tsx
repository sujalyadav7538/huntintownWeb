import { MessageSquare, Tag, ChevronRight, Clock } from "lucide-react";
import { ChatPost } from "../../types";

const CATEGORY_COLORS: Record<string, string> = {
  "Home & Living": "#f97316",
  "Tech & Electronics": "#6366f1",
  "Education & Tutoring": "#3b82f6",
  "Health & Wellness": "#22c55e",
  "Events & Celebrations": "#ec4899",
  "Business & Finance": "#14b8a6",
  "Creative & Design": "#a855f7",
  "Transport & Moving": "#f59e0b",
  "Legal & Consulting": "#8b5cf6",
  "Pets & Animals": "#84cc16",
  "Fitness & Sports": "#06b6d4",
  "Food & Catering": "#ef4444",
};

interface PostPickerProps {
  posts: ChatPost[];
  onSelectPost: (postId: string) => void;
  loading: boolean;
}

export default function PostPicker({ posts, onSelectPost, loading }: PostPickerProps) {
  return (
    <div className="w-full shrink-0 border-r border-[#1e1e22] bg-[#0c0c0e] flex flex-col md:w-72 lg:w-80">
      {/* Header */}
      <div className="border-b border-[#1e1e22] px-4 pt-5 pb-4 select-none">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-display">
          Messages
        </h3>
        <p className="text-[11px] text-zinc-600 mt-0.5">Select a post to view its chats</p>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#141416]">
        {loading ? (
          <div className="p-8 flex flex-col items-center gap-3">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-[#FF3F3F] rounded-full animate-spin" />
            <p className="text-[11px] text-zinc-600">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="p-8 flex flex-col items-center gap-3 text-center select-none">
            <MessageSquare className="w-8 h-8 text-zinc-700" />
            <p className="text-xs font-semibold text-zinc-500">No conversations yet</p>
            <p className="text-[11px] text-zinc-700 leading-relaxed max-w-45">
              Conversations appear here after an offer is accepted on one of your posts.
            </p>
          </div>
        ) : (
          posts.map((post) => {
            const accent = CATEGORY_COLORS[post.category] ?? "#FF3F3F";
            return (
              <div
                key={post._id}
                onClick={() => onSelectPost(post._id)}
                className="relative flex items-center gap-3 px-4 py-4 cursor-pointer transition-colors select-none hover:bg-[#0f0f12] group"
              >
                {/* Category icon box */}
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border"
                  style={{ backgroundColor: `${accent}15`, borderColor: `${accent}30` }}
                >
                  <Tag className="w-4 h-4" style={{ color: accent }} />
                </div>

                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-semibold text-zinc-100 truncate leading-snug">
                    {post.title}
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-zinc-500">
                      {post.conversationCount} chat{post.conversationCount !== 1 ? "s" : ""}
                    </span>
                    {post.lastMessageAt && (
                      <>
                        <span className="text-zinc-700">·</span>
                        <span className="text-[10px] text-zinc-600 flex items-center gap-0.5">
                          <Clock className="w-2.5 h-2.5" />
                          {new Date(post.lastMessageAt).toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short",
                          })}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <ChevronRight className="w-3.5 h-3.5 text-zinc-600 group-hover:text-zinc-400 shrink-0 transition-colors" />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

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

export default function PostPicker({
  posts,
  onSelectPost,
  loading,
}: PostPickerProps) {
  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-[#1e1e22]  md:w-72 lg:w-80">
      {/* Header */}
      <div className="shrink-0 border-b border-[#1e1e22] px-4 py-4 select-none">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-wider text-zinc-200">
              Messages
            </h3>

            <p className="mt-0.5 text-[11px] text-zinc-600">
              Select a post to view its chats
            </p>
          </div>

          {posts.length > 0 && (
            <span className="rounded-full bg-white/[0.04] px-2 py-1 text-[10px] font-semibold text-zinc-500">
              {posts.length}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable list */}
      <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-800">
        {loading ? (
          <div className="flex flex-col items-center gap-3 p-8">
            <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-[#FF3F3F]" />

            <p className="text-[11px] text-zinc-600">Loading posts…</p>
          </div>
        ) : posts.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center select-none">
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.02]">
              <MessageSquare className="h-5 w-5 text-zinc-700" />
            </div>

            <p className="text-xs font-semibold text-zinc-500">
              No conversations yet
            </p>

            <p className="mt-1.5 max-w-52 text-[11px] leading-relaxed text-zinc-700">
              Conversations appear here after an offer is accepted on one of
              your posts.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#141416]">
            {posts.map((post) => {
              const accent = CATEGORY_COLORS[post.category] ?? "#FF3F3F";

              return (
                <button
                  key={post._id}
                  type="button"
                  onClick={() => onSelectPost(post._id)}
                  className="group relative flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-white/[0.025] active:bg-white/[0.04]"
                >
                  {/* Accent indicator */}
                  <span
                    className="absolute left-0 top-1/2 h-7 w-0.5 -translate-y-1/2 rounded-r-full opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ backgroundColor: accent }}
                  />

                  {/* Category icon */}
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border"
                    style={{
                      backgroundColor: `${accent}15`,
                      borderColor: `${accent}30`,
                    }}
                  >
                    <Tag className="h-4 w-4" style={{ color: accent }} />
                  </div>

                  {/* Content */}
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold leading-snug text-zinc-100">
                      {post.title}
                    </p>

                    <div className="mt-1 flex min-w-0 items-center gap-1.5">
                      <span className="shrink-0 text-[10px] text-zinc-500">
                        {post.conversationCount}{" "}
                        {post.conversationCount === 1 ? "chat" : "chats"}
                      </span>

                      {post.lastMessageAt && (
                        <>
                          <span className="text-zinc-700">·</span>

                          <span className="flex min-w-0 items-center gap-1 truncate text-[10px] text-zinc-600">
                            <Clock className="h-2.5 w-2.5 shrink-0" />

                            {new Date(post.lastMessageAt).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "short",
                              },
                            )}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Arrow */}
                  <ChevronRight className="h-3.5 w-3.5 shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}

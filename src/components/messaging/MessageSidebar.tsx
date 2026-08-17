import {
  MessageSquare,
  FileText,
  Tag,
  Clock,
  ChevronRight,
} from "lucide-react";
type MessageSidebarProps = {
  posts: any[];
  chats: any[];

  loading: boolean;
  chatLoading: boolean;

  selectedPostId?: string | null;
  selectedChatId?: string | null;

  mode: "posts" | "chats";

  onModeChange: (mode: "posts" | "chats") => void;

  onSelectPost: (postId: string) => void;
  onSelectChat: (chat: any) => void;
};
const CATEGORY_COLORS = {
  plumbing: "#3B82F6",
  electrical: "#F59E0B",
  cleaning: "#10B981",
  tutoring: "#8B5CF6",
  delivery: "#EC4899",
  repair: "#EF4444",
  default: "#FF3F3F",
};

const MessageSidebar = ({
  posts = [],
  chats = [],
  loading = false,
  chatLoading = false,
  selectedPostId = null,
  selectedChatId = null,
  mode,
  onModeChange,
  onSelectPost,
  onSelectChat,
}: MessageSidebarProps) => {
  const activeLoading = mode === "posts" ? loading : chatLoading;

  return (
    <aside className="flex h-full min-h-0 w-full shrink-0 flex-col border-r border-[#1e1e22] bg-[#0c0c0e] md:w-72 lg:w-80">
      {/* Header */}
      <header className="shrink-0 border-b border-[#1e1e22] px-4 pt-4 pb-3">
        {/* Title */}
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-display text-xs font-bold uppercase tracking-[0.14em] text-zinc-200">
              Messages
            </h3>

            <p className="mt-1 text-[11px] text-zinc-600">
              {mode === "posts"
                ? "Conversations on your posts"
                : "Conversations you've joined"}
            </p>
          </div>

          <span className="mt-0.5 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/[0.05] px-1.5 text-[9px] font-semibold text-zinc-500">
            {mode === "posts" ? posts.length : chats.length}
          </span>
        </div>

        {/* Mode switch */}
        <div className="grid grid-cols-2 gap-1 rounded-xl border border-white/[0.06] bg-[#101012] p-1">
          {/* My Posts */}
          <button
            type="button"
            onClick={() => onModeChange("posts")}
            className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "posts"
                ? "bg-[#1a1a1d] text-white shadow-sm"
                : "text-zinc-600 hover:bg-white/[0.025] hover:text-zinc-300"
            }`}
          >
            <FileText
              className={`h-3.5 w-3.5 transition-colors ${
                mode === "posts" ? "text-[#FF3F3F]" : "text-zinc-600"
              }`}
            />

            <span className="text-[10px] font-semibold">My Posts</span>

            {posts.length > 0 && (
              <span
                className={`text-[9px] font-bold ${
                  mode === "posts" ? "text-[#FF3F3F]" : "text-zinc-700"
                }`}
              >
                {posts.length}
              </span>
            )}
          </button>

          {/* My Chats */}
          <button
            type="button"
            onClick={() => onModeChange("chats")}
            className={`relative flex items-center justify-center gap-2 rounded-lg px-3 py-2 transition-all duration-200 ${
              mode === "chats"
                ? "bg-[#1a1a1d] text-white shadow-sm"
                : "text-zinc-600 hover:bg-white/[0.025] hover:text-zinc-300"
            }`}
          >
            <MessageSquare
              className={`h-3.5 w-3.5 transition-colors ${
                mode === "chats" ? "text-[#FF3F3F]" : "text-zinc-600"
              }`}
            />

            <span className="text-[10px] font-semibold">My Chats</span>

            {chats.length > 0 && (
              <span
                className={`text-[9px] font-bold ${
                  mode === "chats" ? "text-[#FF3F3F]" : "text-zinc-700"
                }`}
              >
                {chats.length}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Content */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {activeLoading ? (
          <LoadingState mode={mode} />
        ) : mode === "posts" ? (
          <MyPostsList
            posts={posts}
            selectedPostId={selectedPostId}
            onSelectPost={onSelectPost}
          />
        ) : (
          <MyChatsList
            chats={chats}
            selectedChatId={selectedChatId}
            onSelectChat={onSelectChat}
          />
        )}
      </div>
    </aside>
  );
};

/* =============================================================
   LOADING
============================================================= */

const LoadingState = ({ mode }) => {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16">
      <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-700 border-t-[#FF3F3F]" />

      <p className="mt-3 text-[11px] text-zinc-600">
        Loading {mode === "posts" ? "posts" : "chats"}…
      </p>
    </div>
  );
};

/* =============================================================
   MY POSTS
============================================================= */

const MyPostsList = ({ posts, selectedPostId, onSelectPost }) => {
  if (!posts.length) {
    return (
      <EmptyState
        icon={FileText}
        title="No posts yet"
        description="Posts you create will appear here with their conversations."
      />
    );
  }

  return (
    <div className="space-y-1 px-2 py-2">
      {posts.map((post) => {
        const accent =
          CATEGORY_COLORS[post.category?.toLowerCase()] ??
          CATEGORY_COLORS.default;

        const selected = selectedPostId === post._id;
        const conversationCount = post.conversationCount ?? 0;

        return (
          <button
            key={post._id}
            type="button"
            onClick={() => onSelectPost?.(post._id)}
            className={`group relative flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left transition-all duration-150 ${
              selected ? "bg-white/[0.055]" : "hover:bg-white/[0.025]"
            }`}
          >
            {/* Active indicator */}
            {selected && (
              <span className="absolute left-0 top-2 bottom-2 w-0.5 rounded-r-full bg-[#FF3F3F]" />
            )}

            {/* Category */}
            <div
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
              style={{
                backgroundColor: `${accent}12`,
                borderColor: `${accent}25`,
              }}
            >
              <Tag className="h-4 w-4" style={{ color: accent }} />
            </div>

            {/* Content */}
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-2">
                <p
                  className={`min-w-0 flex-1 truncate text-[13px] font-semibold leading-tight ${
                    selected ? "text-white" : "text-zinc-200"
                  }`}
                >
                  {post.title}
                </p>

                {conversationCount > 0 && (
                  <span
                    className={`shrink-0 rounded-full px-1.5 py-0.5 text-[9px] font-bold ${
                      selected
                        ? "bg-[#FF3F3F]/10 text-[#FF3F3F]"
                        : "bg-white/[0.04] text-zinc-600"
                    }`}
                  >
                    {conversationCount}
                  </span>
                )}
              </div>

              <div className="mt-1.5 flex items-center gap-2">
                <span className="text-[10px] text-zinc-500">
                  {conversationCount === 0
                    ? "No conversations"
                    : conversationCount === 1
                      ? "1 conversation"
                      : `${conversationCount} conversations`}
                </span>

                {post.lastMessageAt && (
                  <>
                    <span className="text-zinc-800">·</span>

                    <span className="flex items-center gap-1 text-[10px] text-zinc-600">
                      <Clock className="h-2.5 w-2.5" />
                      {formatDate(post.lastMessageAt)}
                    </span>
                  </>
                )}
              </div>
            </div>

            {/* Arrow */}
            <ChevronRight
              className={`h-3.5 w-3.5 shrink-0 transition-all ${
                selected
                  ? "translate-x-0 text-zinc-400"
                  : "text-zinc-700 group-hover:translate-x-0.5 group-hover:text-zinc-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

/* =============================================================
   MY CHATS
============================================================= */

const MyChatsList = ({ chats, selectedChatId, onSelectChat }) => {
  if (!chats.length) {
    return (
      <EmptyState
        icon={MessageSquare}
        title="No chats yet"
        description="Chats from posts you have applied to will appear here."
      />
    );
  }

  return (
    <div className="divide-y divide-[#141416]">
      {chats.map((chat) => {
        const selected = selectedChatId === chat._id;

        return (
          <button
            key={chat._id}
            type="button"
            onClick={() => onSelectChat?.(chat)}
            className={`group relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
              selected ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
            }`}
          >
            {selected && (
              <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-[#FF3F3F]" />
            )}

            {/* Avatar */}
            <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04]">
              {chat.otherUser?.avatar ? (
                <img
                  src={chat.otherUser.avatar}
                  alt={chat.otherUser.name || "User"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <span className="text-xs font-bold text-zinc-500">
                  {getInitials(chat.otherUser?.name)}
                </span>
              )}
            </div>

            {/* Chat information */}
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-zinc-100">
                {chat.otherUser?.name || "User"}
              </p>

              <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                {chat.post?.title || "Post conversation"}
              </p>

              {chat.lastMessageAt && (
                <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-600">
                  <Clock className="h-2.5 w-2.5" />

                  {formatDate(chat.lastMessageAt)}
                </div>
              )}
            </div>

            {/* Unread */}
            {chat.unreadCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF3F3F] px-1.5 text-[9px] font-bold text-white">
                {chat.unreadCount > 99 ? "99+" : chat.unreadCount}
              </span>
            )}

            <ChevronRight
              className={`h-3.5 w-3.5 shrink-0 transition ${
                selected
                  ? "text-zinc-400"
                  : "text-zinc-700 group-hover:text-zinc-400"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
};

/* =============================================================
   EMPTY STATE
============================================================= */

const EmptyState = ({ icon: Icon, title, description }) => {
  return (
    <div className="flex flex-col items-center px-7 py-16 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.025]">
        <Icon className="h-5 w-5 text-zinc-700" />
      </div>

      <p className="mt-4 text-xs font-semibold text-zinc-500">{title}</p>

      <p className="mt-1.5 max-w-[220px] text-[10px] leading-relaxed text-zinc-700">
        {description}
      </p>
    </div>
  );
};

/* =============================================================
   HELPERS
============================================================= */

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
  });
};

const getInitials = (name = "") => {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "?"
  );
};

export default MessageSidebar;

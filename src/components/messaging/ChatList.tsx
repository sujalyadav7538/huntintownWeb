import { useState } from "react";
import { Search, ArrowLeft, ChevronRight, MessageSquare, Clock } from "lucide-react";
import { handleAvatarError } from "../../utils";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { apiFetch } from "@/src/lib/api";
import { setConversationMessages } from "@/src/store/conversationsSlice";
import { formatLastSeen } from "@/src/lib/presence";

export default function ChatList({
  setActiveConversationId,
  onBackToPosts,
  postTitle,
  loading = false,
}: {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
  onBackToPosts?: () => void;
  postTitle?: string;
  loading?: boolean;
}) {
  const [channelsSearch, setChannelsSearch] = useState("");
  const dispatch = useAppDispatch();

  const { currentUser, token } = useAppSelector((s) => s.auth);
  const { conversations, activeConversationId } = useAppSelector(
    (s) => s.conversations,
  );

  const myId = currentUser?.id;

  const filteredConvs = conversations.filter((conv) => {
    const otherUser =
      conv.participants.find((p) => p.id !== currentUser.id) ??
      conv.participants[0];

    return otherUser.name.toLowerCase().includes(channelsSearch.toLowerCase());
  });

  const handleActiveChatClick = async (convId: string) => {
    const res = await apiFetch(`/api/chat/${convId}/messages`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    const mesagesData = await res.json();
    dispatch(
      setConversationMessages({
        conversationId: convId,
        messages: mesagesData?.data,
      }),
    );
    setActiveConversationId(convId);
  };
  return (
    <aside
      className={`flex h-full min-h-0 w-full shrink-0 flex-col border-r border-[#1e1e22] bg-[#0c0c0e] font-sans md:w-72 lg:w-80 ${
        activeConversationId ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <header className="shrink-0 border-b border-[#1e1e22] px-4 py-4">
        {onBackToPosts && (
          <button
            type="button"
            onClick={onBackToPosts}
            className="mb-3 flex items-center gap-1.5 text-[10px] font-medium text-zinc-600 transition-colors hover:text-zinc-300"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Back to posts</span>
          </button>
        )}

        <div className="mb-3 flex items-center justify-between gap-3">
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-zinc-100">
              {postTitle || "Conversations"}
            </h2>

            <p className="mt-0.5 text-[10px] text-zinc-600">
              {filteredConvs.length}{" "}
              {filteredConvs.length === 1 ? "conversation" : "conversations"}
            </p>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-600" />

          <input
            type="text"
            placeholder="Search conversations..."
            value={channelsSearch}
            onChange={(e) => setChannelsSearch(e.target.value)}
            className="h-9 w-full rounded-lg border border-white/[0.06] bg-white/[0.025] pl-9 pr-3 text-xs text-zinc-300 outline-none transition placeholder:text-zinc-700 focus:border-[#FF3F3F]/30 focus:bg-white/[0.035]"
          />
        </div>
      </header>

      {/* Conversations */}
      <div className="min-h-0 flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex h-full items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <div className="h-5 w-5 animate-spin rounded-full border-2 border-zinc-800 border-t-[#FF3F3F]" />

              <span className="text-[10px] text-zinc-700">
                Loading conversations...
              </span>
            </div>
          </div>
        ) : filteredConvs.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center px-8 text-center">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-white/[0.025]">
              <MessageSquare className="h-5 w-5 text-zinc-700" />
            </div>

            <p className="text-xs font-semibold text-zinc-400">
              No conversations
            </p>

            <p className="mt-1.5 text-[10px] leading-relaxed text-zinc-700">
              {channelsSearch
                ? "No conversations match your search."
                : "Conversations for this post will appear here."}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-[#141416]">
            {filteredConvs.map((conv) => {
              const otherUser =
                conv.participants.find((p) => p._id !== myId) ??
                conv.participants[0];

              const isSelected = conv._id === activeConversationId;

              return (
                <button
                  key={conv._id}
                  type="button"
                  onClick={() => handleActiveChatClick(conv._id)}
                  className={`group relative flex w-full items-center gap-3 px-4 py-4 text-left transition-colors ${
                    isSelected ? "bg-white/[0.045]" : "hover:bg-white/[0.025]"
                  }`}
                >
                  {/* Selected indicator */}
                  {isSelected && (
                    <span className="absolute inset-y-2 left-0 w-0.5 rounded-r-full bg-[#FF3F3F]" />
                  )}

                  {/* Avatar */}
                  <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-white/[0.07] bg-white/[0.04]">
                    {otherUser?.avatar ? (
                      <img
                        src={otherUser.avatar}
                        alt={otherUser.name || "User"}
                        onError={(e) => handleAvatarError(e, otherUser?.name)}
                        referrerPolicy="no-referrer"
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-xs font-bold text-zinc-500">
                        {getInitials(otherUser?.name)}
                      </span>
                    )}

                    {/* Online indicator */}
                    {otherUser?.isOnline && (
                      <span className="absolute bottom-0 right-0 h-2 w-2 rounded-full border border-[#0c0c0e] bg-emerald-500" />
                    )}
                  </div>

                  {/* Conversation info */}
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-[13px] font-semibold ${
                        isSelected ? "text-white" : "text-zinc-100"
                      }`}
                    >
                      {otherUser?.name || "User"}
                    </p>

                    {/* <p className="mt-0.5 truncate text-[10px] text-zinc-600">
                      {conv?.post?.title || "Post conversation"}
                    </p> */}

                    {otherUser?.isOnline ? (
                      <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-500/70">
                        <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        Online
                      </div>
                    ) : (
                      conv.lastMessageAt && (
                        <div className="mt-1 flex items-center gap-1 text-[10px] text-zinc-600">
                          <Clock className="h-2.5 w-2.5" />
                          {formatDate(conv.lastMessageAt)}
                        </div>
                      )
                    )}
                  </div>

                  {/* Unread */}
                  {conv.unreadCount > 0 && (
                    <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-[#FF3F3F] px-1.5 text-[9px] font-bold text-white">
                      {conv.unreadCount > 99 ? "99+" : conv.unreadCount}
                    </span>
                  )}

                  {/* Arrow */}
                  <ChevronRight
                    className={`h-3.5 w-3.5 shrink-0 transition ${
                      isSelected
                        ? "text-zinc-400"
                        : "text-zinc-700 group-hover:text-zinc-400"
                    }`}
                  />
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
}


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
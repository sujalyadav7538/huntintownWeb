"use client";

import React, { useState, useMemo } from "react";
import { Search, ArrowLeft } from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";
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
    <div
      className={`w-full shrink-0 border-r border-[#1e1e22] bg-[#0c0c0e] flex flex-col font-sans md:w-72 lg:w-80 ${
        activeConversationId ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="border-b border-[#1e1e22] bg-[#0c0c0e] px-4 pt-4 pb-4 space-y-2.5 select-none">
        {/* Back to post picker */}
        {onBackToPosts && (
          <button
            onClick={onBackToPosts}
            className="flex items-center gap-1.5 text-[11px] text-zinc-500 hover:text-zinc-300 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-3 h-3" />
            All Posts
          </button>
        )}
        <p className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-display truncate">
          {postTitle ?? "Conversations"}
        </p>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
            <Search className="w-3.5 h-3.5" />
          </span>

          <input
            type="text"
            placeholder="Filter by name..."
            value={channelsSearch}
            onChange={(e) => setChannelsSearch(e.target.value)}
            className="w-full rounded-md border border-[#1e1e22] bg-[#141416] py-2 pl-8 pr-3 text-xs text-zinc-300 placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/50"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#141416] bg-[#0c0c0e]">
        {loading ? (
          <div className="p-8 flex justify-center">
            <div className="w-5 h-5 border-2 border-zinc-700 border-t-[#FF3F3F] rounded-full animate-spin" />
          </div>
        ) : filteredConvs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs select-none">
            No conversations located.
          </div>
        ) : (
          filteredConvs.map((conv) => {
            const otherUser =
              conv.participants.find((p) => p.id !== myId) ??
              conv.participants[0];

            const isSelected = conv._id === activeConversationId;

            return (
              <div
                key={conv._id}
                onClick={() => handleActiveChatClick(conv._id)}
                className={`relative flex items-center gap-3 px-4 py-3.5 cursor-pointer transition-colors select-none ${
                  isSelected
                    ? "bg-[#131316]"
                    : "hover:bg-[#0f0f12]"
                }`}
              >
                <span className={`absolute inset-y-0 left-0 w-0.75 ${isSelected ? "bg-[#FF3F3F]" : "bg-transparent"}`} />
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={otherUser?.avatar }
                    alt={otherUser?.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2e2e33]"
                    onError={(e) => handleAvatarError(e, otherUser?.name)}
                    referrerPolicy="no-referrer"
                  />

                  <span
                    className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border-2 border-[#0d0d0f] ${
                      otherUser?.isOnline
                        ? "bg-emerald-500 animate-pulse"
                        : "bg-zinc-600"
                    }`}
                  />
                </div>

                {/* Info (you can re-enable later) */}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {otherUser?.name || "Unknown"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 truncate">
                    {conv?.post?.title || "No post title"}
                  </p>
                  <p className="mt-0.5 text-[10px] text-zinc-500 truncate">
                    {otherUser?.isOnline
                      ? "Online"
                      : formatLastSeen(otherUser?.lastSeen)}
                  </p>
                </div>

                {/* <p>{conv?.post?.title}</p> */}

                {/* Unread */}
                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF3F3F] text-[9px] font-bold text-white flex items-center justify-center font-mono shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { apiFetch } from "@/src/lib/api";
import { setConversationMessages } from "@/src/store/conversationsSlice";
import { socket } from "@/src/lib/socket";

export default function ChatList({
  setActiveConversationId,
}: {
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
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
    console.log("Fetched messages for conversation:", mesagesData);
    setActiveConversationId(convId);

    // For Testing: Join the conversation room on the server
    socket.auth = {
      token: token,
    };
    socket.connect();
    socket.emit("join-conversation", convId, (response) => {
      if (response.success) {
        console.log("Joined");
      } else {
        console.log(response.message);
      }
    });
  };
  console.log(filteredConvs, "filteredConvs");
  return (
    <div
      className={`w-full md:w-80 border-r border-[#232327] flex flex-col font-sans ${
        activeConversationId ? "hidden md:flex" : "flex"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-[#232327] space-y-3 bg-[#17171a] select-none">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-display">
          Immediate Chats
        </h3>

        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
            <Search className="w-3.5 h-3.5" />
          </span>

          <input
            type="text"
            placeholder="Filter by name..."
            value={channelsSearch}
            onChange={(e) => setChannelsSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#0b0b0c] border border-[#29292e] text-zinc-100 rounded-lg placeholder-zinc-650 focus:outline-none focus:border-[#FF3F3F]"
          />
        </div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e21] bg-[#121214]">
        {filteredConvs.length === 0 ? (
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
                className={`p-4 flex gap-3 items-center cursor-pointer transition select-none ${
                  isSelected
                    ? "bg-zinc-850/60 border-l-4 border-[#FF3F3F]"
                    : "hover:bg-zinc-850"
                }`}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <img
                    src={otherUser?.avatar }
                    alt={otherUser?.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2e2e33]"
                    onError={(e) => handleAvatarError(e, otherUser?.name)}
                    referrerPolicy="no-referrer"
                  />

                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
                </div>

                {/* Info (you can re-enable later) */}
                <div className="flex-1 min-w-0 text-left">
                  <p className="text-sm font-medium text-zinc-100 truncate">
                    {otherUser?.name || "Unknown"}
                  </p>

                  <p className="mt-1 text-xs text-zinc-500 truncate">
                    {conv?.post?.title || "No post title"}
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

"use client";

import { useRef, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  setActiveConversationId,
  setConversations,
} from "../store/conversationsSlice";
import { socket } from "../lib/socket";

import ChatList from "./messaging/ChatList";
import ChatHeader from "./messaging/ChatHeader";
import MessageBubble from "./messaging/MessageBubble";
import MessageInput from "./messaging/MessageInput";
import { apiFetch } from "../lib/api";

export default function Messaging() {
  const dispatch = useAppDispatch();
  const { currentUser, token } = useAppSelector((s) => s.auth);
  const { conversations, activeConversationId, conversationMessages } =
    useAppSelector((s) => s.conversations);
  const handleSetActiveConv = (id: string | null) =>
    dispatch(setActiveConversationId(id));

  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getActiveConversatin = async () => {
      const res = await apiFetch("/api/chat/conversations", {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });
      const data = await res.json();
      // localStorage.setItem("neighbourly_conversations", JSON.stringify(data?.data));
      dispatch(setConversations(data?.data));
    };
    getActiveConversatin();
  }, []);
  
  // Auto-scroll on new chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversationId, conversations]);

  // Join conversation room when activeConversationId changes
  useEffect(() => {
    if (activeConversationId && socket.connected) {
      console.log("[Messaging] Joining conversation room:", activeConversationId);
      socket.emit("join-conversation", activeConversationId, (response: any) => {
        if (response.success) {
          console.log("✅ Joined conversation room successfully");
        } else {
          console.error("❌ Failed to join conversation:", response.message);
        }
      });
    } else if (!socket.connected && activeConversationId) {
      console.warn("[Messaging] Socket not connected yet, cannot join conversation");
    }
  }, [activeConversationId]);

  const activeConversation = conversations.find(
    (c) => c._id === activeConversationId,
  );

  const activeMessages = conversationMessages[activeConversationId] ?? [];

  return (
    <>
      <div className="flex flex-1 overflow-hidden text-zinc-100 font-sans border-t border-[#1e1e22]">
      {/* LEFT: conversation list */}
      <ChatList
        activeConversationId={activeConversationId}
        setActiveConversationId={handleSetActiveConv}
      />

      {/* RIGHT: message thread */}
      <div
        className={`flex-1 flex flex-col bg-[#09090b] ${
          !activeConversationId
            ? "hidden md:flex items-center justify-center"
            : "flex"
        }`}
      >
        {activeConversation ? (
          <>
            {/* Header recipient (Modular) */}
            <ChatHeader
              activeConv={activeConversation}
              setActiveConversationId={handleSetActiveConv}
            />

            {/* Messages body scrolling */}
            <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
              <div className="flex justify-center pb-5 select-none">
                <span className="inline-flex items-center rounded-full border border-[#1e1e22] bg-[#0d0d10] px-3 py-1 text-[10px] text-zinc-600 tracking-wide">
                  — start of conversation —
                </span>
              </div>

              <div className="space-y-3">
                {activeMessages.map((msg) => (
                  <MessageBubble
                    key={msg._id}
                    msg={msg}
                    currentUserId={currentUser.id}
                  />
                ))}
              </div>

              <div ref={chatEndRef} />
            </div>

            {/* Interactive texting input form (Modular) */}
            <MessageInput
              participantName={
                activeConversation?.participants.find(
                  (p) => p.id !== currentUser?.id,
                )?.name ?? ""
              }
            />
          </>
        ) : (
          <div className="p-12 text-center text-zinc-500 space-y-2 select-none">
            <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-sm font-bold text-zinc-300 font-display uppercase tracking-wider">
              Select a conversation thread
            </p>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Engage with other Sector residents about custom requirements,
              verify timelines, or coordinate deliveries in real-time.
            </p>
          </div>
        )}
      </div>
    </div>
    {/* Reserve space for fixed mobile bottom nav so chat input isn't hidden behind it */}
    <div className="shrink-0 h-14 md:hidden" />
  </>
  );
}

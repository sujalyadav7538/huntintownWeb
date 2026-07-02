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
    <div className="bg-[#121214] rounded-2xl border border-[#232327] shadow-lg h-[75vh] flex overflow-hidden text-zinc-100 font-sans">
      {/* LEFT CHATS FEED sidebar list (Modular) */}
      <ChatList
        activeConversationId={activeConversationId}
        setActiveConversationId={handleSetActiveConv}
      />

      {/* RIGHT CONVERSATION THREAD */}
      <div
        className={`flex-1 flex flex-col ${
          !activeConversationId
            ? "hidden md:flex items-center justify-center bg-[#0d0d0f]"
            : "flex bg-[#0f0f11]"
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
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="text-center py-2 select-none">
                <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest bg-[#18181c] py-1 px-3.5 rounded border border-[#222226]">
                  Encrypted Response Dialogue Channel
                </span>
              </div>

              {activeMessages.map((msg) => (
                <MessageBubble
                  key={msg._id}
                  msg={msg}
                  currentUserId={currentUser.id}
                />
              ))}

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
  );
}

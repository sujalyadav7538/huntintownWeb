"use client";

import { useRef, useEffect, useState } from "react";
import { MessageSquare } from "lucide-react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import {
  setActiveConversationId,
  setConversations,
  setChatPosts,
} from "../store/conversationsSlice";
import { socket } from "../lib/socket";

import PostPicker from "./messaging/PostPicker";
import ChatList from "./messaging/ChatList";
import ChatHeader from "./messaging/ChatHeader";
import MessageBubble from "./messaging/MessageBubble";
import MessageInput from "./messaging/MessageInput";
import { apiFetch } from "../lib/api";

export default function Messaging() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const { currentUser, token } = useAppSelector((s) => s.auth);
  const { conversations, activeConversationId, conversationMessages, chatPosts } =
    useAppSelector((s) => s.conversations);

  const activePostId = searchParams.get("postId");
  const [postsLoading, setPostsLoading] = useState(false);
  const [convsLoading, setConvsLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load post list for the picker on mount
  useEffect(() => {
    const load = async () => {
      setPostsLoading(true);
      try {
        const res = await apiFetch("/api/chat/posts", {
          headers: { Authorization: `${token}` },
        });
        const data = await res.json();
        dispatch(setChatPosts(data?.data ?? []));
      } finally {
        setPostsLoading(false);
      }
    };
    load();
  }, []);

  // When URL postId changes, load conversations for that post
  useEffect(() => {
    dispatch(setActiveConversationId(null));
    if (!activePostId) { dispatch(setConversations([])); return; }
    const load = async () => {
      setConvsLoading(true);
      try {
        const res = await apiFetch(`/api/chat/posts/${activePostId}/conversations`, {
          headers: { Authorization: `${token}` },
        });
        const data = await res.json();
        dispatch(setConversations(data?.data ?? []));
      } finally {
        setConvsLoading(false);
      }
    };
    load();
  }, [activePostId]);

  const activeMessages = conversationMessages[activeConversationId ?? ""] ?? [];

  // Auto-scroll to bottom whenever a new message is added or the conversation changes
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [activeConversationId, activeMessages.length]);

  // Join conversation room — single place responsible for this.
  // Fires when the active conversation changes, and also when the socket
  // connects/reconnects so we re-join if the connection dropped mid-session.
  useEffect(() => {
    if (!activeConversationId) return;

    const join = () => {
      socket.emit("join-conversation", activeConversationId, (response: any) => {
        if (!response?.success) console.error("❌ Join failed:", response?.message);
      });
    };

    if (socket.connected) {
      join();
    } else {
      socket.once("connect", join);
    }

    return () => {
      socket.off("connect", join);
    };
  }, [activeConversationId]);

  const handleSelectPost = (postId: string) =>
    navigate(`/messaging?postId=${postId}`, { replace: true });

  const handleBackToPosts = () => navigate("/messaging", { replace: true });

  const activeConversation = conversations.find((c) => c._id === activeConversationId);
  const activePostTitle = chatPosts.find((p) => p._id === activePostId)?.title;

  return (
    <>
      <div className="flex flex-1 overflow-hidden text-zinc-100 font-sans border-t border-[#1e1e22]">

        {/* LEFT PANEL — Post Picker when no post selected, Conversation List when post selected */}
        {!activePostId ? (
          <PostPicker
            posts={chatPosts}
            onSelectPost={handleSelectPost}
            loading={postsLoading}
          />
        ) : (
          <ChatList
            activeConversationId={activeConversationId}
            setActiveConversationId={(id) => dispatch(setActiveConversationId(id))}
            onBackToPosts={handleBackToPosts}
            postTitle={activePostTitle}
            loading={convsLoading}
          />
        )}

        {/* RIGHT PANEL — Chat thread */}
        <div
          className={`flex-1 flex flex-col bg-[#171717] ${
            !activeConversationId
              ? "hidden md:flex items-center justify-center"
              : "flex"
          }`}
        >
          {activeConversation ? (
            <>
              <ChatHeader
                activeConv={activeConversation}
                setActiveConversationId={(id) => dispatch(setActiveConversationId(id))}
              />
              <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6">
                <div className="flex justify-center pb-5 select-none">
                  <span className="inline-flex items-center rounded-full border border-[#1e1e22] bg-[#0d0d10] px-3 py-1 text-[10px] text-zinc-600 tracking-wide">
                    — start of conversation —
                  </span>
                </div>
                <div className="space-y-3">
                  {activeMessages.map((msg) => (
                    <MessageBubble key={msg._id} msg={msg} currentUserId={currentUser.id} />
                  ))}
                </div>
                <div ref={chatEndRef} />
              </div>
              <MessageInput
                participantName={
                  activeConversation.participants.find((p) => p.id !== currentUser?.id)?.name ?? ""
                }
              />
            </>
          ) : (
            <div className="p-12 text-center text-zinc-500 space-y-2 select-none">
              <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto" />
              <p className="text-sm font-bold text-zinc-300 font-display uppercase tracking-wider">
                {activePostId ? "Select a conversation" : "Select a post to begin"}
              </p>
              <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
                {activePostId
                  ? "Choose a conversation from the left panel."
                  : "Pick a post from the left to see its conversations."}
              </p>
            </div>
          )}
        </div>

      </div>
      <div className="shrink-0 h-14 md:hidden" />
    </>
  );
}

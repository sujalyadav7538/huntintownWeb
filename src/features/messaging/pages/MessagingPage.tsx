import { ReactNode, useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { useIsTablet } from "@/src/shared/hooks/useBreakpoint";
import { useSeo } from "@/src/shared/hooks/useSeo";
import useRouteBack from "@/src/shared/hooks/useRouteBack";

import {
  setActiveConversationId,
  setConversations,
  setChatPosts,
  setUserPresence,
  addMessageToConversation,
  setConversationMessages,
  markMessagesRead,
} from "@/src/store/conversationsSlice";

import { socket } from "@/src/shared/lib/socket";
import { apiFetch } from "@/src/shared/lib/api";

import MessageSidebar from "@/src/features/messaging/components/MessageSidebar";
import ChatList from "@/src/features/messaging/components/ChatList";

import {
  handleHideMobileBottomNav,
  handleHideUpperNavigation,
} from "@/src/store/uiSlice";
import ChatPanel from "@/src/features/messaging/components/ChatPanel";

type ChatMode = "posts" | "chats";

export default function MessagingPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const isTablet = useIsTablet();

  useSeo({ title: "Messages" });

  const [searchParams] = useSearchParams();

  const { currentUser, token } = useAppSelector((s) => s.auth);

  const {
    conversations,
    activeConversationId,
    conversationMessages,
    chatPosts,
  } = useAppSelector((s) => s.conversations);

  /*
   * ---------------------------------------------------------
   * URL STATE
   * ---------------------------------------------------------
   */

  const activePostId = searchParams.get("postId");
  const activeConversationFromUrl = searchParams.get("conversationId");
  const requestedMode = searchParams.get("chatMode");

  /*
   * ---------------------------------------------------------
   * LOCAL STATE
   * ---------------------------------------------------------
   */

  const mode: ChatMode =
    requestedMode === "chats" || (activeConversationFromUrl && !activePostId)
      ? "chats"
      : "posts";
  const backToList = useRouteBack("/messaging");
  const backFromConversation = useRouteBack(
    activePostId && mode === "posts"
      ? `/messaging?postId=${encodeURIComponent(activePostId)}`
      : "/messaging?chatMode=chats",
  );

  const [myChats, setMyChats] = useState<any[]>([]);
  const [linkedConversation, setLinkedConversation] = useState<any | null>(null);

  const [postsLoading, setPostsLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [convsLoading, setConvsLoading] = useState(false);
  const [pageError, setPageError] = useState("");
  const [listRevision, setListRevision] = useState(0);
  const [threadRevision, setThreadRevision] = useState(0);
  const [isVisible, setIsVisible] = useState(() => document.visibilityState === "visible");
  const conversationsRequest = useRef(0);
  const loadedPost = useRef<string | null>(null);

  const markRead = async (conversationId: string, messageIds: string[]) => {
    if (!messageIds.length) return;
    try {
      const res = await apiFetch(`/api/chat/${conversationId}/read`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageIds }),
      });
      if (!res.ok) throw new Error("Could not mark messages as read.");
    } catch (error) {
      setPageError(error instanceof Error ? error.message : "Could not mark messages as read.");
    }
  };

  const loadConversationsByPost = async (postId: string) => {
    if (!token || !postId) return;
    const request = ++conversationsRequest.current;

    if (loadedPost.current !== postId) setConvsLoading(true);

    try {
      const res = await apiFetch(`/api/chat/posts/${postId}/conversations`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Unable to load conversations.");
      if (request === conversationsRequest.current) {
        loadedPost.current = postId;
        dispatch(setConversations(data?.data ?? []));
      }
    } catch {
      if (request === conversationsRequest.current) setPageError("Could not load conversations. Please try again.");
    } finally {
      if (request === conversationsRequest.current) setConvsLoading(false);
    }
  };

  /*
   * ---------------------------------------------------------
   * ACTIVE MESSAGES
   * ---------------------------------------------------------
   */

  const activeMessages = conversationMessages[activeConversationId ?? ""] ?? [];

  /*
   * ---------------------------------------------------------
   * LOAD MY POSTS
   *
   * Posts created by the current user.
   *
   * A post can have multiple conversations.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadPosts = async () => {
      if (listRevision === 0) setPostsLoading(true);

      try {
        const res = await apiFetch("/api/chat/posts", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Unable to load your posts.");

        if (!cancelled) dispatch(setChatPosts(data?.data ?? []));
      } catch {
        if (!cancelled) setPageError("Could not load your posts. Please try again.");
      } finally {
        if (!cancelled) setPostsLoading(false);
      }
    };

    loadPosts();
    return () => { cancelled = true; };
  }, [token, dispatch, listRevision]);

  /*
   * ---------------------------------------------------------
   * LOAD MY CHATS
   *
   * Conversations where the current user is the helper.
   *
   * IMPORTANT:
   *
   * Replace this endpoint with your actual backend endpoint
   * if it is different.
   *
   * Expected response:
   *
   * [
   *   {
   *     _id,
   *     post: {...},
   *     otherUser: {...},
   *     lastMessageAt,
   *     unreadCount
   *   }
   * ]
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    const loadMyChats = async () => {
      if (listRevision === 0) setChatsLoading(true);
      try {
        const res = await apiFetch("/api/chat/my-chats", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Unable to load your chats.");

        if (!cancelled) setMyChats(data?.data ?? []);
      } catch {
        if (!cancelled) setPageError("Could not load your chats. Please try again.");
      } finally {
        if (!cancelled) setChatsLoading(false);
      }
    };

    loadMyChats();
    return () => { cancelled = true; };
  }, [token, listRevision]);

  /*
   * ---------------------------------------------------------
   * LOAD CONVERSATIONS FOR A POST
   *
   * This is only required for "My Posts".
   *
   * A post owner can have multiple conversations.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!activePostId) {
      conversationsRequest.current++;
      loadedPost.current = null;
      dispatch(setConversations([]));
      return;
    }

    /*
     * In "My Chats" mode we don't need to fetch the
     * conversations of a post because the chat itself
     * is already known.
     */
    if (mode !== "posts") {
      return;
    }

    loadConversationsByPost(activePostId);
    return () => { conversationsRequest.current++; };
  }, [activePostId, mode, token, dispatch, listRevision]);

  /*
   * ---------------------------------------------------------
   * RESTORE ACTIVE CONVERSATION FROM URL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!activeConversationFromUrl || !token) {
      setLinkedConversation(null);
      dispatch(setActiveConversationId(null));
      return;
    }

    let cancelled = false;
    setPageError("");
    dispatch(setActiveConversationId(activeConversationFromUrl));

    const loadLinkedConversation = async () => {
      try {
        const res = await apiFetch(
          `/api/chat/${activeConversationFromUrl}/messages`,
          {
            method: "GET",
            headers: { Authorization: `${token}` },
          },
        );
        const data = await res.json();
        if (!res.ok) {
          throw new Error(data?.message || "Unable to load messages.");
        }
        if (cancelled) return;

        setLinkedConversation(data?.conversation ?? null);
        dispatch(
          setConversationMessages({
            conversationId: activeConversationFromUrl,
            messages: data?.data ?? [],
          }),
        );
        if (document.visibilityState === "visible") {
          const unreadIds = (data?.data ?? [])
            .filter((message: any) => !message.isRead && String(message.sender?._id) !== String(currentUser?._id))
            .map((message: any) => String(message._id));
          void markRead(activeConversationFromUrl, unreadIds);
        }
      } catch {
        if (cancelled) return;
        setPageError("Could not load this conversation. Please try again.");
      }
    };

    void loadLinkedConversation();

    return () => {
      cancelled = true;
    };
  }, [activeConversationFromUrl, activePostId, requestedMode, token, dispatch, threadRevision, currentUser?._id]);

  useEffect(() => {
    const onVisibilityChange = () => {
      const visible = document.visibilityState === "visible";
      setIsVisible(visible);
      if (visible && activeConversationFromUrl) {
        setThreadRevision((revision) => revision + 1);
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => document.removeEventListener("visibilitychange", onVisibilityChange);
  }, [activeConversationFromUrl]);

  useEffect(() => {
    if (
      !currentUser?._id ||
      !activeConversationFromUrl ||
      linkedConversation?._id !== activeConversationFromUrl
    ) {
      return;
    }

    const helperId = String(
      linkedConversation.helper?._id ?? linkedConversation.helper,
    );
    const hunterId = String(
      linkedConversation.hunter?._id ?? linkedConversation.hunter,
    );
    const userId = String(currentUser._id);
    const params = new URLSearchParams(searchParams);

    if (helperId === userId) {
      params.set("chatMode", "chats");
      params.delete("postId");
    } else if (hunterId === userId && linkedConversation.post?._id) {
      params.set("chatMode", "posts");
      params.set("postId", String(linkedConversation.post._id));
    } else {
      return;
    }

    if (params.toString() !== searchParams.toString()) {
      navigate(`/messaging?${params.toString()}`, { replace: true });
    }
  }, [
    activeConversationFromUrl,
    linkedConversation,
    currentUser?._id,
    searchParams,
    navigate,
  ]);

  useEffect(() => {
    // Show bottom nav when no conversation is currently open.
    dispatch(handleHideMobileBottomNav(Boolean(activeConversationId)));
    dispatch(handleHideUpperNavigation(Boolean(activeConversationId)));
  }, [activeConversationId, dispatch]);

  useEffect(() => {
    // Reset global UI state if the component is left via direct navigation.
    return () => {
      dispatch(handleHideMobileBottomNav(false));
      dispatch(handleHideUpperNavigation(false));
    };
  }, [dispatch]);

  /*
   * ---------------------------------------------------------
   * JOIN SOCKET CONVERSATION
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!activeConversationId || !isVisible) return;
    let cancelled = false;

    const joinConversation = () => {
      socket.emit(
        "join-conversation",
        activeConversationId,
        (response: any) => {
          if (cancelled) {
            return;
          }
          if (!response?.success) {
            setPageError(
              response?.message || "Could not join this conversation.",
            );
          }
        },
      );
    };

    socket.on("connect", joinConversation);

    if (socket.connected) {
      joinConversation();
    }

    return () => {
      cancelled = true;
      socket.off("connect", joinConversation);
      if (socket.connected) socket.emit("leave-conversation", activeConversationId);
    };
  }, [activeConversationId, isVisible]);

  /*
   * ---------------------------------------------------------
   * NEW MESSAGE
   *
   * Keep this listener at Messaging level so it survives
   * switching between conversations.
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleNewMessage = (message: any) => {
      const conversationId = String(message.conversationId);

      const incoming = message.sender?._id !== currentUser?._id;

      dispatch(
        addMessageToConversation({
          conversationId,
          message: {
            ...message,
            conversationId,
          },
          incoming,
        }),
      );
      setListRevision((revision) => revision + 1);
      if (incoming && conversationId === activeConversationId && document.visibilityState === "visible") {
        void markRead(conversationId, [String(message.id ?? message._id)]);
      }
    };

    const handleMessagesRead = (event: { conversationId: string; messageIds: string[] }) => {
      dispatch(markMessagesRead(event));
      setListRevision((revision) => revision + 1);
    };
    const handleConnect = () => {
      setListRevision((revision) => revision + 1);
      if (activeConversationId) setThreadRevision((revision) => revision + 1);
    };
    socket.on("new-message", handleNewMessage);
    socket.on("messages-read", handleMessagesRead);
    const handleConversationUpdated = () => setListRevision((revision) => revision + 1);
    socket.on("conversation-updated", handleConversationUpdated);
    socket.on("connect", handleConnect);

    return () => {
      socket.off("new-message", handleNewMessage);
      socket.off("messages-read", handleMessagesRead);
      socket.off("conversation-updated", handleConversationUpdated);
      socket.off("connect", handleConnect);
    };
  }, [dispatch, currentUser?._id, activeConversationId]);

  /*
   * ---------------------------------------------------------
   * PRESENCE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const updatePresence = (userId: string, isOnline: boolean, lastSeen?: string) => {
      const updateConversation = (chat: any) => ({
        ...chat,
        participants: chat.participants?.map((participant: any) =>
          String(participant._id ?? participant.id) === String(userId)
            ? { ...participant, isOnline, lastSeen: lastSeen ?? participant.lastSeen }
            : participant,
        ),
      });
      setMyChats((chats) => chats.map(updateConversation));
      setLinkedConversation((chat: any) => chat ? updateConversation(chat) : chat);
    };
    const handleUserOnline = (userId: string) => {
      dispatch(
        setUserPresence({
          userId,
          isOnline: true,
        }),
      );
      updatePresence(userId, true);
    };

    const handleUserOffline = (payload: {
      userId: string;
      lastSeen?: string;
    }) => {
      dispatch(
        setUserPresence({
          userId: payload.userId,
          isOnline: false,
          lastSeen: payload.lastSeen,
        }),
      );
      updatePresence(payload.userId, false, payload.lastSeen);
    };
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, [dispatch]);

  /*
   * ---------------------------------------------------------
   * MODE SWITCH
   * ---------------------------------------------------------
   */

  const handleModeChange = (nextMode: ChatMode) => {

    dispatch(setActiveConversationId(null));
    dispatch(setConversations([]));
    dispatch(handleHideMobileBottomNav(false));

    /*
     * Clear selected post/conversation from URL.
     */
    navigate(`/messaging?chatMode=${nextMode}`);
  };

  /*
   * ---------------------------------------------------------
   * SELECT POST
   * ---------------------------------------------------------
   */

  const handleSelectPost = (postId: string) => {
    dispatch(setActiveConversationId(null));
    dispatch(handleHideMobileBottomNav(false));
    navigate(`/messaging?postId=${encodeURIComponent(postId)}`);
  };

  /*
   * ---------------------------------------------------------
   * SELECT CHAT
   *
   * Used by helper's "My Chats".
   * ---------------------------------------------------------
   */

  const handleSelectChat = (chat: any) => {
    const conversationId = chat._id;
    setPageError("");

    dispatch(setActiveConversationId(conversationId));
    dispatch(handleHideMobileBottomNav(true));
    navigate(`/messaging?chatMode=chats&conversationId=${encodeURIComponent(conversationId)}`);
  };
  /*
   * ---------------------------------------------------------
   * SELECT CONVERSATION
   *
   * Used by post owner.
   * ---------------------------------------------------------
   */

  const handleSelectConversation = (conversationId: string) => {
    dispatch(setActiveConversationId(conversationId));
    dispatch(handleHideMobileBottomNav(true));

    navigate(
      `/messaging?postId=${activePostId}&conversationId=${encodeURIComponent(conversationId)}`,
    );
  };

  /*
   * ---------------------------------------------------------
   * BACK TO POSTS
   * ---------------------------------------------------------
   */

  const handleBack = () => {
    dispatch(setActiveConversationId(null));
    dispatch(handleHideMobileBottomNav(false));

    backToList();
  };

  /*
   * ---------------------------------------------------------
   * ACTIVE CONVERSATION
   * ---------------------------------------------------------
   */

  const activeConversation =
    conversations.find(
      (conversation) => conversation._id === activeConversationId,
    ) ??
    myChats.find((chat) => chat._id === activeConversationId) ??
    (linkedConversation?._id === activeConversationId
      ? linkedConversation
      : null);

  /*
   * ---------------------------------------------------------
   * ACTIVE POST
   * ---------------------------------------------------------
   */

  const activePost =
    chatPosts.find((post) => post._id === activePostId) ??
    myChats.find(
      (chat) => chat.post?._id === activePostId || chat.postId === activePostId,
    )?.post;

  const activePostTitle = activePost?.title ?? "";

  /*
   * ---------------------------------------------------------
   * RENDER
   * ---------------------------------------------------------
   */

  const sidebar =
    mode === "posts" && activePostId ? (
      <ChatList
        activeConversationId={activeConversationId}
        setActiveConversationId={handleSelectConversation}
        onBackToPosts={handleBack}
        postTitle={activePostTitle}
        loading={convsLoading}
      />
    ) : (
      <MessageSidebar
        posts={chatPosts}
        chats={myChats}
        loading={postsLoading}
        chatLoading={chatsLoading}
        selectedPostId={activePostId}
        selectedChatId={activeConversationId}
        mode={mode}
        onModeChange={handleModeChange}
        onSelectPost={handleSelectPost}
        onSelectChat={handleSelectChat}
      />
    );

  const chatPanel = (
    <ChatPanel
      activeConversation={activeConversation}
      activeMessages={activeMessages}
      currentUserId={currentUser?._id}
      mode={mode}
      onSetActiveConversation={(id) => {
        if (id) handleSelectConversation(id);
        else backFromConversation();
      }}
    />
  );

  return (
    <>
      {pageError && (
        <div
          role="alert"
          className="shrink-0 border-b border-rose-500/20 bg-rose-500/10 px-4 py-2 text-sm text-rose-300"
        >
          {pageError}
        </div>
      )}
      {isTablet ? (
        <MessagingDesktop sidebar={sidebar} chatPanel={chatPanel} />
      ) : (
        <MessagingMobile
          sidebar={sidebar}
          chatPanel={chatPanel}
          hasActiveConversation={Boolean(activeConversationId)}
        />
      )}
    </>
  );
}

/* ================================================================
   DESKTOP — list and thread side by side
================================================================ */

function MessagingDesktop({
  sidebar,
  chatPanel,
}: {
  sidebar: ReactNode;
  chatPanel: ReactNode;
}) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden border-t border-[#1e1e22] bg-[#171717] font-sans text-zinc-100">
      <div className="flex min-h-0 w-72 shrink-0 flex-col lg:w-80">
        {sidebar}
      </div>

      {chatPanel}
    </div>
  );
}

/* ================================================================
   MOBILE — one pane at a time: the list, or the open thread
================================================================ */

function MessagingMobile({
  sidebar,
  chatPanel,
  hasActiveConversation,
}: {
  sidebar: ReactNode;
  chatPanel: ReactNode;
  hasActiveConversation: boolean;
}) {
  return (
    <div className="flex min-h-0 flex-1 overflow-hidden border-t border-[#1e1e22] bg-[#171717] font-sans text-zinc-100">
      {hasActiveConversation ? (
        chatPanel
      ) : (
        <div className="flex min-h-0 w-full flex-col">{sidebar}</div>
      )}
    </div>
  );
}

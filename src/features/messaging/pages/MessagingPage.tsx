import { ReactNode, useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

import { useAppSelector, useAppDispatch } from "@/src/store/hooks";
import { useIsTablet } from "@/src/shared/hooks/useBreakpoint";
import { useSeo } from "@/src/shared/hooks/useSeo";

import {
  setActiveConversationId,
  setConversations,
  setChatPosts,
  setUserPresence,
  addMessageToConversation,
  setConversationMessages,
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

  /*
   * ---------------------------------------------------------
   * LOCAL STATE
   * ---------------------------------------------------------
   */

  const [mode, setMode] = useState<ChatMode>("posts");

  const [myChats, setMyChats] = useState<any[]>([]);

  const [postsLoading, setPostsLoading] = useState(false);
  const [chatsLoading, setChatsLoading] = useState(false);
  const [convsLoading, setConvsLoading] = useState(false);

  const loadConversationsByPost = async (postId: string) => {
    if (!token || !postId) return;

    dispatch(setActiveConversationId(null));
    setConvsLoading(true);

    try {
      const res = await apiFetch(`/api/chat/posts/${postId}/conversations`, {
        method: "GET",
        headers: {
          Authorization: `${token}`,
        },
      });

      const data = await res.json();
      dispatch(setConversations(data?.data ?? []));
    } catch (error) {
      console.error("Failed to load conversations:", error);
      dispatch(setConversations([]));
    } finally {
      setConvsLoading(false);
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

    const loadPosts = async () => {
      setPostsLoading(true);

      try {
        const res = await apiFetch("/api/chat/posts", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();

        dispatch(setChatPosts(data?.data ?? []));
      } catch (error) {
        console.error("Failed to load chat posts:", error);
        dispatch(setChatPosts([]));
      } finally {
        setPostsLoading(false);
      }
    };

    loadPosts();
  }, [token, dispatch]);

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

    const loadMyChats = async () => {
      setChatsLoading(true);
      dispatch(setActiveConversationId(null));

      try {
        const res = await apiFetch("/api/chat/my-chats", {
          method: "GET",
          headers: {
            Authorization: `${token}`,
          },
        });

        const data = await res.json();

        setMyChats(data?.data ?? []);
      } catch (error) {
        console.error("Failed to load my chats:", error);
        setMyChats([]);
      } finally {
        setChatsLoading(false);
      }
    };

    loadMyChats();
  }, [token]);

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
  }, [activePostId, mode, token, dispatch]);

  /*
   * ---------------------------------------------------------
   * RESTORE ACTIVE CONVERSATION FROM URL
   * ---------------------------------------------------------
   */

  useEffect(() => {
    if (!activeConversationFromUrl) return;

    dispatch(setActiveConversationId(activeConversationFromUrl));
  }, [activeConversationFromUrl, dispatch]);

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
    if (!activeConversationId) return;

    const joinConversation = () => {
      socket.emit(
        "join-conversation",
        activeConversationId,
        (response: any) => {
          if (!response?.success) {
            console.error("Join conversation failed:", response?.message);
          }
        },
      );
    };

    socket.on("connect", joinConversation);

    if (socket.connected) {
      joinConversation();
    }

    return () => {
      socket.off("connect", joinConversation);
    };
  }, [activeConversationId]);

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
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, [dispatch, currentUser?._id]);

  /*
   * ---------------------------------------------------------
   * PRESENCE
   * ---------------------------------------------------------
   */

  useEffect(() => {
    const handleUserOnline = (userId: string) => {
      dispatch(
        setUserPresence({
          userId,
          isOnline: true,
        }),
      );
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
    };
    socket.on("user-online", handleUserOnline);
    socket.on("user-offline", handleUserOffline);

    return () => {
      socket.off("user-online", handleUserOnline);
      socket.off("user-offline", handleUserOffline);
    };
  }, []);

  /*
   * ---------------------------------------------------------
   * MODE SWITCH
   * ---------------------------------------------------------
   */

  const handleModeChange = (nextMode: ChatMode) => {
    setMode(nextMode);

    dispatch(setActiveConversationId(null));
    dispatch(setConversations([]));
    dispatch(handleHideMobileBottomNav(false));

    /*
     * Clear selected post/conversation from URL.
     */
    navigate("/messaging", {
      replace: true,
    });
  };

  /*
   * ---------------------------------------------------------
   * SELECT POST
   * ---------------------------------------------------------
   */

  const handleSelectPost = (postId: string) => {
    setMode("posts");
    dispatch(setActiveConversationId(null));
    dispatch(handleHideMobileBottomNav(false));
    loadConversationsByPost(postId);

    navigate(`/messaging?postId=${postId}`, {
      replace: true,
    });
  };

  /*
   * ---------------------------------------------------------
   * SELECT CHAT
   *
   * Used by helper's "My Chats".
   * ---------------------------------------------------------
   */

  const handleSelectChat = async (chat: any) => {
    setMode("chats");
    const conversationId = chat._id;
    console.log(chat);

    dispatch(setActiveConversationId(conversationId));
    dispatch(handleHideMobileBottomNav(true));

    /*
     * Keep postId as well because the chat belongs to a post.
     */
    const messages = await fetch(`/api/chat/${conversationId}/messages`, {
      method: "GET",
      headers: {
        Authorization: `${token}`,
      },
    });
    const data = await messages.json();
    dispatch(
      setConversationMessages({ conversationId, messages: data?.data ?? [] }),
    );
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
      `/messaging?postId=${activePostId}&conversationId=${conversationId}`,
      {
        replace: true,
      },
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

    navigate("/messaging", {
      replace: true,
    });
  };

  /*
   * ---------------------------------------------------------
   * ACTIVE CONVERSATION
   * ---------------------------------------------------------
   */

  const activeConversation =
    conversations.find(
      (conversation) => conversation._id === activeConversationId,
    ) ?? myChats.find((chat) => chat._id === activeConversationId);

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
      onSetActiveConversation={(_id) => dispatch(setActiveConversationId(_id))}
    />
  );

  return isTablet ? (
    <MessagingDesktop sidebar={sidebar} chatPanel={chatPanel} />
  ) : (
    <MessagingMobile
      sidebar={sidebar}
      chatPanel={chatPanel}
      hasActiveConversation={Boolean(activeConversationId)}
    />
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

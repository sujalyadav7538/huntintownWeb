import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message, ChatPost } from "@/src/shared/types";

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
  chatPosts: ChatPost[];
  conversationMessages: Record<string, Message[]>;
  unreadMessageCount: number;
}

const initialState: ConversationsState = {
  conversations: [] as Conversation[],
  activeConversationId: null,
  chatPosts: [] as ChatPost[],
  conversationMessages: {},
  unreadMessageCount: 0,
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Message;
        incoming?: boolean;
      }>,
    ) => {
      const { conversationId, message, incoming } = action.payload;

      // Always maintain the messages array — don't gate on conv existence
      if (!state.conversationMessages[conversationId]) {
        state.conversationMessages[conversationId] = [];
      }

      // Deduplicate: socket room broadcasts to sender AND receiver
      const alreadyExists = state.conversationMessages[conversationId].some(
        (m) => (m.id ?? m._id) === (message.id ?? message._id),
      );
      if (!alreadyExists) {
        state.conversationMessages[conversationId].push(message);
      }

      // Update conversation metadata only if it's loaded in the list
      const conv = state.conversations.find((c) => (c.id ?? c._id) === conversationId);
      if (conv) {
        conv.lastMessage = message.text || (message as any).content || "";
        conv.lastMessageAt = message.createdAt;
        if (incoming && !alreadyExists && state.activeConversationId !== conversationId) {
          conv.unreadCount = (conv.unreadCount ?? 0) + 1;
        }
      }
    },
    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload ? action.payload : [];
    },

    setChatPosts: (state, action: PayloadAction<ChatPost[]>) => {
      state.chatPosts = action.payload;
    },

    setConversationMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
    ) => {
      const { conversationId, messages } = action.payload;
      const existing = state.conversationMessages[conversationId] ?? [];
      const merged = messages.map((message) => {
        const previous = existing.find((item) => (item.id ?? item._id) === (message.id ?? message._id));
        return previous?.isRead ? { ...message, isRead: true } : message;
      });
      for (const message of existing) {
        if (!merged.some((item) => (item.id ?? item._id) === (message.id ?? message._id))) {
          merged.push(message);
        }
      }
      state.conversationMessages[conversationId] = merged.sort(
        (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
      );
    },
    setUnreadMessageCount: (state, action: PayloadAction<number>) => {
      state.unreadMessageCount = action.payload;
    },
    markMessagesRead: (
      state,
      action: PayloadAction<{ conversationId: string; messageIds: string[] }>,
    ) => {
      const { conversationId, messageIds } = action.payload;
      for (const message of state.conversationMessages[conversationId] ?? []) {
        if (messageIds.includes(message.id ?? message._id)) message.isRead = true;
      }
    },
    replaceMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        tempId: string;
        message: Message;
      }>,
    ) => {
      const { conversationId, tempId, message } = action.payload;
      const msgs = state.conversationMessages[conversationId];
      if (!msgs) return;
      const tempIdx = msgs.findIndex((m) => (m.id ?? m._id) === tempId);
      const realIdx = msgs.findIndex((m) => (m.id ?? m._id) === (message.id ?? message._id));
      if (tempIdx >= 0) {
        if (realIdx >= 0 && realIdx !== tempIdx) {
          // Real message already arrived via new-message event before callback
          msgs.splice(tempIdx, 1);
          const adjusted = realIdx > tempIdx ? realIdx - 1 : realIdx;
          msgs[adjusted] = { ...msgs[adjusted], sendStatus: message.sendStatus };
        } else {
          msgs[tempIdx] = message;
        }
      } else if (realIdx >= 0) {
        msgs[realIdx] = { ...msgs[realIdx], sendStatus: message.sendStatus };
      }
    },
    setMessageStatus: (
      state,
      action: PayloadAction<{
        conversationId: string;
        messageId: string;
        status: Message["sendStatus"];
      }>,
    ) => {
      const { conversationId, messageId, status } = action.payload;
      const msg = state.conversationMessages[conversationId]?.find(
        (m) => (m.id ?? m._id) === messageId,
      );
      if (msg) msg.sendStatus = status;
    },
    setUserPresence: (
      state,
      action: PayloadAction<{
        userId: string;
        isOnline: boolean;
        lastSeen?: string;
      }>,
    ) => {
      const { userId, isOnline, lastSeen } = action.payload;
      state.conversations = state.conversations.map((conversation) => ({
        ...conversation,
        participants: conversation.participants.map((participant) =>
          (participant.id ?? participant._id) === userId
            ? { ...participant, isOnline, lastSeen: lastSeen ?? participant.lastSeen }
            : participant,
        ),
      }));
    },
  },
});

export const {
  setActiveConversationId,
  addMessageToConversation,
  setConversations,
  setChatPosts,
  setConversationMessages,
  setUnreadMessageCount,
  markMessagesRead,
  replaceMessage,
  setMessageStatus,
  setUserPresence,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
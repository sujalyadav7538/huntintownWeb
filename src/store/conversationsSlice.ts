import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message, ChatPost } from "../types";

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
  chatPosts: ChatPost[];
  conversationMessages: Record<string, Message[]>;
}

const initialState: ConversationsState = {
  conversations: [] as Conversation[],
  activeConversationId: null,
  chatPosts: [] as ChatPost[],
  conversationMessages: {},
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
        (m) => m._id === message._id,
      );
      if (!alreadyExists) {
        state.conversationMessages[conversationId].push(message);
      }

      // Update conversation metadata only if it's loaded in the list
      const conv = state.conversations.find((c) => c._id === conversationId);
      if (conv) {
        conv.lastMessage = message.text || (message as any).content || "";
        conv.lastMessageAt = message.createdAt;
        if (incoming && !alreadyExists) conv.unreadCount = (conv.unreadCount ?? 0) + 1;
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
      state.conversationMessages[action.payload.conversationId] =
        action.payload.messages;
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
      const tempIdx = msgs.findIndex((m) => m._id === tempId);
      const realIdx = msgs.findIndex((m) => m._id === message._id);
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
        (m) => m._id === messageId,
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
          participant.id === userId
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
  replaceMessage,
  setMessageStatus,
  setUserPresence,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Conversation, Message } from "../types";

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
  conversationMessages: Record<string, Message[]>; // Store messages for each conversation
}

const initialState: ConversationsState = {
  conversations: [] as Conversation[],
  activeConversationId: null,
  conversationMessages: {},
};

export const conversationsSlice = createSlice({
  name: "conversations",
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const idx = state.conversations.findIndex(
        (c) => c._id === action.payload._id,
      );
      if (idx >= 0) {
        state.conversations[idx] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Message;
        incoming?: boolean;
      }>,
    ) => {
      const conv = state.conversations.find(
        (c) => c._id === action.payload.conversationId,
      );
      if (conv) {
        if (!state.conversationMessages[conv._id]) {
          state.conversationMessages[conv._id] = [];
        }
        state.conversationMessages[conv._id].push(action.payload.message);
        conv.lastMessage = action.payload.message.text;
        conv.lastMessageAt = action.payload.message.createdAt;
        if (action.payload.incoming) conv.unreadCount = (conv.unreadCount ?? 0) + 1;
      }
    },
    markConversationRead: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c._id === action.payload);
      if (conv) conv.unreadCount = 0;
    },
    clearUnreadForUser: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.map((c) =>
        c.participants.some((p) => p.id === action.payload)
          ? { ...c, unreadCount: 0 }
          : c,
      );
    },

    setConversations: (state, action: PayloadAction<Conversation[]>) => {
      state.conversations = action.payload ? action.payload : [];
    },

    setConversationMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: Message[] }>,
    ) => {
      state.conversationMessages[action.payload.conversationId] =
        action.payload.messages;
    },
    updateConversationLastMessage: (
      state,
      action: PayloadAction<{
        conversationId: string;
        message: Message;
      }>,
    ) => {
      const { conversationId, message } = action.payload;

      const conv = state.conversations.find((c) => c._id === conversationId);

      if (!conv) return;

      if (!state.conversationMessages[conversationId]) {
        state.conversationMessages[conversationId] = [];
      }

      state.conversationMessages[conversationId].push(message);

      conv.lastMessage = message.text;
      conv.lastMessageAt = message.createdAt;
    },
  },
});

export const {
  setActiveConversationId,
  upsertConversation,
  addMessageToConversation,
  markConversationRead,
  clearUnreadForUser,
  setConversations,
  setConversationMessages,
  updateConversationLastMessage,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;

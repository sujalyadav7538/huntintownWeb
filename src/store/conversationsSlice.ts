import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Conversation, Message } from '../types';
import { INITIAL_CONVERSATIONS } from '../data';

interface ConversationsState {
  conversations: Conversation[];
  activeConversationId: string | null;
}

const savedConvs = localStorage.getItem('neighbourly_conversations');
const initialState: ConversationsState = {
  conversations: savedConvs ? JSON.parse(savedConvs) : INITIAL_CONVERSATIONS,
  activeConversationId: null,
};

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    setActiveConversationId: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
    },
    upsertConversation: (state, action: PayloadAction<Conversation>) => {
      const idx = state.conversations.findIndex((c) => c.id === action.payload.id);
      if (idx >= 0) {
        state.conversations[idx] = action.payload;
      } else {
        state.conversations.unshift(action.payload);
      }
    },
    addMessageToConversation: (
      state,
      action: PayloadAction<{ conversationId: string; message: Message; incoming?: boolean }>
    ) => {
      const conv = state.conversations.find((c) => c.id === action.payload.conversationId);
      if (conv) {
        conv.messages.push(action.payload.message);
        conv.lastMessage = action.payload.message.content;
        conv.lastMessageAt = action.payload.message.createdAt;
        if (action.payload.incoming) conv.unreadCount++;
      }
    },
    markConversationRead: (state, action: PayloadAction<string>) => {
      const conv = state.conversations.find((c) => c.id === action.payload);
      if (conv) conv.unreadCount = 0;
    },
    clearUnreadForUser: (state, action: PayloadAction<string>) => {
      state.conversations = state.conversations.map((c) =>
        c.participant.id === action.payload ? { ...c, unreadCount: 0 } : c
      );
    },
  },
});

export const {
  setActiveConversationId,
  upsertConversation,
  addMessageToConversation,
  markConversationRead,
  clearUnreadForUser,
} = conversationsSlice.actions;
export default conversationsSlice.reducer;

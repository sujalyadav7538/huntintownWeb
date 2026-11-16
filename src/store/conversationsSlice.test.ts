import { test } from "node:test";
import assert from "node:assert/strict";
import reducer, {
  addMessageToConversation,
  markMessagesRead,
  replaceMessage,
  setActiveConversationId,
  setConversationMessages,
  setConversations,
} from "./conversationsSlice";
import type { Conversation, Message } from "@/src/shared/types";

const message = (id: string, isRead = false): Message => ({
  _id: id,
  conversationId: "chat",
  sender: { _id: "other", name: "Other", avatar: "" },
  text: id,
  isRead,
  createdAt: "2026-01-01T00:00:00.000Z",
});

test("deduplicates messages without a virtual id and updates unread once", () => {
  const conversation: Conversation = { _id: "chat", participants: [], status: "active", unreadCount: 0 };
  let state = reducer(undefined, setConversations([conversation]));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("one"), incoming: true }));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("one"), incoming: true }));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("two"), incoming: true }));
  assert.equal(state.conversationMessages.chat.length, 2);
  assert.equal(state.conversations[0].unreadCount, 2);
});

test("a stale history response preserves live messages and read receipts", () => {
  let state = reducer(undefined, addMessageToConversation({ conversationId: "chat", message: message("one") }));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("two") }));
  state = reducer(state, markMessagesRead({ conversationId: "chat", messageIds: ["one"] }));
  state = reducer(state, setConversationMessages({ conversationId: "chat", messages: [message("one")] }));
  assert.equal(state.conversationMessages.chat.length, 2);
  assert.equal(state.conversationMessages.chat.find((item) => item._id === "one")?.isRead, true);
  assert.equal(state.conversationMessages.chat.find((item) => item._id === "two")?.isRead, false);
});

test("an open conversation does not increment its local unread badge", () => {
  const conversation: Conversation = { _id: "chat", participants: [], status: "active", unreadCount: 0 };
  let state = reducer(undefined, setConversations([conversation]));
  state = reducer(state, setActiveConversationId("chat"));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("one"), incoming: true }));
  assert.equal(state.conversations[0].unreadCount, 0);
});

test("a send acknowledgement does not undo a receipt received first", () => {
  let state = reducer(undefined, addMessageToConversation({ conversationId: "chat", message: message("temp") }));
  state = reducer(state, addMessageToConversation({ conversationId: "chat", message: message("real") }));
  state = reducer(state, markMessagesRead({ conversationId: "chat", messageIds: ["real"] }));
  state = reducer(state, replaceMessage({
    conversationId: "chat",
    tempId: "temp",
    message: { ...message("real"), sendStatus: "sent" },
  }));
  assert.equal(state.conversationMessages.chat.length, 1);
  assert.equal(state.conversationMessages.chat[0].isRead, true);
});

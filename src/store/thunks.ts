import { AppDispatch, RootState } from './index';
import { Comment, User, Message, Conversation } from '../types';
import { addComment } from './postsSlice';
import {
  upsertConversation,
  addMessageToConversation,
  setActiveConversationId,
} from './conversationsSlice';

// ─── Add comment + trigger auto-reply + auto-chat ───────────────────────────
export const submitComment =
  (
    postId: string,
    content: string,
    isOffer: boolean,
    offerBudget?: string,
    offerDuration?: string,
    answers?: { question: string; answer: string }[]
  ) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentUser } = getState().auth;
    const posts = getState().posts;

    const newComment: Comment = {
      id: `comment_${Date.now()}`,
      postId,
      author: currentUser,
      content,
      createdAt: new Date().toISOString(),
      isOffer,
      offerBudget,
      offerDuration,
      answers,
    };

    dispatch(addComment({ postId, comment: newComment, isOffer }));

    const targetPost = posts.find((p) => p.id === postId);
    if (targetPost && targetPost.author.id !== currentUser.id) {
      setTimeout(() => {
        const replyComment: Comment = {
          id: `comment_reply_${Date.now()}`,
          postId,
          author: targetPost.author,
          content: `Hi ${currentUser.name}! Thank you extremely much for your comment response on my HuntInTown request. I am super excited to coordinate on this right away with you. Check your direct messages!`,
          createdAt: new Date().toISOString(),
        };
        dispatch(addComment({ postId, comment: replyComment, isOffer: false }));

        dispatch(
          openDirectChat(
            targetPost.author,
            `Hey there ${currentUser.name}! Saw your response / proposal on my post ("${targetPost.title}"). Let me know what hours work best for you!`
          )
        );
      }, 2000);
    }
  };

// ─── Open or create a direct chat channel ───────────────────────────────────
export const openDirectChat =
  (recipient: User, initialMsg?: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { conversations } = getState().conversations;
    const { currentUser } = getState().auth;
    const existing = conversations.find((c) => c.participant.id === recipient.id);

    if (existing) {
      if (initialMsg) {
        const newMsg: Message = {
          id: `m_${Date.now()}`,
          senderId: recipient.id,
          receiverId: currentUser.id,
          content: initialMsg,
          createdAt: new Date().toISOString(),
          read: false,
        };
        dispatch(
          addMessageToConversation({
            conversationId: existing.id,
            message: newMsg,
            incoming: true,
          })
        );
      }
      dispatch(setActiveConversationId(existing.id));
    } else {
      const channelId = `conv_${Date.now()}`;
      const msgContent =
        initialMsg || `Hi ${recipient.name}, I would love to connect about your local post profile!`;

      const newMsg: Message = {
        id: `m_${Date.now()}`,
        senderId: recipient.id,
        receiverId: currentUser.id,
        content: msgContent,
        createdAt: new Date().toISOString(),
        read: false,
      };

      const newConv: Conversation = {
        id: channelId,
        participant: recipient,
        messages: [newMsg],
        lastMessage: msgContent,
        lastMessageAt: new Date().toISOString(),
        unreadCount: 1,
      };

      dispatch(upsertConversation(newConv));
      dispatch(setActiveConversationId(channelId));
    }
  };

// ─── Send a message + trigger smart auto-reply ───────────────────────────────
export const sendMessage =
  (conversationId: string, content: string) =>
  (dispatch: AppDispatch, getState: () => RootState) => {
    const { currentUser } = getState().auth;
    const { conversations, activeConversationId } = getState().conversations;

    const outgoing: Message = {
      id: `m_sent_${Date.now()}`,
      senderId: currentUser.id,
      receiverId: conversationId.replace('conv_', ''),
      content,
      createdAt: new Date().toISOString(),
      read: true,
    };

    dispatch(addMessageToConversation({ conversationId, message: outgoing }));

    const conv = conversations.find((c) => c.id === conversationId);
    const rc = conv?.participant;
    if (!rc) return;

    setTimeout(() => {
      let replyText = `Thanks for the details! Let's arrange a time. I'm located near Noida Sector 62.`;
      if (rc.id === 'user_sarah') {
        replyText = `That is very kind of you, ${currentUser.name}! The furniture guidelines are ready. Saturdays work wonderfully.`;
      } else if (rc.id === 'user_david') {
        replyText = `Awesome! I can share some design concepts with you anytime!`;
      } else if (rc.id === 'user_elena') {
        replyText = `Understood! I'll put a sample blueprint on the shelf near my office.`;
      } else if (rc.id === 'user_marcus') {
        replyText = `Great. Let's start the installation this weekend!`;
      }

      const reply: Message = {
        id: `m_reply_${Date.now()}`,
        senderId: rc.id,
        receiverId: currentUser.id,
        content: replyText,
        createdAt: new Date().toISOString(),
        read: false,
      };

      dispatch(
        addMessageToConversation({
          conversationId,
          message: reply,
          incoming: activeConversationId !== conversationId,
        })
      );
    }, 1500);
  };

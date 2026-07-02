import { AppDispatch, RootState } from './index';
import { apiFetch } from '../lib/api';
import { deletePost, updatePostStatus, upsertPost, normalizePost, addComment } from './postsSlice';
import { setConversations } from './conversationsSlice';
import { Comment } from '../types';

// ─── Create a post via API then upsert into Redux ────────────────────────────
export const createPostThunk =
  (postData: Record<string, unknown>) =>
  async (dispatch: AppDispatch): Promise<string> => {
    const token = localStorage.getItem('access_token');
    const res = await apiFetch('/api/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify(postData),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to create post');
    const normalized = normalizePost(data.post);
    dispatch(upsertPost(normalized));
    return normalized.id;
  };

// ─── Delete a post via API then remove from Redux ────────────────────────────
export const deletePostThunk =
  (postId: string) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const res = await apiFetch(`/api/posts/${postId}`, {
      method: 'DELETE',
      headers: { Authorization: `${token}` },
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      throw new Error((data as any).message || 'Failed to delete post');
    }
    dispatch(deletePost(postId));
  };

// ─── Update post status via API then sync Redux ───────────────────────────────
export const updatePostStatusThunk =
  (
    postId: string,
    status: 'live' | 'in_progress' | 'completed' | 'expired' | 'cancelled',
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const res = await apiFetch(`/api/posts/${postId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ status }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update post status');
    dispatch(updatePostStatus({ postId, status }));
  };

// ─── Fetch conversations from API and store in Redux ─────────────────────────
export const fetchConversations =
  () =>
  async (dispatch: AppDispatch, getState: () => RootState): Promise<void> => {
    const token = getState().auth.token;
    if (!token) return;
    const res = await apiFetch('/api/chat/conversations', {
      headers: { Authorization: `${token}` },
    });
    if (!res.ok) return;
    const data = await res.json();
    dispatch(setConversations(data?.data ?? []));
  };

// ─── Submit an offer via API then optimistically update Redux ─────────────────
export const submitOfferThunk =
  (
    postId: string,
    message: string,
    answers: { question: string; answer: string }[],
  ) =>
  async (dispatch: AppDispatch): Promise<void> => {
    const token = localStorage.getItem('access_token');
    const res = await apiFetch('/api/offers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `${token}`,
      },
      body: JSON.stringify({ postId, message, answers }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to submit offer');
    const fakeComment: Comment = {
      _id: data.offer?._id || `offer_${Date.now()}`,
      postId,
      author: data.offer?.offeredBy,
      content: message,
      createdAt: data.offer?.createdAt || new Date().toISOString(),
      isOffer: true,
      answers,
    };
    dispatch(addComment({ postId, comment: fakeComment, isOffer: true }));
  };

// ─── Navigate to messaging — real conversations are created server-side ───────
export const openDirectChat =
  (_recipient: unknown) =>
  (_dispatch: AppDispatch): void => {
    // Conversations are created in the backend when an offer is accepted.
    // Just navigate to /messaging; Messaging.tsx fetches all conversations on mount.
  };

// ─── sendMessage is handled via socket.io in MessageInput.tsx ────────────────
export const sendMessage =
  (_conversationId: string, _content: string) =>
  (_dispatch: AppDispatch): void => {
    // No-op: MessageInput.tsx emits directly via socket.io.
  };

// ─── (legacy) submitComment — use submitOfferThunk instead ────────────────────
export const submitComment =
  () =>
  (_dispatch: AppDispatch): void => {
    // Deprecated.
  };


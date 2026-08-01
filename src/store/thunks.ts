import { AppDispatch } from './index';
import { apiFetch } from '../lib/api';
import { deletePost, updatePostStatus, upsertPost, normalizePost, addComment } from './postsSlice';
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
    const isCompletion = status === 'completed';
    const res = await apiFetch(
      isCompletion ? `/api/posts/${postId}/complete` : `/api/posts/${postId}`,
      {
        method: isCompletion ? 'PATCH' : 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `${token}`,
        },
        body: isCompletion ? undefined : JSON.stringify({ status }),
      },
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Failed to update post status');
    dispatch(updatePostStatus({ postId, status }));
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


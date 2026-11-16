import { useState } from "react";
import { apiFetch } from "@/src/shared/lib/api";
import PostDetailView from "@/src/features/explore/components/PostDetailView";
import { normalizePost } from "@/src/store/postsSlice";
import type { DashboardPost } from "../types";

interface ReceivedOffersViewProps {
  post: DashboardPost;
  onClose: () => void;
  onInitiateChat: (postId: string, conversationId?: string) => void;
  onChanged: () => Promise<void>;
}

export default function ReceivedOffersView({
  post,
  onClose,
  onInitiateChat,
  onChanged,
}: ReceivedOffersViewProps) {
  const [startingResponseId, setStartingResponseId] = useState<string | null>(
    null,
  );

  const openConversation = async (responseId: string) => {
    setStartingResponseId(responseId);
    try {
      const response = await apiFetch(
        `/api/responses/${responseId}/conversation`,
        { method: "POST" },
      );
      const body = await response.json();
      if (!response.ok) {
        throw new Error(body?.message || "Could not open this conversation.");
      }

      const conversationId = body.conversation?.id ?? body.conversation?._id;
      if (!conversationId) {
        throw new Error("The conversation could not be opened.");
      }

      await onChanged();
      onInitiateChat(post._id, conversationId);
    } finally {
      setStartingResponseId(null);
    }
  };

  return (
    <PostDetailView
      key={post._id}
      post={normalizePost(post)}
      hasApplied
      viewOnly
      responseLimit={10}
      onBack={onClose}
      backLabel="My published requirements"
      onStartChat={openConversation}
      startingResponseId={startingResponseId}
    />
  );
}

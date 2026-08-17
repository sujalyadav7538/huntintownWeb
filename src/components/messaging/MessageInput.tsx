import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import EmojiPicker, { EmojiClickData, Theme } from "emoji-picker-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { socket } from "@/src/lib/socket";
import { Message } from "@/src/types";
import {
  addMessageToConversation,
  replaceMessage,
  setMessageStatus,
} from "@/src/store/conversationsSlice";
import { apiFetch } from "@/src/lib/api";

interface MessageInputProps {
  participantName: string;
}

export default function MessageInput({ participantName }: MessageInputProps) {
  const [typedText, setTypedText] = useState("");
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const pickerRef = useRef<HTMLDivElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const conversationId = useAppSelector(
    (s) => s.conversations.activeConversationId,
  );
  const token = useAppSelector((s) => s.auth.token);
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!typedText.trim() || !conversationId || !currentUser) return;

    if (!socket.connected) {
      alert("Connection lost. Please refresh the page.");
      return;
    }

    const text = typedText.trim();
    const tempId = `_temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;

    const optimistic: Message = {
      _id: tempId,
      conversationId,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      text,
      content: text,
      messageType: "text",
      isRead: false,
      createdAt: new Date().toISOString(),
      sendStatus: "sending",
    };

    dispatch(addMessageToConversation({ conversationId, message: optimistic }));
    setTypedText("");
    setIsEmojiOpen(false);

    socket.emit("send-message", { conversationId, text }, (response: any) => {
      if (response.success) {
        dispatch(
          replaceMessage({
            conversationId,
            tempId,
            message: { ...response.message, sendStatus: "sent" },
          }),
        );
      } else {
        dispatch(
          setMessageStatus({
            conversationId,
            messageId: tempId,
            status: "failed",
          }),
        );
      }
    });
  };

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (!pickerRef.current) return;
      if (!pickerRef.current.contains(event.target as Node)) {
        setIsEmojiOpen(false);
      }
    };

    if (isEmojiOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isEmojiOpen]);

  const handleEmojiSelect = (emoji: EmojiClickData) => {
    setTypedText((prev) => `${prev}${emoji.emoji}`);
  };

  const handleUploadAttachment = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (!file || !conversationId || !token || !currentUser) {
      if (!token) alert("Your session has expired. Please login again.");
      event.target.value = "";
      return;
    }

    const tempId = `_temp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const caption = typedText.trim();
    const inferredType = file.type.startsWith("image/")
      ? "image"
      : file.type.startsWith("video/")
        ? "video"
        : file.type.startsWith("audio/")
          ? "audio"
          : "document";

    const optimistic: Message = {
      _id: tempId,
      conversationId,
      sender: {
        id: currentUser.id,
        name: currentUser.name,
        avatar: currentUser.avatar,
      },
      text: caption || file.name,
      content: caption,
      messageType: inferredType as Message["messageType"],
      isRead: false,
      createdAt: new Date().toISOString(),
      sendStatus: "sending",
      attachment: { fileName: file.name, mimeType: file.type, size: file.size },
    };

    dispatch(addMessageToConversation({ conversationId, message: optimistic }));
    setTypedText("");
    setIsEmojiOpen(false);

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append("file", file);

      const uploadRes = await apiFetch("/api/chat/upload", {
        method: "POST",
        headers: { Authorization: `${token}` },
        body: formData,
      });

      const uploadData = await uploadRes.json();
      if (!uploadRes.ok || !uploadData?.data?.url) {
        throw new Error(uploadData?.message || "Failed to upload file");
      }

      const messageRes = await apiFetch("/api/chat/messages", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          conversationId,
          messageType: uploadData.data.messageType,
          content: caption,
          attachment: {
            url: uploadData.data.url,
            publicId: uploadData.data.publicId,
            fileName: uploadData.data.fileName,
            mimeType: uploadData.data.mimeType,
            size: uploadData.data.size,
            thumbnail: uploadData.data.thumbnail,
          },
        }),
      });

      const messageData = await messageRes.json();
      if (!messageRes.ok)
        throw new Error(messageData?.message || "Failed to send attachment");

      dispatch(
        replaceMessage({
          conversationId,
          tempId,
          message: { ...messageData.data, sendStatus: "sent" },
        }),
      );
    } catch (error) {
      dispatch(
        setMessageStatus({
          conversationId,
          messageId: tempId,
          status: "failed",
        }),
      );
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="shrink-0 border-t border-white/6 bg-[#0c0c0e]">
      {/* Emoji picker */}
      {isEmojiOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-[calc(100%+10px)] left-3 z-50 overflow-hidden rounded-2xl border border-white/[0.08] shadow-2xl"
        >
          <EmojiPicker
            onEmojiClick={handleEmojiSelect}
            theme={Theme.DARK}
            previewConfig={{ showPreview: false }}
            skinTonesDisabled
            width={320}
            height={380}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex items-end gap-2 px-3 py-3 sm:px-4 sm:py-3.5"
      >
        {/* Attachment */}
        <button
          type="button"
          title="Attach file"
          disabled={isUploading}
          onClick={() => fileInputRef.current?.click()}
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-300 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Paperclip className="h-[17px] w-[17px]" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUploadAttachment}
        />

        {/* Message composer */}
        <div className="relative flex min-w-0 flex-1 items-center rounded-2xl border border-white/[0.07] bg-[#141416] transition focus-within:border-[#FF3F3F]/40 focus-within:bg-[#171719]">
          {/* Emoji */}
          <button
            id="emoji-chat-btn"
            type="button"
            title="Add emoji"
            disabled={isUploading}
            onClick={() => setIsEmojiOpen((prev) => !prev)}
            className={`ml-1 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition ${
              isEmojiOpen
                ? "bg-white/[0.07] text-zinc-200"
                : "text-zinc-500 hover:bg-white/[0.05] hover:text-zinc-300"
            } disabled:opacity-40`}
          >
            <Smile className="h-[18px] w-[18px]" />
          </button>

          <input
            id="chat-message-text-input"
            type="text"
            value={typedText}
            onChange={(e) => setTypedText(e.target.value)}
            placeholder={`Message ${participantName || "user"}...`}
            disabled={isUploading}
            required
            autoComplete="off"
            className="min-w-0 flex-1 bg-transparent px-2.5 py-2.5 text-sm text-zinc-200 outline-none placeholder:text-zinc-600 disabled:cursor-not-allowed"
          />
        </div>

        {/* Send */}
        <button
          id="chat-send-submit"
          type="submit"
          disabled={isUploading || !typedText.trim()}
          className="mb-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FF3F3F] text-white transition hover:bg-[#e53535] active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          {isUploading ? (
            <span className="text-[10px] font-bold">...</span>
          ) : (
            <Send className="h-4 w-4" />
          )}
        </button>
      </form>
    </div>
  );
}

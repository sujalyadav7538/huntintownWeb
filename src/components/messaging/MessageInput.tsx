import { useEffect, useRef, useState } from "react";
import { Paperclip, Send, Smile } from "lucide-react";
import Picker from "@emoji-mart/react";
import data from "@emoji-mart/data";
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
      sender: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
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
        dispatch(setMessageStatus({ conversationId, messageId: tempId, status: "failed" }));
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

  const handleEmojiSelect = (emoji: { native?: string }) => {
    if (!emoji?.native) return;
    setTypedText((prev) => `${prev}${emoji.native}`);
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
      sender: { id: currentUser.id, name: currentUser.name, avatar: currentUser.avatar },
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
        headers: { "Content-Type": "application/json", Authorization: `${token}` },
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
      if (!messageRes.ok) throw new Error(messageData?.message || "Failed to send attachment");

      dispatch(
        replaceMessage({
          conversationId,
          tempId,
          message: { ...messageData.data, sendStatus: "sent" },
        }),
      );
    } catch (error) {
      dispatch(setMessageStatus({ conversationId, messageId: tempId, status: "failed" }));
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  return (
    <div className="relative border-t border-[#1e1e22] bg-[#0c0c0e]">
      {isEmojiOpen && (
        <div
          ref={pickerRef}
          className="absolute bottom-[calc(100%+10px)] left-4 z-50 rounded-xl border border-[#1e1e22] shadow-2xl overflow-hidden"
        >
          <Picker
            data={data}
            onEmojiSelect={handleEmojiSelect}
            theme="dark"
            previewPosition="none"
            skinTonePosition="none"
            navPosition="bottom"
            perLine={8}
          />
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="px-4 py-3 flex items-center gap-2 font-sans sm:px-5"
      >
        <button
          type="button"
          className="rounded-md p-2 text-zinc-500 transition cursor-pointer hover:bg-[#141416] hover:text-zinc-300"
          title="Attach file"
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
        >
          <Paperclip className="w-5 h-5" />
        </button>

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          onChange={handleUploadAttachment}
        />

        <button
          id="emoji-chat-btn"
          type="button"
          className={`rounded-md p-2 transition cursor-pointer ${
            isEmojiOpen
              ? "bg-[#1d1d21] text-zinc-200"
              : "text-zinc-500 hover:bg-[#141416] hover:text-zinc-300"
          }`}
          title="Choose mood emojis"
          onClick={() => setIsEmojiOpen((prev) => !prev)}
        >
          <Smile className="w-5 h-5" />
        </button>

        <input
          id="chat-message-text-input"
          type="text"
          placeholder={`Type immediate signal message to ${participantName}...`}
          value={typedText}
          onChange={(e) => setTypedText(e.target.value)}
          className="flex-1 rounded-md border border-[#1e1e22] bg-[#141416] px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 focus:outline-none focus:border-[#FF3F3F]/60"
          required
          disabled={isUploading}
        />

        <button
          id="chat-send-submit"
          type="submit"
          disabled={isUploading}
          className="flex shrink-0 items-center justify-center rounded-md bg-[#FF3F3F] p-2.5 text-white transition cursor-pointer hover:bg-[#e53535] active:scale-95"
        >
          {isUploading ? (
            <span className="text-[10px] font-semibold">...</span>
          ) : (
            <Send className="w-3.5 h-3.5 text-white" />
          )}
        </button>
      </form>
    </div>
  );
}

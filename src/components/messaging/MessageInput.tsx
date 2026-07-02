import { useEffect, useState } from "react";
import { Send, Smile } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { socket } from "@/src/lib/socket";
import { Message } from "@/src/types";
import { updateConversationLastMessage } from "@/src/store/conversationsSlice";

interface MessageInputProps {
  participantName: string;
  onSendMessage?: (content: string) => void;
}

export default function MessageInput({ participantName }: MessageInputProps) {
  const [typedText, setTypedText] = useState("");
  const conversationId = useAppSelector(
    (s) => s.conversations.activeConversationId,
  );
  const dispatch = useAppDispatch();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!typedText.trim()) return;

    console.log("[MessageInput] Submit clicked", {
      conversationId,
      textLength: typedText.length,
      socketConnected: socket.connected,
      socketId: socket.id,
    });

    if (!socket.connected) {
      console.error("❌ Socket not connected!", {
        connected: socket.connected,
        id: socket.id,
      });
      alert("Connection lost. Please refresh the page.");
      return;
    }

    if (!conversationId) {
      console.error("❌ No conversation selected");
      alert("Please select a conversation first.");
      return;
    }

    console.log("[MessageInput] Emitting send-message...");
    socket.emit(
      "send-message",
      {
        conversationId,
        text: typedText.trim(),
      },
      (response) => {
        console.log("[MessageInput] Callback received:", response);
        if (response.success) {
          console.log("✅ Message sent");
          setTypedText("");
        } else {
          console.error("❌ Message send failed:", response.message);
        }
      },
    );
  };

  useEffect(() => {
    const handleNewMessage = (message: Message) => {
      console.log("New message:", message);
      dispatch(
        updateConversationLastMessage({
          conversationId: message.conversationId,
          message,
        }),
      );
    };

    socket.on("new-message", handleNewMessage);

    return () => {
      socket.off("new-message", handleNewMessage);
    };
  }, []);

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-[#1e1e22] bg-[#0c0c0e] px-4 py-3 flex items-center gap-2 font-sans sm:px-5"
    >
      <button
        id="emoji-chat-btn"
        type="button"
        className="rounded-md p-2 text-zinc-500 transition cursor-pointer hover:bg-[#141416] hover:text-zinc-300"
        title="Choose mood emojis"
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
      />

      <button
        id="chat-send-submit"
        type="submit"
        className="flex shrink-0 items-center justify-center rounded-md bg-[#FF3F3F] p-2.5 text-white transition cursor-pointer hover:bg-[#e53535] active:scale-95"
      >
        <Send className="w-3.5 h-3.5 text-white" />
      </button>
    </form>
  );
}

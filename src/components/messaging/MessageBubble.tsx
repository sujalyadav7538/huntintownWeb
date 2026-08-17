import { AlertCircle, CheckCheck, Loader2 } from "lucide-react";
import { Message } from "../../types";

interface MessageBubbleProps {
  msg: Message;
  currentUserId: string;
}

export default function MessageBubble({
  msg,
  currentUserId,
}: MessageBubbleProps) {
  const isMe = msg.sender.id === currentUserId;
  const hasAttachment = Boolean(msg.attachment?.url);
  const isImage = msg.messageType === "image";

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[72%] sm:max-w-[65%] overflow-hidden rounded-2xl border shadow-sm ${
          isMe
            ? "rounded-br-md border-[#ff5555]/25 bg-[#8f2929] text-white"
            : "rounded-bl-md border-[#29292f] bg-[#1c1c21] text-zinc-100"
        }`}
      >
        {/* Image */}
        {hasAttachment && isImage && (
          <a
            href={msg.attachment?.url}
            target="_blank"
            rel="noreferrer"
            className="block p-1.5"
          >
            <img
              src={msg.attachment?.thumbnail || msg.attachment?.url}
              alt={msg.attachment?.fileName || "attachment"}
              className="max-h-56 w-auto max-w-full rounded-xl object-cover"
            />
          </a>
        )}

        {/* File */}
        {hasAttachment && !isImage && (
          <a
            href={msg.attachment?.url}
            target="_blank"
            rel="noreferrer"
            className={`mx-1.5 mt-1.5 block rounded-lg border px-2.5 py-2 ${
              isMe
                ? "border-white/10 bg-black/10"
                : "border-white/[0.06] bg-black/20"
            }`}
          >
            <p className="max-w-52 truncate text-[11px] font-semibold text-white">
              {msg.attachment?.fileName || "Attachment"}
            </p>

            <p
              className={`mt-0.5 truncate text-[9px] ${
                isMe ? "text-red-100/60" : "text-zinc-500"
              }`}
            >
              {msg.attachment?.mimeType || "File"}
            </p>
          </a>
        )}

        {/* Text + time */}
        {msg.text && (
          <div className="px-3 py-2">
            <p className="whitespace-pre-wrap break-words text-[12px] leading-[1.45]">
              {msg.text}
            </p>

            <div
              className={`mt-1 flex items-center justify-end gap-1 ${
                isMe ? "text-red-100/60" : "text-zinc-500"
              }`}
            >
              <span className="text-[8px] leading-none tabular-nums">
                {new Date(msg.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>

              {isMe && msg.sendStatus === "sending" && (
                <Loader2 className="h-2.5 w-2.5 animate-spin" />
              )}

              {isMe && msg.sendStatus === "failed" && (
                <AlertCircle className="h-2.5 w-2.5 text-red-300" />
              )}

              {isMe && (!msg.sendStatus || msg.sendStatus === "sent") && (
                <CheckCheck className="h-2.5 w-2.5" />
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

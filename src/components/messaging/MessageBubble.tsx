"use client";

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
        className={`max-w-[78%] rounded-2xl border px-3.5 py-3 text-xs leading-relaxed backdrop-blur-sm ${
          isMe
            ? "rounded-br-md border-[#ff6a6a]/25 bg-[linear-gradient(180deg,rgba(255,63,63,0.22),rgba(255,63,63,0.14))] text-white"
            : "rounded-bl-md border-[#26262b] bg-[#121216]/92 text-zinc-100"
        }`}
      >
        {hasAttachment && isImage ? (
          <a href={msg.attachment?.url} target="_blank" rel="noreferrer">
            <img
              src={msg.attachment?.thumbnail || msg.attachment?.url}
              alt={msg.attachment?.fileName || "attachment"}
              className="mb-2 max-h-60 w-auto rounded-lg border border-[#2a2a2f] object-cover"
            />
          </a>
        ) : null}

        {hasAttachment && !isImage ? (
          <a
            href={msg.attachment?.url}
            target="_blank"
            rel="noreferrer"
            className="mb-2 block rounded-lg border border-[#2a2a2f] bg-[#0d0d11] px-3 py-2 text-[11px] text-zinc-200 hover:border-[#3a3a42]"
          >
            <p className="font-semibold truncate">{msg.attachment?.fileName || "Attachment"}</p>
            <p className="text-[10px] text-zinc-500 mt-0.5">
              {msg.attachment?.mimeType || "file"}
            </p>
          </a>
        ) : null}

        {msg.text ? <p className="whitespace-pre-wrap">{msg.text}</p> : null}

        <div
          className={`flex justify-end items-center gap-1 mt-1 text-[9px] ${
            isMe ? "text-rose-200" : "text-zinc-500"
          }`}
        >
          <span>
            {new Date(msg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>

          {isMe && msg.sendStatus === "sending" && (
            <Loader2 className="w-3 h-3 animate-spin text-zinc-400" />
          )}
          {isMe && msg.sendStatus === "failed" && (
            <AlertCircle className="w-3 h-3 text-red-400"  />
          )}
          {isMe && (!msg.sendStatus || msg.sendStatus === "sent") && (
            <CheckCheck className="w-3 h-3" />
          )}
        </div>
      </div>
    </div>
  );
}
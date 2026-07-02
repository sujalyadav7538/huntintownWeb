"use client";

import { CheckCheck } from "lucide-react";
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

  return (
    <div className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[78%] rounded-2xl border px-3.5 py-3 text-xs leading-relaxed backdrop-blur-sm ${
          isMe
            ? "rounded-br-md border-[#ff6a6a]/25 bg-[linear-gradient(180deg,rgba(255,63,63,0.22),rgba(255,63,63,0.14))] text-white"
            : "rounded-bl-md border-[#26262b] bg-[#121216]/92 text-zinc-100"
        }`}
      >
        <p className="whitespace-pre-wrap">{msg.text}</p>

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

          {isMe && <CheckCheck className="w-3 h-3" />}
        </div>
      </div>
    </div>
  );
}
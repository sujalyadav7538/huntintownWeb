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
        className={`max-w-[70%] rounded-2xl p-3 text-xs shadow-md leading-relaxed ${
          isMe
            ? "bg-[#FF3F3F] text-white rounded-tr-none"
            : "bg-[#1c1c1f] text-zinc-100 border border-[#28282d] rounded-tl-none"
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
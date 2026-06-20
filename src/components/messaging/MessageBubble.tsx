"use client";

import React from 'react';
import { Message } from '../../types';
import { CheckCheck } from 'lucide-react';

interface MessageBubbleProps {
  key?: string | number;
  msg: Message;
  currentUserId: string;
}

export default function MessageBubble({ msg, currentUserId }: MessageBubbleProps) {
  const isMe = msg.senderId === currentUserId;
  return (
    <div className={`flex ${isMe ? 'justify-end' : 'justify-start'} font-sans`}>
      <div className={`max-w-[70%] rounded-2xl p-3 text-xs shadow-md leading-relaxed text-left ${
        isMe 
          ? 'bg-[#FF3F3F] text-white rounded-tr-none font-sans font-medium' 
          : 'bg-[#1c1c1f] text-zinc-100 border border-[#28282d] rounded-tl-none font-sans font-normal'
      }`}>
        <p className="whitespace-pre-wrap">{msg.content}</p>
        
        <div className={`flex items-center gap-1 justify-end mt-1 text-[9px] font-mono ${
          isMe ? 'text-rose-200' : 'text-zinc-500'
        }`}>
          <span>
            {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          {isMe && <CheckCheck className="w-3 h-3 text-white" />}
        </div>
      </div>
    </div>
  );
}

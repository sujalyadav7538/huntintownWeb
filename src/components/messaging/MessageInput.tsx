"use client";

import React, { useState, FormEvent } from 'react';
import { Send, Smile } from 'lucide-react';

interface MessageInputProps {
  participantName: string;
  onSendMessage: (content: string) => void;
}

export default function MessageInput({ participantName, onSendMessage }: MessageInputProps) {
  const [typedText, setTypedText] = useState('');

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!typedText.trim()) return;

    onSendMessage(typedText.trim());
    setTypedText('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-[#17171a] border-t border-[#232327] flex items-center gap-2 font-sans">
      <button
        id="emoji-chat-btn"
        type="button"
        className="p-2 text-zinc-500 hover:text-zinc-350 rounded-lg hover:bg-zinc-850 transition cursor-pointer"
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
        className="flex-1 text-xs px-3.5 py-2.5 bg-[#0b0b0c] border border-[#25252a] text-zinc-100 rounded-xl placeholder-zinc-650 focus:outline-hidden focus:border-[#FF3F3F]"
        required
      />
      
      <button
        id="chat-send-submit"
        type="submit"
        className="p-2.5 bg-[#FF3F3F] hover:bg-[#E53535] text-white rounded-xl transition cursor-pointer flex items-center justify-center shadow-lg shrink-0"
      >
        <Send className="w-3.5 h-3.5 text-white" />
      </button>
    </form>
  );
}

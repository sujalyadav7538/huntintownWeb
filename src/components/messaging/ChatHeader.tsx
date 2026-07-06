"use client";

import React from 'react';
import { Conversation } from '../../types';
import { Star, MapPin } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../../utils';
import { useAppSelector } from '@/src/store/hooks';

interface ChatHeaderProps {
  activeConv: Conversation;
  setActiveConversationId: (id: string | null) => void;
}

export default function ChatHeader({ activeConv, setActiveConversationId }: ChatHeaderProps) {
  const {currentUser} = useAppSelector((s) => s.auth);
  const otherParticipant = activeConv.participants.find(p => p.id !== currentUser?.id);
  return (
    <div className="border-b border-[#1e1e22] bg-[#0c0c0e] px-4 py-3.5 font-sans select-none sm:px-5">
      <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-3">
        <button
          id="chat-back-mobile"
          onClick={() => setActiveConversationId(null)}
          className="md:hidden text-xs text-zinc-400 font-bold p-1 hover:bg-zinc-800 rounded mr-1 cursor-pointer uppercase tracking-wider font-mono"
        >
          ← Back
        </button>

        <img
          src={otherParticipant?.avatar || getAvatarUrl(otherParticipant?.name)}
          alt={otherParticipant?.name}
          className="w-9 h-9 rounded-full object-cover border border-[#2b2b30]"
          onError={(e) => handleAvatarError(e, otherParticipant?.name)}
          referrerPolicy="no-referrer"
        />
        <div className="text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <h4 className="font-bold text-xs text-zinc-100 font-display">{otherParticipant?.name}</h4>
            <span className="flex items-center gap-0.5 text-[10px] bg-red-950/45 border border-red-900 text-[#FF3F3F] font-bold px-1.5 rounded font-mono">
              <Star className="w-2.5 h-2.5 fill-[#FF3F3F] text-[#FF3F3F]" />
              <span>{otherParticipant?.rating || '4.8'}</span>
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5 leading-none">{otherParticipant?.role}</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 rounded-full border border-[#25252a] bg-[#151518] px-2.5 py-1 text-[10px] font-mono font-bold uppercase tracking-wider text-zinc-400">
        <MapPin className="w-3.5 h-3.5 text-[#FF3F3F]" />
        <span>{(otherParticipant as any)?.address || ''}</span>
      </div>
      </div>
    </div>
  );
}

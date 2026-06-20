"use client";

import React from 'react';
import { Conversation } from '../../types';
import { Star, MapPin } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface ChatHeaderProps {
  activeConv: Conversation;
  setActiveConversationId: (id: string | null) => void;
}

export default function ChatHeader({ activeConv, setActiveConversationId }: ChatHeaderProps) {
  return (
    <div className="p-4 bg-[#17171a] border-b border-[#232327] flex items-center justify-between font-sans select-none">
      <div className="flex items-center gap-3">
        <button
          id="chat-back-mobile"
          onClick={() => setActiveConversationId(null)}
          className="md:hidden text-xs text-zinc-400 font-bold p-1 hover:bg-zinc-800 rounded mr-1 cursor-pointer uppercase tracking-wider font-mono"
        >
          ← Back
        </button>

        <img
          src={getAvatarUrl(activeConv.participant.name, activeConv.participant.avatar)}
          alt={activeConv.participant.name}
          className="w-9 h-9 rounded-full object-cover border border-[#2b2b30]"
          onError={(e) => handleAvatarError(e, activeConv.participant.name)}
          referrerPolicy="no-referrer"
        />
        <div className="text-left">
          <div className="flex items-center gap-1.5 leading-none">
            <h4 className="font-bold text-xs text-zinc-100 font-display">{activeConv.participant.name}</h4>
            <span className="flex items-center gap-0.5 text-[10px] bg-red-950/45 border border-red-900 text-[#FF3F3F] font-bold px-1.5 rounded font-mono">
              <Star className="w-2.5 h-2.5 fill-[#FF3F3F] text-[#FF3F3F]" />
              <span>{activeConv.participant.rating || '4.8'}</span>
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 truncate max-w-xs mt-0.5 leading-none">{activeConv.participant.role}</p>
        </div>
      </div>

      <div className="hidden sm:flex items-center gap-1.5 text-[10px] text-zinc-400 bg-zinc-850 px-2.5 py-1 rounded border border-zinc-700 font-mono uppercase tracking-wider font-bold">
        <MapPin className="w-3.5 h-3.5 text-[#FF3F3F]" />
        <span>{activeConv.participant.location}</span>
      </div>
    </div>
  );
}

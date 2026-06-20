"use client";

import React, { useState } from 'react';
import { Conversation } from '../../types';
import { Search } from 'lucide-react';
import { getAvatarUrl, handleAvatarError } from '../../utils';

interface ChatListProps {
  conversations: Conversation[];
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export default function ChatList({
  conversations,
  activeConversationId,
  setActiveConversationId
}: ChatListProps) {
  const [channelsSearch, setChannelsSearch] = useState('');

  // Filter conversations
  const filteredConvs = conversations.filter(c => 
    c.participant.name.toLowerCase().includes(channelsSearch.toLowerCase()) ||
    c.participant.role.toLowerCase().includes(channelsSearch.toLowerCase())
  );

  return (
    <div className={`w-full md:w-80 border-r border-[#232327] flex flex-col font-sans ${
      activeConversationId ? 'hidden md:flex' : 'flex'
    }`}>
      <div className="p-4 border-b border-[#232327] space-y-3 bg-[#17171a] select-none">
        <h3 className="text-xs font-bold text-zinc-200 uppercase tracking-wider font-display">Immediate Chats</h3>
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-zinc-550">
            <Search className="w-3.5 h-3.5" />
          </span>
          <input
            id="chat-search-input"
            type="text"
            placeholder="Filter by name..."
            value={channelsSearch}
            onChange={(e) => setChannelsSearch(e.target.value)}
            className="w-full text-xs pl-8 pr-3 py-1.5 bg-[#0b0b0c] border border-[#29292e] text-zinc-100 rounded-lg placeholder-zinc-650 focus:outline-hidden focus:border-[#FF3F3F]"
          />
        </div>
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto divide-y divide-[#1e1e21] bg-[#121214]">
        {filteredConvs.length === 0 ? (
          <div className="p-8 text-center text-zinc-500 text-xs select-none">
            No conversations located.
          </div>
        ) : (
          filteredConvs.map(conv => {
            const lastMsg = conv.messages[conv.messages.length - 1];
            const isSelected = conv.id === activeConversationId;
            
            return (
              <div
                key={conv.id}
                id={`conv-item-${conv.id}`}
                onClick={() => setActiveConversationId(conv.id)}
                className={`p-4 flex gap-3 items-center cursor-pointer transition select-none ${
                  isSelected ? 'bg-zinc-850/60 border-l-4 border-[#FF3F3F]' : 'hover:bg-zinc-850'
                }`}
              >
                <div className="relative shrink-0">
                  <img
                    src={getAvatarUrl(conv.participant.name, conv.participant.avatar)}
                    alt={conv.participant.name}
                    className="w-10 h-10 rounded-full object-cover border border-[#2e2e33]"
                    onError={(e) => handleAvatarError(e, conv.participant.name)}
                    referrerPolicy="no-referrer"
                  />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-zinc-950 animate-pulse" />
                </div>

                <div className="flex-1 min-w-0 text-left">
                  <div className="flex justify-between items-baseline mb-0.5 font-mono">
                    <span className="font-bold text-xs text-zinc-150 truncate">{conv.participant.name}</span>
                    <span className="text-[9px] text-zinc-500">
                      {lastMsg ? new Date(lastMsg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ''}
                    </span>
                  </div>
                  <p className="text-[10px] text-zinc-400 truncate mt-0.5 font-sans leading-none">{conv.participant.role}</p>
                  <p className="text-[11px] text-zinc-350 truncate mt-1">
                    {lastMsg ? lastMsg.content : 'No signals yet'}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="w-4 h-4 rounded-full bg-[#FF3F3F] text-[9px] font-bold text-white flex items-center justify-center font-mono shrink-0">
                    {conv.unreadCount}
                  </span>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}

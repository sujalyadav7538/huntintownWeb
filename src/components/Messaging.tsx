"use client";

import { useRef, useEffect } from 'react';
import { MessageSquare } from 'lucide-react';
import { useAppSelector, useAppDispatch } from '../store/hooks';
import { setActiveConversationId } from '../store/conversationsSlice';

import ChatList from './messaging/ChatList';
import ChatHeader from './messaging/ChatHeader';
import MessageBubble from './messaging/MessageBubble';
import MessageInput from './messaging/MessageInput';

interface MessagingProps {
  onSendMessage: (conversationId: string, content: string) => void;
}

export default function Messaging({ onSendMessage }: MessagingProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const { conversations, activeConversationId } = useAppSelector((s) => s.conversations);
  const handleSetActiveConv = (id: string | null) => dispatch(setActiveConversationId(id));

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll on new chats
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversationId, conversations]);

  const activeConv = conversations.find(c => c.id === activeConversationId);

  const handleSend = (text: string) => {
    if (!activeConversationId) return;
    onSendMessage(activeConversationId, text);
  };

  return (
    <div className="bg-[#121214] rounded-2xl border border-[#232327] shadow-lg h-[75vh] flex overflow-hidden text-zinc-100 font-sans">
      
      {/* LEFT CHATS FEED sidebar list (Modular) */}
      <ChatList 
        conversations={conversations} 
        activeConversationId={activeConversationId} 
        setActiveConversationId={handleSetActiveConv} 
      />

      {/* RIGHT CONVERSATION THREAD */}
      <div className={`flex-1 flex flex-col ${
        !activeConversationId ? 'hidden md:flex items-center justify-center bg-[#0d0d0f]' : 'flex bg-[#0f0f11]'
      }`}>
        {activeConv ? (
          <>
            {/* Header recipient (Modular) */}
            <ChatHeader 
              activeConv={activeConv} 
              setActiveConversationId={setActiveConversationId} 
            />

            {/* Messages body scrolling */}
            <div className="flex-1 p-5 overflow-y-auto space-y-4">
              <div className="text-center py-2 select-none">
                <span className="text-[9px] font-mono font-bold text-zinc-550 uppercase tracking-widest bg-[#18181c] py-1 px-3.5 rounded border border-[#222226]">
                  Encrypted Response Dialogue Channel
                </span>
              </div>

              {activeConv.messages.map(msg => (
                <MessageBubble 
                  key={msg.id} 
                  msg={msg} 
                  currentUserId={currentUser.id} 
                />
              ))}
              
              <div ref={chatEndRef} />
            </div>

            {/* Interactive texting input form (Modular) */}
            <MessageInput 
              participantName={activeConv.participant.name} 
              onSendMessage={handleSend} 
            />
          </>
        ) : (
          <div className="p-12 text-center text-zinc-500 space-y-2 select-none">
            <MessageSquare className="w-12 h-12 text-zinc-700 mx-auto" />
            <p className="text-sm font-bold text-zinc-300 font-display uppercase tracking-wider">Select a conversation thread</p>
            <p className="text-xs text-zinc-500 leading-relaxed max-w-xs mx-auto">
              Engage with other Sector residents about custom requirements, verify timelines, or coordinate deliveries in real-time.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}

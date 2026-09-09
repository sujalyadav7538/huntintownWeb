import { useEffect, useRef } from "react";
import { MessageSquare } from "lucide-react";

import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import DateSeparator from "./DateSeparator";
import { formatDateLabel } from "../../lib/presence";
import { useAppDispatch } from "@/src/store/hooks";
import { handleHideMobileBottomNav } from "@/src/store/uiSlice";

interface ChatPanelProps {
  activeConversation: any | null;
  activeMessages: any[];
  currentUserId?: string;
  mode: "posts" | "chats";
  onBack?: () => void;
  onSetActiveConversation: (_id: string | null) => void;
}

export default function ChatPanel(props: ChatPanelProps) {
  return (
    <>
      <div className="hidden min-h-0 flex-1 md:flex">
        <ChatPanelDesktop {...props} />
      </div>

      <div className="flex min-h-0 flex-1 md:hidden">
        <ChatPanelMobile {...props} />
      </div>
    </>
  );
}

/* =============================================================
   DESKTOP
============================================================= */

function ChatPanelDesktop({
  activeConversation,
  activeMessages,
  currentUserId,
  mode,
  onSetActiveConversation,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleBackClick = () => {
    onSetActiveConversation(null);
    dispatch(handleHideMobileBottomNav(false));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeConversation?._id, activeMessages.length]);

  if (!activeConversation) {
    return (
      <div className="flex min-h-0 flex-1 bg-[#171717]">
        <EmptyChatState mode={mode} />
      </div>
    );
  }

  const participant =
    activeConversation.participants?.find(
      (p: any) => p._id !== currentUserId,
    ) ?? activeConversation.participants?.[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#171717]">
      {/* Desktop Header */}
      <ChatHeader
        activeConv={activeConversation}
        handleBack={handleBackClick}
      />

      {/* Desktop Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        <StartConversation />

        {activeMessages.length > 0 ? (
          <MessageList
            messages={activeMessages}
            currentUserId={currentUserId}
          />
        ) : (
          <EmptyMessagesState />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Desktop Input */}
      <MessageInput participantName={participant?.name ?? ""} />
    </div>
  );
}

/* =============================================================
   MOBILE
============================================================= */

function ChatPanelMobile({
  activeConversation,
  activeMessages,
  currentUserId,
  mode,
  onSetActiveConversation,
}: ChatPanelProps) {
  const chatEndRef = useRef<HTMLDivElement>(null);
  const dispatch = useAppDispatch();

  const handleBackClick = () => {
    onSetActiveConversation(null);
    dispatch(handleHideMobileBottomNav(false));
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeConversation?._id, activeMessages.length]);

  if (!activeConversation) {
    return (
      <div className="flex min-h-0 flex-1 bg-[#171717]">
        <EmptyChatState mode={mode} />
      </div>
    );
  }

  const participant =
    activeConversation.participants?.find(
      (p: any) => p._id !== currentUserId,
    ) ?? activeConversation.participants?.[0];

  return (
    <div className="relative flex h-dvh min-h-0 flex-1 flex-col bg-[#171717]">
      {/* Fixed Mobile Header */}
      <div className="fixed left-0 right-0 top-0 z-50 h-14 border-b border-white/[0.07] bg-[#171717]/95 backdrop-blur-md">
        <ChatHeader
          activeConv={activeConversation}
          handleBack={handleBackClick}
        />
      </div>

      {/* Scrollable Messages */}
      <div className="min-h-0 flex-1 overflow-y-auto px-3 pb-24 pt-16">
        <div className="flex select-none justify-center pb-4">
          <span className="rounded-full border border-[#1e1e22] bg-[#0d0d10] px-2.5 py-1 text-[9px] tracking-wide text-zinc-600">
            — start of conversation —
          </span>
        </div>

        {activeMessages.length > 0 ? (
          <div className="space-y-2.5">
            {activeMessages.map((message, index) => {
              const label = formatDateLabel(message.createdAt);

              const previousLabel =
                index > 0
                  ? formatDateLabel(activeMessages[index - 1].createdAt)
                  : null;

              const showSeparator = label !== previousLabel;

              return (
                <div key={message._id}>
                  {showSeparator && <DateSeparator label={label} />}

                  <MessageBubble msg={message} currentUserId={currentUserId} />
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyMessagesState />
        )}

        <div ref={chatEndRef} />
      </div>

      {/* Fixed Mobile Input */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/[0.07] bg-[#171717]/95  pb-[env(safe-area-inset-bottom)]  backdrop-blur-md">
        <MessageInput participantName={participant?.name ?? ""} />
      </div>
    </div>
  );
}
/* =============================================================
   SHARED MESSAGE LIST
============================================================= */

function MessageList({
  messages,
  currentUserId,
}: {
  messages: any[];
  currentUserId?: string;
}) {
  return (
    <div className="space-y-3">
      {messages.map((message, index) => {
        const label = formatDateLabel(message.createdAt);

        const previousLabel =
          index > 0 ? formatDateLabel(messages[index - 1].createdAt) : null;

        const showSeparator = label !== previousLabel;

        return (
          <div key={message._id}>
            {showSeparator && <DateSeparator label={label} />}

            <MessageBubble msg={message} currentUserId={currentUserId} />
          </div>
        );
      })}
    </div>
  );
}

/* =============================================================
   START CONVERSATION
============================================================= */

function StartConversation() {
  return (
    <div className="flex select-none justify-center pb-5">
      <span className="inline-flex items-center rounded-full border border-[#1e1e22] bg-[#0d0d10] px-3 py-1 text-[10px] tracking-wide text-zinc-600">
        — start of conversation —
      </span>
    </div>
  );
}

/* =============================================================
   EMPTY CHAT
============================================================= */

function EmptyChatState({ mode }: { mode: "posts" | "chats" }) {
  return (
    <div className="flex flex-1 items-center justify-center p-8 text-center">
      <div className="w-full max-w-xs select-none">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-white/[0.05] bg-white/[0.025]">
          <MessageSquare className="h-6 w-6 text-zinc-700" />
        </div>

        <h3 className="pt-4 text-sm font-semibold text-zinc-300">
          Select a conversation
        </h3>

        <p className="mt-2 text-xs leading-relaxed text-zinc-600">
          {mode === "posts"
            ? "Select one of your posts and then choose a helper conversation."
            : "Select one of your conversations to start chatting."}
        </p>
      </div>
    </div>
  );
}

/* =============================================================
   EMPTY MESSAGES
============================================================= */

function EmptyMessagesState() {
  return (
    <div className="flex min-h-[240px] items-center justify-center text-center">
      <div className="max-w-xs select-none">
        <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-white/[0.025]">
          <MessageSquare className="h-4 w-4 text-zinc-700" />
        </div>

        <p className="mt-3 text-xs font-medium text-zinc-500">
          No messages yet
        </p>

        <p className="mt-1 text-[10px] text-zinc-700">
          Start the conversation below.
        </p>
      </div>
    </div>
  );
}

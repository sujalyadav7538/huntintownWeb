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
  onSetActiveConversation: (id: string | null) => void;
}

export default function ChatPanel({
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

  /*
   * Scroll to bottom whenever:
   * - conversation changes
   * - new message arrives
   */
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeConversation?._id, activeMessages.length]);

  /*
   * No conversation selected
   */
  if (!activeConversation) {
    return (
      <div className="hidden min-h-0 flex-1 bg-[#171717] md:flex">
        <EmptyChatState mode={mode} />
      </div>
    );
  }

  const participant =
    activeConversation.participants?.find((p: any) => p.id !== currentUserId) ??
    activeConversation.participants?.[0];

  return (
    <div className="flex min-h-0 flex-1 flex-col bg-[#171717]">
      {/* =====================================================
          HEADER
      ===================================================== */}
      <ChatHeader
        activeConv={activeConversation}
        handleBack={handleBackClick}
      />

      {/* =====================================================
          MESSAGES
      ===================================================== */}
      <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6">
        {/* Start marker */}
        <div className="flex select-none justify-center pb-5">
          <span className="inline-flex items-center rounded-full border border-[#1e1e22] bg-[#0d0d10] px-3 py-1 text-[10px] tracking-wide text-zinc-600">
            — start of conversation —
          </span>
        </div>

        {/* Messages */}
        {activeMessages.length > 0 ? (
          <div className="space-y-3">
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

      {/* =====================================================
          INPUT
      ===================================================== */}
      <MessageInput participantName={participant?.name ?? ""} />
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

import { MessageCircle } from "lucide-react";

interface AcceptedChatButtonProps {
  authorName?: string;
  onInitiateChat: () => void;
}

export default function AcceptedChatButton({
  authorName,
  onInitiateChat,
}: AcceptedChatButtonProps) {
  const firstName = authorName?.split(" ")[0] || "the post owner";

  return (
    <button
      onClick={onInitiateChat}
      className="group flex w-full cursor-pointer items-center justify-between rounded-2xl border border-[#FF3F3F]/25 bg-[#FF3F3F]/5 px-4 py-3.5 text-left transition hover:border-[#FF3F3F]/40 hover:bg-[#FF3F3F]/10"
    >
      <div className="flex items-center gap-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#FF3F3F]/10">
          <MessageCircle className="h-4 w-4 text-[#FF3F3F]" />
        </div>

        <div>
          <p className="text-xs font-bold text-zinc-200">
            Start a conversation
          </p>

          <p className="mt-0.5 text-[10px] text-zinc-600">
            Chat with {firstName}
          </p>
        </div>
      </div>

      <MessageCircle className="h-4 w-4 text-zinc-700 transition group-hover:text-[#FF3F3F]" />
    </button>
  );
}
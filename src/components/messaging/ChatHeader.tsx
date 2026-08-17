import { Conversation } from "../../types";
import { ArrowLeft, FileText, MapPin } from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";
import { useAppSelector } from "@/src/store/hooks";
import { formatLastSeen } from "@/src/lib/presence";

interface ChatHeaderProps {
  activeConv: Conversation;
  handleBack: () => void;
}

export default function ChatHeader({
  activeConv,
  handleBack,
}: ChatHeaderProps) {
  const { currentUser } = useAppSelector((s) => s.auth);

  const otherParticipant = activeConv.participants.find(
    (p) => p.id !== currentUser?.id,
  );

  return (
    <header className="shrink-0 border-b border-[#1e1e22] bg-[#0c0c0e] px-3 py-3 sm:px-5">
      <div className="flex min-w-0 items-center justify-between gap-3">
        {/* Left */}
        <div className="flex min-w-0 items-center gap-2.5">
          {/* Back */}
          <button
            id="chat-back-mobile"
            type="button"
            onClick={handleBack}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-zinc-500 transition hover:bg-white/[0.05] hover:text-zinc-200 md:hidden"
            aria-label="Back"
          >
            <ArrowLeft className="h-4 w-4" />
          </button>

          {/* Avatar */}
          <div className="relative shrink-0">
            <img
              src={
                otherParticipant?.avatar || getAvatarUrl(otherParticipant?.name)
              }
              alt={otherParticipant?.name || "User"}
              className="h-9 w-9 rounded-full border border-[#2b2b30] object-cover"
              onError={(e) => handleAvatarError(e, otherParticipant?.name)}
              referrerPolicy="no-referrer"
            />

            {/* Online indicator */}
            <span
              className={`absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#0c0c0e] ${
                otherParticipant?.isOnline ? "bg-emerald-500" : "bg-zinc-600"
              }`}
            />
          </div>

          {/* User */}
          <div className="min-w-0">
            <h4 className="truncate text-xs font-bold text-zinc-100 sm:text-sm">
              {otherParticipant?.name || "Unknown"}
            </h4>

            <p className="truncate text-[10px] text-zinc-500">
              {otherParticipant?.isOnline
                ? "Online"
                : formatLastSeen(otherParticipant?.lastSeen)}
            </p>
          </div>
        </div>

        {/* Right side */}
        <div className="flex min-w-0 shrink-0 items-center gap-2">
          {/* Post */}
          {activeConv?.post?.title && (
            <div className="hidden min-w-0 max-w-[180px] items-center rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 sm:flex">
              <span className="truncate text-[10px] font-medium text-zinc-500">
                {activeConv.post.title}
              </span>
            </div>
          )}

          {/* Address — desktop only */}
          {(otherParticipant as any)?.address && (
            <div className="hidden max-w-[160px] items-center gap-1.5 rounded-lg border border-white/[0.06] bg-white/[0.025] px-2.5 py-1.5 lg:flex">
              <MapPin className="h-3 w-3 shrink-0 text-[#FF3F3F]" />

              <span className="truncate text-[10px] text-zinc-500">
                {(otherParticipant as any).address}
              </span>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

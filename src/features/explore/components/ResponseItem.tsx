import { useState } from "react";
import {
  BadgeCheck,
  ChevronDown,
  ChevronUp,
  LoaderCircle,
  MessageCircle,
  Star,
} from "lucide-react";
import UserAvatar from "@/src/shared/components/UserAvatar";

interface ResponseItemProps {
  response: any;
  onViewProfile?: (user: any) => void;
  onStartChat?: (responseId: string) => Promise<void>;
  startingChat?: boolean;
}

export default function ResponseItem({
  response,
  onViewProfile,
  onStartChat,
  startingChat = false,
}: ResponseItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [chatError, setChatError] = useState("");

  const user = response?.respondedBy;
  const answers = response?.answers ?? [];
  const responseId = response?._id ?? response?.id;

  const rating = user?.averageRating ?? user?.rating ?? null;

  return (
    <div className="rounded-lg border border-white/[0.055] bg-white/[0.018] px-2.5 py-2.5 transition hover:border-white/[0.09] hover:bg-white/[0.025]">
      {/* Header */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => onViewProfile?.(user)}
          className="shrink-0"
        >
          <UserAvatar
            name={user?.name || "User"}
            src={user?.avatar}
            className="h-7 w-7 rounded-full border border-white/[0.08]"
            imageClassName="object-cover"
          />
        </button>

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => onViewProfile?.(user)}
              className="flex min-w-0 items-center gap-1 text-left"
            >
              <span className="truncate text-[10px] font-semibold text-zinc-200 hover:text-white">
                {user?.name || "HuntInTown User"}
              </span>

              {user?.isGovernmentVerified && (
                <BadgeCheck className="h-2.5 w-2.5 shrink-0 text-blue-400" />
              )}
            </button>

            <div className="ml-auto flex shrink-0 items-center gap-2">
              {rating != null && (
                <span className="flex items-center gap-0.5 text-[8px] text-zinc-500">
                  <Star className="h-2.5 w-2.5 fill-yellow-500 text-yellow-500" />
                  {Number(rating).toFixed(1)}
                </span>
              )}
              {onStartChat && responseId && (
                <button
                  type="button"
                  aria-label={`Start or open chat with ${user?.name || "this applicant"}`}
                  title="Start or open chat"
                  disabled={startingChat}
                  onClick={() => {
                    setChatError("");
                    void onStartChat(responseId).catch((error: unknown) => {
                      setChatError(
                        error instanceof Error
                          ? error.message
                          : "Could not open this conversation.",
                      );
                    });
                  }}
                  className="flex h-7 w-7 items-center justify-center rounded-md border border-white/[0.08] text-zinc-500 transition hover:border-[#FF3F3F]/40 hover:text-[#FF6B6B] disabled:opacity-50"
                >
                  {startingChat ? (
                    <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                  ) : (
                    <MessageCircle className="h-3.5 w-3.5" />
                  )}
                </button>
              )}
            </div>
          </div>

          <p className="truncate text-[8px] text-zinc-600">
            {user?.role || "HuntInTown member"}
          </p>
        </div>
      </div>

      {/* Message */}
      {!expanded && response?.message && (
        <p className="line-clamp-2 mt-2 text-[9px] leading-relaxed text-zinc-400">
          {response.message}
        </p>
      )}

      {/* Bottom */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <span className="rounded-full bg-white/[0.045] px-1.5 py-0.5 text-[7px] font-medium capitalize text-zinc-500">
          {response?.status || "pending"}
        </span>

        <button
          type="button"
          onClick={() => setExpanded((prev) => !prev)}
          aria-expanded={expanded}
          className="inline-flex items-center gap-0.5 text-[8px] font-semibold text-zinc-600 transition hover:text-[#FF3F3F]"
        >
          {expanded ? "Hide" : "View Comment"}
          {expanded ? (
            <ChevronUp className="h-2.5 w-2.5" />
          ) : (
            <ChevronDown className="h-2.5 w-2.5" />
          )}
        </button>
      </div>
      {chatError && (
        <p role="alert" className="mt-2 text-[9px] text-red-400">
          {chatError}
        </p>
      )}

      {/* Expanded */}
      {expanded && (
        <div className="mt-2.5 border-t border-white/[0.055] pt-2.5">
          {/* Full message */}
          {response?.message && (
            <div>
              <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                Message
              </p>

              <p className="mt-1 whitespace-pre-wrap text-[9px] leading-relaxed text-zinc-400">
                {response.message}
              </p>
            </div>
          )}

          {/* Answers */}
          {answers.length > 0 && (
            <div className={`${response?.message ? "mt-3" : ""}`}>
              <p className="text-[7px] font-bold uppercase tracking-[0.14em] text-zinc-600">
                Answers
              </p>

              <div className="mt-1.5 space-y-1.5">
                {answers.map((item: any, index: number) => (
                  <div
                    key={`${item.question}-${index}`}
                    className="rounded-md border border-white/[0.04] bg-white/[0.012] px-2 py-1.5"
                  >
                    <p className="text-[8px] leading-relaxed text-zinc-600">
                      {item.question}
                    </p>

                    <p className="mt-0.5 text-[9px] leading-relaxed text-zinc-300">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Metadata */}
          <div className="mt-2 flex flex-wrap gap-x-2.5 gap-y-1 text-[7px] text-zinc-700">
            {response?.createdAt && (
              <span>
                Applied {new Date(response.createdAt).toLocaleDateString()}
              </span>
            )}

            {response?.acceptedAt && (
              <span>
                Accepted {new Date(response.acceptedAt).toLocaleDateString()}
              </span>
            )}

            {response?.completedAt && (
              <span>
                Completed {new Date(response.completedAt).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

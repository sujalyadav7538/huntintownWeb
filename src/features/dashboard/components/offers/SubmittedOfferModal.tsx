import { MessageCircle } from "lucide-react";
import DashboardModal from "../DashboardModal";
import type { SubmittedResponse } from "../types";
import { Avatar, StatusBadge } from "../requirements/RequirementUI";
import RateOwnerSection from "./RateOwnerSection";

interface SubmittedOfferModalProps {
  item: SubmittedResponse;
  onClose: () => void;
  onChat: () => void;
}

export default function SubmittedOfferModal({
  item,
  onClose,
  onChat,
}: SubmittedOfferModalProps) {
  const post = item.postId;

  return (
    <DashboardModal
      title="Your submitted offer"
      onClose={onClose}
      size="wide"
      mobileDrawer
      contentClassName="flex flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <section className="flex items-start justify-between gap-4">
            <div className="flex min-w-0 items-start gap-3">
              <Avatar
                name={post.author?.name || "Requirement owner"}
                src={post.author?.avatar}
                large
              />
              <div className="min-w-0">
                <p className="theme-text-primary mt-1 text-sm font-semibold">
                  {post.author?.name || "Requirement owner"}
                </p>
                <p className="theme-text-primary mt-2 wrap-break-word text-sm font-bold">
                  {post.title}
                </p>
                <p className="theme-text-muted mt-1 text-xs">
                  {post.category} · {post.budget || "Negotiable"}
                </p>
                <p className="theme-text-secondary mt-2 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
                  {post.description}
                </p>
              </div>
            </div>
            <div className="shrink-0 text-right">
              <StatusBadge status={post.status} />
            </div>
          </section>

          <section className="theme-divider border-t pt-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
                Your response
              </h3>
              <StatusBadge status={item.status} />
            </div>
            <p className="theme-text-primary mt-3 whitespace-pre-wrap wrap-break-word text-sm leading-relaxed">
              {item.message || "No message provided."}
            </p>
          </section>

          {item.answers?.length > 0 && (
            <section className="space-y-3">
              <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
                Your answers
              </h3>
              {item.answers.map((answer, index) => (
                <div
                  key={`${answer.question}-${index}`}
                  className="theme-panel-soft rounded-md border p-3"
                >
                  <p className="theme-text-muted wrap-break-word text-xs">
                    {answer.question}
                  </p>
                  <p className="theme-text-primary mt-1 wrap-break-word text-sm">
                    {answer.answer}
                  </p>
                </div>
              ))}
            </section>
          )}

          {post.status === "completed" && item.status === "accepted" && (
            <RateOwnerSection
              postId={post._id}
              ownerName={post.author?.name || "the owner"}
            />
          )}
        </div>

        <footer className="theme-divider flex shrink-0 items-center justify-end gap-3 border-t px-5 py-4">
          {item.status === "accepted" && item.conversationId ? (
            <button
              type="button"
              onClick={onChat}
              className="ml-auto inline-flex items-center gap-2 rounded-md bg-[#FF3F3F] px-3 py-2 text-xs font-bold text-white hover:bg-[#e53535]"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Chat
            </button>
          ) : item.status === "accepted" ? (
            <p className="theme-text-muted ml-auto text-right text-xs">
              Accepted, but no conversation is available for this response.
            </p>
          ) : null}
        </footer>
      </div>
    </DashboardModal>
  );
}

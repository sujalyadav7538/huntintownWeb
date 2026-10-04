import { useState } from "react";
import {
  Check,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
  X,
} from "lucide-react";
import DashboardModal from "../DashboardModal";
import type { DashboardPost, DashboardResponse } from "../types";
import { Avatar, StatusBadge } from "./RequirementUI";

interface OfferDetailsModalProps {
  post: DashboardPost;
  response: DashboardResponse;
  onClose: () => void;
  onUpdate: (responseId: string, action: "accept" | "reject") => Promise<void>;
  onReevaluate: (responseId: string) => Promise<void>;
  onChat: () => void;
}

export default function OfferDetailsModal({
  post,
  response,
  onClose,
  onUpdate,
  onReevaluate,
  onChat,
}: OfferDetailsModalProps) {
  const [action, setAction] = useState<
    "accept" | "reject" | "reconsider" | null
  >(null);
  const [error, setError] = useState("");

  const act = async (nextAction: "accept" | "reject") => {
    setAction(nextAction);
    setError("");
    try {
      await onUpdate(response._id, nextAction);
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Could not update this offer.",
      );
    } finally {
      setAction(null);
    }
  };

  const reevaluate = async () => {
    setAction("reconsider");
    setError("");
    try {
      await onReevaluate(response._id);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Could not reevaluate this offer.",
      );
    } finally {
      setAction(null);
    }
  };

  return (
    <DashboardModal
      title="Shots"
      subtitle={post.title}
      onClose={onClose}
      mobileDrawer
      contentClassName="flex flex-col overflow-hidden"
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto p-5">
          <div className="flex items-start justify-between gap-4">
            <section className="min-w-0 flex-1">
              <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
                User detail
              </h3>
              <div className="mt-3 flex items-center gap-3">
                <Avatar
                  name={response.respondedBy?.name ?? "Respondent"}
                  src={response.respondedBy?.avatar}
                  large
                />
                <div className="min-w-0">
                  <p className="theme-text-primary truncate text-sm font-bold">
                    {response.respondedBy?.name ?? "Respondent"}
                  </p>
                  <p className="theme-text-muted mt-0.5 text-xs">
                    {response.respondedBy?.role ?? "Community member"}
                  </p>
                  <p className="theme-text-muted mt-1 text-[10px]">
                    Trust {Math.round(response.trustScore ?? 0)} · Rating{" "}
                    {response.averageRating?.toFixed(1) ?? "—"}
                  </p>
                </div>
              </div>
            </section>
            <section className="shrink-0 text-right">
              <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
                Application status
              </h3>
              <div className="mt-3">
                <StatusBadge status={response.status} />
              </div>
            </section>
          </div>

          <section className="theme-divider border-t pt-4">
            <h3 className="theme-text-muted text-[10px] font-bold uppercase tracking-wider">
              Questions and answers
            </h3>
            {response.message && (
              <div className="theme-panel-soft mt-3 rounded-md border p-3">
                <p className="theme-text-muted text-[10px] font-semibold uppercase">
                  Application message
                </p>
                <p className="theme-text-primary mt-1 whitespace-pre-wrap text-sm leading-relaxed">
                  {response.message}
                </p>
              </div>
            )}
            {response.answers?.length ? (
              <div className="mt-3 space-y-3">
                {response.answers.map((answer, index) => (
                  <div
                    key={`${answer.question}-${index}`}
                    className="theme-panel-soft rounded-md border p-3"
                  >
                    <p className="theme-text-muted text-xs">
                      {answer.question}
                    </p>
                    <p className="theme-text-primary mt-1 text-sm leading-relaxed">
                      {answer.answer}
                    </p>
                  </div>
                ))}
              </div>
            ) : !response.message ? (
              <p className="theme-text-muted mt-3 text-sm">
                No questions or answers were submitted.
              </p>
            ) : null}
          </section>
        </div>

        {error && (
          <p role="alert" className="px-5 pb-2 text-xs text-red-400">
            {error}
          </p>
        )}
        <footer className="theme-divider flex shrink-0 flex-wrap justify-end gap-2 border-t px-5 py-4">
          {response.status === "pending" && (
            <>
              <button
                type="button"
                disabled={!!action}
                onClick={() => void act("accept")}
                className="rounded-lg bg-emerald-950/40 px-3 py-1.5 text-[10px] font-semibold text-emerald-400 flex flex-row items-center gap-1"
              >
                {action === "accept" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Check className="h-3.5 w-3.5" />
                )}{" "}
                Accept
              </button>
              <button
                type="button"
                disabled={!!action}
                className="rounded-lg bg-red-950/40 px-3 py-1.5 text-[10px] font-semibold text-red-500 flex flex-row items-center gap-1"
                onClick={() => void act("reject")}
              >
                {action === "reject" ? (
                  <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <X className="h-3.5 w-3.5" />
                )}{" "}
                Reject
              </button>
            </>
          )}
          {response.status === "accepted" && response.conversationId && (
            <button
              type="button"
              onClick={onChat}
              className="inline-flex items-center gap-2 rounded-md bg-[#FF3F3F] px-3 py-2 text-xs font-bold text-white hover:bg-[#e53535]"
            >
              <MessageCircle className="h-3.5 w-3.5" /> Chat
            </button>
          )}
          {response.status === "accepted" && !response.conversationId && (
            <p className="self-center text-xs text-amber-300">
              Accepted, but no conversation is available.
            </p>
          )}
          {response.status === "rejected" && (
            <button
              type="button"
              disabled={!!action}
              onClick={() => void reevaluate()}
              className="theme-divider theme-text-primary inline-flex items-center gap-1.5 rounded-md border px-3 py-2 text-xs font-semibold disabled:opacity-50"
            >
              {action === "reconsider" ? (
                <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
              ) : (
                <RotateCcw className="h-3.5 w-3.5" />
              )}
              Reevaluate
            </button>
          )}
        </footer>
      </div>
    </DashboardModal>
  );
}

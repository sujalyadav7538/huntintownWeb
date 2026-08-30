import { useEffect, useState } from "react";
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  HelpCircle,
  IndianRupee,
  Loader2,
  MapPin,
  MessageCircle,
  RefreshCw,
  Trash2,
  Users,
} from "lucide-react";

import { Response, Post } from "@/src/types";
import { apiFetch } from "../../../lib/api";
import ReviewHelpersModal from "../../ReviewHelpersModal";
import { handleAvatarError } from "@/src/utils";
import {
  CATEGORY_COLORS,
  CATEGORY_GRADIENTS,
  POST_STATUS_STYLE,
} from "@/src/lib/postConstants";

export interface ResponsePagination {
  page: number;
  limit: number;
  count: number;
  total: number;
  hasMore: boolean;
}

interface ResponsePostDetailProps {
  post: Post;

  // First batch of responses comes from parent
  responses: Response[];

  pagination: ResponsePagination | null;

  loading: boolean;

  error: string | null;

  onBack: () => void;

  onInitiateChat: () => void;

  currentUserId: string;
}

export default function ResponsePostDetail({
  post,
  responses: initialResponses,
  pagination: initialPagination,
  loading: initialLoading,
  error: initialError,
  onBack,
  onInitiateChat,
  currentUserId,
}: ResponsePostDetailProps) {
  const postId = post._id;

  const [responses, setResponses] = useState<Response[]>(initialResponses);

  const [pagination, setPagination] = useState<ResponsePagination | null>(
    initialPagination,
  );

  const [responsesLoading, setResponsesLoading] = useState(initialLoading);

  const [responsesError, setResponsesError] = useState<string | null>(
    initialError,
  );

  const [expandedId, setExpandedId] = useState<string | null>(null);

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const [loadingMore, setLoadingMore] = useState(false);

  const [postAction, setPostAction] = useState<
    "complete" | "expire" | "delete" | null
  >(null);

  const [processingAction, setProcessingAction] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);

  /*
   * Keep local state synchronized when the parent
   * provides a new batch.
   */
  useEffect(() => {
    setResponses(initialResponses);
    setPagination(initialPagination);
    setResponsesLoading(initialLoading);
    setResponsesError(initialError);
  }, [initialResponses, initialPagination, initialLoading, initialError]);

  /*
   * Refresh only this post's responses.
   */
  const fetchResponses = async () => {
    setResponsesLoading(true);
    setResponsesError(null);

    try {
      const res = await apiFetch(
        `/api/posts/${postId}/responses?page=1&limit=20`,
      );

      if (!res.ok) {
        throw new Error("Failed to load responses");
      }

      const data = await res.json();

      setResponses(data.data?.responses || []);
      setPagination(data.data?.pagination || null);
    } catch (error: any) {
      setResponsesError(error.message || "Failed to load responses");
    } finally {
      setResponsesLoading(false);
    }
  };

  /*
   * Load next batch of 20.
   */
  const loadMoreResponses = async () => {
    if (!pagination?.hasMore || loadingMore || !pagination) {
      return;
    }

    const nextPage = pagination.page + 1;

    setLoadingMore(true);

    try {
      const res = await apiFetch(
        `/api/posts/${postId}/responses?page=${nextPage}&limit=${pagination.limit}`,
      );

      if (!res.ok) {
        throw new Error("Failed to load more responses");
      }

      const data = await res.json();

      const newResponses = data.data?.responses || [];

      setResponses((prev) => [...prev, ...newResponses]);

      setPagination(data.data?.pagination || null);
    } catch (error: any) {
      setResponsesError(error.message || "Failed to load more responses");
    } finally {
      setLoadingMore(false);
    }
  };

  /*
   * Accept / reject response.
   */
  const handleResponseAction = async (
    responseId: string,
    action: "accept" | "reject",
  ) => {
    setActionLoading(responseId);

    try {
      const res = await apiFetch(`/api/responses/${responseId}/${action}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(
          action === "accept"
            ? "Failed to accept response"
            : "Failed to reject response",
        );
      }

      const newStatus = action === "accept" ? "accepted" : "rejected";

      setResponses((prev) =>
        prev.map((response) =>
          response._id === responseId
            ? {
                ...response,
                status: newStatus,
              }
            : response,
        ),
      );
    } catch (error) {
      console.error(error);
    } finally {
      setActionLoading(null);
    }
  };

  /*
   * Post-level actions.
   */
  const handlePostAction = async (type: "complete" | "expire" | "delete") => {
    if (postAction !== type) {
      setPostAction(type);
      return;
    }

    setProcessingAction(true);

    try {
      if (type === "complete") {
        /*
         * Keep only accepted responses currently
         * loaded in the UI.
         *
         * If your application requires ALL accepted
         * helpers for reviewing, that should be handled
         * by a dedicated backend endpoint instead of
         * loading thousands of responses here.
         */
        const accepted = responses.filter(
          (response) => response.status === "accepted",
        );

        if (accepted.length > 0) {
          setShowReviewModal(true);
        }

        await dispatchUpdatePostStatus(postId, "completed");

        if (accepted.length === 0) {
          onBack();
        }

        return;
      }

      if (type === "expire") {
        await dispatchUpdatePostStatus(postId, "expired");

        onBack();
        return;
      }

      await dispatchDeletePost(postId);

      onBack();
    } finally {
      setProcessingAction(false);
      setPostAction(null);
    }
  };

  /*
   * Keep your existing Redux implementations here.
   *
   * Replace these with your actual imports/thunks.
   */
  const dispatchUpdatePostStatus = async (id: string, status: string) => {
    // await dispatch(updatePostStatusThunk(id, status) as any);
  };

  const dispatchDeletePost = async (id: string) => {
    // await dispatch(deletePostThunk(id) as any);
  };

  /*
   * These are counts only for the currently loaded
   * response batch.
   *
   * Don't present them as total counts.
   */
  const pendingCount = responses.filter(
    (response) => response.status === "pending",
  ).length;

  const acceptedCount = responses.filter(
    (response) => response.status === "accepted",
  ).length;

  const totalResponses = post.responsesCount ?? pagination?.total ?? 0;

  const addr = post.address || "";

  return (
    <div className="space-y-5">
      {showReviewModal && (
        <ReviewHelpersModal
          postId={postId}
          postTitle={post.title}
          hunterId={currentUserId}
          helpers={responses
            .filter((response) => response.status === "accepted")
            .map((response) => ({
              helperId: response.respondedBy.id,
              name: response.respondedBy.name,
              avatar: response.respondedBy.avatar,
            }))}
          onClose={() => {
            setShowReviewModal(false);
            onBack();
          }}
        />
      )}

      {/* Back */}
      <button
        onClick={onBack}
        className="
          inline-flex items-center gap-2
          text-xs text-zinc-500
          transition hover:text-zinc-200
        "
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Responses
      </button>

      <div className="grid gap-5 lg:grid-cols-[380px_minmax(0,1fr)]">
        {/* LEFT */}
        <div className="space-y-4">
          <ResponsePostSummary
            post={post}
            address={addr}
            pendingCount={pendingCount}
            acceptedCount={acceptedCount}
            totalResponses={totalResponses}
          />

          {post.questions?.length > 0 && (
            <PostQuestions questions={post.questions} />
          )}

          <PostMessages onInitiateChat={onInitiateChat} />

          <PostActions
            status={post.status}
            confirmedAction={postAction}
            processing={processingAction}
            onAction={handlePostAction}
            onCancel={() => setPostAction(null)}
          />
        </div>

        {/* RIGHT */}
        <ResponsesPanel
          responses={responses}
          loading={responsesLoading}
          error={responsesError}
          loadingMore={loadingMore}
          hasMore={pagination?.hasMore ?? false}
          actionLoading={actionLoading}
          expandedId={expandedId}
          totalResponses={totalResponses}
          onRefresh={fetchResponses}
          onLoadMore={loadMoreResponses}
          onToggle={(id) => setExpandedId((prev) => (prev === id ? null : id))}
          onResponseAction={handleResponseAction}
          onInitiateChat={onInitiateChat}
        />
      </div>
    </div>
  );
}

function ResponsePostSummary({
  post,
  address,
  pendingCount,
  acceptedCount,
  totalResponses,
}: {
  post: Post;
  address: string;
  pendingCount: number;
  acceptedCount: number;
  totalResponses: number;
}) {
  const accent = CATEGORY_COLORS[post?.category] || "#FF3F3F";

  const gradient =
    CATEGORY_GRADIENTS[post?.category] || "from-zinc-900 to-zinc-800";

  return (
    <section className="theme-panel-soft overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#0c0c0e]">
      <div className={`relative h-28 bg-linear-to-br ${gradient}`}>
        <div className="flex h-full items-center justify-center">
          <span
            className="text-6xl font-black opacity-10"
            style={{ color: accent }}
          >
            {post?.category?.[0] ?? "?"}
          </span>
        </div>

        <div className="absolute left-3 top-3 flex gap-1.5">
          <span
            className="rounded-full px-2.5 py-1 text-[10px] font-semibold"
            style={{
              background: `${accent}22`,
              color: accent,
              border: `1px solid ${accent}44`,
            }}
          >
            {post?.category}
          </span>

          <span
            className={`rounded-full border px-2.5 py-1 text-[9px] font-bold uppercase ${
              POST_STATUS_STYLE[post?.status] || POST_STATUS_STYLE.live
            }`}
          >
            {post?.status}
          </span>
        </div>
      </div>

      <div className="space-y-3 p-5">
        <div>
          <h2 className="text-lg font-bold leading-snug text-white">
            {post?.title}
          </h2>

          <p className="mt-1.5 line-clamp-3 text-xs leading-relaxed text-zinc-500">
            {post?.description}
          </p>
        </div>

        <MetaChips
          budget={post?.budget}
          timeline={post?.timeline}
          address={address}
        />
      </div>

      <div className="grid grid-cols-3 border-t border-zinc-800/70">
        <Stat label="Awaiting" value={pendingCount} />
        <Stat
          label="Accepted"
          value={acceptedCount}
          valueClass="text-emerald-400"
        />
        <Stat label="Total" value={totalResponses} />
      </div>
    </section>
  );
}

function Stat({
  label,
  value,
  valueClass = "text-zinc-200",
}: {
  label: string;
  value: number;
  valueClass?: string;
}) {
  return (
    <div className="border-r border-zinc-800/70 py-3 text-center last:border-r-0">
      <p className={`text-base font-bold ${valueClass}`}>{value}</p>

      <p className="mt-0.5 text-[9px] uppercase tracking-wider text-zinc-600">
        {label}
      </p>
    </div>
  );
}

function PostQuestions({ questions }: { questions?: string[] }) {
  if (!questions?.length) return null;

  return (
    <section className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] p-4">
      <div className="mb-3 flex items-center gap-2">
        <HelpCircle className="h-4 w-4 text-[#FF3F3F]" />

        <h3 className="text-xs font-semibold text-zinc-100">
          Applicant Questions
        </h3>
      </div>

      <div className="space-y-2">
        {questions.map((question, index) => (
          <div key={index} className="flex items-start gap-2.5">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FF3F3F]/10 text-[9px] font-bold text-[#FF3F3F]">
              {index + 1}
            </span>

            <p className="text-xs leading-relaxed text-zinc-400">{question}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function PostMessages({ onInitiateChat }: { onInitiateChat: () => void }) {
  return (
    <section className="flex items-center justify-between rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] p-4">
      <div className="flex items-center gap-2">
        <MessageCircle className="h-4 w-4 text-[#FF3F3F]" />

        <div>
          <p className="text-xs font-semibold text-zinc-100">Messages</p>

          <p className="text-[10px] text-zinc-600">
            Chat with accepted applicants
          </p>
        </div>
      </div>

      <button
        onClick={onInitiateChat}
        className="
          theme-btn-accent-soft inline-flex items-center gap-1.5
          rounded-lg border border-[#FF3F3F]/30
          bg-[#FF3F3F]/10
          px-3 py-1.5
          text-[10px] font-semibold text-[#FF3F3F]
          transition hover:bg-[#FF3F3F]/20
        "
      >
        <MessageCircle className="h-3.5 w-3.5" />
        View
      </button>
    </section>
  );
}

function PostActions({
  status,
  confirmedAction,
  processing,
  onAction,
  onCancel,
}: {
  status: string;
  confirmedAction: "complete" | "expire" | "delete" | null;
  processing: boolean;
  onAction: (action: "complete" | "expire" | "delete") => void;
  onCancel: () => void;
}) {
  const disabled =
    processing || ["completed", "expired", "cancelled"].includes(status);

  return (
    <section className="rounded-2xl border border-zinc-800/70 bg-[#0c0c0e] p-4">
      <p className="mb-3 text-[10px] font-bold uppercase tracking-widest text-zinc-600">
        Post Actions
      </p>

      <div className="space-y-2">
        {!disabled && (
          <ActionButton
            icon={CheckCircle2}
            label="Mark as Completed"
            confirmLabel="Tap again to confirm"
            active={confirmedAction === "complete"}
            loading={processing && confirmedAction === "complete"}
            onClick={() => onAction("complete")}
            className="success"
          />
        )}

        {status === "live" && (
          <ActionButton
            icon={Clock}
            label="Mark as Expired"
            confirmLabel="Tap again to confirm"
            active={confirmedAction === "expire"}
            loading={processing && confirmedAction === "expire"}
            onClick={() => onAction("expire")}
            className="warning"
          />
        )}

        <ActionButton
          icon={Trash2}
          label="Delete Post"
          confirmLabel="Tap again to confirm"
          active={confirmedAction === "delete"}
          loading={processing && confirmedAction === "delete"}
          onClick={() => onAction("delete")}
          className="danger"
        />
      </div>

      {confirmedAction && (
        <button
          onClick={onCancel}
          className="mt-2 w-full py-1 text-[10px] text-zinc-600 transition hover:text-zinc-400"
        >
          Cancel
        </button>
      )}
    </section>
  );
}

function ActionButton({
  icon: Icon,
  label,
  confirmLabel,
  active,
  loading,
  onClick,
  className,
}: {
  icon: typeof CheckCircle2 | typeof Clock | typeof Trash2;
  label: string;
  confirmLabel: string;
  active: boolean;
  loading: boolean;
  onClick: () => void;
  className: "success" | "warning" | "danger";
}) {
  const styles = {
    success:
      "border-emerald-800/50 bg-emerald-950/30 text-emerald-400 hover:bg-emerald-900/40",
    warning:
      "border-amber-800/50 bg-amber-950/30 text-amber-400 hover:bg-amber-900/40",
    danger: "border-red-800/50 bg-red-950/30 text-red-400 hover:bg-red-900/40",
  };

  const activeStyles = {
    success: "border-emerald-500 bg-emerald-900/50 text-emerald-300",
    warning: "border-amber-500 bg-amber-900/50 text-amber-300",
    danger: "border-red-500 bg-red-900/50 text-red-300",
  };

  return (
    <button
      onClick={onClick}
      disabled={loading}
      className={`
        flex w-full items-center justify-center gap-2
        rounded-xl border py-2.5
        text-[11px] font-semibold
        transition
        disabled:opacity-50
        ${active ? activeStyles[className] : styles[className]}
      `}
    >
      {loading ? (
        <Loader2 className="h-3.5 w-3.5 animate-spin" />
      ) : (
        <Icon className="h-3.5 w-3.5" />
      )}

      {active ? confirmLabel : label}
    </button>
  );
}

function ResponsesPanel({
  responses,
  loading,
  actionLoading,
  expandedId,
  onRefresh,
  onToggle,
  onResponseAction,
  onInitiateChat,
}: {
  responses: Response[];
  loading: boolean;
  actionLoading: string | null;
  expandedId: string | null;
  onRefresh: () => void;
  onToggle: (id: string) => void;
  onResponseAction: (id: string, action: "accept" | "reject") => void;
  onInitiateChat: () => void;
}) {
  return (
    <section className="min-w-0 overflow-hidden rounded-2xl border border-zinc-800/70 bg-[#0c0c0e]">
      <div className="flex items-center justify-between border-b border-zinc-800/70 px-4 py-3.5">
        <div className="flex items-center gap-2">
          <Users className="h-4 w-4 text-[#FF3F3F]" />

          <h3 className="text-xs font-semibold text-zinc-100">
            Responses Received
          </h3>

          {!loading && (
            <span className="rounded-full bg-zinc-900 px-2 py-0.5 text-[9px] text-zinc-500">
              {responses.length}
            </span>
          )}
        </div>

        <button
          onClick={onRefresh}
          disabled={loading}
          className="rounded-lg border border-zinc-800 bg-zinc-900 p-1.5 text-zinc-500 transition hover:text-zinc-200 disabled:opacity-40"
        >
          <RefreshCw className={`h-3 w-3 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {loading ? (
        <ResponseSkeleton />
      ) : responses.length === 0 ? (
        <EmptyResponse />
      ) : (
        <div className="divide-y divide-zinc-800/70">
          {responses.map((r, index) => {
            const actioning = actionLoading === r._id;

            return (
              <ResponseRow
                key={r._id}
                response={r}
                idx={index}
                expanded={expandedId === r._id}
                onToggle={() => onToggle(r._id)}
                actions={
                  r.status === "pending" ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => onResponseAction(r._id, "accept")}
                        disabled={!!actionLoading}
                        className="rounded-lg bg-emerald-950/40 px-3 py-1.5 text-[10px] font-semibold text-emerald-400"
                      >
                        {actioning ? "..." : "Accept"}
                      </button>

                      <button
                        onClick={() => onResponseAction(r._id, "reject")}
                        disabled={!!actionLoading}
                        className="rounded-lg bg-red-950/30 px-3 py-1.5 text-[10px] font-semibold text-red-400"
                      >
                        {actioning ? "..." : "Decline"}
                      </button>
                    </div>
                  ) : r.status === "accepted" ? (
                    <button
                      onClick={onInitiateChat}
                      className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF3F3F]/10 px-3 py-1.5 text-[10px] font-semibold text-[#FF3F3F]"
                    >
                      <MessageCircle className="h-3 w-3" />
                      Chat
                    </button>
                  ) : null
                }
              />
            );
          })}
        </div>
      )}
    </section>
  );
}

function ResponseSkeleton() {
  return (
    <div className="flex gap-3 p-4 animate-pulse">
      {/* Avatar */}
      <div className="h-9 w-9 shrink-0 rounded-full bg-zinc-800" />

      <div className="min-w-0 flex-1 space-y-2">
        {/* Name + status */}
        <div className="flex items-center justify-between gap-3">
          <div className="h-3 w-24 rounded bg-zinc-800" />
          <div className="h-4 w-14 rounded-full bg-zinc-800" />
        </div>

        {/* Message */}
        <div className="h-2.5 w-full rounded bg-zinc-800/80" />
        <div className="h-2.5 w-4/5 rounded bg-zinc-800/60" />

        {/* Action buttons */}
        <div className="flex gap-2 pt-1">
          <div className="h-7 w-20 rounded-lg bg-zinc-800" />
          <div className="h-7 w-20 rounded-lg bg-zinc-800" />
        </div>
      </div>
    </div>
  );
}

function EmptyResponse() {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-14 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/70">
        <Users className="h-5 w-5 text-zinc-700" />
      </div>

      <h4 className="mt-4 text-sm font-semibold text-zinc-300">
        No responses yet
      </h4>

      <p className="mt-1.5 max-w-xs text-[11px] leading-relaxed text-zinc-600">
        When people respond to your post, their responses will appear here.
      </p>
    </div>
  );
}

function ResponseRow({
  response,
  idx,
  expanded,
  onToggle,
  actions,
}: {
  response: Response;
  idx: number;
  expanded: boolean;
  onToggle: () => void;
  actions?: React.ReactNode;
}) {
  const STATUS_STYLE: Record<string, string> = {
    pending: "bg-zinc-800/70 text-zinc-400 border-zinc-700/50",
    accepted: "bg-emerald-950/50 text-emerald-400 border-emerald-800/40",
    rejected: "bg-red-950/40 text-red-400 border-red-800/40",
  };

  const statusStyle = STATUS_STYLE[response.status] ?? STATUS_STYLE.pending;

  return (
    <div className="group transition-colors hover:bg-zinc-900/30">
      <div className="flex gap-3 p-4">
        {/* Avatar */}
        <button
          onClick={onToggle}
          className="shrink-0 cursor-pointer"
          aria-label={`View response from ${response.respondedBy.name}`}
        >
          <img
            src={response.respondedBy.avatar || ""}
            alt={response.respondedBy.name}
            className="h-9 w-9 rounded-full object-cover ring-1 ring-zinc-800"
            onError={(e) => handleAvatarError(e, response.respondedBy.name)}
            referrerPolicy="no-referrer"
          />
        </button>

        {/* Main content */}
        <div className="min-w-0 flex-1">
          {/* Header */}
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <button
                onClick={onToggle}
                className="block max-w-full truncate text-left text-[12px] font-bold text-zinc-200 hover:text-white"
              >
                {response.respondedBy.name}
              </button>

              <p className="mt-0.5 text-[10px] text-zinc-600">
                {new Date(response.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </p>
            </div>

            <span
              className={`shrink-0 rounded-full border px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide ${statusStyle}`}
            >
              {response.status}
            </span>
          </div>

          {/* Message */}
          <p
            className={`mt-2 text-[12px] leading-relaxed text-zinc-400 ${
              expanded ? "" : "line-clamp-2"
            }`}
          >
            {response.message}
          </p>

          {/* Answers */}
          {expanded && response.answers?.some((a) => a.answer?.trim()) && (
            <div className="mt-3 space-y-2">
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600">
                Screening Answers
              </p>

              {response.answers
                .filter((a) => a.answer?.trim())
                .map((answer, i) => (
                  <div
                    key={i}
                    className="rounded-lg border border-zinc-800/70 bg-zinc-900/50 px-3 py-2"
                  >
                    <p className="text-[10px] text-zinc-600">
                      {answer.question}
                    </p>
                    <p className="mt-0.5 text-[11px] leading-relaxed text-zinc-300">
                      {answer.answer}
                    </p>
                  </div>
                ))}
            </div>
          )}

          {/* Footer */}
          <div className="mt-3 flex items-center justify-between gap-3">
            <button
              onClick={onToggle}
              className="text-[10px] font-medium text-zinc-600 transition hover:text-zinc-400"
            >
              {expanded ? "Show less" : "View details"}
            </button>

            {actions && (
              <div className="flex shrink-0 items-center gap-2">{actions}</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function MetaChips({
  budget,
  timeline,
  address,
}: {
  budget?: string;
  timeline?: string;
  address?: string;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {budget && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <IndianRupee className="w-2.5 h-2.5" />
          {budget}
        </span>
      )}
      {timeline && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <Clock className="w-2.5 h-2.5" />
          {timeline}
        </span>
      )}
      {address && (
        <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#161619] border border-[#222226] rounded-full text-[10px] font-semibold text-zinc-400">
          <MapPin className="w-2.5 h-2.5" />
          {address}
        </span>
      )}
    </div>
  );
}

import { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowBigDownDashIcon,
  ChevronRight,
  LoaderCircle,
  MessageCircle,
  RotateCcw,
} from "lucide-react";
import { apiFetch } from "@/src/shared/lib/api";
import DashboardModal from "../DashboardModal";
import type {
  DashboardConversation,
  DashboardPost,
  DashboardResponse,
} from "../types";
import OfferDetailsModal from "./OfferDetailsModal";
import OfferSortMenu, { type OfferSort } from "./OfferSortMenu";
import OfferStatusFilter, {
  type OfferStatusFilterValue,
} from "./OfferStatusFilter";
import Pagination from "./Pagination";
import {
  Avatar,
  EmptyState,
  ErrorState,
  LoadingState,
  StatusBadge,
} from "./RequirementUI";

interface ReceivedOffersModalProps {
  post: DashboardPost;
  onClose: () => void;
  onInitiateChat: (postId: string, conversationId?: string) => void;
  onChanged: () => Promise<void>;
}

export default function ReceivedOffersModal({
  post,
  onClose,
  onInitiateChat,
  onChanged,
}: ReceivedOffersModalProps) {
  const [sort, setSort] = useState<OfferSort>("trustScoreDesc");
  const [statusFilter, setStatusFilter] =
    useState<OfferStatusFilterValue>("pending");
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    total: 0,
    totalPages: 1,
  });
  const [responses, setResponses] = useState<DashboardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [rowActionError, setRowActionError] = useState("");
  const [reconsideringId, setReconsideringId] = useState<string | null>(null);
  const [selectedResponse, setSelectedResponse] =
    useState<DashboardResponse | null>(null);
  const latestRequest = useRef(0);

  const loadOffers = useCallback(async () => {
    const requestId = ++latestRequest.current;
    setLoading(true);
    setError("");
    try {
      const query = new URLSearchParams({
        pagination: "true",
        page: String(page),
        limit: "10",
        sort,
        status: statusFilter,
      });
      const [offerResponse, conversationResponse] = await Promise.all([
        apiFetch(`/api/responses/post/${post._id}?${query.toString()}`),
        apiFetch(`/api/chat/posts/${post._id}/conversations`),
      ]);
      const offerBody = await offerResponse.json();
      const conversationBody = await conversationResponse.json();
      if (requestId !== latestRequest.current) return;
      if (!offerResponse.ok)
        throw new Error(offerBody?.message || "Could not load offers.");
      const conversations: DashboardConversation[] = conversationResponse.ok
        ? (conversationBody.data ?? [])
        : [];
      setResponses(
        (offerBody.responses ?? []).map((response: DashboardResponse) => ({
          ...response,
          conversationId: conversations.find(
            (conversation) => conversation.responseId === response._id,
          )?._id,
        })),
      );
      setPagination({
        page: offerBody.pagination?.page ?? page,
        total: offerBody.pagination?.total ?? offerBody.count ?? 0,
        totalPages: Math.max(1, offerBody.pagination?.totalPages ?? 1),
      });
    } catch (cause) {
      if (requestId === latestRequest.current)
        setError(
          cause instanceof Error ? cause.message : "Could not load offers.",
        );
    } finally {
      if (requestId === latestRequest.current) setLoading(false);
    }
  }, [page, post._id, sort, statusFilter]);

  useEffect(() => {
    void loadOffers();
  }, [loadOffers]);

  const updateOffer = async (
    responseId: string,
    action: "accept" | "reject",
  ) => {
    const result = await apiFetch(`/api/responses/${responseId}/${action}`, {
      method: "PATCH",
    });
    const body = await result.json();
    if (!result.ok)
      throw new Error(body?.message || `Could not ${action} this offer.`);
    const status = action === "accept" ? "accepted" : "rejected";
    const conversationId = body.conversation?._id;
    setResponses((current) =>
      current.map((item) =>
        item._id === responseId ? { ...item, status, conversationId } : item,
      ),
    );
    setSelectedResponse((current) =>
      current?._id === responseId
        ? { ...current, status, conversationId }
        : current,
    );
    await loadOffers();
    await onChanged();
  };

  const reconsiderOffer = async (responseId: string) => {
    setReconsideringId(responseId);
    setRowActionError("");
    try {
      const result = await apiFetch(`/api/responses/${responseId}/reconsider`, {
        method: "PATCH",
      });
      const body = await result.json();
      if (!result.ok)
        throw new Error(body?.message || "Could not reevaluate this offer.");

      if (page === 1) await loadOffers();
      else setPage(1);
      await onChanged();
      setSelectedResponse(null);
    } catch (cause) {
      setRowActionError(
        cause instanceof Error
          ? cause.message
          : "Could not reevaluate this offer.",
      );
      throw cause;
    } finally {
      setReconsideringId(null);
    }
  };

  return (
    <DashboardModal
      title="Arrows "
      subtitle={post.title}
      onClose={onClose}
      size="wide"
      mobileDrawer
      closeOnEscape={!selectedResponse}
      contentClassName="flex flex-col overflow-hidden"
      headerActions={
        <div className="flex items-center gap-2">
          <OfferStatusFilter
            value={statusFilter}
            onChange={(nextStatus) => {
              setStatusFilter(nextStatus);
              setPage(1);
            }}
          />
          <OfferSortMenu
            value={sort}
            onChange={(nextSort) => {
              setSort(nextSort);
              setPage(1);
            }}
          />
        </div>
      }
    >
      <div className="flex min-h-0 flex-1 flex-col">
        <div className="theme-divider min-h-48 flex-1 overflow-y-auto sm:min-h-60 md:min-h-0">
          {loading ? (
            <LoadingState />
          ) : error ? (
            <ErrorState message={error} retry={() => void loadOffers()} />
          ) : responses.length === 0 ? (
            <EmptyState text={`Don't have any ${statusFilter} offers.`} />
          ) : (
            responses.map((response) => (
              <article
                key={response._id}
                className="theme-divider theme-hover-soft flex items-center gap-3 border-b px-4 py-3 transition last:border-b-0"
              >
                <Avatar
                  name={response.respondedBy?.name ?? "Respondent"}
                  src={response.respondedBy?.avatar}
                />

                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <strong className="theme-text-primary max-w-full truncate text-sm">
                      {response.respondedBy?.name ?? "Respondent"}
                    </strong>

                    <StatusBadge status={response.status} />
                  </div>

                  <div className="theme-text-muted mt-1 flex flex-wrap gap-x-3 gap-y-1 text-[10px]">
                    <span>
                      Trust score {Math.round(response.trustScore ?? 0)}
                    </span>
                    <span>
                      Rating {response.averageRating?.toFixed(1) ?? "—"}
                    </span>
                  </div>
                </div>

                <div className="flex shrink-0 items-center gap-1.5">
                  {response.status === "rejected" && (
                    <button
                      type="button"
                      disabled={reconsideringId !== null}
                      onClick={() =>
                        void reconsiderOffer(response._id).catch(() => {})
                      }
                      className="theme-divider theme-text-primary inline-flex items-center gap-1.5 rounded-md border px-2.5 py-1.5 text-[11px] font-semibold disabled:opacity-50"
                    >
                      {reconsideringId === response._id ? (
                        <LoaderCircle className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <RotateCcw className="h-3.5 w-3.5" />
                      )}
                      Reevaluate
                    </button>
                  )}
                  {response.status === "accepted" &&
                    response.conversationId && (
                      <button
                        type="button"
                        aria-label={`Chat with ${response.respondedBy?.name ?? "respondent"}`}
                        title="Open chat"
                        onClick={() =>
                          onInitiateChat(post._id, response.conversationId)
                        }
                        className="theme-icon-muted h-9 w-9 rounded-lg flex items-center justify-center transition hover:bg-white/5 hover:text-[#FF6B6B]"
                      >
                        <MessageCircle className="h-4 w-4 text-red-500" />
                      </button>
                    )}

                  <button
                    type="button"
                    aria-label={`View offer from ${response.respondedBy?.name ?? "respondent"}`}
                    onClick={() => setSelectedResponse(response)}
                    className="theme-icon-muted flex h-9 w-9 items-center justify-center rounded-lg transition hover:bg-white/5 hover:text-[#FF6B6B]"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
        {rowActionError && (
          <p role="alert" className="px-4 py-2 text-xs text-red-500">
            {rowActionError}
          </p>
        )}

        <Pagination
          page={pagination.page}
          totalPages={pagination.totalPages}
          totalItems={pagination.total}
          pageSize={10}
          loading={loading}
          onPageChange={setPage}
        />
      </div>

      {selectedResponse && (
        <OfferDetailsModal
          post={post}
          response={selectedResponse}
          onClose={() => setSelectedResponse(null)}
          onUpdate={updateOffer}
          onReevaluate={reconsiderOffer}
          onChat={() => {
            if (!selectedResponse.conversationId) return;

            setSelectedResponse(null);
            onClose();
            onInitiateChat(post._id, selectedResponse.conversationId);
          }}
        />
      )}
    </DashboardModal>
  );
}

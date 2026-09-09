import {
  ArrowLeft,
  BadgeCheck,
  Clock,
  IndianRupee,
  MapPin,
  Plus,
  Zap,
} from "lucide-react";

import { Post, User } from "../../types";
import {
  getAvatarUrl,
  handleAvatarError,
  isPostExpired,
  getPostExpiryLabel,
} from "../../utils";
import { apiFetchJSON } from "../../lib/api";

import { CATEGORY_COLORS } from "../../lib/postConstants";

import PostImageGallery from "./PostImageGallery";
import ResponsesPanel from "./ResponsePanel";
import { useState } from "react";
import ApplyRequirementModal from "./ApplyRequirementModal";
import { handleHideUpperNavigation } from "@/src/store/uiSlice";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { useNavigate } from "react-router-dom";

const STATUS_DOT: Record<string, string> = {
  live: "bg-emerald-500",
  in_progress: "bg-yellow-500",
  completed: "bg-blue-500",
  expired: "bg-zinc-600",
  cancelled: "bg-red-700",
};
const STATUS_COLORS: Record<string, string> = {
  live: "#22c55e",
  in_progress: "#f59e0b",
  completed: "#3b82f6",
  expired: "#71717a",
  cancelled: "#ef4444",
};

interface PostDetailProps {
  post: Post;
  onBack: () => void;
  onViewProfile?: (author: Post["author"]) => void;
  onResponseSubmit: (postId: string) => void;
}

export default function PostDetail({
  post,
  onBack,
  onViewProfile,
  onResponseSubmit,
}: PostDetailProps) {
  const expired = post?.expiresAt ? isPostExpired(post.expiresAt) : false;
  const navigate = useNavigate();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  const expiryLabel = post?.expiresAt
    ? getPostExpiryLabel(post.expiresAt)
    : null;

  const dispatch = useAppDispatch();

  const accent = CATEGORY_COLORS[post?.category?.toLowerCase()] ?? "#FF3F3F";
  const [isApplyModalOpen, setIsApplyModalOpen] = useState(false);

  const isUrgent =
    post?.title?.toLowerCase().includes("urgent") ||
    post?.description?.toLowerCase().includes("urgent");

  const handleSubmitResponse = async ({
    postId,
    message,
    answers,
  }: {
    postId: string;
    message: string;
    answers: { question: string; answer: string }[];
  }): Promise<void> => {
    try {
      await apiFetchJSON("/api/responses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          postId,
          message,
          answers,
        }),
      });

      setIsApplyModalOpen(false);
      onResponseSubmit(postId); // Close the modal and navigate back to the post detail view

      // Optional: refresh responses
      // fetchResponses();
    } catch (error) {
      console.error("Error submitting response:", error);
      throw error;
    }
  };

  const handleResponseOpen = () => {
    if (isAuthenticated) {
      setIsApplyModalOpen(true);
      dispatch(handleHideUpperNavigation(true));
    } else {
      navigate("/login", { replace: true });
    }
  };

  const handleResponseClose = () => {
    setIsApplyModalOpen(false);
    dispatch(handleHideUpperNavigation(false));
  };

  return (
    <div className="absolute inset-0 min-h-0 w-full pt-16 backdrop-blur-sm theme-page-shell">
      <div className="h-full min-h-0 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-7xl px-4 sm:px-6">
          <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Left - Desktop */}
            <LeftPanelDesktop
              post={post}
              onBack={onBack}
              onViewProfile={onViewProfile}
              onApply={handleResponseOpen}
              expired={expired}
              isUrgent={isUrgent}
              accent={accent}
              expiryLabel={expiryLabel}
            />

            {/* Left - Mobile */}
            <LeftPanelMobile
              post={post}
              onBack={onBack}
              onViewProfile={onViewProfile}
              onApply={handleResponseOpen}
              expired={expired}
              isUrgent={isUrgent}
              accent={accent}
              expiryLabel={expiryLabel}
            />

            {/* Right - Desktop Responses */}
            <aside className="hidden min-h-0 border-l border-white/5.5 lg:flex lg:w-90 lg:flex-col lg:py-6 lg:pl-4">
              <ResponsesPanel
                post={post}
                onViewProfile={onViewProfile}
                onApply={handleResponseOpen}
              />
            </aside>
          </div>
        </div>

        {/* Apply Modal */}
        <ApplyRequirementModal
          isOpen={isApplyModalOpen}
          post={post}
          onClose={handleResponseClose}
          onSubmit={handleSubmitResponse}
        />
      </div>
    </div>
  );
}
interface LeftPanelProps {
  post: Post;
  onBack: () => void;
  onViewProfile?: (user: User) => void;
  onApply: () => void;
  expired: boolean;
  isUrgent: boolean;
  accent: string;
  expiryLabel?: string;
}

function LeftPanelDesktop({
  post,
  onBack,
  onViewProfile,
  expired,
  isUrgent,
  accent,
  expiryLabel,
}: LeftPanelProps) {
  const postedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "Just now";

  return (
    <main className="hidden min-h-0 overflow-y-auto scrollbar-hide lg:block lg:py-6 lg:pr-8">
      {/* Header */}
      <div className="flex items-center">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:-translate-x-0.5 hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform" />
          Requirements
        </button>
      </div>

      {/* Content */}
      <section className="mt-7 max-w-4xl">
        {/* Author */}
        <div className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={() => onViewProfile?.(post.author)}
            className="group flex min-w-0 items-center gap-3 text-left"
          >
            <img
              src={getAvatarUrl(
                post.author.name,
                post.author.avatar ?? undefined,
              )}
              alt={post.author.name}
              className="h-10 w-10 shrink-0 rounded-full object-cover"
              onError={(e) => handleAvatarError(e, post.author.name)}
              referrerPolicy="no-referrer"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[14px] font-semibold text-zinc-100 group-hover:text-white">
                  {post.author.name}
                </p>

                {post.author.isGovernmentVerified && (
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                )}
              </div>

              <p className="mt-0.5 truncate text-[11px] text-zinc-500">
                {post.address || "Location not specified"}
              </p>
            </div>
          </button>

          <span className="shrink-0 text-[10px] text-zinc-600">
            {postedDate}
          </span>
        </div>

        {/* Status */}
        <div className="mt-6 flex flex-wrap items-center gap-1.5">
          {post.category && (
            <span
              className="rounded-md border px-2.5 py-1 text-[9px] font-bold uppercase tracking-wide"
              style={{
                backgroundColor: `${accent}10`,
                borderColor: `${accent}25`,
                color: accent,
              }}
            >
              {post.category}
            </span>
          )}

          <span
            className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.025] px-2.5 py-1 text-[9px] font-medium capitalize"
            style={{
              color: STATUS_COLORS[post.status] ?? "#71717a",
            }}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                STATUS_DOT[post.status] ?? "bg-zinc-600"
              }`}
            />

            {post.status?.replace("_", " ")}
          </span>

          {isUrgent && !expired && (
            <span className="rounded-md bg-[#FF3F3F]/8 px-2.5 py-1 text-[9px] font-semibold text-[#ff6565]">
              I need help
            </span>
          )}

          {expired && (
            <span className="rounded-md bg-white/[0.04] px-2.5 py-1 text-[9px] text-zinc-600">
              Expired
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-7">
          <h1 className="max-w-4xl text-[38px] font-semibold leading-[1.12] tracking-[-0.03em] text-zinc-100">
            {post.title}
          </h1>
        </div>

        {/* Description */}
        <div className="mt-5 max-w-3xl">
          <p className="whitespace-pre-wrap text-[14px] leading-7 text-zinc-400">
            {post.description}
          </p>
        </div>

        {/* Requirement Info */}
        <div className="mt-8 grid max-w-3xl grid-cols-3 divide-x divide-white/8 border-y border-white/8 py-5">
          {/* Location */}
          <div className="min-w-0 pr-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Location
            </p>

            <p className="mt-2 truncate text-[12px] font-medium text-zinc-300">
              {post.address || "Not specified"}
            </p>
          </div>

          {/* Budget */}
          <div className="min-w-0 px-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Budget
            </p>

            <p className="mt-2 truncate text-[12px] font-medium text-zinc-300">
              {post.budget || "Negotiable"}
            </p>
          </div>

          {/* Timeline */}
          <div className="min-w-0 pl-6">
            <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
              Timeline
            </p>

            <p className="mt-2 truncate text-[12px] font-medium text-zinc-300">
              {post.timeline || expiryLabel || "Not specified"}
            </p>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-6 flex items-center gap-2 text-[10px] text-zinc-600">
          <span className="font-medium text-zinc-500">
            Posted on HuntInTown
          </span>

          <span>•</span>
          <span>Safe</span>

          <span>•</span>
          <span>Trusted</span>

          <span>•</span>
          <span>Verified</span>
        </div>

        {/* Attachments */}
        {post.images?.length > 0 && (
          <div className="mt-8 max-w-3xl">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                Attachments
              </p>

              <span className="text-[9px] text-zinc-600">
                {post.images.length}{" "}
                {post.images.length === 1 ? "image" : "images"}
              </span>
            </div>

            <PostImageGallery images={post.images} />
          </div>
        )}
      </section>
    </main>
  );
}

function LeftPanelMobile({
  post,
  onBack,
  onViewProfile,
  onApply,
  expired,
  isUrgent,
  accent,
  expiryLabel,
}: LeftPanelProps) {
  const postedDate = post?.createdAt
    ? new Date(post.createdAt).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      })
    : "Just now";

  return (
    <main className="min-h-0 overflow-y-auto scrollbar-hide py-4 lg:hidden">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-200"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Requirements
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={expired}
          className="inline-flex items-center gap-1.5 rounded-lg bg-[#FF3F3F] px-3.5 py-2 text-[10px] font-bold text-white transition active:scale-95 disabled:cursor-not-allowed disabled:opacity-40"
        >
          <Plus className="h-3.5 w-3.5" />
          Apply
        </button>
      </div>

      {/* Content */}
      <section className="mt-6">
        {/* Author */}
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={() => onViewProfile?.(post.author)}
            className="group flex min-w-0 items-center gap-2.5 text-left"
          >
            <img
              src={getAvatarUrl(
                post.author.name,
                post.author.avatar ?? undefined,
              )}
              alt={post.author.name}
              className="h-9 w-9 shrink-0 rounded-full object-cover"
              onError={(e) => handleAvatarError(e, post.author.name)}
              referrerPolicy="no-referrer"
            />

            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <p className="truncate text-[13px] font-semibold text-zinc-100 group-hover:text-white">
                  {post.author.name}
                </p>

                {post.author.isGovernmentVerified && (
                  <BadgeCheck className="h-3.5 w-3.5 shrink-0 text-blue-400" />
                )}
              </div>

              <p className="truncate text-[10px] text-zinc-500">
                {post.address || "Location not specified"}
              </p>
            </div>
          </button>

          <span className="shrink-0 text-[10px] text-zinc-600">
            {postedDate}
          </span>
        </div>

        {/* Status */}
        <div className="mt-5 flex flex-wrap items-center gap-1.5">
          {post.category && (
            <span
              className="rounded-md border px-2 py-1 text-[9px] font-bold uppercase tracking-wide"
              style={{
                backgroundColor: `${accent}10`,
                borderColor: `${accent}25`,
                color: accent,
              }}
            >
              {post.category}
            </span>
          )}

          <span
            className="inline-flex items-center gap-1.5 rounded-md border border-white/8 bg-white/[0.025] px-2 py-1 text-[9px] font-medium capitalize text-zinc-400"
            style={{
              color: STATUS_COLORS[post.status] ?? "#71717a",
            }}
          >
            <span
              className={`h-1.5 w-1.5 rounded-full ${
                STATUS_DOT[post.status] ?? "bg-zinc-600"
              }`}
            />

            {post.status?.replace("_", " ")}
          </span>

          {isUrgent && !expired && (
            <span className="rounded-md bg-[#FF3F3F]/8 px-2 py-1 text-[9px] font-semibold text-[#ff6565]">
              I need help
            </span>
          )}

          {expired && (
            <span className="rounded-md bg-white/[0.04] px-2 py-1 text-[9px] text-zinc-600">
              Expired
            </span>
          )}
        </div>

        {/* Title */}
        <div className="mt-6">
          <h1 className="text-[27px] font-semibold leading-[1.15] tracking-[-0.025em] text-zinc-100">
            {post.title}
          </h1>
        </div>

        {/* Description */}
        <div className="mt-4">
          <p className="whitespace-pre-wrap text-[13px] leading-6 text-zinc-400">
            {post.description}
          </p>
        </div>

        {/* Requirement Info */}
        <div className="mt-7 grid grid-cols-3 divide-x divide-white/8 border-y border-white/8 py-4">
          {/* Location */}
          <div className="min-w-0 pr-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Location
            </p>

            <p className="mt-1.5 truncate text-[11px] font-medium text-zinc-300">
              {post.address || "Not specified"}
            </p>
          </div>

          {/* Budget */}
          <div className="min-w-0 px-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Budget
            </p>

            <p className="mt-1.5 truncate text-[11px] font-medium text-zinc-300">
              {post.budget || "Negotiable"}
            </p>
          </div>

          {/* Timeline */}
          <div className="min-w-0 pl-3">
            <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600">
              Timeline
            </p>

            <p className="mt-1.5 truncate text-[11px] font-medium text-zinc-300">
              {post.timeline || expiryLabel || "Not specified"}
            </p>
          </div>
        </div>

        {/* Trust */}
        <div className="mt-5 flex items-center gap-2 text-[9px] text-zinc-600">
          <span className="text-zinc-500">Posted on HuntInTown</span>
          <span>•</span>
          <span>Safe</span>
          <span>•</span>
          <span>Trusted</span>
          <span>•</span>
          <span>Verified</span>
        </div>

        {/* Attachments */}
        {post.images?.length > 0 && (
          <div className="mt-7">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-[9px] font-semibold uppercase tracking-[0.14em] text-zinc-600">
                Attachments
              </p>

              <span className="text-[9px] text-zinc-600">
                {post.images.length}{" "}
                {post.images.length === 1 ? "image" : "images"}
              </span>
            </div>

            <PostImageGallery images={post.images} />
          </div>
        )}

        {/* Responses */}
        <div className="mt-8 border-t border-white/8 pt-7">
          <ResponsesPanel
            post={post}
            onViewProfile={onViewProfile}
            onApply={onApply}
          />
        </div>
      </section>
    </main>
  );
}

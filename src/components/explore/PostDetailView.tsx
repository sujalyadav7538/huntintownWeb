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
  const {isAuthenticated} = useAppSelector((state) => state.auth);

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
    <div className="absolute inset-0 min-h-0 w-full  pt-16  backdrop-blur-sm theme-page-shell">
      <div className="h-full min-h-0 overflow-hidden">
        <div className="mx-auto h-full w-full max-w-7xl px-4 sm:px-6">
          <div className="grid h-full min-h-0 lg:grid-cols-[minmax(0,1fr)_360px]">
            {/* Left */}
            <LeftPanel
              post={post}
              onBack={onBack}
              onViewProfile={onViewProfile}
              onApply={handleResponseOpen}
              expired={expired}
              isUrgent={isUrgent}
              accent={accent}
              expiryLabel={expiryLabel}
            />

            {/* Right */}
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

function LeftPanel({
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
    <main className="min-h-0 overflow-y-auto scrollbar-hide md:scrollbar-default py-4 sm:py-6 lg:pr-7">
      {/* Back + Mobile Apply */}
      <div className="flex items-center justify-between lg:justify-start">
        <button
          type="button"
          onClick={onBack}
          className="group inline-flex items-center gap-1.5 text-[11px] font-medium text-zinc-500 transition-colors hover:text-zinc-200 hover:-translate-x-0.5 cursor-pointer"
        >
          <ArrowLeft className="h-3.5 w-3.5 transition-transform " />
          Requirements
        </button>

        <button
          type="button"
          onClick={onApply}
          disabled={expired}
          className="inline-flex items-center gap-1 rounded-lg bg-[#FF3F3F] px-3 py-1.5 text-[10px] font-bold text-white transition hover:bg-[#e93636] disabled:cursor-not-allowed disabled:opacity-40 lg:hidden"
        >
          <Plus className="h-3.5 w-3.5" />
          Apply
        </button>
      </div>

      {/* Requirement */}
      <section className="mt-3 max-w-4xl">
        <article className="overflow-hidden rounded-2xl ">
          <div className=" py-4  sm:py-5">
            <div className="flex items-start justify-between gap-3">
              <button
                type="button"
                onClick={() => onViewProfile?.(post.author)}
                className="group flex min-w-0 items-center gap-2.5 text-left cursor-pointer"
              >
                <img
                  src={getAvatarUrl(
                    post.author.name,
                    post.author.avatar ?? undefined,
                  )}
                  alt={post.author.name}
                  className="h-10 w-10 shrink-0 rounded-full border border-white/10 object-cover"
                  onError={(e) => handleAvatarError(e, post.author.name)}
                  referrerPolicy="no-referrer"
                />

                <div className="min-w-0">
                  <div className="flex items-center gap-1.5">
                    <p className="truncate text-[14px] font-semibold text-zinc-100 group-hover:text-white">
                      {post.author.name}
                    </p>
                    {post.author.isGovernmentVerified && (
                      <BadgeCheck className="h-3.5 w-3.5 text-blue-400" />
                    )}
                  </div>

                  <p className="truncate text-[11px] text-zinc-500">
                    {post.address || "Location not specified"}
                  </p>
                </div>
              </button>

              <span className="shrink-0 rounded-lg border border-white/10 bg-white/4 px-2.5 py-1 text-[10px] font-medium text-zinc-300">
                {postedDate}
              </span>
            </div>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              {post.category && (
                <span
                  className="rounded-lg border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide"
                  style={{
                    backgroundColor: `${accent}12`,
                    borderColor: `${accent}28`,
                    color: accent,
                  }}
                >
                  {post.category}
                </span>
              )}

              <span
                className="inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-[10px] font-semibold capitalize"
                style={{
                  backgroundColor: `${STATUS_COLORS[post.status] ?? "#71717a"}12`,
                  borderColor: `${STATUS_COLORS[post.status] ?? "#71717a"}25`,
                  color: STATUS_COLORS[post.status] ?? "#71717a",
                }}
              >
                <span
                  className={`h-1.5 w-1.5 rounded-full ${STATUS_DOT[post.status] ?? "bg-zinc-600"}`}
                />
                {post.status?.replace("_", " ")}
              </span>

              {isUrgent && !expired && (
                <span className="inline-flex items-center gap-1 rounded-lg border border-[#FF3F3F]/20 bg-[#FF3F3F]/8 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-[#ff6565]">
                  <Zap className="h-3 w-3" />I need help
                </span>
              )}

              {expired && (
                <span className="rounded-lg bg-white/4 px-2.5 py-1 text-[10px] text-zinc-500">
                  Expired
                </span>
              )}
            </div>

            <h1 className="mt-4 text-[26px] font-semibold leading-tight tracking-tight text-zinc-100 sm:text-[34px]">
              {post.title}
            </h1>

            <p className="mt-3 whitespace-pre-wrap text-[13px] leading-7 text-zinc-300 sm:text-[14px]">
              {post.description}
            </p>

            <div className="my-5 h-px bg-white/8" />

            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-zinc-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/3">
                    <MapPin className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[12px]">Location</span>
                </div>
                <span className="truncate text-right text-[13px] font-medium text-zinc-200">
                  {post.address || "Not specified"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-zinc-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/3">
                    <IndianRupee className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[12px]">Budget</span>
                </div>
                <span className="text-[13px] font-medium text-zinc-200">
                  {post.budget || "Negotiable"}
                </span>
              </div>

              <div className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2.5 text-zinc-500">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-white/3">
                    <Clock className="h-3.5 w-3.5" />
                  </div>
                  <span className="text-[12px]">Timeline</span>
                </div>
                <span className="text-[13px] font-medium text-zinc-200">
                  {post.timeline || expiryLabel || "Not specified"}
                </span>
              </div>
            </div>

            <div className="my-5 h-px bg-white/8" />

            <div className="flex flex-wrap items-center gap-2 text-[11px] text-zinc-400">
              <span className="font-medium">Posted on HuntInTown</span>
              <span className="text-zinc-700">•</span>
              <span>Safe</span>
              <span className="text-zinc-700">•</span>
              <span>Trusted</span>
              <span className="text-zinc-700">•</span>
              <span>Verified</span>
            </div>

            {post.images?.length > 0 && (
              <div className="mt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-500">
                    Attachments
                  </p>
                  <span className="text-[10px] text-zinc-600">
                    {post.images.length}{" "}
                    {post.images.length === 1 ? "image" : "images"}
                  </span>
                </div>
                <PostImageGallery images={post.images} />
              </div>
            )}
          </div>
        </article>

        {/* Mobile Responses */}
        <div className="mt-7 border-t border-white/6 pt-8 lg:hidden">
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

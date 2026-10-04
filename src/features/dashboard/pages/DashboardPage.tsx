import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Layers } from "lucide-react";

import { Post, User } from "@/src/shared/types";

import DashboardHeader from "@/src/features/dashboard/components/DashboardHeader";
import DashboardStats from "@/src/features/dashboard/components/DashboardStats";
import PublishedListingItem from "@/src/features/dashboard/components/PublishedListingItem";
import ProposalsSidebar from "@/src/features/dashboard/components/ProposalsSidebar";
import OffersReceivedModal from "@/src/features/dashboard/components/OffersReceivedModal";
import DashboardOverviewStats from "@/src/features/dashboard/components/DashboardOverviewStats";
import PublishedRequirements from "@/src/features/dashboard/components/requirements/PublishedRequirements";
import SubmittedOffers from "@/src/features/dashboard/components/offers/SubmittedOffers";
import type { DashboardPost, SubmittedResponse } from "@/src/features/dashboard/components/types";

type PostStatus = Post["status"];

interface DashboardProps {
  onUpdateStatus: (postId: string, status: PostStatus) => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  setActiveTab: (tab: string) => void;
  onInitiateChat: (postId: string, conversationId?: string) => void;
}

export default function DashboardPage({
  onUpdateStatus,
  onDeleteListing,
  onInitiateChat,
}: DashboardProps) {
  const [posts, setPosts] = useState<DashboardPost[]>([]);
  const [submitted, setSubmitted] = useState<SubmittedResponse[]>([]);
  const [statsRevision, setStatsRevision] = useState(0);
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedView =
    searchParams.get("view") === "submitted" ? "submitted" : "published";

  const refreshStats = () => setStatsRevision((revision) => revision + 1);
  const selectView = (view: "published" | "submitted") => {
    const nextParams = new URLSearchParams(searchParams);
    if (view === "published") nextParams.delete("view");
    else nextParams.set("view", view);
    setSearchParams(nextParams);
  };

  const stats = (
    <DashboardOverviewStats
      posts={posts}
      submitted={submitted}
      revision={statsRevision}
    />
  );
  const published = (
    <PublishedRequirements
      onDataChange={setPosts}
      onInitiateChat={onInitiateChat}
      onChanged={refreshStats}
      onUpdateStatus={onUpdateStatus}
      onDeleteListing={onDeleteListing}
    />
  );
  const submittedOffers = (
    <SubmittedOffers
      onDataChange={setSubmitted}
      onInitiateChat={onInitiateChat}
    />
  );

  return (
    <div className="theme-page-shell mx-auto w-full max-w-7xl space-y-7 px-1 py-5 sm:space-y-8 sm:py-7">
      <div className="hidden md:block">{stats}</div>
      <nav
        role="tablist"
        aria-label="Dashboard sections"
        className="theme-divider flex max-w-full overflow-x-auto border-b scrollbar-hide md:hidden"
      >
        <DashboardTab
          active={selectedView === "published"}
          label="Published requirements"
          onClick={() => selectView("published")}
        />
        <DashboardTab
          active={selectedView === "submitted"}
          label="Submitted offers"
          onClick={() => selectView("submitted")}
        />
      </nav>
      <div className="grid min-w-0 grid-cols-[minmax(0,1fr)] items-start gap-7 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className={`min-w-0 ${selectedView === "published" ? "block" : "hidden md:block"}`}>
          {published}
        </div>
        <div className={`min-w-0 ${selectedView === "submitted" ? "block" : "hidden md:block"}`}>
          {submittedOffers}
        </div>
      </div>
    </div>
  );
}

function DashboardTab({ active, label, onClick }: { active: boolean; label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      role="tab"
      aria-selected={active}
      onClick={onClick}
      className={`theme-text-muted min-w-0 flex-1 whitespace-nowrap border-b-2 px-2 py-3 text-center text-[11px] font-semibold transition ${active ? "border-[#FF3F3F] text-[#FF3F3F]" : "border-transparent"}`}
    >
      {label}
    </button>
  );
}

interface DashboardViewProps {
  myPosts: Post[];
  postsUserCommentedOn: Post[];
  currentUser: User | null;
  openCount: number;
  fulfilledCount: number;
  helperSubmissions: number;
  setActiveTab: (tab: string) => void;
  onUpdateStatus: (postId: string, status: PostStatus) => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  onViewOffers: (post: Post) => void;
}

/* ================================================================
   DESKTOP — listings and proposals side by side (8 / 4 split)
================================================================ */

function DashboardDesktop({
  myPosts,
  postsUserCommentedOn,
  currentUser,
  openCount,
  fulfilledCount,
  helperSubmissions,
  setActiveTab,
  onUpdateStatus,
  onDeleteListing,
  onSelectPost,
  onViewOffers,
}: DashboardViewProps) {
  return (
    <div className="space-y-6 text-zinc-100">
      <DashboardHeader setActiveTab={setActiveTab} />

      <DashboardStats
        openCount={openCount}
        fulfilledCount={fulfilledCount}
        helperSubmissions={helperSubmissions}
      />

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-8 space-y-4">
          <PublishedListings
            myPosts={myPosts}
            onUpdateStatus={onUpdateStatus}
            onDeleteListing={onDeleteListing}
            onSelectPost={onSelectPost}
            onViewOffers={onViewOffers}
          />
        </div>

        <div className="col-span-4 space-y-4">
          <ProposalsSidebar
            postsUserCommentedOn={postsUserCommentedOn}
            currentUser={currentUser}
            onSelectPost={onSelectPost}
          />
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   MOBILE — one column; listings first, proposals below
================================================================ */

function DashboardMobile({
  myPosts,
  postsUserCommentedOn,
  currentUser,
  openCount,
  fulfilledCount,
  helperSubmissions,
  setActiveTab,
  onUpdateStatus,
  onDeleteListing,
  onSelectPost,
  onViewOffers,
}: DashboardViewProps) {
  return (
    <div className="space-y-5 pb-6 text-zinc-100">
      <DashboardHeader setActiveTab={setActiveTab} />

      <DashboardStats
        openCount={openCount}
        fulfilledCount={fulfilledCount}
        helperSubmissions={helperSubmissions}
      />

      <PublishedListings
        myPosts={myPosts}
        onUpdateStatus={onUpdateStatus}
        onDeleteListing={onDeleteListing}
        onSelectPost={onSelectPost}
        onViewOffers={onViewOffers}
      />

      <ProposalsSidebar
        postsUserCommentedOn={postsUserCommentedOn}
        currentUser={currentUser}
        onSelectPost={onSelectPost}
      />
    </div>
  );
}

/* ================================================================
   SHARED PIECES
================================================================ */

function PublishedListings({
  myPosts,
  onUpdateStatus,
  onDeleteListing,
  onSelectPost,
  onViewOffers,
}: {
  myPosts: Post[];
  onUpdateStatus: (postId: string, status: PostStatus) => void;
  onDeleteListing: (postId: string) => void;
  onSelectPost: (postId: string) => void;
  onViewOffers: (post: Post) => void;
}) {
  return (
    <div className="overflow-hidden rounded-xl border border-[#1e1e22] bg-[#0e0e10]">
      <div className="flex items-center justify-between border-b border-[#1a1a1e] px-5 py-3.5">
        <h3 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-zinc-300">
          <Layers className="h-3.5 w-3.5 text-[#FF3F3F]" />
          <span>My Published Requirements</span>
        </h3>

        <span className="rounded-full border border-[#252529] bg-[#1a1a1e] px-2 py-0.5 text-[9px] font-bold text-zinc-400">
          {myPosts.length} posts
        </span>
      </div>

      {myPosts.length === 0 ? (
        <div className="p-12 text-center text-zinc-500">
          <p className="text-[12px] font-semibold text-zinc-400">
            No requirements published yet.
          </p>

          <p className="mt-1 text-[11px] text-zinc-600">
            Use "Post Requirement" to publish your first one.
          </p>
        </div>
      ) : (
        <div className="divide-y divide-[#161619]">
          {myPosts.map((post) => (
            <PublishedListingItem
              key={post.id ?? post._id}
              post={post}
              onUpdateStatus={onUpdateStatus}
              onDeleteListing={onDeleteListing}
              onSelectPost={onSelectPost}
              onViewOffers={onViewOffers}
            />
          ))}
        </div>
      )}
    </div>
  );
}

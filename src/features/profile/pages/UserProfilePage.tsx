import { useCallback, useEffect, useRef, useState } from "react";
import { apiFetch } from "@/src/shared/lib/api";
import { Post, ShowcaseItem, User } from "@/src/shared/types";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateProfile } from "@/src/store/authSlice";
import { useReputation } from "@/src/shared/hooks/useReputation";
import { useSeo } from "@/src/shared/hooks/useSeo";
import ProfileEditLayout from "@/src/features/profile/components/edit/ProfileEditLayout";
import ShowcaseDetailCard from "@/src/features/profile/components/showcase/ShowCaseDetailCard";
import { useParams, useSearchParams } from "react-router-dom";
import useRouteScreen from "@/src/shared/hooks/useRouteScreen";
import UserShowcase from "@/src/features/profile/components/showcase/UserShowCase";
import ProfileAnalytics from "@/src/features/profile/components/ProfileAnalytics";
import ProfileRecentPosts from "@/src/features/profile/components/ProfileRecentPosts";
import ProfileReviews from "@/src/features/profile/components/ProfileReviews";
import ProfileBadges from "@/src/features/profile/components/ProfileBadges";
import ProfileAbout from "@/src/features/profile/components/ProfileAbout";
import ProfileSkills from "@/src/features/profile/components/ProfileSkills";
import ProfileHeader from "@/src/features/profile/components/ProfileHeader";
import UserStats from "@/src/features/profile/components/UserStats";
import HighlightsSection from "../components/feed/HighlightsSection";
import { notifySuccess } from "@/src/shared/components/layout/ToastProvider";
import QuickFeedComposer from "../components/feed/QuickFeedComposer";

type TabId =
  | "about"
  | "badges"
  | "reviews"
  | "posts"
  | "highlights"
  | "analytics"
  | "showcase";

export const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "posts", label: "Posts" },
  { id: "highlights", label: "Highlights" },
  { id: "showcase", label: "Portfolio" },
  { id: "analytics", label: "Analytics" },
  { id: "badges", label: "Badges" },
  { id: "reviews", label: "Reviews" },
];

const TAB_DESCRIPTIONS: Record<TabId, string> = {
  about: "View profile details, skills, and an overview.",
  posts: "Browse requirements posted by this member.",
  highlights: "See quick updates and photo highlights.",
  showcase: "Explore portfolio work, projects, and services.",
  analytics: "Review your activity and profile performance.",
  badges: "See earned badges and reputation achievements.",
  reviews: "Read ratings and feedback from the community.",
};

interface ProfileViewProps {
  onUpdateProfile: (updated: User) => void;
  onLogout?: () => void;
}

export default function UserProfileView({
  onUpdateProfile,
  onLogout,
}: ProfileViewProps) {
  const dispatch = useAppDispatch();
  const authUser = useAppSelector((s) => s.auth.currentUser);
  const authUserId = authUser?.id;
  const { id } = useParams();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isProfileLoading, setIsProfileLoading] = useState(true);
  const editScreen = useRouteScreen("edit");
  const showcaseScreen = useRouteScreen("showcase");
  const highlightScreen = useRouteScreen("highlight");
  const [searchParams, setSearchParams] = useSearchParams();
  const initialEditSection = editScreen.value === "portfolio" ? "portfolio" : "basic";
  const [isOwner, setIsOwner] = useState(false);
  const activeTab = TABS.find((tab) => tab.id === searchParams.get("tab"))?.id ?? "about";
  const setActiveTab = (tab: TabId) => {
    const next = new URLSearchParams(searchParams);
    next.set("tab", tab);
    setSearchParams(next);
  };
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [postsTotal, setPostsTotal] = useState(0);
  const [loadingMorePosts, setLoadingMorePosts] = useState(false);
  const [postsLoadError, setPostsLoadError] = useState("");
  const postsPageAbortRef = useRef<AbortController | null>(null);
  const selectedShowCase = currentUser?.showcase?.items.find(
    (item) => (item.id ?? item._id) === showcaseScreen.value,
  ) ?? null;
  const [profileError, setProfileError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Profiles sit behind auth, so this is for the tab title — isNoIndexPath
  // keeps /profile out of the index either way.
  useSeo({
    title: currentUser?.name ? `${currentUser.name}'s Profile` : "Profile",
    type: "profile",
  });

  const {
    metric: signedInMetric,
    badges: signedInBadges,
    loading: reputationLoading,
  } = useReputation();
  const profileMetric =
    currentUser?.metric ?? (isOwner ? signedInMetric : null);
  const profileBadges =
    currentUser?.badges ?? (isOwner ? signedInBadges : []);
  const profileReputationLoading = isOwner ? reputationLoading : false;

  useEffect(() => {
    let cancelled = false;
    setIsProfileLoading(true);
    postsPageAbortRef.current?.abort();
    postsPageAbortRef.current = null;
    setLoadingMorePosts(false);
    setPostsLoadError("");

    const fetchCurrentUser = async () => {
      setProfileError("");
      try {
        const url = id ? `/api/profile/${id}` : `/api/profile`;
        const res = await apiFetch(url);

        if (!res.ok) {
          throw new Error("Unable to load this profile. Please try again.");
        }

        const data = await res.json();

        if (cancelled) return;
        setCurrentUser(data.user);
        setPosts(data?.user?.posts ?? []);
        setPostsTotal(data?.user?.postsTotal ?? data?.user?.posts?.length ?? 0);
        setIsOwner(id ? id === authUserId : true);
      } catch {
        if (!cancelled) {
          setProfileError("Unable to load this profile. Please try again.");
        }
      } finally {
        if (!cancelled) setIsProfileLoading(false);
      }
    };

    void fetchCurrentUser();
    return () => {
      cancelled = true;
      postsPageAbortRef.current?.abort();
      postsPageAbortRef.current = null;
    };
  }, [id, authUserId, retryCount]);

  const loadMorePosts = useCallback(async () => {
    if (loadingMorePosts || posts.length >= postsTotal) return;

    setLoadingMorePosts(true);
    setPostsLoadError("");
    const controller = new AbortController();
    postsPageAbortRef.current = controller;
    try {
      const endpoint = id
        ? `/api/profile/${encodeURIComponent(id)}/posts`
        : "/api/profile/posts";
      const res = await apiFetch(`${endpoint}?skip=${posts.length}&limit=10`, {
        signal: controller.signal,
      });
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Unable to load more posts.");
      }
      if (controller.signal.aborted) return;

      setPosts((current) => {
        const existingIds = new Set(current.map((post) => post.id ?? post._id));
        return [
          ...current,
          ...(data.posts ?? []).filter(
            (post: Post) => !existingIds.has(post.id ?? post._id),
          ),
        ];
      });
      setPostsTotal(data.total ?? postsTotal);
    } catch {
      if (controller.signal.aborted) return;
      setPostsLoadError("Could not load more posts. Please try again.");
    } finally {
      if (postsPageAbortRef.current === controller) {
        postsPageAbortRef.current = null;
        setLoadingMorePosts(false);
      }
    }
  }, [id, loadingMorePosts, posts.length, postsTotal]);

  const handleSave = async (
    updated: User,
    avatarFile: File | null,
    coverImageFile: File | null,
    removeAvatar: boolean,
    removeCoverImage: boolean,
  ) => {
    setIsSaving(true);
    setSaveError("");

    try {
      const formData = new FormData();
      const profile = updated as User & {
        about?: string;
        services?: string[];
        socialLinks?: Record<string, string | undefined>;
      };

      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverImageFile) formData.append("coverImage", coverImageFile);
      if (removeAvatar) formData.append("removeAvatar", "true");
      if (removeCoverImage) formData.append("removeCoverImage", "true");

      const scalarFields: Record<string, string> = {
        name: profile.name ?? "",
        role: profile.role ?? "",
        address: profile.address ?? "",
        bio: profile.bio ?? "",
        about: profile.about ?? "",
        phone: profile.phone ?? "",
        website: profile.website ?? "",
      };

      Object.entries(scalarFields).forEach(([field, value]) => {
        formData.append(field, value);
      });

      formData.append("skills", JSON.stringify(profile.skills ?? []));
      formData.append("services", JSON.stringify(profile.services ?? []));
      formData.append("socialLinks", JSON.stringify(profile.socialLinks ?? {}));

      const res = await apiFetch("/api/profile/update", {
        method: "PUT",
        body: formData,
      });

      if (res.status === 401) throw new Error("Session expired.");
      if (res.status === 403) throw new Error("Not authorised.");

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));

        throw new Error(
          (body as any)?.message || `Update failed (${res.status})`,
        );
      }

      const data: {
        success: boolean;
        user: Partial<User> & { id: string };
      } = await res.json();

      const persisted: User = {
        ...updated,
        ...data.user,
        id: data.user.id || updated.id,
      };

      let refreshedUser = persisted;
      try {
        const refreshUrl = id ? `/api/profile/${id}` : "/api/profile";
        const refreshResponse = await apiFetch(refreshUrl);

        if (refreshResponse.ok) {
          const refreshData = await refreshResponse.json();
          if (refreshData.user) {
            refreshedUser = {
              ...persisted,
              ...refreshData.user,
              id:
                refreshData.user.id ??
                refreshData.user._id ??
                persisted.id,
            };
            setPosts(refreshData.user.posts ?? []);
            setPostsTotal(
              refreshData.user.postsTotal ?? refreshData.user.posts?.length ?? 0,
            );
          }
        }
      } catch {
        // Keep the successful update response if refreshing the profile fails.
      }

      dispatch(updateProfile(refreshedUser));
      onUpdateProfile(refreshedUser);
      setCurrentUser(refreshedUser);
      editScreen.close();
      notifySuccess("Your profile has been updated.");
    } catch {
      setSaveError(
        "Unable to save your profile. Please check your connection and try again.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleFeedCreated = (item: ShowcaseItem) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;

      const nextItems = [item, ...(prev.showcase?.items ?? [])];

      return {
        ...prev,
        showcase: {
          ...prev.showcase,
          _id: prev.showcase?._id ?? "",
          items: nextItems,
        },
      };
    });
  };

  const handleFeedDeleted = (itemId: string) => {
    setCurrentUser((prev) => {
      if (!prev) return prev;

      return {
        ...prev,
        showcase: {
          ...prev.showcase,
          _id: prev.showcase?._id ?? "",
          items: (prev.showcase?.items ?? []).filter(
            (item) => (item.id ?? item._id) !== itemId,
          ),
        },
      };
    });
  };

  if (editScreen.value && currentUser && isOwner && !isProfileLoading) {
    return (
      <>
        {saveError && (
          <p
            role="alert"
            className="mb-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300"
          >
            {saveError}
          </p>
        )}
        <ProfileEditLayout
          user={currentUser}
          isSaving={isSaving}
          initialSection={initialEditSection}
          onSave={handleSave}
          onCancel={() => {
            setSaveError("");
            editScreen.close();
          }}
        />
      </>
    );
  }

  if (isProfileLoading) return <ProfileSkeleton />;

  if (!currentUser) {
    if (!profileError) return null;

    return (
      <div className="theme-card mx-auto mt-8 max-w-md rounded-xl border p-6 text-center">
        <p role="alert" className="theme-text-secondary text-sm">
          {profileError}
        </p>
        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="theme-btn-accent mt-4 rounded-lg px-4 py-2 text-sm font-semibold"
        >
          Retry
        </button>
      </div>
    );
  }

  if (showcaseScreen.value) {
    if (!selectedShowCase) {
      return (
        <section className="theme-text-primary mx-auto max-w-xl space-y-4 py-8">
          <p role="alert">This portfolio item or highlight is no longer available.</p>
          <button type="button" onClick={showcaseScreen.close}>Back to profile</button>
        </section>
      );
    }
    return <ShowcaseDetailCard item={selectedShowCase} open onClose={showcaseScreen.close} />;
  }

  if (highlightScreen.value && isOwner) {
    return (
      <section className="theme-panel mx-auto my-6 max-w-2xl rounded-xl border p-5">
        <button type="button" onClick={highlightScreen.close} className="theme-text-muted mb-4 text-sm">Back to profile</button>
        <h1 className="theme-text-primary mb-4 text-lg font-bold">Create a highlight</h1>
        <QuickFeedComposer onCreated={(item) => {
          handleFeedCreated(item);
          highlightScreen.close();
        }} />
      </section>
    );
  }

  const commonProps = {
    user: currentUser,
    metric: profileMetric,
    badges: profileBadges,
    repLoading: profileReputationLoading,
    posts,
    postsTotal,
    loadingMorePosts,
    postsLoadError,
    onLoadMorePosts: loadMorePosts,
    isOwner,
    activeTab,
    setActiveTab,
    onEdit: () => editScreen.open("basic"),
    onCreatePortfolioItems: () => editScreen.open("portfolio"),
    onSelectShowcase: (item: ShowcaseItem) => showcaseScreen.open(item.id ?? item._id),
    onFeedDeleted: handleFeedDeleted,
    onComposeHighlight: () => highlightScreen.open("create"),
  };

  return (
    <>
      <div className="hidden sm:block">
        <UserProfileDesktop {...commonProps} />
      </div>

      <div className="block sm:hidden">
        <UserProfileMobile {...commonProps} />
      </div>

    </>
  );
}

function ProfileSkeleton() {
  return (
    <div
      role="status"
      aria-busy="true"
      aria-label="Loading profile"
      className="theme-page-shell mx-auto w-full max-w-7xl animate-pulse space-y-4 pt-3"
    >
      <span className="sr-only">Loading profile</span>
      <section className="theme-panel overflow-hidden rounded-xl border sm:rounded-2xl">
        <div className="h-28 bg-white/5 sm:h-36" />
        <div className="flex items-end justify-between gap-4 px-4 pb-4 sm:px-6">
          <div className="-mt-8 flex min-w-0 items-end gap-3">
            <div className="h-16 w-16 shrink-0 rounded-full border-4 border-(--app-surface) bg-white/10 sm:h-20 sm:w-20" />
            <div className="space-y-2 pb-1">
              <div className="h-4 w-36 rounded bg-white/10 sm:w-48" />
              <div className="h-3 w-24 rounded bg-white/6 sm:w-32" />
            </div>
          </div>
          <div className="mb-1 h-9 w-24 rounded-lg bg-white/8" />
        </div>
        <div className="grid grid-cols-3 gap-3 border-t border-white/5 px-4 py-3 sm:px-6">
          <div className="h-8 rounded bg-white/5" />
          <div className="h-8 rounded bg-white/5" />
          <div className="h-8 rounded bg-white/5" />
        </div>
      </section>
      <section className="theme-panel-soft overflow-hidden rounded-xl border sm:rounded-2xl">
        <div className="flex gap-4 overflow-hidden border-b border-white/5 px-4 py-3">
          <div className="h-4 w-12 shrink-0 rounded bg-white/8" />
          <div className="h-4 w-12 shrink-0 rounded bg-white/5" />
          <div className="h-4 w-16 shrink-0 rounded bg-white/5" />
          <div className="h-4 w-14 shrink-0 rounded bg-white/5" />
          <div className="hidden h-4 w-12 shrink-0 rounded bg-white/5 sm:block" />
        </div>
        <div className="space-y-4 p-4 sm:p-6">
          <div className="h-4 w-28 rounded bg-white/8" />
          <div className="h-20 rounded-lg bg-white/5" />
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="h-24 rounded-lg bg-white/5" />
            <div className="h-24 rounded-lg bg-white/5" />
          </div>
        </div>
      </section>
    </div>
  );
}

interface UserProfileDesktopProps {
  user: User;
  metric: any;
  badges: any[];
  repLoading: boolean;
  posts: Post[];
  postsTotal: number;
  loadingMorePosts: boolean;
  postsLoadError: string;
  onLoadMorePosts: () => void;
  isOwner: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onEdit: () => void;
  onCreatePortfolioItems: () => void;
  onSelectShowcase: (item: any) => void;
  onFeedDeleted: (itemId: string) => void;
  onComposeHighlight: () => void;
}

function UserProfileDesktop({
  user,
  metric,
  badges,
  repLoading,
  posts,
  postsTotal,
  loadingMorePosts,
  postsLoadError,
  onLoadMorePosts,
  isOwner,
  activeTab,
  setActiveTab,
  onEdit,
  onCreatePortfolioItems,
  onSelectShowcase,
  onFeedDeleted,
  onComposeHighlight,
}: UserProfileDesktopProps) {
  const visibleTabs = isOwner
    ? TABS
    : TABS.filter((tab) => tab.id !== "analytics");

  return (
    <div className="theme-page-shell mx-auto w-full space-y-4 pt-3">
      <div className="theme-panel flex flex-col overflow-hidden rounded-2xl border">
        <ProfileHeader
          user={user}
          metric={metric}
          isOwner={isOwner}
          onEdit={onEdit}
          trustScore={user?.metric?.trustScore ?? 0}
        />

        <div className="p-2.5">
          <UserStats
            metric={metric ?? user?.metric}
            isOwner={isOwner}
            myPostsCount={postsTotal}
            onMyPosts={() => setActiveTab("posts")}
            onApplications={() => setActiveTab("reviews")}
            onSavedPosts={() => setActiveTab("badges")}
            onAnalytics={() => setActiveTab("analytics")}
          />
        </div>
      </div>

      <section className="theme-panel-soft overflow-hidden rounded-2xl border border-[#1e1e22]  shadow-[0_0_0_1px_rgba(255,255,255,0.02)] mb-3">
        <div className=" overflow-x-auto border-b border-[#1e1e22] px-2">
          <nav className="flex gap-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={TAB_DESCRIPTIONS[tab.id]}
                aria-label={`${tab.label}: ${TAB_DESCRIPTIONS[tab.id]}`}
                className={`whitespace-nowrap px-4 py-3 text-xs font-semibold transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#FF3F3F] text-white"
                    : "text-zinc-500 hover:text-zinc-300"
                }`}
              >
                {tab.label}

                {tab.id === "badges" && badges.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] text-zinc-500">
                    {badges.length}
                  </span>
                )}

                {tab.id === "posts" && postsTotal > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] text-zinc-500">
                    {postsTotal}
                  </span>
                )}

                {tab.id === "reviews" &&
                  metric?.reviewMetrics?.totalReviews > 0 && (
                    <span className="ml-1.5 rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] text-zinc-500">
                      {metric.reviewMetrics.totalReviews}
                    </span>
                  )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-4">
          {activeTab === "about" &&
            (isOwner ? (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-4">
                  <ProfileAbout user={user} />

                  <ProfileAnalytics
                    metric={metric ?? user?.metric ?? null}
                    defaultExpanded
                  />
                </div>

                <div className="col-span-5 flex flex-col gap-4">
                  <ProfileReviews
                    userId={user.id}
                    metric={metric}
                    metricLoading={repLoading}
                    compact
                    defaultExpanded
                  />

                  <ProfileSkills user={user} />

                  <ProfileBadges
                    badges={badges}
                    loading={repLoading}
                    compact
                    defaultExpanded
                  />

                  <ProfileRecentPosts
                    posts={posts}
                    total={postsTotal}
                    isOwner={isOwner}
                    compact
                    defaultExpanded
                    onLoadMore={onLoadMorePosts}
                    hasMore={posts.length < postsTotal}
                    loadingMore={loadingMorePosts}
                    loadMoreError={postsLoadError}
                    // onViewAll={() => setActiveTab("posts")}
                  />
                  <HighlightsSection
                    items={(user.showcase?.items ?? []).filter(
                      (item) => item.type === "feed",
                    )}
                    isOwner={isOwner}
                    compact
                    onCompose={onComposeHighlight}
                    onDeleted={onFeedDeleted}
                    onSelect={onSelectShowcase}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-4">
                  <ProfileAbout user={user} />

                  <ProfileRecentPosts
                    posts={posts}
                    total={postsTotal}
                    isOwner={isOwner}
                    compact
                    defaultExpanded
                    onLoadMore={onLoadMorePosts}
                    hasMore={posts.length < postsTotal}
                    loadingMore={loadingMorePosts}
                    loadMoreError={postsLoadError}
                    // onViewAll={() => setActiveTab("posts")}
                  />
                </div>

                <div className="col-span-5 flex flex-col gap-4">
                  <ProfileReviews
                    userId={user.id}
                    metric={metric}
                    metricLoading={repLoading}
                    compact
                    defaultExpanded
                  />

                  <ProfileSkills user={user} />

                  <ProfileBadges
                    badges={badges}
                    loading={repLoading}
                    compact
                    defaultExpanded
                  />
                </div>
              </div>
            ))}

          {activeTab === "badges" && (
            <ProfileBadges badges={badges} loading={repLoading} />
          )}

          {activeTab === "reviews" && (
            <ProfileReviews
              userId={user.id}
              metric={metric}
              metricLoading={repLoading}
            />
          )}

          {activeTab === "posts" && (
            <ProfileRecentPosts
              posts={posts}
              total={postsTotal}
              isOwner={isOwner}
              showAll
              onLoadMore={onLoadMorePosts}
              hasMore={posts.length < postsTotal}
              loadingMore={loadingMorePosts}
              loadMoreError={postsLoadError}
            />
          )}

          {activeTab === "analytics" && isOwner && (
            <ProfileAnalytics metric={metric ?? user?.metric ?? null} />
          )}

          {activeTab === "highlights" && (
            <HighlightsSection
              items={(user.showcase?.items ?? []).filter(
                (item) => item.type === "feed",
              )}
              isOwner={isOwner}
              onCompose={onComposeHighlight}
              onDeleted={onFeedDeleted}
              onSelect={onSelectShowcase}
            />
          )}

          {activeTab === "showcase" && (
            <UserShowcase
              items={(user.showcase?.items ?? []).filter(
                (item) => item.type !== "feed",
              )}
              isOwner={isOwner}
              onAdd={onCreatePortfolioItems}
              onSelect={onSelectShowcase}
            />
          )}
        </div>
      </section>
    </div>
  );
}

interface UserProfileMobileProps {
  user: User;
  metric: any;
  badges: any[];
  repLoading: boolean;
  posts: Post[];
  postsTotal: number;
  loadingMorePosts: boolean;
  postsLoadError: string;
  onLoadMorePosts: () => void;
  isOwner: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onEdit: () => void;
  onCreatePortfolioItems: () => void;
  onSelectShowcase: (item: any) => void;
  onFeedDeleted: (itemId: string) => void;
  onComposeHighlight: () => void;
}

function UserProfileMobile({
  user,
  metric,
  badges,
  repLoading,
  posts,
  postsTotal,
  loadingMorePosts,
  postsLoadError,
  onLoadMorePosts,
  isOwner,
  activeTab,
  setActiveTab,
  onEdit,
  onCreatePortfolioItems,
  onSelectShowcase,
  onFeedDeleted,
  onComposeHighlight,
}: UserProfileMobileProps) {
  const visibleTabs = isOwner
    ? TABS
    : TABS.filter((tab) => tab.id !== "analytics");

  return (
    <div className="theme-page-shell w-full space-y-3 pt-2">
      <div className="theme-panel overflow-hidden rounded-xl border">
        <ProfileHeader
          user={user}
          metric={metric}
          isOwner={isOwner}
          onEdit={onEdit}
          trustScore={user?.metric?.trustScore ?? 0}
        />

        <div className="p-2">
          <UserStats
            metric={metric ?? user?.metric}
            isOwner={isOwner}
            myPostsCount={postsTotal}
            onMyPosts={() => setActiveTab("posts")}
            onApplications={() => setActiveTab("reviews")}
            onSavedPosts={() => setActiveTab("badges")}
            onAnalytics={() => setActiveTab("analytics")}
          />
        </div>
      </div>

      <section className="theme-panel-soft overflow-hidden rounded-xl border border-[#1e1e22] bg-[#0e0e10]">
        {/* Mobile horizontal tab slider */}
        <div className="overflow-x-auto border-b border-[#1e1e22] px-1 scrollbar-none">
          <nav className="flex min-w-max gap-0.5">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={TAB_DESCRIPTIONS[tab.id]}
                aria-label={`${tab.label}: ${TAB_DESCRIPTIONS[tab.id]}`}
                className={`whitespace-nowrap px-3 py-2.5 text-[10px] font-semibold transition ${
                  activeTab === tab.id
                    ? "border-b-2 border-[#FF3F3F] text-white"
                    : "text-zinc-500"
                }`}
              >
                {tab.label}

                {tab.id === "badges" && badges.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#1e1e22] px-1 py-0.5 text-[8px] text-zinc-500">
                    {badges.length}
                  </span>
                )}

                {tab.id === "posts" && postsTotal > 0 && (
                  <span className="ml-1 rounded-full bg-[#1e1e22] px-1 py-0.5 text-[8px] text-zinc-500">
                    {postsTotal}
                  </span>
                )}

                {tab.id === "reviews" &&
                  metric?.reviewMetrics?.totalReviews>0 && (
                    <span className="ml-1 rounded-full bg-[#1e1e22] px-1 py-0.5 text-[8px] text-zinc-500">
                      {metric.reviewMetrics.totalReviews}
                    </span>
                  )}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-2.5">
          {activeTab === "about" && (
            <div className="flex flex-col gap-3">
              <ProfileAbout user={user} />

              <ProfileSkills user={user} />

              <ProfileRecentPosts
                posts={posts}
                total={postsTotal}
                isOwner={isOwner}
                compact
                defaultExpanded
                onLoadMore={onLoadMorePosts}
                hasMore={posts.length < postsTotal}
                loadingMore={loadingMorePosts}
                loadMoreError={postsLoadError}
                // onViewAll={() => setActiveTab("posts")}
              />
            </div>
          )}

          {activeTab === "badges" && (
            <ProfileBadges badges={badges} loading={repLoading} />
          )}

          {activeTab === "reviews" && (
            <ProfileReviews
              userId={user.id}
              metric={metric}
              metricLoading={repLoading}
            />
          )}

          {activeTab === "posts" && (
            <ProfileRecentPosts
              posts={posts}
              total={postsTotal}
              isOwner={isOwner}
              showAll
              onLoadMore={onLoadMorePosts}
              hasMore={posts.length < postsTotal}
              loadingMore={loadingMorePosts}
              loadMoreError={postsLoadError}
            />
          )}

          {activeTab === "analytics" && isOwner && (
            <ProfileAnalytics metric={metric ?? user?.metric ?? null} />
          )}

          {activeTab === "highlights" && (
            <HighlightsSection
              items={(user.showcase?.items ?? []).filter(
                (item) => item.type === "feed",
              )}
              isOwner={isOwner}
              onCompose={onComposeHighlight}
              onDeleted={onFeedDeleted}
              onSelect={onSelectShowcase}
            />
          )}

          {activeTab === "showcase" && (
            <UserShowcase
              items={(user.showcase?.items ?? []).filter(
                (item) => item.type !== "feed",
              )}
              isOwner={isOwner}
              onAdd={onCreatePortfolioItems}
              onSelect={onSelectShowcase}
            />
          )}
        </div>
      </section>
    </div>
  );
}

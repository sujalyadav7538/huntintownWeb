import { useEffect, useState } from "react";
import { apiFetch } from "@/src/shared/lib/api";
import { Post, User } from "@/src/shared/types";
import { useAppDispatch, useAppSelector } from "@/src/store/hooks";
import { updateProfile } from "@/src/store/authSlice";
import { useReputation } from "@/src/shared/hooks/useReputation";
import { useSeo } from "@/src/shared/hooks/useSeo";
import ProfileEditLayout from "@/src/features/profile/components/edit/ProfileEditLayout";
import ShowcaseDetailCard from "@/src/features/profile/components/showcase/ShowCaseDetailCard";
import { useParams } from "react-router-dom";
import UserShowcase from "@/src/features/profile/components/showcase/UserShowCase";
import ProfileAnalytics from "@/src/features/profile/components/ProfileAnalytics";
import ProfileRecentPosts from "@/src/features/profile/components/ProfileRecentPosts";
import ProfileReviews from "@/src/features/profile/components/ProfileReviews";
import ProfileBadges from "@/src/features/profile/components/ProfileBadges";
import ProfileAbout from "@/src/features/profile/components/ProfileAbout";
import ProfileSkills from "@/src/features/profile/components/ProfileSkills";
import ProfileHeader from "@/src/features/profile/components/ProfileHeader";
import UserStats from "@/src/features/profile/components/UserStats";

type TabId =
  | "about"
  | "badges"
  | "reviews"
  | "posts"
  | "analytics"
  | "showcase";

export const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "posts", label: "Posts" },
  { id: "showcase", label: "ShowCase" },
  { id: "analytics", label: "Analytics" },
  { id: "badges", label: "Badges" },
  { id: "reviews", label: "Reviews" },
];

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
  const { id } = useParams();

  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isOwner, setIsOwner] = useState(false);
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedShowCase, setSelectedShowCase] = useState<any>(null);
  const [profileError, setProfileError] = useState("");
  const [saveError, setSaveError] = useState("");
  const [retryCount, setRetryCount] = useState(0);

  // Profiles sit behind auth, so this is for the tab title — isNoIndexPath
  // keeps /profile out of the index either way.
  useSeo({
    title: currentUser?.name ? `${currentUser.name}'s Profile` : "Profile",
    type: "profile",
  });


  const { metric, badges, loading: repLoading } = useReputation();

  useEffect(() => {
    let cancelled = false;

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
        setIsOwner(id ? id === authUser?.id : true);
      } catch {
        if (!cancelled) {
          setProfileError("Unable to load this profile. Please try again.");
        }
      }
    };

    void fetchCurrentUser();
    return () => {
      cancelled = true;
    };
  }, [id, authUser, retryCount]);

  const handleSave = async (
    updated: User,
    avatarFile: File | null,
    coverImageFile: File | null,
    removeAvatar: boolean,
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

      dispatch(updateProfile(persisted));
      onUpdateProfile(persisted);
      setCurrentUser(persisted);
      setMode("view");
    } catch {
      setSaveError("Unable to save your profile. Please check your connection and try again.");
    } finally {
      setIsSaving(false);
    }
  };

  if (mode === "edit" && currentUser) {
    return (
      <>
        {saveError && (
          <p role="alert" className="mb-3 rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-300">
            {saveError}
          </p>
        )}
        <ProfileEditLayout
          user={currentUser}
          isSaving={isSaving}
          onSave={handleSave}
          onCancel={() => {
            setSaveError("");
            setMode("view");
          }}
        />
      </>
    );
  }

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

  const commonProps = {
    user: currentUser,
    metric,
    badges,
    repLoading,
    posts,
    isOwner,
    activeTab,
    setActiveTab,
    onEdit: () => setMode("edit"),
    onSelectShowcase: (item: any) => setSelectedShowCase(item),
  };

  return (
    <>
      <div className="hidden sm:block">
        <UserProfileDesktop {...commonProps} />
      </div>

      <div className="block sm:hidden">
        <UserProfileMobile {...commonProps} />
      </div>

      <ShowcaseDetailCard
        item={selectedShowCase}
        open={!!selectedShowCase}
        onClose={() => setSelectedShowCase(null)}
      />
    </>
  );
}

interface UserProfileDesktopProps {
  user: User;
  metric: any;
  badges: any[];
  repLoading: boolean;
  posts: Post[];
  isOwner: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onEdit: () => void;
  onSelectShowcase: (item: any) => void;
}

function UserProfileDesktop({
  user,
  metric,
  badges,
  repLoading,
  posts,
  isOwner,
  activeTab,
  setActiveTab,
  onEdit,
  onSelectShowcase,
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
            myPostsCount={posts.length}
            onMyPosts={() => setActiveTab("posts")}
            onApplications={() => setActiveTab("reviews")}
            onSavedPosts={() => setActiveTab("badges")}
            onAnalytics={() => setActiveTab("analytics")}
          />
        </div>
      </div>

      <section className="theme-panel-soft overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#0e0e10] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        <div className="theme-divider overflow-x-auto border-b border-[#1e1e22] px-2">
          <nav className="flex gap-1">
            {visibleTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
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

                {tab.id === "posts" && posts.length > 0 && (
                  <span className="ml-1.5 rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] text-zinc-500">
                    {posts.length}
                  </span>
                )}

                {tab.id === "reviews" &&
                  metric?.reviewMetrics?.totalReviews && (
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
                    total={posts.length}
                    isOwner={isOwner}
                    compact
                    defaultExpanded
                    // onViewAll={() => setActiveTab("posts")}
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-7 flex flex-col gap-4">
                  <ProfileAbout user={user} />

                  <ProfileRecentPosts
                    posts={posts}
                    total={posts.length}
                    isOwner={isOwner}
                    compact
                    defaultExpanded
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
              total={posts.length}
              isOwner={isOwner}
              showAll
            />
          )}

          {activeTab === "analytics" && isOwner && (
            <ProfileAnalytics metric={metric ?? user?.metric ?? null} />
          )}

          {activeTab === "showcase"  && (
            <UserShowcase
              items={user.showcase?.items ?? []}
              isOwner={isOwner}
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
  isOwner: boolean;
  activeTab: TabId;
  setActiveTab: (tab: TabId) => void;
  onEdit: () => void;
  onSelectShowcase: (item: any) => void;
}

function UserProfileMobile({
  user,
  metric,
  badges,
  repLoading,
  posts,
  isOwner,
  activeTab,
  setActiveTab,
  onEdit,
  onSelectShowcase,
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
            myPostsCount={posts.length}
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

                {tab.id === "posts" && posts.length > 0 && (
                  <span className="ml-1 rounded-full bg-[#1e1e22] px-1 py-0.5 text-[8px] text-zinc-500">
                    {posts.length}
                  </span>
                )}

                {tab.id === "reviews" &&
                  metric?.reviewMetrics?.totalReviews && (
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
                total={posts.length}
                isOwner={isOwner}
                compact
                defaultExpanded
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
              total={posts.length}
              isOwner={isOwner}
              showAll
            />
          )}

          {activeTab === "analytics" && isOwner && (
            <ProfileAnalytics metric={metric ?? user?.metric ?? null} />
          )}

          {activeTab === "showcase"  && (
            <UserShowcase
              items={user.showcase?.items ?? []}
              isOwner={isOwner}
              onSelect={onSelectShowcase}
            />
          )}
        </div>
      </section>
    </div>
  );
}

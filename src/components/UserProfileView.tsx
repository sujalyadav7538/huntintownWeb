import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Post, User } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile } from "../store/authSlice";
import { useReputation } from "../hooks/useReputation";
import ProfileEditLayout from "./profile/ProfileEditLayout";
import ShowcaseDetailCard from "./profile/ShowCaseDetailCard";
import { useParams } from "react-router-dom";
import UserShowcase from "./profile/UserShowCase";
import ProfileAnalytics from "./profile/ProfileAnalytics";
import ProfileRecentPosts from "./profile/ProfileRecentPosts";
import ProfileReviews from "./profile/ProfileReviews";
import ProfileBadges from "./profile/ProfileBadges";
import ProfileAbout from "./profile/ProfileAbout";
import ProfileSkills from "./profile/ProfileSkills";
import ProfileHeader from "./profile/ProfileHeader";
import UserStats from "./profile/UserStats";

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

  const { metric, badges, loading: repLoading } = useReputation();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const url = id ? `/api/profile/${id}` : `/api/profile`;
        const res = await apiFetch(url);

        if (!res.ok) {
          throw new Error("Failed to fetch user profile");
        }

        const data = await res.json();

        setCurrentUser(data.user);
        setPosts(data?.user?.posts ?? []);
        setIsOwner(id ? id === authUser?.id : true);
      } catch (error) {
        console.error(error);
      }
    };

    fetchCurrentUser();
  }, [id, authUser]);

  const handleSave = async (
    updated: User,
    avatarFile: File | null,
    coverImageFile: File | null,
  ) => {
    setIsSaving(true);

    try {
      const formData = new FormData();
      const profile = updated as User & {
        about?: string;
        services?: string[];
        socialLinks?: Record<string, string | undefined>;
      };

      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverImageFile) formData.append("coverImage", coverImageFile);

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
    } finally {
      setIsSaving(false);
    }
  };

  if (mode === "edit" && currentUser) {
    return (
      <ProfileEditLayout
        user={currentUser}
        isSaving={isSaving}
        onSave={handleSave}
        onCancel={() => setMode("view")}
      />
    );
  }

  if (!currentUser) return null;

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
                    userId={user.id}
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
                    userId={user.id}
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
              userId={user.id}
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
                userId={user.id}
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
              userId={user.id}
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

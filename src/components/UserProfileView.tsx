import { useEffect, useState } from "react";
import { apiFetch } from "../lib/api";
import { Post, User } from "../types";
import { useAppDispatch, useAppSelector } from "../store/hooks";
import { updateProfile } from "../store/authSlice";
import { useReputation } from "../hooks/useReputation";

import ProfileHeader from "./profile/ProfileHeader";
import ProfileAbout from "./profile/ProfileAbout";
import ProfileSkills from "./profile/ProfileSkills";
import ProfileBadges from "./profile/ProfileBadges";
import ProfileReviews from "./profile/ProfileReviews";
import ProfileRecentPosts from "./profile/ProfileRecentPosts";
import ProfileEditLayout from "./profile/ProfileEditLayout";
import UserStats from "./profile/UserStats";
import ProfileAnalytics from "./profile/ProfileAnalytics";
import { useNavigate, useParams } from "react-router-dom";

type TabId = "about" | "badges" | "reviews" | "posts" | "analytics";

const TABS: { id: TabId; label: string }[] = [
  { id: "about", label: "About" },
  { id: "badges", label: "Badges" },
  { id: "reviews", label: "Reviews" },
  { id: "posts", label: "Posts" },
  { id: "analytics", label: "Analytics" },
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const authUser = useAppSelector((s) => s.auth.currentUser);
  const id = useParams().id;

  const navigate = useNavigate();

  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isOwner, setIsOwner] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<TabId>("about");
  const [isSaving, setIsSaving] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const { metric, badges, loading: repLoading } = useReputation();
  const visibleTabs = isOwner ? TABS : TABS.filter((t) => t.id !== "analytics");

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        if (id) {
          const res = await apiFetch(`/api/profile/${id}`);
          if (!res.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await res.json();
          setCurrentUser(data.user);
          setPosts(data?.user?.posts ?? []);

          setIsOwner(id === authUser?.id);
        } else {
          const res = await apiFetch(`/api/profile`);
          if (!res.ok) {
            throw new Error("Failed to fetch user profile");
          }
          const data = await res.json();
          setCurrentUser(data.user);
          setPosts(data?.user?.posts ?? []);
          setIsOwner(true);
        }
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
      if (avatarFile) formData.append("avatar", avatarFile);
      if (coverImageFile) formData.append("coverImage", coverImageFile);
      formData.append("name", updated.name ?? "");
      formData.append("role", updated.role ?? "");
      formData.append("address", updated.address ?? "");
      formData.append("bio", updated.bio ?? "");
      formData.append("skills", JSON.stringify(updated.skills ?? []));

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

      const data: { success: boolean; user: Partial<User> & { id: string } } =
        await res.json();
      const persisted: User = {
        ...updated,
        ...data.user,
        id: data.user.id || updated.id,
      };
      dispatch(updateProfile(persisted));
      onUpdateProfile(persisted);
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

  return (
    <div className="theme-page-shell mx-auto w-full space-y-4  pt-3">
      {/* ── Hero header ── */}
      <div className="theme-panel overflow-hidden rounded-2xl border flex flex-col ">
        <ProfileHeader
          user={currentUser}
          metric={metric}
          isOwner={isOwner}
          onEdit={() => setMode("edit")}
          trustScore={currentUser?.metric?.trustScore ?? 0}
        />
        <div className="p-2.5">
          <UserStats
            metric={metric ?? currentUser?.metric}
            isOwner={isOwner}
            myPostsCount={posts?.length}
            onMyPosts={() => setActiveTab("posts")}
            onApplications={() => setActiveTab("reviews")}
            onSavedPosts={() => setActiveTab("badges")}
            onAnalytics={() => setActiveTab("analytics")}
          />
        </div>
      </div>

      {/* Main Content */}
      <section className="theme-panel-soft overflow-hidden rounded-2xl border border-[#1e1e22] bg-[#0e0e10] shadow-[0_0_0_1px_rgba(255,255,255,0.02)]">
        {/* ── Tab bar (desktop) ── */}
        <div className="theme-divider  overflow-x-auto border-b border-[#1e1e22] px-2 sm:block">
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
                {tab.id === "reviews" && metric?.reviewMetrics?.totalReviews ? (
                  <span className="ml-1.5 rounded-full bg-[#1e1e22] px-1.5 py-0.5 text-[9px] text-zinc-500">
                    {metric.reviewMetrics.totalReviews}
                  </span>
                ) : null}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-3 sm:p-4">
          {/* ABOUT TAB — 2-col desktop, stacked mobile */}
          {activeTab === "about" && (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-12">
              <div className="flex flex-col gap-4 sm:col-span-7">
                <ProfileAbout user={currentUser} />
                <ProfileAnalytics
                  metric={metric ?? currentUser?.metric ?? null}
                  defaultExpanded
                />
              </div>

              <div className="flex flex-col gap-4 sm:col-span-5">
                <ProfileReviews
                  userId={currentUser._id ?? currentUser.id}
                  metric={metric}
                  metricLoading={repLoading}
                  compact
                  defaultExpanded
                />
                <ProfileSkills user={currentUser} />
                <ProfileRecentPosts
                  posts={posts}
                  total={posts.length}
                  isOwner={isOwner}
                  compact
                  defaultExpanded
                  userId={currentUser._id ?? currentUser.id}
                />
              </div>

              <ProfileBadges
                badges={badges}
                loading={repLoading}
                compact
                defaultExpanded
              />
            </div>
          )}

          {activeTab === "badges" && (
            <ProfileBadges badges={badges} loading={repLoading} />
          )}

          {activeTab === "reviews" && (
            <ProfileReviews
              userId={currentUser._id ?? currentUser.id}
              metric={metric}
              metricLoading={repLoading}
            />
          )}

          {activeTab === "posts" && (
            <ProfileRecentPosts
              posts={posts}
              total={posts.length}
              isOwner={isOwner}
              userId={currentUser._id ?? currentUser.id}
            />
          )}

          {activeTab === "analytics" && isOwner && (
            <ProfileAnalytics metric={metric ?? currentUser?.metric ?? null} />
          )}
        </div>
      </section>
    </div>
  );
}

import { useState } from "react";
import { apiFetch } from "../lib/api";
import { User } from "../types";
import { useAppSelector, useAppDispatch } from "../store/hooks";
import { updateProfile, logout } from "../store/authSlice";
import { LogOut, Shield, Activity, Star, User as UserIcon } from "lucide-react";
import { useReputation } from "../hooks/useReputation";

import ProfileHero from "./profile/ProfileHero";
import ProfileAbout from "./profile/ProfileAbout";
import ProfileSkills from "./profile/ProfileSkills";
import ProfileAchievements from "./profile/ProfileAchievements";
import ProfileReviews from "./profile/ProfileReviews";
import ProfileEditLayout from "./profile/ProfileEditLayout";
import ProfileMetricCard from "./profile/ProfileMetricCard";
import ProfileStats from "./profile/ProfileStats";
import {
  commonMetrics,
  helperMetrics,
  hunterMetrics,
  trustMetrics,
} from "../data";

interface ProfileViewProps {
  onUpdateProfile: (updated: User) => void;
  onLogout?: () => void;
}

export default function ProfileView({
  onUpdateProfile,
  onLogout,
}: ProfileViewProps) {
  const dispatch = useAppDispatch();
  const currentUser = useAppSelector((s) => s.auth.currentUser);
  const [mode, setMode] = useState<"view" | "edit">("view");
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [activeMetricTab, setActiveMetricTab] = useState<"helper" | "hunter">(
    "helper",
  );

  const {
    metric,
    badges,
    loading: repLoading,
    error: repError,
    reload: reloadRep,
  } = useReputation();

  /**
   * Submits the profile via multipart/form-data.
   * avatarFile / coverImageFile are raw files picked by the user, or null if unchanged.
   * After a successful response Cloudinary URLs from the backend are used.
   */
  const handleSave = async (
    updated: User,
    avatarFile: File | null,
    coverImageFile: File | null,
  ) => {
    setSaveError(null);
    setIsSaving(true);

    try {
      const token = localStorage.getItem("access_token");

      const formData = new FormData();
      if (avatarFile) {
        formData.append("avatar", avatarFile);
      }
      if (coverImageFile) {
        formData.append("coverImage", coverImageFile);
      }
      formData.append("name", updated.name ?? "");
      formData.append("role", updated.role ?? "");
      formData.append("address", updated.address ?? "");
      formData.append("bio", updated.bio ?? "");
      formData.append("skills", JSON.stringify(updated.skills ?? []));

      // DO NOT set Content-Type — the browser sets it automatically with the
      // correct multipart boundary when body is FormData.
      const res = await apiFetch("/api/profile/update", {
        method: "PUT",
        headers: {
          Authorization: `${token}`,
        },
        body: formData,
      });

      if (res.status === 401)
        throw new Error("Session expired. Please sign in again.");
      if (res.status === 403)
        throw new Error("You are not authorised to update this profile.");
      if (!res.ok) {
        const errBody = await res.json().catch(() => ({}));
        throw new Error(
          (errBody as any)?.message || `Update failed (${res.status})`,
        );
      }

      const data: { success: boolean; user: Partial<User> & { id: string } } =
        await res.json();

      // Merge backend user (contains Cloudinary avatar URL) over the local draft
      const persisted: User = {
        ...updated,
        ...data.user,
        // Ensure id is never lost
        id: data.user.id || updated.id,
      };

      dispatch(updateProfile(persisted));
      onUpdateProfile(persisted);
      setMode("view");
      reloadRep(); // refresh metrics after profile update
    } catch (err: unknown) {
      setSaveError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    onLogout?.();
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
    <div className="relative min-h-screen bg-[#171717]  ">
      <ProfileHero
        user={currentUser}
        metric={metric}
        isOwner
        onEdit={() => setMode("edit")}
      />

      {/* HERO */}

      {/* BODY */}

      <div className="grid grid-cols-12 gap-8 items-start sm:px-2">
        {/* RIGHT COLUMN */}
        <div className="col-span-12 lg:col-span-8 flex flex-col gap-8">
          <ProfileAbout user={currentUser} />
          <div className="relative h-px w-full bg-linear-to-r from-transparent via-red-500/20 to-transparent" />

          <ProfileSkills user={currentUser} />
          <div className="relative h-px w-full bg-linear-to-r from-transparent via-red-500/20 to-transparent" />

          <ProfileAchievements
            badges={badges}
            loading={repLoading}
            error={repError}
          />
          <div className="sm:hidden relative h-px w-full bg-linear-to-r from-transparent via-red-500/20 to-transparent" />
        </div>

        {/* LEFT COLUMN */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          {/* Always Visible */}

          {/*  Trust Score */}
          {trustMetrics.map((data, index) => (
            <ProfileMetricCard
              key={index}
              title={data.title}
              value={
                typeof data.value === "function"
                  ? data.value(metric)
                  : data.value
              }
              subtitle={data.subtitle}
              icon={data.icon}
              color={data.color}
              progress={
                typeof data.progress === "function"
                  ? data.progress(metric)
                  : data.progress
              }
              size={data.size}
              showProgress={data.showProgress}
              trend={data?.trend}
              badge={
                typeof data.badge === "function"
                  ? data.badge(metric)
                  : undefined
              }
              className={data?.className ?? ""}
            />
          ))}

          <div className="grid grid-cols-2 gap-4">
            {commonMetrics.map((data, index) => (
              <ProfileMetricCard
                key={index}
                title={data.title}
                value={
                  typeof data.value === "function"
                    ? data.value(metric)
                    : data.value
                }
                subtitle={data.subtitle}
                icon={data.icon}
                color={data.color}
                progress={
                  typeof data.progress === "function"
                    ? data.progress(metric)
                    : data.progress
                }
                size={data.size}
                showProgress={data.showProgress}
                trend={data?.trend}
                className={data?.className ?? ""}
              />
            ))}
          </div>

          {/* Metric Tabs */}
          <div className="rounded-2xl border border-[#232327] bg-[#111113] p-2">
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => setActiveMetricTab("helper")}
                className={`rounded-xl py-2 text-xs font-semibold transition ${
                  activeMetricTab === "helper"
                    ? "bg-[#FF3F3F] text-white"
                    : "text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Helper
              </button>

              <button
                onClick={() => setActiveMetricTab("hunter")}
                className={`rounded-xl py-2 text-xs font-semibold transition ${
                  activeMetricTab === "hunter"
                    ? "bg-[#FF3F3F] text-white"
                    : "text-zinc-400 hover:bg-zinc-800"
                }`}
              >
                Hunter
              </button>
            </div>
          </div>

          {/* Selected Metrics */}
          <div className="grid grid-cols-2 gap-4">
            {(activeMetricTab === "helper" ? helperMetrics : hunterMetrics).map(
              (data, index) => (
                <ProfileMetricCard
                  key={index}
                  title={data.title}
                  value={
                    typeof data.value === "function"
                      ? data.value(metric)
                      : data.value
                  }
                  subtitle={data.subtitle}
                  icon={data.icon}
                  color={data.color}
                  progress={
                    typeof data.progress === "function"
                      ? data.progress(metric)
                      : data.progress
                  }
                  size={data.size}
                  showProgress={data.showProgress}
                  trend={data?.trend}
                  className={data?.className ?? ""}
                />
              ),
            )}
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <div className="hidden lg:flex justify-end">
        <button
          onClick={handleLogout}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#FF3F3F] text-white font-semibold hover:bg-[#e63939] transition"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}

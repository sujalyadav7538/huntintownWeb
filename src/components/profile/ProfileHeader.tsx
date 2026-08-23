import { User, UserMetric } from "../../types";
import {
  MapPin,
  Edit3,
  Settings,
  MessageSquare,
  UserPlus,
  CheckCircle2,
  Shield,
  MoreHorizontal,
  ArrowLeft,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";

interface ProfileHeaderProps {
  user: User;
  metric: UserMetric | null;
  isOwner: boolean;

  onEdit: () => void;
  onMessage?: () => void;
  onFollow?: () => void;
  onBack?: () => void;
  trustScore?: number;
}

export default function ProfileHeader({
  user,
  metric,
  isOwner,
  onEdit,
  onMessage,
  onFollow,
  onBack,
  trustScore,
}: ProfileHeaderProps) {
  /*
   * Backend trustScore currently appears to be on a 0-100 scale
   * in the profile design.
   */
  const resolvedTrustScore =
    typeof trustScore === "number" ? trustScore : (metric?.trustScore ?? 0);
  const safeTrustScore = Number.isFinite(resolvedTrustScore)
    ? Math.max(0, Math.min(100, resolvedTrustScore))
    : 0;

  const trustLabel =
    safeTrustScore >= 90
      ? "Highly Trusted"
      : safeTrustScore >= 75
        ? "Trusted"
        : safeTrustScore >= 55
          ? "Moderate Trust"
          : "Building Trust";

  const trustColor =
    safeTrustScore >= 90
      ? "text-emerald-400"
      : safeTrustScore >= 75
        ? "text-lime-400"
        : safeTrustScore >= 55
          ? "text-amber-400"
          : "theme-text-muted";

  const trustBorder =
    safeTrustScore >= 90
      ? "border-emerald-500/20"
      : safeTrustScore >= 75
        ? "border-lime-500/20"
        : safeTrustScore >= 55
          ? "border-amber-500/20"
          : "theme-divider";

  const statusText = user.isOnline ? "Online" : "Offline";

  return (
    <section className="theme-panel w-full overflow-hidden">
      {/* Cover */}
      <div className="relative h-36 overflow-hidden sm:h-44 md:h-48">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt={`${user.name} cover`}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <div className="theme-hero-profile absolute inset-0 bg-linear-to-br from-[#101827] via-[#121620] to-[#0a0f16]" />
        )}

        <div className="pointer-events-none absolute inset-0 bg-linear-to-b from-black/20 via-black/35 to-[#0d1118]" />

        <div className="absolute left-3 right-3 top-3 flex items-center justify-between">
          {!isOwner && onBack ? (
            <button
              type="button"
              onClick={onBack}
              className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/10 bg-black/45 text-zinc-200 backdrop-blur-md transition hover:bg-white/10"
              aria-label="Go back"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2">
            {isOwner ? (
              <>
                <button
                  type="button"
                  onClick={onEdit}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-[#151b25]/90 px-3 text-[10px] font-semibold text-white backdrop-blur-md transition hover:bg-[#1d2532] sm:h-9 sm:px-3.5 sm:text-[11px]"
                >
                  <Edit3 className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  <span>Edit Profile</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex h-8 items-center gap-1.5 rounded-lg bg-[#ef4444] px-3 text-[10px] font-bold text-white transition hover:bg-[#dc2626] sm:h-9 sm:px-3.5 sm:text-[11px]"
                >
                  <MessageSquare className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
                  Message
                </button>

                <button
                  type="button"
                  onClick={onFollow}
                  className="hidden h-8 items-center gap-1.5 rounded-lg border border-white/15 bg-[#151b25]/90 px-3 text-[10px] font-semibold text-white backdrop-blur-md transition hover:bg-[#1d2532] sm:inline-flex sm:h-9 sm:px-3.5 sm:text-[11px]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Follow
                </button>

                <button
                  type="button"
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/15 bg-[#151b25]/90 text-zinc-300 backdrop-blur-md transition hover:bg-[#1d2532] sm:hidden"
                  aria-label="More options"
                >
                  <MoreHorizontal className="h-4 w-4" />
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main profile content above UserStats */}
      <div className="px-4 pb-4 sm:px-5 sm:pb-5 md:px-6 md:pb-6">
        <div className="relative mt-3">
          {/* Desktop */}
          <div className="hidden sm:flex sm:items-start sm:gap-5 md:gap-6">
            <div className="relative h-24 w-24 shrink-0 md:h-28 md:w-28">
              <img
                src={getAvatarUrl(user.name, user.avatar)}
                alt={user.name}
                onError={(e) => handleAvatarError(e, user.name)}
                referrerPolicy="no-referrer"
                className="h-full w-full rounded-full border-4 border-[#0d1118] bg-zinc-900 object-cover shadow-xl"
              />

              {user.isOnline && (
                <span
                  className="absolute bottom-2 right-3 h-4 w-4 rounded-full border-2 border-[#0d1118] bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                  aria-hidden="true"
                />
              )}
            </div>

            <div className="min-w-0 flex-1 pt-1 md:pt-2">
              <div className="flex items-center gap-1.5">
                <h1 className="truncate text-xl font-bold tracking-tight text-white md:text-2xl">
                  {user.name}
                </h1>

                {user.isEmailVerified && (
                  <CheckCircle2 className="h-4 w-4 shrink-0 fill-sky-500 text-white md:h-5 md:w-5" />
                )}
              </div>

              {user.role && (
                <span className="mt-1.5 inline-flex rounded-md border border-[#ef4444]/30 bg-[#ef4444]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff6b6b] md:text-[10px]">
                  {user.role}
                </span>
              )}

              {user.address && (
                <div className="mt-2 flex items-center gap-1.5 text-[10px] text-zinc-400 md:text-[11px]">
                  <MapPin className="h-3 w-3 shrink-0 text-[#ef4444]" />
                  <span className="truncate">{user.address}</span>
                </div>
              )}

              {user?.bio && (
                <p className="mt-2.5 max-w-2xl line-clamp-3 text-[11px] leading-5 text-zinc-300/90">
                  {user.bio}
                </p>
              )}
            </div>

            <div
              className={` mt-3 w-56 shrink-0  p-4`}
            >
              <div className="flex gap-4">
                  <Shield className="h-10 w-10 text-[#d1d1d1] fill-red-600" />

                <div className="min-w-0">
                  <p className="theme-text-inset text-[10px] font-medium md:text-[11px]">
                    Trust Score
                  </p>

                  <p className="theme-text-primary mt-0.5 text-4xl font-black leading-none">
                    {safeTrustScore.toFixed(1)}
                  </p>

                  <p className={`mt-1 text-[14px] font-semibold ${trustColor}`}>
                    {trustLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile */}
          <div className="sm:hidden ">
            <div className="flex flex-row gap-5">
              <div className="relative h-20 w-20 shrink-0">
                <img
                  src={getAvatarUrl(user.name, user.avatar)}
                  alt={user.name}
                  onError={(e) => handleAvatarError(e, user.name)}
                  referrerPolicy="no-referrer"
                  className="h-full w-full rounded-full border-4 border-[#0d1118] bg-zinc-900 object-cover shadow-xl"
                />

                {user.isOnline && (
                  <span
                    className="absolute bottom-1 right-2 h-3.5 w-3.5 rounded-full border-2 border-[#0d1118] bg-emerald-400 shadow-[0_0_0_2px_rgba(16,185,129,0.2)]"
                    aria-hidden="true"
                  />
                )}
              </div>

              <div className="mt-2 min-w-0">
                <div className="flex items-center gap-1.5">
                  <h1 className="truncate text-lg font-bold tracking-tight text-white">
                    {user.name}
                  </h1>

                  {user.isEmailVerified && (
                    <CheckCircle2 className="h-4 w-4 shrink-0 fill-sky-500 text-white" />
                  )}
                </div>

                {user.role && (
                  <span className="mt-1 inline-flex rounded-md border border-[#ef4444]/30 bg-[#ef4444]/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-[#ff6b6b]">
                    {user.role}
                  </span>
                )}

                {user.address && (
                  <div className="mt-1.5 flex items-center gap-1.5 text-[10px] text-zinc-400">
                    <MapPin className="h-3 w-3 shrink-0 text-[#ef4444]" />
                    <span className="truncate">{user.address}</span>
                  </div>
                )}

                {user?.bio && (
                  <p className="mt-2 line-clamp-3 text-[10px] leading-4 text-zinc-300/90">
                    {user.bio}
                  </p>
                )}
              </div>
            </div>

            {!isOwner && (
              <div className="mt-3 grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={onMessage}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg bg-[#ef4444] text-[10px] font-bold text-white transition hover:bg-[#dc2626]"
                >
                  <MessageSquare className="h-3.5 w-3.5" />
                  Message
                </button>

                <button
                  type="button"
                  onClick={onFollow}
                  className="inline-flex h-9 items-center justify-center gap-1.5 rounded-lg border border-white/10 bg-[#151b25] text-[10px] font-semibold text-white transition hover:bg-[#1d2532]"
                >
                  <UserPlus className="h-3.5 w-3.5" />
                  Follow
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

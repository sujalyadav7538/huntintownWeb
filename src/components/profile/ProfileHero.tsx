import { User, UserMetric } from "../../types";
import {
  MapPin,
  MessageSquare,
  Share2,
  CheckCircle2,
  Star,
  Shield,
  Edit3,
  TrendingUp,
  Calendar,
  Award,
} from "lucide-react";

import { getAvatarUrl, handleAvatarError } from "../../utils";
import { getTrustLevel } from "@/src/data";

interface ProfileHeroProps {
  user: User;
  metric?: UserMetric | null;
  isOwner: boolean;
  onEdit: () => void;
  onMessage?: () => void;
}

export default function ProfileHero({
  user,
  metric,
  isOwner,
  onEdit,
  onMessage,
}: ProfileHeroProps) {
  const rating = metric?.reviewMetrics.averageRating ?? 0;
  const totalReviews = metric?.reviewMetrics.totalReviews ?? 0;
  const trustScore = metric?.trustScore ?? 0;

  const trustLevel = getTrustLevel(trustScore);

  const handleShare = async () => {
    if (navigator.share) {
      await navigator.share({
        title: user.name,
        url: window.location.href,
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  };

  const statCards = [
    {
      label: "Trust Score",
      value: trustScore.toFixed(0),
      icon: Shield,
      color: "text-[#FF3F3F]",
    },
    {
      label: "Rating",
      value: rating > 0 ? rating.toFixed(1) : "--",
      icon: Star,
      color: "text-amber-400",
    },
    {
      label: "Reviews",
      value: totalReviews.toString(),
      icon: Award,
      color: "text-emerald-400",
    },
    {
      label: "Reputation",
      value: trustLevel.label,
      icon: TrendingUp,
      color: trustLevel.color,
    },
  ];

  return (
    <section className="overflow-hidden rounded-2xl  bg-[#171717] ">
      {/* Cover */}
      <div className="relative h-44 sm:h-56 lg:h-64 overflow-hidden">
        {user.coverImage ? (
          <img
            src={user.coverImage}
            alt={`${user.name} cover`}
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-[#111113]" />
        )}

        {/* Brand chip */}
        <div className="absolute top-3 right-3 sm:top-5 sm:right-5 rounded-lg border border-white/15 bg-black/35 backdrop-blur px-2.5 py-1.5 sm:px-3 sm:py-2">
          <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-300">
            HuntInTown
          </p>
        </div>
      </div>

      {/* Body */}
      <div className="relative px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
        <div className="-mt-14 sm:-mt-16 lg:-mt-20 relative z-20">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 md:gap-6">
            {/* Avatar + identity */}
            <div className="min-w-0 flex-1">
              <div className="relative w-fit md:mx-0">
                <div className="absolute -inset-2 rounded-full" />
                <div className="relative rounded-full  ">
                  <img
                    src={getAvatarUrl(user.name, user.avatar)}
                    alt={user.name}
                    onError={(e) => handleAvatarError(e, user.name)}
                    className="h-24 w-24 sm:h-32 sm:w-32 lg:h-36 lg:w-36 rounded-full object-cover bg-zinc-900"
                  />
                </div>
                <span className="absolute bottom-1.5 right-1.5 h-4 w-4 sm:h-5 sm:w-5 rounded-full bg-emerald-400 border-2 sm:border-4 border-[#0C0C0E]" />
              </div>
            </div>

            {/* Actions */}
            <div className="w-auto flex justify-end gap-6">
              {isOwner ? (
                <>
                  <button onClick={onEdit}>
                    <Edit3 className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <>
                  <button
                    onClick={() => onMessage?.()}
                    className="hidden sm:flex items-center gap-2 px-4 lg:px-5 py-2.5 rounded-xl bg-[#FF3F3F] text-white font-semibold hover:bg-red-600 transition"
                  >
                    <MessageSquare className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    onClick={() => onMessage?.()}
                    className="sm:hidden w-10 h-10 rounded-xl bg-[#FF3F3F] text-white flex items-center justify-center"
                    aria-label="Message"
                  >
                    <MessageSquare className="w-4 h-4" />
                  </button>
                </>
              )}

              <button onClick={handleShare} aria-label="Share profile">
                <Share2 className="w-4 h-4 text-zinc-300" />
              </button>
            </div>
          </div>

          {/* Primary details */}
          <div className="mt-4 sm:mt-5 flex flex-col gap-4">
            {/* Name + Badge */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white break-words">
                {user.name}
              </h1>

              {user.isEmailVerified && (
                <CheckCircle2 className="w-5 h-5 text-[#FF3F3F] shrink-0" />
              )}
            </div>

            {/* Role */}
            {user.role && (
              <p className="text-sm sm:text-base lg:text-lg font-medium text-zinc-300">
                {user.role}
              </p>
            )}

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs sm:text-sm text-zinc-500">
              {user.address && (
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF3F3F] shrink-0" />
                  <span>{user.address}</span>
                </div>
              )}

              <span
                className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider ${trustLevel.bg} ${trustLevel.border} ${trustLevel.color}`}
              >
                <Shield className="w-3 h-3" />
                {trustLevel.label}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-[10px] sm:text-[11px] font-bold uppercase tracking-wider border-amber-400 text-amber-400">
                {rating + "%"}
                <Star className="w-3 h-3" />
              </span>
            </div>
          </div>

          {/* Stats row */}
          {/* <div className="mt-5 sm:mt-6 grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
            {statCards.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.label}
                  className="rounded-xl border border-white/10 bg-white/[0.035] px-3 py-3 sm:px-4 sm:py-3.5"
                >
                  <div className="flex items-center justify-between">
                    <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-500 font-bold">
                      {item.label}
                    </p>
                    <Icon className={`w-4 h-4 ${item.color}`} />
                  </div>
                  <p className="mt-1.5 text-lg sm:text-xl font-black text-white">
                    {item.value}
                  </p>
                </div>
              );
            })}
          </div> */}
        </div>
      </div>
    </section>
  );
}

//  {/* Statistics Row */}

//         <div className="grid grid-cols-2 lg:grid-cols-4 gap-5 mt-10">
//           {statCards.map((item) => {
//             const Icon = item.icon;

//             return (
//               <div
//                 key={item.label}
//                 className="rounded-xl border border-[#232327] bg-[#111113] p-5 hover:border-[#FF3F3F]/40 transition"
//               >
//                 <div className="flex items-center justify-between">
//                   <div>
//                     <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
//                       {item.label}
//                     </p>

//                     <h3 className="mt-2 text-3xl font-black text-white">
//                       {item.value}
//                     </h3>
//                   </div>

//                   <div className="w-12 h-12 rounded-xl bg-[#19191c] flex items-center justify-center">
//                     <Icon className={`w-5 h-5 ${item.color}`} />
//                   </div>
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* ----------------------------------------------- */}
//         {/* Profile Summary */}
//         {/* ----------------------------------------------- */}

//         <div className="grid lg:grid-cols-[2fr_1fr] gap-8 mt-10">
//           {/* About */}

//           <div className="rounded-xl border border-[#232327] bg-[#111113] p-7">
//             <div className="flex items-center justify-between">
//               <h2 className="text-xl font-bold text-white">About</h2>

//               <ChevronRight className="w-5 h-5 text-zinc-600" />
//             </div>

//             <div className="mt-6 space-y-5">
//               <p className="leading-8 text-zinc-400">
//                 {user.bio ||
//                   "This member hasn't added a profile description yet. As they complete more jobs and interact with the community, their profile will become more detailed."}
//               </p>

//               <div className="grid sm:grid-cols-2 gap-4">
//                 <div className="rounded-lg bg-[#19191b] p-4 border border-[#252529]">
//                   <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
//                     Reputation
//                   </p>

//                   <h4 className="mt-2 text-lg font-bold text-white">
//                     {trustLevel.label}
//                   </h4>

//                   <p className="mt-2 text-sm text-zinc-500">
//                     Based on reviews, completed work, profile completion and
//                     response behaviour.
//                   </p>
//                 </div>

//                 <div className="rounded-lg bg-[#19191b] p-4 border border-[#252529]">
//                   <p className="text-[11px] uppercase tracking-widest text-zinc-500 font-bold">
//                     Community Status
//                   </p>

//                   <h4 className="mt-2 text-lg font-bold text-white">
//                     Verified Resident
//                   </h4>

//                   <p className="mt-2 text-sm text-zinc-500">
//                     Trusted member of the HuntInTown neighbourhood network.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Sidebar */}

//           <div className="space-y-5">
//             <div className="rounded-xl border border-[#232327] bg-[#111113] p-6">
//               <h3 className="text-lg font-bold text-white">
//                 Reputation Overview
//               </h3>

//               <div className="mt-6 space-y-5">
//                 <div>
//                   <div className="flex justify-between text-sm mb-2">
//                     <span className="text-zinc-400">Trust Score</span>

//                     <span className="font-bold text-white">
//                       {trustScore.toFixed(0)}/100
//                     </span>
//                   </div>

//                   <div className="h-2 rounded-full bg-zinc-800 overflow-hidden">
//                     <div
//                       className="h-full bg-[#FF3F3F]"
//                       style={{
//                         width: `${Math.min(100, trustScore)}%`,
//                       }}
//                     />
//                   </div>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-zinc-500">Average Rating</span>

//                   <span className="font-semibold text-white">
//                     {rating > 0 ? rating.toFixed(1) : "--"}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-zinc-500">Reviews</span>

//                   <span className="font-semibold text-white">
//                     {totalReviews}
//                   </span>
//                 </div>

//                 <div className="flex justify-between">
//                   <span className="text-zinc-500">Reputation Level</span>

//                   <span className={trustLevel.color}>{trustLevel.label}</span>
//                 </div>
//               </div>
//             </div>

//             <div className="rounded-xl border border-[#232327] bg-gradient-to-br from-[#FF3F3F]/10 via-[#111113] to-[#111113] p-6">
//               <h3 className="font-bold text-white">HuntInTown Promise</h3>

//               <p className="mt-3 text-sm leading-7 text-zinc-400">
//                 Reputation is earned through genuine interactions, successful
//                 collaborations, timely responses and positive community
//                 feedback—not by paid subscriptions.
//               </p>
//             </div>
//           </div>
//         </div>

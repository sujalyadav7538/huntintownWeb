import React from "react";
import {
  MapPin,
  MessageSquare,
  Share2,
  Award,
  Star,
  TrendingUp,
  CheckCircle2,
  Zap,
  Users,
  Sparkles,
} from "lucide-react";
import { getAvatarUrl, handleAvatarError } from "../../utils";

export default function ProfilePreviewCard({ user }) {
  const rating = user.rating ?? 0;
  const ratingStars = Math.round(rating);

  return (
    <div className="max-w-5xl mx-auto p-4 sm:p-6 lg:p-8 relative">
      {/* Ambient glow orbs */}
      <div className="absolute -top-20 left-1/4 w-96 h-96 bg-[#FF3F3F]/8 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute -bottom-10 right-1/4 w-72 h-72 bg-violet-500/6 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="bg-[#0C0C0E] border border-white/6 rounded-4xl shadow-[0_0_60px_rgba(0,0,0,0.6)] overflow-hidden relative">

        {/* ── Cover Banner ── */}
        <div className="h-44 sm:h-56 relative overflow-hidden">
          <div className="absolute inset-0 bg-[#0C0C0E]" />
          {/* Mesh gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,#FF3F3F22_0%,transparent_60%),radial-gradient(ellipse_at_bottom_right,#7c3aed18_0%,transparent_60%)]" />
          {/* Diagonal lines pattern */}
          <div
            className="absolute inset-0 opacity-[0.04]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, #fff 0, #fff 1px, transparent 0, transparent 50%)",
              backgroundSize: "20px 20px",
            }}
          />
          {/* Bottom fade */}
          <div className="absolute bottom-0 inset-x-0 h-24 bg-linear-to-t from-[#0C0C0E] to-transparent" />
        </div>

        <div className="px-6 sm:px-10 pb-10 -mt-2 relative z-10">

          {/* ── Profile Header ── */}
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10">
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-5">
              {/* Avatar */}
              <div className="relative -mt-16 sm:-mt-20 shrink-0">
                <div className="absolute -inset-1 rounded-full bg-linear-to-br from-[#FF3F3F] via-rose-400 to-violet-500 opacity-60 blur-sm" />
                <div className="relative p-0.75 rounded-full bg-linear-to-br from-[#FF3F3F] to-violet-500">
                  <img
                    src={getAvatarUrl(user.name, user.avatar)}
                    alt={user.name}
                    className="w-28 h-28 sm:w-32 sm:h-32 rounded-full object-cover bg-zinc-900 block"
                    onError={(e) => handleAvatarError(e, user.name)}
                    referrerPolicy="no-referrer"
                  />
                </div>
                {/* Online indicator */}
                <span className="absolute bottom-1.5 right-1.5 w-4 h-4 bg-emerald-400 rounded-full border-2 border-[#0C0C0E] shadow-[0_0_8px_rgba(52,211,153,0.8)]" />
              </div>

              {/* Name + meta */}
              <div className="text-center sm:text-left pb-1">
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-none">
                    {user.name}
                  </h1>
                  <CheckCircle2 className="w-5 h-5 text-[#FF3F3F] shrink-0" />
                </div>
                <p className="text-zinc-400 text-sm font-medium">{user.role}</p>
                <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-2 text-xs text-zinc-500">
                  <MapPin className="w-3.5 h-3.5 text-[#FF3F3F]" />
                  <span>{user.location || "Location not set"}</span>
                </div>
              </div>
            </div>

            {/* Action buttons */}
            <div className="flex items-center gap-2.5 sm:pb-1 justify-center sm:justify-end">
              <button className="px-5 py-2.5 rounded-xl bg-linear-to-r from-[#FF3F3F] to-rose-500 hover:from-rose-500 hover:to-[#FF3F3F] text-white font-semibold text-sm flex items-center gap-2 transition-all duration-300 shadow-[0_4px_20px_rgba(255,63,63,0.35)] hover:shadow-[0_4px_28px_rgba(255,63,63,0.55)] active:scale-95">
                <MessageSquare className="w-4 h-4" />
                Message
              </button>
              <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/8 hover:bg-white/10 text-zinc-400 hover:text-white flex items-center justify-center transition-all active:scale-95">
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* ── Body Grid ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* Left: About + Skills */}
            <div className="lg:col-span-2 flex flex-col gap-5">

              {/* About */}
              <div className="group relative rounded-2xl bg-white/2.5 border border-white/6 p-6 overflow-hidden hover:border-white/10 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-[#FF3F3F]/40 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">About</h3>
                </div>
                <p className="text-zinc-400 leading-relaxed text-sm">
                  {user.bio ||
                    "This user hasn't added a bio yet. Check back later to learn more about their journey and expertise."}
                </p>
              </div>

              {/* Skills */}
              <div className="group relative rounded-2xl bg-white/2.5 border border-white/6 p-6 overflow-hidden hover:border-white/10 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-violet-500/30 to-transparent" />
                <div className="flex items-center gap-2 mb-4">
                  <Zap className="w-4 h-4 text-violet-400" />
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Expertise</h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.skills?.length ? (
                    user.skills.map((skill) => (
                      <span
                        key={skill}
                        className="px-3 py-1.5 rounded-lg bg-white/4 border border-white/8 text-xs text-zinc-300 hover:bg-white/8 hover:border-white/[0.14] hover:text-white transition-all cursor-default font-medium"
                      >
                        {skill}
                      </span>
                    ))
                  ) : (
                    <p className="text-zinc-600 text-sm italic">No skills added yet.</p>
                  )}
                </div>
              </div>

              {/* Achievements (horizontal inside left col) */}
              <div className="relative rounded-2xl bg-white/2.5 border border-white/6 p-6 overflow-hidden hover:border-white/10 transition-colors duration-300">
                <div className="absolute top-0 left-0 w-full h-px bg-linear-to-r from-transparent via-amber-400/30 to-transparent" />
                <div className="flex items-center gap-2 mb-5">
                  <Award className="w-4 h-4 text-amber-400" />
                  <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-widest">Achievements</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  {[
                    {
                      title: "Early Adopter",
                      desc: "Joined in its initial phase",
                      icon: Zap,
                      color: "text-amber-400",
                      bg: "bg-amber-400/10",
                      border: "border-amber-400/20",
                    },
                    {
                      title: "Verified",
                      desc: "Identity confirmed",
                      icon: CheckCircle2,
                      color: "text-emerald-400",
                      bg: "bg-emerald-400/10",
                      border: "border-emerald-400/20",
                    },
                    {
                      title: "Contributor",
                      desc: "Helping the community",
                      icon: Users,
                      color: "text-violet-400",
                      bg: "bg-violet-400/10",
                      border: "border-violet-400/20",
                    },
                  ].map((a, i) => (
                    <div
                      key={i}
                      className={`group flex flex-col gap-3 p-4 rounded-xl border ${a.border} ${a.bg} hover:brightness-125 transition-all`}
                    >
                      <div className={`w-8 h-8 rounded-lg ${a.bg} border ${a.border} flex items-center justify-center`}>
                        <a.icon className={`w-4 h-4 ${a.color}`} />
                      </div>
                      <div>
                        <p className={`text-xs font-bold ${a.color}`}>{a.title}</p>
                        <p className="text-[11px] text-zinc-500 mt-0.5 leading-snug">{a.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Stats */}
            <div className="flex flex-col gap-5">

              {/* Rating spotlight */}
              <div className="relative rounded-2xl overflow-hidden border border-[#FF3F3F]/20 bg-linear-to-b from-[#FF3F3F]/8 to-transparent p-6">
                <div className="absolute -top-6 -right-6 w-24 h-24 bg-[#FF3F3F]/10 rounded-full blur-2xl" />
                <p className="text-[10px] font-bold text-[#FF3F3F] uppercase tracking-widest mb-2">Global Rating</p>
                <div className="flex items-end gap-3 mb-3">
                  <span className="text-5xl font-black text-white leading-none">{rating.toFixed(1)}</span>
                  <span className="text-zinc-500 text-sm mb-1">/ 5.0</span>
                </div>
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 transition-colors ${i < ratingStars ? "text-[#FF3F3F]" : "text-zinc-700"}`}
                      fill="currentColor"
                    />
                  ))}
                </div>
              </div>

              {/* Stat tiles */}
              <div className="grid grid-cols-2 gap-3">
                {[
                  {
                    label: "Requests",
                    value: "0",
                    icon: TrendingUp,
                    color: "text-sky-400",
                    bg: "bg-sky-400/10",
                  },
                  {
                    label: "Reviews",
                    value: user.reputation ?? 0,
                    icon: MessageSquare,
                    color: "text-violet-400",
                    bg: "bg-violet-400/10",
                  },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="rounded-2xl bg-white/2.5 border border-white/6 p-4 flex flex-col gap-3 hover:border-white/10 transition-colors"
                  >
                    <div className={`w-8 h-8 rounded-lg ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-4 h-4 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">{stat.label}</p>
                      <p className="text-2xl font-black text-white mt-0.5">{stat.value}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Member since */}
              {user.joinedAt && (
                <div className="rounded-2xl bg-white/2.5 border border-white/6 px-5 py-4 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#FF3F3F]/10 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-[#FF3F3F]" />
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-500 font-semibold uppercase tracking-wider">Member since</p>
                    <p className="text-sm font-semibold text-zinc-200 mt-0.5">
                      {new Date(user.joinedAt).toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

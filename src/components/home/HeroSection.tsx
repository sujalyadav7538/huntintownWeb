import { Post } from "@/src/types";
import { ArrowUpRight, LucideIcon, Radio } from "lucide-react";
import ProfileMetricCard from "../profile/ProfileMetricCard";
import { heroSectionStats } from "@/src/data";

interface HeroSectionProps {
  activePosts: Post[];
  onPostRequirement: () => void;
  onExplore: () => void;
}

export default function HeroSection({
  activePosts,
  onPostRequirement,
  onExplore,
}: HeroSectionProps) {
  const isMobile = window.innerWidth < 768; // Adjust the breakpoint as needed
  return (
    <section className="relative overflow-hidden">
      {/* Background Glow */}
      {/* <div className="absolute top-0 right-10 w-125 h-125  rounded-full blur-[120px] pointer-events-none" /> */}
      {/* <div className="absolute -bottom-10 -left-10 w-75 h-75  rounded-full blur-[90px] pointer-events-none" /> */}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-10 items-center p-6 sm:p-10 lg:p-12 relative overflow-hidden">
        <HeroContent
          onPostRequirement={onPostRequirement}
          onExplore={onExplore}
        />

        <HeroStats activePosts={activePosts.length} />
      </div>
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/*                              Hero Left Section                             */
/* -------------------------------------------------------------------------- */

function HeroContent({ onPostRequirement, onExplore }) {
  const avatars = [
    "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80",
  ];

  return (
    <div className="xl:col-span-7 space-y-7">
      {/* Platform Badge */}

      <div className="inline-flex items-center gap-2 rounded-full border border-[#FF3F3F]/30 bg-[#FF3F3F]/10 px-4 py-2">
        <Radio className="w-4 h-4 text-[#FF3F3F] animate-pulse" />

        <span className="text-[11px] font-black uppercase tracking-[0.18em] text-[#FF3F3F]">
          Community Powered Marketplace
        </span>
      </div>

      {/* Heading */}

      <div className="space-y-4">
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black leading-none tracking-tight text-white">
          Find Help.
          <br />
          <span className="text-[#FF3F3F]">Offer Skills.</span>
          <br />
          Build Local Trust.
        </h1>

        <p className="max-w-2xl text-sm sm:text-base leading-7 text-zinc-400">
          HuntInTown connects people within local communities to post
          requirements, discover skilled helpers, collaborate securely, and
          build lasting reputation through verified interactions.
        </p>
      </div>

      {/* CTA */}

      <div className="flex flex-row gap-4">
        <button
          onClick={onPostRequirement}
          className="inline-flex  items-center gap-2 rounded-xl bg-[#FF3F3F] px-3 py-2.5 font-bold uppercase  text-white transition-all hover:bg-[#e23636] hover:shadow-lg hover:shadow-[#FF3F3F]/20 cursor-pointer"
        >
          Post Requirement
          <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
        </button>

        <button
          onClick={onExplore}
          className="rounded-xl border border-zinc-700 bg-zinc-900 px-6 py-3.5 font-bold uppercase tracking-wider text-zinc-200 transition hover:border-zinc-500 hover:bg-zinc-800 cursor-pointer"
        >
          Explore Needs
        </button>
      </div>

      {/* Community Trust */}

      <HeroTrustWidget avatars={avatars} />
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                             Hero Right Section                             */
/* -------------------------------------------------------------------------- */

interface HeroTrustWidgetProps {
  avatars: string[];
}

function HeroTrustWidget({ avatars }: HeroTrustWidgetProps) {
  return (
    <div className="flex flex-wrap items-center gap-5 border-t border-zinc-800 pt-6">
      <div className="flex -space-x-2">
        {avatars.map((avatar) => (
          <img
            key={avatar}
            src={avatar}
            alt="Community Member"
            className="h-10 w-10 rounded-full border-2 border-[#121214] object-cover"
          />
        ))}

        <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#121214] bg-[#FF3F3F] text-[10px] font-bold text-white">
          +12K
        </div>
      </div>

      <div>
        <h3 className="font-semibold text-white">
          Trusted by thousands of local community members
        </h3>

        <p className="mt-1 text-xs text-zinc-500">
          Zero commission • Reputation driven • Verified collaborations
        </p>
      </div>
    </div>
  );
}

function HeroStats({ activePosts }: { activePosts: number }) {
  return (
    <div className="xl:col-span-5">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {heroSectionStats.map((stat) => (
          <ProfileMetricCard
            key={stat.title}
            title={stat.title}
            value={
              stat.value instanceof Function
                ? stat.value(activePosts)
                : stat.value
            }
            subtitle={stat.subtitle}
            icon={stat.icon}
            color={stat.color}
            size="md"
            className={stat?.className ?? ""}
          />
        ))}
      </div>
    </div>
  );
}

interface HeroStatCardProps {
  title: string;
  value: string;
  suffix?: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

function HeroStatCard({
  title,
  value,
  suffix,
  description,
  icon: Icon,
  color,
}: HeroStatCardProps) {
  return (
    <div className="group relative overflow-hidden rounded-2xl border border-zinc-800 bg-[#0d0d0f] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#FF3F3F]/40">
      {/* Glow */}

      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#FF3F3F]/5 blur-2xl transition-opacity group-hover:opacity-100" />

      {/* Icon */}

      <div
        className={`inline-flex h-11 w-11 items-center justify-center rounded-xl bg-zinc-900 ${color}`}
      >
        <Icon className="h-5 w-5" />
      </div>

      {/* Title */}

      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-zinc-500 font-bold">
        {title}
      </p>

      {/* Value */}

      <div className="mt-2 flex items-end gap-2">
        <span className="text-3xl font-black text-white">{value}</span>

        {suffix && (
          <span className="pb-1 text-xs uppercase tracking-wider text-zinc-400">
            {suffix}
          </span>
        )}
      </div>

      {/* Description */}

      <p className="mt-3 text-xs leading-5 text-zinc-500">{description}</p>
    </div>
  );
}

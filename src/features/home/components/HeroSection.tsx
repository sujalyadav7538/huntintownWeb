import { Post } from "@/src/shared/types";
import { ArrowUpRight, MapPin } from "lucide-react";

import HuntMap from "../../map/components/HuntMap";

interface HeroSectionProps {
  activePosts: Post[];
  onPostRequirement: () => void;
  onExplore: () => void;
}

type HeroActionsProps = Pick<HeroSectionProps, "onPostRequirement" | "onExplore">;

export default function HeroSection({
  activePosts,
  onPostRequirement,
  onExplore,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-120" aria-hidden="true" />

      <div className="relative grid grid-cols-1 items-center gap-3 px-2 py-6 sm:px-6 sm:py-10 lg:grid-cols-2 lg:gap-12 lg:px-10 lg:py-12">
        {/* Desktop Content */}
        <div className="hidden lg:block">
          <HeroSectionDesktop
            onPostRequirement={onPostRequirement}
            onExplore={onExplore}
          />
        </div>

        {/* Mobile Content */}
        <div className="block lg:hidden">
          <HeroSectionMobile
            onPostRequirement={onPostRequirement}
            onExplore={onExplore}
          />
        </div>

        {/* Map */}
        <section className="hero-animate hero-delay-3 space-y-3" aria-labelledby="hero-map-title">
          <div className="flex items-end justify-between gap-4 px-1">
            <div>
              <p className="mb-1 text-[11px] font-bold uppercase theme-text-muted">
                Around the neighborhood
              </p>
              <h2
                id="hero-map-title"
                className="font-display text-xl font-bold theme-text-primary"
              >
                See what's nearby
              </h2>
            </div>

            <button
              type="button"
              onClick={onExplore}
              aria-label="Explore all nearby requests"
              title="Explore nearby requests"
              className="theme-btn-accent-soft flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border transition"
            >
              <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>

          <div className="relative h-62.5 overflow-hidden rounded-lg border theme-divider theme-panel shadow-lg sm:h-80 lg:h-95">
            <HuntMap posts={activePosts} className="h-full rounded-lg" />

            <div className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/75 px-3 py-2 text-xs font-semibold text-white shadow backdrop-blur-sm">
              <MapPin
                className="h-3.5 w-3.5 text-[#FF6B6B]"
                aria-hidden="true"
              />
              {activePosts.length} live{" "}
              {activePosts.length === 1 ? "request" : "requests"}
            </div>
          </div>
        </section>
      </div>
    </section>
  );
}

function HeroSectionDesktop({ onPostRequirement, onExplore }: HeroActionsProps) {
  return (
    <div className="space-y-7">
      <div className="space-y-4">
        <h1 className="hero-animate font-black leading-none tracking-tight theme-text-primary text-5xl xl:text-6xl">
          Find Help.
          <br />
          <span className="landing-eyebrow">Offer Skills.</span>
          <br />
          Build Local Trust.
        </h1>

        <p className="hero-animate hero-delay-1 max-w-xl text-base leading-7 theme-text-muted">
          HuntInTown connects people within local communities to post
          requirements, discover skilled helpers, collaborate securely, and
          build lasting reputation through verified interactions.
        </p>
      </div>

      <div className="hero-animate hero-delay-2 flex flex-row gap-3">
        <button
          type="button"
          onClick={onPostRequirement}
          className="theme-btn-accent inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold uppercase transition"
        >
          Post Requirement
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onExplore}
          className="landing-btn-secondary group inline-flex h-13 items-center gap-2 rounded-xl px-5 text-sm font-bold uppercase"
        >
          <img
            src="/lion.png"
            alt=""
            className="h-6 w-6 transition-transform duration-300 group-hover:scale-130"
          />
          Explore Needs
        </button>
      </div>
    </div>
  );
}

function HeroSectionMobile({ onExplore }: HeroActionsProps) {
  return (
    <div className="relative px-2 pt-4 pb-2">
      <div className="relative space-y-7">
        <div className="hero-fade">
          <div className="theme-btn-accent-soft inline-flex items-center gap-2 rounded-full border px-3 py-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-(--app-red) animate-pulse" />

            <span className="text-[10px] font-bold uppercase tracking-[0.18em]">
              Community Powered
            </span>
          </div>
        </div>

        <div className="space-y-4">
          <h1 className="flex flex-col gap-3 text-[2.75rem] font-black leading-[0.92] tracking-tight theme-text-primary">
            <span className="hero-animate hero-delay-1">Find Help.</span>

            <span className="hero-animate hero-delay-2 ml-3 landing-eyebrow">
              Offer Skills.
            </span>

            <span className="hero-animate hero-delay-3 ml-6">Build Local Trust.</span>
          </h1>

          <p className="hero-animate hero-delay-3 text-sm leading-6 theme-text-muted">
            Post what you need. Discover people nearby. Connect directly.
          </p>
        </div>

        <div className="hero-animate hero-delay-4">
          <button
            type="button"
            onClick={onExplore}
            className="landing-btn-secondary group flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-black uppercase tracking-wider active:scale-[0.97]"
          >
            <img
              src="/lion.png"
              alt=""
              className="h-7 w-7 transition-transform duration-300 group-hover:scale-130 "
            />

            <span>HUNT Growl...</span>
          </button>
        </div>

        <div className="hero-fade hero-delay-5 flex flex-col items-center pt-1">
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] theme-text-muted">
            Explore nearby
          </span>

          <div className="mt-2 h-8 w-px bg-linear-to-b from-(--app-red) to-transparent" />
        </div>
      </div>
    </div>
  );
}

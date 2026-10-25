import type { Post } from "@/src/shared/types";
import { ArrowUpRight, MapPin } from "lucide-react";
import AnimatedContent from "@/src/shared/components/AnimatedContent";

import HuntMap from "../../map/components/HuntMap";

interface HeroSectionProps {
  activePosts: Post[];
  onPostRequirement: () => void;
  onExplore: () => void;
}

type HeroActionsProps = Pick<
  HeroSectionProps,
  "onPostRequirement" | "onExplore"
>;

export default function HeroSection({
  activePosts,
  onPostRequirement,
  onExplore,
}: HeroSectionProps) {
  return (
    <section className="relative overflow-hidden">
      <div
        className="hero-glow pointer-events-none absolute inset-x-0 top-0 h-120"
        aria-hidden="true"
      />

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
        <section
          className="space-y-3"
          aria-labelledby="hero-map-title"
        >
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

            <div className="theme-text-image pointer-events-none absolute left-3 top-3 inline-flex items-center gap-2 rounded-md border border-white/10 bg-black/75 px-3 py-2 text-xs font-semibold text-white shadow backdrop-blur-sm">
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

function HeroSectionDesktop({
  onPostRequirement,
  onExplore,
}: HeroActionsProps) {
  return (
    <div className="max-w-xl space-y-6">
      <AnimatedContent variant="reveal">
        <h1 className="text-4xl font-black leading-[1.05] theme-text-primary xl:text-5xl">
          Have a problem? Ask your{" "}
          <span className="landing-eyebrow">local community.</span>
        </h1>
      </AnimatedContent>

      <p className="text-base leading-7 theme-text-muted">
        Find people nearby who can help. Post what you need, explore your
        options, and connect directly with the right people.
      </p>

      <div className="flex flex-row gap-3">
        <button
          type="button"
          onClick={onPostRequirement}
          className="theme-btn-accent inline-flex h-12 items-center gap-2 rounded-xl px-5 text-sm font-bold uppercase transition"
        >
          Post What You Need
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
          Explore Requests
        </button>
      </div>
    </div>
  );
}

function HeroSectionMobile({
  onPostRequirement,
  onExplore,
}: HeroActionsProps) {
  return (
    <div className="px-5 py-5">
      <AnimatedContent className="space-y-5 text-center">
        <h1 className="text-[2.2rem] font-black leading-[1.05] theme-text-primary">
          Have a problem? Ask your{" "}
          <span className="landing-eyebrow">local community.</span>
        </h1>

        <p className="mx-auto max-w-sm text-sm leading-6 theme-text-muted">
          Find people nearby who can help. Post what you need, explore your
          options, and connect directly with the right people.
        </p>
      </AnimatedContent>

      <div className="mt-6 flex flex-col gap-3">
        <button
          type="button"
          onClick={onPostRequirement}
          className="theme-btn-accent inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-bold uppercase transition"
        >
          Post What You Need
          <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
        </button>

        <button
          type="button"
          onClick={onExplore}
          className="landing-btn-secondary inline-flex h-11 w-full items-center justify-center gap-2 rounded-xl px-5 text-sm font-semibold transition"
        >
          Explore Requests
        </button>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { Post } from "@/src/shared/types";
import { ArrowUpRight, MapPin } from "lucide-react";

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
          className="hero-animate hero-delay-3 space-y-3"
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

function HeroSectionDesktop({
  onPostRequirement,
  onExplore,
}: HeroActionsProps) {
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
    <div className="relative px-5 pt-5 pb-5">
      <div className="relative">
        <LockOnAnimation />

        <div className="space-y-8 text-center">
          <h1 className="theme-text-primary flex flex-col gap-4 text-[3.2rem] font-black leading-[0.9] tracking-[-0.045em]">
            <span className="hero-animate hero-delay-1 block">Spot It.</span>

            <span className="hero-animate hero-delay-2 block text-red-600">
              Lock It.
            </span>

            <span className="hero-animate hero-delay-3 block">Help Out.</span>
          </h1>

          <p className="hero-animate hero-delay-3 mx-auto max-w-[290px] text-sm leading-6 theme-text-muted">
            Find what you need. Find who needs you.
          </p>
        </div>

        <div className="hero-animate hero-delay-4 mt-7">
          <button
            type="button"
            onClick={onExplore}
            className="landing-btn-secondary group flex h-14 w-full items-center justify-center gap-3 rounded-xl px-6 font-black uppercase tracking-wider active:scale-[0.97]"
          >
            <img
              src="/lion.png"
              alt=""
              className="h-7 w-7 transition-transform duration-300 group-hover:scale-130"
            />

            <span>HUNT Growl...</span>
          </button>
        </div>

        <div className="hero-fade hero-delay-5 mt-6 flex flex-col items-center">
          <span className="text-[9px] font-bold uppercase tracking-[0.35em] theme-text-muted">
            Explore nearby
          </span>

          <div className="mt-2 h-7 w-px bg-linear-to-b from-(--app-red) to-transparent" />
        </div>
      </div>
    </div>
  );
}

function LockOnAnimation() {
  const [arrows, setArrows] = useState<
    { id: number; direction: number }[]
  >([]);

  useEffect(() => {
    const directions = [0, 45, 90, 135, 180, 225, 270, 315];
    let id = 0;

    const shoot = () => {
      const direction =
        directions[Math.floor(Math.random() * directions.length)];

      setArrows((current) => [
        ...current,
        {
          id: id++,
          direction,
        },
      ]);
    };

    shoot();

    const intervalId = window.setInterval(shoot, 1000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div
      className="mb-5 h-16 w-full overflow-hidden text-white/70"
      aria-hidden="true"
    >
      <svg
        className="h-full w-full"
        viewBox="0 0 360 96"
        preserveAspectRatio="xMidYMid meet"
        fill="none"
      >
        {arrows.map(({ id, direction }) => (
          <g
            key={id}
            transform={`rotate(${direction} 180 48)`}
          >
            <g
              style={{
                animation: "arrowShoot 1.6s ease-out forwards",
              }}
              onAnimationEnd={() => {
                setArrows((current) =>
                  current.filter((arrow) => arrow.id !== id),
                );
              }}
            >
              <path
                d="M-5 48H156"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />

              <path
                d="M145 40L156 48L145 56"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </g>
          </g>
        ))}

        {/* Target */}
        <circle
          cx="180"
          cy="48"
          r="34"
          stroke="currentColor"
          strokeOpacity=".35"
          strokeWidth="2"
        />

        <circle
          cx="180"
          cy="48"
          r="25"
          stroke="#ef4444"
          strokeOpacity=".85"
          strokeWidth="2"
        />

        <circle
          cx="180"
          cy="48"
          r="15"
          stroke="currentColor"
          strokeOpacity=".7"
          strokeWidth="2"
        />

        <circle
          cx="180"
          cy="48"
          r="7"
          fill="#ef4444"
        />
      </svg>
    </div>
  );
}

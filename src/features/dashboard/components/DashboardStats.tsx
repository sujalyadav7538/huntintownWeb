import { useEffect, useRef, useState } from "react";
import { Archive, CheckCheck, CircleCheck, FileText, Inbox, Send } from "lucide-react";
import { apiFetch } from "@/src/shared/lib/api";
import type { UserMetric } from "@/src/shared/types";
import type { DashboardPost, SubmittedResponse } from "./types";

interface DashboardStatsProps {
  posts: DashboardPost[];
  submitted: SubmittedResponse[];
  revision: number;
}

export default function DashboardStats({ posts, submitted, revision }: DashboardStatsProps) {
  const [metric, setMetric] = useState<UserMetric | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    const loadMetric = async () => {
      try {
        const response = await apiFetch("/api/profile/metrics");
        const body = await response.json();
        if (!response.ok) throw new Error(body?.message || "Could not load statistics.");
        if (active) setMetric(body.metric ?? null);
      } catch {
        if (active) setMetric(null);
      }
    };
    void loadMetric();
    return () => { active = false; };
  }, [revision]);

  const activeCount = posts.filter((post) => ["live", "in_progress"].includes(post.status)).length;
  const receivedCount = posts.reduce((total, post) => total + (post.responsesCount || 0), 0);
  const acceptedCount =
    (metric?.hunterMetrics?.responsesAccepted ?? 0) +
    (metric?.helperMetrics?.responsesAccepted ?? 0);
  const completedCount = metric?.hunterMetrics?.postsCompleted ?? posts.filter((post) => post.status === "completed").length;

  const stats = [
    { label: "Requirements created", value: posts.length, icon: FileText, tint: "text-[#FF6B6B] bg-[#FF3F3F]/10" },
    { label: "Active requirements", value: activeCount, icon: Archive, tint: "text-sky-300 bg-sky-400/10" },
    { label: "Offers received", value: receivedCount, icon: Inbox, tint: "text-amber-300 bg-amber-400/10" },
    { label: "Offers submitted", value: submitted.length, icon: Send, tint: "text-cyan-300 bg-cyan-400/10" },
    { label: "Offers accepted", value: acceptedCount, icon: CheckCheck, tint: "text-emerald-300 bg-emerald-400/10" },
    { label: "Requirements completed", value: completedCount, icon: CircleCheck, tint: "text-lime-300 bg-lime-400/10" },
  ];

  return (
    <section aria-label="Dashboard statistics">
      <div
        ref={carouselRef}
        onScroll={(event) => {
          const track = event.currentTarget;
          const cards = Array.from(track.children) as HTMLElement[];
          const nearest = cards.reduce((closest, card, index) =>
            Math.abs(card.offsetLeft - track.scrollLeft) < Math.abs(cards[closest].offsetLeft - track.scrollLeft) ? index : closest,
          0);
          setActiveSlide((current) => current === nearest ? current : nearest);
        }}
        className="-mx-1 flex snap-x snap-mandatory gap-2 overflow-x-auto px-1 pb-1 md:hidden"
        aria-label="Swipe through dashboard statistics"
      >
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <article key={label} className="theme-card w-[82%] max-w-75 shrink-0 snap-center rounded-lg border-l-2 px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <span className="theme-text-muted text-[11px] font-semibold uppercase tracking-wide">{label}</span>
              <span className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-md ${tint}`}><Icon className="h-4 w-4" /></span>
            </div>
            <p className="theme-text-primary mt-3 font-display text-3xl font-bold tabular-nums">{value}</p>
          </article>
        ))}
      </div>
      <nav aria-label="Choose a statistic" className="mt-2 flex justify-center gap-1.5 md:hidden">
        {stats.map(({ label }, index) => (
          <button
            key={label}
            type="button"
            aria-label={`Show ${label}`}
            aria-current={activeSlide === index ? "true" : undefined}
            onClick={() => {
              const track = carouselRef.current;
              const card = track?.children[index] as HTMLElement | undefined;
              if (track && card) track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
            }}
            className={`h-1.5 rounded-full transition-all ${activeSlide === index ? "w-5 bg-[#FF3F3F]" : "w-1.5 bg-zinc-700"}`}
          />
        ))}
      </nav>
      <div className="hidden grid-cols-2 gap-2 md:grid md:grid-cols-3 md:gap-3 xl:grid-cols-6">
        {stats.map(({ label, value, icon: Icon, tint }) => (
          <article key={label} className="theme-card min-w-0 rounded-lg border-l-2 px-3 py-3.5 sm:px-4">
            <div className="flex items-center justify-between gap-2">
              <span className="theme-text-muted truncate text-[10px] font-semibold uppercase tracking-wide">{label}</span>
              <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md ${tint}`}><Icon className="h-3.5 w-3.5" /></span>
            </div>
            <p className="theme-text-primary mt-2 font-display text-2xl font-bold tabular-nums">{value}</p>
          </article>
        ))}
      </div>
      <AutoAdvanceCarousel activeSlide={activeSlide} slideCount={stats.length} onAdvance={setActiveSlide} carouselRef={carouselRef} />
    </section>
  );
}

function AutoAdvanceCarousel({ activeSlide, slideCount, onAdvance, carouselRef }: {
  activeSlide: number;
  slideCount: number;
  onAdvance: (slide: number) => void;
  carouselRef: React.RefObject<HTMLDivElement | null>;
}) {
  useEffect(() => {
    if (slideCount < 2) return;
    const interval = window.setInterval(() => {
      const nextSlide = (activeSlide + 1) % slideCount;
      const track = carouselRef.current;
      const card = track?.children[nextSlide] as HTMLElement | undefined;
      if (track && card && window.matchMedia("(max-width: 767px)").matches) {
        track.scrollTo({ left: card.offsetLeft - track.offsetLeft, behavior: "smooth" });
        onAdvance(nextSlide);
      }
    }, 2000);
    return () => window.clearInterval(interval);
  }, [activeSlide, carouselRef, onAdvance, slideCount]);

  return null;
}

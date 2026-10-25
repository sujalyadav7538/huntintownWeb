import { useEffect, useRef, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Compass,
} from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import "swiper/css";
import { useAppSelector } from "@/src/store/hooks";
import { useSeo } from "@/src/shared/hooks/useSeo";
import { SITE_URL } from "@/src/shared/lib/seo";
import Footer from "@/src/shared/components/layout/Footer";
import PostGridCard from "@/src/shared/components/post/PostGridCard";
import type { Post } from "@/src/shared/types";
import CommunityPrinciples from "@/src/features/home/components/CommunityPrinciples";
import HeroSection from "@/src/features/home/components/HeroSection";
import HowItWorks from "@/src/features/home/components/HowItWorks";
import TrustSystem from "@/src/features/home/components/TrustSystem";
import WhyHuntInTown from "@/src/features/home/components/WhyHuntInTown";
import AnimatedContent from "@/src/shared/components/AnimatedContent";

interface HomePageProps {
  onExplore: () => void;
  onPostRequirement: () => void;
  onExplorePost: (postId: string) => void;
  onInitiateChat: () => void;
}

export default function HomePage({
  onExplore,
  onPostRequirement,
  onExplorePost,
}: HomePageProps) {
  const posts = useAppSelector((s) => s.posts);
  const location = useLocation();

  useEffect(() => {
    const sectionId = location.hash.slice(1);
    if (!sectionId) return;
    const frame = requestAnimationFrame(() => {
      document.getElementById(sectionId)?.scrollIntoView({ block: "start" });
    });
    return () => cancelAnimationFrame(frame);
  }, [location.hash, location.key]);

  // Find live requirements for map linkage & carousel
  const activePosts = posts.filter((p) => p.status === "live");

  useSeo({
    // Home keeps the untruncated brand title rather than "Home · HuntInTown".
    title: "Find Local Help, Offer Your Skills",
    description:
      "HuntInTown connects people within local communities to post requirements, discover skilled helpers, and build lasting reputation through verified interactions.",
    path: "/",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "HuntInTown",
      url: SITE_URL || undefined,
      logo: SITE_URL ? `${SITE_URL}/logo.png` : undefined,
      description:
        "A hyperlocal community network connecting neighbours who need help with skilled local helpers.",
    },
  });

  return (
    <div className="w-full overflow-x-hidden">
      <HeroSection
        activePosts={activePosts}
        onPostRequirement={onPostRequirement}
        onExplore={onExplore}
      />

      <HomePostCarousel
        posts={activePosts.slice(0, 5)}
        onExplore={onExplore}
        onSelectPost={onExplorePost}
      />

      <div className="px-2 sm:px-6 lg:px-10">
        <AnimatedContent revealOnScroll duration={0.5}>
          <WhyHuntInTown />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <HowItWorks />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <TrustSystem />
        </AnimatedContent>
        <AnimatedContent revealOnScroll duration={0.5}>
          <CommunityPrinciples />
        </AnimatedContent>
      </div>

      <Footer />
    </div>
  );
}

function HomePostCarousel({
  posts,
  onExplore,
  onSelectPost,
}: {
  posts: Post[];
  onExplore: () => void;
  onSelectPost: (postId: string) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [activeSlide, setActiveSlide] = useState(0);

  const scroll = (direction: -1 | 1) => {
    const track = trackRef.current;
    if (!track) return;

    const card = track.querySelector<HTMLElement>("[data-post-card]");
    track.scrollBy({
      left: direction * ((card?.offsetWidth ?? track.clientWidth) + 12),
      behavior: "smooth",
    });
  };

  return (
    <section
      className="px-2 py-4 sm:px-6 lg:px-10"
      aria-labelledby="home-posts-title"
    >
      <div className="mb-4 flex items-end justify-between pl-1 gap-4">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase theme-text-muted">
            Happening nearby
          </p>
          <h2
            id="home-posts-title"
            className="font-display text-xl font-bold theme-text-primary"
          >
            Local requests
          </h2>
        </div>

        <Link
          to="/explore"
          className="landing-eyebrow inline-flex shrink-0 items-center gap-1 text-sm font-semibold hover:underline lg:hidden"
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
          View All
        </Link>

        <div className="hidden shrink-0 items-center gap-2 lg:flex">
          {posts.length > 3 && (
            <>
              <button
                type="button"
                onClick={() => scroll(-1)}
                aria-label="Previous requests"
                title="Previous requests"
                className="theme-btn-accent-soft flex h-9 w-9 items-center justify-center rounded-lg border theme-divider transition"
              >
                <ChevronLeft className="h-4 w-4" aria-hidden="true" />
              </button>
              <button
                type="button"
                onClick={() => scroll(1)}
                aria-label="Next requests"
                title="Next requests"
                className="theme-btn-accent-soft flex h-9 w-9 items-center justify-center rounded-lg border theme-divider transition"
              >
                <ChevronRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </>
          )}
          {posts.length >= 3 && (
            <button
              type="button"
              onClick={onExplore}
              className="theme-btn-accent inline-flex h-9 items-center gap-1.5 rounded-lg px-3 text-xs font-semibold transition"
            >
              Explore more
            </button>
          )}
        </div>
      </div>

      {posts.length === 0 ? (
        <div className="flex flex-wrap items-center justify-between gap-4 py-6">
          <p className="text-sm theme-text-muted">
            No live requests right now. Explore to see what is happening nearby.
          </p>
          <button
            type="button"
            onClick={onExplore}
            className="theme-btn-accent inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition"
          >
            View all requests
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <>
          <div className="hidden lg:flex lg:gap-3">
            <div
              ref={trackRef}
              className="flex min-w-0 snap-x snap-mandatory gap-3 overflow-x-auto scrollbar-hide"
              aria-label="Latest local requests"
            >
              {posts.map((post) => (
                <div
                  key={post.id ?? post._id}
                  data-post-card
                  className="w-76 shrink-0 snap-start"
                >
                  <PostGridCard
                    post={post}
                    compact
                    onSelect={() => onSelectPost(post.id ?? post._id)}
                  />
                </div>
              ))}
            </div>

            {posts.length < 3 && (
              <div className="flex min-w-0 flex-1 items-center justify-center border-l theme-divider px-6 text-center sm:px-10">
                <div className="max-w-sm">
                  <Compass
                    className="mx-auto mb-3 h-7 w-7 landing-eyebrow"
                    aria-hidden="true"
                  />
                  <p className="mb-1 text-[10px] font-bold uppercase tracking-wider landing-eyebrow">
                    Looking for more?
                  </p>
                  <h3 className="font-display text-lg font-bold theme-text-primary">
                    Explore all local requests
                  </h3>
                  <p className="mt-2 text-sm leading-6 theme-text-muted">
                    Browse every request from your community.
                  </p>
                  <button
                    type="button"
                    onClick={onExplore}
                    className="theme-btn-accent mt-4 inline-flex h-10 items-center gap-2 rounded-lg px-4 text-sm font-semibold transition"
                  >
                    View all requests
                    <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="lg:hidden">
            <Swiper
              spaceBetween={12}
              slidesPerView={1}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
                setActiveSlide(swiper.realIndex);
              }}
              onSlideChange={(swiper) => setActiveSlide(swiper.realIndex)}
              className="home-posts-swiper"
            >
              {posts.map((post) => (
                <SwiperSlide key={post.id ?? post._id} className="h-auto">
                  <PostGridCard
                    post={post}
                    compact
                    onSelect={() => onSelectPost(post.id ?? post._id)}
                  />
                </SwiperSlide>
              ))}
            </Swiper>

            {posts.length > 1 && (
              <div className="mt-4 flex items-center justify-center gap-1.5" role="group" aria-label="Choose a request">
                {posts.map((post, index) => (
                  <button
                    key={post.id ?? post._id}
                    type="button"
                    onClick={() => swiperRef.current?.slideTo(index)}
                    aria-label={`Show request ${index + 1}`}
                    aria-current={activeSlide === index ? "true" : undefined}
                    className={`h-2 rounded-full transition-all ${
                      activeSlide === index
                        ? "w-5 bg-(--app-red)"
                        : "w-2 bg-zinc-500/60"
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </section>
  );
}

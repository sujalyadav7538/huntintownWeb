import {
  ShieldCheck,
  Award,
  Star,
  Zap,
  ShieldAlert,
  UserCheck,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const TRUST_FEATURES = [
  {
    icon: ShieldCheck,
    title: "Trust Score",
    accent: "trust-icon-emerald",
    bullets: [
      "Reviews and completed work shape your score",
      "Response behaviour, reliability and participation also contribute",
    ],
  },
  {
    icon: Award,
    title: "Achievement Badges",
    accent: "trust-icon-amber",
    bullets: [
      "Earn badges by consistently helping the community",
      "High-quality interactions count toward progress",
    ],
  },
  {
    icon: Star,
    title: "Verified Reviews",
    accent: "trust-icon-sky",
    bullets: [
      "Only genuine collaborations contribute to your reputation",
      "Verified experiences make reviews more trustworthy",
    ],
  },
  {
    icon: Zap,
    title: "Response Insights",
    accent: "trust-icon-cyan",
    bullets: [
      "Quick responses build confidence",
      "Help others choose reliable collaborators",
    ],
  },
  {
    icon: ShieldAlert,
    title: "Community Accountability",
    accent: "trust-icon-red",
    bullets: [
      "Repeated policy violations can reduce credibility",
      "Poor conduct affects community trust over time",
    ],
  },
  {
    icon: UserCheck,
    title: "Profile Strength",
    accent: "trust-icon-orange",
    bullets: [
      "Complete profiles help other members get to know you",
      "Verified information supports confident collaboration",
    ],
  },
];

export default function TrustSystem() {
  return (
    <section id="trust-system" className="scroll-mt-20 py-8 sm:py-12">
      <div>
        <div className="mx-auto mb-6 max-w-3xl text-center sm:mb-12">
          <p className="landing-eyebrow text-sm font-semibold uppercase tracking-[0.2em]">
            TRUST ECOSYSTEM
          </p>

          <h2 className="theme-text-primary mt-4 text-3xl font-black sm:text-4xl">
            Reputation That Is
            <span className="landing-eyebrow"> Earned</span>,
            Not Claimed
          </h2>

          <p className="theme-text-muted mt-3 text-sm leading-6 sm:mt-5 sm:text-base sm:leading-8">
            Every interaction contributes to your reputation. HuntInTown
            combines multiple trust signals to help community members make
            informed decisions.
          </p>
        </div>

        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1.12}
            pagination={{ clickable: true }}
            className="home-feature-carousel pb-2"
          >
            {TRUST_FEATURES.map((item) => {
              const Icon = item.icon;

              return (
                <SwiperSlide key={item.title}>
                  <TrustCardMobile item={item} Icon={Icon} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <div className="hidden lg:block">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              1280: { slidesPerView: 3 },
            }}
            className="home-feature-carousel trust-system-desktop-swiper px-1 pt-2 pb-2"
          >
            {TRUST_FEATURES.map((item, index) => {
              const Icon = item.icon;

              return (
                <SwiperSlide key={item.title}>
                  <TrustCardDesktop
                    item={item}
                    index={index}
                    Icon={Icon}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

function TrustCardMobile({
  item,
  Icon,
}: {
  item: {
    title: string;
    bullets: string[];
    accent: string;
  };
  Icon: React.ElementType;
}) {
  return (
    <article className="home-feature-card landing-card rounded-2xl p-5 sm:p-7">
      <div className="mb-3 flex items-center gap-3 sm:mb-5 sm:gap-4">
        <div className="landing-icon-box flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14">
          <Icon
            className={`h-5 w-5 sm:h-7 sm:w-7 ${item.accent}`}
            aria-hidden="true"
          />
        </div>

        <h3 className="theme-text-primary text-base font-bold sm:text-xl">
          {item.title}
        </h3>
      </div>

      <ul className="theme-text-muted list-disc space-y-1 pl-5 text-sm leading-6 sm:leading-7">
        {item.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}

function TrustCardDesktop({
  item,
  index,
  Icon,
}: {
  item: {
    title: string;
    bullets: string[];
    accent: string;
  };
  index: number;
  Icon: React.ElementType;
}) {
  return (
    <article className="home-feature-card landing-card rounded-2xl p-5 sm:p-6">
      <div className="flex items-center justify-between">
        <p className="landing-eyebrow font-mono text-sm font-semibold uppercase tracking-wider">
          Signal {String(index + 1).padStart(2, "0")}
        </p>
        <div className="landing-icon-box flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon
            className={`h-6 w-6 ${item.accent}`}
            aria-hidden="true"
          />
        </div>
      </div>

      <h3 className="theme-text-primary mt-4 text-xl font-bold">
        {item.title}
      </h3>

      <ul className="theme-text-muted mt-4 list-disc space-y-1 pl-5 text-sm leading-5">
        {item.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}
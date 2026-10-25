import {
  FileText,
  Handshake,
  CheckCircle2,
  MessageCircle,
  Star,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const STEPS = [
  {
    icon: FileText,
    title: "Post a Requirement",
    accent: "home-icon-cyan",
    bullets: [
      "Describe what you need",
      "Set your budget, location and timeline",
    ],
  },
  {
    icon: Handshake,
    title: "Receive Offers",
    accent: "home-icon-amber",
    bullets: [
      "Nearby helpers submit offers",
      "Each offer explains how they can help",
    ],
  },
  {
    icon: CheckCircle2,
    title: "Choose a Helper",
    accent: "home-icon-sky",
    bullets: [
      "Compare trust scores, badges and ratings",
      "Review helper profiles before accepting",
    ],
  },
  {
    icon: MessageCircle,
    title: "Chat Securely",
    accent: "home-icon-emerald",
    bullets: [
      "A private chat opens after accepting an offer",
      "Discuss the work directly with your helper",
    ],
  },
  {
    icon: Star,
    title: "Complete & Review",
    accent: "home-icon-red",
    bullets: [
      "Finish the agreed work",
      "Leave an honest review to build community trust",
    ],
  },
];

export default function HowItWorks() {
  return (
    <section className="py-8 sm:py-12">
      <div>
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <p className="landing-eyebrow uppercase tracking-[0.2em] text-sm font-semibold">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-black theme-text-primary">
            From Requirement
            <span className="landing-eyebrow"> to Completion</span>
          </h2>

          <p className="mt-3 sm:mt-5 text-sm sm:text-base theme-text-muted leading-6 sm:leading-relaxed">
            A simple workflow designed to help local communities connect,
            collaborate and build trust.
          </p>
        </div>


        {/* Mobile carousel */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1.12}
            pagination={{
              clickable: true,
            }}
            className="home-feature-carousel pb-2"
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <SwiperSlide key={step.title}>
                  <StepCardMobile
                    step={step}
                    index={index}
                    Icon={Icon}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>


        {/* Desktop carousel */}
        <div className="hidden lg:block">
          <Swiper
            modules={[Pagination]}
            pagination={{ clickable: true }}
            spaceBetween={24}
            slidesPerView={2}
            breakpoints={{
              1280: { slidesPerView: 3 },
            }}
            className="home-feature-carousel how-it-works-desktop-swiper px-1 pt-2 pb-2"
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <SwiperSlide key={step.title}>
                  <StepCardDesktop
                    step={step}
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


function StepCardMobile({
  step,
  index,
  Icon,
}: {
  step: {
    title: string;
    accent: string;
    bullets: string[];
  };
  index: number;
  Icon: React.ElementType;
}) {
  return (
    <div
      className="
        home-feature-card
        rounded-2xl
        landing-card
        p-5 sm:p-7
      "
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="landing-icon-box flex h-11 w-11 shrink-0 items-center justify-center rounded-xl sm:h-14 sm:w-14">
          <Icon className={`h-5 w-5 sm:h-7 sm:w-7 ${step.accent}`} />
        </div>

        <div className="min-w-0">
          <p className="text-[10px] font-bold uppercase tracking-wider landing-eyebrow">
            Step {index + 1}
          </p>
          <h3 className="text-base font-bold leading-tight theme-text-primary">
            {step.title}
          </h3>
        </div>
      </div>

      <ul className="list-disc space-y-1 pl-5 text-sm leading-6 theme-text-muted sm:leading-7">
        {step.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </div>
  );
}

function StepCardDesktop({
  step,
  index,
  Icon,
}: {
  step: {
    title: string;
    accent: string;
    bullets: string[];
  };
  index: number;
  Icon: React.ElementType;
}) {
  return (
    <article className="home-feature-card rounded-2xl landing-card p-6 sm:p-7">
      <div className="flex items-center justify-between">
        <p className="font-mono text-sm font-semibold uppercase tracking-wider landing-eyebrow">
          Step {String(index + 1).padStart(2, "0")}
        </p>
        <div className="landing-icon-box flex h-12 w-12 items-center justify-center rounded-xl">
          <Icon className={`h-6 w-6 ${step.accent}`} aria-hidden="true" />
        </div>
      </div>

      <h3 className="mt-5 text-xl font-bold theme-text-primary">
        {step.title}
      </h3>

      <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 theme-text-muted">
        {step.bullets.map((bullet) => (
          <li key={bullet}>{bullet}</li>
        ))}
      </ul>
    </article>
  );
}
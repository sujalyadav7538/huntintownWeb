import {
  FileText,
  Handshake,
  CheckCircle2,
  MessageCircle,
  Star,
  ArrowRight,
} from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const STEPS = [
  {
    icon: FileText,
    title: "Post a Requirement",
    description:
      "Describe what you need, set your budget, location and timeline.",
  },
  {
    icon: Handshake,
    title: "Receive Offers",
    description: "Nearby helpers submit offers explaining how they can help.",
  },
  {
    icon: CheckCircle2,
    title: "Choose a Helper",
    description:
      "Compare trust scores, badges, ratings and profiles before accepting.",
  },
  {
    icon: MessageCircle,
    title: "Chat Securely",
    description:
      "A private conversation opens automatically after accepting an offer.",
  },
  {
    icon: Star,
    title: "Complete & Review",
    description:
      "Finish the work and leave honest reviews to strengthen the community.",
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


        {/* Mobile Swiper */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1.12}
            pagination={{
              clickable: true,
            }}
            className="pb-10"
          >
            {STEPS.map((step, index) => {
              const Icon = step.icon;

              return (
                <SwiperSlide key={step.title}>
                  <StepCard
                    step={step}
                    index={index}
                    Icon={Icon}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>


        {/* Desktop Layout */}
        <div className="hidden lg:grid lg:grid-cols-5 gap-8">
          {STEPS.map((step, index) => {
            const Icon = step.icon;

            return (
              <div key={step.title} className="relative">
                <StepCard
                  step={step}
                  index={index}
                  Icon={Icon}
                />

                {index !== STEPS.length - 1 && (
                  <ArrowRight
                    className="
                      absolute -right-6 top-1/2
                      -translate-y-1/2
                      theme-text-muted
                      w-6 h-6
                    "
                    aria-hidden="true"
                  />
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}


function StepCard({
  step,
  index,
  Icon,
}: {
  step: {
    title: string;
    description: string;
  };
  index: number;
  Icon: React.ElementType;
}) {
  return (
    <div
      className="
        rounded-2xl
        landing-card
        p-5 sm:p-6
        h-full
        group
      "
    >
      <div
        className="
          w-11 h-11 sm:w-14 sm:h-14
          rounded-xl
          theme-btn-accent-soft
          flex items-center justify-center
          mb-4 sm:mb-6
        "
      >
        <Icon className="w-5 h-5 sm:w-7 sm:h-7" />
      </div>

      <div className="flex items-center gap-3 mb-2 sm:mb-3">
        <div
          className="
            w-6 h-6 sm:w-7 sm:h-7 rounded-full
            theme-badge-accent
            text-xs font-bold
            flex items-center justify-center
          "
        >
          {index + 1}
        </div>

        <h3 className="text-base sm:text-lg font-bold theme-text-primary">
          {step.title}
        </h3>
      </div>

      <p className="text-sm leading-6 sm:leading-7 theme-text-muted">
        {step.description}
      </p>
    </div>
  );
}
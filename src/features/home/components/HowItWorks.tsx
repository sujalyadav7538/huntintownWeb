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
    <section className="py-12">
      <div>
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="text-[#FF3F3F] uppercase tracking-[0.2em] text-sm font-semibold">
            HOW IT WORKS
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            From Requirement
            <span className="text-[#FF3F3F]"> to Completion</span>
          </h2>

          <p className="mt-5 text-zinc-400 leading-relaxed">
            A simple workflow designed to help local communities connect,
            collaborate and build trust.
          </p>
        </div>


        {/* Mobile Swiper */}
        <div className="block lg:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
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
                      text-zinc-700
                      w-6 h-6
                    "
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
        border border-zinc-800
        bg-zinc-900/40
        backdrop-blur-sm
        p-6
        h-full
        group
        hover:border-[#FF3F3F]/50
        transition
      "
    >
      <div
        className="
          w-14 h-14
          rounded-xl
          bg-[#FF3F3F]/10
          flex items-center justify-center
          mb-6
          group-hover:bg-[#FF3F3F]/20
          transition
        "
      >
        <Icon className="w-7 h-7 text-[#FF3F3F]" />
      </div>

      <div className="flex items-center gap-3 mb-3">
        <div
          className="
            w-7 h-7 rounded-full
            bg-[#FF3F3F]
            text-white
            text-xs font-bold
            flex items-center justify-center
          "
        >
          {index + 1}
        </div>

        <h3 className="text-lg font-bold text-white">
          {step.title}
        </h3>
      </div>

      <p className="text-sm leading-7 text-zinc-400">
        {step.description}
      </p>
    </div>
  );
}
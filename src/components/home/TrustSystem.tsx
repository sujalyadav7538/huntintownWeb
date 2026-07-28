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
    accent: "text-emerald-400",
    description:
      "A dynamic score calculated from reviews, completed work, response behaviour, reliability and overall participation.",
  },
  {
    icon: Award,
    title: "Achievement Badges",
    accent: "text-amber-400",
    description:
      "Unlock badges by consistently helping the community and maintaining high-quality interactions.",
  },
  {
    icon: Star,
    title: "Verified Reviews",
    accent: "text-yellow-400",
    description:
      "Only genuine collaborations contribute to your reputation, making reviews more trustworthy.",
  },
  {
    icon: Zap,
    title: "Response Insights",
    accent: "text-sky-400",
    description:
      "Quick responses help build confidence and make it easier for others to choose reliable collaborators.",
  },
  {
    icon: ShieldAlert,
    title: "Community Accountability",
    accent: "text-[#FF3F3F]",
    description:
      "Repeated policy violations and poor conduct can reduce community credibility over time.",
  },
  {
    icon: UserCheck,
    title: "Profile Strength",
    accent: "text-violet-400",
    description:
      "Complete profiles with verified information help other members collaborate with confidence.",
  },
];

export default function TrustSystem() {
  return (
    <section className="py-12">
      <div className="">

        <div className="max-w-3xl mx-auto text-center mb-16">
          <p className="uppercase tracking-[0.2em] text-[#FF3F3F] font-semibold text-sm">
            TRUST ECOSYSTEM
          </p>

          <h2 className="mt-4 text-4xl font-black text-white">
            Reputation That Is
            <span className="text-[#FF3F3F]"> Earned</span>,
            Not Claimed
          </h2>

          <p className="mt-5 text-zinc-400 leading-8">
            Every interaction contributes to your reputation.
            HuntInTown combines multiple trust signals to help
            community members make informed decisions.
          </p>
        </div>


        {/* Mobile Swiper */}
        <div className="block xl:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            className="pb-10"
          >
            {TRUST_FEATURES.map((item) => {
              const Icon = item.icon;

              return (
                <SwiperSlide key={item.title}>
                  <TrustCard item={item} Icon={Icon} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>


        {/* Desktop Grid */}
        <div className="hidden xl:grid xl:grid-cols-3 gap-6">
          {TRUST_FEATURES.map((item) => {
            const Icon = item.icon;

            return (
              <TrustCard
                key={item.title}
                item={item}
                Icon={Icon}
              />
            );
          })}
        </div>

      </div>
    </section>
  );
}


function TrustCard({
  item,
  Icon,
}: {
  item: {
    title: string;
    description: string;
    accent: string;
  };
  Icon: React.ElementType;
}) {
  return (
    <div
      className="
        group
        h-full
        rounded-2xl
        border border-zinc-800
        bg-zinc-900/40
        backdrop-blur-sm
        p-7
        hover:border-[#FF3F3F]/40
        transition-all
        duration-300
        hover:-translate-y-1
      "
    >
      <div className="flex items-center gap-4 mb-5">
        <div
          className="
            w-14 h-14
            rounded-xl
            bg-zinc-950
            flex items-center justify-center
            border border-zinc-800
          "
        >
          <Icon className={`w-7 h-7 ${item.accent}`} />
        </div>

        <h3 className="text-xl font-bold text-white">
          {item.title}
        </h3>
      </div>

      <p className="text-zinc-400 leading-7 text-sm">
        {item.description}
      </p>
    </div>
  );
}
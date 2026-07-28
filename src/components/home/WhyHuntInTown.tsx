import { BadgeCheck, MessageCircleMore, Wallet, Users } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const FEATURES = [
  {
    icon: BadgeCheck,
    title: "Transparent Trust",
    description:
      "Profiles include reviews, trust scores, badges and response metrics so you can make informed decisions.",
  },
  {
    icon: MessageCircleMore,
    title: "Direct Conversations",
    description:
      "Connect directly with selected helpers through secure in-app conversations after an offer is accepted.",
  },
  {
    icon: Wallet,
    title: "Zero Commission",
    description:
      "HuntInTown never takes a percentage from your agreed payment. You decide the price together.",
  },
  {
    icon: Users,
    title: "Built for Communities",
    description:
      "Find reliable people nearby for everyday tasks, services and local collaborations.",
  },
];

export default function WhyHuntInTown() {
  return (
    <section className="">
      <div className="">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <p className="text-[#FF3F3F] font-semibold uppercase tracking-[0.2em] text-sm">
            WHY HUNTINTOWN
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Built Around Trust,
            <span className="text-[#FF3F3F]"> Not Transactions</span>
          </h2>

          <p className="mt-5 text-zinc-400 leading-relaxed">
            HuntInTown helps neighbours connect with confidence through
            transparent reputation, direct communication and a community-first
            marketplace.
          </p>
        </div>

        {/* Mobile Swiper */}
        <div className="block md:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={16}
            slidesPerView={1}
            pagination={{
              clickable: true,
            }}
            className="pb-10"
          >
            {FEATURES.map((feature) => {
              const Icon = feature.icon;

              return (
                <SwiperSlide key={feature.title}>
                  <FeatureCard feature={feature} Icon={Icon} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        {/* Desktop Grid */}
        <div className="hidden md:grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <FeatureCard key={feature.title} feature={feature} Icon={Icon} />
            );
          })}
        </div>
      </div>
    </section>
  );
}

function FeatureCard({
  feature,
  Icon,
}: {
  feature: {
    title: string;
    description: string;
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
        transition-all duration-300
        hover:border-[#FF3F3F]/50
      "
    >
      <div
        className="
          mb-6 flex h-14 w-14 items-center justify-center
          rounded-xl bg-[#FF3F3F]/10
          transition
          group-hover:bg-[#FF3F3F]/20
        "
      >
        <Icon className="h-7 w-7 text-[#FF3F3F]" />
      </div>

      <h3 className="mb-3 text-lg font-bold text-white">{feature.title}</h3>

      <p className="text-sm leading-7 text-zinc-400">{feature.description}</p>
    </div>
  );
}

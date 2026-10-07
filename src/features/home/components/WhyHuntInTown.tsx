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
    <section className="py-8 sm:py-12">
      <div className="">
        <div className="text-center max-w-3xl mx-auto mb-6 sm:mb-12">
          <p className="landing-eyebrow font-semibold uppercase tracking-[0.2em] text-sm">
            WHY HUNTINTOWN
          </p>

          <h2 className="mt-3 text-3xl sm:text-4xl font-black theme-text-primary">
            Built Around Trust,
            <span className="landing-eyebrow"> Not Transactions</span>
          </h2>

          <p className="mt-3 sm:mt-5 text-sm sm:text-base theme-text-muted leading-6 sm:leading-relaxed">
            HuntInTown helps neighbours connect with confidence through
            transparent reputation, direct communication and a community-first
            marketplace.
          </p>
        </div>

        {/* Mobile Swiper */}
        <div className="block md:hidden">
          <Swiper
            modules={[Pagination]}
            spaceBetween={12}
            slidesPerView={1.12}
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
        landing-card
        p-5 sm:p-7
      "
    >
      <div
        className="
          mb-4 sm:mb-6 flex h-11 w-11 sm:h-14 sm:w-14 items-center justify-center
          rounded-xl theme-btn-accent-soft
        "
      >
        <Icon className="h-5 w-5 sm:h-7 sm:w-7" />
      </div>

      <h3 className="mb-2 sm:mb-3 text-base sm:text-lg font-bold theme-text-primary">{feature.title}</h3>

      <p className="text-sm leading-6 sm:leading-7 theme-text-muted">{feature.description}</p>
    </div>
  );
}


import { Handshake, Shield, Wallet, ArrowRight } from "lucide-react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

const PRINCIPLES = [
  {
    icon: Wallet,
    title: "Fair Payments",
    color: "text-emerald-400",
    points: [
      "No platform commission",
      "Agree on pricing directly",
      "Payments remain between users",
    ],
  },
  {
    icon: Handshake,
    title: "Respect Commitments",
    color: "text-sky-400",
    points: [
      "Accept offers responsibly",
      "Communicate clearly",
      "Complete agreed work honestly",
    ],
  },
  {
    icon: Shield,
    title: "Stay Safe",
    color: "text-[#FF3F3F]",
    points: [
      "Verify profiles before accepting",
      "Meet in safe public locations when required",
      "Use HuntInTown chat for communication",
    ],
  },
];

export default function CommunityPrinciples() {
  return (
    <section className="py-12">
      <div className="">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <p className="uppercase tracking-[0.2em] text-[#FF3F3F] text-sm font-semibold">
            COMMUNITY FIRST
          </p>

          <h2 className="mt-3 text-4xl font-black text-white">
            Simple Principles.
            <span className="text-[#FF3F3F]"> Strong Community.</span>
          </h2>

          <p className="mt-5 text-zinc-400 leading-8">
            HuntInTown is built on transparency, respect and local trust.
            Every member contributes to creating a safer and more reliable
            community.
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
            {PRINCIPLES.map((item) => {
              const Icon = item.icon;

              return (
                <SwiperSlide key={item.title}>
                  <PrincipleCard item={item} Icon={Icon} />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>


        {/* Desktop Grid */}
        <div className="hidden lg:grid lg:grid-cols-3 gap-8">
          {PRINCIPLES.map((item) => {
            const Icon = item.icon;

            return (
              <PrincipleCard
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


function PrincipleCard({
  item,
  Icon,
}: {
  item: {
    title: string;
    color: string;
    points: string[];
  };
  Icon: React.ElementType;
}) {
  return (
    <div
      className="
        h-full
        rounded-2xl
        border border-zinc-800
        bg-zinc-900/40
        backdrop-blur-sm
        p-8
        hover:border-[#FF3F3F]/40
        transition-all
      "
    >
      <div
        className="
          w-16 h-16
          rounded-xl
          bg-zinc-950
          border border-zinc-800
          flex items-center justify-center
          mb-6
        "
      >
        <Icon className={`w-8 h-8 ${item.color}`} />
      </div>

      <h3 className="text-2xl font-bold text-white mb-6">
        {item.title}
      </h3>

      <div className="space-y-4">
        {item.points.map((point) => (
          <div key={point} className="flex items-start gap-3">
            <ArrowRight className="w-4 h-4 mt-1 text-[#FF3F3F]" />

            <p className="text-zinc-400 text-sm leading-7">
              {point}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
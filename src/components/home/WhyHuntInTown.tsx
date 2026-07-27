import { BadgeCheck, MessageCircleMore, Wallet, Users } from "lucide-react";

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
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-6">
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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group rounded-2xl border border-zinc-800 bg-zinc-900/40 backdrop-blur-sm p-7 hover:border-[#FF3F3F]/50 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-[#FF3F3F]/10 flex items-center justify-center mb-6 group-hover:bg-[#FF3F3F]/20 transition">
                  <Icon className="w-7 h-7 text-[#FF3F3F]" />
                </div>

                <h3 className="text-lg font-bold text-white mb-3">
                  {feature.title}
                </h3>

                <p className="text-sm leading-7 text-zinc-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

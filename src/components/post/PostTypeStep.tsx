import { HandHelping, LifeBuoy } from "lucide-react";

interface PostTypeStepProps {
  value: "need" | "offer";
  onChange: (value: "need" | "offer") => void;
}

const OPTIONS = [
  {
    value: "need" as const,
    title: "I Need Help",
    description: "Post a requirement and let people offer their help.",
    icon: LifeBuoy,
  },
  {
    value: "offer" as const,
    title: "I Can Help",
    description: "Offer your skills, service, or time to someone who needs it.",
    icon: HandHelping,
  },
];

export default function PostTypeStep({ value, onChange }: PostTypeStepProps) {
  return (
    <section className="w-full">
      <div className="mb-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600">
          Step 01
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          What are you looking for?
        </h2>

        <p className="mt-1 text-xs leading-relaxed text-zinc-600">
          Choose how you want to use HuntInTown.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {OPTIONS.map((option) => {
          const Icon = option.icon;
          const selected = value === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => onChange(option.value)}
              className={`group relative rounded-2xl border p-5 text-left transition-all duration-200 ${
                selected
                  ? "border-[#FF3F3F]/40 bg-[#FF3F3F]/[0.06] shadow-[0_0_30px_rgba(255,63,63,0.06)]"
                  : "border-white/[0.06] bg-white/[0.018] hover:border-white/[0.12] hover:bg-white/[0.03]"
              }`}
            >
              {/* Selection indicator */}
              <div
                className={`absolute right-4 top-4 h-4 w-4 rounded-full border transition-all ${
                  selected
                    ? "border-[#FF3F3F] bg-[#FF3F3F]"
                    : "border-zinc-700 bg-transparent group-hover:border-zinc-500"
                }`}
              >
                {selected && (
                  <div className="absolute inset-[3px] rounded-full bg-white" />
                )}
              </div>

              {/* Icon */}
              <div
                className={`flex h-10 w-10 items-center justify-center rounded-xl border transition-colors ${
                  selected
                    ? "border-[#FF3F3F]/20 bg-[#FF3F3F]/10 text-[#FF5555]"
                    : "border-white/[0.06] bg-white/[0.025] text-zinc-500 group-hover:text-zinc-300"
                }`}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>

              <h3
                className={`mt-5 text-sm font-semibold ${
                  selected ? "text-zinc-100" : "text-zinc-300"
                }`}
              >
                {option.title}
              </h3>

              <p className="mt-1.5 max-w-[260px] text-[11px] leading-relaxed text-zinc-600">
                {option.description}
              </p>

              {/* Bottom accent */}
              <div
                className={`mt-5 h-px w-8 transition-all ${
                  selected
                    ? "w-12 bg-[#FF3F3F]"
                    : "bg-zinc-800 group-hover:w-10"
                }`}
              />
            </button>
          );
        })}
      </div>
    </section>
  );
}

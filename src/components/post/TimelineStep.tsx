import { CalendarClock, Clock3 } from "lucide-react";

interface TimelineStepProps {
  value: string;
  onChange: (value: string) => void;
}

const OPTIONS = [
  "Today",
  "Within a few days",
  "Within a week",
  "Within a month",
  "Flexible",
];

export default function TimelineStep({
  value,
  onChange,
}: TimelineStepProps) {
  return (
    <section className="space-y-5">
      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-zinc-500">
          Timeline
        </p>

        <h2 className="mt-1.5 text-xl font-semibold tracking-tight text-zinc-100">
          When do you need this?
        </h2>

        <p className="mt-1 text-[11px] leading-relaxed text-zinc-600">
          Let people know how soon you need help.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3">
        {OPTIONS.map((option, index) => {
          const selected = value === option;

          return (
            <button
              key={option}
              type="button"
              onClick={() => onChange(option)}
              className={`
                rounded-xl border px-3.5 py-3.5 text-left
                transition-all
                ${
                  selected
                    ? "border-amber-500/30 bg-amber-500/[0.07]"
                    : "border-white/[0.06] bg-white/[0.018] hover:border-white/[0.12] hover:bg-white/[0.03]"
                }
              `}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-lg ${
                  selected
                    ? "bg-amber-500/10 text-amber-400"
                    : "bg-white/[0.035] text-zinc-600"
                }`}
              >
                {index === 0 ? (
                  <Clock3 className="h-4 w-4" />
                ) : (
                  <CalendarClock className="h-4 w-4" />
                )}
              </div>

              <p
                className={`mt-3 text-[10px] font-semibold ${
                  selected ? "text-zinc-100" : "text-zinc-400"
                }`}
              >
                {option}
              </p>
            </button>
          );
        })}
      </div>
    </section>
  );
}